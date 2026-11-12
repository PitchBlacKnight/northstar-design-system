# Date picker (New)

> NorthStar component. Category: Inputs. Rules for every component are in https://mikelrosenthal.com/northstar/agent/northstar.md.

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

## Variants

### Calendar

Month grid with range fill.

```html
<div class="ns-cal" role="group" aria-label="September 2026"><div class="ns-cal__head"><button class="icon-btn" aria-label="Previous month">‹</button>September 2026<button class="icon-btn" aria-label="Next month">›</button></div><div class="ns-cal__grid"><span class="ns-cal__dow">Mo</span><span class="ns-cal__dow">Tu</span><span class="ns-cal__dow">We</span><span class="ns-cal__dow">Th</span><span class="ns-cal__dow">Fr</span><span class="ns-cal__dow">Sa</span><span class="ns-cal__dow">Su</span><button class="ns-cal__day is-muted" tabindex="-1">29</button><button class="ns-cal__day is-muted" tabindex="-1">30</button><button class="ns-cal__day is-muted" tabindex="-1">31</button><button class="ns-cal__day   ">1</button><button class="ns-cal__day   ">2</button><button class="ns-cal__day   ">3</button><button class="ns-cal__day   ">4</button><button class="ns-cal__day   ">5</button><button class="ns-cal__day   ">6</button><button class="ns-cal__day   ">7</button><button class="ns-cal__day   ">8</button><button class="ns-cal__day   ">9</button><button class="ns-cal__day  is-selected ">10</button><button class="ns-cal__day   is-range">11</button><button class="ns-cal__day   is-range">12</button><button class="ns-cal__day   is-range">13</button><button class="ns-cal__day   is-range">14</button><button class="ns-cal__day   is-range">15</button><button class="ns-cal__day  is-selected ">16</button><button class="ns-cal__day   ">17</button><button class="ns-cal__day   ">18</button><button class="ns-cal__day   ">19</button><button class="ns-cal__day   ">20</button><button class="ns-cal__day   ">21</button><button class="ns-cal__day   ">22</button><button class="ns-cal__day   ">23</button><button class="ns-cal__day is-today  ">24</button><button class="ns-cal__day   ">25</button><button class="ns-cal__day   ">26</button><button class="ns-cal__day   ">27</button><button class="ns-cal__day   ">28</button><button class="ns-cal__day   ">29</button><button class="ns-cal__day   ">30</button><button class="ns-cal__day is-muted" tabindex="-1">1</button><button class="ns-cal__day is-muted" tabindex="-1">2</button></div></div>
```

Tokens: `--ns-background-elevated` (Calendar surface), `--ns-interactive-primary` (Selected day), `--ns-background-selected` (Range fill), `--ns-text-accent` (Today)

Props (for a component wrapper):
- mode: 'single' | 'range', default 'single'. Selection mode
- minDate / maxDate: Date, default -. Bounds
- onChange: (dates) => void, default -. Handler

Keyboard: Arrow keys: Move between days; Page up / down: Previous / next month; Enter: Select day; Esc: Close calendar

Accessibility:
- Calendar grid uses role="grid"; days are buttons with full date labels.
- The typed input is always available, so the calendar is never the only path.

