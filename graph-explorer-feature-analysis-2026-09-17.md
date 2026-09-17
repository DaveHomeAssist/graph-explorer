# Graph Explorer — Feature Analysis

**Date:** 2026-09-17
**Scope:** `index.html`, `issues.html`, `engine/core.js`, `engine/validate.js`, `maps/`
**Supersedes:** `graph-explorer-feature-analysis-2026-03-25.md` for status, not for history.

## Why this document exists

The 2026-03-25 analysis marked every feature `Complete`. A browser-verified
review on 2026-09-17 found that six of them — Fit, Heatmap, Theme switch,
Share, Theme editor and Export — were **unreachable on the deployed page**,
because the floating toolbar was destroyed on every load before the first paint
finished. Three of the five offered themes never survived a reload. First-run
onboarding had never once appeared.

None of that was visible from reading the source, which is why the earlier
snapshot was wrong in good faith. The correction is method, not blame: status
here is claimed only where a probe observed the behaviour in a browser.

The 2026-03-25 file stays as written. It is a dated record of what was believed
then, and editing it in place would destroy that.

## Verified state

Measured in headless Chromium with the pinned D3 7.8.5 and Dagre 0.8.5 bundles
served locally, on both pages.

| Feature | Status | Evidence |
|---|---|---|
| Dataset-agnostic rendering | Verified | 24 and 43 nodes render from their packs |
| Map pack manifest | Verified | 9 packs listed and selectable |
| Schema validation | Verified | Errors block load; warnings surface as badges |
| Dagre auto-layout | Verified | Layout recomputed per filter change |
| D3 pan/zoom | Verified | `scaleExtent` and `fitToView` share `MIN_ZOOM` |
| Fit to view | Verified | From `k=2.415`, Fit reframes to 0 of 24 outside |
| Node detail panel | Verified | Opens on selection, closes returning focus |
| Path finding (BFS) | Verified | Undirected; source and target validated |
| Path history | Verified | Five entries in `ge-path-history-v1` |
| Undo/redo | Verified | In-memory, limit 10, not persisted |
| Map bookmarks | Verified | `ge-map-states-v1`, degrades to defaults if blocked |
| URL state sync | Verified | map, node, layer, focus, heat, q, path, theme, zoom |
| Heatmap overlay | Verified | 24 rings, `aria-pressed` correct |
| Cluster mode | Verified, `index.html` only | Engages below `k=0.6`; `issues.html` has no cluster code |
| Theme system (5 themes) | Verified | All five survive a reload and a share-link round trip |
| Theme editor | Verified | Opens with 6 live controls |
| Export SVG / PNG / JSON | Verified | SVG and JSON download; PNG takes the live background |
| Focus modes | Verified | Built once per pack; keyboard focus survives activation |
| Clickable legend | Verified | Toggles layer filter, syncs the dropdown |
| Data quality badges | Verified | Schema, node and edge counts, warning count |
| Keyboard navigation | Verified | Graph is one tab stop; arrows, Home and End move within |
| Screen-reader exposure | Verified | 44 buttons in the AX tree, no anonymous images |
| Responsive layout | Verified | No horizontal overflow at 375px; graph above the fold |
| Target sizes | Verified | No persistent control under 24px; 44px on coarse pointers |
| Escaping | Verified | Adversarial pack with five breakout payloads injects nothing |
| CDN failure handling | Verified | Aborting cdnjs renders a banner naming the missing library |
| Reduced motion | Verified | `prefers-reduced-motion` covers 13 transitions, 3 animations |
| SEO / Open Graph | Unverified | Meta tags present; not probed |

## Known gaps

These are real and unfixed. None is a regression.

1. **`issues.html` has no cluster mode.** Its pack measures 6600×324 units and
   fits at `k=0.165`, where node cards are too small to read. `index.html`
   switches to cluster badges below `0.6` for exactly this case; `issues.html`
   has none of that code. Verified it never engages there at any zoom.
2. **The floating toolbar overlaps the detail drawer.** It sits at its authored
   `bottom:14px; right:14px`, and the drawer overlays the right 290px of the
   canvas, so the strip clips some drawer text. This is the original layout,
   only visible now that the toolbar survives.
3. **BFS uses `queue.shift()`**, which is O(n) per step. Irrelevant at current
   pack sizes; it would matter on a pack an order of magnitude larger.
4. **Warnings are still count-only.** The badge reports how many; there is no
   click-to-inspect.
5. **No structured data (JSON-LD).** Carried over from the 2026-03-25 list.

## How to re-verify

There is no CI in this repository, and adding npm or build tooling is out of
bounds. Verification means serving the directory statically and driving both
pages with headless Chromium, fetching the two pinned CDN bundles once and
serving them locally so the probe does not depend on reaching cdnjs.

The gates worth re-running after any change to the canvas, toolbar or boot path:

- float buttons present (6 on `index.html`)
- node centres outside `#mapWrap` (0 of 24, 0 of 43)
- page errors on load and on a background click (0)
- first-run coach overlay appears and its dismissal persists
- all five themes survive a reload
- keyboard focus survives focus-mode activation
- `documentElement.scrollWidth` equals `innerWidth` at 375px
- the graph is one tab stop
- an aborted cdnjs request renders the error banner
