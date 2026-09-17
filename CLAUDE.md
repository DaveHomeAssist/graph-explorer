# Graph Explorer — Agent Instructions

> Static graph inspection and topology visualization tool. One viewer, many map packs.

## Project Overview

Static, zero-dependency graph topology visualization and inspection tool. Renders pluggable "map packs" using D3.js and Dagre. One viewer engine, many interchangeable datasets.

## Stack

- Single-file HTML application (`index.html`)
- D3.js and Dagre via pinned CDN (no npm, no build step)
- Browser-local persistence in four localStorage keys (see Persistence below)
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
- Persisted per browser in localStorage; nothing leaves the device

## Persistence

Four localStorage keys. All are browser-local, survive reloads, and are read
defensively — a blocked or full store degrades to defaults rather than
throwing. They are a compatibility surface: renaming one silently discards a
user's saved state.

| Key | Holds | Written by |
|---|---|---|
| `ge-map-states-v1` | Per-map bookmark of filters, selection, heatmap and path | `writeMapBookmark()` on every render |
| `ge-path-history-v1` | Last five path lookups, newest first | `recordPathHistory()` |
| `graph-explorer-theme` | Chosen theme id, one of the five in `THEME_ICONS` | the theme popover |
| `ge-onboarded-v1` | Whether the first-run coach has been dismissed | `showCoach()` |

Zoom and filter state also round-trips through the URL, which is what the Share
button copies.

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
| GE-01 | P0 | fixed | Floating toolbar destroyed on every load; six features unreachable | Toolbar moved out of `#mapWrap`, which `showLoading()` overwrites |
| GE-02 | P0 | fixed | Every click in the document threw twice | Popover writes go through `hidePopover()` |
| GE-03 | P0 | fixed | `fitToView` multiplied the fit scale by 2.4; most nodes cropped | Multiplier removed; `MIN_ZOOM` shared with `zoom.scaleExtent` |
| GE-04 | P0 | fixed | First-run coach queried `#coachNext` before the overlay was appended | Lookup scoped to the overlay |
| GE-05 | P1 | fixed | Three of five themes rejected on read, breaking share links | `isKnownTheme()` backed by `THEME_ICONS` |
| GE-06 | P1 | fixed | Focus-mode buttons rebuilt every render, destroying keyboard focus | Built once per pack; render only syncs state |
| GE-07 | P1 | fixed | Horizontal overflow at 375px; drawer hid the whole graph | Grid items may shrink; drawer waits for a real selection |
| GE-08 | P1 | fixed | `issues.html` had no skip link and no route home | Both added |
| GE-09 | P1 | fixed | `meta.tags` was the one unescaped dataset value in the node template | Escaped |
| GE-10 | P2 | fixed | `esc()` applied inconsistently across nine interpolation sites | Sweep; `populateSelect` builds DOM, not markup |
| GE-11 | P2 | fixed | Closing the drawer dropped focus to `<body>` | `closeDetailDrawer()` returns focus; `aria-hidden` tracks state |
| GE-12 | P2 | fixed | Eighteen controls under 44x44; search and layer at 17px | Controls sized, 44px on coarse pointers |
| GE-13 | P2 | fixed | Every node was a tab stop, scaling with map size | Roving tabindex; arrows, Home and End move within the graph |
| GE-14 | P2 | fixed | Export anchor never appended, URL revoked too early, PNG background hardcoded | Appended, deferred revoke, live background, error paths |
| GE-15 | P2 | fixed | Blocked CDN left the page on "Loading…" forever | `boot()` names the missing library |
| GE-16 | P2 | fixed | Edge-legend SVGs surfaced as anonymous images | `aria-hidden` |

## Session Log

[2026-09-17] [GraphExplorer] [fix] GE-01..GE-16 closed across four phases; see
`graph-explorer-feature-analysis-2026-09-17.md` for verified state.

[2026-03-18] [GraphExplorer] [docs] Add AGENTS baseline
