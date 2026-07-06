# Changelog

All notable changes to Graph Explorer, grouped by date.

## 2026-07-06
- Added explicit all-rights-reserved LICENSE.

## 2026-06-21
- Added D3 SRI integrity hash to `issues.html` to match `index.html`.

## 2026-04-16 – 2026-04-18
- Documented required Project Overview, Stack, and Key Decisions sections in `CLAUDE.md`.
- Added SRI integrity hashes and `crossorigin` attributes to the D3 and Dagre CDN scripts.
- Removed the deprecated `AGENTS.md` now that `CLAUDE.md` is canonical.

## 2026-03-26
- Deprecated `AGENTS.md`; added the `CLAUDE.md` issue tracker and a feature analysis doc.

## 2026-03-19 – 2026-03-21
- Added a full SEO head block (description, Open Graph, Twitter card, canonical URL).
- Wired the `aria-live` announce region to selection and filter state changes.
- Added `CLAUDE.md` with architecture constraints and conventions.
- Accessibility: skip link and mobile canvas sizing fixes.
- Resolved all 7 tracked bugs; compacted header and switched to a floating toolbar.
- Added clickable legend, detail drawer, coach overlay, and further a11y fixes.
- Shipped 5 new features: path UX, export, share, clustering, and a theme editor.
- Added 3 visual themes plus a theme manager.
- Fixed theme editor/detail drawer visibility when closed.
- Visual upgrade pass: depth, motion, typography, and interaction polish.
- Cross-project agent sweep: OG meta, accessibility, and performance fixes.
- Housekeeping: ignored local archives, tracked `docs/`.

## 2026-03-17 – 2026-03-18
- Added data quality overlays and empty-state handling.
- Fixed orphan nodes by connecting `build-guide` and `ops-guide` to `garden-os`.
- Added file-based map support and a PromptLab run-tree sample pack.
- Added sample map packs and the favicon asset.
- Added `AGENTS.md` project instructions.
- Added undo history for graph interactions.
- Added the standalone ecosystem issue tracker map (`issues.html`).

## 2026-03-16
- Initial commit: Graph Explorer v1.0.
- Completed light mode — fixed contrast across 8 element types.
- Added `metaFields` rendering and `prefers-reduced-motion` support.
