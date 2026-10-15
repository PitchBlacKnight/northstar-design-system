/* Figma specification documents, synced from NORTHSTAR DS (VZxmDNQiosTN6gqnvEQ65Z) on 2026-10-15.
   Component specs feed the Spec tab; WORKFLOWS feed composed pattern pages. Regenerate with tools/figma-spec-extract.mjs, do not hand-edit. */
(function () {
  const NS = window.NS;
  NS.SPECS = {
 "button": {
  "nodeId": "4139:54738",
  "title": "Button",
  "category": "NORTHSTAR DS / COMPONENT SPECIFICATION · 01",
  "revision": "Reviewed 04 Oct 2026",
  "summary": "A property-driven action control for new work. The recommended Figma set and the legacy-shaped online API are documented separately, with migration decisions left explicit.",
  "meta": {
   "Review status": "Source-reviewed",
   "Parity status": "Partial parity (warning color status/warning #ffa63f)",
   "Owner": "Owner: Unassigned",
   "Evidence boundary": "Figma inspection + online source • not runtime / AT testing"
  },
  "sections": [
   {
    "nodeId": "4139:54750",
    "number": "01",
    "heading": "Purpose / when not to use",
    "blocks": [
     {
      "type": "note",
      "heading": "USE",
      "text": "Initiate a clear action such as Create account. Use one Primary action per decision area; Secondary, Outline and Ghost express supporting actions."
     },
     {
      "type": "note",
      "heading": "DO NOT USE",
      "text": "Do not use an action button for ordinary text navigation, a persistent on/off setting, or an unlabeled icon. Prefer a link, switch or named control."
     }
    ]
   },
   {
    "nodeId": "4139:54761",
    "number": "02",
    "heading": "Visual anatomy",
    "blocks": [
     {
      "type": "example",
      "label": "ACTUAL INSTANCE · Primary / Default / M",
      "description": "Button instance, Hierarchy=Primary, State=Default, Size=M, label property 'Create account', showLeadingIcon=true (plus glyph, 16px icon slot). Visual: bg interactive/primary #023aff, radius 8px, padding 16px x 9px, gap 8px, min-width 96px, label Inter Medium 14px/20px. Specimen card bg background/elevated #1e1e24, radius 10px, padding 16px."
     },
     {
      "type": "text",
      "text": "1 · Container: 8px corner radius; content-driven width with minimum width. 2 · Label: action verb + object; M uses 14px / 20px. 3 · Optional icon slots: leading and trailing visibility are booleans; current glyphs are plus marks."
     },
     {
      "type": "text",
      "text": "M primary / ghost: 38px • M secondary / outline: 40px"
     }
    ]
   },
   {
    "nodeId": "4139:54780",
    "number": "03",
    "heading": "Actual Figma API / defaults",
    "blocks": [
     {
      "type": "text",
      "text": "Button · set 4038:31741 · 60 variants. Variant axes are Hierarchy × State × Size; text and icon visibility are component properties."
     },
     {
      "type": "table",
      "columns": [
       "Property",
       "Actual values",
       "Default"
      ],
      "rows": [
       [
        "Hierarchy",
        "Primary · Secondary · Outline · Ghost",
        "Primary"
       ],
       [
        "State",
        "Default · Hover · Pressed · Disabled",
        "Default"
       ],
       [
        "Size",
        "M · S · L",
        "M"
       ],
       [
        "Label",
        "Text property",
        "Button"
       ],
       [
        "Show leading icon",
        "Boolean",
        "false"
       ],
       [
        "Show trailing icon",
        "Boolean",
        "false"
       ]
      ]
     },
     {
      "type": "note",
      "heading": "Legacy is not the recommended API",
      "text": "Set 1727:22959 has 640 variants. Content = Text / Icon right / Icon / Icon left / Icon left and right; State uses Clicked; Size includes XL; Shape = Square / Rounded. Defaults include XL and Square."
     }
    ]
   },
   {
    "nodeId": "4139:54817",
    "number": "04",
    "heading": "Visual variants / state matrix",
    "blocks": [
     {
      "type": "text",
      "text": "Actual M instances below: columns are Default → Hover → Pressed → Disabled. Size S and L are also existing variants."
     },
     {
      "type": "example",
      "label": "Button state matrix (rows Primary, Secondary, Outline, Ghost; columns Default, Hover, Pressed, Disabled)",
      "description": "16 Button instances, Size=M, default label 'Button', no icons. Row labels: Primary, Secondary, Outline, Ghost. Each cell 239x70."
     },
     {
      "type": "example",
      "label": "ACTUAL S / L",
      "description": "Button Size=S (80px wide min, 30px high Primary) and Size=L (112px min, 48px high Primary), Primary/Default."
     },
     {
      "type": "example",
      "label": "LEGACY ONLY · XL / Square",
      "description": "Legacy Button set (1727:22959) instance, Content=Text, Hierarchy=Primary, Shape=Square, Size=XL, State=Default, label 'Primary'; bg Persian Blue #3506EF (blue/700), padding 24px x 14px, radius 6px, Open Sans Bold 16px/24px white."
     },
     {
      "type": "note",
      "heading": "Proposed requirements, not existing variants",
      "text": "No Focus, Loading, icon-only, Shape or XL variant exists on the recommended set. Focus-visible treatment and async behavior require design and implementation decisions; no synthetic variant is shown."
     },
     {
      "type": "table",
      "columns": [
       "Hierarchy",
       "State",
       "Size",
       "Fill",
       "Border",
       "Label color / font",
       "Padding / gap / min-w",
       "Other"
      ],
      "rows": [
       [
        "Primary",
        "Default",
        "M",
        "interactive/primary #023aff",
        "none",
        "text/on-primary (white); Inter Medium 14/20 (inferred, block not parsed)",
        "16x9 / 8 / 96",
        "radius 8"
       ],
       [
        "Primary",
        "Hover",
        "M",
        "interactive/hover #3506ef",
        "none",
        "text/on-primary white",
        "16x9 / 8 / 96",
        ""
       ],
       [
        "Primary",
        "Pressed",
        "M",
        "interactive/pressed #991bfa",
        "none",
        "text/on-primary white",
        "16x9 / 8 / 96",
        ""
       ],
       [
        "Primary",
        "Disabled",
        "M",
        "interactive/disabled #2c2c35",
        "none",
        "text/secondary #d0d0da",
        "16x9 / 8 / 96",
        "opacity 64%"
       ],
       [
        "Secondary",
        "Default",
        "M",
        "background/surface #191932",
        "1px border/default #2c2c35",
        "text/primary white",
        "16x9 / 8 / 96",
        ""
       ],
       [
        "Secondary",
        "Hover",
        "M",
        "background/selected #2c2c35",
        "1px border/default #2c2c35",
        "text/primary white",
        "16x9 / 8 / 96",
        ""
       ],
       [
        "Secondary",
        "Pressed",
        "M",
        "background/surface #191932",
        "1px interactive/primary #023aff",
        "text/primary white",
        "16x9 / 8 / 96",
        ""
       ],
       [
        "Secondary",
        "Disabled",
        "M",
        "background/surface #191932",
        "1px border/default",
        "text/primary white",
        "16x9 / 8 / 96",
        "opacity 64%"
       ],
       [
        "Outline",
        "Default",
        "M",
        "none",
        "1px border/default #2c2c35",
        "text/primary white",
        "16x9 / 8 / 96",
        ""
       ],
       [
        "Outline",
        "Hover/Pressed",
        "M",
        "none",
        "1px interactive/primary #023aff",
        "text/primary white",
        "16x9 / 8 / 96",
        ""
       ],
       [
        "Outline",
        "Disabled",
        "M",
        "none",
        "1px border/default",
        "text/disabled #5b5b65",
        "16x9 / 8 / 96",
        "opacity 64%"
       ],
       [
        "Ghost",
        "Default",
        "M",
        "none",
        "none",
        "text/primary white",
        "16x9 / 8 / 96",
        ""
       ],
       [
        "Ghost",
        "Hover/Pressed",
        "M",
        "background/selected #2c2c35",
        "none",
        "text/primary white",
        "16x9 / 8 / 96",
        ""
       ],
       [
        "Ghost",
        "Disabled",
        "M",
        "none",
        "none",
        "text/disabled #5b5b65",
        "16x9 / 8 / 96",
        "opacity 64%"
       ],
       [
        "all",
        "all",
        "S",
        "same as M",
        "same as M",
        "same as M but Inter Medium 12/16",
        "12x7 / 6 / 80",
        "heights 30 (primary/ghost) / 32 (secondary/outline)"
       ],
       [
        "all",
        "all",
        "L",
        "same as M",
        "same as M",
        "same as M but Inter Medium 16/24",
        "20x12 / 8 / 112",
        "heights 48 / 50"
       ]
      ]
     }
    ]
   },
   {
    "nodeId": "4139:55058",
    "number": "05",
    "heading": "Current bindings / intended semantic mapping",
    "blocks": [
     {
      "type": "table",
      "columns": [
       "Observed Figma binding",
       "Intended implementation role",
       "Evidence / decision"
      ],
      "rows": [
       [
        "interactive/primary → hover → pressed",
        "--ns-interactive-primary → --ns-interactive-primary-hover → --ns-interactive-primary-active",
        "Name mapping observed; verify values per theme."
       ],
       [
        "interactive/disabled; text/disabled",
        "Unavailable surface / label",
        "Observed on sampled states; not accessibility approval."
       ],
       [
        "text/inverse; text/primary",
        "On-action / ordinary action label",
        "text/inverse on colored fills needs theme-specific contrast review."
       ],
       [
        "background/surface; background/selected; border/default",
        "Supporting action surface, hover fill, outline",
        "Semantic bindings observed; Dark surface values drift online."
       ]
      ]
     },
     {
      "type": "text",
      "text": "Observed bindings describe the library today. Intended CSS roles are a mapping contract, not evidence that an exporter or synchronization pipeline exists."
     }
    ]
   },
   {
    "nodeId": "4139:55084",
    "number": "06",
    "heading": "Accessibility contract",
    "blocks": [
     {
      "type": "checklist",
      "items": [
       "Use native <button>; Enter and Space activation is source-backed. Set type=\"submit\" for Create account and type=\"button\" for Cancel in form context.",
       "Require an accessible name matching the visible label; decorative icons stay out of the name. Native disabled blocks activation.",
       "Required before release: visible keyboard focus, 4.5:1 normal-text contrast and 3:1 meaningful UI contrast across themes; inspect text/inverse on colored fills.",
       "Validate target size / spacing, forced colors, logical tab order and screen-reader naming in the application. No tests are claimed passed."
      ]
     }
    ]
   },
   {
    "nodeId": "4139:55101",
    "number": "07",
    "heading": "Responsive / content rules",
    "blocks": [
     {
      "type": "text",
      "text": "Keep labels short and specific: “Create account”, not “OK”. Preserve label and icon spacing; do not shrink type to fit. Let actions wrap or stack on narrow layouts while retaining primary emphasis and reading order. Allow translated labels to expand; avoid clipping at 200% zoom. Visual height is not the complete hit-area contract. Reconcile the 38px / 40px M discrepancy before standardizing dimensions."
     }
    ]
   },
   {
    "nodeId": "4139:55106",
    "number": "08",
    "heading": "Implementation mapping / gaps / ownership",
    "blocks": [
     {
      "type": "table",
      "columns": [
       "Figma recommended",
       "NorthStar online source",
       "Parity / release decision"
      ],
      "rows": [
       [
        "Hierarchy; Size S / M / L",
        "Native button + CSS; hierarchy, size s / m / l",
        "Online mirrors legacy axes; no full recommended parity."
       ],
       [
        "Pressed",
        "Clicked / is-pressed",
        "Translate name explicitly."
       ],
       [
        "Label; icon booleans",
        "Content; presence of iconLeft / iconRight",
        "Map booleans to optional icons; do not infer icon-only API."
       ],
       [
        "M observed 38 / 40px",
        "S36 / M40 / L48 / XL52px; shape rounded / square",
        "P1: reconcile dimensions and migration; XL / shape remain legacy."
       ]
      ]
     },
     {
      "type": "note",
      "heading": "Partial parity · owners Unassigned",
      "text": "Assign design and engineering owners for the recommended API and size consistency; accessibility owner for contrast and focus acceptance. Application actions are illustrative. @northstar/react and @northstar/tokens are advertised, but availability and behavior were not verified."
     },
     {
      "type": "note",
      "heading": "NORTHSTAR v1.4.0 • complete reference routes",
      "text": "https://mikelrosenthal.com/northstar/#/components/button\nhttps://mikelrosenthal.com/northstar/#/components/button/usage\nhttps://mikelrosenthal.com/northstar/#/components/button/style\nhttps://mikelrosenthal.com/northstar/#/components/button/code\nhttps://mikelrosenthal.com/northstar/#/components/button/accessibility"
     }
    ]
   },
   {
    "nodeId": "4038:31741",
    "number": "09",
    "heading": "Recommended component set",
    "blocks": [
     {
      "type": "text",
      "text": "Recommended property-driven button set. Hierarchy, state, and size remain variants; label and leading/trailing icons are exposed as component properties to avoid variant explosion."
     },
     {
      "type": "note",
      "heading": "Legacy set",
      "text": "The original Button set (1727:22959) is kept for backward compatibility. New work uses Button, which replaces content and shape variants with component properties."
     },
     {
      "type": "table",
      "columns": [
       "Property",
       "Type",
       "Values",
       "Default"
      ],
      "rows": [
       [
        "Hierarchy",
        "variant",
        "Primary · Secondary · Outline · Ghost",
        "Primary"
       ],
       [
        "State",
        "variant",
        "Default · Hover · Pressed · Disabled",
        "Default"
       ],
       [
        "Size",
        "variant",
        "M · S · L",
        "M"
       ],
       [
        "Label",
        "text",
        "string",
        "Button"
       ],
       [
        "Show leading icon",
        "boolean",
        "true/false",
        "false"
       ],
       [
        "Show trailing icon",
        "boolean",
        "true/false",
        "false"
       ]
      ]
     },
     {
      "type": "text",
      "text": "60 variants named 'Hierarchy=X, State=Y, Size=Z' (4x5x3), ids 4038:31357 to 4038:31733. Icon slot: 16x16 plus glyph (two rounded 1px rects 10x2 and 2x10), colored to match label. All variants: radius 8px, Inter Medium label."
     },
     {
      "type": "table",
      "columns": [
       "Size",
       "Min width",
       "Padding (x,y)",
       "Gap",
       "Label font",
       "Heights (Primary/Ghost; Secondary/Outline)"
      ],
      "rows": [
       [
        "S",
        "80",
        "12,7",
        "6",
        "Inter Medium 12/16",
        "30; 32"
       ],
       [
        "M",
        "96",
        "16,9",
        "8",
        "Inter Medium 14/20",
        "38; 40"
       ],
       [
        "L",
        "112",
        "20,12",
        "8",
        "Inter Medium 16/24",
        "48; 50"
       ]
      ]
     },
     {
      "type": "table",
      "columns": [
       "Hierarchy",
       "State",
       "Fill",
       "Border (1px)",
       "Label color",
       "Opacity"
      ],
      "rows": [
       [
        "Primary",
        "Default",
        "interactive/primary #023aff",
        "-",
        "text/on-primary (white)",
        "100"
       ],
       [
        "Primary",
        "Hover",
        "interactive/hover #3506ef",
        "-",
        "text/on-primary white",
        "100"
       ],
       [
        "Primary",
        "Pressed",
        "interactive/pressed #991bfa",
        "-",
        "text/on-primary white",
        "100"
       ],
       [
        "Primary",
        "Disabled",
        "interactive/disabled #2c2c35",
        "-",
        "text/secondary #d0d0da",
        "64%"
       ],
       [
        "Secondary",
        "Default",
        "background/surface #191932",
        "border/default #2c2c35",
        "text/primary white",
        "100"
       ],
       [
        "Secondary",
        "Hover",
        "background/selected #2c2c35",
        "border/default",
        "text/primary white",
        "100"
       ],
       [
        "Secondary",
        "Pressed",
        "background/surface",
        "interactive/primary #023aff",
        "text/primary white",
        "100"
       ],
       [
        "Secondary",
        "Disabled",
        "background/surface",
        "border/default",
        "text/primary white",
        "64%"
       ],
       [
        "Outline",
        "Default",
        "none",
        "border/default",
        "text/primary white",
        "100"
       ],
       [
        "Outline",
        "Hover",
        "none",
        "interactive/primary",
        "text/primary white",
        "100"
       ],
       [
        "Outline",
        "Pressed",
        "none",
        "interactive/primary",
        "text/primary white",
        "100"
       ],
       [
        "Outline",
        "Disabled",
        "none",
        "border/default",
        "text/disabled #5b5b65",
        "64%"
       ],
       [
        "Ghost",
        "Default",
        "none",
        "-",
        "text/primary white",
        "100"
       ],
       [
        "Ghost",
        "Hover",
        "background/selected #2c2c35",
        "-",
        "text/primary white",
        "100"
       ],
       [
        "Ghost",
        "Pressed",
        "background/selected #2c2c35",
        "-",
        "text/primary white",
        "100"
       ],
       [
        "Ghost",
        "Disabled",
        "none",
        "-",
        "text/disabled #5b5b65",
        "64%"
       ]
      ]
     },
     {
      "type": "example",
      "label": "Canvas layout",
      "description": "48 variant symbols laid out in a wrapping grid on a 1500x386 frame, 32px padding; M width 96, S 80, L 112. Order: Primary, Secondary, Outline, Ghost per size, each Default, Hover, Pressed, Disabled."
     }
    ]
   }
  ],
  "footer": [
   "NORTHSTAR DS is the linked Figma library. NorthStar is the online documentation name.",
   "Required before release"
  ]
 },
 "text-input": {
  "nodeId": "4139:55145",
  "title": "Text Input",
  "category": "NORTHSTAR DS / COMPONENT SPECIFICATION · 02",
  "revision": "Reviewed 04 Oct 2026",
  "summary": "A native editable input in implementation, and a bare visual field in Figma. Labels, helper text and validation guidance are a recommended composition, not properties of the current Figma set.",
  "meta": {
   "Review status": "Source-reviewed",
   "Parity status": "Partial parity (warning color status/warning #ffa63f)",
   "Owner": "Owner: Unassigned",
   "Evidence boundary": "Figma inspection + online source • not runtime / AT testing"
  },
  "sections": [
   {
    "nodeId": "4139:55157",
    "number": "01",
    "heading": "Purpose / when not to use",
    "blocks": [
     {
      "type": "note",
      "heading": "USE",
      "text": "Collect short, editable values such as Company name or Billing email. Use an explicit label and persistent instructions where format or purpose needs explanation."
     },
     {
      "type": "note",
      "heading": "DO NOT USE",
      "text": "Do not substitute placeholder for label. Use a textarea for long prose and a selection control for fixed choices. Warning / Error presets are not validation logic."
     }
    ]
   },
   {
    "nodeId": "4139:55168",
    "number": "02",
    "heading": "Visual anatomy",
    "blocks": [
     {
      "type": "example",
      "label": "RECOMMENDED COMPOSITION · demo data",
      "description": "Label text 'Billing email' (Inter SemiBold 12/18, text/secondary); Text input instance 'Labeled field specimen' 400px wide x 36px (Medium), bg gray/9 #0f0f13, radius 5px, entered text 'billing@atlas.example' Open Sans 14/20 gray/2 #a9a9b7 at left 14px; helper text 'We’ll send invoices to this address.' (Open Sans 14/20 text/secondary)."
     },
     {
      "type": "text",
      "text": "1 · Field surface: source width 220px; instance width can change. 2 · In-field text layer: named Label, but not an external visible label. 3 · State stroke / focus treatment: varies with State. 4 · Visible label + helper: surrounding composition, required for a complete field contract."
     }
    ]
   },
   {
    "nodeId": "4139:55182",
    "number": "03",
    "heading": "Actual Figma API / defaults",
    "blocks": [
     {
      "type": "text",
      "text": "Text input · set 1846:24423 · 15 variants. Only Size and State are exposed variant axes; the component does not include a complete label + helper wrapper."
     },
     {
      "type": "table",
      "columns": [
       "Property",
       "Actual values / dimensions",
       "Default"
      ],
      "rows": [
       [
        "Size",
        "Small 32px · Medium 36px · Large 48px",
        "Small"
       ],
       [
        "State",
        "Default · Focus · Warning · Error · Disabled",
        "Default"
       ],
       [
        "Source width",
        "220px in all observed variants",
        "220px"
       ],
       [
        "Label / helper",
        "Not external-label / helper properties in Figma",
        "Compose outside field"
       ]
      ]
     },
     {
      "type": "note",
      "heading": "Default mismatch",
      "text": "Figma defaults to Small. Online documentation advertises Medium (m). Specify size explicitly in the handoff."
     }
    ]
   },
   {
    "nodeId": "4139:55211",
    "number": "04",
    "heading": "Visual variants / state matrix",
    "blocks": [
     {
      "type": "text",
      "text": "All 15 actual variants · columns Small / Medium / Large · no invented validation behavior."
     },
     {
      "type": "example",
      "label": "Input state matrix",
      "description": "Rows Default, Focus, Warning, Error, Disabled; columns Small, Medium, Large. 15 'Text input' instances (Size x State), each showing placeholder text 'Placeholder' (Open Sans 14/20, letter-spacing 0.44px)."
     },
     {
      "type": "table",
      "columns": [
       "State",
       "Fill",
       "Border",
       "Placeholder color",
       "Other (all sizes: width 220, radius 5px; heights S 32 / M 36 / L 48)"
      ],
      "rows": [
       [
        "Default",
        "gray/9 #0f0f13",
        "none",
        "gray/5 #5b5b65",
        "text left offset 12px (S) / 14px (M,L)"
       ],
       [
        "Focus",
        "BG layer #0f0f13 with 4px border rgba(72,7,234,0.3); top input #0f0f13 with 1px border #4807ea (hardcoded, not variable)",
        "see fill",
        "gray/2 #a9a9b7 (left 11px S, 13px M/L)",
        "focus ring drawn inside the component"
       ],
       [
        "Warning",
        "gray/9",
        "1px yellow/500 #ffa63f",
        "yellow/500 #ffa63f",
        "left 11px (S) / 13px (M,L)"
       ],
       [
        "Error",
        "gray/9",
        "1px red/400 #ff2069",
        "red/400 #ff2069",
        "left 11px (S) / 13px (M,L)"
       ],
       [
        "Disabled",
        "gray/9",
        "none",
        "gray/6 #40404a",
        "opacity 70%"
       ]
      ]
     },
     {
      "type": "text",
      "text": "Focus is a visual Figma state and an online CSS class, not evidence of a keyboard acceptance pass. Online has no Escape-clear handler. Required, read-only and async validation compositions are proposed, not current variants."
     }
    ]
   },
   {
    "nodeId": "4139:55304",
    "number": "05",
    "heading": "Current bindings / intended semantic mapping",
    "blocks": [
     {
      "type": "table",
      "columns": [
       "Observed bindings",
       "Intended role · proposed",
       "Parity boundary"
      ],
      "rows": [
       [
        "gray/9; gray/5; gray/6; gray/2",
        "Field background; placeholder; disabled; entered text",
        "Primitive bindings, not full semantic parity."
       ],
       [
        "red/400; yellow/500",
        "Error and warning border / text roles",
        "Use explicit message + state, not color alone."
       ],
       [
        "font-size/body-2; line-height/body-2",
        "Input typography",
        "Source primitives observed: body-2 scale."
       ],
       [
        "Focus uses existing visual treatment",
        "focus/ring → --ns-focus-ring",
        "Proposed migration to semantic focus; theme review required."
       ],
       [
        "Size Small / Medium / Large",
        "s / m / l modifiers → 32 / 36 / 48px",
        "Sizes match; bare ns-input is 40px, medium modifier is 36px."
       ]
      ]
     },
     {
      "type": "text",
      "text": "Retain observed primitive bindings as evidence. Semantic field-role migration requires an approved manifest; no token exporter or automatic sync was verified."
     }
    ]
   },
   {
    "nodeId": "4139:55334",
    "number": "06",
    "heading": "Accessibility contract",
    "blocks": [
     {
      "type": "checklist",
      "items": [
       "Use a native editable input with label / id association. Placeholder is supplemental guidance, never the accessible name.",
       "Connect helper and error text with aria-describedby. Set aria-invalid for errors; state messages must explain how to recover. These attributes are source-backed, not runtime-tested.",
       "Keep visible focus and logical tab order. Use type=\"email\" and appropriate autocomplete for Billing email; application validation must be specified separately.",
       "Required before release: theme contrast, error announcement timing, disabled behavior, keyboard editing, forced colors, zoom and screen-reader naming."
      ]
     }
    ]
   },
   {
    "nodeId": "4139:55351",
    "number": "07",
    "heading": "Responsive / content rules",
    "blocks": [
     {
      "type": "text",
      "text": "Use available form width rather than treating the 220px source as a mandatory product width. Keep a readable input area and allow label / helper copy to wrap; do not truncate errors. Preserve the focus outline outside the field. Use one-line input scrolling for long values, not smaller type. At narrow widths, stack fields; at 200% zoom, keep helper association and action order. Distinguish placeholder examples from entered demo values."
     }
    ]
   },
   {
    "nodeId": "4139:55356",
    "number": "08",
    "heading": "Implementation mapping / gaps / ownership",
    "blocks": [
     {
      "type": "table",
      "columns": [
       "Figma / composition",
       "Online advertised API",
       "Source-reviewed boundary"
      ],
      "rows": [
       [
        "Size Small / Medium / Large",
        "size s / m / l; default m",
        "Specify size to avoid Small / Medium default drift."
       ],
       [
        "State Default / Warning / Error / Disabled",
        "state default / error / warning; disabled",
        "Presets demonstrate content; no validation engine verified."
       ],
       [
        "Visible label + helper composition",
        "label; helperText; native label / id; aria-describedby",
        "Online wrapper is richer than the bare Figma component."
       ],
       [
        "Focus state",
        "Visual Focus class",
        "No Escape-clear handler; keyboard / AT acceptance required."
       ]
      ]
     },
     {
      "type": "note",
      "heading": "Partial parity · owners Unassigned",
      "text": "Assign design ownership for a semantic labeled-field composition; engineering for validation and input sizing; accessibility for error and focus behavior. React package examples are advertised only, package availability and behavior were not verified."
     },
     {
      "type": "note",
      "heading": "NORTHSTAR v1.4.0 • complete reference routes",
      "text": "https://mikelrosenthal.com/northstar/#/components/text-input\nhttps://mikelrosenthal.com/northstar/#/components/text-input/usage\nhttps://mikelrosenthal.com/northstar/#/components/text-input/style\nhttps://mikelrosenthal.com/northstar/#/components/text-input/code\nhttps://mikelrosenthal.com/northstar/#/components/text-input/accessibility"
     }
    ]
   }
  ],
  "footer": [
   "NORTHSTAR DS is the linked Figma library. NorthStar is the online documentation name.",
   "Required before release"
  ]
 },
 "checkbox": {
  "nodeId": "4139:55395",
  "title": "Checkbox",
  "category": "NORTHSTAR DS / COMPONENT SPECIFICATION · 03",
  "revision": "Reviewed 04 Oct 2026",
  "summary": "Independent binary selection, with a compact visual box and an explicit naming contract. The library contains 12 actual variants; focus and mixed selection remain documented design gaps.",
  "meta": {
   "Review status": "Source-reviewed",
   "Parity status": "Partial parity",
   "Owner": "Owner: Unassigned",
   "Evidence boundary": "Figma inspection + online source • not runtime / AT testing"
  },
  "sections": [
   {
    "nodeId": "4139:55407",
    "number": "01",
    "heading": "Purpose / when not to use",
    "blocks": [
     {
      "type": "label",
      "text": "USE"
     },
     {
      "type": "text",
      "text": "Select zero, one or several independent options. Use for a form preference such as Send welcome kit when the choice is applied on submission."
     },
     {
      "type": "label",
      "text": "DO NOT USE"
     },
     {
      "type": "text",
      "text": "Use radio buttons for mutually exclusive choices, and a switch for an immediate on/off setting. Never rely on an unlabeled visual box as an autonomous control."
     }
    ]
   },
   {
    "nodeId": "4139:55418",
    "number": "02",
    "heading": "Visual anatomy",
    "blocks": [
     {
      "type": "example",
      "label": "Checkbox anatomy (card bg background/elevated #1e1e24, radius 10, padding 20)",
      "description": "Checkbox instance, default (Checked=Yes, Hovered=No, Disabled=No, Show label=No), 16 × 16px, followed by composed outside-the-instance label text 'Send welcome kit' (Inter Semi Bold 12px text/secondary), 8px gap."
     },
     {
      "type": "text",
      "text": "16 × 16px visual box • demo form label composed outside the instance"
     },
     {
      "type": "text",
      "text": "1 · Box: 16 × 16px; 2px corners. 2 · Checkmark: communicates selected, not color alone. 3 · Optional visual label: 8px gap; sample labeled variant 54 × 16px. 4 · Accessible target: larger clickable label / hit area in implementation; do not enlarge the glyph to claim compliance."
     }
    ]
   },
   {
    "nodeId": "4139:55431",
    "number": "03",
    "heading": "Actual Figma API / defaults",
    "blocks": [
     {
      "type": "text",
      "text": "Checkbox · set 1841:21803 · 12 variants. Four boolean-like string axes do not imply all 16 theoretical combinations are present."
     },
     {
      "type": "table",
      "columns": [
       "Property",
       "Literal values",
       "Default"
      ],
      "rows": [
       [
        "Hovered",
        "No / Yes",
        "No"
       ],
       [
        "Checked",
        "No / Yes",
        "Yes"
       ],
       [
        "Disabled",
        "No / Yes",
        "No"
       ],
       [
        "Show label",
        "No / Yes",
        "No"
       ]
      ]
     },
     {
      "type": "note",
      "heading": "Variant coverage boundary",
      "text": "Disabled + hover combinations are absent. There is no explicit Figma Focus or Indeterminate variant. Preserve this boundary in documentation and implementation mapping."
     }
    ]
   },
   {
    "nodeId": "4139:55460",
    "number": "04",
    "heading": "Visual variants / state matrix",
    "blocks": [
     {
      "type": "table",
      "columns": [
       "Actual configuration",
       "Show label = No",
       "Show label = Yes"
      ],
      "rows": [
       [
        "Checked",
        "Checkbox instance (Checked Yes, Hovered No, Disabled No), 16×16, blue filled box with checkmark",
        "Same with Show label=Yes: box + 'Text' label, 54×16, label gray/3 #8a8a98"
       ],
       [
        "Checked + hover",
        "Hovered=Yes Checked=Yes, 16×16",
        "Hovered=Yes Checked=Yes Show label=Yes; label gray/1 #d0d0da"
       ],
       [
        "Unchecked",
        "Checked=No, 1px border gray/4 #70707c, radius 2, 16×16",
        "Checked=No Show label=Yes, label gray/3"
       ],
       [
        "Unchecked + hover",
        "Checked=No Hovered=Yes, border gray/0 #f5f5ff",
        "Hovered=Yes Checked=No Show label=Yes; label gray/0 #f5f5ff"
       ],
       [
        "Checked + disabled",
        "Checked=Yes Disabled=Yes, 16×16",
        "Disabled=Yes Show label=Yes; label gray/6 #40404a"
       ],
       [
        "Unchecked + disabled",
        "Checked=No Disabled=Yes, border gray/6 #40404a",
        "Disabled=Yes Checked=No Show label=Yes; label gray/6 #40404a"
       ]
      ]
     },
     {
      "type": "example",
      "label": "Specimen detail",
      "description": "Each specimen is a real Checkbox instance (unlabeled 16×16px; labeled 54×16px with visible label 'Text', Inter Semi Bold 14px/20 tracking -0.126px, 8px gap). Row labels are Inter Semi Bold 12px text/secondary. Checkmark asset used for checked states; row padding 14px 12px."
     },
     {
      "type": "note",
      "heading": "Proposed · mixed state and focus",
      "text": "Indeterminate and focus-visible are required design additions, not existing variants. Online DOM indeterminate exists, but group-selection propagation is not implemented. No invented state specimen is presented."
     }
    ]
   },
   {
    "nodeId": "4139:55544",
    "number": "05",
    "heading": "Current bindings / intended semantic mapping",
    "blocks": [
     {
      "type": "table",
      "columns": [
       "Observed primitives",
       "Intended role · proposed",
       "Review requirement"
      ],
      "rows": [
       [
        "blue/500; blue/700",
        "Selection fill / hover → interactive/primary / interactive/hover",
        "Replace primitive dependence only after mapping approval."
       ],
       [
        "gray/0; gray/1; gray/3",
        "Hover / normal label and glyph foreground",
        "Theme-specific text and icon contrast."
       ],
       [
        "gray/4; gray/6; gray/10",
        "Box outline; unavailable; checkmark",
        "Map border/default, disabled and on-selection roles; avoid assuming text/inverse is safe."
       ],
       [
        "font-size/body-2; line-height/body-2",
        "Selection-label typography",
        "Bound primitives observed; wrapping behavior still needs composition."
       ]
      ]
     },
     {
      "type": "text",
      "text": "These are observed bindings, not a semantic-parity or accessibility approval. Focus ring mapping is intended: focus/ring → --ns-focus-ring; no explicit library focus variant exists."
     },
     {
      "type": "text",
      "text": "Visual values observed (from design context): gray/0 #f5f5ff, gray/1 #d0d0da, gray/3 #8a8a98, gray/4 #70707c, gray/6 #40404a, gray/10 #000000, blue #023AFF, persian blue #3506EF; box radius 2px, border 1px, 16×16."
     }
    ]
   },
   {
    "nodeId": "4139:55570",
    "number": "06",
    "heading": "Accessibility contract",
    "blocks": [
     {
      "type": "checklist",
      "items": [
       "Use native input type=\"checkbox\" with an associated label. Labels remain required when Show label = No; provide a programmatic name tied to the option.",
       "Space toggles the checkbox; native checked / disabled behavior is source-backed. Do not imply group propagation exists.",
       "Use a larger clickable label target around the 16px glyph. Target at least 24 × 24px or satisfy WCAG 2.2 spacing exceptions; verify in context.",
       "For mixed state, set DOM indeterminate and convey mixed state to assistive technology. Require visible focus, contrast, forced-color and screen-reader tests before release."
      ]
     }
    ]
   },
   {
    "nodeId": "4139:55587",
    "number": "07",
    "heading": "Responsive / content rules",
    "blocks": [
     {
      "type": "text",
      "text": "Use concise option labels and allow wrapping on narrow screens. Align the box with the first text line, keep an 8px visual gap and group related choices under a fieldset / legend. Do not truncate legal or consent text. Preserve a larger hit area without letting targets overlap. Localize labels and support RTL reading order. Explain why a disabled choice is unavailable with nearby helper copy."
     }
    ]
   },
   {
    "nodeId": "4139:55592",
    "number": "08",
    "heading": "Implementation mapping / gaps / ownership",
    "blocks": [
     {
      "type": "table",
      "columns": [
       "Figma contract",
       "Online advertised API",
       "Status / action"
      ],
      "rows": [
       [
        "Checked Yes / No",
        "checked; native input",
        "Source-reviewed binary selection."
       ],
       [
        "Show label + composed naming",
        "labelText",
        "Require names even when visually hidden."
       ],
       [
        "Disabled Yes / No; Hovered",
        "disabled; CSS hover",
        "Disabled + hover is not a Figma combination."
       ],
       [
        "No indeterminate / focus variant",
        "indeterminate set with JavaScript DOM property",
        "P1: add mixed-state design; no group propagation implemented."
       ]
      ]
     },
     {
      "type": "note",
      "heading": "Partial parity · owners Unassigned",
      "text": "Design: mixed-state and focus definitions. Engineering: selection-group rules and label association. Accessibility: hit area, mixed-state announcement and keyboard acceptance. React examples remain advertised, not verified packages."
     },
     {
      "type": "text",
      "text": "NORTHSTAR v1.4.0 • complete reference routes\nhttps://mikelrosenthal.com/northstar/#/components/checkbox\nhttps://mikelrosenthal.com/northstar/#/components/checkbox/usage\nhttps://mikelrosenthal.com/northstar/#/components/checkbox/style\nhttps://mikelrosenthal.com/northstar/#/components/checkbox/code\nhttps://mikelrosenthal.com/northstar/#/components/checkbox/accessibility"
     }
    ]
   }
  ],
  "footer": [
   "NORTHSTAR DS is the linked Figma library. NorthStar is the online documentation name.",
   "Required before release"
  ]
 },
 "dropdown": {
  "nodeId": "4139:55631",
  "title": "Dropdown",
  "category": "NORTHSTAR DS / COMPONENT SPECIFICATION · 04",
  "revision": "Reviewed 04 Oct 2026",
  "summary": "Three independent Figma sets form the dropdown recipe: Trigger, Menu and List Item. Choose selection or command semantics by task; the online demo does not yet meet the keyboard / ARIA acceptance contract.",
  "meta": {
   "Review status": "Source-reviewed",
   "Parity status": "Partial parity",
   "Owner": "Owner: Unassigned",
   "Evidence boundary": "Figma inspection + online source • not runtime / AT testing"
  },
  "sections": [
   {
    "nodeId": "4139:55643",
    "number": "01",
    "heading": "Purpose / when not to use",
    "blocks": [
     {
      "type": "label",
      "text": "USE"
     },
     {
      "type": "text",
      "text": "Offer a compact list of fixed options such as Account tier, or a menu of commands. Selection stores a value; command menus execute actions. Resolve the semantic pattern before implementation."
     },
     {
      "type": "label",
      "text": "DO NOT USE"
     },
     {
      "type": "text",
      "text": "Do not prescribe listbox semantics for action menus. Use radio buttons when a small choice set benefits from comparison, and a searchable combobox for long lists. Multi-select is advertised online but not implemented."
     }
    ]
   },
   {
    "nodeId": "4139:55654",
    "number": "02",
    "heading": "Visual anatomy",
    "blocks": [
     {
      "type": "example",
      "label": "ACTUAL TRIGGER + MENU · composed open illustration",
      "description": "Two real instances stacked: Dropdown / Trigger (Content=Text, State=Default, 150×42, label 'Dropdown') above Dropdown / Menu (Items=4, 200×174), 8px gap, inside card bg background/elevated #1e1e24 radius 10 padding 20."
     },
     {
      "type": "text",
      "text": "1 · Trigger: label / optional leading icon + chevron. 2 · Menu: 200px wide, 4px inset, 2px item spacing. 3 · List item: 200 × 40px source; optional icon. 4 · Hover is visual emphasis, not a selected value. Open composition above places two real instances together; Open is not a Trigger variant."
     },
     {
      "type": "note",
      "heading": "Semantics are task-specific",
      "text": "Tier is a selection listbox pattern. A commands dropdown uses menu / menuitem behavior instead; the visual sets do not determine the ARIA role."
     }
    ]
   },
   {
    "nodeId": "4139:55704",
    "number": "03",
    "heading": "Actual Figma API / defaults",
    "blocks": [
     {
      "type": "table",
      "columns": [
       "Set / variant count",
       "Actual property values",
       "Default / source size"
      ],
      "rows": [
       [
        "Trigger · 1842:24092 · 9",
        "Content: Text / Icon / Two icons",
        "Two icons; 176 × 42px"
       ],
       [
        "Trigger",
        "State: Default / Hover / Disabled",
        "Default; Text 150 × 42px; Icon 36 × 36px"
       ],
       [
        "Menu · 1842:24065 · 4",
        "Items: 4 / 5 / 6 / 7",
        "4; 200px wide; heights 174 / 216 / 258 / 300px"
       ],
       [
        "List Item · 1842:24052 · 4",
        "Icon: No / yes (literal lowercase yes)",
        "No; 200 × 40px"
       ],
       [
        "List Item",
        "Hovered: No / Yes",
        "No"
       ]
      ]
     },
     {
      "type": "note",
      "heading": "No unified property API",
      "text": "Selected, Open, Focus and multi-select are not explicit Figma variants. Menu item count does not describe runtime selection, callbacks or keyboard behavior."
     }
    ]
   },
   {
    "nodeId": "4139:55736",
    "number": "04",
    "heading": "Visual variants / state matrices",
    "blocks": [
     {
      "type": "label",
      "text": "ACTUAL TRIGGER · rows Text / Icon / Two icons · columns Default / Hover / Disabled"
     },
     {
      "type": "example",
      "label": "Trigger state matrix",
      "description": "Rows: Text, Icon, Two icons; columns Default, Hover, Disabled. Dropdown / Trigger instances. Text: label 'Dropdown' (Open Sans Bold 16px/24, gray/0 #f5f5ff) + 18px Arrow down chevron, padding 9px 12px 9px 20px, gap 16, 150×42. Icon: only 18px chevron, padding 9px, 36×36. Two icons: 18px Setting icon + 'Dropdown' + chevron, padding 9px 12px, gap 24 (inner gap 8), 176×42. Radius 6px. Default bg gray/8 #1e1e24; Hover bg gray/7 #2c2c35; Disabled opacity 25% (bg gray/8; Icon disabled bg gray/9 #0f0f13)."
     },
     {
      "type": "label",
      "text": "ACTUAL MENU · item count / source height"
     },
     {
      "type": "example",
      "label": "Menu count matrix",
      "description": "Dropdown / Menu instances, 200px wide: '4 items / 174px', '5 items / 216px', '6 items / 258px', '7 items / 300px'. Menu bg gray/9 #0f0f13, radius 8px, padding 4px, item gap 2px, shadow 0 4 32 rgba(0,16,61,0.16) (depth/depth2). First item shown hovered (bg gray/8 #1e1e24, text gray/1 #d0d0da), each item shows coin icon + 'Text'."
     },
     {
      "type": "label",
      "text": "ACTUAL LIST ITEM · No / yes icon × No / Yes hover"
     },
     {
      "type": "example",
      "label": "List item matrix",
      "description": "Two columns. 'Icon = No': Default item and Hovered item (200×40, radius 4px, label 'Text' at left 14px; default text gray/3 #8a8a98, hovered gray/0 #f5f5ff with bg gray/8 #1e1e24). 'Icon = yes': Default item and Hovered item with 20px coin icon, 10px gap, left 14px. Label Inter Semi Bold 14px/20 tracking -0.126px."
     },
     {
      "type": "note",
      "heading": "Proposed · not current variants",
      "text": "Focus, selected-option indication, open / closed controller state and multi-select behavior require a designed state contract. Hover must never stand in for selection."
     }
    ]
   },
   {
    "nodeId": "4139:56124",
    "number": "05",
    "heading": "Current bindings / intended semantic mapping",
    "blocks": [
     {
      "type": "table",
      "columns": [
       "Observed primitives",
       "Intended role · proposed",
       "Parity boundary"
      ],
      "rows": [
       [
        "gray/0; gray/3",
        "Trigger and item foreground",
        "Map to semantic text roles; contrast review by theme."
       ],
       [
        "gray/7; gray/8; gray/9",
        "Hover surface; trigger; menu surface",
        "Map background/selected, background/surface, background/elevated; Dark values drift."
       ],
       [
        "body-1 and body-2 size / line-height",
        "Trigger / item typography",
        "Primitive bindings observed; no semantic parity approval."
       ],
       [
        "No explicit focus / selection axis",
        "focus/ring; selected surface and indicator",
        "Proposed roles; require a mapping and state specification."
       ]
      ]
     },
     {
      "type": "text",
      "text": "Visual values observed: gray/0 #f5f5ff, gray/1 #d0d0da, gray/3 #8a8a98, gray/7 #2c2c35, gray/8 #1e1e24, gray/9 #0f0f13; Dark Theme Gray-1 #F5F5FF, Gray-0 #FFFFFF; depth2 shadow #00103D29 0/4/32; Body 2 Open Sans 14px/20; Buttons Primary Inter Semi Bold 14px; Primary Bold Open Sans Bold body-1 16px."
     }
    ]
   },
   {
    "nodeId": "4139:56149",
    "number": "06",
    "heading": "Accessibility contract",
    "blocks": [
     {
      "type": "checklist",
      "items": [
       "Selection: named trigger with expanded / controls state; listbox options convey selected value. Commands: use menu / menuitem semantics appropriate to actions, not listbox.",
       "Required before release: Arrow navigation, Enter / Space activation, Escape close, logical focus movement and focus return to trigger. These advertised behaviors are missing online.",
       "Synchronize aria-expanded after selection and outside-close; online source does not reset it in those paths. Distinguish active item from selected value.",
       "Validate screen-reader name / value / state, visible focus, contrast, disabled trigger behavior, pointer dismissal and reflow. No keyboard / AT testing was performed."
      ]
     }
    ]
   },
   {
    "nodeId": "4139:56166",
    "number": "07",
    "heading": "Responsive / content rules",
    "blocks": [
     {
      "type": "text",
      "text": "Anchor the menu to its trigger, keep it within the viewport and allow a scrollable list when height is constrained. The 200px source width is a starting point, not a product limit. Let option labels expand without hiding the selected value; supply full readable text where truncation is necessary. Preserve distinct focus and selection indicators at zoom and in forced colors. For mobile form entry, consider a native select rather than claiming the custom recipe is already keyboard-complete."
     }
    ]
   },
   {
    "nodeId": "4139:56171",
    "number": "08",
    "heading": "Implementation mapping / gaps / ownership",
    "blocks": [
     {
      "type": "table",
      "columns": [
       "Figma / composition",
       "NorthStar online source",
       "Known gap / required gate"
      ],
      "rows": [
       [
        "Trigger Content + label override",
        "Advertised label / icon; live trigger click",
        "Static playground is always-visible menu; separate live demo opens."
       ],
       [
        "Menu Items + item text",
        "Advertised items; live item click selection",
        "Visual count maps to options, not a controlled component API."
       ],
       [
        "No multi-select variant",
        "Advertised multiple / onChange",
        "Multi-select and consumer change callback not implemented."
       ],
       [
        "Open / focus / selected composition",
        "Advertised Arrow keys, Escape and focus return",
        "P0: implement keyboard / ARIA; reset expanded state on close."
       ],
       [
        "Tier in composed workflow",
        "Online forms use native Select",
        "Deliberate difference; keep native Select until custom acceptance gates are met."
       ]
      ]
     },
     {
      "type": "note",
      "heading": "Partial parity · P0 · owners Unassigned",
      "text": "Engineering owns controller / keyboard / ARIA work; design owns explicit focus and selection visuals; accessibility owns acceptance tests. All assignments are Unassigned. React examples are advertised only; no package availability or behavior verification."
     },
     {
      "type": "text",
      "text": "NORTHSTAR v1.4.0 • complete reference routes\nhttps://mikelrosenthal.com/northstar/#/components/dropdown\nhttps://mikelrosenthal.com/northstar/#/components/dropdown/usage\nhttps://mikelrosenthal.com/northstar/#/components/dropdown/style\nhttps://mikelrosenthal.com/northstar/#/components/dropdown/code\nhttps://mikelrosenthal.com/northstar/#/components/dropdown/accessibility"
     }
    ]
   }
  ],
  "footer": [
   "NORTHSTAR DS is the linked Figma library. NorthStar is the online documentation name.",
   "Required before release"
  ]
 },
 "alert-banner": {
  "nodeId": "4139:56214",
  "title": "Alert Banner",
  "category": "NORTHSTAR DS / COMPONENT SPECIFICATION · 05",
  "revision": "Reviewed 04 Oct 2026",
  "summary": "Contextual, non-modal feedback with optional description and actions. Tone is visual, not an automatic announcement policy, and actual online dismissal remains a release-blocking behavior gap.",
  "meta": {
   "Review status": "Source-reviewed",
   "Parity status": "Partial parity",
   "Owner": "Owner: Unassigned",
   "Evidence boundary": "Figma inspection + online source • not runtime / AT testing"
  },
  "sections": [
   {
    "nodeId": "4139:56226",
    "number": "01",
    "heading": "Purpose / when not to use",
    "blocks": [
     {
      "type": "label",
      "text": "USE"
     },
     {
      "type": "text",
      "text": "Explain a meaningful condition near its context, summarize validation and offer recovery. State what happened, what it means and the next step."
     },
     {
      "type": "label",
      "text": "DO NOT USE"
     },
     {
      "type": "text",
      "text": "Do not replace inline field errors with a banner alone, interrupt routine updates assertively, or use a banner where a blocking confirmation dialog is needed."
     }
    ]
   },
   {
    "nodeId": "4139:56237",
    "number": "02",
    "heading": "Visual anatomy",
    "blocks": [
     {
      "type": "example",
      "label": "Feedback banner instance (4139:56241), 1120x120",
      "description": "Instance of Alert banner, Type=Error, Buttons=Yes, Description=Yes (copy overridden). Icon: Warning, 20px. Title (14px/20px Open Sans Bold, gray/0 #f5f5ff): 'Review the billing email'. Description (12px/16px Open Sans Regular, white at 80% opacity, tracking 0.4): 'Demo data: enter a valid email address before creating the account.' Buttons (outlined, 1px border rgba(255,255,255,0.5), radius 6px, padding 24x8, 14px Open Sans Bold white, 10px gap): 'Review email', 'Keep editing'. Trailing close icon (Cancel). Banner container: background rgba(253,32,105,0.32), padding 16px, gap 12px, radius 6px."
     },
     {
      "type": "text",
      "text": "1 · Tone icon, 20px. 2 · Title identifies the condition. 3 · Optional description explains recovery. 4 · Optional actions provide concrete next steps. 5 · Trailing close affordance needs an accessible name and real dismissal behavior. The illustration uses the actual Error / Buttons Yes / Description Yes instance with copy overrides."
     }
    ]
   },
   {
    "nodeId": "4139:56271",
    "number": "03",
    "heading": "Actual Figma API / defaults",
    "blocks": [
     {
      "type": "text",
      "text": "Alert banner · set 1743:21973 · 20 variants: 5 types × 2 action configurations × 2 description configurations."
     },
     {
      "type": "table",
      "columns": [
       "Property / dimension",
       "Actual values",
       "Default"
      ],
      "rows": [
       [
        "Type",
        "Default · Error · Accent · Success · Warning",
        "Default"
       ],
       [
        "Buttons",
        "Yes / No",
        "Yes"
       ],
       [
        "Description",
        "Yes / No",
        "Yes"
       ],
       [
        "Source width",
        "1152px",
        "1152px"
       ],
       [
        "Source heights",
        "52px neither; 56px buttons only; 76px description only; 120px both",
        "120px"
       ]
      ]
     },
     {
      "type": "text",
      "text": "Copy changes are instance text overrides; they are not additional variant axes."
     }
    ]
   },
   {
    "nodeId": "4139:56302",
    "number": "04",
    "heading": "Visual variants / content configurations",
    "blocks": [
     {
      "type": "label",
      "text": "ACTUAL TYPES · Description Yes / Buttons No"
     },
     {
      "type": "example",
      "label": "Tone specimens (5 rows, each in a labelled specimen box, banner 1088x76)",
      "description": "Each banner: Description Yes / Buttons No, 76px source height, padding 16, gap 12, radius 6, title 14px Bold, description 12px, trailing Cancel icon. Description for all: 'Example content: explain the condition and the next step. Not a runtime announcement test.' (1) label 'Default · 76px source height', title 'Default: example condition', bg navy/900 #191932, Question icon. (2) 'Error · 76px source height', title 'Error: example condition', bg rgba(253,32,105,0.35), Warning icon. (3) 'Accent · 76px source height', title 'Accent: example condition', bg blue/500 #023aff, Question icon. (4) 'Success · 76px source height', title 'Success: example condition', bg rgba(43,255,89,0.35), Success icon. (5) 'Warning · 76px source height', title 'Warning: example condition', bg rgba(153,27,250,0.16) (purple), Attention icon."
     },
     {
      "type": "label",
      "text": "ACTUAL DEFAULT CONTENT CONFIGURATIONS · all four combinations"
     },
     {
      "type": "example",
      "label": "Content configuration matrix (bg background/elevated #1e1e24, padding 16, radius 10, gap 16)",
      "description": "Four banner instances (default tone, navy/900 bg, Question icon + Cancel). (1) 'Title only · 52px source height'. (2) 'Title + actions · 56px source height' with buttons 'Review details', 'Later'. (3) 'Title + description · 76px source height', description 'Keep recovery guidance readable; let the text grow in product context.' (4) 'Title + description + actions · 120px source height', description 'Example content: summarize the condition and give a useful next step.', buttons 'Review details', 'Later'."
     },
     {
      "type": "note",
      "heading": "Proposed behavior, not visual variants",
      "text": "Dismissed, focused, loading and live-announcement states are not Type variants. The five tones do not establish urgency or accessibility approval; announcement timing belongs to the implementation contract."
     }
    ]
   },
   {
    "nodeId": "4139:56526",
    "number": "05",
    "heading": "Current bindings / intended semantic mapping",
    "blocks": [
     {
      "type": "table",
      "columns": [
       "Observed primitives",
       "Intended role · proposed",
       "Evidence boundary"
      ],
      "rows": [
       [
        "green/500; red/400; purple/500",
        "Success / error / warning status roles",
        "Tone colors are primitive bindings; not already fully semantic."
       ],
       [
        "blue/500; teal/500; navy/900; purple/300",
        "Accent / informative surface and icon roles",
        "Default and Accent recipes need theme-specific mapping."
       ],
       [
        "gray/0; white",
        "Title and description foreground",
        "Validate contrast over translucent surfaces and all themes."
       ],
       [
        "caption / body-2 typography primitives",
        "Description / title scale",
        "Source-linked type, not proof of readable reflow at product widths."
       ]
      ]
     },
     {
      "type": "text",
      "text": "Proposed semantic mapping should separate status meaning, background, foreground and border roles. Do not claim every tone is semantically bound already."
     }
    ]
   },
   {
    "nodeId": "4139:56552",
    "number": "06",
    "heading": "Accessibility contract",
    "blocks": [
     {
      "type": "checklist",
      "items": [
       "Use polite role=\"status\" by default for dynamic feedback. Reserve assertive role=\"alert\" for urgent dynamic alerts; tone alone must not choose urgency.",
       "Do not move focus just because a banner appears. On failed submit, define deliberate summary / invalid-field focus behavior separately and avoid duplicate announcements.",
       "Pair tone with explicit title and icon. Name close and action controls; ensure dismissal removes the banner, not merely its trailing controls.",
       "Required before release: keyboard actions, focus continuity after close, theme contrast, screen-reader live-region behavior, reflow and persistence. No runtime / AT test approval is claimed."
      ]
     }
    ]
   },
   {
    "nodeId": "4139:56569",
    "number": "07",
    "heading": "Responsive / content rules",
    "blocks": [
     {
      "type": "text",
      "text": "Treat source heights as observations for sample content, not fixed caps. Let descriptions wrap and the banner grow. On narrow widths, keep the icon and message aligned, stack actions beneath copy and retain a reachable close control. Do not shrink or truncate recovery text. Avoid repeated banners announcing the same issue; prefer a summary plus linked field errors. Validate long translations, RTL and 200% zoom."
     }
    ]
   },
   {
    "nodeId": "4139:56574",
    "number": "08",
    "heading": "Implementation mapping / gaps / ownership",
    "blocks": [
     {
      "type": "table",
      "columns": [
       "Figma API",
       "Online advertised API / source",
       "Parity / release gate"
      ],
      "rows": [
       [
        "Type",
        "type default / accent / error / success / warning",
        "Tone names align; primitive binding parity is incomplete."
       ],
       [
        "Title; Description Yes / No",
        "title / description",
        "Online main error uses alert; other tones status; secondary examples omit roles."
       ],
       [
        "Buttons Yes / No",
        "actions",
        "Online actions are placeholders, not application behavior."
       ],
       [
        "Trailing close affordance",
        "onClose",
        "P0: close demo fades trailing controls, not the whole banner."
       ],
       [
        "Dynamic feedback composition",
        "Screen-reader behavior described in docs",
        "Source-reviewed only; validate urgency, announcements and focus."
       ]
      ]
     },
     {
      "type": "note",
      "heading": "Partial parity · P0 dismissal · owners Unassigned",
      "text": "Engineering: actual dismissal and actions. Design: semantic tone mapping and responsive actions. Accessibility: live-region and focus acceptance. Owners are Unassigned; @northstar/react examples remain unverified advertised packages."
     },
     {
      "type": "text",
      "text": "NORTHSTAR v1.4.0 • complete reference routes"
     },
     {
      "type": "checklist",
      "items": [
       "https://mikelrosenthal.com/northstar/#/components/alert-banner",
       "https://mikelrosenthal.com/northstar/#/components/alert-banner/usage",
       "https://mikelrosenthal.com/northstar/#/components/alert-banner/style",
       "https://mikelrosenthal.com/northstar/#/components/alert-banner/code",
       "https://mikelrosenthal.com/northstar/#/components/alert-banner/accessibility"
      ]
     }
    ]
   }
  ],
  "footer": [
   "NORTHSTAR DS is the linked Figma library. NorthStar is the online documentation name.",
   "Required before release"
  ]
 },
 "bullet-chart": {
  "nodeId": "4444:979",
  "title": "Bullet chart",
  "category": "NORTHSTAR DS / COMPONENT SPECIFICATION · 06",
  "revision": "Reviewed 14 Oct 2026",
  "summary": "A data visualization card that shows a measure against a target: stacked segments on a quiet track and one tick for the goal. Built natively for NorthStar after reviewing the Hyper charts kit; nothing was imported. Five sizes, three component properties, every fill bound to Semantic / Colors.",
  "meta": {
   "Review status": "Built 14 Oct 2026, not yet source-reviewed",
   "Parity status": "Docs site renders the same data as SVG",
   "Evidence boundary": "Figma inspection, not runtime or AT testing"
  },
  "sections": [
   {
    "nodeId": "4444:995",
    "number": "01",
    "heading": "Purpose / when not to use",
    "blocks": [
     {
      "type": "note",
      "heading": "USE",
      "text": "Show one measure per row against a goal: revenue to plan, tickets to SLA, capacity to limit. Stacked segments break the measure into parts; the tick is the target."
     },
     {
      "type": "note",
      "heading": "DO NOT USE",
      "text": "Do not use for time series (Line chart), for ranking categories without a target (Horizontal bar chart), or for a single percentage (Progress)."
     }
    ]
   },
   {
    "nodeId": "4444:1006",
    "number": "02",
    "heading": "Visual anatomy",
    "blocks": [
     {
      "type": "text",
      "text": "1 · Container: widget/bg fill, border/subtle stroke, radius/xl. 2 · Header: Title, Value with Trend, Description, optional Icon. 3 · Axis label: 28px column, text/chart-label. 4 · Track: chart/track, radius/full, clips its children. 5 · Segments: plain rectangles, 2px gap, chart/series-1 to 5 in order. 6 · Target tick: 2px rectangle, chart/target, 4px shorter than the track on 10px tracks."
     },
     {
      "type": "example",
      "label": "Medium",
      "description": "Bullet Chart instance, Size=Medium, Value '$42,180', Title 'Revenue', Show icon=false."
     },
     {
      "type": "text",
      "text": "Sizes: Small 330 wide (header left, four unlabeled 6px tracks right) · Vertical small 192 wide · Medium 375 wide, five labeled 10px tracks · Large 375 wide with a divider and two-KPI summary · XL 800 wide, three KPIs, six rows, up to five segments."
     }
    ]
   },
   {
    "nodeId": "4444:1067",
    "number": "03",
    "heading": "Actual Figma API / defaults",
    "blocks": [
     {
      "type": "text",
      "text": "Data Visualization / Bullet Chart · set 4443:314 · page \"Bullet chart\" under DATA VIZ."
     },
     {
      "type": "table",
      "columns": [
       "Property",
       "Type",
       "Default",
       "Notes"
      ],
      "rows": [
       [
        "Size",
        "VARIANT",
        "Small",
        "Small, Vertical small, Medium, Large, XL. Medium is the recommended default."
       ],
       [
        "Title",
        "TEXT",
        "Revenue",
        "Binds to the header title. In XL it binds to the first KPI title."
       ],
       [
        "Value",
        "TEXT",
        "$42,180",
        "Binds to the headline figure. In Large it binds to the first summary figure."
       ],
       [
        "Show icon",
        "BOOLEAN",
        "false",
        "Medium and XL ship with the icon on; Small, Vertical small and Large ship with it off."
       ]
      ]
     }
    ]
   },
   {
    "nodeId": "4444:1098",
    "number": "04",
    "heading": "Current bindings / semantic mapping",
    "blocks": [
     {
      "type": "table",
      "columns": [
       "Layer",
       "Token",
       "Role"
      ],
      "rows": [
       [
        "Container fill",
        "widget/bg",
        "Card surface, same as the other data viz widgets"
       ],
       [
        "Container stroke",
        "border/subtle",
        "1px hairline"
       ],
       [
        "Container radius",
        "radius/xl",
        "12px"
       ],
       [
        "Segment 1 to 5",
        "chart/series-1 to chart/series-5",
        "Alias viz/1, viz/4, viz/2, viz/7, widget/muted"
       ],
       [
        "Track",
        "chart/track",
        "Alias widget/track; radius/full"
       ],
       [
        "Target tick",
        "chart/target",
        "Alias text/primary"
       ],
       [
        "Title, Value",
        "text/primary",
        "Open Sans SemiBold 14, Bold 28"
       ],
       [
        "Axis label, Description",
        "text/chart-label",
        "Open Sans Regular 11 and 12"
       ],
       [
        "Trend",
        "status/success",
        "Open Sans SemiBold 12"
       ],
       [
        "Padding, gaps",
        "spacing/5 to spacing/7, spacing/2 to spacing/4",
        "16 or 24px padding; 4, 8, 12, 16, 20px gaps"
       ]
      ]
     },
     {
      "type": "text",
      "text": "All seven chart/* tokens are aliases of existing Semantic / Colors tokens, so Light, Dark and High Contrast resolve through the modes with no new hex values."
     }
    ]
   },
   {
    "nodeId": "4444:1148",
    "number": "05",
    "heading": "Accessibility contract",
    "blocks": [
     {
      "type": "checklist",
      "items": [
       "Each row has a text equivalent: label, segment values and target. In code the SVG is role=\"list\" with one labeled item per row.",
       "Segments are distinguished by order and label, not color alone; keep the legend or axis label visible.",
       "Track-to-segment contrast meets 3:1 in every mode; the tick uses text/primary for the strongest contrast.",
       "Trend arrows carry a sign in the text (+ or -), not just color.",
       "Not interactive. If rows become links, add focus rings from focus/ring."
      ]
     }
    ]
   },
   {
    "nodeId": "4444:1158",
    "number": "06",
    "heading": "Responsive / content rules",
    "blocks": [
     {
      "type": "text",
      "text": "Pick the size by container width: Small and Vertical small under 360px, Medium and Large at 360 to 600px, XL above 720px. Keep titles to three words and values to one figure with its unit. Axis labels are scale steps, not category names. Never more than five segments; group the rest into chart/series-5."
     }
    ]
   }
  ]
 },
 "bubble-chart": {
  "nodeId": "4454:37191",
  "title": "Bubble chart",
  "category": "NORTHSTAR DS / COMPONENT SPECIFICATION · 07",
  "revision": "Reviewed 15 Oct 2026",
  "summary": "A data visualization card that plots points on two axes and uses bubble area for a third measure. Built natively for NorthStar after reviewing the Hyper charts kit; nothing was imported. Five sizes, three component properties, every fill bound to Semantic / Colors.",
  "meta": {
   "Review status": "Built 15 Oct 2026, not yet source-reviewed",
   "Parity status": "Docs site renders the same data as SVG",
   "Evidence boundary": "Figma inspection, not runtime or AT testing"
  },
  "sections": [
   {
    "nodeId": "4454:37207",
    "number": "01",
    "heading": "Purpose / when not to use",
    "blocks": [
     {
      "type": "note",
      "heading": "USE",
      "text": "Compare a small set of items on two measures at once, with size carrying a third: accounts by spend and tenure, sized by seats. Keep it to about ten bubbles."
     },
     {
      "type": "note",
      "heading": "DO NOT USE",
      "text": "Do not use for time series (Line chart), for exact comparison of one measure (Bar chart), or when more than twelve points would overlap (Scatter)."
     }
    ]
   },
   {
    "nodeId": "4454:37218",
    "number": "02",
    "heading": "Visual anatomy",
    "blocks": [
     {
      "type": "text",
      "text": "1 · Container: widget/bg fill, border/subtle stroke, radius/xl. 2 · Header: Title, Value with Trend, Description, optional Icon. 3 · Gridlines: 1px rectangles, widget/grid. 4 · Axis labels: text/chart-label, 11px. 5 · Bubbles: ellipses, chart/series-1 to 3 at 85% opacity, area proportional to the third measure."
     },
     {
      "type": "example",
      "label": "Medium",
      "description": "Bubble instance, Size=Medium, Value '1,240', Title 'Accounts', Show icon=false."
     },
     {
      "type": "text",
      "text": "Sizes: Small 330 wide (header left, mini plot right, no axes) · Vertical small 192 wide, no axes · Medium 375 wide with gridlines and labels · Large 375 wide with a divider and two-KPI summary · XL 800 wide, three KPIs."
     }
    ]
   },
   {
    "nodeId": "4454:37225",
    "number": "03",
    "heading": "Actual Figma API / defaults",
    "blocks": [
     {
      "type": "text",
      "text": "Chart / Bubble · set 4454:37087 · page \"Bubble chart\" under DATA VIZ."
     },
     {
      "type": "table",
      "columns": [
       "Property",
       "Type",
       "Default",
       "Notes"
      ],
      "rows": [
       [
        "Size",
        "VARIANT",
        "Small",
        "Small, Vertical small, Medium, Large, XL. Medium is the recommended default."
       ],
       [
        "Title",
        "TEXT",
        "Accounts",
        "Binds to the header title. In XL it binds to the first KPI title."
       ],
       [
        "Value",
        "TEXT",
        "1,240",
        "Binds to the headline figure. In Large it binds to the first summary figure."
       ],
       [
        "Show icon",
        "BOOLEAN",
        "false",
        "Off by default. Turn it on in Medium or XL; Small keeps text and plot only."
       ]
      ]
     }
    ]
   },
   {
    "nodeId": "4454:37256",
    "number": "04",
    "heading": "Current bindings / semantic mapping",
    "blocks": [
     {
      "type": "table",
      "columns": [
       "Layer",
       "Token",
       "Role"
      ],
      "rows": [
       [
        "Container fill",
        "widget/bg",
        "Card surface, same as the other data viz widgets"
       ],
       [
        "Container stroke",
        "border/subtle",
        "1px hairline"
       ],
       [
        "Container radius",
        "radius/xl",
        "12px"
       ],
       [
        "Bubble fill",
        "chart/series-1 to chart/series-3",
        "Alias viz/1, viz/4, viz/2; 85% opacity so overlaps stay readable"
       ],
       [
        "Gridline",
        "widget/grid",
        "1px rectangle, no axis line"
       ],
       [
        "Bubble radius",
        "Computed from value",
        "Area, not radius, is proportional to the measure"
       ],
       [
        "Title, Value",
        "text/primary",
        "Open Sans SemiBold 14, Bold 28"
       ],
       [
        "Axis label, Description",
        "text/chart-label",
        "Open Sans Regular 11 and 12"
       ],
       [
        "Trend",
        "status/success",
        "Open Sans SemiBold 12"
       ],
       [
        "Padding, gaps",
        "spacing/5 to spacing/7, spacing/2 to spacing/4",
        "16 or 24px padding; 4, 8, 12, 16, 20px gaps"
       ]
      ]
     },
     {
      "type": "text",
      "text": "All seven chart/* tokens are aliases of existing Semantic / Colors tokens, so Light, Dark and High Contrast resolve through the modes with no new hex values."
     }
    ]
   },
   {
    "nodeId": "4454:37306",
    "number": "05",
    "heading": "Accessibility contract",
    "blocks": [
     {
      "type": "checklist",
      "items": [
       "The chart has a text equivalent: role=\"img\" with an aria-label naming the three measures, and a table of the points nearby.",
       "Series are told apart by position and label, not color alone; add a direct label to the largest bubble.",
       "Bubbles meet 3:1 against the card surface in Light, Dark and High Contrast.",
       "Trend text carries its sign (+ or -), not just color.",
       "Not interactive. If bubbles become filters, add focus rings from focus/ring and a keyboard order."
      ]
     }
    ]
   },
   {
    "nodeId": "4454:37316",
    "number": "06",
    "heading": "Responsive / content rules",
    "blocks": [
     {
      "type": "text",
      "text": "Pick the size by container width: Small and Vertical small under 360px, Medium and Large at 360 to 600px, XL above 720px. Keep titles to three words and values to one figure with its unit. Bubble size is the weakest channel: never fewer than 6px radius in Medium, and drop to Scatter below 192px wide."
     }
    ]
   }
  ]
 },
 "candlestick-chart": {
  "nodeId": "4459:1063",
  "title": "Candlestick chart",
  "category": "NORTHSTAR DS / COMPONENT SPECIFICATION · 08",
  "revision": "Reviewed 15 Oct 2026",
  "summary": "A data visualization card that shows open, close, high and low for each period as a body and a wick. Built natively for NorthStar after reviewing the Hyper charts kit; nothing was imported. Five sizes, three component properties, every fill bound to Semantic / Colors.",
  "meta": {
   "Review status": "Built 15 Oct 2026, not yet source-reviewed",
   "Parity status": "Docs site renders the same data as SVG",
   "Evidence boundary": "Figma inspection, not runtime or AT testing"
  },
  "sections": [
   {
    "nodeId": "4459:1079",
    "number": "01",
    "heading": "Purpose / when not to use",
    "blocks": [
     {
      "type": "note",
      "heading": "USE",
      "text": "Show price-like data where the range inside each period matters: open, close, high and low per day, session or release."
     },
     {
      "type": "note",
      "heading": "DO NOT USE",
      "text": "Do not use for a single value per period (Line chart), for totals (Bar chart), or for categories with no order (Horizontal bar chart)."
     }
    ]
   },
   {
    "nodeId": "4459:1090",
    "number": "02",
    "heading": "Visual anatomy",
    "blocks": [
     {
      "type": "text",
      "text": "1 · Container: widget/bg fill, border/subtle stroke, radius/xl. 2 · Header: Title, Value with Trend, Description, optional Icon. 3 · Gridlines: 1px rectangles, widget/grid. 4 · Axis labels: text/chart-label, 11px. 5 · Wick: 1px rectangle from low to high. 6 · Body: rectangle from open to close, status/success when the period closes higher and status/error when it closes lower."
     },
     {
      "type": "example",
      "label": "Medium",
      "description": "Candlestick instance, Size=Medium, Value '4,820', Title 'Index', Show icon=false."
     },
     {
      "type": "text",
      "text": "Sizes: Small 330 wide (header left, mini plot right, no axes) · Vertical small 192 wide, no axes · Medium 375 wide with axes and labels · Large 375 wide with a divider and two-KPI summary · XL 800 wide, three KPIs."
     }
    ]
   },
   {
    "nodeId": "4459:1097",
    "number": "03",
    "heading": "Actual Figma API / defaults",
    "blocks": [
     {
      "type": "text",
      "text": "Chart / Candlestick · set 4458:233 · page \"Candlestick chart\" under DATA VIZ."
     },
     {
      "type": "table",
      "columns": [
       "Property",
       "Type",
       "Default",
       "Notes"
      ],
      "rows": [
       [
        "Size",
        "VARIANT",
        "Small",
        "Small, Vertical small, Medium, Large, XL. Medium is the recommended default."
       ],
       [
        "Title",
        "TEXT",
        "Index",
        "Binds to the header title. In XL it binds to the first KPI title."
       ],
       [
        "Value",
        "TEXT",
        "4,820",
        "Binds to the headline figure. In Large it binds to the first summary figure."
       ],
       [
        "Show icon",
        "BOOLEAN",
        "false",
        "Off by default. Turn it on in Medium or XL; Small keeps text and plot only."
       ]
      ]
     }
    ]
   },
   {
    "nodeId": "4459:1128",
    "number": "04",
    "heading": "Current bindings / semantic mapping",
    "blocks": [
     {
      "type": "table",
      "columns": [
       "Layer",
       "Token",
       "Role"
      ],
      "rows": [
       [
        "Container fill",
        "widget/bg",
        "Card surface, same as the other data viz widgets"
       ],
       [
        "Container stroke",
        "border/subtle",
        "1px hairline"
       ],
       [
        "Container radius",
        "radius/xl",
        "12px"
       ],
       [
        "Rising body and wick",
        "status/success",
        "Close above open; the wick uses the same token"
       ],
       [
        "Falling body and wick",
        "status/error",
        "Close below open"
       ],
       [
        "Gridline",
        "widget/grid",
        "1px rectangle, no axis line"
       ],
       [
        "Title, Value",
        "text/primary",
        "Open Sans SemiBold 14, Bold 28"
       ],
       [
        "Axis label, Description",
        "text/chart-label",
        "Open Sans Regular 11 and 12"
       ],
       [
        "Trend",
        "status/success",
        "Open Sans SemiBold 12"
       ],
       [
        "Padding, gaps",
        "spacing/5 to spacing/7, spacing/2 to spacing/4",
        "16 or 24px padding; 4, 8, 12, 16, 20px gaps"
       ]
      ]
     },
     {
      "type": "text",
      "text": "All seven chart/* tokens are aliases of existing Semantic / Colors tokens, so Light, Dark and High Contrast resolve through the modes with no new hex values."
     }
    ]
   },
   {
    "nodeId": "4459:1178",
    "number": "05",
    "heading": "Accessibility contract",
    "blocks": [
     {
      "type": "checklist",
      "items": [
       "The chart has a text equivalent: role=\"img\" with a label that states the trend, and a table of open, close, high and low nearby.",
       "Direction is also stated in text or a table; green and red are never the only signal.",
       "Marks meet 3:1 against the card surface in Light, Dark and High Contrast.",
       "Trend text carries its sign (+ or -), not just color.",
       "Not interactive. If marks become links or filters, add focus rings from focus/ring and a keyboard order."
      ]
     }
    ]
   },
   {
    "nodeId": "4459:1188",
    "number": "06",
    "heading": "Responsive / content rules",
    "blocks": [
     {
      "type": "text",
      "text": "Pick the size by container width: Small and Vertical small under 360px, Medium and Large at 360 to 600px, XL above 720px. Keep titles to three words and values to one figure with its unit. Show at most ten candles in Medium and eight in Small; beyond that, group periods."
     }
    ]
   }
  ]
 },
 "funnel-chart": {
  "nodeId": "4459:1247",
  "title": "Funnel chart",
  "category": "NORTHSTAR DS / COMPONENT SPECIFICATION · 09",
  "revision": "Reviewed 15 Oct 2026",
  "summary": "A data visualization card that shows how a count narrows across ordered stages. Built natively for NorthStar after reviewing the Hyper charts kit; nothing was imported. Five sizes, three component properties, every fill bound to Semantic / Colors.",
  "meta": {
   "Review status": "Built 15 Oct 2026, not yet source-reviewed",
   "Parity status": "Docs site renders the same data as SVG",
   "Evidence boundary": "Figma inspection, not runtime or AT testing"
  },
  "sections": [
   {
    "nodeId": "4459:1263",
    "number": "01",
    "heading": "Purpose / when not to use",
    "blocks": [
     {
      "type": "note",
      "heading": "USE",
      "text": "Show conversion across an ordered process: visit, signup, trial, paid. Each stage is a subset of the one above."
     },
     {
      "type": "note",
      "heading": "DO NOT USE",
      "text": "Do not use for unordered categories (Horizontal bar chart), for flows between states (Sankey chart), or for parts of a whole (Donut chart)."
     }
    ]
   },
   {
    "nodeId": "4459:1274",
    "number": "02",
    "heading": "Visual anatomy",
    "blocks": [
     {
      "type": "text",
      "text": "1 · Container: widget/bg fill, border/subtle stroke, radius/xl. 2 · Header: Title, Value with Trend, Description, optional Icon. 3 · Stage bar: rectangle centered in the plot, width proportional to the count, chart/series-1 at 100%, 84%, 68%, 52% and 36% opacity. 4 · Stage label: text/chart-label, 11px, left column."
     },
     {
      "type": "example",
      "label": "Medium",
      "description": "Funnel instance, Size=Medium, Value '8,420', Title 'Signups', Show icon=false."
     },
     {
      "type": "text",
      "text": "Sizes: Small 330 wide (header left, mini plot right, no axes) · Vertical small 192 wide, no axes · Medium 375 wide with axes and labels · Large 375 wide with a divider and two-KPI summary · XL 800 wide, three KPIs."
     }
    ]
   },
   {
    "nodeId": "4459:1281",
    "number": "03",
    "heading": "Actual Figma API / defaults",
    "blocks": [
     {
      "type": "text",
      "text": "Chart / Funnel · set 4458:37265 · page \"Funnel chart\" under DATA VIZ."
     },
     {
      "type": "table",
      "columns": [
       "Property",
       "Type",
       "Default",
       "Notes"
      ],
      "rows": [
       [
        "Size",
        "VARIANT",
        "Small",
        "Small, Vertical small, Medium, Large, XL. Medium is the recommended default."
       ],
       [
        "Title",
        "TEXT",
        "Signups",
        "Binds to the header title. In XL it binds to the first KPI title."
       ],
       [
        "Value",
        "TEXT",
        "8,420",
        "Binds to the headline figure. In Large it binds to the first summary figure."
       ],
       [
        "Show icon",
        "BOOLEAN",
        "false",
        "Off by default. Turn it on in Medium or XL; Small keeps text and plot only."
       ]
      ]
     }
    ]
   },
   {
    "nodeId": "4459:1312",
    "number": "04",
    "heading": "Current bindings / semantic mapping",
    "blocks": [
     {
      "type": "table",
      "columns": [
       "Layer",
       "Token",
       "Role"
      ],
      "rows": [
       [
        "Container fill",
        "widget/bg",
        "Card surface, same as the other data viz widgets"
       ],
       [
        "Container stroke",
        "border/subtle",
        "1px hairline"
       ],
       [
        "Container radius",
        "radius/xl",
        "12px"
       ],
       [
        "Stage bar",
        "chart/series-1",
        "Opacity steps down by stage so order reads without color"
       ],
       [
        "Stage label",
        "text/chart-label",
        "Open Sans Regular 11"
       ],
       [
        "Stage gap",
        "6px",
        "3px in compact sizes"
       ],
       [
        "Title, Value",
        "text/primary",
        "Open Sans SemiBold 14, Bold 28"
       ],
       [
        "Axis label, Description",
        "text/chart-label",
        "Open Sans Regular 11 and 12"
       ],
       [
        "Trend",
        "status/success",
        "Open Sans SemiBold 12"
       ],
       [
        "Padding, gaps",
        "spacing/5 to spacing/7, spacing/2 to spacing/4",
        "16 or 24px padding; 4, 8, 12, 16, 20px gaps"
       ]
      ]
     },
     {
      "type": "text",
      "text": "All seven chart/* tokens are aliases of existing Semantic / Colors tokens, so Light, Dark and High Contrast resolve through the modes with no new hex values."
     }
    ]
   },
   {
    "nodeId": "4459:1362",
    "number": "05",
    "heading": "Accessibility contract",
    "blocks": [
     {
      "type": "checklist",
      "items": [
       "The chart has a text equivalent: role=\"img\" with a label naming the stages, and a table of counts and conversion rates nearby.",
       "Order is carried by position and width; label each stage with its count when it is not obvious.",
       "Marks meet 3:1 against the card surface in Light, Dark and High Contrast.",
       "Trend text carries its sign (+ or -), not just color.",
       "Not interactive. If marks become links or filters, add focus rings from focus/ring and a keyboard order."
      ]
     }
    ]
   },
   {
    "nodeId": "4459:1372",
    "number": "06",
    "heading": "Responsive / content rules",
    "blocks": [
     {
      "type": "text",
      "text": "Pick the size by container width: Small and Vertical small under 360px, Medium and Large at 360 to 600px, XL above 720px. Keep titles to three words and values to one figure with its unit. Five stages at most; merge the tail into one bar. Keep stage labels to one word and drop them below 192px wide."
     }
    ]
   }
  ]
 },
 "dumbbell-chart": {
  "nodeId": "4459:1431",
  "title": "Dumbbell chart",
  "category": "NORTHSTAR DS / COMPONENT SPECIFICATION · 10",
  "revision": "Reviewed 15 Oct 2026",
  "summary": "A data visualization card that joins two values per row to show the gap between them. Built natively for NorthStar after reviewing the Hyper charts kit; nothing was imported. Five sizes, three component properties, every fill bound to Semantic / Colors.",
  "meta": {
   "Review status": "Built 15 Oct 2026, not yet source-reviewed",
   "Parity status": "Docs site renders the same data as SVG",
   "Evidence boundary": "Figma inspection, not runtime or AT testing"
  },
  "sections": [
   {
    "nodeId": "4459:1447",
    "number": "01",
    "heading": "Purpose / when not to use",
    "blocks": [
     {
      "type": "note",
      "heading": "USE",
      "text": "Show change between two states for several categories: before and after, plan and actual, this year and last year."
     },
     {
      "type": "note",
      "heading": "DO NOT USE",
      "text": "Do not use for a single value per row (Horizontal bar chart), for more than two states, or for time series (Line chart)."
     }
    ]
   },
   {
    "nodeId": "4459:1458",
    "number": "02",
    "heading": "Visual anatomy",
    "blocks": [
     {
      "type": "text",
      "text": "1 · Container: widget/bg fill, border/subtle stroke, radius/xl. 2 · Header: Title, Value with Trend, Description, optional Icon. 3 · Link: 2px rectangle, widget/grid, joining the two points. 4 · Start point: ellipse, chart/series-2. 5 · End point: ellipse, chart/series-1. 6 · Row label: text/chart-label, 11px."
     },
     {
      "type": "example",
      "label": "Medium",
      "description": "Dumbbell instance, Size=Medium, Value '4.6', Title 'Satisfaction', Show icon=false."
     },
     {
      "type": "text",
      "text": "Sizes: Small 330 wide (header left, mini plot right, no axes) · Vertical small 192 wide, no axes · Medium 375 wide with axes and labels · Large 375 wide with a divider and two-KPI summary · XL 800 wide, three KPIs."
     }
    ]
   },
   {
    "nodeId": "4459:1465",
    "number": "03",
    "heading": "Actual Figma API / defaults",
    "blocks": [
     {
      "type": "text",
      "text": "Chart / Dumbbell · set 4458:37527 · page \"Dumbbell chart\" under DATA VIZ."
     },
     {
      "type": "table",
      "columns": [
       "Property",
       "Type",
       "Default",
       "Notes"
      ],
      "rows": [
       [
        "Size",
        "VARIANT",
        "Small",
        "Small, Vertical small, Medium, Large, XL. Medium is the recommended default."
       ],
       [
        "Title",
        "TEXT",
        "Satisfaction",
        "Binds to the header title. In XL it binds to the first KPI title."
       ],
       [
        "Value",
        "TEXT",
        "4.6",
        "Binds to the headline figure. In Large it binds to the first summary figure."
       ],
       [
        "Show icon",
        "BOOLEAN",
        "false",
        "Off by default. Turn it on in Medium or XL; Small keeps text and plot only."
       ]
      ]
     }
    ]
   },
   {
    "nodeId": "4459:1496",
    "number": "04",
    "heading": "Current bindings / semantic mapping",
    "blocks": [
     {
      "type": "table",
      "columns": [
       "Layer",
       "Token",
       "Role"
      ],
      "rows": [
       [
        "Container fill",
        "widget/bg",
        "Card surface, same as the other data viz widgets"
       ],
       [
        "Container stroke",
        "border/subtle",
        "1px hairline"
       ],
       [
        "Container radius",
        "radius/xl",
        "12px"
       ],
       [
        "Start point",
        "chart/series-2",
        "Alias viz/4"
       ],
       [
        "End point",
        "chart/series-1",
        "Alias viz/1"
       ],
       [
        "Link",
        "widget/grid",
        "2px rectangle between the points"
       ],
       [
        "Title, Value",
        "text/primary",
        "Open Sans SemiBold 14, Bold 28"
       ],
       [
        "Axis label, Description",
        "text/chart-label",
        "Open Sans Regular 11 and 12"
       ],
       [
        "Trend",
        "status/success",
        "Open Sans SemiBold 12"
       ],
       [
        "Padding, gaps",
        "spacing/5 to spacing/7, spacing/2 to spacing/4",
        "16 or 24px padding; 4, 8, 12, 16, 20px gaps"
       ]
      ]
     },
     {
      "type": "text",
      "text": "All seven chart/* tokens are aliases of existing Semantic / Colors tokens, so Light, Dark and High Contrast resolve through the modes with no new hex values."
     }
    ]
   },
   {
    "nodeId": "4459:1546",
    "number": "05",
    "heading": "Accessibility contract",
    "blocks": [
     {
      "type": "checklist",
      "items": [
       "The chart has a text equivalent: role=\"img\" with a label naming both states, and a table of start and end values nearby.",
       "Start and end are told apart by color and position; add a legend when that is not obvious.",
       "Marks meet 3:1 against the card surface in Light, Dark and High Contrast.",
       "Trend text carries its sign (+ or -), not just color.",
       "Not interactive. If marks become links or filters, add focus rings from focus/ring and a keyboard order."
      ]
     }
    ]
   },
   {
    "nodeId": "4459:1556",
    "number": "06",
    "heading": "Responsive / content rules",
    "blocks": [
     {
      "type": "text",
      "text": "Pick the size by container width: Small and Vertical small under 360px, Medium and Large at 360 to 600px, XL above 720px. Keep titles to three words and values to one figure with its unit. Five rows at most in Medium, four in Small. Sort rows by gap size when the order is free, and keep the same order in every size."
     }
    ]
   }
  ]
 },
 "heatmap-chart": {
  "nodeId": "4459:1615",
  "title": "Heatmap chart",
  "category": "NORTHSTAR DS / COMPONENT SPECIFICATION · 11",
  "revision": "Reviewed 15 Oct 2026",
  "summary": "A data visualization card that shows a measure as the intensity of cells in a grid of two categories. Built natively for NorthStar after reviewing the Hyper charts kit; nothing was imported. Five sizes, three component properties, every fill bound to Semantic / Colors.",
  "meta": {
   "Review status": "Built 15 Oct 2026, not yet source-reviewed",
   "Parity status": "Docs site renders the same data as SVG",
   "Evidence boundary": "Figma inspection, not runtime or AT testing"
  },
  "sections": [
   {
    "nodeId": "4459:1631",
    "number": "01",
    "heading": "Purpose / when not to use",
    "blocks": [
     {
      "type": "note",
      "heading": "USE",
      "text": "Spot patterns across two categories at once: activity by weekday and hour, errors by service and day."
     },
     {
      "type": "note",
      "heading": "DO NOT USE",
      "text": "Do not use for exact values (Data table), for one category (Bar chart), or for trends over time (Line chart)."
     }
    ]
   },
   {
    "nodeId": "4459:1642",
    "number": "02",
    "heading": "Visual anatomy",
    "blocks": [
     {
      "type": "text",
      "text": "1 · Container: widget/bg fill, border/subtle stroke, radius/xl. 2 · Header: Title, Value with Trend, Description, optional Icon. 3 · Cell: rectangle, chart/series-1 with opacity from 12% to 100% by value, 3px radius, 3px gap. 4 · Row label: text/chart-label, 11px. 5 · Column labels: text/chart-label, three ticks."
     },
     {
      "type": "example",
      "label": "Medium",
      "description": "Heatmap instance, Size=Medium, Value '3,260', Title 'Activity', Show icon=false."
     },
     {
      "type": "text",
      "text": "Sizes: Small 330 wide (header left, mini plot right, no axes) · Vertical small 192 wide, no axes · Medium 375 wide with axes and labels · Large 375 wide with a divider and two-KPI summary · XL 800 wide, three KPIs."
     }
    ]
   },
   {
    "nodeId": "4459:1649",
    "number": "03",
    "heading": "Actual Figma API / defaults",
    "blocks": [
     {
      "type": "text",
      "text": "Chart / Heatmap · set 4458:38007 · page \"Heatmap chart\" under DATA VIZ."
     },
     {
      "type": "table",
      "columns": [
       "Property",
       "Type",
       "Default",
       "Notes"
      ],
      "rows": [
       [
        "Size",
        "VARIANT",
        "Small",
        "Small, Vertical small, Medium, Large, XL. Medium is the recommended default."
       ],
       [
        "Title",
        "TEXT",
        "Activity",
        "Binds to the header title. In XL it binds to the first KPI title."
       ],
       [
        "Value",
        "TEXT",
        "3,260",
        "Binds to the headline figure. In Large it binds to the first summary figure."
       ],
       [
        "Show icon",
        "BOOLEAN",
        "false",
        "Off by default. Turn it on in Medium or XL; Small keeps text and plot only."
       ]
      ]
     }
    ]
   },
   {
    "nodeId": "4459:1680",
    "number": "04",
    "heading": "Current bindings / semantic mapping",
    "blocks": [
     {
      "type": "table",
      "columns": [
       "Layer",
       "Token",
       "Role"
      ],
      "rows": [
       [
        "Container fill",
        "widget/bg",
        "Card surface, same as the other data viz widgets"
       ],
       [
        "Container stroke",
        "border/subtle",
        "1px hairline"
       ],
       [
        "Container radius",
        "radius/xl",
        "12px"
       ],
       [
        "Cell",
        "chart/series-1",
        "Opacity carries the value, 12% to 100%"
       ],
       [
        "Row label",
        "text/chart-label",
        "Open Sans Regular 11"
       ],
       [
        "Cell gap",
        "3px",
        "2px in compact sizes"
       ],
       [
        "Title, Value",
        "text/primary",
        "Open Sans SemiBold 14, Bold 28"
       ],
       [
        "Axis label, Description",
        "text/chart-label",
        "Open Sans Regular 11 and 12"
       ],
       [
        "Trend",
        "status/success",
        "Open Sans SemiBold 12"
       ],
       [
        "Padding, gaps",
        "spacing/5 to spacing/7, spacing/2 to spacing/4",
        "16 or 24px padding; 4, 8, 12, 16, 20px gaps"
       ]
      ]
     },
     {
      "type": "text",
      "text": "All seven chart/* tokens are aliases of existing Semantic / Colors tokens, so Light, Dark and High Contrast resolve through the modes with no new hex values."
     }
    ]
   },
   {
    "nodeId": "4459:1730",
    "number": "05",
    "heading": "Accessibility contract",
    "blocks": [
     {
      "type": "checklist",
      "items": [
       "The chart has a text equivalent: role=\"img\" with a label naming both categories, and a table of the values nearby.",
       "Intensity is a single-hue ramp, so it survives color-vision differences; show exact values in a table or on focus.",
       "The lightest cells are intentionally quiet and never carry meaning alone.",
       "Trend text carries its sign (+ or -), not just color.",
       "Not interactive. If marks become links or filters, add focus rings from focus/ring and a keyboard order."
      ]
     }
    ]
   },
   {
    "nodeId": "4459:1740",
    "number": "06",
    "heading": "Responsive / content rules",
    "blocks": [
     {
      "type": "text",
      "text": "Pick the size by container width: Small and Vertical small under 360px, Medium and Large at 360 to 600px, XL above 720px. Keep titles to three words and values to one figure with its unit. Twelve columns by five rows in Medium, eight by four in Small and Vertical small. Keep every value on one scale."
     }
    ]
   }
  ]
 },
 "parallel-coordinates-chart": {
  "nodeId": "4461:1232",
  "title": "Parallel coordinates chart",
  "category": "NORTHSTAR DS / COMPONENT SPECIFICATION · 12",
  "revision": "Reviewed 15 Oct 2026",
  "summary": "A data visualization card that compares several measures across profiles, one line per profile. Built natively for NorthStar after reviewing the Hyper charts kit; nothing was imported. Five sizes, three component properties, every fill bound to Semantic / Colors.",
  "meta": {
   "Review status": "Built 15 Oct 2026, not yet source-reviewed",
   "Parity status": "Docs site renders the same data as SVG",
   "Evidence boundary": "Figma inspection, not runtime or AT testing"
  },
  "sections": [
   {
    "nodeId": "4461:1248",
    "number": "01",
    "heading": "Purpose / when not to use",
    "blocks": [
     {
      "type": "note",
      "heading": "USE",
      "text": "Compare items across four to six measures at once and see which profiles move together: customer segments, product variants, test runs."
     },
     {
      "type": "note",
      "heading": "DO NOT USE",
      "text": "Do not use for two measures (Scatter), for time series (Line chart), or for more than eight profiles."
     }
    ]
   },
   {
    "nodeId": "4461:1259",
    "number": "02",
    "heading": "Visual anatomy",
    "blocks": [
     {
      "type": "text",
      "text": "1 · Container: widget/bg fill, border/subtle stroke, radius/xl. 2 · Header: Title, Value with Trend, Description, optional Icon. 3 · Axis: 1px rectangle per measure, widget/grid. 4 · Profile line: vector path, chart/series-1 to 4, 2px, round joins. 5 · Axis labels: text/chart-label, 11px, under each axis."
     },
     {
      "type": "example",
      "label": "Medium",
      "description": "Parallel coordinates instance, Size=Medium, Value '128', Title 'Profiles', Show icon=false."
     },
     {
      "type": "text",
      "text": "Sizes: Small 330 wide (header left, mini plot right, no axes) · Vertical small 192 wide, no axes · Medium 375 wide with axes and labels · Large 375 wide with a divider and two-KPI summary · XL 800 wide, three KPIs."
     }
    ]
   },
   {
    "nodeId": "4461:1266",
    "number": "03",
    "heading": "Actual Figma API / defaults",
    "blocks": [
     {
      "type": "text",
      "text": "Chart / Parallel coordinates · set 4460:166 · page \"Parallel coordinates chart\" under DATA VIZ."
     },
     {
      "type": "table",
      "columns": [
       "Property",
       "Type",
       "Default",
       "Notes"
      ],
      "rows": [
       [
        "Size",
        "VARIANT",
        "Small",
        "Small, Vertical small, Medium, Large, XL. Medium is the recommended default."
       ],
       [
        "Title",
        "TEXT",
        "Profiles",
        "Binds to the header title. In XL it binds to the first KPI title."
       ],
       [
        "Value",
        "TEXT",
        "128",
        "Binds to the headline figure. In Large it binds to the first summary figure."
       ],
       [
        "Show icon",
        "BOOLEAN",
        "false",
        "Off by default. Turn it on in Medium or XL; Small keeps text and plot only."
       ]
      ]
     }
    ]
   },
   {
    "nodeId": "4461:1297",
    "number": "04",
    "heading": "Current bindings / semantic mapping",
    "blocks": [
     {
      "type": "table",
      "columns": [
       "Layer",
       "Token",
       "Role"
      ],
      "rows": [
       [
        "Container fill",
        "widget/bg",
        "Card surface, same as the other data viz widgets"
       ],
       [
        "Container stroke",
        "border/subtle",
        "1px hairline"
       ],
       [
        "Container radius",
        "radius/xl",
        "12px"
       ],
       [
        "Profile line",
        "chart/series-1 to chart/series-4",
        "2px stroke, the only vector layers in the set"
       ],
       [
        "Axis",
        "widget/grid",
        "1px rectangle per measure"
       ],
       [
        "Axis label",
        "text/chart-label",
        "Dropped in Small and Vertical small"
       ],
       [
        "Title, Value",
        "text/primary",
        "Open Sans SemiBold 14, Bold 28"
       ],
       [
        "Axis label, Description",
        "text/chart-label",
        "Open Sans Regular 11 and 12"
       ],
       [
        "Trend",
        "status/success",
        "Open Sans SemiBold 12"
       ],
       [
        "Padding, gaps",
        "spacing/5 to spacing/7, spacing/2 to spacing/4",
        "16 or 24px padding; 4, 8, 12, 16, 20px gaps"
       ]
      ]
     },
     {
      "type": "text",
      "text": "All seven chart/* tokens are aliases of existing Semantic / Colors tokens, so Light, Dark and High Contrast resolve through the modes with no new hex values."
     }
    ]
   },
   {
    "nodeId": "4461:1347",
    "number": "05",
    "heading": "Accessibility contract",
    "blocks": [
     {
      "type": "checklist",
      "items": [
       "The chart has a text equivalent: role=\"img\" with a label naming the measures, and a table of the values per profile nearby.",
       "Lines are told apart by label or by highlighting one profile at a time, not color alone.",
       "Marks meet 3:1 against the card surface in Light, Dark and High Contrast.",
       "Trend text carries its sign (+ or -), not just color.",
       "Not interactive. If marks become links or filters, add focus rings from focus/ring and a keyboard order."
      ]
     }
    ]
   },
   {
    "nodeId": "4461:1357",
    "number": "06",
    "heading": "Responsive / content rules",
    "blocks": [
     {
      "type": "text",
      "text": "Pick the size by container width: Small and Vertical small under 360px, Medium and Large at 360 to 600px, XL above 720px. Keep titles to three words and values to one figure with its unit. Five axes in Medium and above, four in Small. Normalize every axis to 0 to 1 and keep the axis order in every size."
     }
    ]
   }
  ]
 },
 "stepped-line-chart": {
  "nodeId": "4461:1416",
  "title": "Stepped line chart",
  "category": "NORTHSTAR DS / COMPONENT SPECIFICATION · 13",
  "revision": "Reviewed 15 Oct 2026",
  "summary": "A data visualization card that shows a value that changes only at set points in time. Built natively for NorthStar after reviewing the Hyper charts kit; nothing was imported. Five sizes, three component properties, every fill bound to Semantic / Colors.",
  "meta": {
   "Review status": "Built 15 Oct 2026, not yet source-reviewed",
   "Parity status": "Docs site renders the same data as SVG",
   "Evidence boundary": "Figma inspection, not runtime or AT testing"
  },
  "sections": [
   {
    "nodeId": "4461:1432",
    "number": "01",
    "heading": "Purpose / when not to use",
    "blocks": [
     {
      "type": "note",
      "heading": "USE",
      "text": "Show limits, prices or plan tiers that hold steady until a date and then change: quotas, rates, plan limits."
     },
     {
      "type": "note",
      "heading": "DO NOT USE",
      "text": "Do not use for continuous measures (Line chart), for totals by category (Bar chart), or for a single value."
     }
    ]
   },
   {
    "nodeId": "4461:1443",
    "number": "02",
    "heading": "Visual anatomy",
    "blocks": [
     {
      "type": "text",
      "text": "1 · Container: widget/bg fill, border/subtle stroke, radius/xl. 2 · Header: Title, Value with Trend, Description, optional Icon. 3 · Gridlines: 1px rectangles, widget/grid. 4 · Axis labels: text/chart-label, 11px. 5 · Series: vector path of horizontal and vertical segments, chart/series-1 and chart/series-3, 2px."
     },
     {
      "type": "example",
      "label": "Medium",
      "description": "Stepped line instance, Size=Medium, Value '2,400', Title 'Plan limit', Show icon=false."
     },
     {
      "type": "text",
      "text": "Sizes: Small 330 wide (header left, mini plot right, no axes) · Vertical small 192 wide, no axes · Medium 375 wide with axes and labels · Large 375 wide with a divider and two-KPI summary · XL 800 wide, three KPIs."
     }
    ]
   },
   {
    "nodeId": "4461:1450",
    "number": "03",
    "heading": "Actual Figma API / defaults",
    "blocks": [
     {
      "type": "text",
      "text": "Chart / Stepped line · set 4460:37871 · page \"Stepped line chart\" under DATA VIZ."
     },
     {
      "type": "table",
      "columns": [
       "Property",
       "Type",
       "Default",
       "Notes"
      ],
      "rows": [
       [
        "Size",
        "VARIANT",
        "Small",
        "Small, Vertical small, Medium, Large, XL. Medium is the recommended default."
       ],
       [
        "Title",
        "TEXT",
        "Plan limit",
        "Binds to the header title. In XL it binds to the first KPI title."
       ],
       [
        "Value",
        "TEXT",
        "2,400",
        "Binds to the headline figure. In Large it binds to the first summary figure."
       ],
       [
        "Show icon",
        "BOOLEAN",
        "false",
        "Off by default. Turn it on in Medium or XL; Small keeps text and plot only."
       ]
      ]
     }
    ]
   },
   {
    "nodeId": "4461:1481",
    "number": "04",
    "heading": "Current bindings / semantic mapping",
    "blocks": [
     {
      "type": "table",
      "columns": [
       "Layer",
       "Token",
       "Role"
      ],
      "rows": [
       [
        "Container fill",
        "widget/bg",
        "Card surface, same as the other data viz widgets"
       ],
       [
        "Container stroke",
        "border/subtle",
        "1px hairline"
       ],
       [
        "Container radius",
        "radius/xl",
        "12px"
       ],
       [
        "Series line",
        "chart/series-1, chart/series-3",
        "2px stroke with square corners; a vector path"
       ],
       [
        "Gridline",
        "widget/grid",
        "1px rectangle, no axis line"
       ],
       [
        "Axis label",
        "text/chart-label",
        "Open Sans Regular 11"
       ],
       [
        "Title, Value",
        "text/primary",
        "Open Sans SemiBold 14, Bold 28"
       ],
       [
        "Axis label, Description",
        "text/chart-label",
        "Open Sans Regular 11 and 12"
       ],
       [
        "Trend",
        "status/success",
        "Open Sans SemiBold 12"
       ],
       [
        "Padding, gaps",
        "spacing/5 to spacing/7, spacing/2 to spacing/4",
        "16 or 24px padding; 4, 8, 12, 16, 20px gaps"
       ]
      ]
     },
     {
      "type": "text",
      "text": "All seven chart/* tokens are aliases of existing Semantic / Colors tokens, so Light, Dark and High Contrast resolve through the modes with no new hex values."
     }
    ]
   },
   {
    "nodeId": "4461:1531",
    "number": "05",
    "heading": "Accessibility contract",
    "blocks": [
     {
      "type": "checklist",
      "items": [
       "The chart has a text equivalent: role=\"img\" with a label that states the values and the dates they change.",
       "Series are told apart by label and position, not color alone.",
       "Marks meet 3:1 against the card surface in Light, Dark and High Contrast.",
       "Trend text carries its sign (+ or -), not just color.",
       "Not interactive. If marks become links or filters, add focus rings from focus/ring and a keyboard order."
      ]
     }
    ]
   },
   {
    "nodeId": "4461:1541",
    "number": "06",
    "heading": "Responsive / content rules",
    "blocks": [
     {
      "type": "text",
      "text": "Pick the size by container width: Small and Vertical small under 360px, Medium and Large at 360 to 600px, XL above 720px. Keep titles to three words and values to one figure with its unit. Two series at most. Step edges sit on the date they change, so keep the time axis uniform."
     }
    ]
   }
  ]
 },
 "scatter-chart": {
  "nodeId": "4461:1600",
  "title": "Scatter chart",
  "category": "NORTHSTAR DS / COMPONENT SPECIFICATION · 14",
  "revision": "Reviewed 15 Oct 2026",
  "summary": "A data visualization card that plots samples on two measures and shows the relationship between them. Built natively for NorthStar after reviewing the Hyper charts kit; nothing was imported. Five sizes, three component properties, every fill bound to Semantic / Colors.",
  "meta": {
   "Review status": "Built 15 Oct 2026, not yet source-reviewed",
   "Parity status": "Docs site renders the same data as SVG",
   "Evidence boundary": "Figma inspection, not runtime or AT testing"
  },
  "sections": [
   {
    "nodeId": "4461:1616",
    "number": "01",
    "heading": "Purpose / when not to use",
    "blocks": [
     {
      "type": "note",
      "heading": "USE",
      "text": "Show how two measures relate across many samples: spend and tenure, load and latency, with an optional trend line."
     },
     {
      "type": "note",
      "heading": "DO NOT USE",
      "text": "Do not use for a third measure (Bubble chart), for fewer than ten samples (Bar chart), or for time series (Line chart)."
     }
    ]
   },
   {
    "nodeId": "4461:1627",
    "number": "02",
    "heading": "Visual anatomy",
    "blocks": [
     {
      "type": "text",
      "text": "1 · Container: widget/bg fill, border/subtle stroke, radius/xl. 2 · Header: Title, Value with Trend, Description, optional Icon. 3 · Gridlines: 1px rectangles, widget/grid. 4 · Axis labels: text/chart-label, 11px. 5 · Points: ellipses, chart/series-1 and chart/series-2 at 85% opacity. 6 · Trend line: 1.5px vector path, chart/target."
     },
     {
      "type": "example",
      "label": "Medium",
      "description": "Scatter instance, Size=Medium, Value '240', Title 'Samples', Show icon=false."
     },
     {
      "type": "text",
      "text": "Sizes: Small 330 wide (header left, mini plot right, no axes) · Vertical small 192 wide, no axes · Medium 375 wide with axes and labels · Large 375 wide with a divider and two-KPI summary · XL 800 wide, three KPIs."
     }
    ]
   },
   {
    "nodeId": "4461:1634",
    "number": "03",
    "heading": "Actual Figma API / defaults",
    "blocks": [
     {
      "type": "text",
      "text": "Chart / Scatter · set 4460:38167 · page \"Scatter chart\" under DATA VIZ."
     },
     {
      "type": "table",
      "columns": [
       "Property",
       "Type",
       "Default",
       "Notes"
      ],
      "rows": [
       [
        "Size",
        "VARIANT",
        "Small",
        "Small, Vertical small, Medium, Large, XL. Medium is the recommended default."
       ],
       [
        "Title",
        "TEXT",
        "Samples",
        "Binds to the header title. In XL it binds to the first KPI title."
       ],
       [
        "Value",
        "TEXT",
        "240",
        "Binds to the headline figure. In Large it binds to the first summary figure."
       ],
       [
        "Show icon",
        "BOOLEAN",
        "false",
        "Off by default. Turn it on in Medium or XL; Small keeps text and plot only."
       ]
      ]
     }
    ]
   },
   {
    "nodeId": "4461:1665",
    "number": "04",
    "heading": "Current bindings / semantic mapping",
    "blocks": [
     {
      "type": "table",
      "columns": [
       "Layer",
       "Token",
       "Role"
      ],
      "rows": [
       [
        "Container fill",
        "widget/bg",
        "Card surface, same as the other data viz widgets"
       ],
       [
        "Container stroke",
        "border/subtle",
        "1px hairline"
       ],
       [
        "Container radius",
        "radius/xl",
        "12px"
       ],
       [
        "Point",
        "chart/series-1, chart/series-2",
        "Alias viz/1 and viz/4; 85% opacity"
       ],
       [
        "Trend line",
        "chart/target",
        "1.5px vector path, alias text/primary"
       ],
       [
        "Gridline",
        "widget/grid",
        "1px rectangle"
       ],
       [
        "Title, Value",
        "text/primary",
        "Open Sans SemiBold 14, Bold 28"
       ],
       [
        "Axis label, Description",
        "text/chart-label",
        "Open Sans Regular 11 and 12"
       ],
       [
        "Trend",
        "status/success",
        "Open Sans SemiBold 12"
       ],
       [
        "Padding, gaps",
        "spacing/5 to spacing/7, spacing/2 to spacing/4",
        "16 or 24px padding; 4, 8, 12, 16, 20px gaps"
       ]
      ]
     },
     {
      "type": "text",
      "text": "All seven chart/* tokens are aliases of existing Semantic / Colors tokens, so Light, Dark and High Contrast resolve through the modes with no new hex values."
     }
    ]
   },
   {
    "nodeId": "4461:1715",
    "number": "05",
    "heading": "Accessibility contract",
    "blocks": [
     {
      "type": "checklist",
      "items": [
       "The chart has a text equivalent: role=\"img\" with a label that states the relationship, and a table of the values nearby.",
       "Groups are told apart by label or shape in a legend, not color alone.",
       "Marks meet 3:1 against the card surface in Light, Dark and High Contrast.",
       "Trend text carries its sign (+ or -), not just color.",
       "Not interactive. If marks become links or filters, add focus rings from focus/ring and a keyboard order."
      ]
     }
    ]
   },
   {
    "nodeId": "4461:1725",
    "number": "06",
    "heading": "Responsive / content rules",
    "blocks": [
     {
      "type": "text",
      "text": "Pick the size by container width: Small and Vertical small under 360px, Medium and Large at 360 to 600px, XL above 720px. Keep titles to three words and values to one figure with its unit. The demo shows twelve points in Small sizes and eighteen above. Real data can be denser; reduce point size before opacity."
     }
    ]
   }
  ]
 },
 "gauge-chart": {
  "nodeId": "4461:1784",
  "title": "Gauge chart",
  "category": "NORTHSTAR DS / COMPONENT SPECIFICATION · 15",
  "revision": "Reviewed 15 Oct 2026",
  "summary": "A data visualization card that shows one value against a limit on a half circle. Built natively for NorthStar after reviewing the Hyper charts kit; nothing was imported. Five sizes, three component properties, every fill bound to Semantic / Colors.",
  "meta": {
   "Review status": "Built 15 Oct 2026, not yet source-reviewed",
   "Parity status": "Docs site renders the same data as SVG",
   "Evidence boundary": "Figma inspection, not runtime or AT testing"
  },
  "sections": [
   {
    "nodeId": "4461:1800",
    "number": "01",
    "heading": "Purpose / when not to use",
    "blocks": [
     {
      "type": "note",
      "heading": "USE",
      "text": "Show a single measure against its ceiling: capacity used, quota, budget."
     },
     {
      "type": "note",
      "heading": "DO NOT USE",
      "text": "Do not use for more than one measure (Bullet chart), for trends (Line chart), or for parts of a whole (Donut chart)."
     }
    ]
   },
   {
    "nodeId": "4461:1811",
    "number": "02",
    "heading": "Visual anatomy",
    "blocks": [
     {
      "type": "text",
      "text": "1 · Container: widget/bg fill, border/subtle stroke, radius/xl. 2 · Header: Title, Value with Trend, Description, optional Icon. 3 · Track: ellipse arc, chart/track, 180 degrees. 4 · Value: ellipse arc, chart/series-1, sweep proportional to the value. 5 · Value label: Open Sans Bold, text/primary. 6 · Min and max: text/chart-label."
     },
     {
      "type": "example",
      "label": "Medium",
      "description": "Gauge instance, Size=Medium, Value '72%', Title 'Capacity', Show icon=false."
     },
     {
      "type": "text",
      "text": "Sizes: Small 330 wide (header left, mini plot right, no axes) · Vertical small 192 wide, no axes · Medium 375 wide with axes and labels · Large 375 wide with a divider and two-KPI summary · XL 800 wide, three KPIs."
     }
    ]
   },
   {
    "nodeId": "4461:1818",
    "number": "03",
    "heading": "Actual Figma API / defaults",
    "blocks": [
     {
      "type": "text",
      "text": "Chart / Gauge · set 4460:38422 · page \"Gauge chart\" under DATA VIZ."
     },
     {
      "type": "table",
      "columns": [
       "Property",
       "Type",
       "Default",
       "Notes"
      ],
      "rows": [
       [
        "Size",
        "VARIANT",
        "Small",
        "Small, Vertical small, Medium, Large, XL. Medium is the recommended default."
       ],
       [
        "Title",
        "TEXT",
        "Capacity",
        "Binds to the header title. In XL it binds to the first KPI title."
       ],
       [
        "Value",
        "TEXT",
        "72%",
        "Binds to the headline figure. In Large it binds to the first summary figure."
       ],
       [
        "Show icon",
        "BOOLEAN",
        "false",
        "Off by default. Turn it on in Medium or XL; Small keeps text and plot only."
       ]
      ]
     }
    ]
   },
   {
    "nodeId": "4461:1849",
    "number": "04",
    "heading": "Current bindings / semantic mapping",
    "blocks": [
     {
      "type": "table",
      "columns": [
       "Layer",
       "Token",
       "Role"
      ],
      "rows": [
       [
        "Container fill",
        "widget/bg",
        "Card surface, same as the other data viz widgets"
       ],
       [
        "Container stroke",
        "border/subtle",
        "1px hairline"
       ],
       [
        "Container radius",
        "radius/xl",
        "12px"
       ],
       [
        "Value arc",
        "chart/series-1",
        "Ellipse with arc data, inner radius 72%"
       ],
       [
        "Track arc",
        "chart/track",
        "Alias widget/track"
       ],
       [
        "Value label",
        "text/primary",
        "Open Sans Bold 24, 14 in compact sizes"
       ],
       [
        "Title, Value",
        "text/primary",
        "Open Sans SemiBold 14, Bold 28"
       ],
       [
        "Axis label, Description",
        "text/chart-label",
        "Open Sans Regular 11 and 12"
       ],
       [
        "Trend",
        "status/success",
        "Open Sans SemiBold 12"
       ],
       [
        "Padding, gaps",
        "spacing/5 to spacing/7, spacing/2 to spacing/4",
        "16 or 24px padding; 4, 8, 12, 16, 20px gaps"
       ]
      ]
     },
     {
      "type": "text",
      "text": "All seven chart/* tokens are aliases of existing Semantic / Colors tokens, so Light, Dark and High Contrast resolve through the modes with no new hex values."
     }
    ]
   },
   {
    "nodeId": "4461:1899",
    "number": "05",
    "heading": "Accessibility contract",
    "blocks": [
     {
      "type": "checklist",
      "items": [
       "The chart has a text equivalent: role=\"img\" with the value and the limit in the label, for example \"72 percent of the limit used\".",
       "The value is also printed as text inside the arc, so the arc length is never the only signal.",
       "Marks meet 3:1 against the card surface in Light, Dark and High Contrast.",
       "Trend text carries its sign (+ or -), not just color.",
       "Not interactive. If marks become links or filters, add focus rings from focus/ring and a keyboard order."
      ]
     }
    ]
   },
   {
    "nodeId": "4461:1909",
    "number": "06",
    "heading": "Responsive / content rules",
    "blocks": [
     {
      "type": "text",
      "text": "Pick the size by container width: Small and Vertical small under 360px, Medium and Large at 360 to 600px, XL above 720px. Keep titles to three words and values to one figure with its unit. One gauge per card. Keep the value label inside the arc and put the unit in the title. Compact sizes drop min and max."
     }
    ]
   }
  ]
 },
 "radial-bar-chart": {
  "nodeId": "4462:39105",
  "title": "Radial bar chart",
  "category": "NORTHSTAR DS / COMPONENT SPECIFICATION · 16",
  "revision": "Reviewed 15 Oct 2026",
  "summary": "A data visualization card that shows progress toward a target as concentric rings. Built natively for NorthStar after reviewing the Hyper charts kit; nothing was imported. Five sizes, three component properties, every fill bound to Semantic / Colors.",
  "meta": {
   "Review status": "Built 15 Oct 2026, not yet source-reviewed",
   "Parity status": "Docs site renders the same data as SVG",
   "Evidence boundary": "Figma inspection, not runtime or AT testing"
  },
  "sections": [
   {
    "nodeId": "4462:39121",
    "number": "01",
    "heading": "Purpose / when not to use",
    "blocks": [
     {
      "type": "note",
      "heading": "USE",
      "text": "Compare progress for three to four goals against the same target in a compact space: goals, quotas, onboarding steps."
     },
     {
      "type": "note",
      "heading": "DO NOT USE",
      "text": "Do not use for parts of a whole (Donut chart), for exact comparison (Horizontal bar chart), or for more than five rings."
     }
    ]
   },
   {
    "nodeId": "4462:39132",
    "number": "02",
    "heading": "Visual anatomy",
    "blocks": [
     {
      "type": "text",
      "text": "1 · Container: widget/bg fill, border/subtle stroke, radius/xl. 2 · Header: Title, Value with Trend, Description, optional Icon. 3 · Track: ellipse arc, chart/track, 270 degrees per ring. 4 · Value: ellipse arc, chart/series-1 to 4, sweep proportional to the value. 5 · Rings step inward with a gap of 5% of the outer radius."
     },
     {
      "type": "example",
      "label": "Medium",
      "description": "Radial bar instance, Size=Medium, Value '78%', Title 'Progress', Show icon=false."
     },
     {
      "type": "text",
      "text": "Sizes: Small 330 wide (header left, mini plot right, no axes) · Vertical small 192 wide, no axes · Medium 375 wide with axes and labels · Large 375 wide with a divider and two-KPI summary · XL 800 wide, three KPIs."
     }
    ]
   },
   {
    "nodeId": "4462:39139",
    "number": "03",
    "heading": "Actual Figma API / defaults",
    "blocks": [
     {
      "type": "text",
      "text": "Chart / Radial bar · set 4462:148 · page \"Radial bar chart\" under DATA VIZ."
     },
     {
      "type": "table",
      "columns": [
       "Property",
       "Type",
       "Default",
       "Notes"
      ],
      "rows": [
       [
        "Size",
        "VARIANT",
        "Small",
        "Small, Vertical small, Medium, Large, XL. Medium is the recommended default."
       ],
       [
        "Title",
        "TEXT",
        "Progress",
        "Binds to the header title. In XL it binds to the first KPI title."
       ],
       [
        "Value",
        "TEXT",
        "78%",
        "Binds to the headline figure. In Large it binds to the first summary figure."
       ],
       [
        "Show icon",
        "BOOLEAN",
        "false",
        "Off by default. Turn it on in Medium or XL; Small keeps text and plot only."
       ]
      ]
     }
    ]
   },
   {
    "nodeId": "4462:39170",
    "number": "04",
    "heading": "Current bindings / semantic mapping",
    "blocks": [
     {
      "type": "table",
      "columns": [
       "Layer",
       "Token",
       "Role"
      ],
      "rows": [
       [
        "Container fill",
        "widget/bg",
        "Card surface, same as the other data viz widgets"
       ],
       [
        "Container stroke",
        "border/subtle",
        "1px hairline"
       ],
       [
        "Container radius",
        "radius/xl",
        "12px"
       ],
       [
        "Value ring",
        "chart/series-1 to chart/series-4",
        "Ellipse with arc data, one per goal"
       ],
       [
        "Track ring",
        "chart/track",
        "Alias widget/track, 270 degrees"
       ],
       [
        "Ring gap",
        "5% of the radius",
        "Inner rings are shorter, so compare by value, not by arc length"
       ],
       [
        "Title, Value",
        "text/primary",
        "Open Sans SemiBold 14, Bold 28"
       ],
       [
        "Axis label, Description",
        "text/chart-label",
        "Open Sans Regular 11 and 12"
       ],
       [
        "Trend",
        "status/success",
        "Open Sans SemiBold 12"
       ],
       [
        "Padding, gaps",
        "spacing/5 to spacing/7, spacing/2 to spacing/4",
        "16 or 24px padding; 4, 8, 12, 16, 20px gaps"
       ]
      ]
     },
     {
      "type": "text",
      "text": "All seven chart/* tokens are aliases of existing Semantic / Colors tokens, so Light, Dark and High Contrast resolve through the modes with no new hex values."
     }
    ]
   },
   {
    "nodeId": "4462:39220",
    "number": "05",
    "heading": "Accessibility contract",
    "blocks": [
     {
      "type": "checklist",
      "items": [
       "The chart has a text equivalent: role=\"img\" with a label naming each goal and its value.",
       "Rings are told apart by order and label, not color alone; the outer ring is always the first goal.",
       "Marks meet 3:1 against the card surface in Light, Dark and High Contrast.",
       "Trend text carries its sign (+ or -), not just color.",
       "Not interactive. If marks become links or filters, add focus rings from focus/ring and a keyboard order."
      ]
     }
    ]
   },
   {
    "nodeId": "4462:39230",
    "number": "06",
    "heading": "Responsive / content rules",
    "blocks": [
     {
      "type": "text",
      "text": "Pick the size by container width: Small and Vertical small under 360px, Medium and Large at 360 to 600px, XL above 720px. Keep titles to three words and values to one figure with its unit. Four rings at most. Inner rings travel less distance, so label values or keep a table nearby."
     }
    ]
   }
  ]
 },
 "radial-histogram-chart": {
  "nodeId": "4462:39289",
  "title": "Radial histogram chart",
  "category": "NORTHSTAR DS / COMPONENT SPECIFICATION · 17",
  "revision": "Reviewed 15 Oct 2026",
  "summary": "A data visualization card that shows counts around a circle, one bar per hour or direction. Built natively for NorthStar after reviewing the Hyper charts kit; nothing was imported. Five sizes, three component properties, every fill bound to Semantic / Colors.",
  "meta": {
   "Review status": "Built 15 Oct 2026, not yet source-reviewed",
   "Parity status": "Docs site renders the same data as SVG",
   "Evidence boundary": "Figma inspection, not runtime or AT testing"
  },
  "sections": [
   {
    "nodeId": "4462:39305",
    "number": "01",
    "heading": "Purpose / when not to use",
    "blocks": [
     {
      "type": "note",
      "heading": "USE",
      "text": "Show a cyclic measure where the end meets the start: hours of the day, days of the week, compass direction."
     },
     {
      "type": "note",
      "heading": "DO NOT USE",
      "text": "Do not use for a measure with no cycle (Bar chart), for exact comparison (Horizontal bar chart), or for time series that do not repeat (Line chart)."
     }
    ]
   },
   {
    "nodeId": "4462:39316",
    "number": "02",
    "heading": "Visual anatomy",
    "blocks": [
     {
      "type": "text",
      "text": "1 · Container: widget/bg fill, border/subtle stroke, radius/xl. 2 · Header: Title, Value with Trend, Description, optional Icon. 3 · Bar: ellipse arc segment, 14 degrees wide with a 1 degree gap, chart/series-1; reference hours use chart/series-2. 4 · Inner radius: 28% of the outer radius, so short bars stay visible."
     },
     {
      "type": "example",
      "label": "Medium",
      "description": "Radial histogram instance, Size=Medium, Value '1,860', Title 'Requests', Show icon=false."
     },
     {
      "type": "text",
      "text": "Sizes: Small 330 wide (header left, mini plot right, no axes) · Vertical small 192 wide, no axes · Medium 375 wide with axes and labels · Large 375 wide with a divider and two-KPI summary · XL 800 wide, three KPIs."
     }
    ]
   },
   {
    "nodeId": "4462:39323",
    "number": "03",
    "heading": "Actual Figma API / defaults",
    "blocks": [
     {
      "type": "text",
      "text": "Chart / Radial histogram · set 4462:38356 · page \"Radial histogram chart\" under DATA VIZ."
     },
     {
      "type": "table",
      "columns": [
       "Property",
       "Type",
       "Default",
       "Notes"
      ],
      "rows": [
       [
        "Size",
        "VARIANT",
        "Small",
        "Small, Vertical small, Medium, Large, XL. Medium is the recommended default."
       ],
       [
        "Title",
        "TEXT",
        "Requests",
        "Binds to the header title. In XL it binds to the first KPI title."
       ],
       [
        "Value",
        "TEXT",
        "1,860",
        "Binds to the headline figure. In Large it binds to the first summary figure."
       ],
       [
        "Show icon",
        "BOOLEAN",
        "false",
        "Off by default. Turn it on in Medium or XL; Small keeps text and plot only."
       ]
      ]
     }
    ]
   },
   {
    "nodeId": "4462:39354",
    "number": "04",
    "heading": "Current bindings / semantic mapping",
    "blocks": [
     {
      "type": "table",
      "columns": [
       "Layer",
       "Token",
       "Role"
      ],
      "rows": [
       [
        "Container fill",
        "widget/bg",
        "Card surface, same as the other data viz widgets"
       ],
       [
        "Container stroke",
        "border/subtle",
        "1px hairline"
       ],
       [
        "Container radius",
        "radius/xl",
        "12px"
       ],
       [
        "Bar",
        "chart/series-1",
        "Ellipse with arc data, one per slot"
       ],
       [
        "Highlighted bar",
        "chart/series-2",
        "Every sixth slot marks a reference hour"
       ],
       [
        "Inner radius",
        "28% of the outer radius",
        "Keeps short bars readable"
       ],
       [
        "Title, Value",
        "text/primary",
        "Open Sans SemiBold 14, Bold 28"
       ],
       [
        "Axis label, Description",
        "text/chart-label",
        "Open Sans Regular 11 and 12"
       ],
       [
        "Trend",
        "status/success",
        "Open Sans SemiBold 12"
       ],
       [
        "Padding, gaps",
        "spacing/5 to spacing/7, spacing/2 to spacing/4",
        "16 or 24px padding; 4, 8, 12, 16, 20px gaps"
       ]
      ]
     },
     {
      "type": "text",
      "text": "All seven chart/* tokens are aliases of existing Semantic / Colors tokens, so Light, Dark and High Contrast resolve through the modes with no new hex values."
     }
    ]
   },
   {
    "nodeId": "4462:39404",
    "number": "05",
    "heading": "Accessibility contract",
    "blocks": [
     {
      "type": "checklist",
      "items": [
       "The chart has a text equivalent: role=\"img\" with a label that names the cycle, and a table of the values per slot nearby.",
       "The start of the cycle is stated in text; the circle alone does not show it.",
       "Marks meet 3:1 against the card surface in Light, Dark and High Contrast.",
       "Trend text carries its sign (+ or -), not just color.",
       "Not interactive. If marks become links or filters, add focus rings from focus/ring and a keyboard order."
      ]
     }
    ]
   },
   {
    "nodeId": "4462:39414",
    "number": "06",
    "heading": "Responsive / content rules",
    "blocks": [
     {
      "type": "text",
      "text": "Pick the size by container width: Small and Vertical small under 360px, Medium and Large at 360 to 600px, XL above 720px. Keep titles to three words and values to one figure with its unit. 24 bars in every size. State the start of the cycle in the title or description, since the circle has no left edge."
     }
    ]
   }
  ]
 },
 "radar-chart": {
  "nodeId": "4462:39473",
  "title": "Radar chart",
  "category": "NORTHSTAR DS / COMPONENT SPECIFICATION · 18",
  "revision": "Reviewed 15 Oct 2026",
  "summary": "A data visualization card that compares several measures for one or two items on radial axes. Built natively for NorthStar after reviewing the Hyper charts kit; nothing was imported. Five sizes, three component properties, every fill bound to Semantic / Colors.",
  "meta": {
   "Review status": "Built 15 Oct 2026, not yet source-reviewed",
   "Parity status": "Docs site renders the same data as SVG",
   "Evidence boundary": "Figma inspection, not runtime or AT testing"
  },
  "sections": [
   {
    "nodeId": "4462:39489",
    "number": "01",
    "heading": "Purpose / when not to use",
    "blocks": [
     {
      "type": "note",
      "heading": "USE",
      "text": "Compare an item against a target or another item across five to eight measures: skills, quality attributes, coverage."
     },
     {
      "type": "note",
      "heading": "DO NOT USE",
      "text": "Do not use for exact values (Data table), for more than three items, or for fewer than five measures (Bar chart)."
     }
    ]
   },
   {
    "nodeId": "4462:39500",
    "number": "02",
    "heading": "Visual anatomy",
    "blocks": [
     {
      "type": "text",
      "text": "1 · Container: widget/bg fill, border/subtle stroke, radius/xl. 2 · Header: Title, Value with Trend, Description, optional Icon. 3 · Rings: closed vector paths, widget/grid, at 33%, 66% and 100%. 4 · Axes: 1px vector paths from the center. 5 · Series: closed vector path, 22% fill and 2px stroke, chart/series-3 and chart/series-1. 6 · Axis labels: text/chart-label, 11px."
     },
     {
      "type": "example",
      "label": "Medium",
      "description": "Radar instance, Size=Medium, Value '86%', Title 'Coverage', Show icon=false."
     },
     {
      "type": "text",
      "text": "Sizes: Small 330 wide (header left, mini plot right, no axes) · Vertical small 192 wide, no axes · Medium 375 wide with axes and labels · Large 375 wide with a divider and two-KPI summary · XL 800 wide, three KPIs."
     }
    ]
   },
   {
    "nodeId": "4462:39507",
    "number": "03",
    "heading": "Actual Figma API / defaults",
    "blocks": [
     {
      "type": "text",
      "text": "Chart / Radar · set 4462:38673 · page \"Radar chart\" under DATA VIZ."
     },
     {
      "type": "table",
      "columns": [
       "Property",
       "Type",
       "Default",
       "Notes"
      ],
      "rows": [
       [
        "Size",
        "VARIANT",
        "Small",
        "Small, Vertical small, Medium, Large, XL. Medium is the recommended default."
       ],
       [
        "Title",
        "TEXT",
        "Coverage",
        "Binds to the header title. In XL it binds to the first KPI title."
       ],
       [
        "Value",
        "TEXT",
        "86%",
        "Binds to the headline figure. In Large it binds to the first summary figure."
       ],
       [
        "Show icon",
        "BOOLEAN",
        "false",
        "Off by default. Turn it on in Medium or XL; Small keeps text and plot only."
       ]
      ]
     }
    ]
   },
   {
    "nodeId": "4462:39538",
    "number": "04",
    "heading": "Current bindings / semantic mapping",
    "blocks": [
     {
      "type": "table",
      "columns": [
       "Layer",
       "Token",
       "Role"
      ],
      "rows": [
       [
        "Container fill",
        "widget/bg",
        "Card surface, same as the other data viz widgets"
       ],
       [
        "Container stroke",
        "border/subtle",
        "1px hairline"
       ],
       [
        "Container radius",
        "radius/xl",
        "12px"
       ],
       [
        "Series area",
        "chart/series-1, chart/series-3",
        "22% fill with a 2px stroke of the same token"
       ],
       [
        "Ring and axis",
        "widget/grid",
        "1px vector paths"
       ],
       [
        "Axis label",
        "text/chart-label",
        "Dropped in Small and Vertical small"
       ],
       [
        "Title, Value",
        "text/primary",
        "Open Sans SemiBold 14, Bold 28"
       ],
       [
        "Axis label, Description",
        "text/chart-label",
        "Open Sans Regular 11 and 12"
       ],
       [
        "Trend",
        "status/success",
        "Open Sans SemiBold 12"
       ],
       [
        "Padding, gaps",
        "spacing/5 to spacing/7, spacing/2 to spacing/4",
        "16 or 24px padding; 4, 8, 12, 16, 20px gaps"
       ]
      ]
     },
     {
      "type": "text",
      "text": "All seven chart/* tokens are aliases of existing Semantic / Colors tokens, so Light, Dark and High Contrast resolve through the modes with no new hex values."
     }
    ]
   },
   {
    "nodeId": "4462:39588",
    "number": "05",
    "heading": "Accessibility contract",
    "blocks": [
     {
      "type": "checklist",
      "items": [
       "The chart has a text equivalent: role=\"img\" with a label naming the measures, and a table of the values per series nearby.",
       "Series are told apart by label and stroke, not color alone; the fill never carries meaning alone.",
       "Marks meet 3:1 against the card surface in Light, Dark and High Contrast.",
       "Trend text carries its sign (+ or -), not just color.",
       "Not interactive. If marks become links or filters, add focus rings from focus/ring and a keyboard order."
      ]
     }
    ]
   },
   {
    "nodeId": "4462:39598",
    "number": "06",
    "heading": "Responsive / content rules",
    "blocks": [
     {
      "type": "text",
      "text": "Pick the size by container width: Small and Vertical small under 360px, Medium and Large at 360 to 600px, XL above 720px. Keep titles to three words and values to one figure with its unit. Six axes in every size and two series at most. Order axes so related measures sit together."
     }
    ]
   }
  ]
 },
 "radial-convergence-chart": {
  "nodeId": "4462:39657",
  "title": "Radial convergence chart",
  "category": "NORTHSTAR DS / COMPONENT SPECIFICATION · 19",
  "revision": "Reviewed 15 Oct 2026",
  "summary": "A data visualization card that joins nodes around a ring with straight links. Built natively for NorthStar after reviewing the Hyper charts kit; nothing was imported. Five sizes, three component properties, every fill bound to Semantic / Colors.",
  "meta": {
   "Review status": "Built 15 Oct 2026, not yet source-reviewed",
   "Parity status": "Docs site renders the same data as SVG",
   "Evidence boundary": "Figma inspection, not runtime or AT testing"
  },
  "sections": [
   {
    "nodeId": "4462:39673",
    "number": "01",
    "heading": "Purpose / when not to use",
    "blocks": [
     {
      "type": "note",
      "heading": "USE",
      "text": "Show relationships between members of one set: teams that work together, services that call each other, categories that overlap."
     },
     {
      "type": "note",
      "heading": "DO NOT USE",
      "text": "Do not use for flows with a direction and a size (Sankey chart), for hierarchies (Tree chart), or for more than about twenty nodes."
     }
    ]
   },
   {
    "nodeId": "4462:39684",
    "number": "02",
    "heading": "Visual anatomy",
    "blocks": [
     {
      "type": "text",
      "text": "1 · Container: widget/bg fill, border/subtle stroke, radius/xl. 2 · Header: Title, Value with Trend, Description, optional Icon. 3 · Node: ellipse on the ring, text/primary. 4 · Link: 1.5px vector path between two nodes, chart/series-1 or chart/series-2, alternating. 5 · Ring: 12 positions at 30 degrees."
     },
     {
      "type": "example",
      "label": "Medium",
      "description": "Radial convergence instance, Size=Medium, Value '12', Title 'Links', Show icon=false."
     },
     {
      "type": "text",
      "text": "Sizes: Small 330 wide (header left, mini plot right, no axes) · Vertical small 192 wide, no axes · Medium 375 wide with axes and labels · Large 375 wide with a divider and two-KPI summary · XL 800 wide, three KPIs."
     }
    ]
   },
   {
    "nodeId": "4462:39691",
    "number": "03",
    "heading": "Actual Figma API / defaults",
    "blocks": [
     {
      "type": "text",
      "text": "Chart / Radial convergence · set 4462:38977 · page \"Radial convergence chart\" under DATA VIZ."
     },
     {
      "type": "table",
      "columns": [
       "Property",
       "Type",
       "Default",
       "Notes"
      ],
      "rows": [
       [
        "Size",
        "VARIANT",
        "Small",
        "Small, Vertical small, Medium, Large, XL. Medium is the recommended default."
       ],
       [
        "Title",
        "TEXT",
        "Links",
        "Binds to the header title. In XL it binds to the first KPI title."
       ],
       [
        "Value",
        "TEXT",
        "12",
        "Binds to the headline figure. In Large it binds to the first summary figure."
       ],
       [
        "Show icon",
        "BOOLEAN",
        "false",
        "Off by default. Turn it on in Medium or XL; Small keeps text and plot only."
       ]
      ]
     }
    ]
   },
   {
    "nodeId": "4462:39722",
    "number": "04",
    "heading": "Current bindings / semantic mapping",
    "blocks": [
     {
      "type": "table",
      "columns": [
       "Layer",
       "Token",
       "Role"
      ],
      "rows": [
       [
        "Container fill",
        "widget/bg",
        "Card surface, same as the other data viz widgets"
       ],
       [
        "Container stroke",
        "border/subtle",
        "1px hairline"
       ],
       [
        "Container radius",
        "radius/xl",
        "12px"
       ],
       [
        "Link",
        "chart/series-1, chart/series-2",
        "1.5px vector path, alternating by index"
       ],
       [
        "Node",
        "text/primary",
        "Ellipse, 4px radius, 2.5px in compact sizes"
       ],
       [
        "Node count",
        "12",
        "Fixed positions at 30 degrees"
       ],
       [
        "Title, Value",
        "text/primary",
        "Open Sans SemiBold 14, Bold 28"
       ],
       [
        "Axis label, Description",
        "text/chart-label",
        "Open Sans Regular 11 and 12"
       ],
       [
        "Trend",
        "status/success",
        "Open Sans SemiBold 12"
       ],
       [
        "Padding, gaps",
        "spacing/5 to spacing/7, spacing/2 to spacing/4",
        "16 or 24px padding; 4, 8, 12, 16, 20px gaps"
       ]
      ]
     },
     {
      "type": "text",
      "text": "All seven chart/* tokens are aliases of existing Semantic / Colors tokens, so Light, Dark and High Contrast resolve through the modes with no new hex values."
     }
    ]
   },
   {
    "nodeId": "4462:39772",
    "number": "05",
    "heading": "Accessibility contract",
    "blocks": [
     {
      "type": "checklist",
      "items": [
       "The chart has a text equivalent: role=\"img\" with a label that states how many links join how many nodes, and a table of the pairs nearby.",
       "Links are told apart by endpoint, not color alone; add node labels when the nodes have names.",
       "Marks meet 3:1 against the card surface in Light, Dark and High Contrast.",
       "Trend text carries its sign (+ or -), not just color.",
       "Not interactive. If marks become links or filters, add focus rings from focus/ring and a keyboard order."
      ]
     }
    ]
   },
   {
    "nodeId": "4462:39782",
    "number": "06",
    "heading": "Responsive / content rules",
    "blocks": [
     {
      "type": "text",
      "text": "Pick the size by container width: Small and Vertical small under 360px, Medium and Large at 360 to 600px, XL above 720px. Keep titles to three words and values to one figure with its unit. Twelve nodes at most. Keep links under ten, since crossings become unreadable."
     }
    ]
   }
  ]
 },
 "sunburst-chart": {
  "nodeId": "4463:39667",
  "title": "Sunburst chart",
  "category": "NORTHSTAR DS / COMPONENT SPECIFICATION · 20",
  "revision": "Reviewed 15 Oct 2026",
  "summary": "A data visualization card that shows a hierarchy as nested rings, one ring per level. Built natively for NorthStar after reviewing the Hyper charts kit; nothing was imported. Five sizes, three component properties, every fill bound to Semantic / Colors.",
  "meta": {
   "Review status": "Built 15 Oct 2026, not yet source-reviewed",
   "Parity status": "Docs site renders the same data as SVG",
   "Evidence boundary": "Figma inspection, not runtime or AT testing"
  },
  "sections": [
   {
    "nodeId": "4463:39683",
    "number": "01",
    "heading": "Purpose / when not to use",
    "blocks": [
     {
      "type": "note",
      "heading": "USE",
      "text": "Show part-to-whole at two levels at once: categories and their items, with the angle carrying the share."
     },
     {
      "type": "note",
      "heading": "DO NOT USE",
      "text": "Do not use for more than two levels in a compact card (Tree chart), for one level (Donut chart), or for exact size comparison (Bar chart)."
     }
    ]
   },
   {
    "nodeId": "4463:39694",
    "number": "02",
    "heading": "Visual anatomy",
    "blocks": [
     {
      "type": "text",
      "text": "1 · Container: widget/bg fill, border/subtle stroke, radius/xl. 2 · Header: Title, Value with Trend, Description, optional Icon. 3 · Group ring: ellipse arcs, chart/series-1 to 3, 20% to 55% of the radius. 4 · Item ring: ellipse arcs in the parent color at 60% opacity, 58% to 100% of the radius. 5 · Gap: 0.8 degrees trimmed from each arc."
     },
     {
      "type": "example",
      "label": "Medium",
      "description": "Sunburst instance, Size=Medium, Value '11', Title 'Categories', Show icon=false."
     },
     {
      "type": "text",
      "text": "Sizes: Small 330 wide (header left, mini plot right, no axes) · Vertical small 192 wide, no axes · Medium 375 wide with axes and labels · Large 375 wide with a divider and two-KPI summary · XL 800 wide, three KPIs."
     }
    ]
   },
   {
    "nodeId": "4463:39701",
    "number": "03",
    "heading": "Actual Figma API / defaults",
    "blocks": [
     {
      "type": "text",
      "text": "Chart / Sunburst · set 4463:163 · page \"Sunburst chart\" under DATA VIZ."
     },
     {
      "type": "table",
      "columns": [
       "Property",
       "Type",
       "Default",
       "Notes"
      ],
      "rows": [
       [
        "Size",
        "VARIANT",
        "Small",
        "Small, Vertical small, Medium, Large, XL. Medium is the recommended default."
       ],
       [
        "Title",
        "TEXT",
        "Categories",
        "Binds to the header title. In XL it binds to the first KPI title."
       ],
       [
        "Value",
        "TEXT",
        "11",
        "Binds to the headline figure. In Large it binds to the first summary figure."
       ],
       [
        "Show icon",
        "BOOLEAN",
        "false",
        "Off by default. Turn it on in Medium or XL; Small keeps text and plot only."
       ]
      ]
     }
    ]
   },
   {
    "nodeId": "4463:39732",
    "number": "04",
    "heading": "Current bindings / semantic mapping",
    "blocks": [
     {
      "type": "table",
      "columns": [
       "Layer",
       "Token",
       "Role"
      ],
      "rows": [
       [
        "Container fill",
        "widget/bg",
        "Card surface, same as the other data viz widgets"
       ],
       [
        "Container stroke",
        "border/subtle",
        "1px hairline"
       ],
       [
        "Container radius",
        "radius/xl",
        "12px"
       ],
       [
        "Group arc",
        "chart/series-1 to chart/series-3",
        "Ellipse with arc data, inner ring"
       ],
       [
        "Item arc",
        "Parent token at 60% opacity",
        "Outer ring, children share the parent color"
       ],
       [
        "Arc gap",
        "0.8 degrees",
        "Trimmed from both ends of every arc"
       ],
       [
        "Title, Value",
        "text/primary",
        "Open Sans SemiBold 14, Bold 28"
       ],
       [
        "Axis label, Description",
        "text/chart-label",
        "Open Sans Regular 11 and 12"
       ],
       [
        "Trend",
        "status/success",
        "Open Sans SemiBold 12"
       ],
       [
        "Padding, gaps",
        "spacing/5 to spacing/7, spacing/2 to spacing/4",
        "16 or 24px padding; 4, 8, 12, 16, 20px gaps"
       ]
      ]
     },
     {
      "type": "text",
      "text": "All seven chart/* tokens are aliases of existing Semantic / Colors tokens, so Light, Dark and High Contrast resolve through the modes with no new hex values."
     }
    ]
   },
   {
    "nodeId": "4463:39782",
    "number": "05",
    "heading": "Accessibility contract",
    "blocks": [
     {
      "type": "checklist",
      "items": [
       "The chart has a text equivalent: role=\"img\" with a label naming the groups and their items, and a nested list of the values nearby.",
       "Groups are told apart by position and label, not color alone; items inherit the parent hue.",
       "Marks meet 3:1 against the card surface in Light, Dark and High Contrast.",
       "Trend text carries its sign (+ or -), not just color.",
       "Not interactive. If marks become links or filters, add focus rings from focus/ring and a keyboard order."
      ]
     }
    ]
   },
   {
    "nodeId": "4463:39792",
    "number": "06",
    "heading": "Responsive / content rules",
    "blocks": [
     {
      "type": "text",
      "text": "Pick the size by container width: Small and Vertical small under 360px, Medium and Large at 360 to 600px, XL above 720px. Keep titles to three words and values to one figure with its unit. Two rings in every size. Label groups in a legend, since arcs are too narrow for text below Large."
     }
    ]
   }
  ]
 },
 "tree-chart": {
  "nodeId": "4463:39851",
  "title": "Tree chart",
  "category": "NORTHSTAR DS / COMPONENT SPECIFICATION · 21",
  "revision": "Reviewed 15 Oct 2026",
  "summary": "A data visualization card that shows a hierarchy as nodes joined by elbow lines, root on the left. Built natively for NorthStar after reviewing the Hyper charts kit; nothing was imported. Five sizes, three component properties, every fill bound to Semantic / Colors.",
  "meta": {
   "Review status": "Built 15 Oct 2026, not yet source-reviewed",
   "Parity status": "Docs site renders the same data as SVG",
   "Evidence boundary": "Figma inspection, not runtime or AT testing"
  },
  "sections": [
   {
    "nodeId": "4463:39867",
    "number": "01",
    "heading": "Purpose / when not to use",
    "blocks": [
     {
      "type": "note",
      "heading": "USE",
      "text": "Show how one thing divides into parts and sub-parts: org structure, file folders, decision paths."
     },
     {
      "type": "note",
      "heading": "DO NOT USE",
      "text": "Do not use for part-to-whole (Sunburst chart or Treemap chart), for flows with sizes (Sankey chart), or for more than three levels in a card."
     }
    ]
   },
   {
    "nodeId": "4463:39878",
    "number": "02",
    "heading": "Visual anatomy",
    "blocks": [
     {
      "type": "text",
      "text": "1 · Container: widget/bg fill, border/subtle stroke, radius/xl. 2 · Header: Title, Value with Trend, Description, optional Icon. 3 · Node: ellipse, chart/series-1 at the root, chart/series-2 for branches and chart/series-3 for leaves. 4 · Edge: 1.5px elbow vector path, widget/grid. 5 · Level labels: text/chart-label, 11px."
     },
     {
      "type": "example",
      "label": "Medium",
      "description": "Tree instance, Size=Medium, Value '7', Title 'Teams', Show icon=false."
     },
     {
      "type": "text",
      "text": "Sizes: Small 330 wide (header left, mini plot right, no axes) · Vertical small 192 wide, no axes · Medium 375 wide with axes and labels · Large 375 wide with a divider and two-KPI summary · XL 800 wide, three KPIs."
     }
    ]
   },
   {
    "nodeId": "4463:39885",
    "number": "03",
    "heading": "Actual Figma API / defaults",
    "blocks": [
     {
      "type": "text",
      "text": "Chart / Tree · set 4463:38870 · page \"Tree chart\" under DATA VIZ."
     },
     {
      "type": "table",
      "columns": [
       "Property",
       "Type",
       "Default",
       "Notes"
      ],
      "rows": [
       [
        "Size",
        "VARIANT",
        "Small",
        "Small, Vertical small, Medium, Large, XL. Medium is the recommended default."
       ],
       [
        "Title",
        "TEXT",
        "Teams",
        "Binds to the header title. In XL it binds to the first KPI title."
       ],
       [
        "Value",
        "TEXT",
        "7",
        "Binds to the headline figure. In Large it binds to the first summary figure."
       ],
       [
        "Show icon",
        "BOOLEAN",
        "false",
        "Off by default. Turn it on in Medium or XL; Small keeps text and plot only."
       ]
      ]
     }
    ]
   },
   {
    "nodeId": "4463:39916",
    "number": "04",
    "heading": "Current bindings / semantic mapping",
    "blocks": [
     {
      "type": "table",
      "columns": [
       "Layer",
       "Token",
       "Role"
      ],
      "rows": [
       [
        "Container fill",
        "widget/bg",
        "Card surface, same as the other data viz widgets"
       ],
       [
        "Container stroke",
        "border/subtle",
        "1px hairline"
       ],
       [
        "Container radius",
        "radius/xl",
        "12px"
       ],
       [
        "Node",
        "chart/series-1 to chart/series-3",
        "Ellipse, 6px radius, 4px in compact sizes"
       ],
       [
        "Edge",
        "widget/grid",
        "1.5px vector path with one elbow"
       ],
       [
        "Level label",
        "text/chart-label",
        "Dropped in Small and Vertical small"
       ],
       [
        "Title, Value",
        "text/primary",
        "Open Sans SemiBold 14, Bold 28"
       ],
       [
        "Axis label, Description",
        "text/chart-label",
        "Open Sans Regular 11 and 12"
       ],
       [
        "Trend",
        "status/success",
        "Open Sans SemiBold 12"
       ],
       [
        "Padding, gaps",
        "spacing/5 to spacing/7, spacing/2 to spacing/4",
        "16 or 24px padding; 4, 8, 12, 16, 20px gaps"
       ]
      ]
     },
     {
      "type": "text",
      "text": "All seven chart/* tokens are aliases of existing Semantic / Colors tokens, so Light, Dark and High Contrast resolve through the modes with no new hex values."
     }
    ]
   },
   {
    "nodeId": "4463:39966",
    "number": "05",
    "heading": "Accessibility contract",
    "blocks": [
     {
      "type": "checklist",
      "items": [
       "The chart has a text equivalent: role=\"img\" with a label that states the levels, and a nested list of the nodes nearby.",
       "Level is told apart by position and label, not color alone.",
       "Marks meet 3:1 against the card surface in Light, Dark and High Contrast.",
       "Trend text carries its sign (+ or -), not just color.",
       "Not interactive. If marks become links or filters, add focus rings from focus/ring and a keyboard order."
      ]
     }
    ]
   },
   {
    "nodeId": "4463:39976",
    "number": "06",
    "heading": "Responsive / content rules",
    "blocks": [
     {
      "type": "text",
      "text": "Pick the size by container width: Small and Vertical small under 360px, Medium and Large at 360 to 600px, XL above 720px. Keep titles to three words and values to one figure with its unit. Three levels in every size, up to four leaves. Label nodes directly when names matter, and move to a list below 192px wide."
     }
    ]
   }
  ]
 },
 "treemap-chart": {
  "nodeId": "4463:40035",
  "title": "Treemap chart",
  "category": "NORTHSTAR DS / COMPONENT SPECIFICATION · 22",
  "revision": "Reviewed 15 Oct 2026",
  "summary": "A data visualization card that shows shares of a whole as nested rectangles sized by value. Built natively for NorthStar after reviewing the Hyper charts kit; nothing was imported. Five sizes, three component properties, every fill bound to Semantic / Colors.",
  "meta": {
   "Review status": "Built 15 Oct 2026, not yet source-reviewed",
   "Parity status": "Docs site renders the same data as SVG",
   "Evidence boundary": "Figma inspection, not runtime or AT testing"
  },
  "sections": [
   {
    "nodeId": "4463:40051",
    "number": "01",
    "heading": "Purpose / when not to use",
    "blocks": [
     {
      "type": "note",
      "heading": "USE",
      "text": "Show many parts of a whole at once, where area is enough to compare: storage by type, spend by team."
     },
     {
      "type": "note",
      "heading": "DO NOT USE",
      "text": "Do not use for exact comparison (Horizontal bar chart), for time series (Line chart), or for fewer than three parts (Donut chart)."
     }
    ]
   },
   {
    "nodeId": "4463:40062",
    "number": "02",
    "heading": "Visual anatomy",
    "blocks": [
     {
      "type": "text",
      "text": "1 · Container: widget/bg fill, border/subtle stroke, radius/xl. 2 · Header: Title, Value with Trend, Description, optional Icon. 3 · Tile: rectangle, 4px radius, chart/series-1 to 5 at 90% opacity. 4 · Gap: 3px between tiles, 2px in compact sizes. 5 · Layout: slice and dice, largest tile top left."
     },
     {
      "type": "example",
      "label": "Medium",
      "description": "Treemap instance, Size=Medium, Value '640 GB', Title 'Storage', Show icon=false."
     },
     {
      "type": "text",
      "text": "Sizes: Small 330 wide (header left, mini plot right, no axes) · Vertical small 192 wide, no axes · Medium 375 wide with axes and labels · Large 375 wide with a divider and two-KPI summary · XL 800 wide, three KPIs."
     }
    ]
   },
   {
    "nodeId": "4463:40069",
    "number": "03",
    "heading": "Actual Figma API / defaults",
    "blocks": [
     {
      "type": "text",
      "text": "Chart / Treemap · set 4463:39101 · page \"Treemap chart\" under DATA VIZ."
     },
     {
      "type": "table",
      "columns": [
       "Property",
       "Type",
       "Default",
       "Notes"
      ],
      "rows": [
       [
        "Size",
        "VARIANT",
        "Small",
        "Small, Vertical small, Medium, Large, XL. Medium is the recommended default."
       ],
       [
        "Title",
        "TEXT",
        "Storage",
        "Binds to the header title. In XL it binds to the first KPI title."
       ],
       [
        "Value",
        "TEXT",
        "640 GB",
        "Binds to the headline figure. In Large it binds to the first summary figure."
       ],
       [
        "Show icon",
        "BOOLEAN",
        "false",
        "Off by default. Turn it on in Medium or XL; Small keeps text and plot only."
       ]
      ]
     }
    ]
   },
   {
    "nodeId": "4463:40100",
    "number": "04",
    "heading": "Current bindings / semantic mapping",
    "blocks": [
     {
      "type": "table",
      "columns": [
       "Layer",
       "Token",
       "Role"
      ],
      "rows": [
       [
        "Container fill",
        "widget/bg",
        "Card surface, same as the other data viz widgets"
       ],
       [
        "Container stroke",
        "border/subtle",
        "1px hairline"
       ],
       [
        "Container radius",
        "radius/xl",
        "12px"
       ],
       [
        "Tile",
        "chart/series-1 to chart/series-5",
        "Alias viz/1, viz/4, viz/2, viz/7, widget/muted"
       ],
       [
        "Tile radius",
        "4px",
        "Fixed value; not bound to a radius token"
       ],
       [
        "Tile gap",
        "3px",
        "2px in compact sizes"
       ],
       [
        "Title, Value",
        "text/primary",
        "Open Sans SemiBold 14, Bold 28"
       ],
       [
        "Axis label, Description",
        "text/chart-label",
        "Open Sans Regular 11 and 12"
       ],
       [
        "Trend",
        "status/success",
        "Open Sans SemiBold 12"
       ],
       [
        "Padding, gaps",
        "spacing/5 to spacing/7, spacing/2 to spacing/4",
        "16 or 24px padding; 4, 8, 12, 16, 20px gaps"
       ]
      ]
     },
     {
      "type": "text",
      "text": "All seven chart/* tokens are aliases of existing Semantic / Colors tokens, so Light, Dark and High Contrast resolve through the modes with no new hex values."
     }
    ]
   },
   {
    "nodeId": "4463:40150",
    "number": "05",
    "heading": "Accessibility contract",
    "blocks": [
     {
      "type": "checklist",
      "items": [
       "The chart has a text equivalent: role=\"img\" with a label naming the tiles and their shares, and a table nearby.",
       "Tiles are told apart by position and label, not color alone; add labels to the largest tiles.",
       "Marks meet 3:1 against the card surface in Light, Dark and High Contrast.",
       "Trend text carries its sign (+ or -), not just color.",
       "Not interactive. If marks become links or filters, add focus rings from focus/ring and a keyboard order."
      ]
     }
    ]
   },
   {
    "nodeId": "4463:40160",
    "number": "06",
    "heading": "Responsive / content rules",
    "blocks": [
     {
      "type": "text",
      "text": "Pick the size by container width: Small and Vertical small under 360px, Medium and Large at 360 to 600px, XL above 720px. Keep titles to three words and values to one figure with its unit. Five tiles at most. Label the largest tiles and keep the order stable between loads so tiles do not jump."
     }
    ]
   }
  ]
 },
 "calendar-chart": {
  "nodeId": "4463:40219",
  "title": "Calendar chart",
  "category": "NORTHSTAR DS / COMPONENT SPECIFICATION · 23",
  "revision": "Reviewed 15 Oct 2026",
  "summary": "A data visualization card that shows one value per day of a month as the intensity of a cell. Built natively for NorthStar after reviewing the Hyper charts kit; nothing was imported. Five sizes, three component properties, every fill bound to Semantic / Colors.",
  "meta": {
   "Review status": "Built 15 Oct 2026, not yet source-reviewed",
   "Parity status": "Docs site renders the same data as SVG",
   "Evidence boundary": "Figma inspection, not runtime or AT testing"
  },
  "sections": [
   {
    "nodeId": "4463:40235",
    "number": "01",
    "heading": "Purpose / when not to use",
    "blocks": [
     {
      "type": "note",
      "heading": "USE",
      "text": "Show daily activity or status across a month: streaks, gaps, busy days."
     },
     {
      "type": "note",
      "heading": "DO NOT USE",
      "text": "Do not use for exact values (Data table), for spans longer than a few months (Heatmap chart), or for one number."
     }
    ]
   },
   {
    "nodeId": "4463:40246",
    "number": "02",
    "heading": "Visual anatomy",
    "blocks": [
     {
      "type": "text",
      "text": "1 · Container: widget/bg fill, border/subtle stroke, radius/xl. 2 · Header: Title, Value with Trend, Description, optional Icon. 3 · Day cell: rectangle, chart/series-1 with opacity from 10% to 100%, 4px radius, 3px gap. 4 · Weekday labels: text/chart-label, 11px. 5 · Today: 2px stroke, chart/target."
     },
     {
      "type": "example",
      "label": "Medium",
      "description": "Calendar instance, Size=Medium, Value '19', Title 'Active days', Show icon=false."
     },
     {
      "type": "text",
      "text": "Sizes: Small 330 wide (header left, mini plot right, no axes) · Vertical small 192 wide, no axes · Medium 375 wide with axes and labels · Large 375 wide with a divider and two-KPI summary · XL 800 wide, three KPIs."
     }
    ]
   },
   {
    "nodeId": "4463:40253",
    "number": "03",
    "heading": "Actual Figma API / defaults",
    "blocks": [
     {
      "type": "text",
      "text": "Chart / Calendar · set 4463:39465 · page \"Calendar chart\" under DATA VIZ."
     },
     {
      "type": "table",
      "columns": [
       "Property",
       "Type",
       "Default",
       "Notes"
      ],
      "rows": [
       [
        "Size",
        "VARIANT",
        "Small",
        "Small, Vertical small, Medium, Large, XL. Medium is the recommended default."
       ],
       [
        "Title",
        "TEXT",
        "Active days",
        "Binds to the header title. In XL it binds to the first KPI title."
       ],
       [
        "Value",
        "TEXT",
        "19",
        "Binds to the headline figure. In Large it binds to the first summary figure."
       ],
       [
        "Show icon",
        "BOOLEAN",
        "false",
        "Off by default. Turn it on in Medium or XL; Small keeps text and plot only."
       ]
      ]
     }
    ]
   },
   {
    "nodeId": "4463:40284",
    "number": "04",
    "heading": "Current bindings / semantic mapping",
    "blocks": [
     {
      "type": "table",
      "columns": [
       "Layer",
       "Token",
       "Role"
      ],
      "rows": [
       [
        "Container fill",
        "widget/bg",
        "Card surface, same as the other data viz widgets"
       ],
       [
        "Container stroke",
        "border/subtle",
        "1px hairline"
       ],
       [
        "Container radius",
        "radius/xl",
        "12px"
       ],
       [
        "Day cell",
        "chart/series-1",
        "Opacity carries the value, 10% to 100%"
       ],
       [
        "Today marker",
        "chart/target",
        "2px stroke, alias text/primary"
       ],
       [
        "Weekday label",
        "text/chart-label",
        "Dropped in Small and Vertical small"
       ],
       [
        "Title, Value",
        "text/primary",
        "Open Sans SemiBold 14, Bold 28"
       ],
       [
        "Axis label, Description",
        "text/chart-label",
        "Open Sans Regular 11 and 12"
       ],
       [
        "Trend",
        "status/success",
        "Open Sans SemiBold 12"
       ],
       [
        "Padding, gaps",
        "spacing/5 to spacing/7, spacing/2 to spacing/4",
        "16 or 24px padding; 4, 8, 12, 16, 20px gaps"
       ]
      ]
     },
     {
      "type": "text",
      "text": "All seven chart/* tokens are aliases of existing Semantic / Colors tokens, so Light, Dark and High Contrast resolve through the modes with no new hex values."
     }
    ]
   },
   {
    "nodeId": "4463:40334",
    "number": "05",
    "heading": "Accessibility contract",
    "blocks": [
     {
      "type": "checklist",
      "items": [
       "The chart has a text equivalent: role=\"img\" with a label that states the month and the busiest days, and a table of the daily values nearby.",
       "Today is marked by an outline as well as intensity, so it never relies on color alone.",
       "Marks meet 3:1 against the card surface in Light, Dark and High Contrast.",
       "Trend text carries its sign (+ or -), not just color.",
       "Not interactive. If marks become links or filters, add focus rings from focus/ring and a keyboard order."
      ]
     }
    ]
   },
   {
    "nodeId": "4463:40344",
    "number": "06",
    "heading": "Responsive / content rules",
    "blocks": [
     {
      "type": "text",
      "text": "Pick the size by container width: Small and Vertical small under 360px, Medium and Large at 360 to 600px, XL above 720px. Keep titles to three words and values to one figure with its unit. Five weeks by seven days in every size. Put the month name in the title, and start the week on the day the rest of the product uses."
     }
    ]
   }
  ]
 },
 "status-dot": {
  "nodeId": "4469:1558",
  "title": "Status dot",
  "category": "NORTHSTAR DS / COMPONENT SPECIFICATION · 24",
  "revision": "Reviewed 15 Oct 2026",
  "summary": "A colored dot with an optional label for dense tables and maps where a badge would take too much space. Built natively for NorthStar in Open Sans; every fill and text is bound to Semantic / Colors. Ten variants.",
  "meta": {
   "Review status": "Built 15 Oct 2026, not yet source-reviewed",
   "Parity status": "Docs site renders the same component in HTML and CSS",
   "Evidence boundary": "Figma inspection, not runtime or AT testing"
  },
  "sections": [
   {
    "nodeId": "4469:1574",
    "number": "01",
    "heading": "Purpose / when not to use",
    "blocks": [
     {
      "type": "note",
      "heading": "USE",
      "text": "Show a state in dense tables and maps where a badge would take too much space. Keep the label visible."
     },
     {
      "type": "note",
      "heading": "DO NOT USE",
      "text": "Do not use when the label would be hidden from everyone, for counts (Badge), or for removable filters (Tag)."
     }
    ]
   },
   {
    "nodeId": "4469:1585",
    "number": "02",
    "heading": "Visual anatomy",
    "blocks": [
     {
      "type": "text",
      "text": "1 · Container: horizontal auto layout, spacing/3 gap. 2 · Dot: 8px ellipse bound to a status token. 3 · Label: Open Sans Regular 14, text/secondary, optional."
     },
     {
      "type": "example",
      "label": "Positive, Shown",
      "description": "Status dot instance, Status=Positive, Label=Shown."
     },
     {
      "type": "text",
      "text": "Variants: five statuses (Positive, Critical, Negative, Informative, Neutral) with the label shown or hidden."
     }
    ]
   },
   {
    "nodeId": "4469:1592",
    "number": "03",
    "heading": "Actual Figma API / defaults",
    "blocks": [
     {
      "type": "text",
      "text": "Status dot · set 4465:39 · page \"Status dot\" in the NorthStar file."
     },
     {
      "type": "table",
      "columns": [
       "Property",
       "Type",
       "Default",
       "Notes"
      ],
      "rows": [
       [
        "Status",
        "VARIANT",
        "Positive",
        "Positive, Critical, Negative, Informative, Neutral."
       ],
       [
        "Label",
        "VARIANT",
        "Shown",
        "Shown or Hidden. A hidden label must still reach screen readers in code."
       ]
      ]
     }
    ]
   },
   {
    "nodeId": "4469:1623",
    "number": "04",
    "heading": "Current bindings / semantic mapping",
    "blocks": [
     {
      "type": "table",
      "columns": [
       "Layer",
       "Token",
       "Role"
      ],
      "rows": [
       [
        "Positive dot",
        "status/success",
        "Alias green"
       ],
       [
        "Critical dot",
        "status/warning",
        "Alias yellow"
       ],
       [
        "Negative dot",
        "status/error",
        "Alias red"
       ],
       [
        "Informative dot",
        "status/info",
        "Alias blue"
       ],
       [
        "Neutral dot",
        "text/tertiary",
        "The only dot that signals no state"
       ],
       [
        "Label",
        "text/secondary",
        "Open Sans Regular 14"
       ],
       [
        "Gap",
        "spacing/3",
        "8px"
       ]
      ]
     },
     {
      "type": "text",
      "text": "Fills and text are bound to Semantic / Colors, spacing to Primitives where a token exists. A few radii and paddings are fixed values, not tokens."
     }
    ]
   },
   {
    "nodeId": "4469:1673",
    "number": "05",
    "heading": "Accessibility contract",
    "blocks": [
     {
      "type": "checklist",
      "items": [
       "The label is text, so screen readers read it. A hidden label stays in the DOM as screen-reader-only text.",
       "Never rely on dot color alone: keep the label visible, or name the status in a column header.",
       "Dot colors meet 3:1 against the surface in Light, Dark and High Contrast.",
       "Neutral uses text/tertiary and does not signal a state.",
       "Not interactive."
      ]
     }
    ]
   },
   {
    "nodeId": "4469:1683",
    "number": "06",
    "heading": "Responsive / content rules",
    "blocks": [
     {
      "type": "text",
      "text": "Use at 14px in tables; the dot and label never wrap apart. Keep labels to one or two words."
     }
    ]
   }
  ]
 },
 "link": {
  "nodeId": "4469:1744",
  "title": "Link",
  "category": "NORTHSTAR DS / COMPONENT SPECIFICATION · 25",
  "revision": "Reviewed 15 Oct 2026",
  "summary": "A text link for navigation, with an external type that adds an arrow. Built natively for NorthStar in Open Sans; every fill and text is bound to Semantic / Colors. Eight variants.",
  "meta": {
   "Review status": "Built 15 Oct 2026, not yet source-reviewed",
   "Parity status": "Docs site renders the same component in HTML and CSS",
   "Evidence boundary": "Figma inspection, not runtime or AT testing"
  },
  "sections": [
   {
    "nodeId": "4469:1760",
    "number": "01",
    "heading": "Purpose / when not to use",
    "blocks": [
     {
      "type": "note",
      "heading": "USE",
      "text": "Go to another page or place, inline with text or on its own."
     },
     {
      "type": "note",
      "heading": "DO NOT USE",
      "text": "Do not use for actions that change data (Button) or for items in a list of actions (Menu)."
     }
    ]
   },
   {
    "nodeId": "4469:1771",
    "number": "02",
    "heading": "Visual anatomy",
    "blocks": [
     {
      "type": "text",
      "text": "1 · Label: Open Sans Regular 14, underlined, text/link. 2 · Arrow: 8px vector stroke, External type only. 3 · Focus ring: absolute 2px rectangle, focus/ring, 4px radius."
     },
     {
      "type": "example",
      "label": "Default, Default",
      "description": "Link instance, Type=Default, State=Default."
     },
     {
      "type": "text",
      "text": "Variants: Default or External, each in Default, Hover, Focus and Disabled states."
     }
    ]
   },
   {
    "nodeId": "4469:1778",
    "number": "03",
    "heading": "Actual Figma API / defaults",
    "blocks": [
     {
      "type": "text",
      "text": "Link · set 4465:92 · page \"Link\" in the NorthStar file."
     },
     {
      "type": "table",
      "columns": [
       "Property",
       "Type",
       "Default",
       "Notes"
      ],
      "rows": [
       [
        "Type",
        "VARIANT",
        "Default",
        "Default or External. External adds the arrow."
       ],
       [
        "State",
        "VARIANT",
        "Default",
        "Default, Hover, Focus, Disabled."
       ]
      ]
     }
    ]
   },
   {
    "nodeId": "4469:1809",
    "number": "04",
    "heading": "Current bindings / semantic mapping",
    "blocks": [
     {
      "type": "table",
      "columns": [
       "Layer",
       "Token",
       "Role"
      ],
      "rows": [
       [
        "Label, default",
        "text/link",
        "Underlined"
       ],
       [
        "Label, hover",
        "text/accent",
        "Underlined"
       ],
       [
        "Label, disabled",
        "text/disabled",
        "No underline"
       ],
       [
        "Focus ring",
        "focus/ring",
        "2px stroke, absolute layer"
       ],
       [
        "Arrow",
        "Same as the label",
        "8px vector, 1.5px stroke"
       ],
       [
        "Gap",
        "spacing/2",
        "4px"
       ]
      ]
     },
     {
      "type": "text",
      "text": "Fills and text are bound to Semantic / Colors, spacing to Primitives where a token exists. A few radii and paddings are fixed values, not tokens."
     }
    ]
   },
   {
    "nodeId": "4469:1859",
    "number": "05",
    "heading": "Accessibility contract",
    "blocks": [
     {
      "type": "checklist",
      "items": [
       "Links go to a destination; buttons run an action. Use the right element.",
       "External links open in a new tab and say so to screen readers.",
       "The underline is the second signal after color; do not remove it.",
       "The focus ring is visible against every surface and is not clipped.",
       "Disabled links use aria-disabled and are not activated."
      ]
     }
    ]
   },
   {
    "nodeId": "4469:1869",
    "number": "06",
    "heading": "Responsive / content rules",
    "blocks": [
     {
      "type": "text",
      "text": "Links wrap with the text around them. Write link text that makes sense out of context, not \"click here\"."
     }
    ]
   }
  ]
 },
 "toast": {
  "nodeId": "4469:1929",
  "title": "Toast",
  "category": "NORTHSTAR DS / COMPONENT SPECIFICATION · 26",
  "revision": "Reviewed 15 Oct 2026",
  "summary": "A short, non-blocking message after an action, with a status color and an optional Undo. Built natively for NorthStar in Open Sans; every fill and text is bound to Semantic / Colors. Eight variants.",
  "meta": {
   "Review status": "Built 15 Oct 2026, not yet source-reviewed",
   "Parity status": "Docs site renders the same component in HTML and CSS",
   "Evidence boundary": "Figma inspection, not runtime or AT testing"
  },
  "sections": [
   {
    "nodeId": "4469:1945",
    "number": "01",
    "heading": "Purpose / when not to use",
    "blocks": [
     {
      "type": "note",
      "heading": "USE",
      "text": "Confirm a short result after an action, such as Account archived."
     },
     {
      "type": "note",
      "heading": "DO NOT USE",
      "text": "Do not use for errors the person must fix (Alert banner inline) or for decisions (Modal)."
     }
    ]
   },
   {
    "nodeId": "4469:1956",
    "number": "02",
    "heading": "Visual anatomy",
    "blocks": [
     {
      "type": "text",
      "text": "1 · Container: 360px, background/elevated, 1px status stroke, 8px radius. 2 · Status dot: 8px. 3 · Title: SemiBold 14. 4 · Message: Regular 13, text/secondary. 5 · Action: optional Undo, SemiBold 13, text/link."
     },
     {
      "type": "example",
      "label": "Success, Undo",
      "description": "Toast instance, Status=Success, Action=Undo."
     },
     {
      "type": "text",
      "text": "Variants: Success, Information, Warning or Error, each with an Undo action or none."
     }
    ]
   },
   {
    "nodeId": "4469:1963",
    "number": "03",
    "heading": "Actual Figma API / defaults",
    "blocks": [
     {
      "type": "text",
      "text": "Toast · set 4465:138 · page \"Toast\" in the NorthStar file."
     },
     {
      "type": "table",
      "columns": [
       "Property",
       "Type",
       "Default",
       "Notes"
      ],
      "rows": [
       [
        "Status",
        "VARIANT",
        "Success",
        "Success, Information, Warning, Error."
       ],
       [
        "Action",
        "VARIANT",
        "Undo",
        "Undo or None."
       ]
      ]
     }
    ]
   },
   {
    "nodeId": "4469:1994",
    "number": "04",
    "heading": "Current bindings / semantic mapping",
    "blocks": [
     {
      "type": "table",
      "columns": [
       "Layer",
       "Token",
       "Role"
      ],
      "rows": [
       [
        "Container fill",
        "background/elevated",
        "Toast surface"
       ],
       [
        "Container stroke",
        "status/success, info, warning, error",
        "1px, by status"
       ],
       [
        "Status dot",
        "Same as the stroke",
        "8px ellipse"
       ],
       [
        "Title",
        "text/primary",
        "Open Sans SemiBold 14"
       ],
       [
        "Message",
        "text/secondary",
        "Open Sans Regular 13"
       ],
       [
        "Action",
        "text/link",
        "Open Sans SemiBold 13"
       ],
       [
        "Gap",
        "spacing/3",
        "8px"
       ]
      ]
     },
     {
      "type": "text",
      "text": "Fills and text are bound to Semantic / Colors, spacing to Primitives where a token exists. A few radii and paddings are fixed values, not tokens."
     }
    ]
   },
   {
    "nodeId": "4469:2044",
    "number": "05",
    "heading": "Accessibility contract",
    "blocks": [
     {
      "type": "checklist",
      "items": [
       "Toasts use role=\"status\"; errors use role=\"alert\".",
       "A toast with an action stays long enough to reach it by keyboard.",
       "Status is carried by the title text as well as the dot color.",
       "Do not auto-dismiss a toast that carries an action before the person can reach it.",
       "Focus moves to a toast only when it carries an action."
      ]
     }
    ]
   },
   {
    "nodeId": "4469:2054",
    "number": "06",
    "heading": "Responsive / content rules",
    "blocks": [
     {
      "type": "text",
      "text": "Toasts are 360px wide and stack in a corner. On narrow screens they take the full width minus the page margin."
     }
    ]
   }
  ]
 },
 "combobox": {
  "nodeId": "4469:2118",
  "title": "Combobox",
  "category": "NORTHSTAR DS / COMPONENT SPECIFICATION · 27",
  "revision": "Reviewed 15 Oct 2026",
  "summary": "A filterable multi-select for long lists: typing filters the options and chosen values stay visible as removable tags. Built natively for NorthStar in Open Sans; every fill and text is bound to Semantic / Colors. Three variants.",
  "meta": {
   "Review status": "Built 15 Oct 2026, not yet source-reviewed",
   "Parity status": "Docs site renders the same component in HTML and CSS",
   "Evidence boundary": "Figma inspection, not runtime or AT testing"
  },
  "sections": [
   {
    "nodeId": "4469:2134",
    "number": "01",
    "heading": "Purpose / when not to use",
    "blocks": [
     {
      "type": "note",
      "heading": "USE",
      "text": "Choose several items from a long list by typing to filter."
     },
     {
      "type": "note",
      "heading": "DO NOT USE",
      "text": "Do not use for fewer than seven options (Select or Checkbox) or for one choice from a short list."
     }
    ]
   },
   {
    "nodeId": "4469:2145",
    "number": "02",
    "heading": "Visual anatomy",
    "blocks": [
     {
      "type": "text",
      "text": "1 · Control: 340px, background/elevated, border/default, 8px radius. 2 · Tags: widget/band pills with a remove mark. 3 · Query: placeholder in text/tertiary. 4 · List: below the control when open, the active row in background/selected."
     },
     {
      "type": "example",
      "label": "Default",
      "description": "Combobox instance, State=Default."
     },
     {
      "type": "text",
      "text": "Variants: Default, Open (with the list) and Disabled (45% opacity)."
     }
    ]
   },
   {
    "nodeId": "4469:2152",
    "number": "03",
    "heading": "Actual Figma API / defaults",
    "blocks": [
     {
      "type": "text",
      "text": "Combobox · set 4466:34 · page \"Combobox\" in the NorthStar file."
     },
     {
      "type": "table",
      "columns": [
       "Property",
       "Type",
       "Default",
       "Notes"
      ],
      "rows": [
       [
        "State",
        "VARIANT",
        "Default",
        "Default, Open, Disabled."
       ]
      ]
     }
    ]
   },
   {
    "nodeId": "4469:2183",
    "number": "04",
    "heading": "Current bindings / semantic mapping",
    "blocks": [
     {
      "type": "table",
      "columns": [
       "Layer",
       "Token",
       "Role"
      ],
      "rows": [
       [
        "Control fill",
        "background/elevated",
        "Field surface"
       ],
       [
        "Control stroke",
        "border/default",
        "interactive/primary when Open"
       ],
       [
        "Tag",
        "widget/band",
        "text/primary label, text/secondary remove mark"
       ],
       [
        "Placeholder",
        "text/tertiary",
        "Open Sans Regular 14"
       ],
       [
        "List fill and stroke",
        "background/elevated, border/default",
        "Open variant only"
       ],
       [
        "Active option",
        "background/selected",
        "First option in the specimen"
       ],
       [
        "Disabled",
        "Opacity 45%",
        "Whole component"
       ]
      ]
     },
     {
      "type": "text",
      "text": "Fills and text are bound to Semantic / Colors, spacing to Primitives where a token exists. A few radii and paddings are fixed values, not tokens."
     }
    ]
   },
   {
    "nodeId": "4469:2233",
    "number": "05",
    "heading": "Accessibility contract",
    "blocks": [
     {
      "type": "checklist",
      "items": [
       "The control exposes role=\"combobox\" with aria-expanded and a listbox of options.",
       "Arrow keys move the active option, Enter toggles it, Backspace on an empty query removes the last tag, Escape closes the list.",
       "Each tag has a remove button with an accessible name.",
       "Selection shows as a check and a background, not color alone.",
       "The docs demo is a static specimen; these behaviors are the contract to build."
      ]
     }
    ]
   },
   {
    "nodeId": "4469:2243",
    "number": "06",
    "heading": "Responsive / content rules",
    "blocks": [
     {
      "type": "text",
      "text": "Full width of its container with a 340px default. Tags wrap onto new lines and the list scrolls at a maximum height."
     }
    ]
   }
  ]
 },
 "inline-edit": {
  "nodeId": "4470:1571",
  "title": "Inline edit",
  "category": "NORTHSTAR DS / COMPONENT SPECIFICATION · 28",
  "revision": "Reviewed 15 Oct 2026",
  "summary": "A value that turns into an editable field in place, with hover, editing and saving states. Built natively for NorthStar in Open Sans; every fill and text is bound to Semantic / Colors. Four variants.",
  "meta": {
   "Review status": "Built 15 Oct 2026, not yet source-reviewed",
   "Parity status": "Docs site renders the same component in HTML and CSS",
   "Evidence boundary": "Figma inspection, not runtime or AT testing"
  },
  "sections": [
   {
    "nodeId": "4470:1587",
    "number": "01",
    "heading": "Purpose / when not to use",
    "blocks": [
     {
      "type": "note",
      "heading": "USE",
      "text": "Edit one value in place on a detail page without opening a form."
     },
     {
      "type": "note",
      "heading": "DO NOT USE",
      "text": "Do not use for several related fields (a form) or for destructive changes (Modal)."
     }
    ]
   },
   {
    "nodeId": "4470:1598",
    "number": "02",
    "heading": "Visual anatomy",
    "blocks": [
     {
      "type": "text",
      "text": "1 · Label: text/secondary, Regular 14. 2 · Value: text/primary, SemiBold 14. 3 · Field: transparent at rest, background/hover on hover, background/secondary with a focus/ring stroke while editing. 4 · Confirm mark in Editing. 5 · Saving note after confirm."
     },
     {
      "type": "example",
      "label": "Read",
      "description": "Inline edit instance, State=Read."
     },
     {
      "type": "text",
      "text": "Variants: Read, Hover, Editing and Saving."
     }
    ]
   },
   {
    "nodeId": "4470:1605",
    "number": "03",
    "heading": "Actual Figma API / defaults",
    "blocks": [
     {
      "type": "text",
      "text": "Inline edit · set 4466:54 · page \"Inline edit\" in the NorthStar file."
     },
     {
      "type": "table",
      "columns": [
       "Property",
       "Type",
       "Default",
       "Notes"
      ],
      "rows": [
       [
        "State",
        "VARIANT",
        "Read",
        "Read, Hover, Editing, Saving."
       ]
      ]
     }
    ]
   },
   {
    "nodeId": "4470:1636",
    "number": "04",
    "heading": "Current bindings / semantic mapping",
    "blocks": [
     {
      "type": "table",
      "columns": [
       "Layer",
       "Token",
       "Role"
      ],
      "rows": [
       [
        "Field, hover",
        "background/hover",
        "6px radius"
       ],
       [
        "Field, editing",
        "background/secondary",
        "1px focus/ring stroke"
       ],
       [
        "Label",
        "text/secondary",
        "Open Sans Regular 14"
       ],
       [
        "Value",
        "text/primary",
        "Open Sans SemiBold 14"
       ],
       [
        "Confirm mark",
        "text/accent",
        "Editing only"
       ],
       [
        "Saving note",
        "text/tertiary",
        "Open Sans Regular 12"
       ],
       [
        "Gap",
        "spacing/2, spacing/3",
        "4px inside the field, 8px outside"
       ]
      ]
     },
     {
      "type": "text",
      "text": "Fills and text are bound to Semantic / Colors, spacing to Primitives where a token exists. A few radii and paddings are fixed values, not tokens."
     }
    ]
   },
   {
    "nodeId": "4470:1686",
    "number": "05",
    "heading": "Accessibility contract",
    "blocks": [
     {
      "type": "checklist",
      "items": [
       "Enter saves, Escape cancels, and focus returns to the read value.",
       "The read value is a button whose accessible name includes the field label.",
       "A failed save keeps the typed value and shows an error message, not only a color.",
       "The Saving state is announced with a polite live region.",
       "Keyboard focus shows the same affordance as hover."
      ]
     }
    ]
   },
   {
    "nodeId": "4470:1696",
    "number": "06",
    "heading": "Responsive / content rules",
    "blocks": [
     {
      "type": "text",
      "text": "Fits its text. At narrow widths the label stacks above the value."
     }
    ]
   }
  ]
 },
 "menu": {
  "nodeId": "4470:1758",
  "title": "Menu",
  "category": "NORTHSTAR DS / COMPONENT SPECIFICATION · 29",
  "revision": "Reviewed 15 Oct 2026",
  "summary": "A list of secondary actions that opens from a trigger such as a row, with optional shortcuts and a destructive item. Built natively for NorthStar in Open Sans; every fill and text is bound to Semantic / Colors. Four variants.",
  "meta": {
   "Review status": "Built 15 Oct 2026, not yet source-reviewed",
   "Parity status": "Docs site renders the same component in HTML and CSS",
   "Evidence boundary": "Figma inspection, not runtime or AT testing"
  },
  "sections": [
   {
    "nodeId": "4470:1774",
    "number": "01",
    "heading": "Purpose / when not to use",
    "blocks": [
     {
      "type": "note",
      "heading": "USE",
      "text": "Offer a short list of secondary actions from a trigger, such as a table row."
     },
     {
      "type": "note",
      "heading": "DO NOT USE",
      "text": "Do not put primary actions in a menu (Button) or use it for navigation (Side navigation)."
     }
    ]
   },
   {
    "nodeId": "4470:1785",
    "number": "02",
    "heading": "Visual anatomy",
    "blocks": [
     {
      "type": "text",
      "text": "1 · Panel: 240px, background/elevated, border/default, 12px radius. 2 · Items: Regular 14 labels with an optional shortcut at the right. 3 · Disabled item: stays visible at 45% opacity. 4 · Destructive item: status/error, last."
     },
     {
      "type": "example",
      "label": "On, Show",
      "description": "Menu instance, Shortcut=On, Destructive=Show."
     },
     {
      "type": "text",
      "text": "Variants: shortcuts on or off, destructive item shown or hidden."
     }
    ]
   },
   {
    "nodeId": "4470:1792",
    "number": "03",
    "heading": "Actual Figma API / defaults",
    "blocks": [
     {
      "type": "text",
      "text": "Menu · set 4466:90 · page \"Menu\" in the NorthStar file."
     },
     {
      "type": "table",
      "columns": [
       "Property",
       "Type",
       "Default",
       "Notes"
      ],
      "rows": [
       [
        "Shortcut",
        "VARIANT",
        "On",
        "On or Off. Shows the key hint on Edit details."
       ],
       [
        "Destructive",
        "VARIANT",
        "Show",
        "Show or Hide the Delete item."
       ]
      ]
     }
    ]
   },
   {
    "nodeId": "4470:1823",
    "number": "04",
    "heading": "Current bindings / semantic mapping",
    "blocks": [
     {
      "type": "table",
      "columns": [
       "Layer",
       "Token",
       "Role"
      ],
      "rows": [
       [
        "Panel fill",
        "background/elevated",
        "Menu surface"
       ],
       [
        "Panel stroke",
        "border/default",
        "1px"
       ],
       [
        "Item label",
        "text/primary",
        "Open Sans Regular 14"
       ],
       [
        "Shortcut",
        "text/tertiary",
        "Open Sans Regular 12"
       ],
       [
        "Delete item",
        "status/error",
        "Destructive"
       ],
       [
        "Disabled item",
        "Opacity 45%",
        "Archive in the specimen"
       ],
       [
        "Gap",
        "spacing/2",
        "4px"
       ]
      ]
     },
     {
      "type": "text",
      "text": "Fills and text are bound to Semantic / Colors, spacing to Primitives where a token exists. A few radii and paddings are fixed values, not tokens."
     }
    ]
   },
   {
    "nodeId": "4470:1873",
    "number": "05",
    "heading": "Accessibility contract",
    "blocks": [
     {
      "type": "checklist",
      "items": [
       "The panel is role=\"menu\" with role=\"menuitem\" items.",
       "Arrow keys, Home and End move between items and skip disabled ones; Escape closes and returns focus to the trigger.",
       "Disabled items use aria-disabled and stay in the reading order.",
       "The destructive item is named in text (\"Delete\"), not only colored.",
       "Shortcuts are exposed with aria-keyshortcuts where they exist."
      ]
     }
    ]
   },
   {
    "nodeId": "4470:1883",
    "number": "06",
    "heading": "Responsive / content rules",
    "blocks": [
     {
      "type": "text",
      "text": "The panel is 240px and shrinks to fit narrow containers. Keep labels to a few words."
     }
    ]
   }
  ]
 },
 "bulk-action-bar": {
  "nodeId": "4470:1951",
  "title": "Bulk action bar",
  "category": "NORTHSTAR DS / COMPONENT SPECIFICATION · 30",
  "revision": "Reviewed 15 Oct 2026",
  "summary": "A bar that appears over a table when rows are selected, with the count and the actions that apply to all of them. Built natively for NorthStar in Open Sans; every fill and text is bound to Semantic / Colors. Six variants.",
  "meta": {
   "Review status": "Built 15 Oct 2026, not yet source-reviewed",
   "Parity status": "Docs site renders the same component in HTML and CSS",
   "Evidence boundary": "Figma inspection, not runtime or AT testing"
  },
  "sections": [
   {
    "nodeId": "4470:1967",
    "number": "01",
    "heading": "Purpose / when not to use",
    "blocks": [
     {
      "type": "note",
      "heading": "USE",
      "text": "Act on several selected rows at once."
     },
     {
      "type": "note",
      "heading": "DO NOT USE",
      "text": "Do not show it with nothing selected, or use it for single-row actions (Menu)."
     }
    ]
   },
   {
    "nodeId": "4470:1978",
    "number": "02",
    "heading": "Visual anatomy",
    "blocks": [
     {
      "type": "text",
      "text": "1 · Bar: interactive/primary fill, 8px radius. 2 · Count: \"N selected\" in SemiBold 14. 3 · Actions: Approve and Export. 4 · Clear: right aligned. 5 · Delete: shown when destructive."
     },
     {
      "type": "example",
      "label": "3, Show",
      "description": "Bulk action bar instance, Count=3, Destructive=Show."
     },
     {
      "type": "text",
      "text": "Variants: 3, 1 or 12 selected, with the Delete action shown or hidden."
     }
    ]
   },
   {
    "nodeId": "4470:1985",
    "number": "03",
    "heading": "Actual Figma API / defaults",
    "blocks": [
     {
      "type": "text",
      "text": "Bulk action bar · set 4466:131 · page \"Bulk action bar\" in the NorthStar file."
     },
     {
      "type": "table",
      "columns": [
       "Property",
       "Type",
       "Default",
       "Notes"
      ],
      "rows": [
       [
        "Count",
        "VARIANT",
        "3",
        "3, 1 or 12. The number in the \"N selected\" label."
       ],
       [
        "Destructive",
        "VARIANT",
        "Show",
        "Show or Hide the Delete action."
       ]
      ]
     }
    ]
   },
   {
    "nodeId": "4470:2016",
    "number": "04",
    "heading": "Current bindings / semantic mapping",
    "blocks": [
     {
      "type": "table",
      "columns": [
       "Layer",
       "Token",
       "Role"
      ],
      "rows": [
       [
        "Bar fill",
        "interactive/primary",
        "8px radius"
       ],
       [
        "Count and actions",
        "text/on-primary",
        "Open Sans SemiBold and Regular 14"
       ],
       [
        "Delete",
        "text/on-primary",
        "SemiBold; the bar gives no extra red"
       ],
       [
        "Gap",
        "spacing/4",
        "12px"
       ],
       [
        "Padding",
        "Fixed",
        "16px sides, 10px top and bottom"
       ]
      ]
     },
     {
      "type": "text",
      "text": "Fills and text are bound to Semantic / Colors, spacing to Primitives where a token exists. A few radii and paddings are fixed values, not tokens."
     }
    ]
   },
   {
    "nodeId": "4470:2066",
    "number": "05",
    "heading": "Accessibility contract",
    "blocks": [
     {
      "type": "checklist",
      "items": [
       "The bar is role=\"region\" with a label such as \"Bulk actions\".",
       "The count is announced when the selection changes.",
       "Every action is a button with an accessible name; Delete is not distinguished by color alone.",
       "Keyboard focus moves into the bar only when the person asks for it.",
       "Text on the primary fill meets 4.5:1."
      ]
     }
    ]
   },
   {
    "nodeId": "4470:2076",
    "number": "06",
    "heading": "Responsive / content rules",
    "blocks": [
     {
      "type": "text",
      "text": "Sticks to the top of the table while rows are selected. Actions should collapse into a menu when they no longer fit."
     }
    ]
   }
  ]
 },
 "segmented-control": {
  "nodeId": "4470:2141",
  "title": "Segmented control",
  "category": "NORTHSTAR DS / COMPONENT SPECIFICATION · 31",
  "revision": "Reviewed 15 Oct 2026",
  "summary": "A row of two to four segments that switches between views of the same content, one selected at a time. Built natively for NorthStar in Open Sans; every fill and text is bound to Semantic / Colors. Six variants.",
  "meta": {
   "Review status": "Built 15 Oct 2026, not yet source-reviewed",
   "Parity status": "Docs site renders the same component in HTML and CSS",
   "Evidence boundary": "Figma inspection, not runtime or AT testing"
  },
  "sections": [
   {
    "nodeId": "4470:2157",
    "number": "01",
    "heading": "Purpose / when not to use",
    "blocks": [
     {
      "type": "note",
      "heading": "USE",
      "text": "Switch between two to five views of the same content, one at a time."
     },
     {
      "type": "note",
      "heading": "DO NOT USE",
      "text": "Do not use for navigation between pages (Tabs) or for independent on and off options (Switch)."
     }
    ]
   },
   {
    "nodeId": "4470:2168",
    "number": "02",
    "heading": "Visual anatomy",
    "blocks": [
     {
      "type": "text",
      "text": "1 · Track: background/secondary with a border/default stroke, 8px radius. 2 · Selected segment: background/elevated, SemiBold text/primary. 3 · Other segments: Regular text/secondary. 4 · Disabled segment: text/disabled."
     },
     {
      "type": "example",
      "label": "2, None",
      "description": "Segmented control instance, Count=2, Disabled=None."
     },
     {
      "type": "text",
      "text": "Variants: 2, 3 or 4 segments, with the last segment disabled or not."
     }
    ]
   },
   {
    "nodeId": "4470:2175",
    "number": "03",
    "heading": "Actual Figma API / defaults",
    "blocks": [
     {
      "type": "text",
      "text": "Segmented control · set 4466:175 · page \"Segmented control\" in the NorthStar file."
     },
     {
      "type": "table",
      "columns": [
       "Property",
       "Type",
       "Default",
       "Notes"
      ],
      "rows": [
       [
        "Count",
        "VARIANT",
        "2",
        "2, 3 or 4 segments."
       ],
       [
        "Disabled",
        "VARIANT",
        "None",
        "None or Last."
       ]
      ]
     }
    ]
   },
   {
    "nodeId": "4470:2206",
    "number": "04",
    "heading": "Current bindings / semantic mapping",
    "blocks": [
     {
      "type": "table",
      "columns": [
       "Layer",
       "Token",
       "Role"
      ],
      "rows": [
       [
        "Track fill",
        "background/secondary",
        "Container"
       ],
       [
        "Track stroke",
        "border/default",
        "1px"
       ],
       [
        "Selected segment",
        "background/elevated",
        "text/primary SemiBold"
       ],
       [
        "Other segments",
        "text/secondary",
        "Open Sans Regular 14"
       ],
       [
        "Disabled segment",
        "text/disabled",
        "Last segment"
       ],
       [
        "Gap",
        "spacing/1",
        "2px"
       ]
      ]
     },
     {
      "type": "text",
      "text": "Fills and text are bound to Semantic / Colors, spacing to Primitives where a token exists. A few radii and paddings are fixed values, not tokens."
     }
    ]
   },
   {
    "nodeId": "4470:2256",
    "number": "05",
    "heading": "Accessibility contract",
    "blocks": [
     {
      "type": "checklist",
      "items": [
       "The track is role=\"radiogroup\"; each segment is role=\"radio\" with aria-checked.",
       "Arrow keys move and select, Home and End jump to the ends.",
       "A disabled segment stays visible and uses aria-disabled.",
       "Selection shows as an elevated surface and a SemiBold label, not color alone.",
       "Labels are short enough to fit without truncation."
      ]
     }
    ]
   },
   {
    "nodeId": "4470:2266",
    "number": "06",
    "heading": "Responsive / content rules",
    "blocks": [
     {
      "type": "text",
      "text": "Two to five segments. Under 360px wide the control scrolls sideways instead of wrapping."
     }
    ]
   }
  ]
 },
 "number-stepper": {
  "nodeId": "4470:2329",
  "title": "Number stepper",
  "category": "NORTHSTAR DS / COMPONENT SPECIFICATION · 32",
  "revision": "Reviewed 15 Oct 2026",
  "summary": "A field with decrement and increment buttons for a small whole number, with minimum, maximum and disabled states. Built natively for NorthStar in Open Sans; every fill and text is bound to Semantic / Colors. Twelve variants.",
  "meta": {
   "Review status": "Built 15 Oct 2026, not yet source-reviewed",
   "Parity status": "Docs site renders the same component in HTML and CSS",
   "Evidence boundary": "Figma inspection, not runtime or AT testing"
  },
  "sections": [
   {
    "nodeId": "4470:2345",
    "number": "01",
    "heading": "Purpose / when not to use",
    "blocks": [
     {
      "type": "note",
      "heading": "USE",
      "text": "Enter a small whole number with clear steps."
     },
     {
      "type": "note",
      "heading": "DO NOT USE",
      "text": "Do not use for wide ranges (Slider) or for free-form numbers such as prices (Text input)."
     }
    ]
   },
   {
    "nodeId": "4470:2356",
    "number": "02",
    "heading": "Visual anatomy",
    "blocks": [
     {
      "type": "text",
      "text": "1 · Container: 136 by 40, background/secondary, border/default, 8px radius. 2 · Decrement and increment: 40px buttons, text/secondary. 3 · Value: SemiBold 16, text/primary. 4 · Disabled limit: text/disabled on the button that cannot move."
     },
     {
      "type": "example",
      "label": "3, Default",
      "description": "Number stepper instance, Value=3, State=Default."
     },
     {
      "type": "text",
      "text": "Variants: value 3, 1 or 50, in Default, At minimum, At maximum and Disabled states."
     }
    ]
   },
   {
    "nodeId": "4470:2363",
    "number": "03",
    "heading": "Actual Figma API / defaults",
    "blocks": [
     {
      "type": "text",
      "text": "Number stepper · set 4466:261 · page \"Number stepper\" in the NorthStar file."
     },
     {
      "type": "table",
      "columns": [
       "Property",
       "Type",
       "Default",
       "Notes"
      ],
      "rows": [
       [
        "Value",
        "VARIANT",
        "3",
        "3, 1 or 50. The number shown."
       ],
       [
        "State",
        "VARIANT",
        "Default",
        "Default, At minimum, At maximum, Disabled."
       ]
      ]
     }
    ]
   },
   {
    "nodeId": "4470:2394",
    "number": "04",
    "heading": "Current bindings / semantic mapping",
    "blocks": [
     {
      "type": "table",
      "columns": [
       "Layer",
       "Token",
       "Role"
      ],
      "rows": [
       [
        "Container fill",
        "background/secondary",
        "Field surface"
       ],
       [
        "Container stroke",
        "border/default",
        "1px, 8px radius"
       ],
       [
        "Value",
        "text/primary",
        "Open Sans SemiBold 16"
       ],
       [
        "Buttons",
        "text/secondary",
        "Open Sans Regular 18"
       ],
       [
        "Button at a limit",
        "text/disabled",
        "At minimum or At maximum"
       ],
       [
        "Disabled",
        "Opacity 45%",
        "Whole component"
       ]
      ]
     },
     {
      "type": "text",
      "text": "Fills and text are bound to Semantic / Colors, spacing to Primitives where a token exists. A few radii and paddings are fixed values, not tokens."
     }
    ]
   },
   {
    "nodeId": "4470:2444",
    "number": "05",
    "heading": "Accessibility contract",
    "blocks": [
     {
      "type": "checklist",
      "items": [
       "The container is role=\"group\" with a label; the value is an input with inputmode numeric.",
       "Increment and decrement are buttons with accessible names; at a limit the button is disabled and uses aria-disabled.",
       "Arrow up and arrow down also step the value from the input.",
       "The limits are stated in the label or helper text.",
       "Disabled keeps the layout and the label readable."
      ]
     }
    ]
   },
   {
    "nodeId": "4470:2454",
    "number": "06",
    "heading": "Responsive / content rules",
    "blocks": [
     {
      "type": "text",
      "text": "Fixed at 136 by 40; it never stretches."
     }
    ]
   }
  ]
 },
 "textarea": {
  "nodeId": "4470:2519",
  "title": "Textarea",
  "category": "NORTHSTAR DS / COMPONENT SPECIFICATION · 33",
  "revision": "Reviewed 15 Oct 2026",
  "summary": "A multi-line text field with a label, an optional character counter and an error message. Built natively for NorthStar in Open Sans; every fill and text is bound to Semantic / Colors. Eight variants.",
  "meta": {
   "Review status": "Built 15 Oct 2026, not yet source-reviewed",
   "Parity status": "Docs site renders the same component in HTML and CSS",
   "Evidence boundary": "Figma inspection, not runtime or AT testing"
  },
  "sections": [
   {
    "nodeId": "4470:2535",
    "number": "01",
    "heading": "Purpose / when not to use",
    "blocks": [
     {
      "type": "note",
      "heading": "USE",
      "text": "Collect free text of more than one line."
     },
     {
      "type": "note",
      "heading": "DO NOT USE",
      "text": "Do not use for single-line values (Text input) or for rich text."
     }
    ]
   },
   {
    "nodeId": "4470:2546",
    "number": "02",
    "heading": "Visual anatomy",
    "blocks": [
     {
      "type": "text",
      "text": "1 · Label: SemiBold 14, text/primary. 2 · Field: 340 by 96, background/elevated, border/default, 8px radius. 3 · Placeholder: text/tertiary. 4 · Helper row: error message on the left, counter on the right."
     },
     {
      "type": "example",
      "label": "Default, On",
      "description": "Textarea instance, State=Default, Counter=On."
     },
     {
      "type": "text",
      "text": "Variants: Default, Focus, Error and Disabled, each with the counter on or off."
     }
    ]
   },
   {
    "nodeId": "4470:2553",
    "number": "03",
    "heading": "Actual Figma API / defaults",
    "blocks": [
     {
      "type": "text",
      "text": "Textarea · set 4466:309 · page \"Textarea\" in the NorthStar file."
     },
     {
      "type": "table",
      "columns": [
       "Property",
       "Type",
       "Default",
       "Notes"
      ],
      "rows": [
       [
        "State",
        "VARIANT",
        "Default",
        "Default, Focus, Error, Disabled."
       ],
       [
        "Counter",
        "VARIANT",
        "On",
        "On or Off. Shows \"0 / 1000\"."
       ]
      ]
     }
    ]
   },
   {
    "nodeId": "4470:2584",
    "number": "04",
    "heading": "Current bindings / semantic mapping",
    "blocks": [
     {
      "type": "table",
      "columns": [
       "Layer",
       "Token",
       "Role"
      ],
      "rows": [
       [
        "Label",
        "text/primary",
        "Open Sans SemiBold 14"
       ],
       [
        "Field fill",
        "background/elevated",
        "background/sunken when Disabled"
       ],
       [
        "Field stroke",
        "border/default",
        "interactive/primary 2px in Focus, status/error 2px in Error"
       ],
       [
        "Placeholder",
        "text/tertiary",
        "Open Sans Regular 14"
       ],
       [
        "Error message",
        "status/error",
        "Open Sans Regular 12"
       ],
       [
        "Counter",
        "text/tertiary",
        "Open Sans Regular 12"
       ],
       [
        "Disabled",
        "Opacity 45%",
        "Whole component"
       ]
      ]
     },
     {
      "type": "text",
      "text": "Fills and text are bound to Semantic / Colors, spacing to Primitives where a token exists. A few radii and paddings are fixed values, not tokens."
     }
    ]
   },
   {
    "nodeId": "4470:2634",
    "number": "05",
    "heading": "Accessibility contract",
    "blocks": [
     {
      "type": "checklist",
      "items": [
       "The label is associated with the field.",
       "Errors use aria-invalid and aria-describedby that points at the message.",
       "The counter is text, announced politely, and states the limit.",
       "Error shows as a border and a message, not color alone.",
       "Disabled keeps the label readable."
      ]
     }
    ]
   },
   {
    "nodeId": "4470:2644",
    "number": "06",
    "heading": "Responsive / content rules",
    "blocks": [
     {
      "type": "text",
      "text": "Full width of its container with a 340px default. Height grows to about eight lines."
     }
    ]
   }
  ]
 },
 "tree-view": {
  "nodeId": "4470:2708",
  "title": "Tree view",
  "category": "NORTHSTAR DS / COMPONENT SPECIFICATION · 34",
  "revision": "Reviewed 15 Oct 2026",
  "summary": "A nested list of items with indentation, expandable parents, counts and one selected row. Built natively for NorthStar in Open Sans; every fill and text is bound to Semantic / Colors. Two variants.",
  "meta": {
   "Review status": "Built 15 Oct 2026, not yet source-reviewed",
   "Parity status": "Docs site renders the same component in HTML and CSS",
   "Evidence boundary": "Figma inspection, not runtime or AT testing"
  },
  "sections": [
   {
    "nodeId": "4470:2724",
    "number": "01",
    "heading": "Purpose / when not to use",
    "blocks": [
     {
      "type": "note",
      "heading": "USE",
      "text": "Browse nested items such as accounts, locations and devices."
     },
     {
      "type": "note",
      "heading": "DO NOT USE",
      "text": "Do not use for flat lists or for page navigation (Side navigation)."
     }
    ]
   },
   {
    "nodeId": "4470:2735",
    "number": "02",
    "heading": "Visual anatomy",
    "blocks": [
     {
      "type": "text",
      "text": "1 · Row: Regular 14 label, text/primary, 28px tall. 2 · Chevron: text/tertiary, rotated 90 degrees when open. 3 · Count: text/tertiary, Regular 12. 4 · Selected row: background/selected. 5 · Indent: 20px per level."
     },
     {
      "type": "example",
      "label": "Expanded",
      "description": "Tree view instance, State=Expanded."
     },
     {
      "type": "text",
      "text": "Variants: Expanded (parent open, one child selected) and Collapsed."
     }
    ]
   },
   {
    "nodeId": "4470:2742",
    "number": "03",
    "heading": "Actual Figma API / defaults",
    "blocks": [
     {
      "type": "text",
      "text": "Tree view · set 4466:335 · page \"Tree view\" in the NorthStar file."
     },
     {
      "type": "table",
      "columns": [
       "Property",
       "Type",
       "Default",
       "Notes"
      ],
      "rows": [
       [
        "State",
        "VARIANT",
        "Expanded",
        "Expanded or Collapsed. Controls whether Chicago, IL shows its children."
       ]
      ]
     }
    ]
   },
   {
    "nodeId": "4470:2773",
    "number": "04",
    "heading": "Current bindings / semantic mapping",
    "blocks": [
     {
      "type": "table",
      "columns": [
       "Layer",
       "Token",
       "Role"
      ],
      "rows": [
       [
        "Selected row",
        "background/selected",
        "6px radius"
       ],
       [
        "Label",
        "text/primary",
        "Open Sans Regular 14"
       ],
       [
        "Count",
        "text/tertiary",
        "Open Sans Regular 12"
       ],
       [
        "Chevron",
        "text/tertiary",
        "Rotated when open"
       ],
       [
        "Indent",
        "Fixed",
        "20px per level"
       ],
       [
        "Gap",
        "spacing/2",
        "4px"
       ]
      ]
     },
     {
      "type": "text",
      "text": "Fills and text are bound to Semantic / Colors, spacing to Primitives where a token exists. A few radii and paddings are fixed values, not tokens."
     }
    ]
   },
   {
    "nodeId": "4470:2823",
    "number": "05",
    "heading": "Accessibility contract",
    "blocks": [
     {
      "type": "checklist",
      "items": [
       "The list is role=\"tree\" with role=\"treeitem\" rows and aria-level, aria-expanded and aria-selected.",
       "One row is the tab stop; arrow keys move, Right and Left expand and collapse, Enter selects.",
       "Selection is a background and aria-selected, not color alone.",
       "Counts are text, read after the label.",
       "Expand and collapse work from the keyboard, not only by clicking the chevron."
      ]
     }
    ]
   },
   {
    "nodeId": "4470:2833",
    "number": "06",
    "heading": "Responsive / content rules",
    "blocks": [
     {
      "type": "text",
      "text": "Each level indents 20px. Long labels truncate with an ellipsis."
     }
    ]
   }
  ]
 },
 "command-palette": {
  "nodeId": "4470:2906",
  "title": "Command palette",
  "category": "NORTHSTAR DS / COMPONENT SPECIFICATION · 35",
  "revision": "Reviewed 15 Oct 2026",
  "summary": "A keyboard-first launcher with a search field and grouped results for finding records, pages and actions. Built natively for NorthStar in Open Sans; every fill and text is bound to Semantic / Colors. Two variants.",
  "meta": {
   "Review status": "Built 15 Oct 2026, not yet source-reviewed",
   "Parity status": "Docs site renders the same component in HTML and CSS",
   "Evidence boundary": "Figma inspection, not runtime or AT testing"
  },
  "sections": [
   {
    "nodeId": "4470:2922",
    "number": "01",
    "heading": "Purpose / when not to use",
    "blocks": [
     {
      "type": "note",
      "heading": "USE",
      "text": "Jump to any record, page or action from the keyboard."
     },
     {
      "type": "note",
      "heading": "DO NOT USE",
      "text": "Do not use it as the only way to reach a feature, or in place of a search results page (Search)."
     }
    ]
   },
   {
    "nodeId": "4470:2933",
    "number": "02",
    "heading": "Visual anatomy",
    "blocks": [
     {
      "type": "text",
      "text": "1 · Panel: 440px, background/elevated, border/default, 12px radius. 2 · Search field: background/secondary, 8px radius. 3 · Group label: SemiBold 11, text/tertiary. 4 · Result rows: label and type; the active row is background/selected. 5 · Hints: keyboard hints at the bottom."
     },
     {
      "type": "example",
      "label": "Empty",
      "description": "Command palette instance, Query=Empty."
     },
     {
      "type": "text",
      "text": "Variants: Empty (recent items) and a query of \"acme\" (filtered results)."
     }
    ]
   },
   {
    "nodeId": "4470:2940",
    "number": "03",
    "heading": "Actual Figma API / defaults",
    "blocks": [
     {
      "type": "text",
      "text": "Command palette · set 4466:359 · page \"Command palette\" in the NorthStar file."
     },
     {
      "type": "table",
      "columns": [
       "Property",
       "Type",
       "Default",
       "Notes"
      ],
      "rows": [
       [
        "Query",
        "VARIANT",
        "Empty",
        "Empty or acme. Changes the field text and the results."
       ]
      ]
     }
    ]
   },
   {
    "nodeId": "4470:2971",
    "number": "04",
    "heading": "Current bindings / semantic mapping",
    "blocks": [
     {
      "type": "table",
      "columns": [
       "Layer",
       "Token",
       "Role"
      ],
      "rows": [
       [
        "Panel fill and stroke",
        "background/elevated, border/default",
        "12px radius"
       ],
       [
        "Search field",
        "background/secondary",
        "Placeholder text/tertiary, query text/primary"
       ],
       [
        "Group label",
        "text/tertiary",
        "Open Sans SemiBold 11"
       ],
       [
        "Result label",
        "text/primary",
        "Open Sans Regular 14"
       ],
       [
        "Result type",
        "text/tertiary",
        "Open Sans Regular 12"
       ],
       [
        "Active row",
        "background/selected",
        "First result"
       ]
      ]
     },
     {
      "type": "text",
      "text": "Fills and text are bound to Semantic / Colors, spacing to Primitives where a token exists. A few radii and paddings are fixed values, not tokens."
     }
    ]
   },
   {
    "nodeId": "4470:3021",
    "number": "05",
    "heading": "Accessibility contract",
    "blocks": [
     {
      "type": "checklist",
      "items": [
       "The palette is role=\"dialog\" with a labelled search field and a listbox of results.",
       "Cmd K or Ctrl K opens it; arrows move the active row, Enter opens it, Escape closes it and returns focus.",
       "Results announce their group and type.",
       "The active row shows as a background and aria-selected, not color alone.",
       "The docs demo is a static specimen; these behaviors are the contract to build."
      ]
     }
    ]
   },
   {
    "nodeId": "4470:3031",
    "number": "06",
    "heading": "Responsive / content rules",
    "blocks": [
     {
      "type": "text",
      "text": "Centered and 440px wide, full width minus the page margin on narrow screens."
     }
    ]
   }
  ]
 },
 "icon-button": {
  "nodeId": "4470:3102",
  "title": "Icon button",
  "category": "NORTHSTAR DS / COMPONENT SPECIFICATION · 36",
  "revision": "Reviewed 15 Oct 2026",
  "summary": "A square button with only an icon, in four hierarchies, three sizes and five states. Built natively for NorthStar; every fill is bound to Semantic / Colors. Sixty variants, shipped with the More icon.",
  "meta": {
   "Review status": "Built 15 Oct 2026, not yet source-reviewed",
   "Parity status": "Docs site renders the same component in HTML and CSS",
   "Evidence boundary": "Figma inspection, not runtime or AT testing"
  },
  "sections": [
   {
    "nodeId": "4470:3118",
    "number": "01",
    "heading": "Purpose / when not to use",
    "blocks": [
     {
      "type": "note",
      "heading": "USE",
      "text": "Trigger a single action with an icon only, in toolbars, table rows and dense headers."
     },
     {
      "type": "note",
      "heading": "DO NOT USE",
      "text": "Do not use without an accessible name and a tooltip, for primary page actions (Button), or for navigation (Link)."
     }
    ]
   },
   {
    "nodeId": "4470:3129",
    "number": "02",
    "heading": "Visual anatomy",
    "blocks": [
     {
      "type": "text",
      "text": "1 · Container: 32, 40 or 48px square, 8px radius. 2 · Icon: three-dot More icon, 14, 16 or 20px. 3 · Hierarchy sets the fill and the icon color. 4 · Focus: 2px focus/ring outside the container. 5 · Disabled: 45% opacity."
     },
     {
      "type": "example",
      "label": "Primary, S, Default",
      "description": "Icon button instance, Hierarchy=Primary, Size=S, State=Default."
     },
     {
      "type": "text",
      "text": "Variants: Primary, Secondary, Ghost or Danger; S, M or L; Default, Hover, Pressed, Focus or Disabled. Swap the icon layer for Edit or Send."
     }
    ]
   },
   {
    "nodeId": "4470:3136",
    "number": "03",
    "heading": "Actual Figma API / defaults",
    "blocks": [
     {
      "type": "text",
      "text": "Icon button · set 4466:661 · page \"Icon button\" in the NorthStar file."
     },
     {
      "type": "table",
      "columns": [
       "Property",
       "Type",
       "Default",
       "Notes"
      ],
      "rows": [
       [
        "Hierarchy",
        "VARIANT",
        "Primary",
        "Primary, Secondary, Ghost, Danger."
       ],
       [
        "Size",
        "VARIANT",
        "S",
        "S 32px, M 40px, L 48px."
       ],
       [
        "State",
        "VARIANT",
        "Default",
        "Default, Hover, Pressed, Focus, Disabled."
       ]
      ]
     }
    ]
   },
   {
    "nodeId": "4470:3167",
    "number": "04",
    "heading": "Current bindings / semantic mapping",
    "blocks": [
     {
      "type": "table",
      "columns": [
       "Layer",
       "Token",
       "Role"
      ],
      "rows": [
       [
        "Primary fill",
        "interactive/primary",
        "Hover interactive/hover, pressed interactive/pressed"
       ],
       [
        "Primary icon",
        "text/on-primary",
        "Also on Danger"
       ],
       [
        "Secondary fill and stroke",
        "background/elevated, border/default",
        "Hover background/hover, pressed background/selected"
       ],
       [
        "Ghost icon",
        "text/secondary",
        "No fill at rest"
       ],
       [
        "Danger fill",
        "status/error",
        "Same in every state"
       ],
       [
        "Focus ring",
        "focus/ring",
        "2px stroke, outside"
       ],
       [
        "Disabled",
        "Opacity 45%",
        "Whole component"
       ]
      ]
     },
     {
      "type": "text",
      "text": "Fills and text are bound to Semantic / Colors, spacing to Primitives where a token exists. A few radii and paddings are fixed values, not tokens."
     }
    ]
   },
   {
    "nodeId": "4470:3217",
    "number": "05",
    "heading": "Accessibility contract",
    "blocks": [
     {
      "type": "checklist",
      "items": [
       "Every icon button has an accessible name (aria-label) and a tooltip.",
       "Targets are 32px or larger in every size.",
       "The focus ring is visible on every hierarchy.",
       "Danger is named in text, not only colored.",
       "Disabled is 45% opacity and not focusable."
      ]
     }
    ]
   },
   {
    "nodeId": "4470:3227",
    "number": "06",
    "heading": "Responsive / content rules",
    "blocks": [
     {
      "type": "text",
      "text": "Use M by default, S inside dense rows and L on touch layouts."
     }
    ]
   }
  ]
 }
};
  NS.WORKFLOWS = { "create-account": {
 "nodeId": "4139:56617",
 "title": "Create Account",
 "category": "NORTHSTAR DS / COMPOSED WORKFLOW · 06",
 "revision": "Reviewed 04 Oct 2026",
 "summary": "A static form composition showing entry, actionable validation and a success outcome on one surface. All account values are demo data; application actions and server outcomes are illustrative.",
 "meta": {
  "Review status": "Source-reviewed",
  "Parity status": "Partial parity",
  "Owner": "Owner: Unassigned",
  "Evidence boundary": "Figma inspection + online source • not runtime / AT testing"
 },
 "sections": [
  {
   "nodeId": "4139:56629",
   "number": "01",
   "heading": "Entry → validation recovery",
   "blocks": [
    {
     "type": "example",
     "label": "Form state 1: Default (card 548x670)",
     "description": "Header: state title 'Default' (18px), technical label 'DEMO DATA · static design state', form title 'Create account' (22px), copy 'Add an account and set its billing preferences.' Fields: 'Company name *' = 'Atlas Works'; 'Tier *' = 'Growth'; 'Billing email *' label (12px) with control value 'billing@atlas.example' (14px, default border), helper (13px, text/secondary) 'Invoices will be sent to this address.'; checkbox (checked) labelled 'Send welcome kit'; actions: Button label 'Create account' (Primary, bg interactive/primary #023aff), label 'Cancel' (hierarchy Ghost). Note: 'Required fields are marked *. Cancel leaves without creating an account; persistence rules require application decisions.'"
    },
    {
     "type": "example",
     "label": "Form state 2: Validation error (card 548x670)",
     "description": "Header: 'Validation error', 'DEMO DATA · static design state', 'Create account', 'Add an account and set its billing preferences.' Feedback banner (Error, Buttons Yes, Description Yes; 508x136, bg rgba(253,32,105,0.32)): title 'Account not created', description 'Check Billing email. Enter a complete address, then create the account again.', buttons 'Review email', 'Keep editing'. Fields 'Company name *' 'Atlas Works'; 'Tier *' 'Growth'. 'Billing email *' control value 'billing@' with red/400 #ff2069 border (Error state); error helper in red/400 13px: 'Enter a complete email address, for example billing@atlas.example.' Checkbox 'Send welcome kit'; actions 'Create account' (Primary), 'Cancel' (Ghost). Note: 'Required fields are marked *. Cancel leaves without creating an account; persistence rules require application decisions.'"
    },
    {
     "type": "note",
     "heading": "Evidence boundary",
     "text": "Online validation messages are example content, not verified server submission. These are composed design states, not a functioning prototype. No prototype interactions have been authored."
    }
   ]
  },
  {
   "nodeId": "4139:56784",
   "number": "02",
   "heading": "Success / preserve the outcome",
   "blocks": [
    {
     "type": "example",
     "label": "Form state 3: Success (card 568x626)",
     "description": "Header: 'Success', 'DEMO DATA · static design state', 'Create account', 'Add an account and set its billing preferences.' Feedback banner (Success, Buttons No, Description Yes; 528x92, bg rgba(43,255,89,0.35)): title 'Account created · demo outcome', description 'Atlas Works is ready. Billing email and Growth tier are saved in this illustrative state.' Fields 'Company name *' 'Atlas Works'; 'Tier *' 'Growth'; 'Billing email *' 'billing@atlas.example', helper 'Invoices will be sent to this address.'; checkbox 'Send welcome kit'; actions 'Create account' (State=Disabled, bg interactive/disabled #2c2c35, opacity 64%), 'Cancel' (Ghost). Note: 'Proposed success behavior: prevent duplicate submit while preserving the result. Next action: open the account record.'"
    },
    {
     "type": "label",
     "text": "ANNOTATED WALKTHROUGH · proposed application behavior"
    },
    {
     "type": "table",
     "columns": [
      "Step",
      "Decision / expected outcome"
     ],
     "rows": [
      [
       "1",
       "Enter Company name and Billing email. Associate visible labels and helper text with native input IDs."
      ],
      [
       "2",
       "Choose Growth from Tier. The custom Dropdown shown here needs controller / keyboard work before release."
      ],
      [
       "3",
       "Confirm Send welcome kit. Checkbox preference is independent of tier."
      ],
      [
       "4",
       "Create account submits; Cancel is type=\"button\". Retain values on validation failure."
      ],
      [
       "5",
       "Review email leads to the invalid field; Keep editing preserves input. These actions are illustrative."
      ],
      [
       "6",
       "After a confirmed server result, announce success politely and offer the account record. No server result is verified here."
      ]
     ]
    }
   ]
  },
  {
   "nodeId": "4139:56898",
   "number": "03",
   "heading": "Tier / composed options handoff",
   "blocks": [
    {
     "type": "label",
     "text": "DEMO OPTIONS · open composition"
    },
    {
     "type": "example",
     "label": "Account tier options (Menu instance, 200x174)",
     "description": "Menu with four overridden demo options: 'Starter', 'Growth', 'Enterprise', 'Custom' (14px, gray/1 #d0d0da). Container bg gray/9 #0f0f13, padding 4, gap 2, radius 8; first-row hover shown."
    },
    {
     "type": "text",
     "text": "The actual Menu instance uses four overridden demo options. Its first-row hover is not a selected-value indicator. The form trigger text is Growth; open / selection controller behavior is proposed, not an existing Figma variant."
    },
    {
     "type": "note",
     "heading": "Deliberate difference from the online form",
     "text": "NorthStar’s forms pattern uses a native Select for Tier, not the custom Dropdown. This showcase uses the current Figma Dropdown recipe to demonstrate composition. Retain native Select online until the custom keyboard and ARIA gates are met."
    },
    {
     "type": "text",
     "text": "https://mikelrosenthal.com/northstar/#/patterns/forms"
    }
   ]
  },
  {
   "nodeId": "4139:56936",
   "number": "04",
   "heading": "Handoff / property mapping",
   "blocks": [
    {
     "type": "table",
     "columns": [
      "Composed field / control",
      "Figma configuration",
      "Implementation contract / gap"
     ],
     "rows": [
      [
       "Company name",
       "Pattern Field Group with Medium / Default Text Input",
       "label / id; value; required. Wrapper composition, not a Figma label prop."
      ],
      [
       "Billing email",
       "Medium / Default → Error; helper composed",
       "type=email; helperText / aria-describedby; error aria-invalid. Validation logic required."
      ],
      [
       "Tier",
       "Trigger Text / Default + Menu Items=4",
       "Online forms native Select. Custom label / items controller is not complete; P0 keyboard / ARIA gap."
      ],
      [
       "Send welcome kit",
       "Checked Yes / Hovered No / Disabled No / Show label No",
       "Native checked; associate composed label. Larger clickable target."
      ],
      [
       "Create account / Cancel",
       "Recommended Primary / Ghost, M, explicit labels",
       "type=submit / button; map Label→content. M source 38px, online M40px."
      ],
      [
       "Feedback",
       "Error with description + actions; Success with description",
       "Summary + field error; polite success. Urgency review; real dismissal and action handlers required."
      ]
     ]
    },
    {
     "type": "text",
     "text": "No package, exporter, CI or submission service was verified. Form-state orchestration belongs to the application; @northstar/react examples remain advertised only."
    }
   ]
  },
  {
   "nodeId": "4139:56970",
   "number": "05",
   "heading": "Accessibility / release acceptance",
   "blocks": [
    {
     "type": "checklist",
     "items": [
      "Names: associate Company name, Billing email, Tier and Send welcome kit labels with controls; helper and error IDs remain stable.",
      "Keyboard: logical field → preference → actions order. Custom Tier needs Arrow navigation, selection, Escape close, focus return and accurate aria-expanded.",
      "Validation: preserve entered values, show an actionable email message, link summary to invalid field and specify focus behavior after submit; avoid duplicate announcements.",
      "Feedback: status is polite by default; assertive only for urgent dynamic alerts. Banner appearance alone does not move focus; dismissal must actually remove it.",
      "Responsive: stack fields and actions when needed; retain recovery copy at 200% zoom and in long translations / RTL. Validate contrast, target size and forced colors.",
      "Before release: manual keyboard / screen-reader and visual tests, real submission / failure evidence, duplicate-submit policy and assigned owners. All gates remain required."
     ]
    },
    {
     "type": "note",
     "heading": "Ownership / status",
     "text": "Design, engineering, accessibility and release owners: Unassigned. Status: Source-reviewed / Partial parity. This static showcase does not change the website or deployment."
    }
   ]
  }
 ],
 "footer": [
  "NORTHSTAR DS is the linked Figma library. NorthStar is the online documentation name.",
  "Required before release"
 ]
} };
})();
