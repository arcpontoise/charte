# Charte graphique — Compagnie d'archers de Pontoise

Couleurs, typographie, logos et styles de base communs aux sites de la
compagnie : la vitrine `arcpontoise.fr`,
[infos](https://github.com/arcpontoise/infos),
[palmares](https://github.com/arcpontoise/palmares) et
[drop](https://github.com/arcpontoise/drop).

La page de démonstration est publiée sur <https://charte.arcpontoise.fr/> à
partir de `index.html`.

## Contenu

| Chemin | Rôle |
| --- | --- |
| `tokens.yaml` | Source unique des couleurs, polices et mesures |
| `css/tokens.css` | Variables CSS **générées** depuis `tokens.yaml`, ne pas modifier à la main |
| `css/charte.css` | Styles de base et composants communs (stylelint `standard`) |
| `fonts/` | Polices Caveat (manuscrite) et Inter (PDF), licences OFL dans `fonts/OFL-*.txt` |
| `img/` | Blason, bandeaux FFTA, label Ambition, décor |
| `index.html` | Page de démonstration (nuancier, composants, menu) |
| `scripts/build_tokens.py` | Génération et vérification de `css/tokens.css` |
| `menu.yaml` | Source unique du menu commun à tous les sites |
| `src/arc-menu.js` | Composant `<arc-menu>` (ESLint) |
| `js/menu.js`, `menu.json` | Menu **généré** depuis `menu.yaml` et `src/arc-menu.js`, ne pas modifier à la main |
| `scripts/build_menu.py` | Validation de `menu.yaml`, génération et vérification de `js/menu.js` et `menu.json` |

## Principes

- Fond blanc cassé `--bg`, texte bleu nuit `--ink`, bandeaux bleu foncé
  `--blue` soulignés d'un filet `--accent`.
- Titres `h1` et `h2` en capitales, accent manuscrit en Caveat (classe
  `.manuscrit`).
- Pages web en police système (`--font-body`). Les PDF générés utilisent
  Inter (`--font-print`), embarquée dans la charte : leur rendu est identique
  quelle que soit la machine de build.
- `--gray-soft` est réservé aux éléments non textuels : son contraste est
  insuffisant pour du texte.
- Les variables CSS et les clés de `tokens.yaml` sont en anglais, les classes
  en français.
- Point de rupture unique à **600 px** pour le contenu (les variables CSS ne
  sont pas utilisables dans les media queries). Seul le menu commun bascule en
  mode mobile sous **1200 px**, largeur sous laquelle ses entrées ne tiennent
  plus sur une ligne à côté de la marque.

## Utilisation dans un autre site

La charte est publiée sur **<https://charte.arcpontoise.fr/>** et chargée
directement par chaque site. Une modification de la charte s'applique ainsi à
tous les sites sans les reconstruire (cache GitHub Pages d'environ 10 minutes).

Charger les deux feuilles dans cet ordre, puis les styles propres au site :

```html
<link rel="stylesheet" href="https://charte.arcpontoise.fr/css/tokens.css">
<link rel="stylesheet" href="https://charte.arcpontoise.fr/css/charte.css">
```

Logos et images sont disponibles de la même façon, par exemple
`https://charte.arcpontoise.fr/img/logo.png`.

Pour un site qui définit une politique CSP, autoriser l'hôte de la charte :

```text
style-src 'self' https://charte.arcpontoise.fr;
font-src 'self' https://charte.arcpontoise.fr;
img-src 'self' https://charte.arcpontoise.fr;
script-src 'self' https://charte.arcpontoise.fr;
```

### Règles de compatibilité

Tous les sites suivant la branche `main` en direct, une modification ne doit
jamais casser un site existant :

- ne jamais renommer ni supprimer une variable ou une classe sans avoir migré
  tous les sites ;
- ajouter plutôt que modifier : nouvelle variable, nouvelle classe, nouvelle
  variante ;
- en cas de rupture inévitable, publier la nouvelle version sous un chemin
  dédié (`/v2/`) et migrer les sites un par un ;
- vérifier la page de démonstration après chaque modification.

La branche `main` est protégée : toute modification passe par une pull request
dont la CI doit être verte.

### Fichiers générés

Les PDF figent la charte au moment de leur génération. Après chaque
déploiement de la charte, le job `rebuild` du workflow relance donc le build
des dépôts qui en produisent, en leur transmettant le commit de la charte
(`charte_ref`). La liste de ces dépôts est la matrice du job `rebuild`.

Ce déclenchement utilise le secret `CHARTE_DISPATCH_TOKEN` : un jeton
*fine-grained* limité aux dépôts cibles, avec la seule permission
**Actions : Read and write**. Penser à le renouveler avant son expiration.

### Sites utilisant la charte

| Site | Dépôt |
| --- | --- |
| `arcpontoise.fr` | [arcpontoise.github.io](https://github.com/arcpontoise/arcpontoise.github.io) |
| `infos.arcpontoise.fr` | [infos](https://github.com/arcpontoise/infos) |
| `arcpontoise.fr/palmares` | [palmares](https://github.com/arcpontoise/palmares) |
| `drop.arcpontoise.fr` | [drop](https://github.com/arcpontoise/drop) |

## Composants disponibles

| Classe | Usage |
| --- | --- |
| `header.site`, `.entete-flex`, `.logo`, `.manuscrit`, `.titre`, `.sous-titre` | Bandeau d'en-tête |
| `arc-menu`, `.menu-global` | Menu commun aux sites (voir ci-dessous) |
| `nav.site` (lien actif via `aria-current`) | Barre de navigation propre au site, pleine largeur sous l'en-tête |
| `.gabarit`, `.gabarit.etroit` | Largeur de contenu (1240 px, 720 px) |
| `footer.site`, `.fil` | Pied de page, fil d'Ariane |
| `.carte`, `.carte.accent` | Bloc de contenu |
| `.chiffres` / `.chiffre` | Indicateurs chiffrés |
| `.tuiles` | Grille de liens |
| `.liste-info` | Bloc d'informations à puces |
| `.table-wrap`, `tr.grand`, `.num` | Tableaux |
| `.formulaire` (sur le conteneur) | Champs, libellés et boutons d'un formulaire |
| `.bouton`, `.secondaire` | Bouton ou lien isolé |
| `.discret`, `.succes`, `.attention`, `.erreur` | Messages |
| `.medaille-or`, `.medaille-argent`, `.medaille-bronze` | Podiums |

## Menu commun

Tous les sites affichent le même menu, décrit une seule fois dans `menu.yaml`.
Chaque entrée a un identifiant et soit un lien direct (`lien`), soit une liste
de liens (`liens`) présentée en menu déroulant. `scripts/build_menu.py` valide
le fichier (identifiants uniques, liens en `https://` uniquement, aucune clé
inconnue) et génère :

- `js/menu.js`, le composant `<arc-menu>` pour les sites statiques ;
- `menu.json`, les mêmes données pour les sites rendus côté serveur.

Comme les feuilles de style, ces fichiers sont chargés en direct : une
modification du menu apparaît sur tous les sites sans les reconstruire.

| Identifiant | Entrée |
| --- | --- |
| `accueil` | Accueil |
| `compagnie` | La compagnie |
| `pratiquer` | Pratiquer |
| `inscrire` | S'inscrire |
| `competitions` | Compétitions |
| `archers` | Espace archers |
| `contact` | Contact (bouton) |

### Sites statiques

Placer le composant dans l'en-tête, à côté de la marque. L'attribut `actuel`
reçoit l'identifiant de l'entrée à mettre en évidence. Les liens contenus dans
l'élément servent de repli tant que le script n'est pas chargé :

```html
<script src="https://charte.arcpontoise.fr/js/menu.js" defer></script>

<header class="site">
  <div class="gabarit entete-flex">
    <div><!-- logo, titre --></div>
    <arc-menu actuel="competitions">
      <a href="https://arcpontoise.fr/">Accueil</a>
      <a href="https://contact.arcpontoise.fr/">Contact</a>
    </arc-menu>
  </div>
</header>
<nav class="site"><!-- navigation propre au site --></nav>
```

Les menus déroulants sont des éléments `<details>` natifs portant le même
attribut `name` : ils s'ouvrent, se ferment et restent exclusifs sans
JavaScript. Le script ajoute seulement le bouton « Menu » du mode mobile et la
fermeture par la touche Échap ou par un clic à l'extérieur.

L'attribut facultatif `site` reçoit l'adresse où le site vitrine est
réellement publié. Les liens du menu vers `https://arcpontoise.fr` pointent
alors vers cette adresse, chemin conservé. Ainsi, la vitrine publiée sur
`https://arcpontoise.github.io` garde ses visiteurs tant que le domaine
`arcpontoise.fr` sert encore l'ancien site :

```html
<arc-menu actuel="compagnie" site="https://arcpontoise.github.io">
```

Seules les adresses en `https://` sont acceptées, plus `http://localhost` et
`http://127.0.0.1` pour un essai en local. Les autres sites (infos, palmarès,
drop) ne le renseignent pas : leurs liens
mènent à `arcpontoise.fr`. Une fois le domaine basculé, l'attribut devient
sans effet.

### Sites rendus côté serveur

drop et le formulaire de contact lisent `menu.json` (avec un cache et une
copie de secours) et produisent le même balisage, sans attribut `data-js`. Le
bouton du mode mobile y est remplacé par une case à cocher et son libellé, ce
qui le rend fonctionnel sans JavaScript :

```html
<nav class="menu-global" aria-label="Sites de la compagnie">
  <input type="checkbox" id="menu-global-interrupteur" class="menu-interrupteur">
  <label for="menu-global-interrupteur" class="menu-ouvrir">Menu</label>
  <ul class="menu-liste">
    <li class="menu-entree"><a class="menu-lien" href="…">Accueil</a></li>
    <li class="menu-entree menu-actuel">
      <details class="menu-groupe" name="menu-global">
        <summary class="menu-lien" aria-current="true">Compétitions</summary>
        <div class="menu-panneau">
          <p class="menu-origine">Palmarès et calendrier</p>
          <ul>
            <li>
              <a class="menu-item" href="…">
                <span class="menu-titre">Palmarès</span>
                <span class="menu-desc">Les résultats des archers</span>
              </a>
            </li>
          </ul>
        </div>
      </details>
    </li>
    <li class="menu-entree"><a class="menu-contact" href="…">Contact</a></li>
  </ul>
</nav>
```

L'administration de drop n'affiche pas ce menu, seulement un lien de retour
vers le site de la compagnie.

### Sécurité

- `menu.yaml` est la seule source : toute modification passe par une pull
  request, comme le reste de la charte.
- Le composant construit le DOM avec `createElement` et `textContent`, sans
  jamais interpréter de HTML ; le rendu serveur échappe les textes (Jinja2).
- Seuls les liens en `https://` sont acceptés à la génération.
- Une politique CSP doit autoriser le script :
  `script-src 'self' https://charte.arcpontoise.fr`.

## Correspondance avec les anciens noms

Les sites existants utilisent quelques noms différents, à remplacer lors de
leur migration :

| Ancien nom | Site | Nom dans la charte |
| --- | --- | --- |
| `--fond` | infos, palmares | `--bg` |
| `--carte` | infos, palmares | `--card` |
| `--filet` | infos, palmares | `--border` |
| `--encre`, `--bleu-fonce` | infos, palmares | `--ink` |
| `--bleu`, `--bleu-moyen` | infos, palmares | `--blue`, `--blue-mid` |
| `--gris`, `--gris-doux` | infos, palmares, drop | `--gray`, `--gray-soft` |
| `--rouge` | infos | `--danger` |
| `--grand` | palmares | `--highlight` |
| `--m0` à `--m3` | palmares | `--accent`, `--gold`, `--silver`, `--bronze` |
| `--encre`, `--bleu`, `--bleu-moyen` | drop | `--ink`, `--blue`, `--blue-mid` |
| `.card`, `.muted`, `.error`, `.success`, `.subtitle` | drop | `.carte`, `.discret`, `.erreur`, `.succes`, `.sous-titre` |
| `.info-list` | drop | `.liste-info` |
| `.saisons` | palmares | `.tuiles` |
| `button.secondary` | drop | `button.secondaire` |
| `header`, `footer` (sans classe) | infos, drop | `header.site`, `footer.site` |

## Modifier la charte

```bash
python -m venv .venv
. .venv/bin/activate
pip install -r requirements.txt
npm ci
# edit tokens.yaml, then:
python scripts/build_tokens.py
# edit menu.yaml or src/arc-menu.js, then:
python scripts/build_menu.py
yamllint .
ruff check scripts && ruff format --check scripts
npm run lint:css
npm run lint:js
npm run lint:md
```

La CI refuse une modification de `tokens.yaml`, `menu.yaml` ou
`src/arc-menu.js` sans régénération des fichiers correspondants. Une fois la
pull request fusionnée, la modification est en ligne pour tous les sites en
quelques minutes.

## Licence

Code sous licence GPL-3.0 (voir `LICENSE`). Les polices Caveat et Inter sont
sous licence SIL OFL 1.1. Le blason, les bandeaux FFTA et le label Ambition
restent la propriété de leurs titulaires et ne sont pas couverts par la licence
du dépôt.
