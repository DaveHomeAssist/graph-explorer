# Graph Explorer -- Feature Analysis

**Date:** 2026-03-25
**Scope:** All source files in graph-explorer (index.html, engine/validate.js, maps/manifest.json, map packs)

---

## Summary Table

| Feature | Status | Data Source / Persistence | Critical Gap |
|---|---|---|---|
| Dataset-agnostic graph rendering | Complete | JSON map packs (dataset.json + presentation.json) | None |
| Map pack manifest system | Complete | maps/manifest.json registry | No runtime validation of manifest entries |
| Schema validation engine | Complete | engine/validate.js (ES module) | Warnings displayed but not actionable |
| Dagre auto-layout | Complete | dagre.js CDN | Layout recalculates on every filter change (no incremental) |
| D3 pan/zoom/fit | Complete | D3 zoom behavior on SVG | Zoom state restored from URL but not persisted to localStorage |
| Node detail panel | Complete | Presentation-driven inspector config | Panel slides off-screen on desktop; fixed bottom on mobile |
| Path finding (BFS) | Complete | In-memory BFS over adjacency map | Undirected only; no weighted/shortest-cost paths |
| Path history | Complete | localStorage (ge-path-history-v1) | Capped at 5 entries; no cross-session export |
| Undo/redo | Complete | In-memory stack (UNDO_LIMIT=10) | Not persisted; lost on page reload |
| Map bookmarks | Complete | localStorage (ge-map-states-v1) | Silent failure if localStorage unavailable |
| URL state sync | Complete | URLSearchParams (replaceState) | Debounced 200ms; zoom params included |
| Heatmap overlay | Complete | Derived degree counts per node | Only degree-based; no custom metric support |
| Cluster mode | Complete | Auto-triggers below zoom threshold 0.6 | Layer-based only; no density clustering |
| Theme system (5 themes) | Complete | localStorage + URL param + prefers-color-scheme | Theme editor exports JSON but cannot import |
| Theme editor | Complete | Live color editing panel | Changes are session-only; export is manual download |
| Export (SVG/PNG/JSON) | Complete | Canvas clone + serialization | PNG uses 2x fixed scale; no DPI option |
| Focus modes | Complete | Presentation-driven filter presets | Requires presentation.json config; no user-created modes |
| Clickable legend filtering | Complete | Legend items toggle layer filter | Active state not reflected in layer dropdown sync |
| Data quality badges | Complete | Schema v1 badge + node/edge counts + warnings | Warnings shown as count only; no click-to-inspect |
| Accessibility (aria-live, skip-link, keyboard nav) | Partial | aria-live region, role=button on nodes, focus-visible | Screen reader announces but no roving tabindex in node group |
| Light mode | Complete | prefers-color-scheme + data-theme attribute | Duplicated CSS blocks for auto-detect vs explicit light |
| Responsive layout | Complete | CSS grid + media queries at 1100px and 700px | Detail panel as fixed bottom sheet on mobile clips at 50vh |
| SEO / Open Graph | Complete | Meta tags, canonical URL, robots | No structured data (JSON-LD) |
| Share link | Complete | Copies current URL with all state params | No short-URL generation |

---

## Detailed Feature Analysis

### 1. Dataset-Agnostic Graph Rendering

**Problem solved:** Visualize any node-edge topology without code changes -- the same viewer works for org charts, software architectures, AI pipelines, and Notion workspace maps.

**Implementation:** Single-file HTML app (`index.html`, ~2100 lines) with all CSS and JS inline. Loads JSON map packs consisting of a `dataset.json` (nodes + edges) and a `presentation.json` (colors, legend, inspector config, focus modes, stats). The presentation layer is fully decoupled from data -- the same dataset can be restyled by swapping the presentation file.

**Files:** `index.html` (monolith), `engine/validate.js` (schema validator), `maps/manifest.json` (registry), `maps/*/dataset.json`, `maps/*/presentation.json`, `maps/default-presentation.json` (fallback).

