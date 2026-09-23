# Extension FreeFEM pour Zed (`zed-FreeFEM`)

Support complet du langage **FreeFEM** (`.edp`, `.idp`) pour l'éditeur **Zed**, propulsé par une grammaire **Tree-sitter** native.

---

## Fonctionnalités

* **Analyse syntaxique & Coloration haute performance (Tree-sitter)** :
  * Mots-clés (`if`, `else`, `for`, `while`, `macro`, `func`, `load`, `include`, `try`, `catch`, etc.)
  * Espaces et formulations variationnelles (`fespace`, `varf`, `problem`, `solve`, `border`)
  * Types de base et structures (`real`, `int`, `complex`, `string`, `bool`, `matrix`, `mesh`, `mesh3`, etc.)
  * Opérateurs différentiels (`dx`, `dy`, `dz`, `dxx`, `dyy`, `dzz`, `dxy`, etc.)
  * Intégrales et conditions aux limites (`int1d`, `int2d`, `int3d`, `on`)
  * Constantes et éléments finis (`pi`, `P0`, `P1`, `P2`, `P1b`, `RT0`, `BDM1`, etc.)
  * Solveurs intégrés (`CG`, `GMRES`, `sparsesolver`, `Cholesky`, `Crout`)
  * Variables spéciales et coordonnées (`x`, `y`, `z`, `label`, `region`, `area`, `N`, `P`, `mpirank`, etc.)
  * Déclaration de macros terminées par `//`
  * Tableaux et vecteurs (`real[int] v(10);`, `u[].max`, etc.)
* **Délimiteurs et auto-fermeture** : Appariement automatique de `()`, `[]`, `{}`.
* **Auto-indentation** : Indentation contextuelle basée sur l'arbre de syntaxe concret.
* **Outline du document** : Vue structurelle des fonctions, macros, espaces d'éléments finis et problèmes.
* **Exécution intégrée (Tâches Zed)** :
  * Détection automatique de `// NBPROC <N>` et `// PARAM <args>` dans le fichier actif.
  * Lancement en mono-cœur (`FreeFem++`) ou multi-cœurs (`ff-mpirun`).

---

## Installation en mode développement dans Zed

1. Ouvrez **Zed**.
2. Ouvrez la palette de commandes (`Cmd+Shift+P` sur macOS ou `Ctrl+Shift+P` sur Linux/Windows).
3. Tapez et sélectionnez : **`zed: install dev extension`**.
4. Dans le sélecteur de dossier, choisissez le dossier :
   ```
   /Users/clementbaillet/Informatique/rust/zed-FreeFEM
   ```
5. Zed va automatiquement charger l'extension, compiler la grammaire Tree-sitter locale et l'activer pour les fichiers `.edp` et `.idp`.

---

## Raccourci pour exécuter les fichiers FreeFEM

Pour lancer l'exécution du fichier FreeFEM actif avec `Cmd+Shift+R` (comme dans VS Code), ajoutez ceci à votre fichier de configuration des raccourcis Zed (`~/.config/zed/keymap.json`) :

```json
[
  {
    "context": "Editor && (extension == edp || extension == idp)",
    "bindings": {
      "shift-cmd-r": ["task::Spawn", { "task_name": "Run FreeFEM" }]
    }
  }
]
```

---

## Tester la grammaire Tree-sitter

Pour re-générer ou tester le parseur en ligne de commande :

```bash
# Générer le parseur C à partir de grammar.js
tree-sitter generate

# Valider le parsing sur un fichier exemple
tree-sitter parse examples/laplacian.edp
```

---

## Structure du projet

```
zed-FreeFEM/
├── .gitignore
├── README.md
├── package.json              # Définition du paquet Tree-sitter
├── grammar.js                # Grammaire formelle FreeFEM
├── src/                      # Parseur C généré
│   ├── parser.c
│   └── tree_sitter/
├── extension.toml            # Manifeste de l'extension Zed
├── languages/
│   └── freefem/
│       ├── config.toml       # Paramètres du langage (extensions, commentaires)
│       ├── highlights.scm    # Requêtes de coloration syntaxique
│       ├── brackets.scm      # Appariement des délimiteurs
│       ├── indents.scm       # Auto-indentation
│       ├── outline.scm       # Vue structurelle du fichier
│       ├── runnables.scm     # Boutons d'exécution dans la gouttière
│       └── tasks.json        # Tâche d'exécution FreeFem++ / MPI
└── examples/
    └── laplacian.edp         # Fichier de démonstration FreeFEM
```
