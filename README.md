# GLB Viewer

A browser-based 3D model viewer built with **Svelte 5** and **Three.js**.

## Features

- Upload and inspect `.glb` 3D model files
- Orbit, pan, and zoom controls
- Wireframe and vertex colour display modes
- Adjustable background colour
- Auto-rotate with speed control
- Model statistics — vertex count, face count, texture count
- Collapsible options / statistics side panel
- Sample model picker for quick access to local models
- DOS/VGA bitmap font with fully centralised theming via `app.css`

## Project Structure

```
src/
  app.css                  ← single source of truth for all theming (.box rule)
  App.svelte               ← Three.js canvas, state, and layout
  main.js                  ← mounts the app into main.html
  assets/
    sample-models/         ← drop .glb files here; they appear in the Sample Models picker
  lib/
    Toolbar.svelte         ← top bar: upload button and sample model picker
    SidePanel.svelte       ← collapsible panel with Options and Statistics tabs
public/
main.html                  ← HTML entry point
```

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173/main.html](http://localhost:5173/main.html).

## Adding Sample Models

Drop any `.glb` file into `src/assets/sample-models/`. It will appear automatically in the **Sample Models** dropdown in the toolbar on the next hot-reload or build — no configuration required.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Svelte 5 (runes) |
| Bundler | Vite |
| 3D Rendering | Three.js |

