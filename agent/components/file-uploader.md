# File uploader (New)

> NorthStar component. Category: Inputs. Rules for every component are in https://mikelrosenthal.com/northstar/agent/northstar.md.

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

Tokens: `--ns-border-strong` (Drop zone border), `--ns-interactive-primary` (Drag-over border and tint), `--ns-status-error` (Invalid file)

Props (for a component wrapper):
- accept: string[], default -. MIME types
- maxSize: number, default -. Bytes
- multiple: boolean, default false. Multi-file
- onUpload: (files) => void, default -. Handler

Keyboard: Tab: Focus the drop zone; Enter / Space: Open the file browser

Accessibility:
- The drop zone wraps a real file input, so keyboard and screen reader users never need drag-and-drop.
- Announce upload completion through a live region.

