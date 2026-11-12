# NorthStar Design System v1.5.0

> Machine-readable guide for AI coding and design agents. Generated 2026-11-12 from the live catalog by tools/agent-export.mjs; do not edit by hand. Site: https://mikelrosenthal.com/northstar/ · Figma file VZxmDNQiosTN6gqnvEQ65Z.

NorthStar is a design language and development kit for dense, dark, data-heavy enterprise consoles: 58 components, 231 tokens, dark and light themes, comfortable and compact density. Markup is framework-free HTML with ns- classes; style comes only from CSS custom properties.

## Files

- https://mikelrosenthal.com/northstar/agent/northstar.md this file: rules, layout, templates, the component index and semantic tokens
- https://mikelrosenthal.com/northstar/agent/components/<id>.md one file per component (listed in the Components table)
- https://mikelrosenthal.com/northstar/agent/templates/ runnable page templates to copy
- https://mikelrosenthal.com/northstar/agent/patterns/<id>.md one file per pattern
- https://mikelrosenthal.com/northstar/agent/components.json every component: classes, variants with markup, use and avoid rules, tokens, props, keyboard, accessibility
- https://mikelrosenthal.com/northstar/agent/tokens.json every --ns- token with its dark and light value
- https://mikelrosenthal.com/northstar/css/tokens.css and https://mikelrosenthal.com/northstar/css/components.css the stylesheets to link
- https://mikelrosenthal.com/northstar/#/getting-started/agent-guide the human version of these rules

## Quick start

1. Find the page. Pick the closest floorplan or pattern below.
2. Fill it with components. Use the component entries for markup, states and rules.
3. Style with tokens. Set theme and density on the html element and use only semantic tokens.

## Build

- **Components first.** Read the component entry before writing markup. Treat every Avoid line as a hard limit.
- **Start from a page template.** Copy the closest file in agent/templates/ (listed under Templates) and change the content, not the structure. Floorplan pages on the site are for people; the templates are the markup to copy.
- **Page layout.** Use the layout classes for everything between components: ns-app (shell with an ns-app__nav slot and ns-app__main), ns-page-head (with __text, __eyebrow, __title, __desc, __actions), ns-stack (vertical gap; --sm, --lg), ns-cluster (wrapping row for toolbars and filters; --center, --between), ns-split (main plus an aside, 320px by default; set --ns-split-aside to change it) and ns-columns (equal columns; --2, --4). Use ns-app--no-nav when the page has no side navigation, and --ns-app-nav-width to change the nav column. Put ns-body on the body element (it removes the browser margin and sets the page background). In a toolbar, ns-field--grow lets a field fill the row (set --ns-field-basis for its starting width). ns-visually-hidden hides text from sight but keeps it for screen readers, for example a table caption. Do not write your own page CSS when one of these fits.
- **Use the class names.** Each component lists its ns- classes. If a component has no class, build it from tokens and say so in the handoff.

## Style

- **Tokens only.** Never write raw hex, rgb, pixel colors or font names in components. Use the --ns- semantic roles. Primitives (--ns-gray-*, --ns-blue-500 and so on) are for the token sheet, not for components.
- **Modes on the root.** Set theme and density once on the html element: data-theme="light" for light, no data-theme for dark (dark is the default) and data-density="compact". Never recolor a component to fake a mode.
- **Load the sheets.** Link https://mikelrosenthal.com/northstar/css/tokens.css then https://mikelrosenthal.com/northstar/css/components.css, and the fonts: <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">. No framework is required.
- **Spacing, text and surfaces.** Gaps and padding use --ns-space-1 to --ns-space-12 (the scale is in the Semantic tokens section). Text color comes from --ns-text-primary, -secondary, -tertiary; surfaces from --ns-background-primary, -surface, -elevated. Error text uses --ns-status-error. Keep forms single column, max-width 480px (a px max-width is acceptable for page layout only, never inside a component).
- **States.** Field errors: add is-error to the ns-field wrapper; it styles the input, select or textarea inside and turns the ns-helper red, so repeat the message in the helper and add aria-invalid="true" and aria-describedby on the control. Control states (is-hover, is-focus, is-pressed, is-open) go on the control itself. A page-level error summary is an ns-alert ns-alert--error with a list of ns-link anchors to the fields, placed above the form and focused on submit.
- **Button emphasis.** ns-btn is primary (one per view). ns-btn--secondary, ns-btn--outline and ns-btn--ghost step down. ns-btn--tertiary is the Cancel and dialog-dismiss button; it looks the same as ns-btn--outline (transparent with a border). ns-btn--danger is for destructive actions and is always confirmed.
- **Two status indicators.** ns-dot is the small uppercase chip for table cells (--success, --warning, --error, --neutral). ns-status-dot is the body-text indicator for lists and detail pages (--positive, --critical, --negative, --informative). Do not mix them in one view.

