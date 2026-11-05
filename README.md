# Charte graphique — Compagnie d'archers de Pontoise

Couleurs, typographie, logos et styles de base communs aux sites de la
compagnie : la vitrine `arcpontoise.fr`,
[infos](https://github.com/arcpontoise/infos),
[palmares](https://github.com/arcpontoise/palmares) et
[drop](https://github.com/arcpontoise/).

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
| `index.html` | Page de démonstration (nuancier, composants) |
| `scripts/build_tokens.py` | Génération et vérification de `css/tokens.css` |

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
- Point de rupture unique à **600 px** (les variables CSS ne sont pas
  utilisables dans les media queries).

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
| `nav.site` (lien actif via `aria-current`) | Navigation principale |
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
yamllint .
ruff check scripts && ruff format --check scripts
npm run lint:css
npm run lint:md
```

La CI refuse une modification de `tokens.yaml` sans régénération de
`css/tokens.css`. Une fois la pull request fusionnée, la modification est en
ligne pour tous les sites en quelques minutes.

## Licence

Code sous licence GPL-3.0 (voir `LICENSE`). Les polices Caveat et Inter sont
sous licence SIL OFL 1.1. Le blason, les bandeaux FFTA et le label Ambition
restent la propriété de leurs titulaires et ne sont pas couverts par la licence
du dépôt.
