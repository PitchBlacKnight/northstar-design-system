# Progress (Stable)

> NorthStar component. Category: Status. Rules for every component are in https://mikelrosenthal.com/northstar/agent/northstar.md.

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

## Variants

### Colors

Semantic bars.

```html
<div style="display:grid;gap:12px;width:260px"><div class="ns-progress__track"><div class="ns-progress__bar" style="--_v:70%"></div></div><div class="ns-progress ns-progress--purple"><div class="ns-progress__track"><div class="ns-progress__bar" style="--_v:30%"></div></div></div><div class="ns-progress ns-progress--warning"><div class="ns-progress__track"><div class="ns-progress__bar" style="--_v:85%"></div></div></div></div>
```

Tokens: `--ns-interactive-primary` (Bar fill), `--ns-border-default` (Track), `--ns-duration-slow` (Fill transition), `--ns-background-elevated` (Skeleton base)

Props (for a component wrapper):
- value: number, default -. 0 to 100; omit for indeterminate
- label: string, default -. Accessible label
- kind: 'bar' | 'ring' | 'steps', default 'bar'. Type
- kind (Loading): 'skeleton' | 'spinner', default 'skeleton'. Type

Keyboard: -: Not interactive

Accessibility:
- Use role="progressbar" with value attributes; omit values when indeterminate.
- Step indicators mark the current step with aria-current="step".
- Loading: Containers set aria-busy="true" while loading.
- Loading: Spinners use role="status" with a label.

Notes for agents:
- The bar value is the inline hook --_v on ns-progress__bar (a percentage). For a count, put both labels in ns-progress__meta, for example Seats used and 12 of 15, and set aria-valuenow and aria-valuemax to the real numbers.

