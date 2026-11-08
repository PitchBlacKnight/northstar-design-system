/* Usage examples shown on the docs site's Code tabs. Each region between "@example <component-id>" and
   "@end" is copied verbatim by tools/react-kit-export.mjs, so every snippet on the site typechecks
   here first (npx tsc --noEmit -p tsconfig.app.json). Not rendered by the app. */
import * as React from "react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Bento, BarList, ConfirmAction, DataTable, Facts, Figure, Pill, Segmented, Spark, Stat, Tile, type Col } from "@/kit";

type Account = { id: string; name: string; plan: string; mrr: number; status: "Active" | "Past due" };
const accounts: Account[] = [
  { id: "a1", name: "Acme Corp", plan: "Gold", mrr: 12400, status: "Active" },
  { id: "a2", name: "Globex", plan: "Silver", mrr: 5200, status: "Past due" },
];
const trend = [12, 14, 13, 17, 19, 18, 22];

export function CardExample() {
  return (
    // @example card
    <Bento>
      <Tile label="Gross volume" tone="accent" className="md:col-span-6 xl:col-span-8">
        <Figure value={546349} fmt="money" size="xl" />
        <Spark data={trend} id="gross" />
      </Tile>
      <Tile label="Net volume" className="md:col-span-6 xl:col-span-4">
        <Stat label="After fees and refunds" value={528529} fmt="money" delta={0.075} sub="vs previous" />
      </Tile>
    </Bento>
    // @end
  );
}

export function TableExample() {
  // @example data-table
  const cols: Col<Account>[] = [
    { key: "name", label: "Account", sort: (r) => r.name, cell: (r) => r.name },
    { key: "status", label: "Status", cell: (r) => <Pill status={r.status === "Active" ? "success" : "error"}>{r.status}</Pill> },
    { key: "mrr", label: "MRR", align: "right", sort: (r) => r.mrr, cell: (r) => "$" + r.mrr.toLocaleString("en-US") },
  ];
  return (
    <DataTable rows={accounts} cols={cols} rowKey={(r) => r.id} filterText={(r) => r.name} filterPlaceholder="Filter accounts"
      initialSort={{ key: "mrr", dir: "desc" }}
      detailTitle={(r) => r.name} detail={(r) => <Facts rows={[["Plan", r.plan], ["MRR", "$" + r.mrr.toLocaleString("en-US")]]} />} />
  );
  // @end
}

export function BadgeExample() {
  return (
    // @example badge
    <div className="flex gap-2">
      <Pill status="success">Active</Pill>
      <Pill status="warning">Pending</Pill>
      <Pill status="error">Failed</Pill>
    </div>
    // @end
  );
}

export function SegmentedExample() {
  // @example segmented-control
  const [period, setPeriod] = React.useState<"7d" | "4w" | "12m">("4w");
  return <Segmented label="Period" value={period} onChange={setPeriod} options={[{ id: "7d", label: "7d" }, { id: "4w", label: "4w" }, { id: "12m", label: "12m" }]} />;
  // @end
}

export function ModalExample() {
  return (
    // @example modal
    <ConfirmAction trigger="Refund payment" destructive title="Refund $2,590.85?"
      description="Massive Dynamic gets the full amount back in 5 to 10 business days."
      confirm="Refund" success="Refund issued" successDescription="$2,590.85 to Massive Dynamic"
      onConfirm={() => { /* call your API here */ }} />
    // @end
  );
}

export function NotificationExample() {
  return (
    // @example notification
    <>
      <Toaster theme="dark" position="bottom-right" />
      <button onClick={() => toast.success("Account archived", { description: "Acme Corp moved to the archive.", action: { label: "Undo", onClick: () => {} } })}>Archive</button>
    </>
    // @end
  );
}

export function ProgressExample() {
  return (
    // @example progress
    <BarList items={[{ label: "Self review", value: 94 }, { label: "Peer review", value: 89 }, { label: "Calibration", value: 51 }]} fmt={(n) => n + "%"} />
    // @end
  );
}

export function PaletteExample() {
  // @example command-palette
  const [open, setOpen] = React.useState(false);
  React.useEffect(() => {
    const on = (e: KeyboardEvent) => { if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); setOpen((o) => !o); } };
    addEventListener("keydown", on); return () => removeEventListener("keydown", on);
  }, []);
  return (
    <CommandDialog open={open} onOpenChange={setOpen} title="Search" description="Search accounts and pages">
      <Command>
        <CommandInput placeholder="Search accounts, pages and actions" />
        <CommandList>
          <CommandEmpty>No results.</CommandEmpty>
          <CommandGroup heading="Accounts">
            <CommandItem onSelect={() => setOpen(false)}>Acme Corp</CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  );
  // @end
}
