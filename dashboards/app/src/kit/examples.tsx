/* Usage examples shown on the docs site's Code tabs. Each region between "@example <component-id>" and
   "@end" is copied verbatim by tools/react-kit-export.mjs, so every snippet on the site typechecks
   here first (npx tsc --noEmit -p tsconfig.app.json). Not rendered by the app. */
import * as React from "react";
import { toast } from "sonner";
import { Badge, Bento, BarList, Button, CheckboxField, CommandPalette, ConfirmAction, DataTable, Facts, Figure, Hint, Pill, Segmented, SelectField, Spark, Stat, SwitchField, TextField, Tile, ViewTabs, type Col } from "@/kit";

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
      <Badge status="success">Active</Badge>
      <Badge status="warning">Pending</Badge>
      <Badge status="error">Failed</Badge>
      <Badge status="info">Beta</Badge>
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
    // Mount <Toaster theme="dark" position="bottom-right" /> once at the app root, then call toast() anywhere:
    <Button variant="secondary" size="sm" onClick={() => toast.success("Account archived", { description: "Acme Corp moved to the archive.", action: { label: "Undo", onClick: () => {} } })}>Archive</Button>
    // @end
  );
}

export function ProgressExample() {
  return (
    // @example progress
    <BarList max={100} items={[{ label: "Self review", value: 94 }, { label: "Peer review", value: 89 }, { label: "Calibration", value: 51 }]} fmt={(n) => n + "%"} />
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
    <CommandPalette open={open} onOpenChange={setOpen} placeholder="Search accounts, pages and actions"
      groups={[{ heading: "Accounts", items: [{ id: "acme", label: "Acme Corp", meta: "Account" }] }, { heading: "Actions", items: [{ id: "new", label: "Create account", meta: "Action" }] }]}
      onSelect={(item) => { setOpen(false); toast.success("Opened " + item.label); }} />
  );
  // @end
}

export function TextInputExample() {
  // @example text-input
  const [email, setEmail] = React.useState("");
  const invalid = email.length > 0 && !email.includes("@");
  return (
    <TextField label="Billing email" type="email" required value={email} onChange={setEmail}
      helper="Invoices go to this address." error={invalid ? "Enter an email address, like name@company.com." : undefined} />
  );
  // @end
}

export function SelectExample() {
  // @example select
  const [region, setRegion] = React.useState<"us" | "eu" | "apac" | null>(null);
  return (
    <SelectField label="Data region" value={region} onChange={setRegion} placeholder="Choose a region"
      options={[{ id: "us", label: "United States" }, { id: "eu", label: "European Union" }, { id: "apac", label: "Asia Pacific" }]}
      helper="Where account data is stored." />
  );
  // @end
}

export function CheckboxExample() {
  // @example checkbox
  const [picked, setPicked] = React.useState({ email: true, slack: false });
  const all = picked.email && picked.slack, some = picked.email || picked.slack;
  return (
    <div className="flex flex-col gap-2">
      <CheckboxField label="All channels" checked={all} indeterminate={some && !all} onChange={(c) => setPicked({ email: c, slack: c })} />
      <CheckboxField label="Email" checked={picked.email} onChange={(c) => setPicked((p) => ({ ...p, email: c }))} />
      <CheckboxField label="Slack" checked={picked.slack} onChange={(c) => setPicked((p) => ({ ...p, slack: c }))} />
    </div>
  );
  // @end
}

export function ToggleExample() {
  // @example toggle
  const [alerts, setAlerts] = React.useState(true);
  return <SwitchField label="Usage alerts" checked={alerts} onChange={setAlerts} helper="Email me when usage passes 80%." />;
  // @end
}

export function TabsExample() {
  // @example tabs
  const [tab, setTab] = React.useState<"overview" | "billing" | "activity">("overview");
  return (
    <ViewTabs label="Account" value={tab} onChange={setTab} tabs={[
      { id: "overview", label: "Overview", content: <p>Plan, owner and health.</p> },
      { id: "billing", label: "Billing", content: <p>Invoices and payment method.</p> },
      { id: "activity", label: "Activity", content: <p>The last 30 days of events.</p> },
    ]} />
  );
  // @end
}

export function TooltipExample() {
  return (
    // @example tooltip
    <Hint content="Export accounts as CSV">
      <Button variant="secondary" size="sm">Export</Button>
    </Hint>
    // @end
  );
}
