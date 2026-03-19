# How to Build a Map Pack

A map pack is a self-contained dataset that Graph Explorer can render as an interactive topology graph. Every map pack produces two files — one required, one optional — placed in a directory under `maps/`.

---

## Quick Start

```
maps/
  my-map/
    dataset.json          ← required (your graph data)
    presentation.json     ← optional (colors, inspector, focus modes)
  manifest.json           ← add your map here so the dropdown sees it
```

1. Create `maps/my-map/dataset.json`
2. Optionally create `maps/my-map/presentation.json`
3. Add an entry to `maps/manifest.json`
4. Open Graph Explorer — your map appears in the dropdown

If you skip `presentation.json`, Graph Explorer falls back to `maps/default-presentation.json`.

---

## File 1: dataset.json (required)

The dataset defines your graph — nodes and the edges between them.

### Minimal Example

```json
{
  "version": 1,
  "meta": {
    "id": "my-map",
    "name": "My First Map",
    "version": "1.0",
    "description": "A small example graph",
    "author": "Your Name"
  },
  "nodes": [
    {
      "id": "api-gateway",
      "label": "API Gateway",
      "type": "Service",
      "layer": "Infrastructure",
      "status": "Active",
      "meta": {
        "desc": "Routes all incoming traffic to downstream services",
        "tags": ["core", "networking"],
        "risks": ["Single point of failure without redundancy"],
        "nextMoves": ["Add health check endpoint"]
      }
    },
    {
      "id": "user-service",
      "label": "User Service",
      "type": "Service",
      "layer": "Backend",
      "status": "Active",
      "meta": {
        "desc": "Handles authentication and user profiles",
        "tags": ["auth", "backend"]
      }
    },
    {
      "id": "postgres",
      "label": "PostgreSQL",
      "type": "Database",
      "layer": "Data",
      "status": "Active",
      "meta": {
        "desc": "Primary relational store",
        "tags": ["database", "sql"]
      }
    }
  ],
  "edges": [
    { "from": "api-gateway", "to": "user-service", "type": "calls" },
    { "from": "user-service", "to": "postgres", "type": "data" }
  ]
}
```

### Node Schema

| Field | Type | Required | Purpose |
|-------|------|----------|---------|
| `id` | string | yes | Unique identifier. Used in edges and focus mode filters. |
| `label` | string | yes | Display name shown on the graph and in the inspector. |
| `type` | string | recommended | Semantic type (e.g. "Service", "Database", "Issue"). Shown in inspector. |
| `layer` | string | recommended | Visual grouping. Maps to layer colors in `presentation.json`. |
| `status` | string | optional | Current state (e.g. "Active", "At Risk", "P1"). Maps to `statusStyles`. |
| `meta` | object | optional | Arbitrary metadata — rendered by the inspector based on presentation config. |

#### Common meta fields

| Key | Type | What it does |
|-----|------|-------------|
| `desc` | string | Description shown in the inspector detail panel. |
| `tags` | string[] | Rendered as chips in the inspector. Useful for filtering. |
| `risks` | string[] | Rendered as a list under "Risks". |
| `nextMoves` | string[] | Rendered as a list under "Next Moves". |
| `url` | string | Clickable link in the inspector (requires `metaLink: "url"` in presentation). |
| `owner` | string | Rendered as a field if declared in `metaFields`. |

You can add any custom keys to `meta` — they render if the presentation declares them.

### Edge Schema

| Field | Type | Required | Purpose |
|-------|------|----------|---------|
| `from` | string | yes | Source node `id`. |
| `to` | string | yes | Target node `id`. |
| `type` | string | recommended | Semantic type. Maps to `edgeStyles` in presentation. |

Common edge types: `structure`, `data`, `reference`, `calls`, `has-issue`, `matches-pattern`, `variant_of`, `affected-by`.

You can invent any edge type — just declare its style in `presentation.json`.

### Validation Rules

The validator (`engine/validate.js`) enforces:

- **Errors** (block load): missing `nodes`/`edges` arrays, duplicate node IDs, missing node `id`/`label`, edge referencing nonexistent node
- **Warnings** (allow load): missing `version`, missing `type`/`layer`, orphan nodes (no edges), self-loops, duplicate edges

Run the validator by loading your map — errors appear in the console and the UI banner.

---

## File 2: presentation.json (optional)

The presentation controls how your dataset looks and feels — colors, inspector layout, focus modes, and stats.

### Minimal Example

```json
{
  "title": "My First Map",
  "eyebrow": "Example · v1.0",
  "description": "Three services and a database.",
  "layers": {
    "Infrastructure": "#818cf8",
    "Backend": "#38bdf8",
    "Data": "#22c55e"
  },
  "edgeStyles": {
    "calls": { "stroke": "rgba(56,189,248,0.42)", "dasharray": null },
    "data": { "stroke": "rgba(52,211,153,0.45)", "dasharray": "5,3" }
  },
  "inspector": {
    "fields": [
      { "key": "type", "label": "Type" },
      { "key": "layer", "label": "Layer" },
      { "key": "status", "label": "Status" }
    ],
    "metaFields": [
      { "key": "desc", "label": "Description" }
    ],
    "metaArrays": [
      { "key": "risks", "label": "Risks", "emptyText": "None" },
      { "key": "nextMoves", "label": "Next Moves", "emptyText": "None" }
    ],
    "metaChips": ["tags"],
    "metaLink": null
  },
  "focusModes": [
    { "id": "All", "label": "All" },
    { "id": "infra", "label": "Infrastructure", "filter": { "layers": ["Infrastructure"] } }
  ],
  "stats": [
    { "label": "Visible", "count": "visible" },
    { "label": "Services", "filter": { "layers": ["Infrastructure", "Backend"] } },
    { "label": "Data", "filter": { "layer": "Data" } }
  ]
}
```

