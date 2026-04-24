# Freegliders Roll20 Character Sheet

A custom Roll20 character sheet for the **Freegliders Steampunk TTRPG** system.

This repository contains the modular source code, styles, roll templates, and sheetworkers used to generate the final Roll20-compatible sheet files.

---

## Features

* Custom character sheet designed for Freegliders
* Automated derived stat calculations via sheetworkers
* Modular HTML, CSS, and JavaScript source structure
* ES module based sheetworker architecture
* ESLint enforced code quality checks
* Bundled and minified worker scripts using esbuild
* Roll templates for cleaner in-game rolls
* Build pipeline that compiles everything into Roll20-ready files

---

## Development Workflow

The project uses a modular source structure instead of maintaining one giant Roll20 HTML file.

Source files are separated into:

* **Components** → Character sheet UI sections
* **Styles** → Reusable CSS modules
* **Roll Templates** → Custom roll output templates
* **Sheetworkers** → Modular JavaScript files using imports/exports

All source files are compiled into the final Roll20 files using the build pipeline.

---

## Build Pipeline

Running the build process performs the following steps automatically:

### 1. ESLint Validation

All JavaScript files inside `src/` are linted.

If ESLint detects any errors, the build immediately fails.

This ensures broken or low-quality code never reaches `dist/`.

### 2. Sheetworker Bundling

`src/sheetworkers/main.js` is used as the JavaScript entry point.

All imported sheetworker modules are:

* bundled into a single file
* dependency-resolved
* minified
* converted into Roll20-compatible script output

This is handled by **esbuild**.

### 3. HTML Assembly

The build script injects:

* bundled sheetworkers
* roll templates
* component HTML partials

into `src/index.html`

### 4. CSS Assembly

All CSS files inside `src/styles/` are merged into `src/styles.css`.

### 5. Output Generation

Final production files are written to:

```text
dist/Freegliders.html
dist/Freegliders.css
```

These files are ready to paste into Roll20.

---

## Installation

### Install Node.js

Download and install Node.js if not already installed.

### Install Dependencies

```bash
npm install
```

---

## Available Commands

### Build Project

```bash
npm run build
```

Runs the full pipeline:

* ESLint
* Bundle sheetworkers
* Build HTML/CSS
* Output to `dist/`

### Lint Only

```bash
npm run lint
```

Runs ESLint against all source JavaScript.

### Auto Fix + Build

```bash
npm run build:fix
```

Runs ESLint with automatic fixes, then builds.

---

## Roll20 Installation

1. Open your Roll20 game
2. Go to **Game Settings**
3. Enable **Custom Character Sheet**
4. Paste:

* `dist/Freegliders.html` into HTML
* `dist/Freegliders.css` into CSS

5. Save and launch the game

---

## About Freegliders

Freegliders is a custom Victorian fantasy / steampunk tabletop RPG featuring:

* Airships
* Witchcraft
* Engineering
* Adventure crews
* Politics and colonialism
* Monsters and mysteries

---

## License

This project is licensed under the **GNU General Public License v3.0 (GPL-3.0-or-later)**.

You are free to use, modify, and distribute this project under the terms of that license.

See the `LICENSE` file for full details.

---

## Author

Created by Marc Schäfer / Marcedarc
