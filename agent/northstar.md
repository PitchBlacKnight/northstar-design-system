# NorthStar Design System v1.4.1

> Machine-readable guide for AI coding and design agents. Generated 2026-11-09 from the live catalog by tools/agent-export.mjs; do not edit by hand. Site: https://mikelrosenthal.com/northstar/ · Figma file VZxmDNQiosTN6gqnvEQ65Z.

NorthStar is a design language and development kit for dense, dark, data-heavy enterprise consoles: 57 components, 224 tokens, dark and light themes, comfortable and compact density. Markup is framework-free HTML with ns- classes; style comes only from CSS custom properties.

## Files

- https://mikelrosenthal.com/northstar/agent/northstar.md this file
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
- **Start from a page template.** Copy the closest floorplan and change the content, not the structure.
- **Use the class names.** Each component lists its ns- classes. If a component has no class, build it from tokens and say so in the handoff.

## Style

- **Tokens only.** Never write raw hex, rgb, pixel colors or font names in components. Use the --ns- semantic roles. Primitives (--ns-gray-*, --ns-blue-500 and so on) are for the token sheet, not for components.
- **Modes on the root.** Set theme and density once on the html element: data-theme="light" (dark is the default) and data-density="compact". Never recolor a component to fake a mode.
- **Load the sheets.** Link https://mikelrosenthal.com/northstar/css/tokens.css then https://mikelrosenthal.com/northstar/css/components.css, and the fonts: <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">. No framework is required.
- **Spacing, text and surfaces.** Gaps and padding use --ns-space-1 to --ns-space-12 (the scale is in the Semantic tokens section). Text color comes from --ns-text-primary, -secondary, -tertiary; surfaces from --ns-background-primary, -surface, -elevated. Error text uses --ns-status-error. Keep forms single column, max-width 480px (a px max-width is acceptable for page layout only, never inside a component).
- **States.** Field errors: add is-error to the ns-field wrapper; it styles the input, select or textarea inside and turns the ns-helper red, so repeat the message in the helper and add aria-invalid="true" and aria-describedby on the control. Control states (is-hover, is-focus, is-pressed, is-open) go on the control itself. A page-level error summary is an ns-alert ns-alert--error with a list of ns-link anchors to the fields, placed above the form and focused on submit.
- **Button emphasis.** ns-btn is primary (one per view). ns-btn--secondary, ns-btn--outline and ns-btn--ghost step down. ns-btn--tertiary is the low-emphasis text button for Cancel and dialog dismissals. ns-btn--danger is for destructive actions and is always confirmed.
- **Two status indicators.** ns-dot is the small uppercase chip for table cells (--success, --warning, --error, --neutral). ns-status-dot is the body-text indicator for lists and detail pages (--positive, --critical, --negative, --informative). Do not mix them in one view.

## Content

- **Generated content.** Label anything a model wrote as generated, and cite the record it came from. Actions that change records or move money go through a confirmation step.
- **Sample data.** Mark invented names and numbers as sample data: one <p class="ns-helper">Sample data</p> line above the view. Never present them as real records.
- **Words.** Sentence case, verb-first button labels, no exclamation marks.

## Check

- **Run the checker.** node tools/agent-check.mjs <file.html> fails on unknown ns- classes, raw colors, unknown tokens and icon buttons without a name.

