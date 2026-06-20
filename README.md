# Darshan Hegde — Portfolio

Personal portfolio website with a space-themed 3D background, interactive hero section, and scroll-driven animations.

**Live preview:** Open `index.html` through a local web server (required for ES modules and assets).

## Features
- **3D space background** — Galaxy, star field, and animated planets (Earth, Moon, Mars, Jupiter, Saturn, and more) using Three.js
- **Earth loading screen** — Rotating Earth with clouds and atmosphere while the page loads
- **Scroll-based 3D effects** — Section depth, card reveals, and hero image tilt (`scene-3d.js`)
- **Hero particles** — Orange-themed Particles.js with hover repulse and click push
- **Typed headline** — Rotating roles in the hero via Typed.js
- **Sections** — Home, About, Skills, Education, Work, Certificates, Experience timeline, and footer with contact links
- **Responsive layout** — Mobile navigation, smooth scrolling, scroll spy, and ScrollReveal animations



## Project structure

```text
myPortolio/
├── .vscode/
│   ├── launch.json      # Chrome debug on localhost:8080
│   └── settings.json
├── assets/
│   ├── css/
│   │   └── style.css    # Main styles
│   ├── images/          # Profile photo, favicon, certificate images
│   └── js/
│       ├── app.js       # Particles.js configuration
│       ├── particles.min.js
│       ├── script.js    # Navigation, scroll spy, Typed.js, EmailJS, etc.
│       └── scene-3d.js  # Scroll depth & card 3D animations
├── index.html           # Single-page site (includes inline Three.js modules)
├── update_nav.py        # Optional helper to patch nav/footer in index.html
└── README.md
```

## Tech stack

| Layer | Technologies |
|-------|----------------|
| Markup & style | HTML5, CSS3 |
| Interactivity | JavaScript (ES6+), jQuery |
| 3D graphics | Three.js v0.160 (ES modules via CDN) |
| Effects | Particles.js, Typed.js, ScrollReveal, Vanilla Tilt |
| Icons | Font Awesome |
| Contact | EmailJS (CDN) |

Planet textures are loaded from the [Three.js examples repository](https://github.com/mrdoob/three.js/tree/master/examples/textures/planets) over the network.

## Getting started

### Prerequisites

- A modern browser (Chrome, Firefox, Edge, Safari)
- A local HTTP server — **do not** open `index.html` as a `file://` URL; Three.js modules and textures need HTTP

### Run locally

**Option A — VS Code Live Server**

1. Install the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension.
2. Right-click `index.html` → **Open with Live Server**.

**Option B — Python**

```bash
cd "path/to/myPortolio - Copy"
python -m http.server 8080
```

Then open [http://localhost:8080](http://localhost:8080).

**Option C — VS Code debugger**

Use the **Launch Chrome against localhost** configuration in `.vscode/launch.json` (expects the site on port `8080`).

### Customize content

1. Edit text, links, and sections in `index.html`.
2. Update styles in `assets/css/style.css`.
3. Adjust particle settings in `assets/js/app.js`.
4. Replace images under `assets/images/` (profile photo, favicon, certificate thumbnails).

## Scripts

| File | Purpose |
|------|---------|
| `assets/js/script.js` | Menu toggle, smooth scroll, scroll spy, Typed.js init, certificate modal, EmailJS |
| `assets/js/scene-3d.js` | 3D scroll effects on sections and cards (respects `prefers-reduced-motion`) |
| `assets/js/app.js` | Particles.js config for `#particles-js` |
| `update_nav.py` | Small Python utility to find/replace navbar and footer blocks in `index.html`. Edit the script if your HTML structure changes. |

## Social links

- [GitHub](https://github.com/DarshanHegde17)
- [LinkedIn](https://www.linkedin.com/in/darshan-hegde-4507382b9)
- [LeetCode](https://leetcode.com/u/DarshanHegde17/)
- [HackerRank](https://www.hackerrank.com/profile/darshanhegdeheg1)

## License

Personal portfolio — © 2024 Darshan Hegde. All rights reserved.
