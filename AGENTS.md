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
| 001 | P1 | open | Path finding does not validate that source/target nodes exist | Returns empty array without user feedback if nodes removed by filter |
| 002 | P1 | open | focusNode access crashes if node missing from nodeMap | Unsafe .label access on potentially undefined nodeMap entry |
| 003 | P1 | open | historySuspend flag not reset on render error | If render() throws, undo snapshots are permanently blocked |
| 004 | P1 | open | Empty dataset produces NaN layout dimensions | computeLayout with zero nodes yields Infinity bounds |
| 005 | P2 | open | aria-live announce region exists but is never populated | State changes like filter results are not announced to screen readers |
| 006 | P2 | open | Path mode does not invalidate when filter removes target node | Old path visualization persists after node is filtered out |
| 007 | P2 | open | Detail panel overflow not constrained on mobile | At 1100px breakpoint detail panel loses max-height and fills viewport |

## Session Log

[2026-03-18] [GraphExplorer] [docs] Add AGENTS baseline

