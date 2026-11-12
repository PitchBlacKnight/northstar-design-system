# Accordion (Stable)

> NorthStar component. Category: Containers. Rules for every component are in https://mikelrosenthal.com/northstar/agent/northstar.md.

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

Props (for a component wrapper):
- align: 'start' | 'end', default 'end'. Indicator side
- open: boolean, default false. Per item

Keyboard: Tab: Moves between headers; Enter / Space: Toggle section

Accessibility:
- Native <details>/<summary> exposes expanded state automatically.