## Behavior

- **Load the behavior script.** Add <script src="https://mikelrosenthal.com/northstar/js/ns-behavior.js" defer></script> after the stylesheets. It wires the documented markup with keyboard and ARIA behavior and changes nothing visually: tabs (role=tablist, role=tab with aria-controls, role=tabpanel panels), menus, radio groups and segmented controls, tree view, dropdown (data-dd), popover (data-popover), modal (data-open-modal="id" on the trigger, a hidden ns-modal-backdrop with that id, data-close on Cancel and the close button), dismiss (ns-alert__close, ns-notice__close, data-dismiss), table selection and sorting (data-select-all, data-row-select, data-batch-label with data-default, th data-sort), pagination, stepper, slider, textarea counters, combobox, command palette and toasts (a data-toast button, or NorthStar.toast(title, body, kind)). It is the only script the checker allows. Apps can listen for ns:tab, ns:select, ns:sort, ns:page, ns:pick, ns:modal-open and ns:modal-close.
- **Without the script.** The markup still renders correctly; it is just static. In that case use native HTML where it exists: details and summary for disclosure, a dialog element for a modal.
- **States to show.** Selected table rows get is-selected on the tr. A selection toolbar is ns-table-bar inside ns-table-wrap; add is-batch while rows are selected. A modal is an ns-modal inside an ns-modal-backdrop. Confirm every destructive action in an ns-modal ns-modal--sm that names what will change (for example Remove 2 members) with ns-btn--danger and a tertiary Cancel. The only inline style allowed in markup is a component hook such as --_v on ns-progress__bar (the bar value). Each screen should also show its empty, loading and error states where they apply.

## Content

- **Generated content.** Label anything a model wrote as generated, and cite the record it came from. Actions that change records or move money go through a confirmation step.
- **Sample data.** Mark invented names and numbers as sample data: one <p class="ns-helper">Sample data</p> line above the view. Never present them as real records.
- **Words.** Sentence case, verb-first button labels, no exclamation marks.

## Check

- **Run the checker.** node tools/agent-check.mjs <file.html> fails on unknown ns- classes, raw colors, unknown tokens and icon buttons without a name.

## Floorplans (site pages for people; copy agent/templates instead)

