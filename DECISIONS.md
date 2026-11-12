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

**Open at the end of the first pass (resolved below).** 410 text layers in 35 sets use sizes with no style (bold 24/32 and 28/36 values, 11/14 labels): each needs a proposed token first. 17 Informers and Mini indicators have no description and no docs page. Property renames above. Raw fills and missing auto layout in Avatar, Tabs, Switch and the Widgets sets. Icon names (Restoraunt, stacks, two Tags) need the Figma names and `assets/icons` changed together.

## 2026-11-12 · Agent-readiness cleanup, second pass

**Define.** Close every item left open by the first pass, and make new worktrees start from `main` (`origin/HEAD` pointed at the old `northstar-product`).

**Build.**
- `git remote set-head origin main`, so new worktrees are cut from current code.
- Text: three new styles that copy the CSS chart header exactly (`Chart / Value` 700 28/36, `Chart / Value small` 700 24/32, `Chart / Label small` 11/14). Toast, Switch, Tag, Command palette, Pagination, Progress and the chart parts now use the style that matches their CSS. Tag Medium was pinned back to 36px after the style grew it to 40.
- Color: every raw or legacy-style color in current components is bound to a semantic variable. Real defects fixed on the way: Link labels and Toast actions were black, Tabs selection was purple instead of `interactive/primary`, Line and Sankey charts had black outlines (35 removed), and Alert banner used solid fills and the deprecated Button. Alert banner now matches `.ns-alert`: status tint, status icon, primary title, secondary body.
- Layout: Tabs are auto layout with equal-width tabs and a stretching underline. This also fixed a first tab that was clipped at x = -37.
- Properties: Checkbox, Radio button and Switch have one `State` (Default, Hover, Disabled), their checked or selected variant, and a `Show label` boolean. The bare controls moved to private sets (`_Checkbox / Control`, `_Radio button / Control`, `_Switch / Control`) because the labeled variants are built from them. 44 instances across the file were moved to the labeled variant with the label off. Notification `Severity` and Alert banner `Type` are now `Status`, Toast `Information` is `Info`, Avatar `Avatar` is `Content`. Spec frames, `js/specs.js` (edited in place) and the docs axes were updated to match.
- Tokens: six `--ns-opacity-*` tokens added to `tokens.css` to match Figma; the seven disabled rules now use `--ns-opacity-disabled` (0.4, previously 0.45, 0.4 or 0.35). `accent/*` variables point to the matching `--ns-*-500` primitives. All 186 variables now have Web code syntax. Typed token counts moved from 225 to 231.
- Archive: Informers and Mini indicators (18 components, no docs page, replaced by Widget / Informer) moved to "Archive · Informers & Mini indicators" and hidden from publishing.
- Icons: Restaurant (was Restoraunt), Stacks, Avalanche AVAX, Bookmark (second "Tag"), Log in (was "Frame"), 24 hours (was "24"). Figma names, file names and `manifest.json` changed together.
- Chat: component set on a new Chat page (State: Conversation, Empty, Thinking, Error), built on the same tokens as `.ns-chat`, plus spec frame 4760:2095 and its Spec tab. `js/components.js` links it.
- `figma-sync-check` ignores private sets whose names start with `_` or `.`.

**Rejected.**
- Auto layout on Avatar, Switch, Slider and Radio internals: the shapes overlap on purpose (handle on track, status dot on avatar). Text input focus frames overlap their ring the same way.
- Re-running `figma-spec-extract` over the six edited spec frames: it flattened the hand-written state matrices, so those entries were edited in place instead. New frames (Chat) still use the extractor.
- Styling Avatar initials (7 to 9px, scaled with the avatar) and the Number stepper glyphs: they are icon-like and scale with their container, not type.

**Test.** `node tools/check-all.mjs`: all 11 checks pass, including the online Figma drift check in strict mode and the visual baselines. Every visual change was screenshotted on a dark surface in Figma.

**Ship.** Not published. Branch `claude/north-star-design-cleanup-b37580`. The portfolio case study page types the token count; it was not on this machine during the check and needs 225 changed to 231 when it is published.
