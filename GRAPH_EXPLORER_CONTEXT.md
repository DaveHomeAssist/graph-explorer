# Graph Explorer Context

Graph Explorer renders dataset-backed map packs from the `maps/` directory.

## Loader Contract

Each pack can be addressed in one of two ways:

1. Directory-based pack:

- `maps/<pack-id>/dataset.json`
- optional `maps/<pack-id>/presentation.json`

2. File-based manifest entry:

- `file` points directly at a dataset JSON file anywhere in the repo
- optional `presentation` points directly at a presentation JSON file
- if `presentation` is omitted, Graph Explorer first checks for a sibling `presentation.json`
  next to the dataset and then falls back to the shared default presentation

The loader expects:

- `dataset.json` — required
- `presentation.json` — optional

If `presentation.json` is absent, Graph Explorer falls back to:

- `maps/default-presentation.json`

This keeps run-tree exports consumable without per-export presentation authoring.

## PromptLab Run-Tree Export Manifest Entry

PromptLab run-tree exports should publish a manifest entry in this shape:

```json
{
  "id": "trace_<traceId>__variant_<variantId>__<ts>",
  "name": "Run Tree: <human label>",
  "file": "datasets/<export_id>/dataset.json",
  "tags": ["run-tree", "promptlab"]
}
```

Notes:

- `id` should remain stable for a given exported snapshot.
- `file` points at the exported `dataset.json`.
- A colocated `presentation.json` is optional because the loader now falls back to the shared default presentation.
- Optional provenance artifacts such as `runs.ndjson` can live beside the dataset without any Graph Explorer changes.
