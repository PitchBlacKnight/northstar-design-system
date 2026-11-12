# Segmented control (New)

> NorthStar component. Category: Inputs. Rules for every component are in https://mikelrosenthal.com/northstar/agent/northstar.md.

Switches between two to five views of the same content. Exactly one segment is selected at a time, and arrow keys move the selection.

Page: https://mikelrosenthal.com/northstar/#/components/segmented-control · Figma node 4466:175

Classes: `ns-segmented`

Figma variants: Segments: 2 to 5; Icon: Optional, shown with the label; State: Default, Hover, Selected, Focus, Disabled

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

## Variants

### Default

Three views with one selected.

```html
<div class="ns-segmented" role="radiogroup" aria-label="View"><button role="radio" aria-checked="true" tabindex="0">Table</button><button role="radio" aria-checked="false" tabindex="-1">Board</button><button role="radio" aria-checked="false" tabindex="-1">Map</button></div>
```

### Disabled segment

A single segment can be disabled while the rest stay usable.

```html
<div class="ns-segmented" role="radiogroup" aria-label="Range"><button role="radio" aria-checked="true" tabindex="0">Day</button><button role="radio" aria-checked="false" tabindex="-1">Week</button><button role="radio" aria-checked="false" tabindex="-1" disabled aria-disabled="true">Year</button></div>
```

Tokens: `--ns-background-secondary` (Track), `--ns-background-elevated` (Selected segment), `--ns-text-primary` (Selected label), `--ns-focus-field` (Focus ring)

Props (for a component wrapper):
- items: { label, icon, disabled }[], default []. Two to five segments
- value: string, default -. Selected segment
- onChange: (value) => void, default -. Called when the selection changes

Keyboard: Tab: Moves focus into the selected segment and out of the group; Arrow left / right: Moves the selection to the previous or next segment

Accessibility:
- The group is a radiogroup with a name, such as View.
- Each segment is a radio with aria-checked. Only the selected segment is in the tab order.
- Disabled segments keep aria-disabled so screen readers can announce them.

