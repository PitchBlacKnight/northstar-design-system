# Chat (New)

> NorthStar component. Category: Containers. Rules for every component are in https://mikelrosenthal.com/northstar/agent/northstar.md.

A conversation surface for an AI assistant or support agent. A header names who is answering, the log holds alternating user and assistant messages, and the composer sends the next one. The docs site uses it for Ask NorthStar, bottom right.

Page: https://mikelrosenthal.com/northstar/#/components/chat · Figma node 4759:60

Classes: `ns-btn`, `ns-btn--square`, `ns-chat`, `ns-chat__bubble`, `ns-chat__composer`, `ns-chat__head`, `ns-chat__log`, `ns-chat__meta`, `ns-chat__msg`, `ns-chat__msg--bot`, `ns-chat__msg--user`, `ns-chat__suggest`, `ns-chat__title`, `ns-chat__typing`, `ns-chat__who`, `ns-tag`, `ns-tag--sm`, `ns-textarea`

Figma variants: Message: User, Assistant, Error; State: Empty with suggestions, Conversation, Thinking; Placement: Inline panel, Floating panel

Use:
- Use for an assistant that answers open questions in plain language.
- Use for support threads where both sides write turns.
- Offer two to four suggestions in the empty state so users know what to ask.

Avoid:
- Do not use for a single command or search. Use the command palette.
- Do not use for system status. Use a notification or alert.
- Do not hide that the answers are generated.

- Do: Label the log and announce new replies through a polite live region.
- Do not: A log with no name and no live region is silent to screen readers.

```html
<div class="ns-chat" style="width:100%;max-width:360px;height:380px"><div class="ns-chat__head"><h3 class="ns-chat__title">Ask NorthStar</h3><span class="ns-chat__meta">Answers from the docs</span></div><div class="ns-chat__log" role="log" aria-label="Conversation" aria-live="polite"><div class="ns-chat__msg ns-chat__msg--user"><div class="ns-chat__bubble">Which button should I use to delete an account?</div></div><div class="ns-chat__msg ns-chat__msg--bot"><span class="ns-chat__who">NorthStar</span><div class="ns-chat__bubble">Use the <code>ns-btn--danger</code> button, and confirm in a modal that names the account.</div></div></div><div class="ns-chat__composer"><textarea class="ns-textarea" rows="1" placeholder="Ask a question" aria-label="Message"></textarea><button class="ns-btn ns-btn--square" type="button" aria-label="Send"><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false"><path d="M4 12h13M12 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button></div></div>
```

## Variants

### Conversation

User turns on the right in the primary color, assistant turns on the left.

```html
<div class="ns-chat" style="width:100%;max-width:360px;height:380px"><div class="ns-chat__head"><h3 class="ns-chat__title">Ask NorthStar</h3><span class="ns-chat__meta">Answers from the docs</span></div><div class="ns-chat__log" role="log" aria-label="Conversation" aria-live="polite"><div class="ns-chat__msg ns-chat__msg--user"><div class="ns-chat__bubble">Which button should I use to delete an account?</div></div><div class="ns-chat__msg ns-chat__msg--bot"><span class="ns-chat__who">NorthStar</span><div class="ns-chat__bubble">Use the <code>ns-btn--danger</code> button, and confirm in a modal that names the account.</div></div></div><div class="ns-chat__composer"><textarea class="ns-textarea" rows="1" placeholder="Ask a question" aria-label="Message"></textarea><button class="ns-btn ns-btn--square" type="button" aria-label="Send"><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false"><path d="M4 12h13M12 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button></div></div>
```

### Empty

Suggestions in the empty state.

```html
<div class="ns-chat" style="width:100%;max-width:360px;height:380px"><div class="ns-chat__head"><h3 class="ns-chat__title">Ask NorthStar</h3><span class="ns-chat__meta">Answers from the docs</span></div><div class="ns-chat__log" role="log" aria-label="Conversation" aria-live="polite"><div class="ns-chat__msg ns-chat__msg--bot"><span class="ns-chat__who">NorthStar</span><div class="ns-chat__bubble">Ask about components, tokens or patterns.</div></div><div class="ns-chat__suggest"><button class="ns-tag ns-tag--sm" type="button">Which token is the focus ring?</button><button class="ns-tag ns-tag--sm" type="button">When do I use a toast?</button></div></div><div class="ns-chat__composer"><textarea class="ns-textarea" rows="1" placeholder="Ask a question" aria-label="Message"></textarea><button class="ns-btn ns-btn--square" type="button" aria-label="Send"><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false"><path d="M4 12h13M12 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button></div></div>
```

### Thinking

Typing indicator before the reply streams in.

```html
<div class="ns-chat" style="width:100%;max-width:360px;height:380px"><div class="ns-chat__head"><h3 class="ns-chat__title">Ask NorthStar</h3><span class="ns-chat__meta">Answers from the docs</span></div><div class="ns-chat__log" role="log" aria-label="Conversation" aria-live="polite"><div class="ns-chat__msg ns-chat__msg--user"><div class="ns-chat__bubble">Which button should I use to delete an account?</div></div><div class="ns-chat__msg ns-chat__msg--bot"><span class="ns-chat__who">NorthStar</span><div class="ns-chat__bubble"><span class="ns-chat__typing" aria-label="NorthStar is thinking"><i></i><i></i><i></i></span></div></div></div><div class="ns-chat__composer"><textarea class="ns-textarea" rows="1" placeholder="Ask a question" aria-label="Message"></textarea><button class="ns-btn ns-btn--square" type="button" aria-label="Send"><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false"><path d="M4 12h13M12 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button></div></div>
```

Tokens: `--ns-interactive-primary` (User message fill), `--ns-background-secondary` (Assistant message fill), `--ns-status-error-bg` (Error message fill), `--ns-border-subtle` (Header and composer dividers), `--ns-radius-md` (Message corners)

Props (for a component wrapper):
- title: string, default -. Who is answering. Required
- messages: { role: 'user' | 'assistant'; content: string }[], default []. The conversation
- suggestions: string[], default []. Shown when there are no messages
- thinking: boolean, default false. Shows the typing indicator
- onSend: (text: string) => void, default -. Called with the composer text

Keyboard: Enter: Sends the message; Shift + Enter: Adds a new line; Escape: Closes a floating panel and returns focus to its launcher

Accessibility:
- The log has role=log, an accessible name and aria-live=polite, so streamed replies are read once they settle.
- The composer textarea has a label. The send button has aria-label=Send.
- A floating panel is role=dialog with aria-labelledby on its title. The launcher sets aria-expanded.

