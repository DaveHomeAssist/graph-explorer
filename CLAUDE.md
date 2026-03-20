# Graph Explorer — Agent Instructions

> Static graph inspection and topology visualization tool. One viewer, many map packs.

## Architecture

- Zero backend — no server, no database, no API calls
- No npm, no build step, no external JS/CSS dependencies beyond D3.js and Dagre (pinned CDN)
- Single-file HTML application (`index.html` embeds all CSS and JS)
- Dataset-presentation separation — topology data and visual styling are decoupled JSON files
- All map packs validated against `engine/validate.js` before load
- State is ephemeral — no localStorage, no persistence between sessions

## Conventions

- Follow shared naming conventions: `30-shared-resources/shared-standards/NAMING_CONVENTIONS.md`
- CSS classes: kebab-case
- JS IDs: camelCase for JS-bound, kebab-case for anchors
- Constants: UPPER_SNAKE_CASE
- State classes: `.is-*` prefix

## Key References

| Domain | Canonical Source |
|---|---|
| Dataset schema | `engine/validate.js` (errors = block, warnings = allow) |
| Map pack registry | `maps/manifest.json` |
| Fallback presentation | `maps/default-presentation.json` |
| Authoring guide | `docs/how-to-build-a-map-pack.md` |
| Node contract | `id` (required), `label` (required), `type`, `layer`, `status`, `meta` |
| Edge contract | `from` (required), `to` (required), `type` |
| Naming standards | `30-shared-resources/shared-standards/NAMING_CONVENTIONS.md` |

## Deployment

- **Host:** GitHub Pages
- **Branch:** main
- **URL:** https://davehomeassist.github.io/graph-explorer/
- **Process:** `git push` triggers deploy

## What Not To Do

- Do not add a backend, database, or server requirement
- Do not introduce npm, package.json, or any build tooling
- Do not add external JS/CSS dependencies beyond the pinned D3/Dagre CDN links
- Do not modify `engine/validate.js` without updating all map packs that rely on the contract
- Do not add a map pack without registering it in `maps/manifest.json`
- Do not remove the fallback presentation pattern — PromptLab exports depend on `default-presentation.json`
- Do not break aria-live announcements — screen reader support is a tracked priority (P2)
