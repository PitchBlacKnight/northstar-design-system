# Slider (Stable)

> NorthStar component. Category: Inputs. Rules for every component are in https://mikelrosenthal.com/northstar/agent/northstar.md.

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

## Variants

### With ticks

Labeled scale.

```html
<div style="width:260px"><input class="ns-slider" type="range" value="30" style="--_pct:30%" aria-label="Value"/><div class="ns-slider-ticks"><span>0</span><span>100</span></div></div>
```

Tokens: `--ns-interactive-primary` (Filled track and thumb ring), `--ns-border-default` (Empty track)

Props (for a component wrapper):
- min: number, default 0. Minimum
- max: number, default 100. Maximum
- step: number, default 1. Increment
- value: number, default -. Current value

Keyboard: Arrow keys: Move by one step; Page up / down: Move by 10 steps; Home / End: Jump to min / max

Accessibility:
- Native range input exposes aria-valuenow, min, and max.
- Add aria-valuetext when units matter, e.g. "60 percent".

