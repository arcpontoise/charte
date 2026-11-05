"""Generate css/tokens.css from tokens.yaml.

Usage:
    python scripts/build_tokens.py           # write css/tokens.css
    python scripts/build_tokens.py --check   # fail if css/tokens.css is out of date
"""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "tokens.yaml"
TARGET = ROOT / "css" / "tokens.css"

# Allowed sections; token names must be unique across all of them
SECTIONS = ("colors", "typography", "sizes")
VALID_NAME = re.compile(r"^[a-z][a-z0-9-]*$")
HEADER = (
    "/*\n"
    " * Charte graphique — Compagnie d'archers de Pontoise\n"
    " * GENERATED FILE: edit tokens.yaml then run scripts/build_tokens.py\n"
    " */\n"
)


def load(source: Path) -> dict[str, dict[str, str]]:
    """Load and validate the token file."""
    data = yaml.safe_load(source.read_text(encoding="utf-8"))
    if not isinstance(data, dict):
        raise ValueError(f"{source}: expected a mapping at top level")
    seen: set[str] = set()
    for section, tokens in data.items():
        if section not in SECTIONS:
            raise ValueError(f"{source}: unknown section {section!r}")
        if not isinstance(tokens, dict):
            raise ValueError(f"{source}: section {section!r} must be a mapping")
        for name, value in tokens.items():
            if not VALID_NAME.match(str(name)):
                raise ValueError(f"{source}: invalid token name {name!r}")
            if name in seen:
                raise ValueError(f"{source}: duplicate token {name!r}")
            if not isinstance(value, str) or not value:
                raise ValueError(f"{source}: token {name!r} must be a non-empty string")
            seen.add(name)
    return data


def render(data: dict[str, dict[str, str]]) -> str:
    """Render the CSS custom properties."""
    lines = [HEADER, ":root {"]
    for index, (section, tokens) in enumerate(data.items()):
        if index:
            lines.append("")
        lines.append(f"  /* {section} */")
        for name, value in tokens.items():
            lines.append(f"  --{name}: {value};")
    lines.append("}")
    return "\n".join(lines) + "\n"


def main() -> int:
    """Entry point."""
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--check", action="store_true", help="only verify the generated file")
    args = parser.parse_args()

    expected = render(load(SOURCE))
    if args.check:
        current = TARGET.read_text(encoding="utf-8") if TARGET.exists() else ""
        if current != expected:
            print(f"{TARGET.relative_to(ROOT)} is out of date, run scripts/build_tokens.py")
            return 1
        return 0

    TARGET.write_text(expected, encoding="utf-8")
    print(f"{TARGET.relative_to(ROOT)} written")
    return 0


if __name__ == "__main__":
    sys.exit(main())