**Tradeoffs:** The single-file approach makes deployment trivial (GitHub Pages, no build step) but makes the codebase hard to navigate -- all JS logic lives in one `<script type="module">` block. The presentation layer is powerful but undocumented beyond the authoring guide; creating a new map pack requires understanding a non-trivial JSON schema.

**Limitations:** No build tooling means no minification, no tree-shaking, and no TypeScript safety. The monolithic structure will become harder to maintain as features grow.

### 2. Schema Validation Engine

**Problem solved:** Prevents broken or incomplete datasets from crashing the renderer by catching errors and warnings before graph construction.

**Implementation:** `engine/validate.js` exports `validateDataset()` which checks top-level shape, schema version, node contract (id, label, type, layer, meta), edge contract (from, to, type), duplicate detection, dangling edge references, and orphan nodes. Errors block rendering; warnings allow it but display a quality badge.

**Tradeoffs:** Validation is thorough for the current v1 schema but not extensible -- adding new required fields means editing the validator and all existing map packs simultaneously. No migration path between schema versions.

### 3. Path Finding (BFS)

**Problem solved:** Users can trace the shortest connection between any two nodes in the graph to understand dependencies and relationships.

**Implementation:** Standard BFS over an undirected adjacency map built at load time. Path mode is toggled via toolbar button. Source is the currently selected node; target is chosen via dropdown or by clicking another node. Found paths are highlighted with marching-ant animations on edges and color-coded source (green) / target (amber) / intermediate (indigo) nodes.

**Files:** `findShortestPath()`, `computePathHighlights()`, `updatePathBar()` in index.html.

**Tradeoffs:** BFS gives unweighted shortest path only. For graphs where edge types have different semantic weights (e.g., "structure" vs "data" edges), users may want weighted pathfinding. The path history is localStorage-persisted and capped at 5 entries per map.

### 4. Undo/Redo System

**Problem solved:** Lets users explore the graph freely and revert filter/selection changes without losing context.

**Implementation:** Snapshot-based: each state change pushes a JSON snapshot of `{search, layer, focus, selectedId, focusNode, heatmap, pathMode, pathTarget}` onto an undo stack (max 10 entries). Redo stack is cleared on new actions. Snapshots are compared by JSON stringification to avoid duplicates.

**Limitations:** Stack is in-memory only -- lost on page reload. The `historySuspend` flag (for programmatic state changes) was the subject of bug #003 and is now wrapped in try/finally.

### 5. Theme System

**Problem solved:** Supports different visual preferences and presentation contexts (dark default, light, terminal green-on-black, deep sea, instrument grade).

**Implementation:** Five built-in themes defined as CSS variable overrides on `html[data-theme]`. Theme selection persists to localStorage and URL params. A theme editor panel allows live color customization and exports the result as a JSON file.

**Tradeoffs:** Each theme requires a full CSS block for both base variables and per-component overrides (node fills, path colors, etc.), resulting in ~200 lines of CSS per theme. The theme editor is export-only -- there is no import mechanism to load a previously exported theme.

### 6. Cluster Mode

**Problem solved:** When zoomed far out, individual nodes become illegible. Cluster mode collapses nodes into layer-based summary badges.

**Implementation:** Triggers automatically when D3 zoom scale drops below 0.6. Computes centroids per layer, renders circular cluster badges with node counts, and dims the real node/edge groups. Clicking a cluster badge animates zoom to that cluster's region.

**Limitations:** Clustering is layer-based only, not spatial/density-based. Large graphs with many layers may produce overlapping cluster badges.

---

## Top 3 Priorities

1. **Extract JS into modules.** The ~1500-line inline script block is the primary maintenance bottleneck. Breaking it into ES modules (graph engine, state manager, UI renderer, path finder) would improve readability, testability, and enable future features like TypeScript migration -- without introducing a build step (native ES module imports work on all target browsers).

2. **Persist undo/redo across sessions.** The undo stack is lost on reload, which is surprising given that map bookmarks and path history already persist. Serializing the undo stack to localStorage (or sessionStorage) would make the exploration experience more resilient.

3. **Add data import/restore for theme editor.** The theme editor can export but not import. Users who create custom themes have no way to reload them without manually editing localStorage. Adding a file-drop import would close the round-trip.
