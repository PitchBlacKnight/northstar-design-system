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

## 2026-11-12 · New-screen test (playbook step 6)

**Define.** Prove the system is agent-ready: an agent with no context builds a screen it has never seen, from a Figma frame, using only the agent files.

**Build.** A new frame was composed in Figma from NorthStar instances on page "_Agent test · new screen": "Team members · settings" (4762:2541), with breadcrumb, header actions, info alert, tabs, search and role filter, a selectable table with a bulk bar, a plan card and a seats meter. The bulk "Remove" button was left primary on purpose, against the rule that destructive actions use danger. A fresh Sonnet agent got the frame and was allowed to read only `agent/*`, `llms.txt`, `css/tokens.css`, `css/components.css` and `tools/agent-check.mjs`.

**Test.** Output: `tests/agent-screens/team-members.html`. `agent-check`: 43 ns- classes, 17 tokens, clean. No raw colors, no script. Rendered at 1280 it matches the frame's layout and content closely. The agent followed the rules over the frame where they disagreed: Remove became `ns-btn--danger` with a confirmation modal, and status used `ns-dot` in table cells. It also added a "Sample data" line and an accessible table caption.

**Findings (verified):**
- `agent/northstar.md` is 233 KB (2,833 lines). It does not fit one read, so the agent had to grep. It needs an index at the top or one file per component.
- Floorplans and patterns are links to the website, with no markup. There are no page-layout classes, so the agent wrote its own page, body and toolbar CSS. This was the biggest gap.
- Docs and CSS disagree: `ns-alert--default` is documented but not defined; `ns-btn--tertiary` is styled the same as outline, though the docs call it a text button; several component token lists still name primitives or stale values (Alert, Tabs, Button, Select, Progress gradient); `.ns-table-bar.is-batch` and `ns-modal-backdrop` are undocumented; the dark theme value is never stated.
- Behavior has no markup-only story: the checker forbids `<script>`, but the docs' tabs, modal, sort and select-all hooks need `js/`. The agent used the native `popover` attribute for the modal.
- Figma and code differ on Search (Figma rectangle, code pill), Select (Figma border), table header style, card eyebrow and radius, progress track, breadcrumb link color and tab glow.

**Ship.** Results recorded here; the fixes above are open.

## 2026-11-12 · Fixes from the new-screen test (no visual change)

**Define.** Close the gaps the first agent run found, without changing anything a visitor sees on the site.

**Build.**
- `agent/northstar.md` is now an index (33 KB, was 233 KB): rules, layout, templates, a component table and semantic tokens. Each component has its own file in `agent/components/`, each pattern its own in `agent/patterns/`. The exporter removes orphaned files.
- New layout classes in `components.css`, unused by the site: `ns-app` (`--no-nav`, `__nav`, `__main`), `ns-page-head` (`__text`, `__eyebrow`, `__title`, `__desc`, `__actions`), `ns-stack`, `ns-cluster`, `ns-split`, `ns-columns`, `ns-body`, `ns-field--grow`, `ns-visually-hidden`, `ns-card__eyebrow`. The modifiers `ns-alert--default` and `ns-alert--accent` are now defined with the same values as the base alert.
- Four runnable templates in `agent/templates/` (analytical list, object detail, settings form, dashboard). They are checked in `check-all`.
- Docs corrected to match the CSS: 22 token-list entries that named primitives or old values, the tertiary button description, the dark theme value, `is-batch`, `is-selected`, the modal backdrop, and the progress `--_v` hook. A Behavior section explains that NorthStar ships markup and CSS, not a script.
- Figma matched to the code: fields (borderless, 4px corners, search as a pill), card (8px corners, overline eyebrow), progress (bare 6px track), alert (4px corners), table header (overline) and status cells (ns-dot style), breadcrumb (teal links, primary current page), tab underline (no glow).

**Rejected.** A standalone behavior script pulled out of `js/ui.js`: that file mixes component behavior with docs demos, so extracting it would risk changing the site. Restyling the tertiary button: it would change about 35 buttons on the site.

