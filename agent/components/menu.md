# Menu (New)

> NorthStar component. Category: Actions. Rules for every component are in https://mikelrosenthal.com/northstar/agent/northstar.md.

A list of actions that opens from a trigger, such as a row's more button. Use it for secondary actions. Keep primary actions out of the menu, and put destructive actions last.

Page: https://mikelrosenthal.com/northstar/#/components/menu · Figma node 4466:90

Classes: `is-destructive`, `ns-menu`, `ns-menu--panel`, `ns-menu__sep`

Figma variants: Item: Label, Icon, Shortcut, Type; Type: Default, Destructive; State: Default, Hover, Focus, Disabled

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

## Variants

### Basic

Edit, duplicate and archive. A disabled item stays visible so people know it exists.

```html
<div class="ns-menu ns-menu--panel" role="menu" aria-label="Row actions" style="width:240px"><button role="menuitem">Edit details<kbd>⌘E</kbd></button><button role="menuitem">Duplicate</button><button role="menuitem" aria-disabled="true">Archive</button></div>
```

### Destructive

A divider, then the destructive action last.

```html
<div class="ns-menu ns-menu--panel" role="menu" aria-label="Row actions" style="width:240px"><button role="menuitem">Duplicate</button><div class="ns-menu__sep" role="separator"></div><button role="menuitem" class="is-destructive">Delete</button></div>
```

Tokens: `--ns-background-elevated` (Menu surface), `--ns-elevation-03` (Menu shadow), `--ns-background-hover` (Item hover), `--ns-status-error` (Destructive text)

Props (for a component wrapper):
- trigger: ReactNode, default -. Element that opens the menu
- items: { label, icon, shortcut, destructive, disabled }[], default []. Menu items in order
- onSelect: (id) => void, default -. Called with the chosen item

Keyboard: Enter / Space: Opens the menu from the trigger, or activates the focused item; Arrow up / down: Moves between items; Escape: Closes the menu and returns focus to the trigger

Accessibility:
- The trigger has aria-haspopup=menu and aria-expanded.
- The list uses role=menu and each item uses role=menuitem.
- Disabled items keep aria-disabled so screen readers can announce them.

