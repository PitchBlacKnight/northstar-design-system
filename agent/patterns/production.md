# Production patterns

> NorthStar pattern. https://mikelrosenthal.com/northstar/#/patterns/production

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
