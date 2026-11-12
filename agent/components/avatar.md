# Avatar (Stable)

> NorthStar component. Category: Data. Rules for every component are in https://mikelrosenthal.com/northstar/agent/northstar.md.

Component for visual identification of users and companies.

Page: https://mikelrosenthal.com/northstar/#/components/avatar · Figma node 1747:21338

Classes: `ns-avatar`, `ns-avatar--16`, `ns-avatar--20`, `ns-avatar--24`, `ns-avatar--28`, `ns-avatar--32`, `ns-avatar--36`, `ns-avatar--40`, `ns-avatar--48`, `ns-avatar--64`, `ns-avatar--brand`, `ns-avatar--memoji`, `ns-avatar--more`, `ns-avatar--square`, `ns-avatar-group`

Figma variants: Shape: Round, Square; Content: Photo, Initials, Memoji; Size: 16, 20, 24, 28, 32, 36, 40, 48, 64; Status: Yes, No

Use:
- Ownership, assignees, and presence.

Avoid:
- Decoration with no meaning.

- Do: Fall back to initials when there is no photo.
- Do not: Show a question mark for unknown people.

```html
<span class="ns-avatar ns-avatar--64" data-status="online" role="img" aria-label="Alex Park, online">AP</span>
```

## Variants

### Sizes

Nine sizes.

```html
<span class="ns-avatar ns-avatar--16"></span><span class="ns-avatar ns-avatar--20"></span><span class="ns-avatar ns-avatar--24">AP</span><span class="ns-avatar ns-avatar--28">AP</span><span class="ns-avatar ns-avatar--32">AP</span><span class="ns-avatar ns-avatar--36">AP</span><span class="ns-avatar ns-avatar--40">AP</span><span class="ns-avatar ns-avatar--48">AP</span><span class="ns-avatar ns-avatar--64">AP</span>
```

### Shape + status

Round and square with presence.

```html
<span class="ns-avatar ns-avatar--48" data-status>AP</span><span class="ns-avatar ns-avatar--48 ns-avatar--square" data-status>AP</span><span class="ns-avatar ns-avatar--48 ns-avatar--memoji" style="--_m:var(--ns-status-info-bg)">👩‍🚀</span><span class="ns-avatar ns-avatar--48 ns-avatar--memoji ns-avatar--square" style="--_m:var(--ns-status-success-bg)">🧔</span>
```

### Group

Stacked with overflow count.

```html
<div class="ns-avatar-group"><span class="ns-avatar">AK</span><span class="ns-avatar ns-avatar--brand">BM</span><span class="ns-avatar">CJ</span><span class="ns-avatar ns-avatar--brand">DL</span><span class="ns-avatar ns-avatar--more">+12</span></div>
```

Tokens: `--ns-interactive-primary` (Initials fill), `--ns-status-success` (Online status dot (away: --ns-status-warning, busy: --ns-status-error)), `--ns-radius-full` (Round)

Props (for a component wrapper):
- name: string, default -. Used for initials and label
- src: string, default -. Photo
- shape: 'round' | 'square', default 'round'. Shape
- size: 16 ... 64, default 40. Size
- status: 'online' | 'away' | 'busy', default -. Presence

Keyboard: -: Not interactive unless wrapped in a button

Accessibility:
- Use role="img" with an aria-label that includes presence.

