# Textarea (New)

> NorthStar component. Category: Inputs. Rules for every component are in https://mikelrosenthal.com/northstar/agent/northstar.md.

A multi-line text field for free text. It follows the same states as Input. Show a counter when the field has a hard limit, and let the field grow to about eight lines.

Page: https://mikelrosenthal.com/northstar/#/components/textarea · Figma node 4466:309

Classes: `is-error`, `ns-field`, `ns-helper`, `ns-label`, `ns-textarea`

Figma variants: State: Default, Hover, Focus, Error, Warning, Success, Disabled, Read only; Counter: Shown or hidden; Rows: Starts at three, grows to eight

Use:
- Use for free text longer than one line, such as notes or descriptions.
- Show a counter when there is a hard character limit.
- Let the field grow with the content up to about eight lines.

Avoid:
- Do not use for single values such as names or IDs. Use Input.
- Do not hide the limit until the user reaches it.
- Do not use placeholder text as the label.

- Do: Label above the field, limit shown below it.
- Do not: A placeholder used as the label disappears as soon as the user types.

```html
<div class="ns-field" style="width:360px"><label class="ns-label" for="pg-ta">Description</label><textarea class="ns-textarea" id="pg-ta" placeholder="Services, regions and size" maxlength="1000"></textarea><span class="ns-helper">0 / 1000</span></div>
```

## Variants

### Default

Three rows, with a counter below.

```html
<div class="ns-field" style="width:360px"><label class="ns-label">Company overview</label><textarea class="ns-textarea" aria-label="Company overview" placeholder="Services, regions and size" maxlength="1000"></textarea><span class="ns-helper">0 / 1000</span></div>
```

### Error

Error color on the border and the message.

```html
<div class="ns-field is-error" style="width:360px"><label class="ns-label">Company overview</label><textarea class="ns-textarea" aria-label="Company overview" aria-invalid="true" aria-describedby="ta-err"></textarea><span class="ns-helper" id="ta-err">Add a description to continue.</span></div>
```

Tokens: `--ns-border-default` (Default border), `--ns-focus-field` (Focus border and ring), `--ns-status-error` (Error border and message), `--ns-text-disabled` (Placeholder and disabled text)

Props (for a component wrapper):
- label: string, default -. Visible label. Required
- value: string, default ''. Controlled value
- maxLength: number, default -. Hard limit. Turns on the counter
- rows: number, default 3. Starting height in lines
- helper: string, default -. Hint or error message
- state: 'default' | 'error' | 'warning' | 'success' | 'disabled' | 'readonly', default 'default'. Visual and semantic state

Keyboard: Tab: Moves focus into and out of the field; Enter: Adds a new line. It does not submit the form

Accessibility:
- Associate the label with for and id.
- Link helper and error text with aria-describedby.
- Set aria-invalid=true on error. Announce the counter at the limit, not on every key press.

