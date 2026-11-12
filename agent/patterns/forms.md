# Forms

> NorthStar pattern. https://mikelrosenthal.com/northstar/#/patterns/forms

Forms collect information. NorthStar forms are single-column by default, validate on blur, and summarize errors on submit.

**Single column**

Example (Create account):
```html
<form class="ns" style="display:grid;gap:18px;max-width:420px;width:100%" onsubmit="event.preventDefault();NS.toast('Account created','Acme Corp was added.','success')"><div class="ns-field"><label class="ns-label" for="f1">Company name</label><input class="ns-input" id="f1" required="" value="Acme Corp"></div><div class="ns-field is-error"><label class="ns-label" for="f2">Billing email</label><input class="ns-input" id="f2" value="billing@acme" aria-invalid="true" aria-describedby="f2h"><span class="ns-helper" id="f2h">Enter a full email address, like billing@acme.com</span></div><div class="ns-field"><label class="ns-label" for="f3">Tier</label><select class="ns-select" id="f3"><option>Gold</option><option>Silver</option></select></div><label class="ns-check"><input type="checkbox" checked=""> Send welcome kit</label><div style="display:flex;gap:10px"><button class="ns-btn">Create account</button><button type="button" class="ns-btn ns-btn--tertiary">Cancel</button></div></form>
```

**Validation**

**Layout**

One column, labels on top, in the order people think.
Put unrelated fields side by side. It breaks the reading path.
