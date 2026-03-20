# AGENTS.md

Inherits root rules from `/Users/daverobertson/Desktop/Code/AGENTS.md`.

## Project Overview

Graph Explorer is a static graph inspection tool for loading topology datasets, filtering nodes, tracing paths, and inspecting graph metadata through a browser first interface.

## Stack

- Static HTML, CSS, and JavaScript
- JSON datasets and presentation manifests
- Local validator modules
- Static hosting

## Key Decisions

- Keep the dataset contract JSON based and validator backed
- Separate dataset content from presentation content so one viewer can serve multiple maps
- Favor static deployability over framework complexity

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

