/* Variant guidance: one "when to use" line per variant, keyed by component id, then variant name.
   Drafted from each component's variant names and existing site copy. Shown under each variant on the Usage tab. */
(function () {
  const NS = window.NS;
  const chartSizes = { "Sizes": "Choose the size that fits the card. Keep labels readable at that size.", "XL": "Use the largest size for a main panel with many values.", "Plot only": "Use plot only when the surrounding card supplies the title and legend." };
  const chart = () => chartSizes;
  const G = {
    "alert-banner": { "All types": "Use one banner per condition. Choose the tone that matches the urgency, and keep the title short." },
    "avatar": { "Sizes": "Use the smallest size that keeps the person recognisable. Larger sizes suit profile headers.", "Shape + status": "Use round avatars for people and square ones for organisations or objects. Show status only when presence matters.", "Group": "Use a group when several people share one object, such as a record or a thread. Show overflow as a count." },
    "badge": { "Types x state": "Choose the type that matches the meaning, and the state that matches the object's current condition.", "Sizes": "Use the small size inside dense tables and lists. Use the default size next to headings.", "Status dot": "Pair the dot with a text label. A dot alone is not enough.", "Count": "Use a count for quantities people act on, such as unread items." },
    "bulk-action-bar": { "Default": "Show when people select rows and need to act on all of them.", "Destructive": "Use for actions that delete or remove items. Ask for confirmation before the action runs." },
    "button": { "Hierarchy": "Use primary for the one main action on a page. Use secondary for other actions. Use outline and ghost for the least important actions.", "States": "Hover, pressed, focus and disabled show the current state. Disable only when the action truly can't happen.", "Sizes": "Use one size per page. Medium is the default.", "Icons": "Add an icon only when it supports the label. Icon-only buttons need an accessible name." },
    "card": { "KPI tile": "Use one card per headline number. Keep the label short and the value the most prominent item." },
    "checkbox": { "Checked / unchecked": "Use for independent choices that can be turned on or off.", "Indeterminate": "Use when a parent checkbox covers some, but not all, of its children." },
    "combobox": { "Empty": "Use for a searchable choice list with many options.", "With picks": "Show chosen values as removable chips so people can see and change their picks." },
    "command-palette": { "Recent": "Show recently used commands when the query is empty.", "Results": "Show matching commands as people type." },
    "data-table": { "Simple table": "Use for a plain list of records with few columns and no bulk actions." },
    "date-picker": { "Calendar": "Use when people pick a date from a calendar. Use text entry when the date is already known." },
    "dropdown": { "Trigger states": "Use the trigger for a single choice from a list. Show the chosen value in the trigger.", "Live": "Use when the options change as people type, such as search results." },
    "icon-button": { "Hierarchy": "Use primary for the one main icon action. Use ghost in toolbars.", "Sizes": "Match the size to the controls around it." },
    "inline-edit": { "Read": "Show the value as plain text until someone needs to change it.", "Editing": "Show an input in place of the text, with save and cancel." },
    "link": { "Default": "Use for navigation to another page or section.", "External": "Mark links that leave the site so people know they're leaving." },
    "menu": { "Basic": "Use for a short list of actions from a trigger.", "Destructive": "Put destructive items at the bottom of the menu and style them as warnings." },
    "number-stepper": { "Default": "Use for a small number with simple increase and decrease steps.", "At minimum": "Disable the decrease control at the minimum so people can see the limit." },
    "progress": { "Colors": "Use the brand colour for the normal state. Use semantic colours only when they carry a real status." },
    "radio-button": { "States": "Use for choosing one option from a short list. Use checkboxes when several options can be chosen." },
    "search": { "Global": "Use one global search in the header for finding anything on the site." },
    "segmented-control": { "Default": "Use for switching between two to four related views.", "Disabled segment": "Disable a segment only when its view can't be used now, and say why nearby." },
    "select": { "Default": "Use a native select for short, fixed lists.", "Inline": "Use an inline select inside a table cell or toolbar." },
    "slider": { "With ticks": "Use ticks when people benefit from seeing the steps or range." },
    "status-dot": { "All statuses": "Use one status per object, and always pair it with a label.", "Label in a header": "Put the status label beside the object's title." },
    "tabs": { "With count": "Show a count when it helps people decide whether to open the tab." },
    "tag": { "States": "Use tags to show a state or category. Make a tag removable only if it can be removed.", "Emphasis and shape": "Use strong emphasis for the most important tags. Keep shapes consistent within a list.", "Filter": "Use filter tags for applied filters that people can remove.", "Color chips": "Use colour chips for categories with an assigned colour, and always show the name." },
    "text-input": { "States": "Use default for empty fields, error when validation fails, and disabled only when the field is not available.", "Sizes": "Match the size to the form controls around it.", "Textarea": "Use a textarea for longer text. Use a text input for short values." },
    "textarea": { "Default": "Use for long text such as notes or descriptions.", "Error": "Show the error next to the field and link it to the field for screen readers." },
    "toast": { "Success": "Confirm a completed action briefly.", "Error": "Say what failed and how to fix it. Keep the message until people dismiss it or the problem is fixed." },
    "tooltip": { "Live hover": "Use for short labels on hover. Don't put essential information only in a tooltip." },
    "tree-view": { "Expanded": "Use when people need to see the full structure.", "Collapsed": "Collapse groups that people rarely need to see." },
    "toggle": { "Sizes": "Use the default size. Use a switch for an immediate on or off setting." },
    "bubble-chart": chart("bubble-chart"), "bullet-chart": { ...chartSizes, "Rows only": "Use rows only when the surrounding card gives the title and context." },
    "calendar-chart": chart("calendar-chart"), "candlestick-chart": chart("candlestick-chart"), "dumbbell-chart": chart("dumbbell-chart"),
    "funnel-chart": chart("funnel-chart"), "gauge-chart": chart("gauge-chart"), "heatmap-chart": chart("heatmap-chart"),
    "parallel-coordinates-chart": chart("parallel-coordinates-chart"), "radar-chart": chart("radar-chart"), "radial-bar-chart": chart("radial-bar-chart"),
    "radial-convergence-chart": chart("radial-convergence-chart"), "radial-histogram-chart": chart("radial-histogram-chart"), "scatter-chart": chart("scatter-chart"),
    "stepped-line-chart": chart("stepped-line-chart"), "sunburst-chart": chart("sunburst-chart"), "tree-chart": chart("tree-chart"), "treemap-chart": chart("treemap-chart"),
  };
  NS.VARIANT_GUIDE = G;
})();
