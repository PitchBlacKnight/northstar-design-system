# NorthStar decision log

Each entry: the problem, options rejected and why, what was tested, what shipped. Labels: Define, Build, Test, Design, Ship.

## 2026-11-12 · Agent-readiness cleanup of the Figma file

**Define.** An audit against the "Agent-Ready Design System" playbook (see `AGENT-READINESS-AUDIT.md`) found the code side ready for agents and the Figma side behind: 166 of 186 variables had no CSS name, 59 showed in every property picker, component text sat outside the text styles, 207 of 262 components had no description, and legacy styles and duplicate chart sets were still published.

**Build.**
- Web code syntax on 174 variables, taken from `css/tokens.css` with the same name mapping as `tools/token-drift.mjs`. Twelve have no CSS token (`accent/*`, `opacity/*`) and were left without one.
- Scopes on the 59 all-scope variables: colors to fills and strokes, font size and line height to their fields, opacity to opacity, motion, breakpoints and primitive colors to none.
- Text styles applied to 1,494 text layers in current components, only where the layer already matched a style exactly, so nothing moved. New style `Chart / Label` (Open Sans 11/16) matches the existing `--ns-type-chart-size` and `--ns-type-chart-line` tokens.
- Descriptions on 61 component sets, written from `agent/components.json` and the widget family list, each naming its `ns-` classes. Doc links added to the 21 Widgets sets.
- Hidden from publishing with a leading underscore, not deleted: 38 Legacy paint styles, the Legacy widget shadow, 13 Archive text styles, Button (Deprecated) and the four legacy chart sets. `Primitives / Colors` hidden from publishing.
- Nine component pages moved from Utilities into their sections. Legacy chart pages, Dashboards (original) and Chart kit moved to the end and prefixed "Archive · ". `tools/figma-sync-check.mjs` skips that prefix.

**Rejected.**
- Code Connect: needs a Figma Organization or Enterprise plan; this file is on Pro. Code syntax plus descriptions with class names is the substitute.
- Storybook and a Tailwind plus shadcn rebuild: the docs site already does the catalog job with visual, behavior, accessibility and fit checks, and the framework-free CSS already works for agents.
- Deleting legacy styles and sets: hiding keeps every old instance intact and is reversible.
- Renaming properties now (Severity, Information, Avatar, booleans built as variants): the spec frames and `js/specs.js` quote these names, so a rename belongs in a batch that also regenerates the specs.

**Test.** `node tools/figma-sync-check.mjs` reports no drift after the changes. Spot screenshot of the Select set showed no layout shift.

**Ship.** Figma changes are in the file now. A backup copy of the Figma file was made first, and the live site folder was copied to a dated local backup, with git tag `live-2026-11-12` on `main`. Repo changes are on branch `claude/north-star-design-cleanup-b37580`, not merged.

**Open.** 410 text layers in 35 sets use sizes with no style (bold 24/32 and 28/36 values, 11/14 labels): each needs a proposed token first. 17 Informers and Mini indicators have no description and no docs page. Property renames above. Raw fills and missing auto layout in Avatar, Tabs, Switch and the Widgets sets. Icon names (Restoraunt, stacks, two Tags) need the Figma names and `assets/icons` changed together.
