# Charte graphique — Compagnie d'archers de Pontoise

Couleurs, typographie, logos et styles de base communs aux sites de la compagnie :
la vitrine `arcpontoise.fr`, [infos](https://github.com/arcpontoise/infos),
[palmares](https://github.com/arcpontoise/palmares) et `drop.arcpontoise.fr`.

La page de démonstration est publiée sur GitHub Pages à partir de `index.html`.

## Contenu

| Chemin | Rôle |
| --- | --- |
| `tokens.yaml` | Source unique des couleurs, polices et mesures |
| `css/tokens.css` | Variables CSS **générées** depuis `tokens.yaml`, ne pas modifier à la main |
| `css/charte.css` | Styles de base et composants communs (stylelint `standard`) |
| `fonts/` | Police manuscrite Caveat (licence OFL, voir `fonts/OFL-Caveat.txt`) |
| `img/` | Blason, bandeaux FFTA, label Ambition, décor |
| `index.html` | Page de démonstration (nuancier, composants) |
| `scripts/build_tokens.py` | Génération et vérification de `css/tokens.css` |

## Principes

- Fond blanc cassé `--bg`, texte bleu nuit `--ink`, bandeaux bleu foncé `--blue`
  soulignés d'un filet `--accent`.
- Titres `h1` et `h2` en capitales, accent manuscrit en Caveat (classe `.manuscrit`).
- `--gray-soft` est réservé aux éléments non textuels : son contraste est insuffisant pour du texte.
- Les variables CSS et les clés de `tokens.yaml` sont en anglais, les classes en français.
- Point de rupture unique à **600 px** (les variables CSS ne sont pas utilisables dans les media queries).

## Utilisation dans un autre dépôt

Charger les deux feuilles dans cet ordre, puis les styles propres au site :

```html
<link rel="stylesheet" href="charte/css/tokens.css">
<link rel="stylesheet" href="charte/css/charte.css">
```

`charte.css` référence la police en `../fonts/caveat.woff2` : conserver l'arborescence
`css/` et `fonts/` côte à côte.

### Option recommandée : sous-module Git

La charte est copiée dans le site à la génération, sans dépendance externe à l'exécution
(compatible avec une CSP `style-src 'self'`) :

```bash
git submodule add https://github.com/arcpontoise/charte.git charte
git -C charte checkout v1.0.0
git add .gitmodules charte
git commit -m "build: add shared visual identity"
```

Dans les workflows GitHub Actions, récupérer le sous-module au checkout :

```yaml
- uses: actions/checkout@v7
  with:
    submodules: true
```

Le script de génération du site copie ensuite `charte/css`, `charte/fonts` et `charte/img`
dans son dossier de sortie.

### Option simple : lien direct

Pour un prototype, charger directement les fichiers publiés par GitHub Pages
(`https://arcpontoise.github.io/charte/css/…`). Toute modification de la charte s'applique
alors immédiatement à tous les sites, sans contrôle de version.

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
| `button`, `.bouton`, `.secondaire` | Boutons |
| `.discret`, `.succes`, `.attention`, `.erreur` | Messages |
| `.medaille-or`, `.medaille-argent`, `.medaille-bronze` | Podiums |

## Correspondance avec les anciens noms

Les sites existants utilisent quelques noms différents, à remplacer lors de leur migration :

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

La CI refuse une modification de `tokens.yaml` sans régénération de `css/tokens.css`.
Publier une nouvelle version par une étiquette (`v1.1.0`) puis mettre à jour le sous-module
dans chaque site.

## Licence

Code sous licence GPL-3.0 (voir `LICENSE`). La police Caveat est sous licence SIL OFL 1.1.
Le blason, les bandeaux FFTA et le label Ambition restent la propriété de leurs titulaires
et ne sont pas couverts par la licence du dépôt.