## Floorplans (page templates)

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
- **Logo** (https://mikelrosenthal.com/northstar/#/foundations/logo) The NorthStar mark: a gray chevron over a cyan diamond. Use it as drawn, at a size where the diamond stays visible, and with room around it.
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

## Components

### Containers

#### Accordion (Stable)

Accordions stack sections of content that expand and collapse to save space.

Page: https://mikelrosenthal.com/northstar/#/components/accordion · Figma node 4208:871

Classes: `ns-accordion`, `ns-accordion__body`, `ns-helper`

Use:
- FAQs, settings groups, long forms split by topic.

Avoid:
- Content everyone needs: show it.

- Do: Make headers scannable.
- Do not: Nest accordions.

```html
<div class="ns-accordion" style="max-width:640px;margin:0 auto"><details open><summary>What counts as an active account?</summary><div class="ns-accordion__body">Any account with at least one integration that synced in the last 30 days.</div></details><details><summary>How are tiers calculated?</summary><div class="ns-accordion__body">Tier is based on trailing twelve-month revenue, recalculated nightly.</div></details><details><summary>Can I export audit logs?</summary><div class="ns-accordion__body">Yes. Admins can export CSV or stream to a SIEM.</div></details></div>
```

Tokens: `--ns-border-subtle` (Dividers), `--ns-text-accent` (Open indicator), `--ns-duration-base` (Indicator rotation)

Keyboard: Tab: Moves between headers; Enter / Space: Toggle section

Accessibility:
- Native <details>/<summary> exposes expanded state automatically.

#### Card (Stable)

Cards group related content and actions about a single subject. Clickable cards navigate as a whole.

Page: https://mikelrosenthal.com/northstar/#/components/card · Figma node 4207:1138

Classes: `ns-btn`, `ns-btn--sm`, `ns-btn--tertiary`, `ns-card`, `ns-card__body`, `ns-card__title`, `ns-dot`, `ns-dot--success`, `ns-kpi`, `ns-kpi__delta`, `ns-kpi__label`, `ns-kpi__value`

Use:
- Collections of similar objects to scan and compare.
- Dashboard tiles with one job each.

Avoid:
- Dense tabular data: use a data table.

- Do: Keep one subject and one primary action per card.
- Do not: Pack many primary actions into one card.

```html
<div class="ns-card" style="width:320px"><h3 class="ns-card__title">Acme Corp</h3><p class="ns-card__body">Gold tier. 14 active integrations across 3 regions. Renewal in 42 days.</p><div style="display:flex;gap:8px"><span class="ns-dot ns-dot--success">Active</span></div><div><button class="ns-btn ns-btn--sm ns-btn--tertiary">View details</button></div></div>
```

Tokens: `--ns-background-surface` (Default fill), `--ns-background-elevated` (Elevated fill), `--ns-elevation-02` (Elevated shadow), `--ns-radius-lg` (Radius), `--ns-space-7` (Padding)

Keyboard: Tab: Focus a clickable card; Enter: Open

Accessibility:
- A clickable card is one <a>. Do not nest other interactive elements inside it.

#### Divider (Stable)

Dividers separate groups of content horizontally, vertically, or with a label.

Page: https://mikelrosenthal.com/northstar/#/components/divider · Figma node 4205:883

Classes: `ns-divider`, `ns-helper`

Use:
- Separating groups when spacing alone is not enough.

Avoid:
- Between every list item: use spacing.

- Do: Try whitespace first.
- Do not: Overuse dividers.

```html
<div style="max-width:480px;margin:0 auto"><p style="margin:0">Section one</p><hr class="ns-divider"/><p style="margin:0">Section two</p></div>
```

Tokens: `--ns-border-subtle` (Line), `--ns-space-5` (Margin)

Keyboard: -: Not interactive

Accessibility:
- Use <hr> for semantic breaks; purely visual lines can be CSS borders.

### Feedback

#### Alert banner (Stable)

In-line alerts display a non-modal message associated with objects in a view.

Page: https://mikelrosenthal.com/northstar/#/components/alert-banner · Figma node 1727:18329

Classes: `ns-alert`, `ns-alert--accent`, `ns-alert--compact`, `ns-alert--default`, `ns-alert--error`, `ns-alert--success`, `ns-alert--warning`, `ns-alert__actions`, `ns-alert__close`, `ns-alert__desc`, `ns-alert__end`, `ns-alert__icon`, `ns-alert__title`, `ns-btn`, `ns-btn--ghost`, `ns-btn--outline`, `ns-helper`

Variants: Type: Default, Accent, Error, Success, Warning; Buttons: Yes, No; Description: Yes, No

Use:
- Messages tied to a view or object.
- App-wide notices when placed above the content.

Avoid:
- Transient confirmations: use a toast notification.

- Do: Say what happened and how to proceed.
- Do not: Stack several banners.

```html
<div class="ns-alert ns-alert--default" role="status" style="max-width:1152px"><span class="ns-alert__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 16v-4M12 8h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/></svg></span><div><p class="ns-alert__title">The title identifies what happened</p><p class="ns-alert__desc">The body content lets the user know why, and how to remedy or proceed.</p><div class="ns-alert__actions"><button class="ns-btn ns-btn--outline">Button example</button><button class="ns-btn ns-btn--ghost">Button example</button></div></div><div class="ns-alert__end"><button class="ns-alert__close" aria-label="Dismiss">×</button></div></div>
```

Tokens: `--ns-navy-900` (Default fill), `--ns-blue-500` (Accent fill), `--ns-red-400` (Error accent), `--ns-green-500` (Success accent), `--ns-purple-500` (Warning accent), `--ns-radius-sm` (Radius)

Keyboard: Tab: Focus actions and close; Enter: Activate

Accessibility:
- Errors use role="alert"; others use role="status".

#### Notification (Stable)

Notifications communicate system messages: inline in context, or as toasts that appear and dismiss themselves. Includes toast.

Page: https://mikelrosenthal.com/northstar/#/components/notification · Figma node 4209:150

Classes: `ns-btn`, `ns-btn--ghost`, `ns-btn--sm`, `ns-btn--tertiary`, `ns-helper`, `ns-notice`, `ns-notice--error`, `ns-notice--info`, `ns-notice--success`, `ns-notice--toast`, `ns-notice__body`, `ns-notice__close`, `ns-notice__icon`, `ns-notice__title`

Variants: Toast / Status: Information, Success, Warning, Error; Toast / Action: None or one button; Toast / Message: Shown or hidden

Use:
- Inline: messages tied to a section.
- Toast: confirmation of a completed action.
- Toast: Confirming the result of an action the person just took.
- Toast: Offering Undo instead of a confirm dialog for reversible changes.
- Toast: Keeping titles under 40 characters.

Avoid:
- Critical, blocking issues: use a modal.
- Toast: Do not use for errors the person must fix. Show those inline.
- Toast: Do not put more than one action in a toast.
- Toast: Do not auto-dismiss error toasts.

- Do: Say what happened and what to do next.
- Do not: Show raw error codes alone.

```html
<div style="display:grid;gap:16px;justify-items:center;width:100%"><div class="ns-notice ns-notice--info" role="status" style="width:440px"><span class="ns-notice__icon">i</span><div><p class="ns-notice__title">Portal update available</p><p class="ns-notice__body">v1.4.0 is ready to deploy.</p></div><button class="ns-notice__close" aria-label="Dismiss">×</button></div><button class="ns-btn ns-btn--tertiary ns-btn--sm" data-toast="Portal update available" data-kind="info">Fire as toast</button></div>
<div class="ns-notice ns-notice--toast ns-notice--success" role="status" style="width:360px"><span class="ns-notice__icon" aria-hidden="true">✓</span><div><p class="ns-notice__title">Account archived</p><p class="ns-notice__body">Acme Corp moved to the archive.</p></div><button class="ns-btn ns-btn--ghost ns-btn--sm">Undo</button></div>
```

Tokens: `--ns-status-info / success / warning / error` (Accent, border, tint), `--ns-elevation-03` (Toast shadow), `--ns-background-elevated` (Toast surface), `--ns-status-success` (Success icon), `--ns-status-error` (Error icon)

Keyboard: Tab: Focus dismiss or action; Enter: Dismiss; Tab: Toast: Moves to the action or close button; Enter / Space: Toast: Activates the focused button

Accessibility:
- Errors use role="alert"; others use role="status" so they are announced politely.
- Toast: Information and success use role=status, which announces politely without interrupting.
- Toast: Error uses role=alert, so it interrupts the screen reader.
- Toast: Give the close button a name, such as Dismiss notification.

### Data

#### Avatar (Stable)

Component for visual identification of users and companies.

Page: https://mikelrosenthal.com/northstar/#/components/avatar · Figma node 1747:21338

Classes: `ns-avatar`, `ns-avatar--16`, `ns-avatar--20`, `ns-avatar--24`, `ns-avatar--28`, `ns-avatar--32`, `ns-avatar--36`, `ns-avatar--40`, `ns-avatar--48`, `ns-avatar--64`, `ns-avatar--brand`, `ns-avatar--memoji`, `ns-avatar--more`, `ns-avatar--square`, `ns-avatar-group`

Variants: Shape: Round, Square; Avatar: Photo, Initials, Memoji; Size: 16, 20, 24, 28, 32, 36, 40, 48, 64; Status: Yes, No

Use:
- Ownership, assignees, and presence.

Avoid:
- Decoration with no meaning.

- Do: Fall back to initials when there is no photo.
- Do not: Show a question mark for unknown people.

```html
<span class="ns-avatar ns-avatar--64" data-status="online" role="img" aria-label="Alex Park, online">AP</span>
```

Tokens: `--ns-persian-500` (Initials fill (Accents/Persian blue)), `--ns-green-2` (Status dot (Green 2)), `--ns-radius-full` (Round)

Keyboard: -: Not interactive unless wrapped in a button

Accessibility:
- Use role="img" with an aria-label that includes presence.

#### Data table (Stable)

Data tables organize large sets of records into rows and columns with sorting, selection, and batch actions. Includes bulk action bar.

Page: https://mikelrosenthal.com/northstar/#/components/data-table · Figma node 4213:46

Classes: `ns-btn`, `ns-btn--danger`, `ns-btn--ghost`, `ns-btn--sm`, `ns-btn--tertiary`, `ns-bulkbar`, `ns-bulkbar__count`, `ns-bulkbar__sep`, `ns-check`, `ns-dot`, `ns-dot--error`, `ns-dot--success`, `ns-dot--warning`, `ns-helper`, `ns-sort`, `ns-table`, `ns-table--compact`, `ns-table-bar`, `ns-table-wrap` · helper classes in the examples: `num`

Variants: Bulk action bar / Count: Text, such as 3 selected; Bulk action bar / Actions: Up to four buttons. Extras move into a Menu; Bulk action bar / State: Hidden, Visible

Use:
- Comparing many records across the same attributes.
- Bulk actions across selected rows.
- Bulk action bar: Show it when at least one row is selected.
- Bulk action bar: Keep the count visible, and announce it when it changes.
- Bulk action bar: Put destructive actions last, and confirm them.

Avoid:
- A handful of items with rich content: use cards.
- Bulk action bar: Do not show more than four actions. Move extras into a Menu.
- Bulk action bar: Do not hide the selection after an action. Show a Toast with the result.
- Bulk action bar: Do not cover the last table row. Add bottom padding to the table.

- Do: Right-align numbers so magnitudes line up.
- Do not: Center numeric columns.

```html
<div class="ns-table-wrap" style="width:100%"><div class="ns-table-bar"><b data-batch-label data-default="Accounts">Accounts</b><div style="display:flex;gap:8px"><button class="ns-btn ns-btn--sm ns-btn--tertiary">Export</button><button class="ns-btn ns-btn--sm">Add account</button></div></div>
<table class="ns-table  ">
  <thead><tr><th><label class="ns-check"><input type="checkbox" data-select-all aria-label="Select all rows"/></label></th><th data-sort>Account <span class="ns-sort">↕</span></th><th data-sort>Tier <span class="ns-sort">↕</span></th><th data-sort class="num">Revenue <span class="ns-sort">↕</span></th><th>Status</th></tr></thead>
  <tbody><tr><td><label class="ns-check"><input type="checkbox" data-row-select aria-label="Select Acme Corp"/></label></td><td>Acme Corp</td><td>Gold</td><td class="num">$12,400</td><td><span class="ns-dot ns-dot--success">active</span></td></tr><tr><td><label class="ns-check"><input type="checkbox" data-row-select aria-label="Select Beta LLC"/></label></td><td>Beta LLC</td><td>Silver</td><td class="num">$5,200</td><td><span class="ns-dot ns-dot--warning">pending</span></td></tr><tr><td><label class="ns-check"><input type="checkbox" data-row-select aria-label="Select Zeta Inc"/></label></td><td>Zeta Inc</td><td>Platinum</td><td class="num">$38,900</td><td><span class="ns-dot ns-dot--success">active</span></td></tr><tr><td><label class="ns-check"><input type="checkbox" data-row-select aria-label="Select Northwind"/></label></td><td>Northwind</td><td>Silver</td><td class="num">$7,300</td><td><span class="ns-dot ns-dot--error">error</span></td></tr><tr><td><label class="ns-check"><input type="checkbox" data-row-select aria-label="Select Globex"/></label></td><td>Globex</td><td>Gold</td><td class="num">$19,850</td><td><span class="ns-dot ns-dot--success">active</span></td></tr></tbody>
</table></div>
<div class="ns-bulkbar" role="region" aria-label="Bulk actions"><span class="ns-bulkbar__count" aria-live="polite">3 selected</span><span class="ns-bulkbar__sep"></span><button class="ns-btn ns-btn--ghost ns-btn--sm">Approve</button><button class="ns-btn ns-btn--ghost ns-btn--sm">Export</button><span class="ns-bulkbar__sep"></span><button class="ns-btn ns-btn--ghost ns-btn--sm">Clear</button><button class="ns-btn ns-btn--danger ns-btn--sm">Delete</button></div>
```

Tokens: `--ns-background-secondary` (Header row), `--ns-background-hover` (Row hover), `--ns-background-selected` (Selected row), `--ns-interactive-primary` (Batch action bar), `--ns-font-mono` (Numeric cells), `--ns-background-elevated` (Bar surface), `--ns-elevation-03` (Bar shadow), `--ns-border-default` (Bar border), `--ns-density-control-sm` (Button height)

Keyboard: Tab: Moves between interactive cells; Enter / Space on header: Sorts the column; Space on row checkbox: Selects the row; Tab: Bulk action bar: Moves through the bar's actions; Escape: Bulk action bar: Clears the selection when focus is in the table

Accessibility:
- Sortable headers set aria-sort.
- Select-all checkbox is labeled and reflects mixed state.
- Batch bar announces the selected count.
- Bulk action bar: The bar is a named region, such as Bulk actions.
- Bulk action bar: The count sits in a polite live region, so changes are announced without interrupting.
- Bulk action bar: Each action is a button with its full label, such as Delete 3 accounts.

### Status

#### Badge (Stable)

Badges are designed to display a small amount of information for statuses and labels with color categorization. Includes status dot.

Page: https://mikelrosenthal.com/northstar/#/components/badge · Figma node 1840:21692

Classes: `ns-badge`, `ns-badge--icon`, `ns-badge--lg`, `ns-badge--negative`, `ns-badge--outline`, `ns-badge--positive`, `ns-badge--sm`, `ns-count`, `ns-dot`, `ns-dot--error`, `ns-dot--success`, `ns-dot--warning`, `ns-status-dot`, `ns-status-dot--critical`, `ns-status-dot--informative`, `ns-status-dot--negative`, `ns-status-dot--neutral`, `ns-status-dot--positive`, `ns-table` · helper classes in the examples: `sr-only`

Variants: Size: Small (20), Medium (24), Large (28); Icon: Icon only, Icon left, Icon right, None; Type: Informative (violet), Positive (green), Negative (red); State: Solid, Outline with icon, Outline; Status dot / Status: Positive, Critical, Negative, Informative, Neutral; Status dot / Label: Shown or hidden

Use:
- Object status in tables, cards, and headers.
- Short labels with semantic meaning.
- Status dot: Dense tables and maps.
- Status dot: The same status words as Badge.
- Status dot: Keeping the label visible unless a header names the status.

Avoid:
- Categories and filters: use a tag.
- Status dot: Do not rely on color alone.
- Status dot: Do not use for counts. Use Badge.
- Status dot: Do not hide the label in a table with no header that names the status.

- Do: Pair color with a clear word.
- Do not: Use an empty colored badge to carry status.

```html
<span class="ns-badge">Live</span>
<span class="ns-status-dot ns-status-dot--positive">Active</span>
```

Tokens: `--ns-purple-400` (Informative), `--ns-status-success` (Positive), `--ns-status-error` (Negative), `--ns-radius-sm` (Radius), `--ns-status-warning` (Critical dot), `--ns-status-info` (Informative dot)

Keyboard: -: Not interactive

Accessibility:
- Badges are text, so screen readers read the label. Icon-only badges need role="img" and aria-label.
- Status dot: The label is text, so screen readers read it. A hidden label stays in the DOM as screen-reader-only text.
- Status dot: Do not use color alone to show status.

#### Progress (Stable)

Progress indicators show completion of a task: linear bars, rings for single metrics, and step indicators for flows. Includes loading.

Page: https://mikelrosenthal.com/northstar/#/components/progress · Figma node 4038:31350

Classes: `ns-helper`, `ns-progress`, `ns-progress--purple`, `ns-progress--warning`, `ns-progress__bar`, `ns-progress__meta`, `ns-progress__track`, `ns-skel`

Use:
- Operations that take more than about a second.
- Multi-step flows.
- Loading: Skeletons for page and card loads; spinners for small, local waits.

Avoid:
- Instant actions.
- Loading: Waits under 300ms: show nothing.

- Do: Say what is progressing.
- Do not: Leave people guessing.

```html
<div class="ns-progress" style="width:360px"><div class="ns-progress__meta"><span>Migrating records</span><span>30%</span></div><div class="ns-progress__track" role="progressbar" aria-label="Migrating records" aria-valuenow="30" aria-valuemin="0" aria-valuemax="100"><div class="ns-progress__bar" style="--_v:30%"></div></div></div>
<div style="width:360px;display:grid;gap:10px" aria-busy="true" aria-label="Loading accounts"><div class="ns-skel" style="height:20px;width:60%"></div><div class="ns-skel" style="height:12px"></div><div class="ns-skel" style="height:12px;width:85%"></div><div class="ns-skel" style="height:80px;margin-top:6px"></div></div>
```

Tokens: `--ns-gradient-brand` (Bar fill), `--ns-border-default` (Track), `--ns-duration-slow` (Fill transition), `--ns-background-elevated` (Skeleton base), `--ns-teal-500` (Spinner arc)

Keyboard: -: Not interactive

Accessibility:
- Use role="progressbar" with value attributes; omit values when indeterminate.
- Step indicators mark the current step with aria-current="step".
- Loading: Containers set aria-busy="true" while loading.
- Loading: Spinners use role="status" with a label.

#### Tag (Stable)

Tags allow users to categorize content. They can represent keywords or people, and are grouped to describe an item or a search request.

Page: https://mikelrosenthal.com/northstar/#/components/tag · Figma node 1840:22808

Classes: `ns-tag`, `ns-tag--blue`, `ns-tag--ghost`, `ns-tag--green`, `ns-tag--purple`, `ns-tag--red`, `ns-tag--sm`, `ns-tag--square`, `ns-tag--teal`, `ns-tag--yellow`, `ns-tag__ind`

Variants: Size: Medium (36), Small (28); Emphasis: Primary, Ghost; Shape: Rounded, Square; State: Informer & icon, Informer, Text, Icon

Use:
- Label metadata like environment, team, or tier.
- Show active filters that can be removed (icon as x-close).

Avoid:
- System status like Active or Failed: use a badge.

- Do: Keep labels to one or two words.
- Do not: Put sentences in tags.

```html
<span class="ns-tag"><span class="ns-tag__ind"></span>Training <b>$650</b><button aria-label="More actions">⋮</button></span>
```

Tokens: `--ns-interactive-secondary-bg` (Primary fill), `--ns-gray-5` (Ghost border), `--ns-teal-500` (Indicator), `--ns-radius-full` (Rounded), `--ns-radius-sm` (Square)

Keyboard: Tab: Focus the trailing action; Enter / Space: Run the action or remove the filter

Accessibility:
- Trailing buttons need a label that names the tag, e.g. aria-label="Remove Region: EU".
- The indicator color is never the only signal; the label carries meaning.

### Data viz

#### Bar chart (New)

A bar chart compares one value across categories or time periods by bar height. Five sizes cover a KPI tile, a narrow column, the default card, a card with a summary and a wide multi-KPI panel. The plot renders from one description as SVG, and the same description draws the Figma set.

Page: https://mikelrosenthal.com/northstar/#/components/bar-chart · Figma node 4721:1376

Classes: `ns-chart`, `ns-chart--small`, `ns-chart--vertical`, `ns-chart__desc`, `ns-chart__desc--sm`, `ns-chart__dot`, `ns-chart__head`, `ns-chart__icon`, `ns-chart__kpi`, `ns-chart__kpis`, `ns-chart__plot`, `ns-chart__summary`, `ns-chart__title`, `ns-chart__title--lg`, `ns-chart__title--sm`, `ns-chart__trend`, `ns-chart__value`, `ns-chart__value--sm`

Variants: Size: Small, Vertical small, Medium, Large, XL; Title: Text; Value: Text; Show icon: Boolean

Use:
- Comparing totals across months or categories.
- A ranked list of a dozen items or fewer.

Avoid:
- A trend over many points. Use Line chart.
- Parts of one whole. Use Pie chart.

- Do: Axis labels and gridlines on the Medium plot.
- Do not: The compact plot drops axes and labels.

```html
<div class="ns-chart" style="width:100%;max-width:375px"><div class="ns-chart__head"><div class="ns-chart__kpi"><span class="ns-chart__title">Orders</span><span class="ns-chart__value">12,480<span class="ns-chart__trend">+4.2%</span></span><span class="ns-chart__desc">Monthly orders over twelve months</span></div><span class="ns-chart__icon" aria-hidden="true"><svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><rect x="0" y="6" width="3" height="8" rx="1"/><rect x="5.5" y="1" width="3" height="13" rx="1"/><rect x="11" y="4" width="3" height="10" rx="1"/></svg></span></div><svg class="ns-chart__plot" width="327" height="200" viewBox="0 0 327 200" role="img" aria-label="Bar chart: monthly orders for twelve months, the latest month is the tallest" data-chart="bar" data-size="Medium" data-h="200" data-w="327"><rect x="30" y="-0.5" width="297" height="1" style="fill:var(--ns-widget-grid)"/><rect x="30" y="58.8" width="297" height="1" style="fill:var(--ns-widget-grid)"/><rect x="30" y="118.2" width="297" height="1" style="fill:var(--ns-widget-grid)"/><rect x="30" y="177.5" width="297" height="1" style="fill:var(--ns-widget-grid)"/><text x="22" y="0" text-anchor="end" dominant-baseline="middle" font-size="11" style="fill:var(--ns-chart-label-text)">1.5k</text><text x="22" y="59.3" text-anchor="end" dominant-baseline="middle" font-size="11" style="fill:var(--ns-chart-label-text)">1k</text><text x="22" y="118.7" text-anchor="end" dominant-baseline="middle" font-size="11" style="fill:var(--ns-chart-label-text)">500</text><text x="22" y="178" text-anchor="end" dominant-baseline="middle" font-size="11" style="fill:var(--ns-chart-label-text)">0</text><text x="42.4" y="192" text-anchor="middle" dominant-baseline="middle" font-size="11" style="fill:var(--ns-chart-label-text)">Jan</text><text x="110.4" y="192" text-anchor="middle" dominant-baseline="middle" font-size="11" style="fill:var(--ns-chart-label-text)">Apr</text><text x="178.5" y="192" text-anchor="middle" dominant-baseline="middle" font-size="11" style="fill:var(--ns-chart-label-text)">Jul</text><text x="246.6" y="192" text-anchor="middle" dominant-baseline="middle" font-size="11" style="fill:var(--ns-chart-label-text)">Oct</text><text x="314.6" y="192" text-anchor="middle" dominant-baseline="middle" font-size="11" style="fill:var(--ns-chart-label-text)">Dec</text><rect x="35.4" y="104.9" width="13.9" height="73.1" rx="6.930000000000001" style="fill:var(--ns-chart-series-2)"/><rect x="60.2" y="82.3" width="13.9" height="95.7" rx="6.930000000000001" style="fill:var(--ns-chart-series-2)"/><rect x="84.9" y="94.5" width="13.9" height="83.5" rx="6.930000000000001" style="fill:var(--ns-chart-series-2)"/><rect x="109.7" y="70.1" width="13.9" height="107.9" rx="6.930000000000001" style="fill:var(--ns-chart-series-2)"/><rect x="134.4" y="77.1" width="13.9" height="100.9" rx="6.930000000000001" style="fill:var(--ns-chart-series-2)"/><rect x="159.2" y="56.2" width="13.9" height="121.8" rx="6.930000000000001" style="fill:var(--ns-chart-series-2)"/><rect x="183.9" y="87.5" width="13.9" height="90.5" rx="6.930000000000001" style="fill:var(--ns-chart-series-2)"/><rect x="208.7" y="63.2" width="13.9" height="114.8" rx="6.930000000000001" style="fill:var(--ns-chart-series-2)"/><rect x="233.4" y="49.2" width="13.9" height="128.8" rx="6.930000000000001" style="fill:var(--ns-chart-series-2)"/><rect x="258.2" y="59.7" width="13.9" height="118.3" rx="6.930000000000001" style="fill:var(--ns-chart-series-2)"/><rect x="282.9" y="38.8" width="13.9" height="139.2" rx="6.930000000000001" style="fill:var(--ns-chart-series-2)"/><rect x="307.7" y="17.9" width="13.9" height="160.1" rx="6.930000000000001" style="fill:var(--ns-chart-series-1)"/></svg></div>
```

Tokens: `--ns-chart-series-1` (Highlighted bar), `--ns-chart-series-2` (Other bars), `--ns-widget-grid` (Gridlines), `--ns-widget-bg` (Card surface), `--ns-border-subtle` (Card stroke and summary divider), `--ns-chart-label-text` (Axis labels and description), `--ns-status-success` (Trend), `--ns-radius-xl` (Card radius)

Keyboard: -: Not interactive

Accessibility:
- The SVG is role="img" with a label stating the range and the highest bar. Provide a table nearby.
- Trend text carries its sign, so the color is a second signal.

#### Bubble chart (New)

A bubble chart plots items on two axes and uses area for a third measure. Five sizes cover a KPI tile, a narrow column, the default card, a card with a summary and a wide multi-KPI panel. The plot renders from one description as SVG, and the same description draws the Figma set, so the two cannot drift.

Page: https://mikelrosenthal.com/northstar/#/components/bubble-chart · Figma node 4454:37087

Classes: `ns-chart`, `ns-chart--small`, `ns-chart--vertical`, `ns-chart__desc`, `ns-chart__desc--sm`, `ns-chart__dot`, `ns-chart__head`, `ns-chart__icon`, `ns-chart__kpi`, `ns-chart__kpis`, `ns-chart__plot`, `ns-chart__summary`, `ns-chart__title`, `ns-chart__title--lg`, `ns-chart__title--sm`, `ns-chart__trend`, `ns-chart__value`, `ns-chart__value--sm`

Variants: Size: Small, Vertical small, Medium, Large, XL; Title: Text; Value: Text; Show icon: Boolean

Use:
- Comparing a few items on two measures, with a third shown as size.
- Spotting outliers across accounts, regions or projects.
- A KPI tile that needs a shape of the data, not only a number.

Avoid:
- Time series. Use Line chart.
- Exact comparison of one measure. Use Bar chart.
- More than about twelve points. Use a scatter or a table.

- Do: Axis labels and gridlines on the Medium plot.
- Do not: The compact plot drops axes and labels.

```html
<div class="ns-chart" style="width:100%;max-width:375px"><div class="ns-chart__head"><div class="ns-chart__kpi"><span class="ns-chart__title">Accounts</span><span class="ns-chart__value">1,240<span class="ns-chart__trend">+2.4%</span></span><span class="ns-chart__desc">Top 8 accounts shown, size is active seats</span></div><span class="ns-chart__icon" aria-hidden="true"><svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><rect x="0" y="6" width="3" height="8" rx="1"/><rect x="5.5" y="1" width="3" height="13" rx="1"/><rect x="11" y="4" width="3" height="10" rx="1"/></svg></span></div><svg class="ns-chart__plot" width="327" height="200" viewBox="0 0 327 200" role="img" aria-label="Bubble chart: the top eight of 1,240 accounts, bubble size shows active seats" data-chart="bubble" data-size="Medium" data-h="200" data-w="327"><rect x="30" y="-0.5" width="297" height="1" style="fill:var(--ns-widget-grid)"/><rect x="30" y="58.8" width="297" height="1" style="fill:var(--ns-widget-grid)"/><rect x="30" y="118.2" width="297" height="1" style="fill:var(--ns-widget-grid)"/><rect x="30" y="177.5" width="297" height="1" style="fill:var(--ns-widget-grid)"/><text x="22" y="0" text-anchor="end" dominant-baseline="middle" font-size="11" style="fill:var(--ns-chart-label-text)">40</text><text x="22" y="59.3" text-anchor="end" dominant-baseline="middle" font-size="11" style="fill:var(--ns-chart-label-text)">30</text><text x="22" y="118.7" text-anchor="end" dominant-baseline="middle" font-size="11" style="fill:var(--ns-chart-label-text)">20</text><text x="22" y="178" text-anchor="end" dominant-baseline="middle" font-size="11" style="fill:var(--ns-chart-label-text)">10</text><text x="40" y="192" text-anchor="middle" dominant-baseline="middle" font-size="11" style="fill:var(--ns-chart-label-text)">Jan</text><text x="132.3" y="192" text-anchor="middle" dominant-baseline="middle" font-size="11" style="fill:var(--ns-chart-label-text)">Mar</text><text x="224.7" y="192" text-anchor="middle" dominant-baseline="middle" font-size="11" style="fill:var(--ns-chart-label-text)">May</text><text x="317" y="192" text-anchor="middle" dominant-baseline="middle" font-size="11" style="fill:var(--ns-chart-label-text)">Jul</text><circle cx="59.7" cy="110.4" r="8" style="fill:var(--ns-chart-series-1);fill-opacity:0.85"/><circle cx="95.3" cy="53.4" r="14.2" style="fill:var(--ns-chart-series-2);fill-opacity:0.85"/><circle cx="133.9" cy="128.2" r="5.7" style="fill:var(--ns-chart-series-1);fill-opacity:0.85"/><circle cx="169.6" cy="81.9" r="17.7" style="fill:var(--ns-chart-series-3);fill-opacity:0.85"/><circle cx="208.2" cy="39.2" r="9.7" style="fill:var(--ns-chart-series-2);fill-opacity:0.85"/><circle cx="237.9" cy="106.8" r="12" style="fill:var(--ns-chart-series-1);fill-opacity:0.85"/><circle cx="273.5" cy="57" r="7.4" style="fill:var(--ns-chart-series-3);fill-opacity:0.85"/><circle cx="303.2" cy="121" r="14.2" style="fill:var(--ns-chart-series-2);fill-opacity:0.85"/></svg></div>
```

Tokens: `--ns-chart-series-1` (Bubble color 1 (alias of viz/1)), `--ns-chart-series-2` (Bubble color 2 (alias of viz/4)), `--ns-chart-series-3` (Bubble color 3 (alias of viz/2)), `--ns-widget-grid` (Gridlines), `--ns-widget-bg` (Card surface), `--ns-border-subtle` (Card stroke and summary divider), `--ns-chart-label-text` (Axis labels and description), `--ns-status-success` (Trend), `--ns-radius-xl` (Card radius)

Keyboard: -: Not interactive

Accessibility:
- The SVG is role="img" with a label that names the three measures. Provide a table of the points nearby.
- Series are told apart by position and label, never by color alone.
- Trend text carries its sign, so the color is a second signal.

#### Bullet chart (New)

A bullet chart shows one measure per row against a target: stacked segments on a quiet track and a single tick for the goal. Five sizes cover a KPI tile, a narrow column, the default card, a card with a summary and a wide multi-KPI panel. The rows render from a data array as SVG, so the same numbers drive the Figma set and the docs.

Page: https://mikelrosenthal.com/northstar/#/components/bullet-chart · Figma node 4443:314

Classes: `ns-bullet`, `ns-bullet--small`, `ns-bullet--vertical`, `ns-bullet__desc`, `ns-bullet__dot`, `ns-bullet__head`, `ns-bullet__icon`, `ns-bullet__kpi`, `ns-bullet__kpis`, `ns-bullet__rows`, `ns-bullet__summary`, `ns-bullet__text`, `ns-bullet__title`, `ns-bullet__title--lg`, `ns-bullet__trend`, `ns-bullet__value`, `ns-bullet__value--sm`

Variants: Size: Small, Vertical small, Medium, Large, XL; Title: Text; Value: Text; Show icon: Boolean

Use:
- One measure against a goal, per row: revenue to plan, tickets to SLA, capacity to limit.
- Breaking a measure into parts with stacked segments.
- KPI tiles that need more than a single number.

Avoid:
- Time series. Use Line chart.
- Ranking categories with no target. Use Horizontal bar chart.
- A single percentage. Use Progress.

- Do: An axis label and a target tick on every row.
- Do not: No label and no target. It reads as a progress bar.

```html
<div class="ns-bullet" style="width:100%;max-width:375px"><div class="ns-bullet__head"><div class="ns-bullet__text"><span class="ns-bullet__title">Income</span><span class="ns-bullet__value">$18,420<span class="ns-bullet__trend">+1.8%</span></span><span class="ns-bullet__desc">Compared with $18,090 last month</span></div><span class="ns-bullet__icon" aria-hidden="true"><svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><rect x="0" y="6" width="3" height="8" rx="1"/><rect x="5.5" y="1" width="3" height="13" rx="1"/><rect x="11" y="4" width="3" height="10" rx="1"/></svg></span></div><svg class="ns-bullet__rows" width="327" height="134" viewBox="0 0 327 134" style="width:100%;max-width:327px" role="list" aria-label="Bullet chart" data-w="327" data-bullet="{&quot;rows&quot;:[{&quot;label&quot;:&quot;500&quot;,&quot;segments&quot;:[40,10,10,14],&quot;target&quot;:98},{&quot;label&quot;:&quot;400&quot;,&quot;segments&quot;:[38,10,12,20],&quot;target&quot;:88},{&quot;label&quot;:&quot;300&quot;,&quot;segments&quot;:[15,8,8,10],&quot;target&quot;:50},{&quot;label&quot;:&quot;200&quot;,&quot;segments&quot;:[15,10,12,12],&quot;target&quot;:64},{&quot;label&quot;:&quot;100&quot;,&quot;segments&quot;:[40,14,15,15],&quot;target&quot;:98}],&quot;opts&quot;:{}}"><g role="listitem" aria-label="500: 40 + 10 + 10 + 14 of 74, target 98"><text x="0" y="7.0" dominant-baseline="middle" font-size="11" style="fill:var(--ns-chart-label-text)">500</text><clipPath id="nsb9-0"><rect x="40" y="2.0" width="287" height="10" rx="5"/></clipPath><rect x="40" y="2.0" width="287" height="10" rx="5" style="fill:var(--ns-chart-track)"/><g clip-path="url(#nsb9-0)"><rect x="40.0" y="2.0" width="114.8" height="10" rx="5" style="fill:var(--ns-chart-series-1)"/><rect x="156.8" y="2.0" width="28.7" height="10" rx="5" style="fill:var(--ns-chart-series-2)"/><rect x="187.5" y="2.0" width="28.7" height="10" rx="5" style="fill:var(--ns-chart-series-3)"/><rect x="218.2" y="2.0" width="40.2" height="10" rx="5" style="fill:var(--ns-chart-series-4)"/></g><rect x="319.3" y="4.0" width="2" height="6" rx="1" style="fill:var(--ns-chart-target)"/></g><g role="listitem" aria-label="400: 38 + 10 + 12 + 20 of 80, target 88"><text x="0" y="37.0" dominant-baseline="middle" font-size="11" style="fill:var(--ns-chart-label-text)">400</text><clipPath id="nsb9-1"><rect x="40" y="32.0" width="287" height="10" rx="5"/></clipPath><rect x="40" y="32.0" width="287" height="10" rx="5" style="fill:var(--ns-chart-track)"/><g clip-path="url(#nsb9-1)"><rect x="40.0" y="32.0" width="109.1" height="10" rx="5" style="fill:var(--ns-chart-series-1)"/><rect x="151.1" y="32.0" width="28.7" height="10" rx="5" style="fill:var(--ns-chart-series-2)"/><rect x="181.8" y="32.0" width="34.4" height="10" rx="5" style="fill:var(--ns-chart-series-3)"/><rect x="218.2" y="32.0" width="57.4" height="10" rx="5" style="fill:var(--ns-chart-series-4)"/></g><rect x="290.6" y="34.0" width="2" height="6" rx="1" style="fill:var(--ns-chart-target)"/></g><g role="listitem" aria-label="300: 15 + 8 + 8 + 10 of 41, target 50"><text x="0" y="67.0" dominant-baseline="middle" font-size="11" style="fill:var(--ns-chart-label-text)">300</text><clipPath id="nsb9-2"><rect x="40" y="62.0" width="287" height="10" rx="5"/></clipPath><rect x="40" y="62.0" width="287" height="10" rx="5" style="fill:var(--ns-chart-track)"/><g clip-path="url(#nsb9-2)"><rect x="40.0" y="62.0" width="43.0" height="10" rx="5" style="fill:var(--ns-chart-series-1)"/><rect x="85.0" y="62.0" width="23.0" height="10" rx="5" style="fill:var(--ns-chart-series-2)"/><rect x="110.0" y="62.0" width="23.0" height="10" rx="5" style="fill:var(--ns-chart-series-3)"/><rect x="135.0" y="62.0" width="28.7" height="10" rx="5" style="fill:var(--ns-chart-series-4)"/></g><rect x="181.5" y="64.0" width="2" height="6" rx="1" style="fill:var(--ns-chart-target)"/></g><g role="listitem" aria-label="200: 15 + 10 + 12 + 12 of 49, target 64"><text x="0" y="97.0" dominant-baseline="middle" font-size="11" style="fill:var(--ns-chart-label-text)">200</text><clipPath id="nsb9-3"><rect x="40" y="92.0" width="287" height="10" rx="5"/></clipPath><rect x="40" y="92.0" width="287" height="10" rx="5" style="fill:var(--ns-chart-track)"/><g clip-path="url(#nsb9-3)"><rect x="40.0" y="92.0" width="43.0" height="10" rx="5" style="fill:var(--ns-chart-series-1)"/><rect x="85.0" y="92.0" width="28.7" height="10" rx="5" style="fill:var(--ns-chart-series-2)"/><rect x="115.8" y="92.0" width="34.4" height="10" rx="5" style="fill:var(--ns-chart-series-3)"/><rect x="152.2" y="92.0" width="34.4" height="10" rx="5" style="fill:var(--ns-chart-series-4)"/></g><rect x="221.7" y="94.0" width="2" height="6" rx="1" style="fill:var(--ns-chart-target)"/></g><g role="listitem" aria-label="100: 40 + 14 + 15 + 15 of 84, target 98"><text x="0" y="127.0" dominant-baseline="middle" font-size="11" style="fill:var(--ns-chart-label-text)">100</text><clipPath id="nsb9-4"><rect x="40" y="122.0" width="287" height="10" rx="5"/></clipPath><rect x="40" y="122.0" width="287" height="10" rx="5" style="fill:var(--ns-chart-track)"/><g clip-path="url(#nsb9-4)"><rect x="40.0" y="122.0" width="114.8" height="10" rx="5" style="fill:var(--ns-chart-series-1)"/><rect x="156.8" y="122.0" width="40.2" height="10" rx="5" style="fill:var(--ns-chart-series-2)"/><rect x="199.0" y="122.0" width="43.0" height="10" rx="5" style="fill:var(--ns-chart-series-3)"/><rect x="244.0" y="122.0" width="43.0" height="10" rx="5" style="fill:var(--ns-chart-series-4)"/></g><rect x="319.3" y="124.0" width="2" height="6" rx="1" style="fill:var(--ns-chart-target)"/></g></svg></div>
```

Tokens: `--ns-chart-series-1` (Segment 1 (alias of viz/1)), `--ns-chart-series-2` (Segment 2 (alias of viz/4)), `--ns-chart-series-3` (Segment 3 (alias of viz/2)), `--ns-chart-series-4` (Segment 4 (alias of viz/7)), `--ns-chart-series-5` (Segment 5 (alias of widget/muted)), `--ns-chart-track` (Track (alias of widget/track)), `--ns-chart-target` (Target tick (alias of text/primary)), `--ns-widget-bg` (Card surface), `--ns-border-subtle` (Card stroke and summary divider), `--ns-chart-label-text` (Axis labels and description), `--ns-status-success` (Trend), `--ns-radius-xl` (Card radius)

Keyboard: -: Not interactive

Accessibility:
- The SVG is role="list"; each row is a listitem whose label reads the segments, their sum and the target.
- Segments are told apart by order and label, never by color alone.
- Trend text carries its sign, so the color is a second signal.

#### Calendar chart (New)

A calendar chart shows one value per day of a month as the intensity of a cell. Five sizes cover a KPI tile, a narrow column, the default card, a card with a summary and a wide multi-KPI panel. The plot renders from one description as SVG, and the same description draws the Figma set.

Page: https://mikelrosenthal.com/northstar/#/components/calendar-chart · Figma node 4463:39465

Classes: `ns-chart`, `ns-chart--small`, `ns-chart--vertical`, `ns-chart__desc`, `ns-chart__desc--sm`, `ns-chart__dot`, `ns-chart__head`, `ns-chart__icon`, `ns-chart__kpi`, `ns-chart__kpis`, `ns-chart__plot`, `ns-chart__summary`, `ns-chart__title`, `ns-chart__title--lg`, `ns-chart__title--sm`, `ns-chart__trend`, `ns-chart__value`, `ns-chart__value--sm`

Variants: Size: Small, Vertical small, Medium, Large, XL; Title: Text; Value: Text; Show icon: Boolean

Use:
- Daily activity or status across one month.
- Streaks, gaps and busy days.
- A KPI tile that needs consistency, not only a total.

Avoid:
- Exact values. Use Data table.
- Spans longer than a few months. Use Heatmap chart.
- One number. Use a KPI tile.

- Do: Axis labels and gridlines on the Medium plot.
- Do not: The compact plot drops axes and labels.

```html
<div class="ns-chart" style="width:100%;max-width:375px"><div class="ns-chart__head"><div class="ns-chart__kpi"><span class="ns-chart__title">Active days</span><span class="ns-chart__value">31<span class="ns-chart__trend">+3.0%</span></span><span class="ns-chart__desc">Days with activity in five weeks</span></div><span class="ns-chart__icon" aria-hidden="true"><svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><rect x="0" y="6" width="3" height="8" rx="1"/><rect x="5.5" y="1" width="3" height="13" rx="1"/><rect x="11" y="4" width="3" height="10" rx="1"/></svg></span></div><svg class="ns-chart__plot" width="327" height="200" viewBox="0 0 327 200" role="img" aria-label="Calendar heatmap: five weeks of days by weekday, darker days had more activity" data-chart="calendar" data-size="Medium" data-h="200" data-w="327"><rect x="0" y="18" width="44.1" height="34" rx="4" style="fill:var(--ns-chart-series-1);fill-opacity:0.1"/><rect x="47.1" y="18" width="44.1" height="34" rx="4" style="fill:var(--ns-chart-series-1);fill-opacity:0.55"/><rect x="94.3" y="18" width="44.1" height="34" rx="4" style="fill:var(--ns-chart-series-1)"/><rect x="141.4" y="18" width="44.1" height="34" rx="4" style="fill:var(--ns-chart-series-1);fill-opacity:0.4"/><rect x="188.6" y="18" width="44.1" height="34" rx="4" style="fill:var(--ns-chart-series-1);fill-opacity:0.85"/><rect x="235.7" y="18" width="44.1" height="34" rx="4" style="fill:var(--ns-chart-series-1);fill-opacity:0.25"/><rect x="282.9" y="18" width="44.1" height="34" rx="4" style="fill:var(--ns-chart-series-1);fill-opacity:0.7"/><rect x="0" y="55" width="44.1" height="34" rx="4" style="fill:var(--ns-chart-series-1);fill-opacity:0.85"/><rect x="47.1" y="55" width="44.1" height="34" rx="4" style="fill:var(--ns-chart-series-1);fill-opacity:0.4"/><rect x="94.3" y="55" width="44.1" height="34" rx="4" style="fill:var(--ns-chart-series-1)"/><rect x="141.4" y="55" width="44.1" height="34" rx="4" style="fill:var(--ns-chart-series-1);fill-opacity:0.55"/><rect x="188.6" y="55" width="44.1" height="34" rx="4" style="fill:var(--ns-chart-series-1);fill-opacity:0.1"/><rect x="235.7" y="55" width="44.1" height="34" rx="4" style="fill:var(--ns-chart-series-1);fill-opacity:0.7"/><rect x="282.9" y="55" width="44.1" height="34" rx="4" style="fill:var(--ns-chart-series-1);fill-opacity:0.25"/><rect x="0" y="92" width="44.1" height="34" rx="4" style="fill:var(--ns-chart-series-1);fill-opacity:0.55"/><rect x="47.1" y="92" width="44.1" height="34" rx="4" style="fill:var(--ns-chart-series-1);fill-opacity:0.25"/><rect x="94.3" y="92" width="44.1" height="34" rx="4" style="fill:var(--ns-chart-series-1)"/><rect x="141.4" y="92" width="44.1" height="34" rx="4" style="fill:var(--ns-chart-series-1);fill-opacity:0.7;stroke:var(--ns-chart-target);stroke-width:2"/><rect x="188.6" y="92" width="44.1" height="34" rx="4" style="fill:var(--ns-chart-series-1);fill-opacity:0.4"/><rect x="235.7" y="92" width="44.1" height="34" rx="4" style="fill:var(--ns-chart-series-1);fill-opacity:0.1"/><rect x="282.9" y="92" width="44.1" height="34" rx="4" style="fill:var(--ns-chart-series-1);fill-opacity:0.85"/><rect x="0" y="129" width="44.1" height="34" rx="4" style="fill:var(--ns-chart-series-1);fill-opacity:0.25"/><rect x="47.1" y="129" width="44.1" height="34" rx="4" style="fill:var(--ns-chart-series-1);fill-opacity:0.1"/><rect x="94.3" y="129" width="44.1" height="34" rx="4" style="fill:var(--ns-chart-series-1)"/><rect x="141.4" y="129" width="44.1" height="34" rx="4" style="fill:var(--ns-chart-series-1);fill-opacity:0.85"/><rect x="188.6" y="129" width="44.1" height="34" rx="4" style="fill:var(--ns-chart-series-1);fill-opacity:0.7"/><rect x="235.7" y="129" width="44.1" height="34" rx="4" style="fill:var(--ns-chart-series-1);fill-opacity:0.55"/><rect x="282.9" y="129" width="44.1" height="34" rx="4" style="fill:var(--ns-chart-series-1);fill-opacity:0.4"/><rect x="0" y="166" width="44.1" height="34" rx="4" style="fill:var(--ns-chart-series-1)"/><rect x="47.1" y="166" width="44.1" height="34" rx="4" style="fill:var(--ns-chart-series-1)"/><rect x="94.3" y="166" width="44.1" height="34" rx="4" style="fill:var(--ns-chart-series-1)"/><rect x="141.4" y="166" width="44.1" height="34" rx="4" style="fill:var(--ns-chart-series-1)"/><rect x="188.6" y="166" width="44.1" height="34" rx="4" style="fill:var(--ns-chart-series-1)"/><rect x="235.7" y="166" width="44.1" height="34" rx="4" style="fill:var(--ns-chart-series-1)"/><rect x="282.9" y="166" width="44.1" height="34" rx="4" style="fill:var(--ns-chart-series-1)"/><text x="22.1" y="6" text-anchor="middle" dominant-baseline="middle" font-size="11" style="fill:var(--ns-chart-label-text)">M</text><text x="69.2" y="6" text-anchor="middle" dominant-baseline="middle" font-size="11" style="fill:var(--ns-chart-label-text)">T</text><text x="116.4" y="6" text-anchor="middle" dominant-baseline="middle" font-size="11" style="fill:var(--ns-chart-label-text)">W</text><text x="163.5" y="6" text-anchor="middle" dominant-baseline="middle" font-size="11" style="fill:var(--ns-chart-label-text)">T</text><text x="210.6" y="6" text-anchor="middle" dominant-baseline="middle" font-size="11" style="fill:var(--ns-chart-label-text)">F</text><text x="257.8" y="6" text-anchor="middle" dominant-baseline="middle" font-size="11" style="fill:var(--ns-chart-label-text)">S</text><text x="304.9" y="6" text-anchor="middle" dominant-baseline="middle" font-size="11" style="fill:var(--ns-chart-label-text)">S</text></svg></div>
```

Tokens: `--ns-chart-series-1` (Day cells (opacity carries the value)), `--ns-chart-target` (Today outline (alias of text/primary)), `--ns-widget-bg` (Card surface), `--ns-border-subtle` (Card stroke and summary divider), `--ns-chart-label-text` (Axis labels and description), `--ns-status-success` (Trend), `--ns-radius-xl` (Card radius)

Keyboard: -: Not interactive

Accessibility:
- The SVG is role="img" with a label that states the month and the busiest days. Provide a table of the daily values nearby.
- Today is marked by an outline as well as intensity.
- Trend text carries its sign, so the color is a second signal.

#### Candlestick chart (New)

A candlestick chart shows open, close, high and low for each period as a body and a wick. Five sizes cover a KPI tile, a narrow column, the default card, a card with a summary and a wide multi-KPI panel. The plot renders from one description as SVG, and the same description draws the Figma set.

Page: https://mikelrosenthal.com/northstar/#/components/candlestick-chart · Figma node 4458:233

Classes: `ns-chart`, `ns-chart--small`, `ns-chart--vertical`, `ns-chart__desc`, `ns-chart__desc--sm`, `ns-chart__dot`, `ns-chart__head`, `ns-chart__icon`, `ns-chart__kpi`, `ns-chart__kpis`, `ns-chart__plot`, `ns-chart__summary`, `ns-chart__title`, `ns-chart__title--lg`, `ns-chart__title--sm`, `ns-chart__trend`, `ns-chart__value`, `ns-chart__value--sm`

Variants: Size: Small, Vertical small, Medium, Large, XL; Title: Text; Value: Text; Show icon: Boolean

Use:
- Price-like data where the range inside each period matters.
- Daily or per-release open, close, high and low.
- A KPI tile that needs volatility, not only a last value.

Avoid:
- One value per period. Use Line chart.
- Totals by category. Use Bar chart.
- Unordered categories. Use Horizontal bar chart.

- Do: Axis labels and gridlines on the Medium plot.
- Do not: The compact plot drops axes and labels.

```html
<div class="ns-chart" style="width:100%;max-width:375px"><div class="ns-chart__head"><div class="ns-chart__kpi"><span class="ns-chart__title">Index</span><span class="ns-chart__value">4,880<span class="ns-chart__trend">+0.8%</span></span><span class="ns-chart__desc">Open, close, high and low</span></div><span class="ns-chart__icon" aria-hidden="true"><svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><rect x="0" y="6" width="3" height="8" rx="1"/><rect x="5.5" y="1" width="3" height="13" rx="1"/><rect x="11" y="4" width="3" height="10" rx="1"/></svg></span></div><svg class="ns-chart__plot" width="327" height="200" viewBox="0 0 327 200" role="img" aria-label="Candlestick chart: ten sessions, green candles close higher and red candles close lower" data-chart="candle" data-size="Medium" data-h="200" data-w="327"><rect x="30" y="-0.5" width="297" height="1" style="fill:var(--ns-widget-grid)"/><rect x="30" y="58.8" width="297" height="1" style="fill:var(--ns-widget-grid)"/><rect x="30" y="118.2" width="297" height="1" style="fill:var(--ns-widget-grid)"/><rect x="30" y="177.5" width="297" height="1" style="fill:var(--ns-widget-grid)"/><text x="22" y="0" text-anchor="end" dominant-baseline="middle" font-size="11" style="fill:var(--ns-chart-label-text)">5.0k</text><text x="22" y="59.3" text-anchor="end" dominant-baseline="middle" font-size="11" style="fill:var(--ns-chart-label-text)">4.8k</text><text x="22" y="118.7" text-anchor="end" dominant-baseline="middle" font-size="11" style="fill:var(--ns-chart-label-text)">4.6k</text><text x="22" y="178" text-anchor="end" dominant-baseline="middle" font-size="11" style="fill:var(--ns-chart-label-text)">4.4k</text><text x="44.9" y="192" text-anchor="middle" dominant-baseline="middle" font-size="11" style="fill:var(--ns-chart-label-text)">Mon</text><text x="178.5" y="192" text-anchor="middle" dominant-baseline="middle" font-size="11" style="fill:var(--ns-chart-label-text)">Wed</text><text x="312.1" y="192" text-anchor="middle" dominant-baseline="middle" font-size="11" style="fill:var(--ns-chart-label-text)">Fri</text><rect x="44.4" y="75.4" width="1" height="40.8" style="fill:var(--ns-status-success)"/><rect x="37.4" y="85.6" width="14.8" height="20.4" rx="1" style="fill:var(--ns-status-success)"/><rect x="74" y="72" width="1" height="34" style="fill:var(--ns-status-error)"/><rect x="67.1" y="85.6" width="14.8" height="10.2" rx="1" style="fill:var(--ns-status-error)"/><rect x="103.8" y="61.8" width="1" height="40.8" style="fill:var(--ns-status-success)"/><rect x="96.8" y="72" width="14.8" height="23.8" rx="1" style="fill:var(--ns-status-success)"/><rect x="133.4" y="48.2" width="1" height="32.3" style="fill:var(--ns-status-success)"/><rect x="126.5" y="55" width="14.8" height="17" rx="1" style="fill:var(--ns-status-success)"/><rect x="163.2" y="41.4" width="1" height="37.4" style="fill:var(--ns-status-error)"/><rect x="156.2" y="55" width="14.8" height="13.6" rx="1" style="fill:var(--ns-status-error)"/><rect x="192.8" y="58.4" width="1" height="30.6" style="fill:var(--ns-status-error)"/><rect x="185.9" y="68.6" width="14.8" height="11.9" rx="1" style="fill:var(--ns-status-error)"/><rect x="222.5" y="51.6" width="1" height="37.4" style="fill:var(--ns-status-success)"/><rect x="215.6" y="58.4" width="14.8" height="22.1" rx="1" style="fill:var(--ns-status-success)"/><rect x="252.3" y="27.8" width="1" height="37.4" style="fill:var(--ns-status-success)"/><rect x="245.3" y="38" width="14.8" height="20.4" rx="1" style="fill:var(--ns-status-success)"/><rect x="281.9" y="24.4" width="1" height="30.6" style="fill:var(--ns-status-error)"/><rect x="275" y="38" width="14.8" height="10.2" rx="1" style="fill:var(--ns-status-error)"/><rect x="311.6" y="21" width="1" height="34" style="fill:var(--ns-status-success)"/><rect x="304.7" y="31.2" width="14.8" height="17" rx="1" style="fill:var(--ns-status-success)"/></svg></div>
```

Tokens: `--ns-status-success` (Rising candle and wick), `--ns-status-error` (Falling candle and wick), `--ns-widget-grid` (Gridlines), `--ns-widget-bg` (Card surface), `--ns-border-subtle` (Card stroke and summary divider), `--ns-chart-label-text` (Axis labels and description), `--ns-status-success` (Trend), `--ns-radius-xl` (Card radius)

Keyboard: -: Not interactive

Accessibility:
- The SVG is role="img" with a label that states the trend. Provide a table of open, close, high and low nearby.
- Direction is never carried by green and red alone.
- Trend text carries its sign, so the color is a second signal.

#### Dumbbell chart (New)

A dumbbell chart joins two values per row to show the gap between them, such as before and after. Five sizes cover a KPI tile, a narrow column, the default card, a card with a summary and a wide multi-KPI panel. The plot renders from one description as SVG, and the same description draws the Figma set.

Page: https://mikelrosenthal.com/northstar/#/components/dumbbell-chart · Figma node 4458:37527

Classes: `ns-chart`, `ns-chart--small`, `ns-chart--vertical`, `ns-chart__desc`, `ns-chart__desc--sm`, `ns-chart__dot`, `ns-chart__head`, `ns-chart__icon`, `ns-chart__kpi`, `ns-chart__kpis`, `ns-chart__plot`, `ns-chart__summary`, `ns-chart__title`, `ns-chart__title--lg`, `ns-chart__title--sm`, `ns-chart__trend`, `ns-chart__value`, `ns-chart__value--sm`

Variants: Size: Small, Vertical small, Medium, Large, XL; Title: Text; Value: Text; Show icon: Boolean

Use:
- Change between two states across several categories.
- Plan against actual, or this period against the last.
- A KPI tile that needs the gap per group.

Avoid:
- One value per row. Use Horizontal bar chart.
- More than two states. Use Line chart.
- Time series. Use Line chart.

- Do: Axis labels and gridlines on the Medium plot.
- Do not: The compact plot drops axes and labels.

```html
<div class="ns-chart" style="width:100%;max-width:375px"><div class="ns-chart__head"><div class="ns-chart__kpi"><span class="ns-chart__title">Satisfaction</span><span class="ns-chart__value">4.6<span class="ns-chart__trend">+0.3%</span></span><span class="ns-chart__desc">Before and after the change</span></div><span class="ns-chart__icon" aria-hidden="true"><svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><rect x="0" y="6" width="3" height="8" rx="1"/><rect x="5.5" y="1" width="3" height="13" rx="1"/><rect x="11" y="4" width="3" height="10" rx="1"/></svg></span></div><svg class="ns-chart__plot" width="327" height="200" viewBox="0 0 327 200" role="img" aria-label="Dumbbell chart: five rows, each joining a before value and an after value" data-chart="dumbbell" data-size="Medium" data-h="200" data-w="327"><text x="0" y="20" text-anchor="start" dominant-baseline="middle" font-size="11" style="fill:var(--ns-chart-label-text)">North</text><rect x="119" y="19" width="107.1" height="2" rx="1" style="fill:var(--ns-widget-grid)"/><circle cx="119" cy="20" r="6" style="fill:var(--ns-chart-series-2)"/><circle cx="226.1" cy="20" r="6" style="fill:var(--ns-chart-series-1)"/><text x="0" y="60" text-anchor="start" dominant-baseline="middle" font-size="11" style="fill:var(--ns-chart-label-text)">South</text><rect x="157.3" y="59" width="114.8" height="2" rx="1" style="fill:var(--ns-widget-grid)"/><circle cx="157.3" cy="60" r="6" style="fill:var(--ns-chart-series-2)"/><circle cx="272" cy="60" r="6" style="fill:var(--ns-chart-series-1)"/><text x="0" y="100" text-anchor="start" dominant-baseline="middle" font-size="11" style="fill:var(--ns-chart-label-text)">East</text><rect x="93.5" y="99" width="89.3" height="2" rx="1" style="fill:var(--ns-widget-grid)"/><circle cx="93.5" cy="100" r="6" style="fill:var(--ns-chart-series-2)"/><circle cx="182.8" cy="100" r="6" style="fill:var(--ns-chart-series-1)"/><text x="0" y="140" text-anchor="start" dominant-baseline="middle" font-size="11" style="fill:var(--ns-chart-label-text)">West</text><rect x="170" y="139" width="76.5" height="2" rx="1" style="fill:var(--ns-widget-grid)"/><circle cx="170" cy="140" r="6" style="fill:var(--ns-chart-series-2)"/><circle cx="246.5" cy="140" r="6" style="fill:var(--ns-chart-series-1)"/><text x="0" y="180" text-anchor="start" dominant-baseline="middle" font-size="11" style="fill:var(--ns-chart-label-text)">Central</text><rect x="131.8" y="179" width="165.8" height="2" rx="1" style="fill:var(--ns-widget-grid)"/><circle cx="131.8" cy="180" r="6" style="fill:var(--ns-chart-series-2)"/><circle cx="297.5" cy="180" r="6" style="fill:var(--ns-chart-series-1)"/></svg></div>
```

Tokens: `--ns-chart-series-1` (End point (alias of viz/1)), `--ns-chart-series-2` (Start point (alias of viz/4)), `--ns-widget-grid` (Link between the points), `--ns-widget-bg` (Card surface), `--ns-border-subtle` (Card stroke and summary divider), `--ns-chart-label-text` (Axis labels and description), `--ns-status-success` (Trend), `--ns-radius-xl` (Card radius)

Keyboard: -: Not interactive

Accessibility:
- The SVG is role="img" with a label naming both states. Provide a table of start and end values nearby.
- Start and end are told apart by color and position; add a legend when that is not obvious.
- Trend text carries its sign, so the color is a second signal.

#### Funnel chart (New)

A funnel chart shows how a count narrows across ordered stages, one centered bar per stage. Five sizes cover a KPI tile, a narrow column, the default card, a card with a summary and a wide multi-KPI panel. The plot renders from one description as SVG, and the same description draws the Figma set.

Page: https://mikelrosenthal.com/northstar/#/components/funnel-chart · Figma node 4458:37265

Classes: `ns-chart`, `ns-chart--small`, `ns-chart--vertical`, `ns-chart__desc`, `ns-chart__desc--sm`, `ns-chart__dot`, `ns-chart__head`, `ns-chart__icon`, `ns-chart__kpi`, `ns-chart__kpis`, `ns-chart__plot`, `ns-chart__summary`, `ns-chart__title`, `ns-chart__title--lg`, `ns-chart__title--sm`, `ns-chart__trend`, `ns-chart__value`, `ns-chart__value--sm`

Variants: Size: Small, Vertical small, Medium, Large, XL; Title: Text; Value: Text; Show icon: Boolean

Use:
- Conversion across an ordered process.
- A drop-off story where each stage is a subset of the last.
- A KPI tile that needs the shape of the loss, not only the end count.

Avoid:
- Unordered categories. Use Horizontal bar chart.
- Flows between states. Use Sankey chart.
- Parts of a whole. Use Donut chart.

- Do: Axis labels and gridlines on the Medium plot.
- Do not: The compact plot drops axes and labels.

```html
<div class="ns-chart" style="width:100%;max-width:375px"><div class="ns-chart__head"><div class="ns-chart__kpi"><span class="ns-chart__title">Signups</span><span class="ns-chart__value">8,420<span class="ns-chart__trend">+3.2%</span></span><span class="ns-chart__desc">From first visit to active</span></div><span class="ns-chart__icon" aria-hidden="true"><svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><rect x="0" y="6" width="3" height="8" rx="1"/><rect x="5.5" y="1" width="3" height="13" rx="1"/><rect x="11" y="4" width="3" height="10" rx="1"/></svg></span></div><svg class="ns-chart__plot" width="327" height="200" viewBox="0 0 327 200" role="img" aria-label="Funnel chart: five stages from visits to active, each narrower than the last" data-chart="funnel" data-size="Medium" data-h="200" data-w="327"><rect x="72" y="0" width="255" height="35.2" rx="12" style="fill:var(--ns-chart-series-1)"/><text x="0" y="17.6" text-anchor="start" dominant-baseline="middle" font-size="11" style="fill:var(--ns-chart-label-text)">Visits</text><rect x="100" y="41.2" width="198.9" height="35.2" rx="12" style="fill:var(--ns-chart-series-1);fill-opacity:0.84"/><text x="0" y="58.8" text-anchor="start" dominant-baseline="middle" font-size="11" style="fill:var(--ns-chart-label-text)">Signups</text><rect x="128.1" y="82.4" width="142.8" height="35.2" rx="12" style="fill:var(--ns-chart-series-1);fill-opacity:0.6799999999999999"/><text x="0" y="100" text-anchor="start" dominant-baseline="middle" font-size="11" style="fill:var(--ns-chart-label-text)">Trial</text><rect x="151.1" y="123.6" width="96.9" height="35.2" rx="12" style="fill:var(--ns-chart-series-1);fill-opacity:0.52"/><text x="0" y="141.2" text-anchor="start" dominant-baseline="middle" font-size="11" style="fill:var(--ns-chart-label-text)">Paid</text><rect x="171.4" y="164.8" width="56.1" height="35.2" rx="12" style="fill:var(--ns-chart-series-1);fill-opacity:0.36"/><text x="0" y="182.4" text-anchor="start" dominant-baseline="middle" font-size="11" style="fill:var(--ns-chart-label-text)">Active</text></svg></div>
```

Tokens: `--ns-chart-series-1` (Stage bars (opacity steps by stage)), `--ns-chart-label-text` (Stage labels), `--ns-widget-bg` (Card surface), `--ns-border-subtle` (Card stroke and summary divider), `--ns-chart-label-text` (Axis labels and description), `--ns-status-success` (Trend), `--ns-radius-xl` (Card radius)

Keyboard: -: Not interactive

Accessibility:
- The SVG is role="img" with a label naming the stages. Provide a table of counts and conversion rates nearby.
- Order is carried by position and width, never by color.
- Trend text carries its sign, so the color is a second signal.

#### Gauge chart (New)

A gauge chart shows one value against its limit on a half circle. Five sizes cover a KPI tile, a narrow column, the default card, a card with a summary and a wide multi-KPI panel. The plot renders from one description as SVG, and the same description draws the Figma set.

Page: https://mikelrosenthal.com/northstar/#/components/gauge-chart · Figma node 4460:38422

Classes: `ns-chart`, `ns-chart--small`, `ns-chart--vertical`, `ns-chart__desc`, `ns-chart__desc--sm`, `ns-chart__dot`, `ns-chart__head`, `ns-chart__icon`, `ns-chart__kpi`, `ns-chart__kpis`, `ns-chart__plot`, `ns-chart__summary`, `ns-chart__title`, `ns-chart__title--lg`, `ns-chart__title--sm`, `ns-chart__trend`, `ns-chart__value`, `ns-chart__value--sm`

Variants: Size: Small, Vertical small, Medium, Large, XL; Title: Text; Value: Text; Show icon: Boolean

Use:
- One measure against its ceiling: capacity, quota, budget.
- A status tile that needs the headroom at a glance.
- Small spaces where a number needs context.

Avoid:
- More than one measure. Use Bullet chart.
- Trends. Use Line chart.
- Parts of a whole. Use Donut chart.

- Do: Axis labels and gridlines on the Medium plot.
- Do not: The compact plot drops axes and labels.

```html
<div class="ns-chart" style="width:100%;max-width:375px"><div class="ns-chart__head"><div class="ns-chart__kpi"><span class="ns-chart__title">Capacity</span><span class="ns-chart__value">72%<span class="ns-chart__trend">+4.0%</span></span><span class="ns-chart__desc">Share of the limit used</span></div><span class="ns-chart__icon" aria-hidden="true"><svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><rect x="0" y="6" width="3" height="8" rx="1"/><rect x="5.5" y="1" width="3" height="13" rx="1"/><rect x="11" y="4" width="3" height="10" rx="1"/></svg></span></div><svg class="ns-chart__plot" width="327" height="200" viewBox="0 0 327 200" role="img" aria-label="Gauge: 72 percent of the limit is used" data-chart="gauge" data-size="Medium" data-h="200" data-w="327"><path d="M4 182A159.5 159.5 0 0 1 323 182L278.3 182A114.83999999999999 114.83999999999999 0 0 0 48.7 182Z" fill-rule="evenodd" style="fill:var(--ns-chart-track)"/><path d="M4 182A159.5 159.5 0 0 1 265.2 59.1L236.7 93.5A114.83999999999999 114.83999999999999 0 0 0 48.7 182Z" fill-rule="evenodd" style="fill:var(--ns-chart-series-1)"/><text x="163.5" y="134.2" text-anchor="middle" dominant-baseline="middle" font-size="24" font-weight="700" style="fill:var(--ns-text-primary)">72%</text><text x="26.3" y="192" text-anchor="middle" dominant-baseline="middle" font-size="11" style="fill:var(--ns-chart-label-text)">0</text><text x="300.7" y="192" text-anchor="middle" dominant-baseline="middle" font-size="11" style="fill:var(--ns-chart-label-text)">100</text></svg></div>
```

Tokens: `--ns-chart-series-1` (Value arc (alias of viz/1)), `--ns-chart-track` (Track arc (alias of widget/track)), `--ns-text-primary` (Value label), `--ns-widget-bg` (Card surface), `--ns-border-subtle` (Card stroke and summary divider), `--ns-chart-label-text` (Axis labels and description), `--ns-status-success` (Trend), `--ns-radius-xl` (Card radius)

Keyboard: -: Not interactive

Accessibility:
- The SVG is role="img" with the value and the limit in the label, for example 72 percent of the limit used.
- The value is also printed as text inside the arc.
- Trend text carries its sign, so the color is a second signal.

#### Heatmap chart (New)

A heatmap shows a measure as the intensity of cells in a grid of two categories. Five sizes cover a KPI tile, a narrow column, the default card, a card with a summary and a wide multi-KPI panel. The plot renders from one description as SVG, and the same description draws the Figma set.

Page: https://mikelrosenthal.com/northstar/#/components/heatmap-chart · Figma node 4458:38007

Classes: `ns-chart`, `ns-chart--small`, `ns-chart--vertical`, `ns-chart__desc`, `ns-chart__desc--sm`, `ns-chart__dot`, `ns-chart__head`, `ns-chart__icon`, `ns-chart__kpi`, `ns-chart__kpis`, `ns-chart__plot`, `ns-chart__summary`, `ns-chart__title`, `ns-chart__title--lg`, `ns-chart__title--sm`, `ns-chart__trend`, `ns-chart__value`, `ns-chart__value--sm`

Variants: Size: Small, Vertical small, Medium, Large, XL; Title: Text; Value: Text; Show icon: Boolean

Use:
- Patterns across two categories at once.
- Activity by weekday and hour, or errors by service and day.
- A KPI tile that needs where the load sits.

Avoid:
- Exact values. Use Data table.
- One category. Use Bar chart.
- Trends over time. Use Line chart.

- Do: Axis labels and gridlines on the Medium plot.
- Do not: The compact plot drops axes and labels.

```html
<div class="ns-chart" style="width:100%;max-width:375px"><div class="ns-chart__head"><div class="ns-chart__kpi"><span class="ns-chart__title">Activity</span><span class="ns-chart__value">3,260<span class="ns-chart__trend">+5.1%</span></span><span class="ns-chart__desc">Events by weekday and hour</span></div><span class="ns-chart__icon" aria-hidden="true"><svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><rect x="0" y="6" width="3" height="8" rx="1"/><rect x="5.5" y="1" width="3" height="13" rx="1"/><rect x="11" y="4" width="3" height="10" rx="1"/></svg></span></div><svg class="ns-chart__plot" width="327" height="200" viewBox="0 0 327 200" role="img" aria-label="Heatmap: activity by weekday and time, darker cells mean more events" data-chart="heatmap" data-size="Medium" data-h="200" data-w="327"><text x="26" y="16.6" text-anchor="end" dominant-baseline="middle" font-size="11" style="fill:var(--ns-chart-label-text)">Mon</text><rect x="34" y="0" width="21.7" height="33.2" rx="3" style="fill:var(--ns-chart-series-1);fill-opacity:0.12"/><rect x="58.7" y="0" width="21.7" height="33.2" rx="3" style="fill:var(--ns-chart-series-1);fill-opacity:0.6088888888888889"/><rect x="83.3" y="0" width="21.7" height="33.2" rx="3" style="fill:var(--ns-chart-series-1);fill-opacity:0.12"/><rect x="108" y="0" width="21.7" height="33.2" rx="3" style="fill:var(--ns-chart-series-1);fill-opacity:0.6088888888888889"/><rect x="132.7" y="0" width="21.7" height="33.2" rx="3" style="fill:var(--ns-chart-series-1);fill-opacity:0.12"/><rect x="157.3" y="0" width="21.7" height="33.2" rx="3" style="fill:var(--ns-chart-series-1);fill-opacity:0.6088888888888889"/><rect x="182" y="0" width="21.7" height="33.2" rx="3" style="fill:var(--ns-chart-series-1);fill-opacity:0.12"/><rect x="206.7" y="0" width="21.7" height="33.2" rx="3" style="fill:var(--ns-chart-series-1);fill-opacity:0.6088888888888889"/><rect x="231.3" y="0" width="21.7" height="33.2" rx="3" style="fill:var(--ns-chart-series-1);fill-opacity:0.12"/><rect x="256" y="0" width="21.7" height="33.2" rx="3" style="fill:var(--ns-chart-series-1);fill-opacity:0.6088888888888889"/><rect x="280.7" y="0" width="21.7" height="33.2" rx="3" style="fill:var(--ns-chart-series-1);fill-opacity:0.12"/><rect x="305.3" y="0" width="21.7" height="33.2" rx="3" style="fill:var(--ns-chart-series-1);fill-opacity:0.6088888888888889"/><text x="26" y="52.8" text-anchor="end" dominant-baseline="middle" font-size="11" style="fill:var(--ns-chart-label-text)">Tue</text><rect x="34" y="36.2" width="21.7" height="33.2" rx="3" style="fill:var(--ns-chart-series-1);fill-opacity:0.5111111111111111"/><rect x="58.7" y="36.2" width="21.7" height="33.2" rx="3" style="fill:var(--ns-chart-series-1);fill-opacity:0.12"/><rect x="83.3" y="36.2" width="21.7" height="33.2" rx="3" style="fill:var(--ns-chart-series-1);fill-opacity:0.7066666666666667"/><rect x="108" y="36.2" width="21.7" height="33.2" rx="3" style="fill:var(--ns-chart-series-1);fill-opacity:0.31555555555555553"/><rect x="132.7" y="36.2" width="21.7" height="33.2" rx="3" style="fill:var(--ns-chart-series-1);fill-opacity:0.9022222222222221"/><rect x="157.3" y="36.2" width="21.7" height="33.2" rx="3" style="fill:var(--ns-chart-series-1);fill-opacity:0.5111111111111111"/><rect x="182" y="36.2" width="21.7" height="33.2" rx="3" style="fill:var(--ns-chart-series-1);fill-opacity:0.12"/><rect x="206.7" y="36.2" width="21.7" height="33.2" rx="3" style="fill:var(--ns-chart-series-1);fill-opacity:0.7066666666666667"/><rect x="231.3" y="36.2" width="21.7" height="33.2" rx="3" style="fill:var(--ns-chart-series-1);fill-opacity:0.31555555555555553"/><rect x="256" y="36.2" width="21.7" height="33.2" rx="3" style="fill:var(--ns-chart-series-1);fill-opacity:0.9022222222222221"/><rect x="280.7" y="36.2" width="21.7" height="33.2" rx="3" style="fill:var(--ns-chart-series-1);fill-opacity:0.5111111111111111"/><rect x="305.3" y="36.2" width="21.7" height="33.2" rx="3" style="fill:var(--ns-chart-series-1);fill-opacity:0.12"/><text x="26" y="89" text-anchor="end" dominant-baseline="middle" font-size="11" style="fill:var(--ns-chart-label-text)">Wed</text><rect x="34" y="72.4" width="21.7" height="33.2" rx="3" style="fill:var(--ns-chart-series-1);fill-opacity:0.9022222222222221"/><rect x="58.7" y="72.4" width="21.7" height="33.2" rx="3" style="fill:var(--ns-chart-series-1);fill-opacity:0.6088888888888889"/><rect x="83.3" y="72.4" width="21.7" height="33.2" rx="3" style="fill:var(--ns-chart-series-1);fill-opacity:0.31555555555555553"/><rect x="108" y="72.4" width="21.7" height="33.2" rx="3" style="fill:var(--ns-chart-series-1)"/><rect x="132.7" y="72.4" width="21.7" height="33.2" rx="3" style="fill:var(--ns-chart-series-1);fill-opacity:0.7066666666666667"/><rect x="157.3" y="72.4" width="21.7" height="33.2" rx="3" style="fill:var(--ns-chart-series-1);fill-opacity:0.41333333333333333"/><rect x="182" y="72.4" width="21.7" height="33.2" rx="3" style="fill:var(--ns-chart-series-1);fill-opacity:0.12"/><rect x="206.7" y="72.4" width="21.7" height="33.2" rx="3" style="fill:var(--ns-chart-series-1);fill-opacity:0.8044444444444444"/><rect x="231.3" y="72.4" width="21.7" height="33.2" rx="3" style="fill:var(--ns-chart-series-1);fill-opacity:0.5111111111111111"/><rect x="256" y="72.4" width="21.7" height="33.2" rx="3" style="fill:var(--ns-chart-series-1);fill-opacity:0.21777777777777776"/><rect x="280.7" y="72.4" width="21.7" height="33.2" rx="3" style="fill:var(--ns-chart-series-1);fill-opacity:0.9022222222222221"/><rect x="305.3" y="72.4" width="21.7" height="33.2" rx="3" style="fill:var(--ns-chart-series-1);fill-opacity:0.6088888888888889"/><text x="26" y="125.2" text-anchor="end" dominant-baseline="middle" font-size="11" style="fill:var(--ns-chart-label-text)">Thu</text><rect x="34" y="108.6" width="21.7" height="33.2" rx="3" style="fill:var(--ns-chart-series-1);fill-opacity:0.31555555555555553"/><rect x="58.7" y="108.6" width="21.7" height="33.2" rx="3" style="fill:var(--ns-chart-series-1);fill-opacity:0.12"/><rect x="83.3" y="108.6" width="21.7" height="33.2" rx="3" style="fill:var(--ns-chart-series-1);fill-opacity:0.9022222222222221"/><rect x="108" y="108.6" width="21.7" height="33.2" rx="3" style="fill:var(--ns-chart-series-1);fill-opacity:0.7066666666666667"/><rect x="132.7" y="108.6" width="21.7" height="33.2" rx="3" style="fill:var(--ns-chart-series-1);fill-opacity:0.5111111111111111"/><rect x="157.3" y="108.6" width="21.7" height="33.2" rx="3" style="fill:var(--ns-chart-series-1);fill-opacity:0.31555555555555553"/><rect x="182" y="108.6" width="21.7" height="33.2" rx="3" style="fill:var(--ns-chart-series-1);fill-opacity:0.12"/><rect x="206.7" y="108.6" width="21.7" height="33.2" rx="3" style="fill:var(--ns-chart-series-1);fill-opacity:0.9022222222222221"/><rect x="231.3" y="108.6" width="21.7" height="33.2" rx="3" style="fill:var(--ns-chart-series-1);fill-opacity:0.7066666666666667"/><rect x="256" y="108.6" width="21.7" height="33.2" rx="3" style="fill:var(--ns-chart-series-1);fill-opacity:0.5111111111111111"/><rect x="280.7" y="108.6" width="21.7" height="33.2" rx="3" style="fill:var(--ns-chart-series-1);fill-opacity:0.31555555555555553"/><rect x="305.3" y="108.6" width="21.7" height="33.2" rx="3" style="fill:var(--ns-chart-series-1);fill-opacity:0.12"/><text x="26" y="161.4" text-anchor="end" dominant-baseline="middle" font-size="11" style="fill:var(--ns-chart-label-text)">Fri</text><rect x="34" y="144.8" width="21.7" height="33.2" rx="3" style="fill:var(--ns-chart-series-1);fill-opacity:0.7066666666666667"/><rect x="58.7" y="144.8" width="21.7" height="33.2" rx="3" style="fill:var(--ns-chart-series-1);fill-opacity:0.6088888888888889"/><rect x="83.3" y="144.8" width="21.7" height="33.2" rx="3" style="fill:var(--ns-chart-series-1);fill-opacity:0.5111111111111111"/><rect x="108" y="144.8" width="21.7" height="33.2" rx="3" style="fill:var(--ns-chart-series-1);fill-opacity:0.41333333333333333"/><rect x="132.7" y="144.8" width="21.7" height="33.2" rx="3" style="fill:var(--ns-chart-series-1);fill-opacity:0.31555555555555553"/><rect x="157.3" y="144.8" width="21.7" height="33.2" rx="3" style="fill:var(--ns-chart-series-1);fill-opacity:0.21777777777777776"/><rect x="182" y="144.8" width="21.7" height="33.2" rx="3" style="fill:var(--ns-chart-series-1);fill-opacity:0.12"/><rect x="206.7" y="144.8" width="21.7" height="33.2" rx="3" style="fill:var(--ns-chart-series-1)"/><rect x="231.3" y="144.8" width="21.7" height="33.2" rx="3" style="fill:var(--ns-chart-series-1);fill-opacity:0.9022222222222221"/><rect x="256" y="144.8" width="21.7" height="33.2" rx="3" style="fill:var(--ns-chart-series-1);fill-opacity:0.8044444444444444"/><rect x="280.7" y="144.8" width="21.7" height="33.2" rx="3" style="fill:var(--ns-chart-series-1);fill-opacity:0.7066666666666667"/><rect x="305.3" y="144.8" width="21.7" height="33.2" rx="3" style="fill:var(--ns-chart-series-1);fill-opacity:0.6088888888888889"/><text x="44.8" y="192" text-anchor="middle" dominant-baseline="middle" font-size="11" style="fill:var(--ns-chart-label-text)">6a</text><text x="180.5" y="192" text-anchor="middle" dominant-baseline="middle" font-size="11" style="fill:var(--ns-chart-label-text)">12p</text><text x="316.2" y="192" text-anchor="middle" dominant-baseline="middle" font-size="11" style="fill:var(--ns-chart-label-text)">6p</text></svg></div>
```

Tokens: `--ns-chart-series-1` (Cell color (opacity carries the value)), `--ns-chart-label-text` (Row and column labels), `--ns-widget-bg` (Card surface), `--ns-border-subtle` (Card stroke and summary divider), `--ns-chart-label-text` (Axis labels and description), `--ns-status-success` (Trend), `--ns-radius-xl` (Card radius)

Keyboard: -: Not interactive

Accessibility:
- The SVG is role="img" with a label naming both categories. Provide a table of the values nearby.
- Intensity is a single-hue ramp; show exact values in a table or on focus.
- Trend text carries its sign, so the color is a second signal.

#### Line chart (New)

A line chart shows how a value moves over time, here against the same period last year. Five sizes cover a KPI tile, a narrow column, the default card, a card with a summary and a wide multi-KPI panel. The plot renders from one description as SVG, and the same description draws the Figma set.

Page: https://mikelrosenthal.com/northstar/#/components/line-chart · Figma node 4721:1646

Classes: `ns-chart`, `ns-chart--small`, `ns-chart--vertical`, `ns-chart__desc`, `ns-chart__desc--sm`, `ns-chart__dot`, `ns-chart__head`, `ns-chart__icon`, `ns-chart__kpi`, `ns-chart__kpis`, `ns-chart__plot`, `ns-chart__summary`, `ns-chart__title`, `ns-chart__title--lg`, `ns-chart__title--sm`, `ns-chart__trend`, `ns-chart__value`, `ns-chart__value--sm`

Variants: Size: Small, Vertical small, Medium, Large, XL; Title: Text; Value: Text; Show icon: Boolean

Use:
- A trend over time.
- Comparing this period with the last one.

Avoid:
- Few categories. Use Bar chart.
- Values that change only on set dates. Use Stepped line chart.

- Do: Axis labels and gridlines on the Medium plot.
- Do not: The compact plot drops axes and labels.

```html
<div class="ns-chart" style="width:100%;max-width:375px"><div class="ns-chart__head"><div class="ns-chart__kpi"><span class="ns-chart__title">Revenue</span><span class="ns-chart__value">$84,200<span class="ns-chart__trend">+6.1%</span></span><span class="ns-chart__desc">This year against last year</span></div><span class="ns-chart__icon" aria-hidden="true"><svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><rect x="0" y="6" width="3" height="8" rx="1"/><rect x="5.5" y="1" width="3" height="13" rx="1"/><rect x="11" y="4" width="3" height="10" rx="1"/></svg></span></div><svg class="ns-chart__plot" width="327" height="200" viewBox="0 0 327 200" role="img" aria-label="Line chart: revenue this year against last year, this year ends higher" data-chart="line" data-size="Medium" data-h="200" data-w="327"><rect x="30" y="-0.5" width="297" height="1" style="fill:var(--ns-widget-grid)"/><rect x="30" y="58.8" width="297" height="1" style="fill:var(--ns-widget-grid)"/><rect x="30" y="118.2" width="297" height="1" style="fill:var(--ns-widget-grid)"/><rect x="30" y="177.5" width="297" height="1" style="fill:var(--ns-widget-grid)"/><text x="22" y="0" text-anchor="end" dominant-baseline="middle" font-size="11" style="fill:var(--ns-chart-label-text)">$12k</text><text x="22" y="59.3" text-anchor="end" dominant-baseline="middle" font-size="11" style="fill:var(--ns-chart-label-text)">$8k</text><text x="22" y="118.7" text-anchor="end" dominant-baseline="middle" font-size="11" style="fill:var(--ns-chart-label-text)">$4k</text><text x="22" y="178" text-anchor="end" dominant-baseline="middle" font-size="11" style="fill:var(--ns-chart-label-text)">0</text><text x="42" y="192" text-anchor="middle" dominant-baseline="middle" font-size="11" style="fill:var(--ns-chart-label-text)">Jan</text><text x="133" y="192" text-anchor="middle" dominant-baseline="middle" font-size="11" style="fill:var(--ns-chart-label-text)">Apr</text><text x="224" y="192" text-anchor="middle" dominant-baseline="middle" font-size="11" style="fill:var(--ns-chart-label-text)">Jul</text><text x="315" y="192" text-anchor="middle" dominant-baseline="middle" font-size="11" style="fill:var(--ns-chart-label-text)">Oct</text><path d="M30.0 123.0 L72.4 102.6 L114.9 109.4 L157.3 80.5 L199.7 89.0 L242.1 65.2 L284.6 72.0 L327.0 44.8 L327.0 178.0 L30.0 178.0 Z" stroke-linecap="round" stroke-linejoin="round" style="fill:var(--ns-chart-series-1);fill-opacity:0.12"/><path d="M30.0 126.4 L72.4 123.0 L114.9 106.0 L157.3 112.8 L199.7 95.8 L242.1 99.2 L284.6 85.6 L327.0 78.8" stroke-linecap="round" stroke-linejoin="round" style="fill:none;stroke:var(--ns-chart-series-3);stroke-width:2"/><path d="M30.0 123.0 L72.4 102.6 L114.9 109.4 L157.3 80.5 L199.7 89.0 L242.1 65.2 L284.6 72.0 L327.0 44.8" stroke-linecap="round" stroke-linejoin="round" style="fill:none;stroke:var(--ns-chart-series-1);stroke-width:2"/><circle cx="323" cy="44.8" r="4" style="fill:var(--ns-chart-series-1)"/></svg></div>
```

Tokens: `--ns-chart-series-1` (This year line, area and latest point), `--ns-chart-series-3` (Comparison line), `--ns-widget-grid` (Gridlines), `--ns-widget-bg` (Card surface), `--ns-border-subtle` (Card stroke and summary divider), `--ns-chart-label-text` (Axis labels and description), `--ns-status-success` (Trend), `--ns-radius-xl` (Card radius)

Keyboard: -: Not interactive

Accessibility:
- The SVG is role="img" with a label naming both series and which ends higher. Provide a table nearby.
- Trend text carries its sign, so the color is a second signal.

#### Parallel coordinates chart (New)

A parallel coordinates chart compares several measures across profiles, one line per profile, so you can see which profiles move together. Five sizes cover a KPI tile, a narrow column, the default card, a card with a summary and a wide multi-KPI panel. The plot renders from one description as SVG, and the same description draws the Figma set.

Page: https://mikelrosenthal.com/northstar/#/components/parallel-coordinates-chart · Figma node 4460:166

Classes: `ns-chart`, `ns-chart--small`, `ns-chart--vertical`, `ns-chart__desc`, `ns-chart__desc--sm`, `ns-chart__dot`, `ns-chart__head`, `ns-chart__icon`, `ns-chart__kpi`, `ns-chart__kpis`, `ns-chart__plot`, `ns-chart__summary`, `ns-chart__title`, `ns-chart__title--lg`, `ns-chart__title--sm`, `ns-chart__trend`, `ns-chart__value`, `ns-chart__value--sm`

Variants: Size: Small, Vertical small, Medium, Large, XL; Title: Text; Value: Text; Show icon: Boolean

Use:
- Comparing items across four to six measures at once.
- Seeing which profiles move together.
- A KPI tile that needs the shape of each profile.

Avoid:
- Two measures. Use Scatter chart.
- Time series. Use Line chart.
- More than about eight profiles. Use a table.

- Do: Axis labels and gridlines on the Medium plot.
- Do not: The compact plot drops axes and labels.

```html
<div class="ns-chart" style="width:100%;max-width:375px"><div class="ns-chart__head"><div class="ns-chart__kpi"><span class="ns-chart__title">Profiles</span><span class="ns-chart__value">128<span class="ns-chart__trend">+4.0%</span></span><span class="ns-chart__desc">4 of 128 profiles shown across five measures</span></div><span class="ns-chart__icon" aria-hidden="true"><svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><rect x="0" y="6" width="3" height="8" rx="1"/><rect x="5.5" y="1" width="3" height="13" rx="1"/><rect x="11" y="4" width="3" height="10" rx="1"/></svg></span></div><svg class="ns-chart__plot" width="327" height="200" viewBox="0 0 327 200" role="img" aria-label="Parallel coordinates: four of 128 profiles across five measures, one line per profile" data-chart="parallel" data-size="Medium" data-h="200" data-w="327"><rect x="15.5" y="0" width="1" height="178" style="fill:var(--ns-widget-grid)"/><rect x="89.3" y="0" width="1" height="178" style="fill:var(--ns-widget-grid)"/><rect x="163" y="0" width="1" height="178" style="fill:var(--ns-widget-grid)"/><rect x="236.8" y="0" width="1" height="178" style="fill:var(--ns-widget-grid)"/><rect x="310.5" y="0" width="1" height="178" style="fill:var(--ns-widget-grid)"/><path d="M16.0 140.0 L89.8 55.0 L163.5 106.0 L237.3 38.0 L311.0 89.0" stroke-linecap="round" stroke-linejoin="round" style="fill:none;stroke:var(--ns-chart-series-1);stroke-width:2"/><path d="M16.0 72.0 L89.8 123.0 L163.5 55.0 L237.3 140.0 L311.0 72.0" stroke-linecap="round" stroke-linejoin="round" style="fill:none;stroke:var(--ns-chart-series-2);stroke-width:2"/><path d="M16.0 38.0 L89.8 89.0 L163.5 140.0 L237.3 72.0 L311.0 21.0" stroke-linecap="round" stroke-linejoin="round" style="fill:none;stroke:var(--ns-chart-series-3);stroke-width:2"/><path d="M16.0 106.0 L89.8 21.0 L163.5 72.0 L237.3 106.0 L311.0 140.0" stroke-linecap="round" stroke-linejoin="round" style="fill:none;stroke:var(--ns-chart-series-4);stroke-width:2"/><text x="16" y="192" text-anchor="middle" dominant-baseline="middle" font-size="11" style="fill:var(--ns-chart-label-text)">Speed</text><text x="89.8" y="192" text-anchor="middle" dominant-baseline="middle" font-size="11" style="fill:var(--ns-chart-label-text)">Cost</text><text x="163.5" y="192" text-anchor="middle" dominant-baseline="middle" font-size="11" style="fill:var(--ns-chart-label-text)">Reach</text><text x="237.3" y="192" text-anchor="middle" dominant-baseline="middle" font-size="11" style="fill:var(--ns-chart-label-text)">Rate</text><text x="311" y="192" text-anchor="middle" dominant-baseline="middle" font-size="11" style="fill:var(--ns-chart-label-text)">Score</text></svg></div>
```

Tokens: `--ns-chart-series-1` (Profile 1 (alias of viz/1)), `--ns-chart-series-2` (Profile 2 (alias of viz/4)), `--ns-chart-series-3` (Profile 3 (alias of viz/2)), `--ns-chart-series-4` (Profile 4 (alias of viz/7)), `--ns-widget-grid` (Axes), `--ns-widget-bg` (Card surface), `--ns-border-subtle` (Card stroke and summary divider), `--ns-chart-label-text` (Axis labels and description), `--ns-status-success` (Trend), `--ns-radius-xl` (Card radius)

Keyboard: -: Not interactive

Accessibility:
- The SVG is role="img" with a label naming the measures. Provide a table of the values per profile nearby.
- Lines are told apart by label or by highlighting, never by color alone.
- Trend text carries its sign, so the color is a second signal.

#### Pie chart (New)

A donut chart shows how one whole splits into four or fewer parts. Five sizes cover a KPI tile, a narrow column, the default card, a card with a summary and a wide multi-KPI panel. The plot renders from one description as SVG, and the same description draws the Figma set.

Page: https://mikelrosenthal.com/northstar/#/components/pie-chart · Figma node 4721:1881

Classes: `ns-chart`, `ns-chart--small`, `ns-chart--vertical`, `ns-chart__desc`, `ns-chart__desc--sm`, `ns-chart__dot`, `ns-chart__head`, `ns-chart__icon`, `ns-chart__kpi`, `ns-chart__kpis`, `ns-chart__plot`, `ns-chart__summary`, `ns-chart__title`, `ns-chart__title--lg`, `ns-chart__title--sm`, `ns-chart__trend`, `ns-chart__value`, `ns-chart__value--sm`

Variants: Size: Small, Vertical small, Medium, Large, XL; Title: Text; Value: Text; Show icon: Boolean

Use:
- Share of a whole with four parts or fewer.
- A KPI tile that needs a mix, not a trend.

Avoid:
- More than four parts. Use Bar chart.
- Change over time. Use Line chart.

- Do: Axis labels and gridlines on the Medium plot.
- Do not: The compact plot drops axes and labels.

```html
<div class="ns-chart" style="width:100%;max-width:375px"><div class="ns-chart__head"><div class="ns-chart__kpi"><span class="ns-chart__title">Visits</span><span class="ns-chart__value">48,300<span class="ns-chart__trend">+3.4%</span></span><span class="ns-chart__desc">Share of visits by channel</span></div><span class="ns-chart__icon" aria-hidden="true"><svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><rect x="0" y="6" width="3" height="8" rx="1"/><rect x="5.5" y="1" width="3" height="13" rx="1"/><rect x="11" y="4" width="3" height="10" rx="1"/></svg></span></div><svg class="ns-chart__plot" width="327" height="200" viewBox="0 0 327 200" role="img" aria-label="Donut chart: traffic by channel, search 42%, direct 28%, social 18%, email 12%" data-chart="pie" data-size="Medium" data-h="200" data-w="327"><path d="M104.8 2A98 98 0 0 1 151.8 185.3L133.5 152.9A60.76 60.76 0 0 0 104.3 39.2Z" fill-rule="evenodd" style="fill:var(--ns-chart-series-1)"/><path d="M149.6 186.5A98 98 0 0 1 10.7 131.5L46 119.5A60.76 60.76 0 0 0 132.1 153.6Z" fill-rule="evenodd" style="fill:var(--ns-chart-series-2)"/><path d="M9.9 129.1A98 98 0 0 1 35.5 29.4L61.3 56.3A60.76 60.76 0 0 0 45.5 118Z" fill-rule="evenodd" style="fill:var(--ns-chart-series-3)"/><path d="M37.4 27.7A98 98 0 0 1 102.2 2L102.7 39.2A60.76 60.76 0 0 0 62.5 55.2Z" fill-rule="evenodd" style="fill:var(--ns-chart-series-4)"/><text x="103.5" y="100" text-anchor="middle" dominant-baseline="middle" font-size="18" font-weight="700" style="fill:var(--ns-text-primary)">42%</text><rect x="215" y="63" width="8" height="8" rx="2" style="fill:var(--ns-chart-series-1)"/><text x="229" y="67" text-anchor="start" dominant-baseline="middle" font-size="11" style="fill:var(--ns-chart-label-text)">Search 42%</text><rect x="215" y="85" width="8" height="8" rx="2" style="fill:var(--ns-chart-series-2)"/><text x="229" y="89" text-anchor="start" dominant-baseline="middle" font-size="11" style="fill:var(--ns-chart-label-text)">Direct 28%</text><rect x="215" y="107" width="8" height="8" rx="2" style="fill:var(--ns-chart-series-3)"/><text x="229" y="111" text-anchor="start" dominant-baseline="middle" font-size="11" style="fill:var(--ns-chart-label-text)">Social 18%</text><rect x="215" y="129" width="8" height="8" rx="2" style="fill:var(--ns-chart-series-4)"/><text x="229" y="133" text-anchor="start" dominant-baseline="middle" font-size="11" style="fill:var(--ns-chart-label-text)">Email 12%</text></svg></div>
```

Tokens: `--ns-chart-series-1` (Largest segment), `--ns-chart-series-2` (Second segment), `--ns-chart-series-3` (Third segment), `--ns-chart-series-4` (Fourth segment), `--ns-widget-bg` (Card surface), `--ns-border-subtle` (Card stroke and summary divider), `--ns-chart-label-text` (Axis labels and description), `--ns-status-success` (Trend), `--ns-radius-xl` (Card radius)

Keyboard: -: Not interactive

Accessibility:
- The SVG is role="img" with a label listing every part and its percent.
- Trend text carries its sign, so the color is a second signal.

#### Radar chart (New)

A radar chart compares several measures for one or two items on radial axes. Five sizes cover a KPI tile, a narrow column, the default card, a card with a summary and a wide multi-KPI panel. The plot renders from one description as SVG, and the same description draws the Figma set.

Page: https://mikelrosenthal.com/northstar/#/components/radar-chart · Figma node 4462:38673

Classes: `ns-chart`, `ns-chart--small`, `ns-chart--vertical`, `ns-chart__desc`, `ns-chart__desc--sm`, `ns-chart__dot`, `ns-chart__head`, `ns-chart__icon`, `ns-chart__kpi`, `ns-chart__kpis`, `ns-chart__plot`, `ns-chart__summary`, `ns-chart__title`, `ns-chart__title--lg`, `ns-chart__title--sm`, `ns-chart__trend`, `ns-chart__value`, `ns-chart__value--sm`

Variants: Size: Small, Vertical small, Medium, Large, XL; Title: Text; Value: Text; Show icon: Boolean

Use:
- One or two items across five to eight measures.
- Comparing an item against a target profile.
- A KPI tile that needs balance, not only a total.

Avoid:
- Exact values. Use Data table.
- More than three items. Use Parallel coordinates chart.
- Fewer than five measures. Use Bar chart.

- Do: Axis labels and gridlines on the Medium plot.
- Do not: The compact plot drops axes and labels.

```html
<div class="ns-chart" style="width:100%;max-width:375px"><div class="ns-chart__head"><div class="ns-chart__kpi"><span class="ns-chart__title">Coverage</span><span class="ns-chart__value">68%<span class="ns-chart__trend">+3.0%</span></span><span class="ns-chart__desc">Average of series 1 across six skills</span></div><span class="ns-chart__icon" aria-hidden="true"><svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><rect x="0" y="6" width="3" height="8" rx="1"/><rect x="5.5" y="1" width="3" height="13" rx="1"/><rect x="11" y="4" width="3" height="10" rx="1"/></svg></span></div><svg class="ns-chart__plot" width="327" height="200" viewBox="0 0 327 200" role="img" aria-label="Radar chart: two series across six measures" data-chart="radar" data-size="Medium" data-h="200" data-w="327"><path d="M163.5 18.0 L234.5 59.0 L234.5 141.0 L163.5 182.0 L92.5 141.0 L92.5 59.0Z" stroke-linecap="round" stroke-linejoin="round" style="fill:none;stroke:var(--ns-widget-grid);stroke-width:1"/><path d="M163.5 45.9 L210.4 72.9 L210.4 127.1 L163.5 154.1 L116.6 127.1 L116.6 72.9Z" stroke-linecap="round" stroke-linejoin="round" style="fill:none;stroke:var(--ns-widget-grid);stroke-width:1"/><path d="M163.5 72.9 L186.9 86.5 L186.9 113.5 L163.5 127.1 L140.1 113.5 L140.1 86.5Z" stroke-linecap="round" stroke-linejoin="round" style="fill:none;stroke:var(--ns-widget-grid);stroke-width:1"/><path d="M163.5 100.0 L163.5 18.0" stroke-linecap="round" stroke-linejoin="round" style="fill:none;stroke:var(--ns-widget-grid);stroke-width:1"/><path d="M163.5 100.0 L234.5 59.0" stroke-linecap="round" stroke-linejoin="round" style="fill:none;stroke:var(--ns-widget-grid);stroke-width:1"/><path d="M163.5 100.0 L234.5 141.0" stroke-linecap="round" stroke-linejoin="round" style="fill:none;stroke:var(--ns-widget-grid);stroke-width:1"/><path d="M163.5 100.0 L163.5 182.0" stroke-linecap="round" stroke-linejoin="round" style="fill:none;stroke:var(--ns-widget-grid);stroke-width:1"/><path d="M163.5 100.0 L92.5 141.0" stroke-linecap="round" stroke-linejoin="round" style="fill:none;stroke:var(--ns-widget-grid);stroke-width:1"/><path d="M163.5 100.0 L92.5 59.0" stroke-linecap="round" stroke-linejoin="round" style="fill:none;stroke:var(--ns-widget-grid);stroke-width:1"/><path d="M163.5 34.4 L206.1 75.4 L213.2 128.7 L163.5 141.0 L99.6 136.9 L120.9 75.4Z" stroke-linecap="round" stroke-linejoin="round" style="fill:var(--ns-chart-series-3);fill-opacity:0.22;stroke:var(--ns-chart-series-3);stroke-width:2"/><path d="M163.5 59.0 L220.3 67.2 L191.9 116.4 L163.5 157.4 L128.0 120.5 L135.1 83.6Z" stroke-linecap="round" stroke-linejoin="round" style="fill:var(--ns-chart-series-1);fill-opacity:0.22;stroke:var(--ns-chart-series-1);stroke-width:2"/><text x="163.5" y="6" text-anchor="middle" dominant-baseline="middle" font-size="11" style="fill:var(--ns-chart-label-text)">Speed</text><text x="244.9" y="53" text-anchor="middle" dominant-baseline="middle" font-size="11" style="fill:var(--ns-chart-label-text)">Cost</text><text x="244.9" y="147" text-anchor="middle" dominant-baseline="middle" font-size="11" style="fill:var(--ns-chart-label-text)">Reach</text><text x="163.5" y="194" text-anchor="middle" dominant-baseline="middle" font-size="11" style="fill:var(--ns-chart-label-text)">Rate</text><text x="82.1" y="147" text-anchor="middle" dominant-baseline="middle" font-size="11" style="fill:var(--ns-chart-label-text)">Score</text><text x="82.1" y="53" text-anchor="middle" dominant-baseline="middle" font-size="11" style="fill:var(--ns-chart-label-text)">Trust</text></svg></div>
```

Tokens: `--ns-chart-series-1` (Series 2 (alias of viz/1)), `--ns-chart-series-3` (Series 1 (alias of viz/2)), `--ns-widget-grid` (Rings and axes), `--ns-widget-bg` (Card surface), `--ns-border-subtle` (Card stroke and summary divider), `--ns-chart-label-text` (Axis labels and description), `--ns-status-success` (Trend), `--ns-radius-xl` (Card radius)

Keyboard: -: Not interactive

Accessibility:
- The SVG is role="img" with a label naming the measures. Provide a table of the values per series nearby.
- Series are told apart by label and stroke, never by color alone.
- Trend text carries its sign, so the color is a second signal.

#### Radial bar chart (New)

A radial bar chart shows progress toward a target as concentric rings, one ring per goal. Five sizes cover a KPI tile, a narrow column, the default card, a card with a summary and a wide multi-KPI panel. The plot renders from one description as SVG, and the same description draws the Figma set.

Page: https://mikelrosenthal.com/northstar/#/components/radial-bar-chart · Figma node 4462:148

Classes: `ns-chart`, `ns-chart--small`, `ns-chart--vertical`, `ns-chart__desc`, `ns-chart__desc--sm`, `ns-chart__dot`, `ns-chart__head`, `ns-chart__icon`, `ns-chart__kpi`, `ns-chart__kpis`, `ns-chart__plot`, `ns-chart__summary`, `ns-chart__title`, `ns-chart__title--lg`, `ns-chart__title--sm`, `ns-chart__trend`, `ns-chart__value`, `ns-chart__value--sm`

Variants: Size: Small, Vertical small, Medium, Large, XL; Title: Text; Value: Text; Show icon: Boolean

Use:
- Progress for three to four goals against one target.
- Compact status tiles with several measures.
- A KPI tile that needs more than one number.

Avoid:
- Parts of a whole. Use Donut chart.
- Exact comparison. Use Horizontal bar chart.
- More than five goals. Use a table.

- Do: Axis labels and gridlines on the Medium plot.
- Do not: The compact plot drops axes and labels.

```html
<div class="ns-chart" style="width:100%;max-width:375px"><div class="ns-chart__head"><div class="ns-chart__kpi"><span class="ns-chart__title">Progress</span><span class="ns-chart__value">54%<span class="ns-chart__trend">+5.0%</span></span><span class="ns-chart__desc">Average of four goals</span></div><span class="ns-chart__icon" aria-hidden="true"><svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><rect x="0" y="6" width="3" height="8" rx="1"/><rect x="5.5" y="1" width="3" height="13" rx="1"/><rect x="11" y="4" width="3" height="10" rx="1"/></svg></span></div><svg class="ns-chart__plot" width="327" height="200" viewBox="0 0 327 200" role="img" aria-label="Radial bar chart: four goals, each a ring filled toward a target" data-chart="radialbar" data-size="Medium" data-h="200" data-w="327"><path d="M168.9 7.5A92.6 92.6 0 1 1 71 105.4" stroke-linecap="round" style="fill:none;stroke:var(--ns-chart-track);stroke-width:10.8"/><path d="M168.9 7.5A92.6 92.6 0 1 1 113.5 178" stroke-linecap="round" style="fill:none;stroke:var(--ns-chart-series-1);stroke-width:10.8"/><path d="M168.9 23.3A76.9 76.9 0 1 1 86.8 105.4" stroke-linecap="round" style="fill:none;stroke:var(--ns-chart-track);stroke-width:10.8"/><path d="M168.9 23.3A76.9 76.9 0 0 1 185.5 173.7" stroke-linecap="round" style="fill:none;stroke:var(--ns-chart-series-2);stroke-width:10.8"/><path d="M168.9 39A61.3 61.3 0 1 1 102.5 105.4" stroke-linecap="round" style="fill:none;stroke:var(--ns-chart-track);stroke-width:10.8"/><path d="M168.9 39A61.3 61.3 0 0 1 218.3 127.3" stroke-linecap="round" style="fill:none;stroke:var(--ns-chart-series-3);stroke-width:10.8"/><path d="M168.9 54.7A45.6 45.6 0 1 1 118.2 105.4" stroke-linecap="round" style="fill:none;stroke:var(--ns-chart-track);stroke-width:10.8"/><path d="M168.9 54.7A45.6 45.6 0 0 1 207.4 87.6" stroke-linecap="round" style="fill:none;stroke:var(--ns-chart-series-4);stroke-width:10.8"/></svg></div>
```

Tokens: `--ns-chart-series-1` (Ring 1 (alias of viz/1)), `--ns-chart-series-2` (Ring 2 (alias of viz/4)), `--ns-chart-series-3` (Ring 3 (alias of viz/2)), `--ns-chart-series-4` (Ring 4 (alias of viz/7)), `--ns-chart-track` (Ring tracks), `--ns-widget-bg` (Card surface), `--ns-border-subtle` (Card stroke and summary divider), `--ns-chart-label-text` (Axis labels and description), `--ns-status-success` (Trend), `--ns-radius-xl` (Card radius)

Keyboard: -: Not interactive

Accessibility:
- The SVG is role="img" with a label naming each goal and its value.
- Rings are told apart by order and label, never by color alone.
- Trend text carries its sign, so the color is a second signal.

#### Radial convergence chart (New)

A radial convergence chart joins nodes around a ring with straight links, to show who is connected to whom. Five sizes cover a KPI tile, a narrow column, the default card, a card with a summary and a wide multi-KPI panel. The plot renders from one description as SVG, and the same description draws the Figma set.

Page: https://mikelrosenthal.com/northstar/#/components/radial-convergence-chart · Figma node 4462:38977

Classes: `ns-chart`, `ns-chart--small`, `ns-chart--vertical`, `ns-chart__desc`, `ns-chart__desc--sm`, `ns-chart__dot`, `ns-chart__head`, `ns-chart__icon`, `ns-chart__kpi`, `ns-chart__kpis`, `ns-chart__plot`, `ns-chart__summary`, `ns-chart__title`, `ns-chart__title--lg`, `ns-chart__title--sm`, `ns-chart__trend`, `ns-chart__value`, `ns-chart__value--sm`

Variants: Size: Small, Vertical small, Medium, Large, XL; Title: Text; Value: Text; Show icon: Boolean

Use:
- Relationships inside one set of members.
- Teams that work together or services that call each other.
- A KPI tile that needs connectedness, not only a count.

Avoid:
- Directed, sized flows. Use Sankey chart.
- Hierarchies. Use Tree chart.
- More than about twenty nodes. Use a table.

- Do: Axis labels and gridlines on the Medium plot.
- Do not: The compact plot drops axes and labels.

```html
<div class="ns-chart" style="width:100%;max-width:375px"><div class="ns-chart__head"><div class="ns-chart__kpi"><span class="ns-chart__title">Links</span><span class="ns-chart__value">8<span class="ns-chart__trend">+2.0%</span></span><span class="ns-chart__desc">Twelve nodes joined across a ring</span></div><span class="ns-chart__icon" aria-hidden="true"><svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><rect x="0" y="6" width="3" height="8" rx="1"/><rect x="5.5" y="1" width="3" height="13" rx="1"/><rect x="11" y="4" width="3" height="10" rx="1"/></svg></span></div><svg class="ns-chart__plot" width="327" height="200" viewBox="0 0 327 200" role="img" aria-label="Radial convergence chart: twelve nodes on a ring joined by eight links" data-chart="convergence" data-size="Medium" data-h="200" data-w="327"><path d="M163.5 6.0 L210.5 181.4" stroke-linecap="round" stroke-linejoin="round" style="fill:none;stroke:var(--ns-chart-series-1);stroke-width:1.5"/><path d="M210.5 18.6 L116.5 181.4" stroke-linecap="round" stroke-linejoin="round" style="fill:none;stroke:var(--ns-chart-series-2);stroke-width:1.5"/><path d="M244.9 53.0 L69.5 100.0" stroke-linecap="round" stroke-linejoin="round" style="fill:none;stroke:var(--ns-chart-series-1);stroke-width:1.5"/><path d="M257.5 100.0 L82.1 53.0" stroke-linecap="round" stroke-linejoin="round" style="fill:none;stroke:var(--ns-chart-series-2);stroke-width:1.5"/><path d="M244.9 147.0 L82.1 147.0" stroke-linecap="round" stroke-linejoin="round" style="fill:none;stroke:var(--ns-chart-series-1);stroke-width:1.5"/><path d="M163.5 194.0 L116.5 18.6" stroke-linecap="round" stroke-linejoin="round" style="fill:none;stroke:var(--ns-chart-series-2);stroke-width:1.5"/><path d="M163.5 6.0 L244.9 53.0" stroke-linecap="round" stroke-linejoin="round" style="fill:none;stroke:var(--ns-chart-series-1);stroke-width:1.5"/><path d="M244.9 53.0 L163.5 194.0" stroke-linecap="round" stroke-linejoin="round" style="fill:none;stroke:var(--ns-chart-series-2);stroke-width:1.5"/><circle cx="163.5" cy="6" r="4" style="fill:var(--ns-text-primary)"/><circle cx="210.5" cy="18.6" r="4" style="fill:var(--ns-text-primary)"/><circle cx="244.9" cy="53" r="4" style="fill:var(--ns-text-primary)"/><circle cx="257.5" cy="100" r="4" style="fill:var(--ns-text-primary)"/><circle cx="244.9" cy="147" r="4" style="fill:var(--ns-text-primary)"/><circle cx="210.5" cy="181.4" r="4" style="fill:var(--ns-text-primary)"/><circle cx="163.5" cy="194" r="4" style="fill:var(--ns-text-primary)"/><circle cx="116.5" cy="181.4" r="4" style="fill:var(--ns-text-primary)"/><circle cx="82.1" cy="147" r="4" style="fill:var(--ns-text-primary)"/><circle cx="69.5" cy="100" r="4" style="fill:var(--ns-text-primary)"/><circle cx="82.1" cy="53" r="4" style="fill:var(--ns-text-primary)"/><circle cx="116.5" cy="18.6" r="4" style="fill:var(--ns-text-primary)"/></svg></div>
```

Tokens: `--ns-chart-series-1` (Links, odd (alias of viz/1)), `--ns-chart-series-2` (Links, even (alias of viz/4)), `--ns-text-primary` (Nodes), `--ns-widget-bg` (Card surface), `--ns-border-subtle` (Card stroke and summary divider), `--ns-chart-label-text` (Axis labels and description), `--ns-status-success` (Trend), `--ns-radius-xl` (Card radius)

Keyboard: -: Not interactive

Accessibility:
- The SVG is role="img" with a label that states how many links join how many nodes. Provide a table of the pairs nearby.
- Links are told apart by endpoint, never by color alone.
- Trend text carries its sign, so the color is a second signal.

#### Radial histogram chart (New)

A radial histogram shows counts around a circle, one bar per hour, day or direction, where the end of the cycle meets the start. Five sizes cover a KPI tile, a narrow column, the default card, a card with a summary and a wide multi-KPI panel. The plot renders from one description as SVG, and the same description draws the Figma set.

Page: https://mikelrosenthal.com/northstar/#/components/radial-histogram-chart · Figma node 4462:38356

Classes: `ns-chart`, `ns-chart--small`, `ns-chart--vertical`, `ns-chart__desc`, `ns-chart__desc--sm`, `ns-chart__dot`, `ns-chart__head`, `ns-chart__icon`, `ns-chart__kpi`, `ns-chart__kpis`, `ns-chart__plot`, `ns-chart__summary`, `ns-chart__title`, `ns-chart__title--lg`, `ns-chart__title--sm`, `ns-chart__trend`, `ns-chart__value`, `ns-chart__value--sm`

Variants: Size: Small, Vertical small, Medium, Large, XL; Title: Text; Value: Text; Show icon: Boolean

Use:
- Cyclic measures: hours of the day, days of the week, compass direction.
- Finding the busy and quiet part of a cycle.
- A KPI tile that needs the daily rhythm.

Avoid:
- A measure with no cycle. Use Bar chart.
- Exact comparison. Use Horizontal bar chart.
- Time series that do not repeat. Use Line chart.

- Do: Axis labels and gridlines on the Medium plot.
- Do not: The compact plot drops axes and labels.

```html
<div class="ns-chart" style="width:100%;max-width:375px"><div class="ns-chart__head"><div class="ns-chart__kpi"><span class="ns-chart__title">Requests</span><span class="ns-chart__value">1,860<span class="ns-chart__trend">+2.2%</span></span><span class="ns-chart__desc">By hour, around the clock</span></div><span class="ns-chart__icon" aria-hidden="true"><svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><rect x="0" y="6" width="3" height="8" rx="1"/><rect x="5.5" y="1" width="3" height="13" rx="1"/><rect x="11" y="4" width="3" height="10" rx="1"/></svg></span></div><svg class="ns-chart__plot" width="327" height="200" viewBox="0 0 327 200" role="img" aria-label="Radial histogram: 24 bars around a circle, one per hour of the day" data-chart="radialhist" data-size="Medium" data-h="200" data-w="327"><path d="M164.5 42.1A57.90629585329672 57.90629585329672 0 0 1 177.5 43.8L170.1 73.4A27.44 27.44 0 0 0 164 72.6Z" fill-rule="evenodd" style="fill:var(--ns-chart-series-2)"/><path d="M178.4 48.1A53.995889708969536 53.995889708969536 0 0 1 189.7 52.8L176.8 76A27.44 27.44 0 0 0 171.1 73.6Z" fill-rule="evenodd" style="fill:var(--ns-chart-series-1)"/><path d="M189.8 56.2A51.053672838281855 51.053672838281855 0 0 1 199 63.3L182.6 80.3A27.44 27.44 0 0 0 177.6 76.5Z" fill-rule="evenodd" style="fill:var(--ns-chart-series-1)"/><path d="M198.9 65.8A49.22718028075768 49.22718028075768 0 0 1 205.7 74.6L187 85.9A27.44 27.44 0 0 0 183.2 80.9Z" fill-rule="evenodd" style="fill:var(--ns-chart-series-1)"/><path d="M206 76.4A48.608000000000004 48.608000000000004 0 0 1 210.2 86.6L189.9 92.4A27.44 27.44 0 0 0 187.5 86.7Z" fill-rule="evenodd" style="fill:var(--ns-chart-series-1)"/><path d="M211.8 87.9A49.81670827357489 49.81670827357489 0 0 1 213.3 99.1L190.9 99.5A27.44 27.44 0 0 0 190.1 93.4Z" fill-rule="evenodd" style="fill:var(--ns-chart-series-1)"/><path d="M216.8 100.9A53.3245163069163 53.3245163069163 0 0 1 215.2 112.9L190.1 106.6A27.44 27.44 0 0 0 190.9 100.5Z" fill-rule="evenodd" style="fill:var(--ns-chart-series-2)"/><path d="M220 116.2A58.78805540938509 58.78805540938509 0 0 1 214.9 128.5L187.5 113.3A27.44 27.44 0 0 0 189.9 107.6Z" fill-rule="evenodd" style="fill:var(--ns-chart-series-1)"/><path d="M219.8 133.8A65.6725163069163 65.6725163069163 0 0 1 210.7 145.6L183.2 119.1A27.44 27.44 0 0 0 187 114.1Z" fill-rule="evenodd" style="fill:var(--ns-chart-series-1)"/><path d="M214.4 152.7A73.304 73.304 0 0 1 201.3 162.8L177.6 123.5A27.44 27.44 0 0 0 182.6 119.7Z" fill-rule="evenodd" style="fill:var(--ns-chart-series-1)"/><path d="M202.7 170.8A80.9354836930837 80.9354836930837 0 0 1 185.8 177.8L171.1 126.4A27.44 27.44 0 0 0 176.8 124Z" fill-rule="evenodd" style="fill:var(--ns-chart-series-1)"/><path d="M184.7 185.2A87.81994459061491 87.81994459061491 0 0 1 165 187.8L164 127.4A27.44 27.44 0 0 0 170.1 126.6Z" fill-rule="evenodd" style="fill:var(--ns-chart-series-1)"/><path d="M161.9 193.3A93.2834836930837 93.2834836930837 0 0 1 140.9 190.5L156.9 126.6A27.44 27.44 0 0 0 163 127.4Z" fill-rule="evenodd" style="fill:var(--ns-chart-series-2)"/><path d="M136.8 193A96.79129172642511 96.79129172642511 0 0 1 116.6 184.7L150.2 124A27.44 27.44 0 0 0 155.9 126.4Z" fill-rule="evenodd" style="fill:var(--ns-chart-series-1)"/><path d="M113 184A98 98 0 0 1 95.4 170.5L144.4 119.7A27.44 27.44 0 0 0 149.4 123.5Z" fill-rule="evenodd" style="fill:var(--ns-chart-series-1)"/><path d="M93.5 167.6A97.38081971924231 97.38081971924231 0 0 1 80 150.2L140 114.1A27.44 27.44 0 0 0 143.8 119.1Z" fill-rule="evenodd" style="fill:var(--ns-chart-series-1)"/><path d="M79.9 146.3A95.55432716171813 95.55432716171813 0 0 1 71.6 126.3L137.1 107.6A27.44 27.44 0 0 0 139.5 113.3Z" fill-rule="evenodd" style="fill:var(--ns-chart-series-1)"/><path d="M73.6 122.4A92.61211029103046 92.61211029103046 0 0 1 70.9 101.6L136.1 100.5A27.44 27.44 0 0 0 136.9 106.6Z" fill-rule="evenodd" style="fill:var(--ns-chart-series-1)"/><path d="M74.8 98.5A88.70170414670328 88.70170414670328 0 0 1 77.4 78.5L136.9 93.4A27.44 27.44 0 0 0 136.1 99.5Z" fill-rule="evenodd" style="fill:var(--ns-chart-series-2)"/><path d="M82.7 76.8A84.0191928212472 84.0191928212472 0 0 1 90 59.3L139.5 86.7A27.44 27.44 0 0 0 137.1 92.4Z" fill-rule="evenodd" style="fill:var(--ns-chart-series-1)"/><path d="M96 59.4A78.79937698498514 78.79937698498514 0 0 1 106.8 45.3L143.8 80.9A27.44 27.44 0 0 0 140 85.9Z" fill-rule="evenodd" style="fill:var(--ns-chart-series-1)"/><path d="M112.6 47.3A73.304 73.304 0 0 1 125.7 37.2L149.4 76.5A27.44 27.44 0 0 0 144.4 80.3Z" fill-rule="evenodd" style="fill:var(--ns-chart-series-1)"/><path d="M130.6 40.7A67.80862301501486 67.80862301501486 0 0 1 144.8 34.8L155.9 73.6A27.44 27.44 0 0 0 150.2 76Z" fill-rule="evenodd" style="fill:var(--ns-chart-series-1)"/><path d="M148.4 39.3A62.58880717875279 62.58880717875279 0 0 1 162.4 37.4L163 72.6A27.44 27.44 0 0 0 156.9 73.4Z" fill-rule="evenodd" style="fill:var(--ns-chart-series-1)"/></svg></div>
```

Tokens: `--ns-chart-series-1` (Bars (alias of viz/1)), `--ns-chart-series-2` (Reference bars (alias of viz/4)), `--ns-widget-bg` (Card surface), `--ns-border-subtle` (Card stroke and summary divider), `--ns-chart-label-text` (Axis labels and description), `--ns-status-success` (Trend), `--ns-radius-xl` (Card radius)

Keyboard: -: Not interactive

Accessibility:
- The SVG is role="img" with a label that names the cycle. Provide a table of the values per slot nearby.
- The start of the cycle is stated in text.
- Trend text carries its sign, so the color is a second signal.

#### Sankey chart (New)

A sankey diagram shows how volume flows from sources to outcomes; band width carries the amount. Five sizes cover a KPI tile, a narrow column, the default card, a card with a summary and a wide multi-KPI panel. The plot renders from one description as SVG, and the same description draws the Figma set.

Page: https://mikelrosenthal.com/northstar/#/components/sankey-chart · Figma node 4721:2133

Classes: `ns-chart`, `ns-chart--small`, `ns-chart--vertical`, `ns-chart__desc`, `ns-chart__desc--sm`, `ns-chart__dot`, `ns-chart__head`, `ns-chart__icon`, `ns-chart__kpi`, `ns-chart__kpis`, `ns-chart__plot`, `ns-chart__summary`, `ns-chart__title`, `ns-chart__title--lg`, `ns-chart__title--sm`, `ns-chart__trend`, `ns-chart__value`, `ns-chart__value--sm`

Variants: Size: Small, Vertical small, Medium, Large, XL; Title: Text; Value: Text; Show icon: Boolean

Use:
- Where volume comes from and where it goes.
- Conversion between two stages.

Avoid:
- A single sequence of steps. Use Funnel chart.
- Exact values. Use Data table.

- Do: Axis labels and gridlines on the Medium plot.
- Do not: The compact plot drops axes and labels.

```html
<div class="ns-chart" style="width:100%;max-width:375px"><div class="ns-chart__head"><div class="ns-chart__kpi"><span class="ns-chart__title">New accounts</span><span class="ns-chart__value">6,200<span class="ns-chart__trend">+2.8%</span></span><span class="ns-chart__desc">Where accounts came from and which plan they chose</span></div><span class="ns-chart__icon" aria-hidden="true"><svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><rect x="0" y="6" width="3" height="8" rx="1"/><rect x="5.5" y="1" width="3" height="13" rx="1"/><rect x="11" y="4" width="3" height="10" rx="1"/></svg></span></div><svg class="ns-chart__plot" width="327" height="200" viewBox="0 0 327 200" role="img" aria-label="Sankey diagram: three sources flow into paid and free plans, band width shows volume" data-chart="sankey" data-size="Medium" data-h="200" data-w="327"><path d="M10 0.0C163.5 0.0 163.5 0.0 317 0.0L317 57.6C163.5 57.6 163.5 55.2 10 55.2Z" stroke-linecap="round" stroke-linejoin="round" style="fill:var(--ns-chart-series-1);fill-opacity:0.35"/><path d="M10 55.2C163.5 55.2 163.5 123.2 317 123.2L317 152.0C163.5 152.0 163.5 82.8 10 82.8Z" stroke-linecap="round" stroke-linejoin="round" style="fill:var(--ns-chart-series-1);fill-opacity:0.35"/><path d="M10 90.8C163.5 90.8 163.5 57.6 317 57.6L317 96.0C163.5 96.0 163.5 127.6 10 127.6Z" stroke-linecap="round" stroke-linejoin="round" style="fill:var(--ns-chart-series-2);fill-opacity:0.35"/><path d="M10 127.6C163.5 127.6 163.5 152.0 317 152.0L317 180.8C163.5 180.8 163.5 155.2 10 155.2Z" stroke-linecap="round" stroke-linejoin="round" style="fill:var(--ns-chart-series-2);fill-opacity:0.35"/><path d="M10 163.2C163.5 163.2 163.5 96.0 317 96.0L317 115.2C163.5 115.2 163.5 181.6 10 181.6Z" stroke-linecap="round" stroke-linejoin="round" style="fill:var(--ns-chart-series-3);fill-opacity:0.35"/><path d="M10 181.6C163.5 181.6 163.5 180.8 317 180.8L317 200.0C163.5 200.0 163.5 200.0 10 200.0Z" stroke-linecap="round" stroke-linejoin="round" style="fill:var(--ns-chart-series-3);fill-opacity:0.35"/><rect x="0" y="0" width="10" height="82.8" rx="2" style="fill:var(--ns-chart-series-1)"/><rect x="0" y="90.8" width="10" height="64.4" rx="2" style="fill:var(--ns-chart-series-2)"/><rect x="0" y="163.2" width="10" height="36.8" rx="2" style="fill:var(--ns-chart-series-3)"/><rect x="317" y="0" width="10" height="115.2" rx="2" style="fill:var(--ns-chart-target)"/><rect x="317" y="123.2" width="10" height="76.8" rx="2" style="fill:var(--ns-chart-target)"/><text x="16" y="41.4" text-anchor="start" dominant-baseline="middle" font-size="11" style="fill:var(--ns-text-primary)">Search</text><text x="16" y="123" text-anchor="start" dominant-baseline="middle" font-size="11" style="fill:var(--ns-text-primary)">Referral</text><text x="16" y="181.6" text-anchor="start" dominant-baseline="middle" font-size="11" style="fill:var(--ns-text-primary)">Ads</text><text x="311" y="57.6" text-anchor="end" dominant-baseline="middle" font-size="11" style="fill:var(--ns-text-primary)">Paid</text><text x="311" y="161.6" text-anchor="end" dominant-baseline="middle" font-size="11" style="fill:var(--ns-text-primary)">Free</text></svg></div>
```

Tokens: `--ns-chart-series-1` (First source and its flows), `--ns-chart-series-2` (Second source), `--ns-chart-series-3` (Third source), `--ns-chart-target` (Outcome nodes), `--ns-widget-bg` (Card surface), `--ns-border-subtle` (Card stroke and summary divider), `--ns-chart-label-text` (Axis labels and description), `--ns-status-success` (Trend), `--ns-radius-xl` (Card radius)

Keyboard: -: Not interactive

Accessibility:
- The SVG is role="img" with a label naming the sources and outcomes. Provide a table of the flows nearby.
- Trend text carries its sign, so the color is a second signal.

#### Scatter chart (New)

A scatter chart plots samples on two measures and shows the relationship between them, with an optional trend line. Five sizes cover a KPI tile, a narrow column, the default card, a card with a summary and a wide multi-KPI panel. The plot renders from one description as SVG, and the same description draws the Figma set.

Page: https://mikelrosenthal.com/northstar/#/components/scatter-chart · Figma node 4460:38167

Classes: `ns-chart`, `ns-chart--small`, `ns-chart--vertical`, `ns-chart__desc`, `ns-chart__desc--sm`, `ns-chart__dot`, `ns-chart__head`, `ns-chart__icon`, `ns-chart__kpi`, `ns-chart__kpis`, `ns-chart__plot`, `ns-chart__summary`, `ns-chart__title`, `ns-chart__title--lg`, `ns-chart__title--sm`, `ns-chart__trend`, `ns-chart__value`, `ns-chart__value--sm`

Variants: Size: Small, Vertical small, Medium, Large, XL; Title: Text; Value: Text; Show icon: Boolean

Use:
- How two measures relate across many samples.
- Finding outliers against a trend.
- A KPI tile that needs the spread, not only the average.

Avoid:
- A third measure. Use Bubble chart.
- Fewer than ten samples. Use Bar chart.
- Time series. Use Line chart.

- Do: Axis labels and gridlines on the Medium plot.
- Do not: The compact plot drops axes and labels.

```html
<div class="ns-chart" style="width:100%;max-width:375px"><div class="ns-chart__head"><div class="ns-chart__kpi"><span class="ns-chart__title">Samples</span><span class="ns-chart__value">240<span class="ns-chart__trend">+6.2%</span></span><span class="ns-chart__desc">18 of 240 samples shown, two measures each</span></div><span class="ns-chart__icon" aria-hidden="true"><svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><rect x="0" y="6" width="3" height="8" rx="1"/><rect x="5.5" y="1" width="3" height="13" rx="1"/><rect x="11" y="4" width="3" height="10" rx="1"/></svg></span></div><svg class="ns-chart__plot" width="327" height="200" viewBox="0 0 327 200" role="img" aria-label="Scatter plot: 18 of 240 samples on two measures with a rising trend line" data-chart="scatter" data-size="Medium" data-h="200" data-w="327"><rect x="30" y="-0.5" width="297" height="1" style="fill:var(--ns-widget-grid)"/><rect x="30" y="58.8" width="297" height="1" style="fill:var(--ns-widget-grid)"/><rect x="30" y="118.2" width="297" height="1" style="fill:var(--ns-widget-grid)"/><rect x="30" y="177.5" width="297" height="1" style="fill:var(--ns-widget-grid)"/><text x="22" y="0" text-anchor="end" dominant-baseline="middle" font-size="11" style="fill:var(--ns-chart-label-text)">100</text><text x="22" y="59.3" text-anchor="end" dominant-baseline="middle" font-size="11" style="fill:var(--ns-chart-label-text)">75</text><text x="22" y="118.7" text-anchor="end" dominant-baseline="middle" font-size="11" style="fill:var(--ns-chart-label-text)">50</text><text x="22" y="178" text-anchor="end" dominant-baseline="middle" font-size="11" style="fill:var(--ns-chart-label-text)">25</text><text x="36" y="192" text-anchor="middle" dominant-baseline="middle" font-size="11" style="fill:var(--ns-chart-label-text)">0</text><text x="178.5" y="192" text-anchor="middle" dominant-baseline="middle" font-size="11" style="fill:var(--ns-chart-label-text)">5</text><text x="321" y="192" text-anchor="middle" dominant-baseline="middle" font-size="11" style="fill:var(--ns-chart-label-text)">10</text><path d="M34 142.4L323 35.6" stroke-linecap="round" stroke-linejoin="round" style="fill:none;stroke:var(--ns-chart-target);stroke-width:1.5"/><circle cx="34" cy="167.3" r="4" style="fill:var(--ns-chart-series-2);fill-opacity:0.85"/><circle cx="140.9" cy="126.7" r="4" style="fill:var(--ns-chart-series-1);fill-opacity:0.85"/><circle cx="247.9" cy="79.9" r="4" style="fill:var(--ns-chart-series-1);fill-opacity:0.85"/><circle cx="65.8" cy="139.8" r="4" style="fill:var(--ns-chart-series-2);fill-opacity:0.85"/><circle cx="172.7" cy="93" r="4" style="fill:var(--ns-chart-series-1);fill-opacity:0.85"/><circle cx="279.6" cy="46.1" r="4" style="fill:var(--ns-chart-series-1);fill-opacity:0.85"/><circle cx="97.6" cy="106.1" r="4" style="fill:var(--ns-chart-series-2);fill-opacity:0.85"/><circle cx="204.5" cy="59.2" r="4" style="fill:var(--ns-chart-series-1);fill-opacity:0.85"/><circle cx="311.4" cy="12.4" r="4" style="fill:var(--ns-chart-series-1);fill-opacity:0.85"/><circle cx="129.4" cy="134.6" r="4" style="fill:var(--ns-chart-series-2);fill-opacity:0.85"/><circle cx="236.3" cy="87.8" r="4" style="fill:var(--ns-chart-series-1);fill-opacity:0.85"/><circle cx="54.2" cy="147.8" r="4" style="fill:var(--ns-chart-series-1);fill-opacity:0.85"/><circle cx="161.2" cy="100.9" r="4" style="fill:var(--ns-chart-series-2);fill-opacity:0.85"/><circle cx="268.1" cy="54.1" r="4" style="fill:var(--ns-chart-series-1);fill-opacity:0.85"/><circle cx="86" cy="114" r="4" style="fill:var(--ns-chart-series-1);fill-opacity:0.85"/><circle cx="193" cy="67.2" r="4" style="fill:var(--ns-chart-series-2);fill-opacity:0.85"/><circle cx="299.9" cy="20.3" r="4" style="fill:var(--ns-chart-series-1);fill-opacity:0.85"/><circle cx="117.8" cy="142.6" r="4" style="fill:var(--ns-chart-series-1);fill-opacity:0.85"/></svg></div>
```

Tokens: `--ns-chart-series-1` (Points (alias of viz/1)), `--ns-chart-series-2` (Second group (alias of viz/4)), `--ns-chart-target` (Trend line (alias of text/primary)), `--ns-widget-grid` (Gridlines), `--ns-widget-bg` (Card surface), `--ns-border-subtle` (Card stroke and summary divider), `--ns-chart-label-text` (Axis labels and description), `--ns-status-success` (Trend), `--ns-radius-xl` (Card radius)

Keyboard: -: Not interactive

Accessibility:
- The SVG is role="img" with a label that states the relationship. Provide a table of the values nearby.
- Groups are told apart by label or shape in a legend, never by color alone.
- Trend text carries its sign, so the color is a second signal.

#### Stepped line chart (New)

A stepped line chart shows a value that holds steady and then changes at set points in time. Five sizes cover a KPI tile, a narrow column, the default card, a card with a summary and a wide multi-KPI panel. The plot renders from one description as SVG, and the same description draws the Figma set.

Page: https://mikelrosenthal.com/northstar/#/components/stepped-line-chart · Figma node 4460:37871

Classes: `ns-chart`, `ns-chart--small`, `ns-chart--vertical`, `ns-chart__desc`, `ns-chart__desc--sm`, `ns-chart__dot`, `ns-chart__head`, `ns-chart__icon`, `ns-chart__kpi`, `ns-chart__kpis`, `ns-chart__plot`, `ns-chart__summary`, `ns-chart__title`, `ns-chart__title--lg`, `ns-chart__title--sm`, `ns-chart__trend`, `ns-chart__value`, `ns-chart__value--sm`

Variants: Size: Small, Vertical small, Medium, Large, XL; Title: Text; Value: Text; Show icon: Boolean

Use:
- Limits, prices and plan tiers that change on a date.
- Quotas and rates that hold between changes.
- A KPI tile that needs the history of a setting.

Avoid:
- Continuous measures. Use Line chart.
- Totals by category. Use Bar chart.
- A single current value. Use a KPI tile.

- Do: Axis labels and gridlines on the Medium plot.
- Do not: The compact plot drops axes and labels.

```html
<div class="ns-chart" style="width:100%;max-width:375px"><div class="ns-chart__head"><div class="ns-chart__kpi"><span class="ns-chart__title">Plan limit</span><span class="ns-chart__value">2,400<span class="ns-chart__trend">+2.0%</span></span><span class="ns-chart__desc">Changes only on a date</span></div><span class="ns-chart__icon" aria-hidden="true"><svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><rect x="0" y="6" width="3" height="8" rx="1"/><rect x="5.5" y="1" width="3" height="13" rx="1"/><rect x="11" y="4" width="3" height="10" rx="1"/></svg></span></div><svg class="ns-chart__plot" width="327" height="200" viewBox="0 0 327 200" role="img" aria-label="Stepped line chart: two series that change only at set points in time" data-chart="stepped" data-size="Medium" data-h="200" data-w="327"><rect x="30" y="-0.5" width="297" height="1" style="fill:var(--ns-widget-grid)"/><rect x="30" y="58.8" width="297" height="1" style="fill:var(--ns-widget-grid)"/><rect x="30" y="118.2" width="297" height="1" style="fill:var(--ns-widget-grid)"/><rect x="30" y="177.5" width="297" height="1" style="fill:var(--ns-widget-grid)"/><text x="22" y="0" text-anchor="end" dominant-baseline="middle" font-size="11" style="fill:var(--ns-chart-label-text)">3k</text><text x="22" y="59.3" text-anchor="end" dominant-baseline="middle" font-size="11" style="fill:var(--ns-chart-label-text)">2k</text><text x="22" y="118.7" text-anchor="end" dominant-baseline="middle" font-size="11" style="fill:var(--ns-chart-label-text)">1k</text><text x="22" y="178" text-anchor="end" dominant-baseline="middle" font-size="11" style="fill:var(--ns-chart-label-text)">0</text><text x="42" y="192" text-anchor="middle" dominant-baseline="middle" font-size="11" style="fill:var(--ns-chart-label-text)">Jan</text><text x="133" y="192" text-anchor="middle" dominant-baseline="middle" font-size="11" style="fill:var(--ns-chart-label-text)">Apr</text><text x="224" y="192" text-anchor="middle" dominant-baseline="middle" font-size="11" style="fill:var(--ns-chart-label-text)">Jul</text><text x="315" y="192" text-anchor="middle" dominant-baseline="middle" font-size="11" style="fill:var(--ns-chart-label-text)">Oct</text><path d="M30 140.0L72.4 140.0L72.4 114.5L114.9 114.5L114.9 123.0L157.3 123.0L157.3 89.0L199.7 89.0L199.7 106.0L242.1 106.0L242.1 80.5L284.6 80.5L284.6 89.0L327.0 89.0L327.0 63.5" stroke-linecap="round" stroke-linejoin="round" style="fill:none;stroke:var(--ns-chart-series-3);stroke-width:2"/><path d="M30 123.0L72.4 123.0L72.4 123.0L114.9 123.0L114.9 89.0L157.3 89.0L157.3 97.5L199.7 97.5L199.7 55.0L242.1 55.0L242.1 72.0L284.6 72.0L284.6 60.1L327.0 60.1L327.0 38.0" stroke-linecap="round" stroke-linejoin="round" style="fill:none;stroke:var(--ns-chart-series-1);stroke-width:2"/></svg></div>
```

Tokens: `--ns-chart-series-1` (Series 1 (alias of viz/1)), `--ns-chart-series-3` (Series 2 (alias of viz/2)), `--ns-widget-grid` (Gridlines), `--ns-widget-bg` (Card surface), `--ns-border-subtle` (Card stroke and summary divider), `--ns-chart-label-text` (Axis labels and description), `--ns-status-success` (Trend), `--ns-radius-xl` (Card radius)

Keyboard: -: Not interactive

Accessibility:
- The SVG is role="img" with a label that states the values and the dates they change.
- Series are told apart by label and position, never by color alone.
- Trend text carries its sign, so the color is a second signal.

#### Sunburst chart (New)

A sunburst chart shows a hierarchy as nested rings, with the angle of each arc carrying its share. Five sizes cover a KPI tile, a narrow column, the default card, a card with a summary and a wide multi-KPI panel. The plot renders from one description as SVG, and the same description draws the Figma set.

Page: https://mikelrosenthal.com/northstar/#/components/sunburst-chart · Figma node 4463:163

Classes: `ns-chart`, `ns-chart--small`, `ns-chart--vertical`, `ns-chart__desc`, `ns-chart__desc--sm`, `ns-chart__dot`, `ns-chart__head`, `ns-chart__icon`, `ns-chart__kpi`, `ns-chart__kpis`, `ns-chart__plot`, `ns-chart__summary`, `ns-chart__title`, `ns-chart__title--lg`, `ns-chart__title--sm`, `ns-chart__trend`, `ns-chart__value`, `ns-chart__value--sm`

Variants: Size: Small, Vertical small, Medium, Large, XL; Title: Text; Value: Text; Show icon: Boolean

Use:
- Part-to-whole at two levels at once.
- Categories and their items, with the angle carrying the share.
- A KPI tile that needs the make-up of a total.

Avoid:
- Deeper hierarchies. Use Tree chart.
- One level. Use Donut chart.
- Exact size comparison. Use Bar chart.

- Do: Axis labels and gridlines on the Medium plot.
- Do not: The compact plot drops axes and labels.

```html
<div class="ns-chart" style="width:100%;max-width:375px"><div class="ns-chart__head"><div class="ns-chart__kpi"><span class="ns-chart__title">Categories</span><span class="ns-chart__value">11<span class="ns-chart__trend">+2.0%</span></span><span class="ns-chart__desc">Two levels, one ring each</span></div><span class="ns-chart__icon" aria-hidden="true"><svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><rect x="0" y="6" width="3" height="8" rx="1"/><rect x="5.5" y="1" width="3" height="13" rx="1"/><rect x="11" y="4" width="3" height="10" rx="1"/></svg></span></div><svg class="ns-chart__plot" width="327" height="200" viewBox="0 0 327 200" role="img" aria-label="Sunburst chart: three groups in the inner ring, eight items in the outer ring" data-chart="sunburst" data-size="Medium" data-h="200" data-w="327"><path d="M164.3 46.1A53.900000000000006 53.900000000000006 0 0 1 191.1 146.3L173.5 116.8A19.6 19.6 0 0 0 163.8 80.4Z" fill-rule="evenodd" style="fill:var(--ns-chart-series-1)"/><path d="M189.8 147.1A53.900000000000006 53.900000000000006 0 0 1 110.6 110.1L144.2 103.7A19.6 19.6 0 0 0 173.1 117.1Z" fill-rule="evenodd" style="fill:var(--ns-chart-series-2)"/><path d="M110.3 108.6A53.900000000000006 53.900000000000006 0 0 1 162.7 46.1L163.2 80.4A19.6 19.6 0 0 0 144.2 103.1Z" fill-rule="evenodd" style="fill:var(--ns-chart-series-3)"/><path d="M164.9 2A98 98 0 0 1 255.1 65.2L216.6 79.8A56.839999999999996 56.839999999999996 0 0 0 164.3 43.2Z" fill-rule="evenodd" style="fill:var(--ns-chart-series-1);fill-opacity:0.6"/><path d="M256 67.8A98 98 0 0 1 256 132.2L217.2 118.7A56.839999999999996 56.839999999999996 0 0 0 217.2 81.3Z" fill-rule="evenodd" style="fill:var(--ns-chart-series-1);fill-opacity:0.6"/><path d="M255.1 134.8A98 98 0 0 1 213.7 184.2L192.6 148.8A56.839999999999996 56.839999999999996 0 0 0 216.6 120.2Z" fill-rule="evenodd" style="fill:var(--ns-chart-series-1);fill-opacity:0.6"/><path d="M211.3 185.5A98 98 0 0 1 108.4 181.1L131.6 147A56.839999999999996 56.839999999999996 0 0 0 191.2 149.6Z" fill-rule="evenodd" style="fill:var(--ns-chart-series-2);fill-opacity:0.6"/><path d="M106.2 179.5A98 98 0 0 1 67.2 118.4L107.7 110.7A56.839999999999996 56.839999999999996 0 0 0 130.3 146.1Z" fill-rule="evenodd" style="fill:var(--ns-chart-series-2);fill-opacity:0.6"/><path d="M66.8 115.7A98 98 0 0 1 78 52.2L113.9 72.3A56.839999999999996 56.839999999999996 0 0 0 107.4 109.1Z" fill-rule="evenodd" style="fill:var(--ns-chart-series-3);fill-opacity:0.6"/><path d="M79.3 49.8A98 98 0 0 1 113.3 15.8L134.4 51.2A56.839999999999996 56.839999999999996 0 0 0 114.7 70.9Z" fill-rule="evenodd" style="fill:var(--ns-chart-series-3);fill-opacity:0.6"/><path d="M115.7 14.5A98 98 0 0 1 162.1 2L162.7 43.2A56.839999999999996 56.839999999999996 0 0 0 135.8 50.4Z" fill-rule="evenodd" style="fill:var(--ns-chart-series-3);fill-opacity:0.6"/></svg></div>
```

Tokens: `--ns-chart-series-1` (Group 1 and its items (alias of viz/1)), `--ns-chart-series-2` (Group 2 and its items (alias of viz/4)), `--ns-chart-series-3` (Group 3 and its items (alias of viz/2)), `--ns-widget-bg` (Card surface), `--ns-border-subtle` (Card stroke and summary divider), `--ns-chart-label-text` (Axis labels and description), `--ns-status-success` (Trend), `--ns-radius-xl` (Card radius)

Keyboard: -: Not interactive

Accessibility:
- The SVG is role="img" with a label naming the groups and their items. Provide a nested list of the values nearby.
- Groups are told apart by position and label, never by color alone.
- Trend text carries its sign, so the color is a second signal.

#### Tree chart (New)

A tree chart shows a hierarchy as nodes joined by elbow lines, with the root on the left. Five sizes cover a KPI tile, a narrow column, the default card, a card with a summary and a wide multi-KPI panel. The plot renders from one description as SVG, and the same description draws the Figma set.

Page: https://mikelrosenthal.com/northstar/#/components/tree-chart · Figma node 4463:38870

Classes: `ns-chart`, `ns-chart--small`, `ns-chart--vertical`, `ns-chart__desc`, `ns-chart__desc--sm`, `ns-chart__dot`, `ns-chart__head`, `ns-chart__icon`, `ns-chart__kpi`, `ns-chart__kpis`, `ns-chart__plot`, `ns-chart__summary`, `ns-chart__title`, `ns-chart__title--lg`, `ns-chart__title--sm`, `ns-chart__trend`, `ns-chart__value`, `ns-chart__value--sm`

Variants: Size: Small, Vertical small, Medium, Large, XL; Title: Text; Value: Text; Show icon: Boolean

Use:
- Org structure, folders and decision paths.
- How one thing divides into parts and sub-parts.
- A KPI tile that needs the shape of a hierarchy.

Avoid:
- Part-to-whole. Use Sunburst chart or Treemap chart.
- Flows with sizes. Use Sankey chart.
- More than three levels. Use a table or a tree view.

- Do: Axis labels and gridlines on the Medium plot.
- Do not: The compact plot drops axes and labels.

```html
<div class="ns-chart" style="width:100%;max-width:375px"><div class="ns-chart__head"><div class="ns-chart__kpi"><span class="ns-chart__title">Teams</span><span class="ns-chart__value">7<span class="ns-chart__trend">+1.0%</span></span><span class="ns-chart__desc">One root, two levels</span></div><span class="ns-chart__icon" aria-hidden="true"><svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><rect x="0" y="6" width="3" height="8" rx="1"/><rect x="5.5" y="1" width="3" height="13" rx="1"/><rect x="11" y="4" width="3" height="10" rx="1"/></svg></span></div><svg class="ns-chart__plot" width="327" height="200" viewBox="0 0 327 200" role="img" aria-label="Tree chart: one root, two branches and four leaves" data-chart="tree" data-size="Medium" data-h="200" data-w="327"><path d="M12 89.0L87.75 89.0L87.75 49.8L163.5 49.8" stroke-linecap="round" stroke-linejoin="round" style="fill:none;stroke:var(--ns-widget-grid);stroke-width:1.5"/><path d="M12 89.0L87.75 89.0L87.75 128.2L163.5 128.2" stroke-linecap="round" stroke-linejoin="round" style="fill:none;stroke:var(--ns-widget-grid);stroke-width:1.5"/><path d="M163.5 49.8L239.25 49.8L239.25 24.9L315 24.9" stroke-linecap="round" stroke-linejoin="round" style="fill:none;stroke:var(--ns-widget-grid);stroke-width:1.5"/><path d="M163.5 49.8L239.25 49.8L239.25 67.6L315 67.6" stroke-linecap="round" stroke-linejoin="round" style="fill:none;stroke:var(--ns-widget-grid);stroke-width:1.5"/><path d="M163.5 128.2L239.25 128.2L239.25 110.4L315 110.4" stroke-linecap="round" stroke-linejoin="round" style="fill:none;stroke:var(--ns-widget-grid);stroke-width:1.5"/><path d="M163.5 128.2L239.25 128.2L239.25 153.1L315 153.1" stroke-linecap="round" stroke-linejoin="round" style="fill:none;stroke:var(--ns-widget-grid);stroke-width:1.5"/><circle cx="12" cy="89" r="6" style="fill:var(--ns-chart-series-1)"/><circle cx="163.5" cy="49.8" r="6" style="fill:var(--ns-chart-series-2)"/><circle cx="163.5" cy="128.2" r="6" style="fill:var(--ns-chart-series-2)"/><circle cx="315" cy="24.9" r="6" style="fill:var(--ns-chart-series-3)"/><circle cx="315" cy="67.6" r="6" style="fill:var(--ns-chart-series-3)"/><circle cx="315" cy="110.4" r="6" style="fill:var(--ns-chart-series-3)"/><circle cx="315" cy="153.1" r="6" style="fill:var(--ns-chart-series-3)"/><text x="12" y="192" text-anchor="middle" dominant-baseline="middle" font-size="11" style="fill:var(--ns-chart-label-text)">Root</text><text x="163.5" y="192" text-anchor="middle" dominant-baseline="middle" font-size="11" style="fill:var(--ns-chart-label-text)">Group</text><text x="315" y="192" text-anchor="middle" dominant-baseline="middle" font-size="11" style="fill:var(--ns-chart-label-text)">Item</text></svg></div>
```

Tokens: `--ns-chart-series-1` (Root (alias of viz/1)), `--ns-chart-series-2` (Branches (alias of viz/4)), `--ns-chart-series-3` (Leaves (alias of viz/2)), `--ns-widget-grid` (Edges), `--ns-widget-bg` (Card surface), `--ns-border-subtle` (Card stroke and summary divider), `--ns-chart-label-text` (Axis labels and description), `--ns-status-success` (Trend), `--ns-radius-xl` (Card radius)

Keyboard: -: Not interactive

Accessibility:
- The SVG is role="img" with a label that states the levels. Provide a nested list of the nodes nearby.
- Level is told apart by position and label, never by color alone.
- Trend text carries its sign, so the color is a second signal.

#### Treemap chart (New)

A treemap shows shares of a whole as nested rectangles sized by value. Five sizes cover a KPI tile, a narrow column, the default card, a card with a summary and a wide multi-KPI panel. The plot renders from one description as SVG, and the same description draws the Figma set.

Page: https://mikelrosenthal.com/northstar/#/components/treemap-chart · Figma node 4463:39101

Classes: `ns-chart`, `ns-chart--small`, `ns-chart--vertical`, `ns-chart__desc`, `ns-chart__desc--sm`, `ns-chart__dot`, `ns-chart__head`, `ns-chart__icon`, `ns-chart__kpi`, `ns-chart__kpis`, `ns-chart__plot`, `ns-chart__summary`, `ns-chart__title`, `ns-chart__title--lg`, `ns-chart__title--sm`, `ns-chart__trend`, `ns-chart__value`, `ns-chart__value--sm`

Variants: Size: Small, Vertical small, Medium, Large, XL; Title: Text; Value: Text; Show icon: Boolean

Use:
- Many parts of a whole where area is enough.
- Storage by type or spend by team.
- A KPI tile that needs the make-up of a total.

Avoid:
- Exact comparison. Use Horizontal bar chart.
- Time series. Use Line chart.
- Fewer than three parts. Use Donut chart.

- Do: Axis labels and gridlines on the Medium plot.
- Do not: The compact plot drops axes and labels.

```html
<div class="ns-chart" style="width:100%;max-width:375px"><div class="ns-chart__head"><div class="ns-chart__kpi"><span class="ns-chart__title">Storage</span><span class="ns-chart__value">640 GB<span class="ns-chart__trend">+3.0%</span></span><span class="ns-chart__desc">Tile size is its share</span></div><span class="ns-chart__icon" aria-hidden="true"><svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><rect x="0" y="6" width="3" height="8" rx="1"/><rect x="5.5" y="1" width="3" height="13" rx="1"/><rect x="11" y="4" width="3" height="10" rx="1"/></svg></span></div><svg class="ns-chart__plot" width="327" height="200" viewBox="0 0 327 200" role="img" aria-label="Treemap: five tiles, each sized by its share of the whole" data-chart="treemap" data-size="Medium" data-h="200" data-w="327"><rect x="0" y="0" width="178.4" height="118.5" rx="4" style="fill:var(--ns-chart-series-1);fill-opacity:0.9"/><rect x="0" y="121.5" width="178.4" height="78.5" rx="4" style="fill:var(--ns-chart-series-3);fill-opacity:0.9"/><rect x="181.4" y="0" width="145.6" height="77.6" rx="4" style="fill:var(--ns-chart-series-2);fill-opacity:0.9"/><rect x="181.4" y="80.6" width="145.6" height="67.9" rx="4" style="fill:var(--ns-chart-series-4);fill-opacity:0.9"/><rect x="181.4" y="151.5" width="145.6" height="48.5" rx="4" style="fill:var(--ns-chart-series-5);fill-opacity:0.9"/></svg></div>
```

Tokens: `--ns-chart-series-1` (Tile 1 (alias of viz/1)), `--ns-chart-series-2` (Tile 2 (alias of viz/4)), `--ns-chart-series-3` (Tile 3 (alias of viz/2)), `--ns-chart-series-4` (Tile 4 (alias of viz/7)), `--ns-chart-series-5` (Tile 5 (alias of widget/muted)), `--ns-widget-bg` (Card surface), `--ns-border-subtle` (Card stroke and summary divider), `--ns-chart-label-text` (Axis labels and description), `--ns-status-success` (Trend), `--ns-radius-xl` (Card radius)

Keyboard: -: Not interactive

Accessibility:
- The SVG is role="img" with a label naming the tiles and their shares. Provide a table nearby.
- Tiles are told apart by position and label, never by color alone.
- Trend text carries its sign, so the color is a second signal.

### Navigation

#### Breadcrumb (Stable)

Breadcrumbs show where the current page sits in the hierarchy and let people move up levels.

Page: https://mikelrosenthal.com/northstar/#/components/breadcrumb · Figma node 4208:1020

Classes: `ns-breadcrumb`

Use:
- Hierarchies three or more levels deep.

Avoid:
- Flat sites or single-level apps.

- Do: End with the current page, not a link.
- Do not: Show a breadcrumb with one item.

```html
<nav aria-label="Breadcrumb"><ol class="ns-breadcrumb"><li><a href="#/">Accounts</a></li><li><a href="#/">Acme Corp</a></li><li><a href="#/">Integrations</a></li><li aria-current="page">CRM sync</li></ol></nav>
```

Tokens: `--ns-text-link` (Links), `--ns-text-disabled` (Separator)

Keyboard: Tab: Moves between links

Accessibility:
- Wrap in <nav aria-label="Breadcrumb">; mark the last item aria-current="page".

#### Command palette (New)

A global launcher for finding records, pages and actions. Open it with Cmd K or Ctrl K. Results group by type, and the active row follows the keyboard.

Page: https://mikelrosenthal.com/northstar/#/components/command-palette · Figma node 4466:359

Classes: `ns-cmdk`, `ns-cmdk__foot`, `ns-cmdk__group`, `ns-cmdk__item`, `ns-cmdk__list`, `ns-cmdk__meta`, `ns-cmdk__query`

Variants: Result: Label, meta, icon, shortcut; Group: Up to four groups; State: Empty query, Results, Active row

Use:
- Finding records, pages and actions across the product.
- Showing recent items before the person types.
- Keeping each result to one line.

Avoid:
- Do not make it the only way to reach a feature.
- Do not open it when a page search field gets focus.
- Do not show more than four groups.

- Do: Results grouped by type, with a meta label on each row.
- Do not: Mixed results with no group or type label leave people guessing what each row opens.

```html
<div class="ns-cmdk" role="dialog" aria-label="Command palette"><div class="ns-cmdk__query"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg><input role="combobox" aria-expanded="true" aria-controls="cmdk-list" aria-label="Search" placeholder="Search accounts, pages and actions" value=""/><kbd>Esc</kbd></div><div class="ns-cmdk__list" id="cmdk-list" role="listbox"><div class="ns-cmdk__group" role="presentation">Accounts</div><div class="ns-cmdk__item" role="option" aria-selected="false"><span>Acme Corp</span><span class="ns-cmdk__meta">Account</span></div><div class="ns-cmdk__item" role="option" aria-selected="false"><span>Acme Holdings</span><span class="ns-cmdk__meta">Account</span></div><div class="ns-cmdk__item" role="option" aria-selected="false"><span>Globex</span><span class="ns-cmdk__meta">Account</span></div><div class="ns-cmdk__item" role="option" aria-selected="false"><span>Northwind</span><span class="ns-cmdk__meta">Account</span></div><div class="ns-cmdk__group" role="presentation">Pages</div><div class="ns-cmdk__item" role="option" aria-selected="false"><span>Billing history</span><span class="ns-cmdk__meta">Page</span></div><div class="ns-cmdk__item" role="option" aria-selected="false"><span>Usage reports</span><span class="ns-cmdk__meta">Page</span></div><div class="ns-cmdk__item" role="option" aria-selected="false"><span>Team settings</span><span class="ns-cmdk__meta">Page</span></div><div class="ns-cmdk__group" role="presentation">Actions</div><div class="ns-cmdk__item" role="option" aria-selected="false"><span>Create account</span><span class="ns-cmdk__meta">Action</span></div><div class="ns-cmdk__item" role="option" aria-selected="false"><span>Invite teammate</span><span class="ns-cmdk__meta">Action</span></div><div class="ns-cmdk__item" role="option" aria-selected="false"><span>Export accounts</span><span class="ns-cmdk__meta">Action</span></div></div><div class="ns-cmdk__foot"><span><kbd>↑</kbd><kbd>↓</kbd> Navigate</span><span><kbd>↵</kbd> Open</span><span><kbd>Esc</kbd> Close</span></div></div>
```

Tokens: `--ns-background-elevated` (Palette surface), `--ns-elevation-04` (Palette shadow), `--ns-background-selected` (Active row), `--ns-text-accent` (Matched text)

Keyboard: Cmd K / Ctrl K: Opens the palette from anywhere; Arrow up / down: Moves the active row; Enter: Opens the active result; Escape: Closes the palette and returns focus to the previous element

Accessibility:
- The palette is a dialog with a name. The input is a combobox that points at the list with aria-controls.
- Results form a listbox, and the active row is set with aria-activedescendant.
- Announce the result count in a polite live region as the query changes.

#### Pagination (Stable)

Pagination splits long collections into pages with page size control and position feedback.

Page: https://mikelrosenthal.com/northstar/#/components/pagination · Figma node 4038:31293

Classes: `ns-helper`, `ns-page`, `ns-pagination`, `ns-select`

Use:
- Tables and lists over ~50 items.

Avoid:
- Feeds where infinite scroll fits better.

- Do: Show position and total.
- Do not: Hide how much content exists.

```html
<nav class="ns-pagination" aria-label="Pagination"><span style="margin-right:12px">Rows <select class="ns-select" style="width:72px;min-height:32px;display:inline-block"><option>25</option><option>50</option></select></span><button class="ns-page" disabled aria-label="Previous page">‹</button><button class="ns-page" aria-current="page">1</button><button class="ns-page">2</button><button class="ns-page">3</button><span>…</span><button class="ns-page">12</button><button class="ns-page" aria-label="Next page">›</button><span style="margin-left:12px">1-25 of 288</span></nav>
```

Tokens: `--ns-interactive-primary` (Current page), `--ns-background-hover` (Hover)

Keyboard: Tab: Moves across controls; Enter: Go to page

Accessibility:
- Wrap in <nav aria-label="Pagination">; current page uses aria-current="page".

#### Side navigation (Stable)

Side navigation is the primary way to move through an app, with collapsible groups for large information spaces.

Page: https://mikelrosenthal.com/northstar/#/components/side-navigation · Figma node 4212:37

Classes: `ns-count`, `ns-helper`, `ns-sidenav`, `ns-sidenav__group` · helper classes in the examples: `brand`, `brand__dot`

Use:
- Apps with five or more top-level destinations.

Avoid:
- Two or three destinations: use tabs or header links.

- Do: Group items by task.
- Do not: Use vague group names.

```html
<nav class="ns-sidenav" aria-label="App"><div class="brand" style="padding:6px 12px 10px"><span class="brand__dot"></span>NORTHSTAR</div><div class="ns-sidenav__group">Operate</div><a href="#/" aria-current="page">Dashboard</a><a href="#/">Accounts <span class="ns-count">3</span></a><a href="#/">Approvals</a><div class="ns-sidenav__group">Configure</div><a href="#/">Integrations</a><a href="#/">Access</a><a href="#/">Settings</a></nav>
```

Tokens: `--ns-background-shell` (Rail), `--ns-background-selected` (Current item), `--ns-text-accent` (Current label)

Keyboard: Tab: Moves through links; Enter: Opens link or toggles group

Accessibility:
- Use <nav> with a label; current link sets aria-current="page".

#### Tabs (Stable)

Use tabs to allow users to navigate easily between views within the same context.

Page: https://mikelrosenthal.com/northstar/#/components/tabs · Figma node 1842:24465

Classes: `ns-count`, `ns-tab`, `ns-tabs`, `ns-tabs--fill`

Variants: Icon: Without, With; Items: 2, 3, 4

Use:
- Two to four peer views of the same object.

Avoid:
- Sequential steps: use a progress indicator.
- Top-level navigation: use side navigation.

- Do: Use short, parallel nouns.
- Do not: Write long or action-style tab labels.

```html
<div class="ns-tabs ns-tabs--fill" role="tablist" style="width:375px"><button class="ns-tab" role="tab" aria-selected="true">Overview</button><button class="ns-tab" role="tab" aria-selected="false">Nodes</button><button class="ns-tab" role="tab" aria-selected="false">Access</button></div>
```

Tokens: `--ns-blue-700` (Selection indicator (3px)), `--ns-gray-8` (Divider), `--ns-gray-4` (Inactive label), `--ns-text-primary` (Selected label)

Keyboard: Arrow left / right: Move between tabs; Home / End: First / last tab; Tab: Moves into the panel

Accessibility:
- role="tablist", role="tab", aria-selected, and aria-controls pointing at each role="tabpanel".

#### Tree view (New)

Browses a hierarchy such as account, location and device. Each level indents 20px. Parents expand and collapse, and leaves keep the chevron space so labels line up.

Page: https://mikelrosenthal.com/northstar/#/components/tree-view · Figma node 4466:335

Classes: `is-leaf`, `ns-tree`, `ns-tree__chev`, `ns-tree__count`, `ns-tree__row`

Variants: Depth: Up to four levels; Row: Collapsed, Expanded, Leaf; State: Default, Hover, Selected, Focus

Use:
- Real hierarchies two to four levels deep.
- Child counts on parents, so people know what is inside before they open it.
- Remembering the expanded state for each person.

Avoid:
- Do not use for flat lists. Use a plain list.
- Do not put actions on every row. Use a Menu on hover or focus.
- Do not go deeper than four levels.

- Do: Parents show child counts, so the contents are known before opening.
- Do not: A flat list has no hierarchy. Use a plain list.

```html
<ul class="ns-tree" role="tree" aria-label="Locations" style="width:320px"><li role="none"><div class="ns-tree__row" role="treeitem" aria-level="1" aria-expanded="true" aria-selected="false" style="--ns-tree-level:0"><span class="ns-tree__chev" aria-hidden="true"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg></span><span>Acme Corp</span><span class="ns-tree__count">2</span></div><ul role="group"><li role="none"><div class="ns-tree__row" role="treeitem" aria-level="2" aria-expanded="true" aria-selected="false" style="--ns-tree-level:1"><span class="ns-tree__chev" aria-hidden="true"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg></span><span>Chicago, IL</span><span class="ns-tree__count">2</span></div><ul role="group"><li role="none"><div class="ns-tree__row" role="treeitem" aria-level="3" aria-selected="true" style="--ns-tree-level:2"><span class="ns-tree__chev is-leaf" aria-hidden="true"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg></span><span>Site 0042</span></div></li><li role="none"><div class="ns-tree__row" role="treeitem" aria-level="3" aria-selected="false" style="--ns-tree-level:2"><span class="ns-tree__chev is-leaf" aria-hidden="true"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg></span><span>Site 0187</span></div></li></ul></li></ul></li></ul>
```

Tokens: `--ns-background-hover` (Row hover), `--ns-background-selected` (Selected row), `--ns-text-tertiary` (Chevron and count), `--ns-focus-field` (Focus ring)

Keyboard: Arrow down / up: Moves to the next or previous visible row; Arrow right: Expands a parent, or moves into its first child; Arrow left: Collapses a parent, or moves to its parent; Enter: Selects the focused row

Accessibility:
- The list has role=tree with a name. Each row is a treeitem with aria-level.
- Parents set aria-expanded. Children sit in a group inside the parent.
- The selected row sets aria-selected=true.

### Actions

#### Button (Stable)

The button component gives users the ability to perform an action or navigate to another page. They have multiple styles and states for different needs. Includes icon button.

Page: https://mikelrosenthal.com/northstar/#/components/button · Figma node 4038:31741

Classes: `is-focus`, `is-hover`, `is-pressed`, `ns-btn`, `ns-btn--danger`, `ns-btn--ghost`, `ns-btn--icon`, `ns-btn--lg`, `ns-btn--outline`, `ns-btn--secondary`, `ns-btn--sm`

Variants: Hierarchy: Primary, Secondary, Outline, Ghost; State: Default, Hover, Pressed, Focus, Disabled; Size: S (32), M (40), L (48); Icons: Show leading icon, Show trailing icon (booleans with instance swaps); Label: Text property; Icon button / Hierarchy: Primary, Secondary, Ghost, Danger; Icon button / Size: S (32), M (40), L (48); Icon button / Icon: Swap the glyph; Icon button / State: Default, Hover, Pressed, Focus, Disabled

Use:
- Primary: actions that require maximum attention. Use only one per page.
- Secondary: secondary actions, or interfaces with low contrast.
- Outline and Ghost: actions that need the least attention on the page.
- Danger (NorthStar extension): destructive actions, always confirmed.
- Icon button: Use Ghost in table rows and toolbars where space is tight.
- Icon button: Show a tooltip with the action name on hover and focus.
- Icon button: Use the L size on touch surfaces so the target stays at 48px.

Avoid:
- Do not use a button for navigation to another page. Use a link.
- Avoid three or more button sizes on one page.
- Icon button: Do not use for primary page actions. Use a Button with a label.
- Icon button: Do not drop the accessible name. Icon-only buttons need aria-label.

- Do: Pair one primary action with an outline action, primary on the right.
- Do not: Stack several primary buttons. Users cannot tell which action matters.

```html
<button class="ns-btn">Button</button>
<button class="ns-btn ns-btn--icon" aria-label="More action"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h.01M12 12h.01M19 12h.01" stroke-width="3"/></svg></button>
```

Tokens: `--ns-interactive-primary` (Primary default (blue/500)), `--ns-interactive-primary-hover` (Primary hover (blue/700)), `--ns-interactive-primary-active` (Primary pressed (purple/500)), `--ns-interactive-secondary-bg` (Secondary fill (gray/8)), `--ns-interactive-secondary-hover` (Secondary hover (gray/7)), `--ns-gray-4` (Disabled fill), `--ns-radius-lg` (Corner radius (8px)), `--ns-focus-ring` (Focus ring, 2px with 2px offset), `--ns-interactive-ghost-hover` (Ghost hover), `--ns-status-error` (Danger background), `--ns-density-control` (Height in compact density)

Keyboard: Tab: Moves focus to the button; Enter / Space: Activates the button; Tab: Icon button: Moves focus to the button; Enter / Space: Icon button: Activates the button

Accessibility:
- Use a native <button>. Icon-only buttons need aria-label.
- Disabled buttons use the disabled attribute so they leave the tab order.
- Focus shows a 2px ring with a 2px offset. Never remove it.
- Icon button: Use a native button. Icon-only buttons need an aria-label that names the action, such as Edit contact.
- Icon button: Pair the icon with a tooltip so sighted users hear the same name.
- Icon button: Disabled buttons use the disabled attribute so they leave the tab order.

#### Link (New)

A text link for navigation. Links go to a destination, and buttons run an action. External links open in a new tab and say so to screen readers.

Page: https://mikelrosenthal.com/northstar/#/components/link · Figma node 4465:92

Classes: `ns-link`, `ns-link--external`, `ns-link__arrow` · helper classes in the examples: `sr-only`

Variants: Type: Default, External; State: Default, Hover, Focus, Disabled

Use:
- Use for navigation, not for actions that change data.
- Write the destination as the label.
- Mark external destinations, and say they open in a new tab.

Avoid:
- Do not use click here or more here as the label.
- Do not style a button as a link for a destructive action.
- Do not rely on color alone. Keep the underline on hover and focus.

- Do: Name the destination in the label.
- Do not: Click here tells a screen reader user nothing about the destination.

```html
<a class="ns-link" href="#">View billing history</a>
```

Tokens: `--ns-text-link` (Default link color), `--ns-text-accent` (Hover color), `--ns-focus-field` (Focus ring), `--ns-text-disabled` (Disabled link)

Keyboard: Tab: Moves focus to the link; Enter: Follows the link

Accessibility:
- Use a native a element with href. Do not use a div with a click handler.
- External links set target and rel=noopener, and include a hidden note that the link opens in a new tab.
- Disabled links use aria-disabled and lose their href.

#### Menu (New)

A list of actions that opens from a trigger, such as a row's more button. Use it for secondary actions. Keep primary actions out of the menu, and put destructive actions last.

Page: https://mikelrosenthal.com/northstar/#/components/menu · Figma node 4466:90

Classes: `is-destructive`, `ns-menu`, `ns-menu--panel`, `ns-menu__sep`

Variants: Item: Label, Icon, Shortcut, Type; Type: Default, Destructive; State: Default, Hover, Focus, Disabled

Use:
- Use for secondary actions on a row or object.
- Group related actions and put destructive ones last.
- Show a shortcut only when the same shortcut works outside the menu.

Avoid:
- Do not put a primary action only in a menu.
- Do not nest more than one level.
- Do not use a menu to choose a value. Use Select.

- Do: Destructive actions last, behind a divider.
- Do not: A destructive action at the top sits one click from the most common action.

```html
<div class="ns-menu ns-menu--panel" role="menu" aria-label="Row actions" style="width:240px"><button role="menuitem">Edit details<kbd>⌘E</kbd></button><button role="menuitem">Duplicate</button><button role="menuitem" aria-disabled="true">Archive</button><div class="ns-menu__sep" role="separator"></div><button role="menuitem" class="is-destructive">Delete</button></div>
```

Tokens: `--ns-background-elevated` (Menu surface), `--ns-elevation-03` (Menu shadow), `--ns-background-hover` (Item hover), `--ns-status-error` (Destructive text)

Keyboard: Enter / Space: Opens the menu from the trigger, or activates the focused item; Arrow up / down: Moves between items; Escape: Closes the menu and returns focus to the trigger

Accessibility:
- The trigger has aria-haspopup=menu and aria-expanded.
- The list uses role=menu and each item uses role=menuitem.
- Disabled items keep aria-disabled so screen readers can announce them.

### Inputs

#### Checkbox (Stable)

Checkboxes select one or more options from a list, or toggle a single setting that applies on submit.

Page: https://mikelrosenthal.com/northstar/#/components/checkbox · Figma node 1841:21803

Classes: `ns-check`, `ns-label`

Use:
- Select several options from a list.
- Confirm a single agreement or setting that applies on submit.

Avoid:
- Choose exactly one option: use radio buttons.
- Settings that apply instantly: use a toggle.

- Do: Stack options vertically for easy scanning.
- Do not: Write negative or double-negative labels.

```html
<fieldset style="border:0;padding:0;margin:0;display:grid;gap:10px"><legend class="ns-label" style="margin-bottom:10px">Alert channels</legend><label class="ns-check"><input type="checkbox" checked/> Email</label><label class="ns-check"><input type="checkbox"/> Slack</label><label class="ns-check"><input type="checkbox" checked/> PagerDuty</label></fieldset>
```

Tokens: `--ns-interactive-primary` (Checked fill), `--ns-border-strong` (Unchecked border), `--ns-focus-ring` (Focus), `--ns-radius-xs` (Box radius)

Keyboard: Tab: Moves between checkboxes; Space: Toggles the focused checkbox

Accessibility:
- Wrap groups in <fieldset> with a <legend>.
- Indeterminate is set via the DOM property, exposed as aria-checked="mixed".

#### Combobox (New)

A filterable multi-select for long lists. Typing filters the options, Enter toggles the active option, and chosen values stay visible as removable tags. Use it when the list is longer than about ten items.

Page: https://mikelrosenthal.com/northstar/#/components/combobox · Figma node 4466:34

Classes: `is-open`, `ns-combobox`, `ns-combobox__control`, `ns-combobox__count`, `ns-combobox__list`, `ns-helper`, `ns-menu`, `ns-menu--panel`, `ns-tag`, `ns-tag--sm`

Variants: State: Default, Focus, Open, Disabled; Selection: Zero, one or many tags

Use:
- Use for lists longer than about ten items.
- Show the match count while the user filters.
- Keep chosen values visible as removable tags.

Avoid:
- Do not use for two to six options. Use Checkbox or Radio.
- Do not clear the query after each pick.
- Do not use for a single choice from a short list. Use Select.

- Do: Filters as you type, keeps picks as tags, and shows the match count.
- Do not: Two options are better as Radio buttons or a Toggle.

```html
<div class="ns-combobox" style="width:340px"><div class="ns-combobox__control"><span class="ns-tag ns-tag--sm">Analytics <button type="button" aria-label="Remove Analytics">×</button></span><input role="combobox" aria-expanded="false" aria-label="Add tag" placeholder="Add tag"/></div><div class="ns-menu ns-menu--panel ns-combobox__list" role="listbox" aria-multiselectable="true" aria-label="Tags"><button type="button" tabindex="-1" role="option" aria-selected="true">Analytics</button><button type="button" tabindex="-1" role="option" aria-selected="false">Billing</button><button type="button" tabindex="-1" role="option" aria-selected="false">Compliance</button><button type="button" tabindex="-1" role="option" aria-selected="false">Customer success</button><button type="button" tabindex="-1" role="option" aria-selected="false">Data export</button><button type="button" tabindex="-1" role="option" aria-selected="false">Finance</button><button type="button" tabindex="-1" role="option" aria-selected="false">Onboarding</button><button type="button" tabindex="-1" role="option" aria-selected="false">Reporting</button><button type="button" tabindex="-1" role="option" aria-selected="false">Security</button><button type="button" tabindex="-1" role="option" aria-selected="false">Support</button><span class="ns-helper ns-combobox__count">10 of 10 match</span></div></div>
```

Tokens: `--ns-border-default` (Control border), `--ns-focus-field` (Focus ring), `--ns-background-elevated` (List surface), `--ns-background-selected` (Selected option)

Keyboard: Arrow up / down: Moves the active option; Enter: Toggles the active option; Backspace: On an empty query, removes the last tag; Escape: Closes the list and keeps the query

Accessibility:
- The input has role=combobox, aria-expanded, and aria-controls pointing at the list.
- The list has role=listbox with aria-multiselectable=true, and each option has aria-selected.
- Announce the match count in a polite live region as the query changes.

#### Date picker (New)

Date pickers select a single date or a range from a calendar overlay, with typed input as an alternative.

Page: https://mikelrosenthal.com/northstar/#/components/date-picker · Figma node 4215:37

Classes: `is-muted`, `is-range`, `is-selected`, `is-today`, `ns-cal`, `ns-cal__day`, `ns-cal__dow`, `ns-cal__grid`, `ns-cal__head`, `ns-field`, `ns-input`, `ns-label` · helper classes in the examples: `icon-btn`

Use:
- Choosing dates near today, or ranges where seeing the week helps.

Avoid:
- Dates far in the past like birthdays: use a typed input.

- Do: Show the expected format in the label.
- Do not: Leave the format ambiguous.

```html
<div style="display:grid;gap:12px"><div class="ns-field" style="width:280px"><label class="ns-label">Reporting window</label><input class="ns-input" aria-label="Reporting window" value="09/10/2026 - 09/16/2026"/></div><div class="ns-cal" role="group" aria-label="September 2026"><div class="ns-cal__head"><button class="icon-btn" aria-label="Previous month">‹</button>September 2026<button class="icon-btn" aria-label="Next month">›</button></div><div class="ns-cal__grid"><span class="ns-cal__dow">Mo</span><span class="ns-cal__dow">Tu</span><span class="ns-cal__dow">We</span><span class="ns-cal__dow">Th</span><span class="ns-cal__dow">Fr</span><span class="ns-cal__dow">Sa</span><span class="ns-cal__dow">Su</span><button class="ns-cal__day is-muted" tabindex="-1">29</button><button class="ns-cal__day is-muted" tabindex="-1">30</button><button class="ns-cal__day is-muted" tabindex="-1">31</button><button class="ns-cal__day   ">1</button><button class="ns-cal__day   ">2</button><button class="ns-cal__day   ">3</button><button class="ns-cal__day   ">4</button><button class="ns-cal__day   ">5</button><button class="ns-cal__day   ">6</button><button class="ns-cal__day   ">7</button><button class="ns-cal__day   ">8</button><button class="ns-cal__day   ">9</button><button class="ns-cal__day  is-selected ">10</button><button class="ns-cal__day   is-range">11</button><button class="ns-cal__day   is-range">12</button><button class="ns-cal__day   is-range">13</button><button class="ns-cal__day   is-range">14</button><button class="ns-cal__day   is-range">15</button><button class="ns-cal__day  is-selected ">16</button><button class="ns-cal__day   ">17</button><button class="ns-cal__day   ">18</button><button class="ns-cal__day   ">19</button><button class="ns-cal__day   ">20</button><button class="ns-cal__day   ">21</button><button class="ns-cal__day   ">22</button><button class="ns-cal__day   ">23</button><button class="ns-cal__day is-today  ">24</button><button class="ns-cal__day   ">25</button><button class="ns-cal__day   ">26</button><button class="ns-cal__day   ">27</button><button class="ns-cal__day   ">28</button><button class="ns-cal__day   ">29</button><button class="ns-cal__day   ">30</button><button class="ns-cal__day is-muted" tabindex="-1">1</button><button class="ns-cal__day is-muted" tabindex="-1">2</button></div></div></div>
```

Tokens: `--ns-background-elevated` (Calendar surface), `--ns-interactive-primary` (Selected day), `--ns-background-selected` (Range fill), `--ns-teal-500` (Today ring)

Keyboard: Arrow keys: Move between days; Page up / down: Previous / next month; Enter: Select day; Esc: Close calendar

Accessibility:
- Calendar grid uses role="grid"; days are buttons with full date labels.
- The typed input is always available, so the calendar is never the only path.

#### File uploader (New)

File uploaders accept files by drag-and-drop or browse, and show progress and validation per file.

Page: https://mikelrosenthal.com/northstar/#/components/file-uploader · Figma node 4217:37

Classes: `ns-drop`, `ns-file`, `ns-file__ext`, `ns-helper`, `ns-notice__close`, `ns-progress`, `ns-progress__bar`, `ns-progress__track` · helper classes in the examples: `sr-only`

Use:
- Importing data files, attachments, and assets.

Avoid:
- Pasting short text: use a textarea.

- Do: State accepted types and size limits before upload.
- Do not: Show generic errors without telling people how to fix them.

```html
<div style="display:grid;gap:12px;max-width:460px;margin:0 auto"><label class="ns-drop" id="drop-demo"><span style="font-size:22px">↑</span><span>Drag files here or <b>browse</b></span><span class="ns-helper">CSV, JSON up to 25 MB</span><input type="file" class="sr-only" multiple/></label><div class="ns-file"><span class="ns-file__ext">CSV</span><div><b>accounts-q3.csv</b><div class="ns-progress" style="margin-top:6px"><div class="ns-progress__track"><div class="ns-progress__bar" style="--_v:72%"></div></div></div></div><span class="ns-helper">72%</span></div><div class="ns-file"><span class="ns-file__ext" style="color:var(--ns-status-error)">PDF</span><div><b>contract.pdf</b><div class="ns-helper" style="color:var(--ns-status-error)">File type not supported</div></div><button class="ns-notice__close" aria-label="Remove">×</button></div></div>
```

Tokens: `--ns-border-strong` (Drop zone border), `--ns-teal-500` (Drag-over highlight), `--ns-status-error` (Invalid file)

Keyboard: Tab: Focus the drop zone; Enter / Space: Open the file browser

Accessibility:
- The drop zone wraps a real file input, so keyboard and screen reader users never need drag-and-drop.
- Announce upload completion through a live region.

#### Inline edit (New)

Edit one field in place on a detail page. Enter or the check saves, Escape cancels, and a failed save keeps the typed value and shows a Toast.

Page: https://mikelrosenthal.com/northstar/#/components/inline-edit · Figma node 4466:54

Classes: `is-editing`, `ns-field`, `ns-inline-edit`, `ns-inline-edit__btn`, `ns-inline-edit__input`, `ns-input`, `ns-label`

Variants: State: Read, Hover, Editing, Saving

Use:
- Use on detail pages for single fields that change often.
- Save one field at a time.
- Show the value as plain text until it is hovered or focused.

Avoid:
- Do not use for fields with dependencies. Use a form.
- Do not use inline edit in tables with sorting active.
- Do not hide that the field is editable. Show the pencil on hover and focus.

- Do: Edit one field at a time, and show the saved state.
- Do not: Dependent fields such as address parts belong in a form that saves together.

```html
<div style="width:280px"><span class="ns-label">Account manager</span><div class="ns-inline-edit" tabindex="0" role="button" aria-label="Edit account manager">Sara Kim</div></div>
```

Tokens: `--ns-background-hover` (Hover surface), `--ns-focus-field` (Editing border), `--ns-text-primary` (Value text), `--ns-text-tertiary` (Pencil icon)

Keyboard: Enter: Saves the value; Escape: Cancels and restores the value; Tab: Moves to the next editable field

Accessibility:
- The read state is a button with an aria-label that names the field, such as Edit account manager.
- Editing uses a labeled input and two named buttons, Save and Cancel.
- Announce the save result in a polite live region.

#### Number stepper (New)

An integer field with decrement and increment buttons, for small counts with a clear minimum and maximum. People can also type the number directly.

Page: https://mikelrosenthal.com/northstar/#/components/number-stepper · Figma node 4466:261

Classes: `ns-field`, `ns-label`, `ns-stepper`

Variants: State: Default, Focus, At minimum, At maximum, Disabled

Use:
- Use for small counts with a clear minimum and maximum.
- Let people type the number as well as step it.
- Disable a button when the value is at its limit.

Avoid:
- Do not use for money or large numbers. Use Input.
- Do not hide the minimum and maximum.
- Do not use when the value is better chosen from a list. Use Select.

- Do: State the range in the label. The buttons disable at the limits.
- Do not: Money does not belong in a stepper. Use Input.

```html
<div class="ns-stepper" role="group" aria-label="Sites"><button type="button" aria-label="Decrease"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/></svg></button><input type="number" inputmode="numeric" value="3" min="1" max="50" aria-label="Sites"/><button type="button" aria-label="Increase"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg></button></div>
```

Tokens: `--ns-border-default` (Outline), `--ns-background-hover` (Button hover), `--ns-text-disabled` (Disabled buttons), `--ns-density-control` (Height)

Keyboard: Arrow up / down: Steps by 1; Page up / down: Steps by 10; Home / End: Jumps to the minimum or maximum

Accessibility:
- The input is a native number input with aria-label, min and max, so screen readers announce the range.
- Buttons have names such as Decrease and Increase, and use the disabled attribute at the limits.
- The group has a name, such as Sites, so the buttons are announced in context.

#### Radio button (Stable)

Radio buttons allow users to select a single option from a list of mutually exclusive options. All possible options are exposed up front for users to compare.

Page: https://mikelrosenthal.com/northstar/#/components/radio-button · Figma node 1842:24303

Classes: `ns-check`, `ns-check--radio`, `ns-label`

Variants: Hovered: No, Yes; Selected: Yes, No; Disabled: No, Yes; Show label: No (16x16), Yes

Use:
- Two to five mutually exclusive options that benefit from being visible together.

Avoid:
- More than five options: use a dropdown.
- Multiple choices: use checkboxes.

- Do: Preselect the safest or most common option.
- Do not: Use a radio button without a label.

```html
<fieldset style="border:0;padding:0;margin:0"><legend class="ns-label" style="margin-bottom:10px">Deployment strategy</legend><div style="display:flex;gap:12px;flex-direction:column;flex-wrap:wrap"><label class="ns-check ns-check--radio"><input type="radio" name="rb" checked/> Rolling</label><label class="ns-check ns-check--radio"><input type="radio" name="rb"/> Blue / green</label><label class="ns-check ns-check--radio"><input type="radio" name="rb"/> Canary</label></div></fieldset>
```

Tokens: `--ns-interactive-primary` (Selected ring (blue/500)), `--ns-blue-700` (Selected + hover ring), `--ns-gray-5` (Unselected ring), `--ns-text-secondary` (Label (white + semibold on hover))

Keyboard: Tab: Moves into and out of the group; Arrow keys: Move selection within the group

Accessibility:
- Group with <fieldset> and <legend>.
- All radios in a group share one name.

#### Segmented control (New)

Switches between two to five views of the same content. Exactly one segment is selected at a time, and arrow keys move the selection.

Page: https://mikelrosenthal.com/northstar/#/components/segmented-control · Figma node 4466:175

Classes: `ns-segmented`

Variants: Segments: 2 to 5; Icon: Optional, shown with the label; State: Default, Hover, Selected, Focus, Disabled

Use:
- Switching views of the same data, such as Table, Board or Map.
- Keeping each label to one word.
- Using an icon with the label for view switchers.

Avoid:
- Do not use for navigation between pages. Use Tabs.
- Do not use for form choices that apply on save. Use Radio.
- Do not exceed five segments.

- Do: Switch the view of the same data.
- Do not: Moving between pages belongs in Tabs, not a segmented control.

```html
<div class="ns-segmented" role="radiogroup" aria-label="View"><button type="button" role="radio" aria-checked="true" tabindex="0">Table</button><button type="button" role="radio" aria-checked="false" tabindex="-1">Board</button><button type="button" role="radio" aria-checked="false" tabindex="-1">Map</button></div>
```

Tokens: `--ns-background-secondary` (Track), `--ns-background-elevated` (Selected segment), `--ns-text-primary` (Selected label), `--ns-focus-field` (Focus ring)

Keyboard: Tab: Moves focus into the selected segment and out of the group; Arrow left / right: Moves the selection to the previous or next segment

Accessibility:
- The group is a radiogroup with a name, such as View.
- Each segment is a radio with aria-checked. Only the selected segment is in the tab order.
- Disabled segments keep aria-disabled so screen readers can announce them.

#### Select (Stable)

Select lets people choose one option from a list of 4 to 15 predefined values. Includes dropdown.

Page: https://mikelrosenthal.com/northstar/#/components/select · Figma node 4207:955

Classes: `is-hover`, `is-static`, `ns-dd`, `ns-dd__item`, `ns-dd__menu`, `ns-dd__trigger`, `ns-field`, `ns-helper`, `ns-input--sm`, `ns-label`, `ns-select` · helper classes in the examples: `caret`

Variants: Dropdown / Trigger / Content: Text (150x42), Icon (36x36), Two icons (176x42); Dropdown / Trigger / State: Default, Hover, Disabled; Dropdown / Menu / Items: 4, 5, 6, 7 (200 wide, +42 per item); Dropdown / List item: Icon: No, Yes · Hovered: No, Yes (200x40)

Use:
- Choose one option from a medium-length list.
- Space is tight and options do not need comparison.
- Dropdown: Sorting, filtering, and choosing one value from 4 to 7 options.
- Dropdown: Toolbars where a visible radio group would take too much room.

Avoid:
- Two or three options: use radio buttons.
- Over 15 options: use a searchable combo box.
- Dropdown: Two or three options: use radio buttons.
- Dropdown: Long lists: use a searchable combo box.

- Do: Order options logically: severity, alphabetical, or frequency.
- Do not: Use select for a binary choice. Use a toggle.

```html
<div class="ns-field" style="width:300px"><label class="ns-label" for="sel-1">Region</label><select class="ns-select" id="sel-1"><option>us-east-1</option><option>us-west-2</option><option>eu-central-1</option><option>ap-south-1</option></select><span class="ns-helper">Where new workloads are scheduled.</span></div>
<div style="display:grid;grid-template-columns:minmax(0,1fr);gap:6px;justify-items:start"><button class="ns-dd__trigger" aria-haspopup="listbox" aria-expanded="true" style="min-width:150px">Sort by<span class="caret"></span></button><ul class="ns-dd__menu is-static" role="listbox" aria-label="Sort by"><li><button class="ns-dd__item" role="option" aria-selected="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9 7 7M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1"/></svg>Newest first</button></li><li><button class="ns-dd__item is-hover" role="option" aria-selected="false"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9 7 7M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1"/></svg>Oldest first</button></li><li><button class="ns-dd__item" role="option" aria-selected="false"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9 7 7M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1"/></svg>Highest load</button></li><li><button class="ns-dd__item" role="option" aria-selected="false"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9 7 7M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1"/></svg>Lowest load</button></li></ul></div>
```

Tokens: `--ns-background-surface` (Field background), `--ns-border-default` (Border), `--ns-focus-ring` (Focus), `--ns-interactive-secondary-bg` (Trigger and menu fill (gray/8)), `--ns-interactive-secondary-hover` (Hover (gray/7)), `--ns-blue-700` (Selected item indicator), `--ns-radius-sm` (Radius)

Keyboard: Space / Enter: Opens the list; Arrow up / down: Moves through options; Type-ahead: Jumps to matching option; Enter / Space: Dropdown: Open menu; Arrow up / down: Dropdown: Move between items; Enter: Dropdown: Select item; Esc: Dropdown: Close and return focus

Accessibility:
- Native <select> gives full screen reader support for free.
- Associate the label with for / id.
- Dropdown: Trigger has aria-haspopup="listbox" and aria-expanded.
- Dropdown: Menu uses role="listbox", items role="option" with aria-selected.

#### Slider (Stable)

Sliders pick a value or range from a continuous or stepped scale.

Page: https://mikelrosenthal.com/northstar/#/components/slider · Figma node 4207:1097

Classes: `ns-field`, `ns-label`, `ns-slider`, `ns-slider-ticks`

Use:
- Adjust values where the relative position matters more than exact input: thresholds, opacity, zoom.

Avoid:
- Exact values are required: pair with or use a number input.

- Do: Show the min, max, and current value.
- Do not: Hide the scale when precision matters.

```html
<div class="ns-field" style="width:360px"><label class="ns-label" for="sl-1">Alert threshold: <output>60</output>%</label><input class="ns-slider" id="sl-1" type="range" min="0" max="100" step="1" value="60" style="--_pct:60%"/><div class="ns-slider-ticks"><span>0</span><span>25</span><span>50</span><span>75</span><span>100</span></div></div>
```

Tokens: `--ns-interactive-primary` (Filled track and thumb ring), `--ns-border-default` (Empty track)

Keyboard: Arrow keys: Move by one step; Page up / down: Move by 10 steps; Home / End: Jump to min / max

Accessibility:
- Native range input exposes aria-valuenow, min, and max.
- Add aria-valuetext when units matter, e.g. "60 percent".

#### Switch (Stable)

Switches allow users to turn an individual option on or off. They are usually used to activate or deactivate a specific setting.

Page: https://mikelrosenthal.com/northstar/#/components/toggle · Figma node 1842:24379

Classes: `ns-toggle`, `ns-toggle--sm`, `ns-toggle--xs`

Variants: Selected: On, Off; Show label: Yes, No; State: Default, Hover; Disabled: No, Yes

Use:
- Binary settings that take effect immediately.

Avoid:
- Settings that need a Save action: use a checkbox.

- Do: Label the setting, not the state.
- Do not: Use On / Off as the label.

```html
<label class="ns-toggle ns-toggle--xs"><input type="checkbox" role="switch" checked/> Real-time telemetry</label>
```

Tokens: `--ns-interactive-primary` (On track), `--ns-gray-6` (Off track), `--ns-duration-base` (Knob travel)

Keyboard: Tab: Focus; Space: Toggle

Accessibility:
- Use role="switch" so screen readers say on/off.

#### Text input (Stable)

Text inputs enable the user to interact with and input content and data. This component can be used for long and short form entries. Includes search.

Page: https://mikelrosenthal.com/northstar/#/components/text-input · Figma node 1846:24421

Classes: `is-error`, `is-focus`, `is-warning`, `ns-field`, `ns-helper`, `ns-input`, `ns-input--lg`, `ns-input--md`, `ns-input--sm`, `ns-label`, `ns-search`, `ns-textarea` · helper classes in the examples: `hdr__search`, `label`

Variants: Size: Small (32), Medium (36), Large (48); State: Default, Focus, Error, Warning, Disabled

Use:
- Collect short free-form text such as names, IDs, and hostnames.
- Use helper text to set format expectations before an error happens.
- Search: Large collections where browsing is slow.
- Search: Filtering a table or list in place.

Avoid:
- Long text: use a textarea.
- A fixed set of values: use a dropdown or radio group.
- Search: Fewer than ~10 items: show them all.

- Do: Keep a visible label above the field at all times.
- Do not: Rely on placeholder text as the only label. It disappears on input.

```html
<div class="ns-field" style="width:220px"><label class="ns-label" for="ti-1">Cluster name</label><input class="ns-input ns-input--md" id="ti-1" placeholder="Placeholder" aria-describedby="ti-1-h"/><span class="ns-helper" id="ti-1-h">Lowercase, 3 to 24 characters.</span></div>
<div class="ns-search" role="search" style="width:360px"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg><input class="ns-input" type="search" placeholder="Search accounts, nodes, tickets" aria-label="Search"/><kbd>/</kbd></div>
```

Tokens: `--ns-field-bg` (Field fill (no border at rest)), `--ns-focus-field` (Focus border + 3px glow (blue/700)), `--ns-status-error` (Error border and placeholder), `--ns-status-warning` (Warning border and placeholder), `--ns-radius-sm` (Corner radius), `--ns-radius-full` (Pill shape), `--ns-text-tertiary` (Icon), `--ns-focus-ring` (Focus)

Keyboard: Tab: Moves focus into the field; Esc: Clears the field when a clear button is present; / or ⌘K: Search: Open global search; Esc: Search: Clear or close; Arrow keys + Enter: Search: Pick a result

Accessibility:
- Link helper and error text with aria-describedby.
- Set aria-invalid="true" on error.
- Never remove the visible label. Placeholders are not labels.
- Search: Wrap in role="search" and give the input an aria-label.
- Search: Announce result counts in a polite live region.

#### Textarea (New)

A multi-line text field for free text. It follows the same states as Input. Show a counter when the field has a hard limit, and let the field grow to about eight lines.

Page: https://mikelrosenthal.com/northstar/#/components/textarea · Figma node 4466:309

Classes: `is-error`, `ns-field`, `ns-helper`, `ns-label`, `ns-textarea`

Variants: State: Default, Hover, Focus, Error, Warning, Success, Disabled, Read only; Counter: Shown or hidden; Rows: Starts at three, grows to eight

Use:
- Use for free text longer than one line, such as notes or descriptions.
- Show a counter when there is a hard character limit.
- Let the field grow with the content up to about eight lines.

Avoid:
- Do not use for single values such as names or IDs. Use Input.
- Do not hide the limit until the user reaches it.
- Do not use placeholder text as the label.

- Do: Label above the field, limit shown below it.
- Do not: A placeholder used as the label disappears as soon as the user types.

```html
<div class="ns-field" style="width:360px"><label class="ns-label" for="pg-ta">Description</label><textarea class="ns-textarea" id="pg-ta" placeholder="Services, regions and size" maxlength="1000"></textarea><span class="ns-helper">0 / 1000</span></div>
```

Tokens: `--ns-border-default` (Default border), `--ns-focus-field` (Focus border and ring), `--ns-status-error` (Error border and message), `--ns-text-disabled` (Placeholder and disabled text)

Keyboard: Tab: Moves focus into and out of the field; Enter: Adds a new line. It does not submit the form

Accessibility:
- Associate the label with for and id.
- Link helper and error text with aria-describedby.
- Set aria-invalid=true on error. Announce the counter at the limit, not on every key press.

### Overlays

#### Modal (Stable)

Modals focus attention on a single task or decision and block the rest of the page until dismissed.

Page: https://mikelrosenthal.com/northstar/#/components/modal · Figma node 4211:201

Classes: `ns-btn`, `ns-btn--danger`, `ns-btn--tertiary`, `ns-modal`, `ns-modal--inline`, `ns-modal__body`, `ns-modal__foot`, `ns-modal__head`, `ns-modal__label`, `ns-modal__title` · helper classes in the examples: `icon-btn`

Use:
- Confirming destructive or irreversible actions.
- Short, focused tasks that need an answer now.

Avoid:
- Long forms: use a full page or side panel.
- Non-blocking info: use a notification.

- Do: Label actions with the verb: Revoke, Delete, Publish.
- Do not: Use Yes / No. People skim buttons, not questions.

```html
<div style="display:grid;gap:20px;justify-items:center;width:100%"><div class="ns-modal ns-modal--inline" role="dialog" aria-labelledby="mdl-t"><div class="ns-modal__head"><div><p class="ns-modal__label">Account access</p><h2 class="ns-modal__title" id="mdl-t">Revoke API credentials?</h2></div><button class="icon-btn" aria-label="Close">×</button></div><div class="ns-modal__body">Revoking credentials for Acme Corp stops 14 active integrations immediately.</div><div class="ns-modal__foot"><button class="ns-btn ns-btn--tertiary">Cancel</button><button class="ns-btn ns-btn--danger">Revoke</button></div></div><button class="ns-btn ns-btn--tertiary" data-open-modal>Open live modal</button></div>
```

Tokens: `--ns-background-elevated` (Surface), `--ns-elevation-04` (Shadow), `--ns-radius-xl` (Radius), `--ns-duration-slow + --ns-easing-enter` (Entrance)

Keyboard: Tab / Shift+Tab: Cycles within the modal (focus trap); Esc: Closes; Enter: Activates focused button

Accessibility:
- role="dialog", aria-modal="true", aria-labelledby the title.
- Focus moves in on open and returns to the trigger on close. Try the live modal.

#### Popover (Stable)

Popovers show richer, interactive content anchored to a trigger, such as menus and quick filters.

Page: https://mikelrosenthal.com/northstar/#/components/popover · Figma node 4210:129

Classes: `ns-btn`, `ns-btn--tertiary`, `ns-helper`, `ns-menu`, `ns-popover`, `ns-popover__panel`

Use:
- Overflow menus, quick filters, small forms.

Avoid:
- Blocking decisions: use a modal.

- Do: Keep menus short and grouped.
- Do not: Hide your whole navigation in a popover.

```html
<div class="ns-popover"><button class="ns-btn ns-btn--tertiary" data-popover aria-haspopup="menu">Actions ▾</button><div class="ns-popover__panel" style="padding:4px"><ul class="ns-menu" role="menu"><li><button role="menuitem">Duplicate</button></li><li><button role="menuitem">Export CSV</button></li><li><button role="menuitem" style="color:var(--ns-status-error)">Archive</button></li></ul></div></div>
```

Tokens: `--ns-background-elevated` (Panel), `--ns-elevation-02` (Shadow), `--ns-radius-lg` (Radius)

Keyboard: Enter / Space: Open; Arrow keys: Move between items; Esc: Close and return focus

Accessibility:
- Trigger has aria-haspopup and aria-expanded; menus use role="menu".

#### Tooltip (Stable)

Tooltips show contextual help or information about specific components when a user hovers or focuses on them.

Page: https://mikelrosenthal.com/northstar/#/components/tooltip · Figma node 1846:24506

Classes: `ns-btn`, `ns-btn--icon`, `ns-btn--outline`, `ns-helper`, `ns-tip`, `ns-tip__bubble`, `ns-tooltip`

Variants: Placement: N, NW, NE, S, E, W; Icon: Yes, No

Use:
- Labeling icon-only buttons.
- Brief definitions of terms.

Avoid:
- Essential info or anything interactive: use a popover.

- Do: Keep it to a few words.
- Do not: Put interactive content in a tooltip.

```html
<span class="ns-tooltip" role="tooltip" data-place="nw"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 16v-4M12 8h.01"/></svg>This is a tooltip on the North West side</span>
```

Tokens: `--ns-background-inverse` (Bubble), `--ns-text-inverse` (Text), `--ns-radius-sm` (Radius)

Keyboard: Tab: Focusing the trigger shows the tooltip; Esc: Dismisses

Accessibility:
- Trigger references the bubble with aria-describedby; bubble has role="tooltip".

## Pattern detail

### Forms

https://mikelrosenthal.com/northstar/#/patterns/forms

Forms collect information. NorthStar forms are single-column by default, validate on blur, and summarize errors on submit.

**Single column**

Example (Create account):
```html
<form class="ns" style="display:grid;gap:18px;max-width:420px;width:100%" onsubmit="event.preventDefault();NS.toast('Account created','Acme Corp was added.','success')"><div class="ns-field"><label class="ns-label" for="f1">Company name</label><input class="ns-input" id="f1" required="" value="Acme Corp"></div><div class="ns-field is-error"><label class="ns-label" for="f2">Billing email</label><input class="ns-input" id="f2" value="billing@acme" aria-invalid="true" aria-describedby="f2h"><span class="ns-helper" id="f2h">Enter a full email address, like billing@acme.com</span></div><div class="ns-field"><label class="ns-label" for="f3">Tier</label><select class="ns-select" id="f3"><option>Gold</option><option>Silver</option></select></div><label class="ns-check"><input type="checkbox" checked=""> Send welcome kit</label><div style="display:flex;gap:10px"><button class="ns-btn">Create account</button><button type="button" class="ns-btn ns-btn--tertiary">Cancel</button></div></form>
```

**Validation**

**Layout**

One column, labels on top, in the order people think.
Put unrelated fields side by side. It breaks the reading path.

### Modal dialogs

https://mikelrosenthal.com/northstar/#/patterns/modal-dialogs

Use modal dialogs for decisions that must happen now. Everything else belongs in the page.

**Types**

**Live example**

Example (Danger modal with focus trap):
```html
<button class="ns-btn ns-btn--danger" data-open-modal="">Revoke credentials</button>
```

**Rules**

- One modal at a time. Never open a modal from a modal.
- Title says what will happen; primary button repeats the verb.
- Esc and the close button always work, except during a running save.

### Table views

https://mikelrosenthal.com/northstar/#/patterns/table-views

How search, filters, batch actions, and pagination combine around a data table.

**Anatomy**

Example (Toolbar, table, pagination):
```html
<div style="display:grid;gap:12px;width:100%"><div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center"><div class="ns-search" style="flex:1;min-width:220px"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"></circle><path d="m20 20-3.5-3.5"></path></svg><input class="ns-input" placeholder="Search accounts" aria-label="Search accounts"></div><span class="ns-tag ns-tag--blue">Tier: Gold<button aria-label="Remove Tier: Gold">×</button></span><button class="ns-btn ns-btn--tertiary ns-btn--sm">Filters</button></div><div class="ns-table-wrap" style="width:100%"><div class="ns-table-bar"><b data-batch-label="" data-default="Accounts">Accounts</b><div style="display:flex;gap:8px"><button class="ns-btn ns-btn--sm ns-btn--tertiary">Export</button><button class="ns-btn ns-btn--sm">Add account</button></div></div>
<table class="ns-table  ">
  <thead><tr><th><label class="ns-check"><input type="checkbox" data-select-all="" aria-label="Select all rows"></label></th><th data-sort="">Account <span class="ns-sort">↕</span></th><th data-sort="">Tier <span class="ns-sort">↕</span></th><th data-sort="" class="num">Revenue <span class="ns-sort">↕</span></th><th>Status</th></tr></thead>
  <tbody><tr><td><label class="ns-check"><input type="checkbox" data-row-select="" aria-label="Select Acme Corp"></label></td><td>Acme Corp</td><td>Gold</td><td class="num">$12,400</td><td><span class="ns-dot ns-dot--success">active</span></td></tr><tr><td><label class="ns-check"><input type="checkbox" data-row-select="" aria-label="Select Beta LLC"></label></td><td>Beta LLC</td><td>Silver</td><td class="num">$5,200</td><td><span class="ns-dot ns-dot--warning">pending</span></td></tr><tr><td><label class="ns-check"><input type="checkbox" data-row-select="" aria-label="Select Zeta Inc"></label></td><td>Zeta Inc</td><td>Platinum</td><td class="num">$38,900</td><td><span class="ns-dot ns-dot--success">active</span></td></tr><tr><td><label class="ns-check"><input type="checkbox" data-row-select="" aria-label="Select Northwind"></label></td><td>Northwind</td><td>Silver</td><td class="num">$7,300</td><td><span class="ns-dot ns-dot--error">error</span></td></tr><tr><td><label class="ns-check"><input type="checkbox" data-row-select="" aria-label="Select Globex"></label></td><td>Globex</td><td>Gold</td><td class="num">$19,850</td><td><span class="ns-dot ns-dot--success">active</span></td></tr></tbody>
</table></div><nav class="ns-pagination" style="justify-content:flex-end"><button class="ns-page" disabled="">‹</button><button class="ns-page" aria-current="page">1</button><button class="ns-page">2</button><button class="ns-page">›</button></nav></div>
```

**Rules**

- Search and filters sit above the table; active filters show as dismissible tags.
- Selecting rows replaces the toolbar with a batch action bar.
- Keep the header row sticky for long tables.

### Empty states

https://mikelrosenthal.com/northstar/#/patterns/empty-states

Empty states explain why there is nothing here and what to do next.

**Variants**

No accounts yet

Add your first account to start syncing data.

No matches

Try removing a filter or checking spelling.

Could not load

The service did not respond. Your data is safe.

### Loading

https://mikelrosenthal.com/northstar/#/patterns/loading

Choose the loading treatment by how long the wait is and how much of the page is affected.

**Choosing**

**Examples**

Example (Example):
```html
<div style="display:grid;gap:10px;width:260px"><div class="ns-skel" style="height:18px;width:50%"></div><div class="ns-skel" style="height:60px"></div></div><button class="ns-btn" aria-busy="true"><span class="ns-spin"></span>Saving</button><div class="ns-progress" style="width:240px"><div class="ns-progress__meta"><span>Importing 3 of 12</span><span>25%</span></div><div class="ns-progress__track"><div class="ns-progress__bar" style="--_v:25%"></div></div></div>
```

### Search and filter

https://mikelrosenthal.com/northstar/#/patterns/search-filter

Search narrows by keyword; filters narrow by attribute. Show both states clearly and make them easy to undo.

**Filter chips**

Example (Example):
```html
<div style="display:flex;gap:8px;flex-wrap:wrap"><span class="ns-tag ns-tag--blue">Region: EU<button aria-label="Remove Region: EU">×</button></span><span class="ns-tag ns-tag--blue">Status: Active<button aria-label="Remove Status: Active">×</button></span><button class="ns-btn ns-btn--ghost ns-btn--sm">Clear all</button></div>
```

**Rules**

- Filter results live as people choose; do not require an Apply button for fewer than 5 filters.
- Show a result count after every change, announced in a live region.
- Global search lives in the header and opens with ⌘K or /.

### Errors

https://mikelrosenthal.com/northstar/#/patterns/errors

Good errors say what happened, why, and how to fix it, at the level where the problem happened.

**Levels**

**Error pages**

Page not found

The link may be old or mistyped.

Something broke

We have been alerted. Try again in a minute.

No access

Ask a workspace admin for the Account Viewer role.

### Production patterns

https://mikelrosenthal.com/northstar/#/patterns/production

Production-ready UI patterns, states, and system specifications from the Figma Patterns page.

**Modal dialog**

Example (Pattern / Modal Dialog):
```html
<div class="ns-modal ns-modal--inline" role="dialog" aria-labelledby="pp-m" style="--_w:612px"><div class="ns-modal__head"><div><span class="ns-badge ns-badge--negative ns-badge--sm" style="margin-bottom:10px">Destructive</span><h2 class="ns-modal__title" id="pp-m">Confirm Destructive Action</h2></div></div><div class="ns-modal__body">This action cannot be undone. This will permanently delete the selected database nodes and terminate active routing tunnels.</div><div class="ns-modal__foot"><button class="ns-btn ns-btn--ghost">Cancel</button><button class="ns-btn ns-btn--danger">Confirm Purge</button></div></div>
```
Usage: use for high-impact confirmation flows. Trigger only via primary buttons.

**Alerts and toasts**

Example (Pattern / Toast Stack):
```html
<div style="display:grid;gap:12px;width:100%;max-width:612px"><div class="ns-alert ns-alert--warning"><span class="ns-alert__icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 9v4m0 4h.01M10.3 3.9 2.4 18a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"></path></svg></span><div><p class="ns-alert__title">Inbound Network Traffic Anomaly</p><p class="ns-alert__desc">Cluster US-EAST showing 400% spikes. Automatic scaling triggered.</p></div><div class="ns-alert__end"><button class="ns-alert__close" aria-label="Dismiss">×</button></div></div><div class="ns-notice ns-notice--toast ns-notice--success" style="justify-self:end"><span class="ns-notice__icon">✓</span><div><p class="ns-notice__title">Deployment Successful</p><p class="ns-notice__body">Node-04 online · 12ms</p></div><button class="ns-notice__close" aria-label="Dismiss">×</button></div></div>
```

**Data table states**

Example (Pattern / Data Table):
```html
<div class="ns-table-wrap" style="width:100%"><table class="ns-table"><thead><tr><th>Node ID</th><th>Routing endpoint</th><th>Status</th><th class="num">Load</th></tr></thead><tbody><tr><td style="font-family:var(--ns-font-mono)">NS-0091</td><td>api.us-east.northstar.dev</td><td><span class="ns-dot ns-dot--success">Healthy</span></td><td class="num" style="color:var(--ns-status-success)">22.4%</td></tr><tr><td style="font-family:var(--ns-font-mono)">NS-0092</td><td>db.eu-west.northstar.dev</td><td><span class="ns-dot ns-dot--error">Overloaded</span></td><td class="num" style="color:var(--ns-status-error)">94.8%</td></tr></tbody></table><div class="ns-table-bar" style="border-top:1px solid var(--ns-border-subtle);border-bottom:0"><span class="ns-helper">Showing 1-2 of 48 resources</span><span style="display:flex;gap:8px"><button class="ns-btn ns-btn--sm ns-btn--outline" disabled="">Prev</button><button class="ns-btn ns-btn--sm ns-btn--outline">Next</button></span></div></div>
```

**System indicators**

Example (Pattern / System Indicators):
```html
<div class="ns-card" style="width:352px;grid-template-columns:1fr 1fr;display:grid;gap:18px"><div><span class="ns-kpi__label">Active channels</span><div style="font:800 26px/1.2 var(--ns-font-sans);">14,809</div></div><div><span class="ns-kpi__label">Alerts</span><div style="font:800 26px/1.2 var(--ns-font-sans);color:var(--ns-status-error)">03</div></div><div><span class="ns-kpi__label">CPU efficiency</span><div style="font:800 26px/1.2 var(--ns-font-sans);color:var(--ns-text-accent)">98.2%</div></div></div>
```
Fixed from the Figma frame
In the Figma frame the Alerts value overlaps the text "of 48 resources". Here each indicator gets its own grid cell.

**Feedback and placeholders**

Example (Pattern / Empty State):
```html
<div style="display:grid;grid-template-columns:200px 1fr;gap:24px;align-items:center;width:100%;max-width:612px"><div style="display:grid;gap:8px"><div class="ns-skel" style="height:14px;width:60%"></div><div class="ns-skel" style="height:56px"></div><div class="ns-skel" style="height:10px"></div></div><div><h3 style="margin:0 0 6px;font:700 16px/1.3 var(--ns-font-sans)">No active tunnels discovered</h3><p style="margin:0 0 12px;color:var(--ns-text-secondary);font-size:14px">Deploy a northstar routing agent to initialize system streams.</p><button class="ns-btn ns-btn--sm">Deploy agent</button></div></div>
```

**Navigation and breadcrumbs**

Example (Pattern / Breadcrumb Navigation):
```html
<div style="display:grid;gap:14px;width:100%;max-width:612px"><ol class="ns-breadcrumb"><li><a href="#/">Cluster Root</a></li><li><a href="#/">US-EAST</a></li><li aria-current="page">NS-0091</li></ol><div class="ns-tabs" role="tablist"><button class="ns-tab" role="tab" aria-selected="true">Label 1</button><button class="ns-tab" role="tab" aria-selected="false">Label 2</button></div><label class="ns-check ns-check--radio"><input type="radio" checked=""> Use persistent socket connections</label></div>
```

**Input component states**

Example (Pattern / Field Group):
```html
<div style="display:flex;gap:16px;flex-wrap:wrap;align-items:end"><div class="ns-field" style="width:260px"><label class="ns-label">Default endpoint value</label><input class="ns-input ns-input--md" value="https://api.northstar.dev"></div><div class="ns-field"><span class="ns-label">Routing target</span><div class="ns-dd" data-dd=""><button class="ns-dd__trigger" aria-haspopup="listbox" aria-expanded="false">us-east-1<span class="caret"></span></button><ul class="ns-dd__menu" role="listbox"><li><button class="ns-dd__item" role="option" aria-selected="true">us-east-1</button></li><li><button class="ns-dd__item" role="option">eu-west-1</button></li></ul></div></div></div>
```

**Skeleton**

**Progress indicator**

### Create account workflow

https://mikelrosenthal.com/northstar/#/patterns/create-account

A composed form showing entry, actionable validation and a success outcome on one surface. Synced from the Figma workflow showcase; all account values are demo data.

NORTHSTAR DS / COMPOSED WORKFLOW · 06 · Reviewed 04 Oct 2026
Open the workflow showcase in Figma ↗

**Form states**

Default, validation error and success, rebuilt with live NorthStar components. Tier uses the native Select, as the online forms pattern does.
Default · demo data

Create account

Add an account and set its billing preferences.
Required fields are marked *. Cancel leaves without creating an account; persistence rules require application decisions.
Validation error · demo data

Create account

Add an account and set its billing preferences.
Account not created
Check Billing email. Enter a complete address, then create the account again.
Required fields are marked *. Cancel leaves without creating an account; persistence rules require application decisions.
Success · demo data

Create account

Add an account and set its billing preferences.
Account created · demo outcome
Atlas Works is ready. Billing email and Growth tier are saved in this illustrative state.
Proposed success behavior: prevent duplicate submit while preserving the result. Next action: open the account record.

**01 Entry → validation recovery**

Evidence boundary
Online validation messages are example content, not verified server submission. These are composed design states, not a functioning prototype. No prototype interactions have been authored.

**02 Success / preserve the outcome**

ANNOTATED WALKTHROUGH · proposed application behavior

**03 Tier / composed options handoff**

DEMO OPTIONS · open composition
Figma specimen · Account tier options (Menu instance, 200x174)Menu with four overridden demo options: 'Starter', 'Growth', 'Enterprise', 'Custom' (14px, gray/1 #d0d0da). Container bg gray/9 #0f0f13, padding 4, gap 2, radius 8; first-row hover shown.
The actual Menu instance uses four overridden demo options. Its first-row hover is not a selected-value indicator. The form trigger text is Growth; open / selection controller behavior is proposed, not an existing Figma variant.
Deliberate difference from the online form
NorthStar’s forms pattern uses a native Select for Tier, not the custom Dropdown. This showcase uses the current Figma Dropdown recipe to demonstrate composition. Retain native Select online until the custom keyboard and ARIA gates are met.
https://mikelrosenthal.com/northstar/#/patterns/forms

**04 Handoff / property mapping**

No package, exporter, CI or submission service was verified. Form-state orchestration belongs to the application; @northstar/react examples remain advertised only.

**05 Accessibility / release acceptance**

- Names: associate Company name, Billing email, Tier and Send welcome kit labels with controls; helper and error IDs remain stable.
- Keyboard: logical field → preference → actions order. Custom Tier needs Arrow navigation, selection, Escape close, focus return and accurate aria-expanded.
- Validation: preserve entered values, show an actionable email message, link summary to invalid field and specify focus behavior after submit; avoid duplicate announcements.
- Feedback: status is polite by default; assertive only for urgent dynamic alerts. Banner appearance alone does not move focus; dismissal must actually remove it.
- Responsive: stack fields and actions when needed; retain recovery copy at 200% zoom and in long translations / RTL. Validate contrast, target size and forced colors.
- Before release: manual keyboard / screen-reader and visual tests, real submission / failure evidence, duplicate-submit policy and assigned owners. All gates remain required.
Ownership / status
Design, engineering, accessibility and release owners: Unassigned. Status: Source-reviewed / Partial parity. This static showcase does not change the website or deployment.
NORTHSTAR DS is the linked Figma library. NorthStar is the online documentation name. · Required before release

## Floorplan detail

### Dashboard

https://mikelrosenthal.com/northstar/#/floorplans/dashboard

KPI tiles, trend, mix, and an account table. One job per tile.

Good morning, Alex

Total earning
Total earning
Efficiency
Overall trend
Foundations

**Built from**

Side navigation, data table, KPI tiles, tabs, notifications, buttons, tags, and badges. Every value is a token, so the whole floorplan follows theme and token edits.

### Analytical list

https://mikelrosenthal.com/northstar/#/floorplans/analytical-list

Filter bar, sortable table, bulk actions, and pagination for working through many records.

All accounts

**Built from**

Side navigation, data table, KPI tiles, tabs, notifications, buttons, tags, and badges. Every value is a token, so the whole floorplan follows theme and token edits.

### Object detail

https://mikelrosenthal.com/northstar/#/floorplans/object-detail

Object header with status and actions, tab strip, and structured detail sections.

- Accounts
- Acme Corp

Acme Corp

CRM sync complete
2 hours ago
API quota at 85%
Yesterday

**Built from**

Side navigation, data table, KPI tiles, tabs, notifications, buttons, tags, and badges. Every value is a token, so the whole floorplan follows theme and token edits.

### Guided wizard

https://mikelrosenthal.com/northstar/#/floorplans/wizard

A five-step progress rail, one task per step, validation before moving on, and clear back and next.

Connect a data source

- DetailsDone
- SourceDone
- CredentialsCurrent
- Mapping
- Review

Credentials

**Built from**

Side navigation, data table, KPI tiles, tabs, notifications, buttons, tags, and badges. Every value is a token, so the whole floorplan follows theme and token edits.

### Approval queue

https://mikelrosenthal.com/northstar/#/floorplans/approval-queue

Risk meters, flag badges, and accept or reject actions for fast, careful review.

37 requests waiting

**Built from**

Side navigation, data table, KPI tiles, tabs, notifications, buttons, tags, and badges. Every value is a token, so the whole floorplan follows theme and token edits.

### Learner progress

https://mikelrosenthal.com/northstar/#/floorplans/learner-progress

A cohort at a glance: completion, activity, goal progress, streaks and who needs attention. One job per tile.

Spring cohort

Share of assigned units finished
Opened a course in the last 7 days
Median across the cohort
- Video
- Reading
- Practice
- Review
- Weekly goal80%
- Skills62%
- Practice45%
- Review30%
Longest streak: 6 days
- Current phase
- Planned

**Built from**

Side navigation, data table, KPI tiles, tabs, notifications, buttons, tags, and badges. Every value is a token, so the whole floorplan follows theme and token edits.

### Enrollment health

https://mikelrosenthal.com/northstar/#/floorplans/enrollment-health

Where enrollment narrows, which stages need attention, and which enrollments have stalled. One job per tile.

This quarter

- Visit to signup78%
- Signup to trial72%
- Trial to paid68%
- Paid to active58%
Paid to active is the narrowest step.
From first visit
Still learning after a month
Trial to paid is slower than last month
Fewer trials reached a paid plan in the last 14 days.
- VisitsHealthy
- SignupsHealthy
- TrialWatch
- PaidAt risk
- Before
- After

**Built from**

Side navigation, data table, KPI tiles, tabs, notifications, buttons, tags, and badges. Every value is a token, so the whole floorplan follows theme and token edits.

