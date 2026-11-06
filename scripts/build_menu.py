"""Generate js/menu.js and menu.json from menu.yaml.

Usage:
    python scripts/build_menu.py           # write the generated files
    python scripts/build_menu.py --check   # fail if they are out of date
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "menu.yaml"
COMPONENT = ROOT / "src" / "arc-menu.js"
TARGET_JS = ROOT / "js" / "menu.js"
TARGET_JSON = ROOT / "menu.json"

VALID_ID = re.compile(r"^[a-z][a-z0-9-]*$")
STYLES = {"bouton"}
JS_HEADER = (
    "/*\n"
    " * Menu commun - Compagnie d'archers de Pontoise\n"
    " * GENERATED FILE: edit menu.yaml or src/arc-menu.js,"
    " then run scripts/build_menu.py\n"
    " */\n"
)


class MenuError(ValueError):
    """Invalid menu.yaml."""


def _text(value: object, where: str) -> str:
    if not isinstance(value, str) or not value.strip():
        raise MenuError(f"{where}: expected a non-empty string")
    return value.strip()


def _url(value: object, where: str) -> str:
    url = _text(value, where)
    if not url.startswith("https://"):
        raise MenuError(f"{where}: links must use https:// ({url})")
    return url


def load(source: Path) -> dict:
    """Load, validate and normalise the menu."""
    data = yaml.safe_load(source.read_text(encoding="utf-8"))
    if not isinstance(data, dict):
        raise MenuError("menu.yaml: expected a mapping")
    entries = data.get("entrees")
    if not isinstance(entries, list) or not entries:
        raise MenuError("menu.yaml: 'entrees' must be a non-empty list")

    menu = {"libelle": _text(data.get("libelle"), "libelle"), "entrees": []}
    seen: set[str] = set()
    for index, raw in enumerate(entries):
        where = f"entrees[{index}]"
        if not isinstance(raw, dict):
            raise MenuError(f"{where}: expected a mapping")
        entry_id = _text(raw.get("id"), f"{where}.id")
        if not VALID_ID.match(entry_id) or entry_id in seen:
            raise MenuError(f"{where}.id: invalid or duplicate id {entry_id!r}")
        seen.add(entry_id)
        entry = {"id": entry_id, "libelle": _text(raw.get("libelle"), f"{where}.libelle")}

        has_link, has_links = "lien" in raw, "liens" in raw
        if has_link == has_links:
            raise MenuError(f"{where}: needs exactly one of 'lien' or 'liens'")
        if has_link:
            entry["lien"] = _url(raw["lien"], f"{where}.lien")
        else:
            links = raw["liens"]
            if not isinstance(links, list) or not links:
                raise MenuError(f"{where}.liens: must be a non-empty list")
            entry["liens"] = []
            for sub_index, link in enumerate(links):
                sub = f"{where}.liens[{sub_index}]"
                if not isinstance(link, dict):
                    raise MenuError(f"{sub}: expected a mapping")
                item = {
                    "libelle": _text(link.get("libelle"), f"{sub}.libelle"),
                    "lien": _url(link.get("lien"), f"{sub}.lien"),
                }
                if "description" in link:
                    item["description"] = _text(link["description"], f"{sub}.description")
                entry["liens"].append(item)
            if "origine" in raw:
                entry["origine"] = _text(raw["origine"], f"{where}.origine")

        if "style" in raw:
            style = _text(raw["style"], f"{where}.style")
            if style not in STYLES or not has_link:
                raise MenuError(f"{where}.style: unknown style or not a direct link")
            entry["style"] = style

        unknown = set(raw) - {"id", "libelle", "lien", "liens", "origine", "style"}
        if unknown:
            raise MenuError(f"{where}: unknown keys {sorted(unknown)}")
        menu["entrees"].append(entry)
    return menu


def render_json(menu: dict) -> str:
    return json.dumps(menu, ensure_ascii=False, indent=2) + "\n"


def render_js(menu: dict, component: str) -> str:
    data = json.dumps(menu, ensure_ascii=False, separators=(",", ":"))
    # "</" can never close a <script> element, even if the file is inlined
    data = data.replace("</", "<\\/")
    return (
        f"{JS_HEADER}(() => {{\n"
        '"use strict";\n'
        f"const ARC_MENU = {data};\n\n"
        f"{component.rstrip()}\n"
        "})();\n"
    )


def main() -> int:
    """Entry point."""
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--check", action="store_true", help="only verify the generated files")
    args = parser.parse_args()

    menu = load(SOURCE)
    outputs = {
        TARGET_JSON: render_json(menu),
        TARGET_JS: render_js(menu, COMPONENT.read_text(encoding="utf-8")),
    }
    if args.check:
        stale = [
            path.relative_to(ROOT)
            for path, content in outputs.items()
            if not path.exists() or path.read_text(encoding="utf-8") != content
        ]
        for path in stale:
            print(f"{path} is out of date, run scripts/build_menu.py")
        return 1 if stale else 0

    for path, content in outputs.items():
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(content, encoding="utf-8")
        print(f"{path.relative_to(ROOT)} written")
    return 0


if __name__ == "__main__":
    sys.exit(main())