**Test.** A pixel comparison of the live site and the new build at 1440px, on 12 pages including the dashboards index and three dashboards, found 0 changed pixels. `check-all`: 12 of 12 pass. A second fresh Sonnet agent rebuilt the same frame from the new files: 0 lines of custom CSS (the first run wrote its own page CSS), 14 tool calls (was about 20), and a clean checker run. It copied most of the screen from the templates. Its remaining notes (no-nav shell, body margin, aside width, toolbar field width, hidden caption, confirm pattern, `--_v`, tab panel ids) were fixed in the same pass.

**Ship.** Published with this commit.

**Open.** A real behavior script for agents, and the type scale: the CSS `--ns-type-h1`..`h6` sizes are a different scale from the Figma Heading styles (CSS h2 is 60px; Figma Heading / H2 is 24px).

## 2026-11-12 · Behavior script for agent-built pages (no visual change)

**Define.** Agents could write correct NorthStar markup but not make it work: the docs site's behavior lives in `js/ui.js`, mixed with docs-only demo code, and the checker rejected any script.

**Build.** `js/ns-behavior.js`, a standalone file (no dependencies) that wires the documented markup: tabs with panels, menus, radio groups and segmented controls, tree view, dropdown, popover, modal (open by id, focus trap, Escape, backdrop and data-close, focus return), dismiss, table selection and sorting, pagination, stepper, slider, textarea counters, combobox, command palette and toasts. It fires ns:* events for apps and exposes `NorthStar.toast`, `openModal`, `closeModal`, `sortTable`, `selectTab`. It changes no styles. The docs site does not load it; `js/ui.js` is untouched. `agent-check` now allows exactly one script, `js/ns-behavior.js` by src, and still rejects inline scripts and any other file. Two CSS rules let markup keep closed things in the page: `.ns-modal-backdrop[hidden]` and `[role=tabpanel][hidden]` now hide (the site never sets either). Templates load the script; the analytical list gained a confirmation modal and sort and selection hooks, and object detail has three linked tab panels. Agent docs gained a Load the behavior script rule plus modal and tabs notes (the docs-site `icon-btn` close button is replaced by `ns-btn ns-btn--ghost ns-btn--icon` in agent markup).

**Rejected.** Moving the site onto the new script: it would mean rewiring `js/ui.js` and its demos, a change to how the site behaves, which was out of scope.

**Test.** `tools/behavior-script-check.mjs` builds a page from the markup in `agent/components.json` and runs 49 interaction checks in headless Chrome. All pass, and a deliberately broken script failed 3 of them. It runs in `check-all`. The templates were also driven in a real browser: sort, the modal opening with focus inside, Escape returning focus, selection counts and tab panels. A pixel comparison of 12 site pages (tabs, modal, table, combobox, command palette, tree, alert, a floorplan, home and dashboards) against the live site found 0 changed pixels. `check-all`: 13 of 13 pass.

**Ship.** Published with this commit.

## 2026-11-12 · Type scale: Figma styles linked to the CSS tokens (no visual change on the site)

**Define.** Figma's text styles Heading / H1 to H4 (32, 24, 20, 16px) share names with the CSS tokens `--ns-type-h1` to `-h6` (72, 60, 48, 28, 24, 20px), a different, larger display scale. No text style was linked to a type variable, so Dev Mode and agents could not tell that Heading / H3 is `h6`, not `h3`.

**Build.** In Figma, every product text style is linked to the type variables it equals (size, line height, and tracking for Overline) and carries a description naming its CSS tokens. Two variables were added to mirror existing CSS tokens: `font-size/chart` and `line-height/chart`. Overline was the one real disagreement: Figma 10/14 with 1px tracking against code 10/16 with 1.5px. Figma now matches the code, which made Command palette and Card 2px taller in Figma. The two scales are documented in `tokens.css` (a comment), `STYLE-RULES.md` and the agent guide's new Type scale rule.

**Rejected.** Renaming or resizing the CSS `h1` to `h6` tokens to match Figma: the site's Typography page and about 20 components use them, so it would change the site. Adding new CSS heading tokens (32/40 and 24/32): the site counts its tokens live, so the home counter and token reference would change. Renaming the Figma styles: linking and describing them removes the ambiguity without breaking anyone's habits.

**Test.** Pixel comparison of Home, Typography, Tokens and Dashboards against the live site: 0 changed pixels. `check-all`: 13 of 13 pass.

**Open.** Heading / H1 (32/40) and the 32px line under Heading / H2 have no CSS token. Closing that means adding tokens, which changes the visible token count from 231.
