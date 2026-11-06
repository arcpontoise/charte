/*
 * Menu commun - Compagnie d'archers de Pontoise
 * GENERATED FILE: edit menu.yaml or src/arc-menu.js, then run scripts/build_menu.py
 */
(() => {
"use strict";
const ARC_MENU = {"libelle":"Sites de la compagnie","entrees":[{"id":"accueil","libelle":"Accueil","lien":"https://arcpontoise.fr/"},{"id":"compagnie","libelle":"La compagnie","liens":[{"libelle":"Histoire","lien":"https://arcpontoise.fr/histoire/","description":"Les origines et les traditions de la compagnie"},{"libelle":"Les Roy et le bureau","lien":"https://arcpontoise.fr/les-roy-et-le-bureau/","description":"Celles et ceux qui font vivre la compagnie"},{"libelle":"Les encadrants","lien":"https://arcpontoise.fr/team/","description":"L'équipe qui anime les séances"},{"libelle":"Lettre d'information","lien":"https://arcpontoise.fr/newsletter/","description":"Recevoir les nouvelles par courriel"}],"origine":"arcpontoise.fr"},{"id":"pratiquer","libelle":"Pratiquer","liens":[{"libelle":"Tir en salle","lien":"https://arcpontoise.fr/pratiquer/tir-en-salle/","description":"Gymnase Marie Laurencin et salle d'armes"},{"libelle":"Tir extérieur","lien":"https://arcpontoise.fr/pratiquer/tir-exterieur/","description":"Le terrain extérieur"},{"libelle":"Tir Beursault","lien":"https://arcpontoise.fr/pratiquer/tir-beursault/","description":"Le tir traditionnel au jeu d'arc"},{"libelle":"Parcours","lien":"https://arcpontoise.fr/pratiquer/parcours/","description":"Le tir en pleine nature"},{"libelle":"Plan d'accès","lien":"https://arcpontoise.fr/plan-dacces/","description":"Rejoindre nos lieux de pratique"},{"libelle":"Questions fréquentes","lien":"https://arcpontoise.fr/foire-aux-questions/","description":"Les réponses aux questions courantes"}],"origine":"arcpontoise.fr"},{"id":"inscrire","libelle":"S'inscrire","liens":[{"libelle":"Planning des cours","lien":"https://infos.arcpontoise.fr/planning/","description":"Les créneaux de la saison"},{"libelle":"Tarifs","lien":"https://infos.arcpontoise.fr/tarifs/","description":"Licence et cotisation"},{"libelle":"Calculer sa cotisation","lien":"https://infos.arcpontoise.fr/calculateur/","description":"Le montant selon votre situation"},{"libelle":"Plaquette","lien":"https://infos.arcpontoise.fr/plaquette/","description":"La présentation de la compagnie à télécharger"}],"origine":"infos.arcpontoise.fr"},{"id":"competitions","libelle":"Compétitions","liens":[{"libelle":"Calendrier","lien":"https://arcpontoise.fr/calendrier/","description":"Les concours et événements à venir"},{"libelle":"Palmarès","lien":"https://arcpontoise.github.io/palmares/","description":"Les résultats des archers de la compagnie"},{"libelle":"Records","lien":"https://arcpontoise.github.io/palmares/records.html","description":"Les meilleurs scores par discipline"},{"libelle":"Distinctions","lien":"https://arcpontoise.github.io/palmares/distinctions.html","description":"Badges et écussons obtenus"}],"origine":"Palmarès et calendrier"},{"id":"archers","libelle":"Espace archers","liens":[{"libelle":"Déposer vos photos","lien":"https://drop.arcpontoise.fr/","description":"Partager les photos d'un concours ou d'un événement"},{"libelle":"Palmarès national","lien":"https://arcpontoise.fr/palmares-national/","description":"Le classement des archers de la compagnie"}]},{"id":"contact","libelle":"Contact","lien":"https://contact.arcpontoise.fr/","style":"bouton"}]};

// Shared navigation menu of the club's sites, rendered from ARC_MENU (menu.yaml).
//
// Usage: <arc-menu actuel="competitions">fallback links</arc-menu>
// The markup is the same as the server-side rendering done by drop (see the
// README): dropdowns are native <details> elements sharing a name, so they
// open, close and stay exclusive without JavaScript. This script only adds
// the mobile "Menu" toggle and closes menus on outside click or Escape.
// Built with DOM APIs and textContent only: no HTML string is ever parsed.

const MOBILE_QUERY = "(max-width: 1200px)";
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

function buildEntry(entry, current, groupName) {
  const isCurrent = entry.id === current;
  const item = el("li", { class: isCurrent ? "menu-entree menu-actuel" : "menu-entree" });
  const currentAttr = isCurrent ? "true" : null;

  if (!entry.liens) {
    const linkClass = entry.style === "bouton" ? "menu-contact" : "menu-lien";
    item.append(el("a", { class: linkClass, href: entry.lien, "aria-current": currentAttr }, [entry.libelle]));
    return item;
  }

  const links = entry.liens.map((link) => {
    const parts = [el("span", { class: "menu-titre" }, [link.libelle])];
    if (link.description) {
      parts.push(el("span", { class: "menu-desc" }, [link.description]));
    }
    return el("li", {}, [el("a", { class: "menu-item", href: link.lien }, parts)]);
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

function buildNav(menu, current) {
  navCount += 1;
  const listId = `menu-global-${navCount}`;
  const groupName = `menu-global-${navCount}`;
  const list = el(
    "ul",
    { class: "menu-liste", id: listId },
    menu.entrees.map((entry) => buildEntry(entry, current, groupName)),
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
    this.replaceChildren(buildNav(ARC_MENU, this.getAttribute("actuel") || ""));
  }
}

if (!customElements.get("arc-menu")) {
  customElements.define("arc-menu", ArcMenu);
}
})();
