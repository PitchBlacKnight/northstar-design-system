# Modal dialogs

> NorthStar pattern. https://mikelrosenthal.com/northstar/#/patterns/modal-dialogs

Use modal dialogs for decisions that must happen now. Everything else belongs in the page.

**Types**

**Live example**

Example (Danger modal with focus trap):
```html
<button class="ns-btn ns-btn--danger" data-open-modal="">Revoke credentials</button>
```

**Rules**

- One modal at a time. Never open a modal from a modal.
- Title says what will happen; primary button repeats the verb.
- Esc and the close button always work, except during a running save.
