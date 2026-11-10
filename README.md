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
- js/dashboards.js     NS.dash: chart parts and shell helpers for full-screen dashboard layouts
- js/dashboard-layouts.js  Docs pages and nav for the 24 dashboard layouts and the chart parts page
- css/dashboards.css  Dashboard kit: artboard, tiles, fills, display type, rail, stepper. Loaded by dashboards/*.html only
- dashboards/         24 layout pages plus chart-parts.html. Each is a standalone page that follows the tokens
- js/pages.js         Nav tree + foundations, patterns, data viz, floorplans, a11y, community
- js/tools.js         Token editor, Live Builder, Claude AI generator, embed helper
- js/app.js           Router, search palette, TOC scrollspy, theme, embed mode

Add a component: append an entry to NS.COMPONENTS in js/components.js. Nav, search, index, and prev/next pick it up.

Icons: assets/icons/*.svg (95, exported from Figma Icons page, currentColor) + manifest.json.

## Not published (kept out of the live rsync)

- film/          Hero film source. b2-assembly.html is the GSAP timeline; `site` links back to this repo.
                 Serve with `python3 -m http.server 8960` in film/, then in film/tools (EXE = Chrome path):
                 `node capture.js` (stills), `STILLS=3.5 node render.js http://localhost:8960/b2-assembly.html frames/p.png`
                 (poster), `node render.js <url> ../NorthStar-Assembly.mp4` (about 8 min), ffmpeg to 1280x720 crf 27,
                 copy mp4 and poster to assets/film/. Renders (*.mp4), frames and node_modules are gitignored.
- explorations/  Direction mocks kept for reference: chart-directions (A1/A2, A2 chosen), visual-directions
                 (A Color blocks, B Signal), logo-wordmark (wordmark generators: build_faces.py, build_site.py, build_og.py).

## Releasing a version

The version is typed in four places. Change all of them in one commit.

1. `js/pages.js`: `NS.VERSION`, and a new entry at the top of the changelog page (`P("changelog", ...)`). Rename any "Unreleased" section to the new version.
2. `film/b2-assembly.html`: the `#tag` line under the logo. Re-render the film and poster (steps under "Not published"), then copy both to `assets/film/`.
3. The case study page in the live site folder (`northstar-case-study.html`): the version pill in the hero, plus the film and poster in `ASSETS/northstar-case-study/`.
4. Agent files: `node tools/agent-export.mjs` rewrites `llms.txt` and `agent/`. The pre-commit hook also does this.

Then run `node tools/check-all.mjs`, push, sync to the live site folder and deploy. Exclude `/film` and `/explorations` with the leading slash in the rsync. Without the slash, `film` also matches `assets/film` and the new film never reaches the live folder.

The LinkedIn film and cuts in `RESUMES/Reach/video` show the version in their first four seconds, and the Figma file has its own version label. Update both when the release should show there too.

## Agent surface

The docs render with JavaScript, so an agent that fetches a route gets an empty shell. The machine-readable surface is generated from the same catalog and committed:

- `llms.txt` index of the files below
- `agent/northstar.md` rules, floorplans, patterns, semantic tokens, every component with classes, markup, use and avoid rules, keyboard and accessibility notes
- `agent/components.json` and `agent/tokens.json` the catalog and the token sheet (dark and light values) as JSON

`node tools/agent-export.mjs` regenerates them in headless Chrome (`--check` fails if they are stale). The pre-commit hook regenerates and stages them when the catalog, tokens or page registry change. `node tools/agent-check.mjs <file.html>` validates markup an agent built: unknown ns- classes, raw colors, unknown or primitive tokens, icon buttons without a name, images without alt. `index.html` links the markdown and JSON with `rel="alternate"`.

## Keeping Figma and the site in sync

**Code first.** New components can be built and documented here before they exist in Figma. Set `figma: null` (or leave the node out) in `js/components.js`; the page shows "Waiting for Figma sync", and Component status lists it. List what is waiting with `node tools/figma-sync-check.mjs --queue`. After the next batch sync to Figma, replace `null` with the node ID. Charts are described once in `js/charts.js`, and the same description draws the Figma layers and the docs SVG.

**Copy lint and hook.** `node tools/copy-lint.mjs` fails on em dashes and banned claims in site copy; `figma-sync-check` runs it too. The repo commits `tools/hooks/pre-commit`, which runs the copy lint on staged site files and the fit probe when CSS or components change. Enable it once per clone with `git config core.hooksPath tools/hooks`.

**Fit probe.** `node tools/fit-probe.mjs` renders every component state at 320, 240 and 192px tiles in headless Chrome (no npm install; it finds Chrome or `$CHROME`) and reports overflow, targets under 24px, unnamed controls and chart labels under 9px. `node tools/figma-sync-check.mjs --offline --fit` adds the result to the drift report. It also loads nine routes at window widths of 1920, 1440, 1280, 1024, 768 and 390px and fails if the page scrolls sideways. By-design exceptions (modal, side navigation, XL sizes, full-width alert) are listed at the top of `tools/fit-probe-page.js`.

**Behavior check.** `node tools/behavior-check.mjs` drives the live behaviors in headless Chrome: combobox filtering and tags, command palette filtering and arrows, dropdown keyboard and Escape, toast stacking and pause, the modal focus trap, tab arrows, table sort and select all, redirects for folded components, and on all eight dashboards a row sheet, a confirm dialog with its toast, filter, period, Cmd K, theme and density (at 1440 and 390px).

**Accessibility check.** `node tools/a11y-check.mjs` measures WCAG 2.2 AA text contrast against the composited background and finds controls with no accessible name, for every component state and variant and every dashboard, in dark and light themes. `--list` prints every location.

**Sync gaps.** `node tools/figma-sync-check.mjs` also lists work for the next Figma batch without failing: folded components still published as their own sets, sets whose text is not Open Sans, gradient fills on the Widgets page, and components with no specification frame. `--strict` fails on them.

**Token drift.** `node tools/token-drift.mjs` compares `css/tokens.css` with the Figma variables snapshot in `tokens/figma-variables.json`, mode by mode (Dark, Light, High Contrast, spacing, radius, type, motion). Figma's REST variables API needs an Enterprise plan, so refresh the snapshot during a sync by running `tools/figma-variables-dump.js` through the Figma MCP. Intended differences live in `tokens/drift-allow.json` with a reason.

**Visual check.** `node tools/visual-check.mjs` screenshots every component demo and its first two variants on fixed tiles, plus the eight dashboards, in dark and light, and compares them with the PNG baselines in `tests/visual/baseline`, tile by tile. Changed tiles get a diff image in `tests/visual/diff`. After an intended visual change, run it with `--update` and commit the new baselines. It needs network for Open Sans.

**Counts check.** `node tools/counts-check.mjs` counts the real tokens, components, patterns, dashboards and spec tabs, then fails on any typed number that disagrees: the share description, the agent export, and the case study page when the portfolio folder is on this machine.

**All checks.** `node tools/check-all.mjs` runs everything above in parallel (about 40 seconds) and warns if the Figma token has expired. Run it before publishing. The pre-commit hook runs the same runner with only the checks the staged files touch.

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
