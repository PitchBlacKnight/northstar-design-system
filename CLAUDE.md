# NorthStar: instructions for agents

NorthStar is a design system for dense, data-heavy enterprise consoles. This repo is its docs site (static, hash-routed, no build step) and its agent surface.

## Read first

- `agent/northstar.md`: the build rules, components, tokens and page templates. Treat every Avoid line as a hard limit.
- `agent/components.json` and `agent/tokens.json`: the same catalog as data.
- `STYLE-RULES.md`: color roles, surfaces, shape, focus and type. These are the design rules.
- `DECISIONS.md`: why things are the way they are.

## Sources of truth

- Figma file `VZxmDNQiosTN6gqnvEQ65Z` (NORTHSTAR DS). Variables carry Web code syntax, so Dev Mode and the Figma MCP show `var(--ns-...)` names. Component descriptions name the `ns-` classes and link to the docs page.
- `css/tokens.css` and `css/components.css`: the shipped styles. No raw hex, px or font values inside a component where a token exists.
- `js/components.js`: one entry per component drives nav, search, docs tabs and `agent/*`. Do not edit `agent/*` by hand; `tools/agent-export.mjs` regenerates it.

## How work flows

- **Code first.** Change the site, preview with `python3 -m http.server 8910`, and sync to Figma later in a batch, only when asked.
- **Checks.** `node tools/check-all.mjs` before any publish. The pre-commit hook runs the checks the staged files touch.
- **Branches.** Publish from `main`. `northstar-product` is old; do not cut work from it.
- **Publishing** (rsync to the live site folder and deploy) follows the README. It happens only when asked.

## Stop and ask before

1. Any change to the token mapping or a new token.
2. The first component of a new batch, compared with Figma in light and dark.
3. Anything that leaves this computer: a push, a deploy, a Figma publish.
4. Deleting Figma nodes, styles or variables. Archive or hide them instead.
