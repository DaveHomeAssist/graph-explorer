# Graph Explorer

A static, zero-dependency node graph viewer — load any JSON "map pack" and explore it as an interactive topology: filter by layer, trace paths between nodes, and inspect details in a side panel. Live at **[davehomeassist.github.io/graph-explorer](https://davehomeassist.github.io/graph-explorer/)**.

One viewer, many interchangeable datasets. There's no backend, no build step, and no persistence — everything runs in the browser, rendered with [D3.js](https://d3js.org/) and [Dagre](https://github.com/dagrejs/dagre) via pinned CDN links.

## What's here

| Path | What it is |
|---|---|
| `index.html` | The viewer itself — a single-file app (all CSS/JS inline) that loads a selected map pack and renders it |
| `issues.html` | A standalone variant of the viewer pre-wired as an ecosystem-wide issue tracker map |
| `engine/validate.js` | Schema validator for map packs — checks `dataset.json` structure before it's allowed to render |
| `maps/manifest.json` | The registry of available map packs; add an entry here to make a pack selectable in the UI |
| `maps/default-presentation.json` | Fallback visual styling used by any pack that ships a dataset without its own `presentation.json` |
| `maps/*/` | Map packs — each a `dataset.json` (required) plus an optional `presentation.json` |
| `datasets/` | Externally-referenced datasets (e.g. PromptLab run-tree exports) pointed to from `manifest.json` via a `file` path instead of living under `maps/` |
| `assets/` | Icons and favicon |
| `docs/how-to-build-a-map-pack.md` | Full authoring guide for building your own map pack |

## How to run it

No install, no build. Just serve the directory statically and open it, e.g.:

```
npx serve .
```

or simply open `index.html` directly in a browser (double-click, or `open index.html`). To browse the ecosystem issue tracker instead, open `issues.html`.

## Building your own map

See **[docs/how-to-build-a-map-pack.md](docs/how-to-build-a-map-pack.md)** for the full guide — dataset/presentation schema, node and edge contracts, validation rules, and worked recipes (issue trackers, software architecture maps, org charts, PromptLab run-tree exports).

## Conventions

- Dataset (topology) and presentation (visual styling) are always separate JSON files — never mix graph data with color/layout config.
- Every map pack must validate against `engine/validate.js` (errors block load, warnings allow it) and must be registered in `maps/manifest.json` to appear in the UI.
- No npm, no build tooling, no external dependencies beyond the pinned D3/Dagre CDN scripts — this project is intentionally static.
