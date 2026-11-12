# NorthStar agent-readiness audit

Date: 2026-11-12. Measured against Nehmat Gereige's "Agent-Ready Design System" playbook (Figma, audit, PLAN.md, tokens, code, catalog, Code Connect, GitHub, new-screen test).
Sources: Figma file VZxmDNQiosTN6gqnvEQ65Z (read-only scan of all 93 pages), repo `main` at aa06b6f.

**Status 2026-11-12:** every Figma and repo item below is resolved, except Code Connect (Figma Pro plan) and the new-screen test, which is still to run. See `DECISIONS.md` for both passes.

## Scorecard

| Playbook stage | NorthStar today | Status |
|---|---|---|
| Colors as variables, light and dark | Semantic / Colors: Dark, Light, High Contrast. Spacing has density modes, Motion has Full/Reduced/None | Done |
| No hard-coded values | Current component sets are mostly bound. Raw fills remain in a handful (list below) | Mostly |
| Text styles | 20 Open Sans styles exist, but component text does not use them | **Gap** |
| Auto layout | Core controls use it. Avatar, Tabs, Switch and the widgets do not | Partial |
| Clear variant and property names | Mixed vocabulary, booleans built as variants | **Gap** |
| Description on every component | 55 of 262 component roots have one. 13 current components and all 41 chart and widget sets have none | **Gap** |
| tokens.json | `agent/tokens.json`, 225 tokens, dark and light values | Done |
| CLAUDE.md for agents | `agent/northstar.md` + `llms.txt` are better than the playbook asks for. No repo-root `CLAUDE.md` pointing at them | Small gap |
| PLAN.md / decision log | Neither exists. House rules call for `DECISIONS.md` | Gap |
| Catalog | The docs site plays Storybook's role (states, a11y, spec, code tabs, visual and behavior checks) | Done, skip Storybook |
| Code Connect | None. The Figma plan is Pro, and Code Connect needs Organization or Enterprise | **Blocked**, use substitutes |
| Package | React kit covers 14 of 58 components inside `dashboards/app`. No published package | Optional |
| GitHub | Public repo, default branch `main` | Done |
| New-screen test from a Figma frame | Agents have built screens from `northstar.md`, never from a Figma frame through MCP | Not done |

## Figma cleanup, by priority

### P1: matters most for code and agents

1. **Variable code syntax.** 166 of 186 variables have no Web code syntax; only the 20 `widget/*` ones do (`var(--ns-widget-bg)`). Without it, Dev Mode and the Figma MCP hand agents Figma names, not `--ns-` tokens. This is the Pro-plan substitute for Code Connect on tokens. Scriptable from `agent/tokens.json`.
2. **Component text is not on styles or variables.** Button, Checkbox and Combobox labels are raw Open Sans at a set size; 88 component sets contain text with no text style. Agents read these as one-off sizes. Apply the existing styles (Label, Body / Default, Button / Medium, Caption) to component text.
3. **Descriptions on every current component**, with the `ns-` class and a doc link. Missing on: Icon button, Toast, Status dot, Bulk action bar, Link, Combobox, Inline edit, Menu, Segmented control, Number stepper, Textarea, Tree view, Command palette, the 20 Widgets sets, the 21 new chart sets (Bar through Bubble), Chart parts and Chart kit. The text can be generated from `agent/components.json`. On Pro this is the main way to point a Figma component at its code.
4. **Duplicate names.** `Chart / Bar`, `Chart / Line` and `Chart / Sankey` each exist twice (legacy widget pages and the new chart pages). `Button (Deprecated)` still holds 640 variants. An agent searching the library cannot tell which is current. Archive the legacy chart pages and the deprecated Button, or unpublish them.
5. **Legacy styles still published.** 38 `Legacy /` paint styles, the `Legacy / Widget Shadow` effect and 13 `Archive /` text styles. Remove or hide from publishing so they stop appearing in pickers and MCP search.

### P2: naming that becomes prop names

6. **Booleans built as variants.** Checkbox and Radio use `Hovered`, `Checked`, `Disabled`, `Show label` as variants. Switch has both `State` and `Disabled`. Target: one `State` variant (Default, Hover, Focus, Disabled), `Checked`/`Selected` variant, `Show label` as a boolean property.
7. **One word for status.** Alert `Type`, Notification `Severity`, Toast `Status`, Badge `Type`, Status dot `Status`. Pick one (`Status` matches the CSS modifiers) and use it everywhere.
8. **Odd property names.** Avatar has a property called `Avatar`; the archived Avatar image uses `Property 1`.
9. **Variable scopes.** 59 variables are set to all scopes (Typography 20, Motion 8, Layout 7, Opacity 6, Semantic Colors 10, Primitive Colors 8). Scope them so spacing only shows in gap and padding pickers, and so on.
10. **Hide primitives from publishing.** All eight collections publish. Agents and designers should pick semantic roles; primitives stay in the file, hidden.

### P3: tidy

11. **Pages.** Nine live components sit under the UTILITIES divider (Link, Combobox, Inline edit, Menu, Segmented control, Number stepper, Textarea, Tree view, Command palette). Move each under its category. The NorthStar logo set lives on the Alert page.
12. **Raw values left in current sets.** Avatar 36, Sankey chart 30, Alert banner 12, Badge 12, Link 9, Tag 8, Icon button 6, Text input 6, Line chart 5, Toast 4. Widgets: Other 85, Line chart 35, Bubble chart 18.
13. **Auto layout.** Avatar (90 frames without it), Tabs (24), Switch (6), Slider (4), Radio and Text input (3 each). Chart plots can stay absolute.
14. **Icons.** 96 icons with no descriptions and loose names: `Restoraunt` (typo), lowercase `stacks` and `avalanche avax`, `Frame`, `24`, two named `Tag`, and a crypto set that does not fit an enterprise console.
15. **Dashboards (original)** holds 26 old components with about 6,500 raw fills. Move to Archive.
16. **Token count.** Figma has 186 variables, the site 225. `token-drift` passes with its allow list, so confirm the 39 site-only tokens are intended to stay code-only.

## Repo refinements

- Add a short repo-root `CLAUDE.md`: Figma file key, "read `agent/northstar.md` first", the check command (`node tools/check-all.mjs`), code-first sync rule, and the four checkpoints from the playbook.
- Start `DECISIONS.md` (Define, Build, Test, Design, Ship) and seed it from the changelog, the 2026-11-08 merges and the 2026-11-09 gradient decision.
- `STYLE-RULES.md` already serves as `design-rules.md`; either rename it or point to it from `CLAUDE.md`.
- Branch cleanup: `northstar-product` is three weeks behind `main` and new worktrees still get cut from it. Work happens on `chart-visual-unify` and is fast-forwarded to `main`. About ten other local branches are stale.
- Run the playbook's step 6: give an agent a Figma frame it has never seen, have it build with NorthStar only, and record the differences. That result is the proof point for "agent-ready".

## Not worth doing

- Storybook. The docs site already is the catalog and is covered by visual, behavior, a11y and fit checks.
- Rebuilding on the playbook's Tailwind + shadcn stack. NorthStar is framework-free CSS with an optional React kit; that is a deliberate choice and already works for agents.
- Code Connect, unless the Figma file moves to an Organization plan.
