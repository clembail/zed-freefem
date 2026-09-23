# FreeFEM pour Zed

Support du langage [FreeFEM](https://freefem.org/) (`.edp`, `.idp`) pour l'éditeur [Zed](https://zed.dev/), basé sur l'extension [vscode-FreeFEM](https://github.com/PierreMarchand20/vscode-FreeFEM).

## Fonctionnalités

- **Coloration syntaxique (Tree-sitter)** : prise en charge des mots-clés, types, maillages, espaces éléments finis (`fespace`), formulations variationnelles (`varf`, `solve`, `problem`), intégrales et opérateurs différentiels.
- **Support de l'éditeur** : appariement des délimiteurs, auto-indentation et outline des symboles.
- **Exécution des scripts** : tâche intégrée pour lancer vos calculs avec `FreeFem++` ou `ff-mpirun`, avec détection automatique des paramètres (`// NBPROC` et `// PARAM`).

## Installation

### Via le gestionnaire d'extensions
1. Ouvrez le panneau des extensions (`Cmd+Shift+X` ou `Ctrl+Shift+X`).
2. Cherchez **FreeFEM** puis cliquez sur **Install**.

### Manuelle
1. Clonez ce dépôt :
   ```bash
   git clone https://github.com/clembail/zed-freefem.git
   ```
2. Ouvrez la palette de commandes (`Cmd+Shift+P` ou `Ctrl+Shift+P`).
3. Sélectionnez **`zed: install dev extension`** et choisissez le dossier du dépôt.

## Raccourci d'exécution

Pour exécuter le script en cours avec `Cmd+Shift+R` (ou `Ctrl+Shift+R`), ajoutez cette entrée dans votre configuration de raccourcis (`~/.config/zed/keymap.json`) :

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
