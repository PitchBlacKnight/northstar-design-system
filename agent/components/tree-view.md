# Tree view (New)

> NorthStar component. Category: Navigation. Rules for every component are in https://mikelrosenthal.com/northstar/agent/northstar.md.

Browses a hierarchy such as account, location and device. Each level indents 20px. Parents expand and collapse, and leaves keep the chevron space so labels line up.

Page: https://mikelrosenthal.com/northstar/#/components/tree-view · Figma node 4466:335

Classes: `is-leaf`, `ns-tree`, `ns-tree__chev`, `ns-tree__count`, `ns-tree__row`

Figma variants: Depth: Up to four levels; Row: Collapsed, Expanded, Leaf; State: Default, Hover, Selected, Focus

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

## Variants

### Expanded

A parent open, with its children visible and one selected.

```html
<ul class="ns-tree" role="tree" aria-label="Locations" style="width:320px"><li role="none"><div class="ns-tree__row" role="treeitem" aria-level="1" aria-expanded="true" aria-selected="false" style="--ns-tree-level:0"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg><span>Acme Corp</span><span class="ns-tree__count">2</span></div><ul role="group"><li role="none"><div class="ns-tree__row" role="treeitem" aria-level="2" aria-expanded="true" aria-selected="true" style="--ns-tree-level:1"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg><span>Chicago, IL</span><span class="ns-tree__count">2</span></div></li></ul></li></ul>
```

### Collapsed

The parent stays visible with its count, so the contents are known before opening.

```html
<ul class="ns-tree" role="tree" aria-label="Locations" style="width:320px"><li role="none"><div class="ns-tree__row" role="treeitem" aria-level="1" aria-expanded="false" aria-selected="false" style="--ns-tree-level:0"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg><span>Acme Corp</span><span class="ns-tree__count">2</span></div></li></ul>
```

Tokens: `--ns-background-hover` (Row hover), `--ns-background-selected` (Selected row), `--ns-text-tertiary` (Chevron and count), `--ns-focus-field` (Focus ring)

Props (for a component wrapper):
- items: { id, label, count, children }[], default []. Nested nodes
- expanded: string[], default []. Expanded node ids
- selected: string, default -. Selected node id
- onSelect: (id) => void, default -. Called when a node is activated

Keyboard: Arrow down / up: Moves to the next or previous visible row; Arrow right: Expands a parent, or moves into its first child; Arrow left: Collapses a parent, or moves to its parent; Enter: Selects the focused row

Accessibility:
- The list has role=tree with a name. Each row is a treeitem with aria-level.
- Parents set aria-expanded. Children sit in a group inside the parent.
- The selected row sets aria-selected=true.

