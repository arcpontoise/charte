// Shared navigation menu of the club's sites, rendered from ARC_MENU (menu.yaml).
//
// Usage: <arc-menu actuel="competitions">fallback links</arc-menu>
// Optional site="https://arcpontoise.github.io": links to the main site
// (MAIN_SITE) point to that address instead, keeping their path. A copy of
// the main site published elsewhere (preview before the DNS switch) thus
// keeps its visitors on it.
// The markup is the same as the server-side rendering done by drop (see the
// README): dropdowns are native <details> elements sharing a name, so they
// open, close and stay exclusive without JavaScript. This script only adds
// the mobile "Menu" toggle and closes menus on outside click or Escape.
// Built with DOM APIs and textContent only: no HTML string is ever parsed.

const MOBILE_QUERY = "(max-width: 1200px)";
const MAIN_SITE = "https://arcpontoise.fr";
let navCount = 0;

function el(tag, attributes = {}, children = []) {
  const node = document.createElement(tag);
  for (const [name, value] of Object.entries(attributes)) {
    if (value !== null && value !== undefined) {
      node.setAttribute(name, value);
    }
  }
  node.append(...children);
  return node;
}

// Base address given by the site attribute, or null when absent or invalid
function siteBase(value) {
  if (!value) {
    return null;
  }
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.origin + url.pathname.replace(/\/$/, "") : null;
  } catch {
    return null;
  }
}

function localLink(href, base) {
  const onMainSite = href === MAIN_SITE || href.startsWith(`${MAIN_SITE}/`);
  if (!base || !onMainSite) {
    return href;
  }
  return base + (href.slice(MAIN_SITE.length) || "/");
}

function buildEntry(entry, current, groupName, base) {
  const isCurrent = entry.id === current;
  const item = el("li", { class: isCurrent ? "menu-entree menu-actuel" : "menu-entree" });
  const currentAttr = isCurrent ? "true" : null;

  if (!entry.liens) {
    const linkClass = entry.style === "bouton" ? "menu-contact" : "menu-lien";
    item.append(el("a", { class: linkClass, href: localLink(entry.lien, base), "aria-current": currentAttr }, [entry.libelle]));
    return item;
  }

  const links = entry.liens.map((link) => {
    const parts = [el("span", { class: "menu-titre" }, [link.libelle])];
    if (link.description) {
      parts.push(el("span", { class: "menu-desc" }, [link.description]));
    }
    return el("li", {}, [el("a", { class: "menu-item", href: localLink(link.lien, base) }, parts)]);
  });
  const panel = el("div", { class: "menu-panneau" });
  if (entry.origine) {
    panel.append(el("p", { class: "menu-origine" }, [entry.origine]));
  }
  panel.append(el("ul", {}, links));
  item.append(
    el("details", { class: "menu-groupe", name: groupName }, [
      el("summary", { class: "menu-lien", "aria-current": currentAttr }, [entry.libelle]),
      panel,
    ]),
  );
  return item;
}

function setMobileOpen(nav, open) {
  const button = nav.querySelector(".menu-bouton");
  button.setAttribute("aria-expanded", String(open));
  button.textContent = open ? "Fermer" : "Menu";
  nav.toggleAttribute("data-ouvert", open);
}

function closeGroups(nav) {
  for (const group of nav.querySelectorAll("details[open]")) {
    group.open = false;
  }
}

function buildNav(menu, current, base) {
  navCount += 1;
  const listId = `menu-global-${navCount}`;
  const groupName = `menu-global-${navCount}`;
  const list = el(
    "ul",
    { class: "menu-liste", id: listId },
    menu.entrees.map((entry) => buildEntry(entry, current, groupName, base)),
  );
  const button = el(
    "button",
    { type: "button", class: "menu-bouton", "aria-expanded": "false", "aria-controls": listId },
    ["Menu"],
  );
  const nav = el("nav", { class: "menu-global", "aria-label": menu.libelle, "data-js": "" }, [
    button,
    list,
  ]);

  button.addEventListener("click", () => {
    setMobileOpen(nav, button.getAttribute("aria-expanded") !== "true");
  });
  nav.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") {
      return;
    }
    const group = event.target.closest("details[open]");
    if (group) {
      group.open = false;
      group.querySelector("summary").focus();
    } else if (nav.hasAttribute("data-ouvert")) {
      setMobileOpen(nav, false);
      button.focus();
    }
  });
  return nav;
}

// Clicking anywhere outside a menu closes its dropdowns and its mobile panel
document.addEventListener("click", (event) => {
  for (const nav of document.querySelectorAll(".menu-global[data-js]")) {
    if (!nav.contains(event.target)) {
      closeGroups(nav);
      if (nav.hasAttribute("data-ouvert")) {
        setMobileOpen(nav, false);
      }
    }
  }
});

// Back to the desktop layout: never leave the mobile panel open behind it
window.matchMedia(MOBILE_QUERY).addEventListener("change", (event) => {
  if (!event.matches) {
    for (const nav of document.querySelectorAll(".menu-global[data-ouvert]")) {
      setMobileOpen(nav, false);
    }
  }
});

class ArcMenu extends HTMLElement {
  connectedCallback() {
    if (this.querySelector(":scope > .menu-global")) {
      return;
    }
    const base = siteBase(this.getAttribute("site"));
    this.replaceChildren(buildNav(ARC_MENU, this.getAttribute("actuel") || "", base));
  }
}

if (!customElements.get("arc-menu")) {
  customElements.define("arc-menu", ArcMenu);
}
