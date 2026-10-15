# NorthStar Design System site

Docs site for the NorthStar Design System. Static, no build step.

Source of truth: Figma file VZxmDNQiosTN6gqnvEQ65Z (page "00 Foundations" + site frames).

## Run

    python3 -m http.server 8910

Open http://localhost:8910. Hash routing, so any static host works.

## Files

- css/tokens.css      Primitives + semantic roles (dark default, light via data-theme)
- css/components.css  ns-* component classes, token-only values
- css/widgets.css     Graphics framework: widget shells, tables, informers
- css/site.css        Docs shell (header, side nav, TOC, playgrounds, tools)
- js/components.js    Component catalog: one entry drives Usage / Style / Code / Accessibility tabs
- js/widgets.js       Widget renderer + catalog of the Figma Widgets page (NS.widget, NS.hydrate)
- js/graphics.js      Graphics framework docs, widget gallery, family pages, board builder
- js/pages.js         Nav tree + foundations, patterns, data viz, floorplans, a11y, community
- js/tools.js         Token editor, Live Builder, Claude AI generator, embed helper
- js/app.js           Router, search palette, TOC scrollspy, theme, embed mode

Add a component: append an entry to NS.COMPONENTS in js/components.js. Nav, search, index, and prev/next pick it up.

Icons: assets/icons/*.svg (95, exported from Figma Icons page, currentColor) + manifest.json.

## Keeping Figma and the site in sync

**Code first.** New components can be built and documented here before they exist in Figma. Set `figma: null` (or leave the node out) in `js/components.js`; the page shows "Waiting for Figma sync", and Component status lists it. List what is waiting with `node tools/figma-sync-check.mjs --queue`. After the next batch sync to Figma, replace `null` with the node ID. Charts are described once in `js/charts.js`, and the same description draws the Figma layers and the docs SVG.

**Copy lint and hook.** `node tools/copy-lint.mjs` fails on em dashes and banned claims in site copy; `figma-sync-check` runs it too. The repo commits `tools/hooks/pre-commit`, which runs the copy lint on staged site files and the fit probe when CSS or components change. Enable it once per clone with `git config core.hooksPath tools/hooks`.

**Fit probe.** `node tools/fit-probe.mjs` renders every component state at 320, 240 and 192px tiles in headless Chrome (no npm install; it finds Chrome or `$CHROME`) and reports overflow, targets under 24px, unnamed controls and chart labels under 9px. `node tools/figma-sync-check.mjs --offline --fit` adds the result to the drift report. It also loads nine routes at window widths of 1920, 1440, 1280, 1024, 768 and 390px and fails if the page scrolls sideways. By-design exceptions (modal, side navigation, XL sizes, full-width alert) are listed at the top of `tools/fit-probe-page.js`.

Links run both ways: every component in `js/components.js` has a `figma` node ID, and every component in the NORTHSTAR DS Figma file (VZxmDNQiosTN6gqnvEQ65Z) has a documentation link to its page here. Nothing updates automatically, so check for drift by hand:

```bash
node tools/figma-sync-check.mjs
```

It needs a Figma personal access token with `file_content:read`, set as `FIGMA_TOKEN` in your shell or in a `.env` file in this folder (gitignored). `--offline` runs only the site-side checks. It reports broken links in either direction, Figma nodes that no longer exist, specification frames without a Spec tab, and Figma-only components as notes. Exit code 1 means drift.

When a specification frame is added or edited in Figma, regenerate its Spec tab entry in `js/specs.js` instead of editing the file by hand:

```bash
node tools/figma-spec-extract.mjs 4444:979
```

Pass the frame's node ID (a `NORTHSTAR DS / <Name> specification` frame on the Components overview page). It uses the same `FIGMA_TOKEN`; with `--from <dump.json>` it reads a dump made by pasting `tools/figma-spec-dump.js` into the Figma MCP instead, and `--dry` prints the entry without writing.
