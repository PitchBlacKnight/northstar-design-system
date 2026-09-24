# NorthStar Design System site

Carbon-style docs site for the NorthStar Design System. Static, no build step.

Source of truth: Figma file VZxmDNQiosTN6gqnvEQ65Z (page "00 Foundations" + site frames).

## Run

    python3 -m http.server 8910

Open http://localhost:8910. Hash routing, so any static host works.

## Files

- css/tokens.css      Primitives + semantic roles (dark default, light via data-theme)
- css/components.css  ns-* component classes, token-only values
- css/widgets.css     Graphics framework: widget shells, tables, informers
- css/site.css        Docs shell (header, side nav, TOC, playgrounds, tools)
- js/components.js    Component catalog: one entry drives Usage / Style / Code / Accessibility tabs
- js/widgets.js       Widget renderer + catalog of the Figma Widgets page (NS.widget, NS.hydrate)
- js/graphics.js      Graphics framework docs, widget gallery, family pages, board builder
- js/pages.js         Nav tree + foundations, patterns, data viz, floorplans, a11y, community
- js/tools.js         Token editor, Live Builder, Claude AI generator, embed helper
- js/app.js           Router, search palette, TOC scrollspy, theme, embed mode

Add a component: append an entry to NS.COMPONENTS in js/components.js. Nav, search, index, and prev/next pick it up.

Icons: assets/icons/*.svg (95, exported from Figma Icons page, currentColor) + manifest.json.