### Full Presentation Reference

| Section | Purpose |
|---------|---------|
| `title` | Hero heading in the UI. |
| `eyebrow` | Small label above the title. |
| `description` | Paragraph below the title. |
| `defaults` | `showHeatmap`, `initialFocusMode`, `initialLayer` — initial UI state. |
| `layers` | Object mapping layer names → hex colors. Every `layer` value in your dataset should have a color here. |
| `statusStyles` | Object mapping status values → hex colors. Overrides the node border/badge color. |
| `layerGlyphs` | Object mapping layer names → 2-char glyphs shown on nodes. |
| `legendItems` | Array of `{ label, color }` for the legend panel. |
| `edgeStyles` | Object mapping edge `type` → `{ stroke, dasharray }`. `null` dasharray = solid line. |
| `inspector.fields` | Top-level node fields shown in the detail panel. |
| `inspector.metaFields` | `meta.*` keys shown as label/value rows. |
| `inspector.metaArrays` | `meta.*` keys shown as bullet lists. |
| `inspector.metaChips` | `meta.*` keys rendered as tag chips (usually `["tags"]`). |
| `inspector.metaLink` | `meta.*` key rendered as a clickable URL (e.g. `"url"`). |
| `focusModes` | Toolbar filter presets. `filter.layers` filters by layer, `filter.ids` filters by node ID list. |
| `stats` | Stat chips in the header. `"count": "visible"` shows current visible count. `filter` counts matching nodes. |

---

## File 3: manifest.json entry

Add your map to `maps/manifest.json` so it appears in the dropdown.

### Directory-based (most common)

```json
{
  "id": "my-map",
  "title": "My First Map",
  "description": "Three services and a database"
}
```

Graph Explorer resolves this to `maps/my-map/dataset.json` and `maps/my-map/presentation.json`.

### File-based (for datasets stored outside maps/)

```json
{
  "id": "my-external-data",
  "name": "External Dataset",
  "description": "Points at a dataset file in another directory",
  "file": "datasets/my-export/dataset.json",
  "presentation": "datasets/my-export/presentation.json",
  "tags": ["external"]
}
```

---

## Recipes

### Issue Tracker Map

Nodes are projects + issues. Edges connect issues to their project and to shared patterns.

**Layers:** `Tier 1`, `Tier 2`, `P1 Issues`, `Issue Pattern`
**Edge types:** `has-issue`, `matches-pattern`, `affected-by`
**Focus modes:** "P1 Only", "At Risk Projects", "Clean Projects"

See `maps/ecosystem-issues/` for the complete working example.

### Software Architecture Map

Nodes are services, databases, APIs, and infrastructure. Edges are calls, data flows, and references.

**Layers:** `Frontend`, `Backend`, `Data`, `Infrastructure`, `External`
**Edge types:** `calls`, `data`, `reference`

See `maps/software-architecture/` for the complete working example.

### Org Chart

Nodes are people, teams, and departments. Edges are reporting lines and cross-functional links.

**Layers:** by department or level
**Edge types:** `reports-to`, `collaborates-with`

See `maps/sample-org-chart/` for the complete working example.

### Run Tree (PromptLab export)

Nodes are traces, chains, LLM calls, tools, and agents. Edges are parent-child execution flows.

**Layers:** `Trace`, `Chain`, `LLM`, `Tool`, `Agent`, `Eval`
**Edge types:** `calls`, `variant_of`

Uses `maps/default-presentation.json` — no per-export presentation needed.

---

## Checklist

- [ ] `dataset.json` has `"version": 1`
- [ ] Every node has a unique `id` and a `label`
- [ ] Every edge `from`/`to` references a real node `id`
- [ ] Every `layer` value in your nodes has a matching color in `presentation.layers`
- [ ] Every edge `type` has a matching style in `presentation.edgeStyles`
- [ ] Entry added to `maps/manifest.json`
- [ ] Load your map in Graph Explorer — check console for validation warnings
- [ ] No orphan nodes (unless intentional)
- [ ] Focus modes and stats reference layers/IDs that exist in your dataset

---

## Tips

- **Start small.** Get 5-10 nodes rendering, then expand. Graph Explorer handles hundreds of nodes but authoring is easier iteratively.
- **Fork the starter template.** Copy `maps/sample-starter-template/` and rename — all field types are pre-wired.
- **Use layers for visual grouping.** Layers control node color and filter toggles. Pick 3-6 layers max for readability.
- **Use types for semantic meaning.** Types show in the inspector but don't affect visual grouping.
- **Use status for health.** Combined with `statusStyles`, status drives the node border color (e.g. red for "At Risk").
- **Edge dasharray controls line style.** `null` = solid, `"5,3"` = dashed, `"2,4"` = dotted.
- **Tags are free-form.** Use them for cross-cutting concerns that don't map to layers.
- **meta is open-ended.** Any key you add to `meta` can be surfaced in the inspector — just declare it in the presentation.
