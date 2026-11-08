import type { ViewMeta } from "./types";
import { Bento, Tile, ViewHeader } from "@/kit";
import * as Ex from "@/kit/examples";

export const meta: ViewMeta = {
  slug: "kit", title: "Kit gallery", modeledOn: "NorthStar React kit", category: "Other", order: 900,
  summary: "Every React kit example running live: the same code the docs Code tabs show.",
};

/* Each tile runs one example from src/kit/examples.tsx, the file the docs copy their snippets from */
const ITEMS: [string, string, () => React.ReactNode, string][] = [
  ["Text input", "text-input", Ex.TextInputExample, "md:col-span-3 xl:col-span-4"],
  ["Select", "select", Ex.SelectExample, "md:col-span-3 xl:col-span-4"],
  ["Checkbox", "checkbox", Ex.CheckboxExample, "md:col-span-3 xl:col-span-2"],
  ["Switch", "toggle", Ex.ToggleExample, "md:col-span-3 xl:col-span-2"],
  ["Tabs", "tabs", Ex.TabsExample, "md:col-span-3 xl:col-span-4"],
  ["Tooltip", "tooltip", Ex.TooltipExample, "md:col-span-3 xl:col-span-2"],
  ["Segmented control", "segmented-control", Ex.SegmentedExample, "md:col-span-3 xl:col-span-3"],
  ["Badge", "badge", Ex.BadgeExample, "md:col-span-3 xl:col-span-3"],
  ["Modal", "modal", Ex.ModalExample, "md:col-span-3 xl:col-span-2"],
  ["Notification", "notification", Ex.NotificationExample, "md:col-span-3 xl:col-span-2"],
  ["Progress", "progress", Ex.ProgressExample, "md:col-span-6 xl:col-span-8"],
  ["Command palette (press Cmd K)", "command-palette", Ex.PaletteExample, "md:col-span-6 xl:col-span-12"],
  ["Data table", "data-table", Ex.TableExample, "md:col-span-6 xl:col-span-12"],
];

export default function KitGallery() {
  return (
    <>
      <ViewHeader title="Kit gallery" sub={<>Every NorthStar React kit example, running. The docs Code tabs copy these snippets from <code className="font-mono text-xs">src/kit/examples.tsx</code>.</>} />
      <Bento>
        {ITEMS.map(([label, id, Example, span]) => (
          <Tile key={id} label={label} className={span} action={<a className="text-xs text-ns-link hover:underline" href={`../../#/components/${id}/code`}>Docs</a>}>
            <Example />
          </Tile>
        ))}
      </Bento>
      <Ex.CardExample />
    </>
  );
}
