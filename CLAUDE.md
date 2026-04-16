# Graph Explorer — Agent Instructions

> Static graph inspection and topology visualization tool. One viewer, many map packs.

## Project Overview

Static, zero-dependency graph topology visualization and inspection tool. Renders pluggable "map packs" using D3.js and Dagre. One viewer engine, many interchangeable datasets.

## Stack

- Single-file HTML application (`index.html`)
- D3.js and Dagre via pinned CDN (no npm, no build step)
- No localStorage or persistence between sessions
- GitHub Pages deployment from `main`

## Key Decisions

- Dataset and presentation are decoupled JSON files. Visual styling does not live in topology data.
- All map packs validated against `engine/validate.js`. Errors block load, warnings allow.
- Map pack registry is `maps/manifest.json`. Fallback presentation is `maps/default-presentation.json`.
- PromptLab exports depend on `default-presentation.json`. Do not remove the fallback pattern.
- Accessibility: aria-live announcements on selection and filter changes.

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

## Documentation Maintenance

- **Issues**: Track in CLAUDE.md issue tracker table below. When project gets a `docs/UI_ISSUES_TABLE.html`, migrate there.
- **Session log**: Append to `/Users/daverobertson/Desktop/Code/95-docs-personal/today.csv` after each meaningful change

## Issue Tracker

| ID | Severity | Status | Title | Notes |
|----|----------|--------|-------|-------|
| 001 | P1 | fixed | Path finding does not validate that source/target nodes exist | Added nodeMap guard in findShortestPath |
| 002 | P1 | fixed | focusNode access crashes if node missing from nodeMap | Added null-check before .label access |
| 003 | P1 | fixed | historySuspend flag not reset on render error | Wrapped restoreStateSnapshot in try/finally |
| 004 | P1 | fixed | Empty dataset produces NaN layout dimensions | Added Number.isFinite guards on bounds |
| 005 | P2 | fixed | aria-live announce region exists but is never populated | Added announce() calls on selection and filter changes |
| 006 | P2 | fixed | Path mode does not invalidate when filter removes target node | render() now clears path when source/target filtered out |
| 007 | P2 | fixed | Detail panel overflow not constrained on mobile | Set max-height:50vh at 1100px breakpoint |

## Session Log

[2026-03-18] [GraphExplorer] [docs] Add AGENTS baseline
