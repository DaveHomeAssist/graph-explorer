# Vendored browser libraries

Graph Explorer serves these browser bundles locally so graph rendering does not depend on a third-party CDN at runtime.

| File | Version | Upstream |
|---|---:|---|
| `d3-7.8.5.min.js` | D3 7.8.5 | d3/d3 npm UMD distribution; vendored from a repository copy preserving the upstream banner |
| `dagre-0.8.5.min.js` | Dagre 0.8.5 | dagrejs/dagre tag `v0.8.5`, `dist/dagre.min.js` |

Keep version numbers in filenames. Update this note and both HTML script references together when upgrading.