- **Dashboard** (https://mikelrosenthal.com/northstar/#/floorplans/dashboard) KPI tiles, trend, mix, and an account table. One job per tile.
- **Analytical list** (https://mikelrosenthal.com/northstar/#/floorplans/analytical-list) Filter bar, sortable table, bulk actions, and pagination for working through many records.
- **Object detail** (https://mikelrosenthal.com/northstar/#/floorplans/object-detail) Object header with status and actions, tab strip, and structured detail sections.
- **Guided wizard** (https://mikelrosenthal.com/northstar/#/floorplans/wizard) A five-step progress rail, one task per step, validation before moving on, and clear back and next.
- **Approval queue** (https://mikelrosenthal.com/northstar/#/floorplans/approval-queue) Risk meters, flag badges, and accept or reject actions for fast, careful review.
- **Learner progress** (https://mikelrosenthal.com/northstar/#/floorplans/learner-progress) A cohort at a glance: completion, activity, goal progress, streaks and who needs attention. One job per tile.
- **Enrollment health** (https://mikelrosenthal.com/northstar/#/floorplans/enrollment-health) Where enrollment narrows, which stages need attention, and which enrollments have stalled. One job per tile.

## Patterns

- **Forms** (https://mikelrosenthal.com/northstar/#/patterns/forms) Forms collect information. NorthStar forms are single-column by default, validate on blur, and summarize errors on submit.
- **Modal dialogs** (https://mikelrosenthal.com/northstar/#/patterns/modal-dialogs) Use modal dialogs for decisions that must happen now. Everything else belongs in the page.
- **Table views** (https://mikelrosenthal.com/northstar/#/patterns/table-views) How search, filters, batch actions, and pagination combine around a data table.
- **Empty states** (https://mikelrosenthal.com/northstar/#/patterns/empty-states) Empty states explain why there is nothing here and what to do next.
- **Loading** (https://mikelrosenthal.com/northstar/#/patterns/loading) Choose the loading treatment by how long the wait is and how much of the page is affected.
- **Search and filter** (https://mikelrosenthal.com/northstar/#/patterns/search-filter) Search narrows by keyword; filters narrow by attribute. Show both states clearly and make them easy to undo.
- **Errors** (https://mikelrosenthal.com/northstar/#/patterns/errors) Good errors say what happened, why, and how to fix it, at the level where the problem happened.
- **Production patterns** (https://mikelrosenthal.com/northstar/#/patterns/production) Production-ready UI patterns, states, and system specifications from the Figma Patterns page.
- **Create account workflow** (https://mikelrosenthal.com/northstar/#/patterns/create-account) A composed form showing entry, actionable validation and a success outcome on one surface. Synced from the Figma workflow showcase; all account values are demo data.

## Foundations

- **How tokens work** (https://mikelrosenthal.com/northstar/#/foundations/how-tokens-work) Four words, one naming pattern, and one layering rule. Learn these and every token in NorthStar becomes predictable.
- **Color System** (https://mikelrosenthal.com/northstar/#/foundations/color) Our enterprise color structure is divided into primitive scale ramps and strict semantic roles mapping directly to dark and light templates.
- **Typography** (https://mikelrosenthal.com/northstar/#/foundations/typography) A compact hierarchy for data-dense interfaces, readable content, and clear dashboard emphasis. Open Sans for UI and content, JetBrains Mono for data and code.
- **Spacing and layout** (https://mikelrosenthal.com/northstar/#/foundations/spacing) A consistent spacing scale governs padding, gaps, alignment, and rhythm. Responsive breakpoints and a 12-column grid support dashboards from compact to wide.
- **Radius** (https://mikelrosenthal.com/northstar/#/foundations/radius) Corner treatments range from precise technical controls to fully rounded status elements.
- **Elevation** (https://mikelrosenthal.com/northstar/#/foundations/elevation) Elevation clarifies hierarchy without overwhelming dense interfaces. Use the lowest level that communicates the relationship.
- **Motion** (https://mikelrosenthal.com/northstar/#/foundations/motion) Motion communicates state change. Use fast durations for local feedback and slower ones only for large spatial transitions. Reduced-motion preferences are respected automatically.
- **Iconography** (https://mikelrosenthal.com/northstar/#/foundations/iconography) 95 icons exported from the Figma Icons page: a 24px set, an 18px mini set, and a status set. Every icon uses currentColor, so it follows text and state tokens.
- **Themes** (https://mikelrosenthal.com/northstar/#/foundations/themes) Dark is the default. Light is a full override layer on the same semantic roles, so components never change structure between modes.
- **Token reference** (https://mikelrosenthal.com/northstar/#/foundations/tokens) Every NorthStar design token as a CSS custom property. Filter, click to copy, and see live values for the current theme.
- **Logo** (https://mikelrosenthal.com/northstar/#/foundations/logo) The NorthStar DS logo is a wordmark with the mark standing in for the A: a chevron with a star on its tip. The mark also works on its own where space is short.
- **Content and voice** (https://mikelrosenthal.com/northstar/#/foundations/content-voice) How NorthStar writes labels, errors, empty states and generated text. Apply these rules to anything a product or this site shows.

## Semantic tokens

Use these roles in components. Values are the dark theme; light overrides are in tokens.json.

### background

| Token | Dark | Light |
|---|---|---|
| `--ns-background-elevated` | #191932 | #ffffff |
| `--ns-background-hover` | #ffffff0d | #05050f0a |
| `--ns-background-inverse` | #ffffff | #05050f |
| `--ns-background-primary` | #05050f | #ffffff |
| `--ns-background-secondary` | #0b0b16 | #f5f5ff |
| `--ns-background-selected` | #16163a | #e8edff |
| `--ns-background-shell` | #0c0c14 | #fafaff |
| `--ns-background-surface` | #0e0e18 | #ffffff |

### border

| Token | Dark | Light |
|---|---|---|
| `--ns-border-default` | #2c2c35 | #a9a9b7 |
| `--ns-border-strong` | #5b5b65 | #70707c |
| `--ns-border-strong-01` | #5b5b65 | #70707c |
| `--ns-border-strong-02` | #70707c | same |
| `--ns-border-strong-03` | #70707c | same |
| `--ns-border-subtle` | #1e1e24 | #d0d0da |
| `--ns-border-subtle-01` | #1e1e24 | #d0d0da |
| `--ns-border-subtle-02` | #2a2a45 | #d0d0da |
| `--ns-border-subtle-03` | #35355a | #d0d0da |

### breakpoint

| Token | Dark | Light |
|---|---|---|
| `--ns-breakpoint-compact` | 480px | same |
| `--ns-breakpoint-expanded` | 1280px | same |
| `--ns-breakpoint-medium` | 768px | same |
| `--ns-breakpoint-wide` | 1600px | same |

### chart

| Token | Dark | Light |
|---|---|---|
| `--ns-chart-axis-size` | 11px | same |
| `--ns-chart-bar-radius` | 12px | same |
| `--ns-chart-cap` | round | same |
| `--ns-chart-grid-stroke` | 1px | same |
| `--ns-chart-label-text` | #8f8fc0 | #5a5a8f |
| `--ns-chart-marker` | #5050ff | same |
| `--ns-chart-ramp-fade` | 42% | same |
| `--ns-chart-ramp-from` | #2858ff | #023aff |
| `--ns-chart-series-1` | #01f1e3 | #00a097 |
| `--ns-chart-series-2` | #2858ff | #023aff |
| `--ns-chart-series-3` | #991bfa | same |
| `--ns-chart-series-4` | #7844f9 | #4807ea |
| `--ns-chart-series-5` | #6a6a9f | #5a5a8f |
| `--ns-chart-sheen` | linear-gradient(150deg, transparent 0%, transparent 42%, color-mix(in srgb, #000000 26%, transparent) 100%) | same |
| `--ns-chart-sheen-light` | linear-gradient(150deg, color-mix(in srgb, #ffffff 22%, transparent) 0%, transparent 58%) | same |
| `--ns-chart-stroke` | 2.5px | same |
| `--ns-chart-stroke-thin` | 1.5px | same |
| `--ns-chart-target` | #ffffff | #05050f |
| `--ns-chart-track` | #0e0e22 | #e6e6f2 |
| `--ns-chart-trend-text` | #5eff5a | #2a7a00 |

### content

| Token | Dark | Light |
|---|---|---|
| `--ns-content-max-width` | 1440px | same |

### density

| Token | Dark | Light |
|---|---|---|
| `--ns-density-control` | 40px | same |
| `--ns-density-control-sm` | 32px | same |
| `--ns-density-pad-x` | 16px | same |
| `--ns-density-row-y` | 12px | same |

### duration

| Token | Dark | Light |
|---|---|---|
| `--ns-duration-base` | 200ms | same |
| `--ns-duration-expressive` | 500ms | same |
| `--ns-duration-fast` | 100ms | same |
| `--ns-duration-instant` | 0ms | same |
| `--ns-duration-slow` | 320ms | same |

### easing

| Token | Dark | Light |
|---|---|---|
| `--ns-easing-enter` | cubic-bezier(0, 0, 0, 1) | same |
| `--ns-easing-exit` | cubic-bezier(0.3, 0, 1, 1) | same |
| `--ns-easing-standard` | cubic-bezier(0.2, 0, 0, 1) | same |

### elevation

| Token | Dark | Light |
|---|---|---|
| `--ns-elevation-01` | 0 1px 2px #00000066, 0 0 0 1px #1e1e24 | 0 1px 2px #05050f14, 0 0 0 1px #d0d0da |
| `--ns-elevation-02` | 0 4px 12px #00000080, 0 0 0 1px #2c2c35 | 0 4px 12px #05050f1a, 0 0 0 1px #d0d0da |
| `--ns-elevation-03` | 0 12px 32px #000000a6, 0 0 0 1px #2c2c35 | 0 12px 32px #05050f24, 0 0 0 1px #d0d0da |
| `--ns-elevation-04` | 0 24px 64px #000000cc, 0 0 0 1px #5b5b65, 0 0 40px #023aff33 | 0 24px 64px #05050f33, 0 0 0 1px #a9a9b7 |

### field

| Token | Dark | Light |
|---|---|---|
| `--ns-field-01` | #121216 | #ffffff |
| `--ns-field-02` | #1f1f3c | #f5f5ff |
| `--ns-field-03` | #28284e | #ffffff |
| `--ns-field-bg` | #121216 | #f5f5ff |
| `--ns-field-hover-01` | #1a1a22 | #f5f5ff |
| `--ns-field-hover-02` | #28284a | #e8e8f5 |
| `--ns-field-hover-03` | #32325c | #f5f5ff |

### focus

| Token | Dark | Light |
|---|---|---|
| `--ns-focus-field` | #3506ef | same |
| `--ns-focus-ring` | #01f1e3 | #006b65 |

### font

| Token | Dark | Light |
|---|---|---|
| `--ns-font-mono` | "JetBrains Mono", ui-monospace, "SF Mono", Menlo, monospace | same |
| `--ns-font-sans` | "Open Sans", system-ui, -apple-system, "Segoe UI", sans-serif | same |
| `--ns-font-ui` | "Open Sans", system-ui, -apple-system, "Segoe UI", sans-serif | same |

### gradient

| Token | Dark | Light |
|---|---|---|
| `--ns-gradient-brand` | linear-gradient(135deg, #023aff, #01f1e3) | same |
| `--ns-gradient-bruise` | linear-gradient(135deg, #4807ea, #991bfa) | same |
| `--ns-gradient-bubble` | linear-gradient(180deg, #22d3ff, #1e6bff) | same |
| `--ns-gradient-glow` | radial-gradient(120% 90% at 85% 0%, #22d3ff 0%, #0a5cff 28%, #0b1a55 48%, transparent 70%) | same |
| `--ns-gradient-purple` | linear-gradient(180deg, #d91cff, #7a12ff) | same |

### grid

| Token | Dark | Light |
|---|---|---|
| `--ns-grid-columns` | 12 | same |
| `--ns-grid-gutter` | 24px | same |

### interactive

| Token | Dark | Light |
|---|---|---|
| `--ns-interactive-danger` | #cc1a54 | #930020 |
| `--ns-interactive-danger-active` | #a31443 | #76001a |
| `--ns-interactive-danger-hover` | #b8174c | #84001d |
| `--ns-interactive-ghost-hover` | #ffffff12 | #05050f0d |
| `--ns-interactive-primary` | #023aff | same |
| `--ns-interactive-primary-active` | #022ecc | same |
| `--ns-interactive-primary-hover` | #3506ef | same |
| `--ns-interactive-secondary` | #991bfa | same |
| `--ns-interactive-secondary-bg` | #1e1e24 | #f5f5ff |
| `--ns-interactive-secondary-hover` | #2c2c35 | #d0d0da |

### layer

| Token | Dark | Light |
|---|---|---|
| `--ns-layer-01` | #0e0e18 | #f5f5ff |
| `--ns-layer-02` | #191932 | #ffffff |
| `--ns-layer-03` | #222244 | #f5f5ff |
| `--ns-layer-hover-01` | #181826 | #e8e8f5 |
| `--ns-layer-hover-02` | #212142 | #f5f5ff |
| `--ns-layer-hover-03` | #2b2b52 | #e8e8f5 |
| `--ns-layer-selected-01` | #1a1a3a | #e0e7ff |
| `--ns-layer-selected-02` | #22224a | #e8edff |
| `--ns-layer-selected-03` | #2a2a58 | #e0e7ff |

### logo

| Token | Dark | Light |
|---|---|---|
| `--ns-logo-star` | #27bdfa | #023aff |

### opacity

| Token | Dark | Light |
|---|---|---|
| `--ns-opacity-disabled` | 0.4 | same |
| `--ns-opacity-full` | 1 | same |
| `--ns-opacity-hover` | 0.08 | same |
| `--ns-opacity-overlay` | 0.72 | same |
| `--ns-opacity-pressed` | 0.16 | same |
| `--ns-opacity-subtle` | 0.64 | same |

### radius

| Token | Dark | Light |
|---|---|---|
| `--ns-radius-2xl` | 16px | same |
| `--ns-radius-3xl` | 24px | same |
| `--ns-radius-full` | 9999px | same |
| `--ns-radius-lg` | 8px | same |
| `--ns-radius-md` | 6px | same |
| `--ns-radius-none` | 0px | same |
| `--ns-radius-sm` | 4px | same |
| `--ns-radius-xl` | 12px | same |
| `--ns-radius-xs` | 2px | same |

### space

| Token | Dark | Light |
|---|---|---|
| `--ns-space-0` | 0px | same |
| `--ns-space-1` | 2px | same |
| `--ns-space-10` | 48px | same |
| `--ns-space-11` | 64px | same |
| `--ns-space-12` | 80px | same |
| `--ns-space-13` | 96px | same |
| `--ns-space-14` | 120px | same |
| `--ns-space-2` | 4px | same |
| `--ns-space-3` | 8px | same |
| `--ns-space-4` | 12px | same |
| `--ns-space-5` | 16px | same |
| `--ns-space-6` | 20px | same |
| `--ns-space-7` | 24px | same |
| `--ns-space-8` | 32px | same |
| `--ns-space-9` | 40px | same |

### status

| Token | Dark | Light |
|---|---|---|
| `--ns-status-error` | #ff2069 | #b80028 |
| `--ns-status-error-bg` | #ff206914 | #ff2d2e14 |
| `--ns-status-info` | #4d7cff | #023aff |
| `--ns-status-info-bg` | #023aff1f | #023aff12 |
| `--ns-status-success` | #5eff5a | #267000 |
| `--ns-status-success-bg` | #5eff5a14 | #73be031a |
| `--ns-status-warning` | #ffa63f | #944e00 |
| `--ns-status-warning-bg` | #ffa63f14 | #ffa63f1f |

### text

| Token | Dark | Light |
|---|---|---|
| `--ns-text-accent` | #01f1e3 | #006b65 |
| `--ns-text-disabled` | #5b5b65 | #a9a9b7 |
| `--ns-text-inverse` | #05050f | #ffffff |
| `--ns-text-link` | #01f1e3 | #006b65 |
| `--ns-text-on-color` | #ffffff | same |
| `--ns-text-primary` | #ffffff | #05050f |
| `--ns-text-secondary` | #a9a9b7 | #40404a |
| `--ns-text-tertiary` | #8a8a98 | #5b5b65 |

### type

| Token | Dark | Light |
|---|---|---|
| `--ns-type-body1-line` | 24px | same |
| `--ns-type-body1-size` | 16px | same |
| `--ns-type-body1-tracking` | 0.44px | same |
| `--ns-type-body2-line` | 20px | same |
| `--ns-type-body2-size` | 14px | same |
| `--ns-type-body2-tracking` | 0.25px | same |
| `--ns-type-body3-line` | 18px | same |
| `--ns-type-body3-size` | 13px | same |
| `--ns-type-button-line` | 20px | same |
| `--ns-type-button-size` | 14px | same |
| `--ns-type-caption-line` | 16px | same |
| `--ns-type-caption-size` | 12px | same |
| `--ns-type-caption-tracking` | 0.4px | same |
| `--ns-type-chart-line` | 16px | same |
| `--ns-type-chart-size` | 11px | same |
| `--ns-type-chart-title-size` | 12px | same |
| `--ns-type-h1-line` | 118px | same |
| `--ns-type-h1-size` | 72px | same |
| `--ns-type-h1-weight` | 800 | same |
| `--ns-type-h2-line` | 80px | same |
| `--ns-type-h2-size` | 60px | same |
| `--ns-type-h2-weight` | 800 | same |
| `--ns-type-h3-line` | 56px | same |
| `--ns-type-h3-size` | 48px | same |
| `--ns-type-h3-weight` | 700 | same |
| `--ns-type-h4-line` | 36px | same |
| `--ns-type-h4-size` | 28px | same |
| `--ns-type-h4-weight` | 700 | same |
| `--ns-type-h5-line` | 36px | same |
| `--ns-type-h5-size` | 24px | same |
| `--ns-type-h5-weight` | 700 | same |
| `--ns-type-h6-line` | 28px | same |
| `--ns-type-h6-size` | 20px | same |
| `--ns-type-h6-weight` | 700 | same |
| `--ns-type-overline-line` | 16px | same |
| `--ns-type-overline-size` | 10px | same |
| `--ns-type-overline-tracking` | 1.5px | same |
| `--ns-type-title-line` | 32px | same |
| `--ns-type-title-size` | 20px | same |

### viz

| Token | Dark | Light |
|---|---|---|
| `--ns-viz-1` | #01f1e3 | #00a89e |
| `--ns-viz-2` | #991bfa | same |
| `--ns-viz-3` | #ffa63f | same |
| `--ns-viz-4` | #023aff | same |
| `--ns-viz-5` | #5eff5a | same |
| `--ns-viz-6` | #ff2069 | same |
| `--ns-viz-7` | #4807ea | same |

### widget

| Token | Dark | Light |
|---|---|---|
| `--ns-widget-band` | #12122a | #f3f3fb |
| `--ns-widget-bg` | #191932 | #ffffff |
| `--ns-widget-grid` | #2a2a4a | #dcdcea |
| `--ns-widget-inset` | #05050f | #f5f5ff |
| `--ns-widget-muted` | #6a6a9f | #5a5a8f |
| `--ns-widget-pad` | 24px | same |
| `--ns-widget-radius` | 12px | same |
| `--ns-widget-shadow` | inset 0 1px 0.3px #ffffff08 | 0 1px 2px #05050f14, 0 0 0 1px #d0d0da |
| `--ns-widget-track` | #0e0e22 | #e6e6f2 |

## Templates (markup to copy)

Runnable pages built only from NorthStar classes and tokens. Each links the two stylesheets and passes tools/agent-check.mjs.

- **Analytical list** https://mikelrosenthal.com/northstar/agent/templates/analytical-list.html A list of records with a page header, filter toolbar, selectable sortable table, selection bar and pagination.
- **Dashboard** https://mikelrosenthal.com/northstar/agent/templates/dashboard.html An overview page: page header with a range filter, a row of KPI tiles, a two-column area and a compact table.
- **Object detail** https://mikelrosenthal.com/northstar/agent/templates/object-detail.html One record: breadcrumb, header with status and actions, tabs, detail cards with a side column, and a notice.
- **Settings form** https://mikelrosenthal.com/northstar/agent/templates/settings-form.html A single-column settings form with an error summary, fields with helpers and one error, checkboxes, a switch and form actions.

## Components

One file per component under https://mikelrosenthal.com/northstar/agent/components/ with classes, variants, markup, use and avoid rules, tokens, keyboard and accessibility. Read the file before writing markup.

| Component | Category | What it is | File |
|---|---|---|---|
| Accordion | Containers | Accordions stack sections of content that expand and collapse to save space. | agent/components/accordion.md |
| Alert banner | Feedback | In-line alerts display a non-modal message associated with objects in a view. | agent/components/alert-banner.md |
| Avatar | Data | Component for visual identification of users and companies. | agent/components/avatar.md |
| Badge | Status | Badges are designed to display a small amount of information for statuses and labels with color categorization. | agent/components/badge.md |
| Bar chart | Data viz | A bar chart compares one value across categories or time periods by bar height. | agent/components/bar-chart.md |
| Breadcrumb | Navigation | Breadcrumbs show where the current page sits in the hierarchy and let people move up levels. | agent/components/breadcrumb.md |
| Bubble chart | Data viz | A bubble chart plots items on two axes and uses area for a third measure. | agent/components/bubble-chart.md |
| Bullet chart | Data viz | A bullet chart shows one measure per row against a target: stacked segments on a quiet track and a single tick for the goal. | agent/components/bullet-chart.md |
| Button | Actions | The button component gives users the ability to perform an action or navigate to another page. | agent/components/button.md |
| Calendar chart | Data viz | A calendar chart shows one value per day of a month as the intensity of a cell. | agent/components/calendar-chart.md |
| Candlestick chart | Data viz | A candlestick chart shows open, close, high and low for each period as a body and a wick. | agent/components/candlestick-chart.md |
| Card | Containers | Cards group related content and actions about a single subject. | agent/components/card.md |
| Chat | Containers | A conversation surface for an AI assistant or support agent. | agent/components/chat.md |
| Checkbox | Inputs | Checkboxes select one or more options from a list, or toggle a single setting that applies on submit. | agent/components/checkbox.md |
| Combobox | Inputs | A filterable multi-select for long lists. | agent/components/combobox.md |
| Command palette | Navigation | A global launcher for finding records, pages and actions. | agent/components/command-palette.md |
| Data table | Data | Data tables organize large sets of records into rows and columns with sorting, selection, and batch actions. | agent/components/data-table.md |
| Date picker | Inputs | Date pickers select a single date or a range from a calendar overlay, with typed input as an alternative. | agent/components/date-picker.md |
| Divider | Containers | Dividers separate groups of content horizontally, vertically, or with a label. | agent/components/divider.md |
| Dumbbell chart | Data viz | A dumbbell chart joins two values per row to show the gap between them, such as before and after. | agent/components/dumbbell-chart.md |
| File uploader | Inputs | File uploaders accept files by drag-and-drop or browse, and show progress and validation per file. | agent/components/file-uploader.md |
| Funnel chart | Data viz | A funnel chart shows how a count narrows across ordered stages, one centered bar per stage. | agent/components/funnel-chart.md |
| Gauge chart | Data viz | A gauge chart shows one value against its limit on a half circle. | agent/components/gauge-chart.md |
| Heatmap chart | Data viz | A heatmap shows a measure as the intensity of cells in a grid of two categories. | agent/components/heatmap-chart.md |
| Inline edit | Inputs | Edit one field in place on a detail page. | agent/components/inline-edit.md |
| Line chart | Data viz | A line chart shows how a value moves over time, here against the same period last year. | agent/components/line-chart.md |
| Link | Actions | A text link for navigation. | agent/components/link.md |
| Menu | Actions | A list of actions that opens from a trigger, such as a row's more button. | agent/components/menu.md |
| Modal | Overlays | Modals focus attention on a single task or decision and block the rest of the page until dismissed. | agent/components/modal.md |
| Notification | Feedback | Notifications communicate system messages: inline in context, or as toasts that appear and dismiss themselves. | agent/components/notification.md |
| Number stepper | Inputs | An integer field with decrement and increment buttons, for small counts with a clear minimum and maximum. | agent/components/number-stepper.md |
| Pagination | Navigation | Pagination splits long collections into pages with page size control and position feedback. | agent/components/pagination.md |
| Parallel coordinates chart | Data viz | A parallel coordinates chart compares several measures across profiles, one line per profile, so you can see which profiles move together. | agent/components/parallel-coordinates-chart.md |
| Pie chart | Data viz | A donut chart shows how one whole splits into four or fewer parts. | agent/components/pie-chart.md |
| Popover | Overlays | Popovers show richer, interactive content anchored to a trigger, such as menus and quick filters. | agent/components/popover.md |
| Progress | Status | Progress indicators show completion of a task: linear bars, rings for single metrics, and step indicators for flows. | agent/components/progress.md |
| Radar chart | Data viz | A radar chart compares several measures for one or two items on radial axes. | agent/components/radar-chart.md |
| Radial bar chart | Data viz | A radial bar chart shows progress toward a target as concentric rings, one ring per goal. | agent/components/radial-bar-chart.md |
| Radial convergence chart | Data viz | A radial convergence chart joins nodes around a ring with straight links, to show who is connected to whom. | agent/components/radial-convergence-chart.md |
| Radial histogram chart | Data viz | A radial histogram shows counts around a circle, one bar per hour, day or direction, where the end of the cycle meets the start. | agent/components/radial-histogram-chart.md |
| Radio button | Inputs | Radio buttons allow users to select a single option from a list of mutually exclusive options. | agent/components/radio-button.md |
| Sankey chart | Data viz | A sankey diagram shows how volume flows from sources to outcomes; band width carries the amount. | agent/components/sankey-chart.md |
| Scatter chart | Data viz | A scatter chart plots samples on two measures and shows the relationship between them, with an optional trend line. | agent/components/scatter-chart.md |
| Segmented control | Inputs | Switches between two to five views of the same content. | agent/components/segmented-control.md |
| Select | Inputs | Select lets people choose one option from a list of 4 to 15 predefined values. | agent/components/select.md |
| Side navigation | Navigation | Side navigation is the primary way to move through an app, with collapsible groups for large information spaces. | agent/components/side-navigation.md |
| Slider | Inputs | Sliders pick a value or range from a continuous or stepped scale. | agent/components/slider.md |
| Stepped line chart | Data viz | A stepped line chart shows a value that holds steady and then changes at set points in time. | agent/components/stepped-line-chart.md |
| Sunburst chart | Data viz | A sunburst chart shows a hierarchy as nested rings, with the angle of each arc carrying its share. | agent/components/sunburst-chart.md |
| Switch | Inputs | Switches allow users to turn an individual option on or off. | agent/components/toggle.md |
| Tabs | Navigation | Use tabs to allow users to navigate easily between views within the same context. | agent/components/tabs.md |
| Tag | Status | Tags allow users to categorize content. | agent/components/tag.md |
| Text input | Inputs | Text inputs enable the user to interact with and input content and data. | agent/components/text-input.md |
| Textarea | Inputs | A multi-line text field for free text. | agent/components/textarea.md |
| Tooltip | Overlays | Tooltips show contextual help or information about specific components when a user hovers or focuses on them. | agent/components/tooltip.md |
| Tree chart | Data viz | A tree chart shows a hierarchy as nodes joined by elbow lines, with the root on the left. | agent/components/tree-chart.md |
| Tree view | Navigation | Browses a hierarchy such as account, location and device. | agent/components/tree-view.md |
| Treemap chart | Data viz | A treemap shows shares of a whole as nested rectangles sized by value. | agent/components/treemap-chart.md |

## Pattern files

Each pattern has its own file with its rules and example markup:

- Forms: agent/patterns/forms.md
- Modal dialogs: agent/patterns/modal-dialogs.md
- Table views: agent/patterns/table-views.md
- Empty states: agent/patterns/empty-states.md
- Loading: agent/patterns/loading.md
- Search and filter: agent/patterns/search-filter.md
- Errors: agent/patterns/errors.md
- Production patterns: agent/patterns/production.md
- Create account workflow: agent/patterns/create-account.md

