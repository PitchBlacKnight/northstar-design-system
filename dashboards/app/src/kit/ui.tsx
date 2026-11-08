/* Shared dashboard parts. Every view composes these, so tiles, figures, tables and actions behave the
   same across all eight dashboards. Colors come only from NorthStar roles via Tailwind utilities. */
import * as React from "react";
import NumberFlow, { type Format } from "@number-flow/react";
import { toast } from "sonner";
import { ArrowDownIcon, ArrowUpIcon, ChevronsUpDownIcon } from "lucide-react";
import { Area, AreaChart } from "recharts";
import { cn } from "@/lib/utils";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button, Modal, ModalClose } from "./ns";

/* ---------- grid and tiles ---------- */
/* 12-column bento on wide screens, 6 at tablet, 1 on phones. Pass span classes on each Tile. */
export function Bento({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("grid grid-cols-1 gap-3 md:grid-cols-6 xl:grid-cols-12 auto-rows-min", className)}>{children}</div>;
}

/* tone: plain is the navy widget; accent, info and alert are the color blocks (three per screen at most). */
export type Tone = "plain" | "accent" | "info" | "alert";
const TONES: Record<Tone, string> = {
  plain: "bg-ns-widget border-border",
  accent: "bg-[color-mix(in_srgb,var(--ns-text-accent)_13%,var(--ns-widget-bg))] border-[color-mix(in_srgb,var(--ns-text-accent)_35%,transparent)]",
  info: "bg-[color-mix(in_srgb,var(--ns-chart-series-2)_16%,var(--ns-widget-bg))] border-[color-mix(in_srgb,var(--ns-chart-series-2)_40%,transparent)]",
  alert: "bg-[color-mix(in_srgb,var(--ns-status-error)_9%,var(--ns-widget-bg))] border-[color-mix(in_srgb,var(--ns-status-error)_35%,transparent)]",
};
/* One bento tile, one job: overline label, optional action, body. tone picks a color block (three per screen at most) */
export function Tile({ label, action, tone = "plain", className, children, bodyClass }: { label: React.ReactNode; action?: React.ReactNode; tone?: Tone; className?: string; children: React.ReactNode; bodyClass?: string }) {
  return (
    <section className={cn("flex min-w-0 flex-col rounded-[var(--ns-widget-radius)] border shadow-[var(--ns-widget-shadow)]", TONES[tone], className)}>
      <header className="flex min-h-11 items-center justify-between gap-2 px-[var(--ns-density-pad-x)] pt-3">
        <h2 className={cn("ns-overline", tone !== "plain" && "text-ns-secondary!")}>{label}</h2>
        {action}
      </header>
      <div className={cn("flex min-w-0 flex-1 flex-col gap-3 px-[var(--ns-density-pad-x)] pb-[var(--ns-density-pad-x)] pt-1", bodyClass)}>{children}</div>
    </section>
  );
}

/* ---------- figures ---------- */
type Fmt = "money" | "money2" | "int" | "pct" | "ms" | "compact" | "dec1";
const FORMATS: Record<Fmt, Format> = {
  money: { style: "currency", currency: "USD", maximumFractionDigits: 0 },
  money2: { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 },
  int: { maximumFractionDigits: 0 },
  pct: { style: "percent", maximumFractionDigits: 1, minimumFractionDigits: 1 },
  ms: { maximumFractionDigits: 0 },
  compact: { notation: "compact", maximumFractionDigits: 1 },
  dec1: { maximumFractionDigits: 1, minimumFractionDigits: 1 },
};
/* Headline number that animates between values with NumberFlow; tabular figures, sizes xl, lg, md */
export function Figure({ value, fmt = "int", suffix, size = "lg", className }: { value: number; fmt?: Fmt; suffix?: string; size?: "xl" | "lg" | "md"; className?: string }) {
  const sz = size === "xl" ? "text-[length:var(--ns-type-h4-size)] leading-[var(--ns-type-h4-line)]" : size === "lg" ? "text-[length:var(--ns-type-h5-size)] leading-8" : "text-[length:var(--ns-type-title-size)] leading-7";
  return (
    <span className={cn("tnum font-bold tracking-tight text-foreground", sz, className)}>
      <NumberFlow value={value} format={FORMATS[fmt]} suffix={suffix ?? (fmt === "ms" ? " ms" : undefined)} />
    </span>
  );
}

/* good: which direction is good news. Most metrics: up. Errors, latency, churn: down. */
/* Change against the previous period with an arrow; good sets which direction reads as success */
export function Delta({ value, good = "up", label }: { value: number; good?: "up" | "down"; label?: string }) {
  const up = value >= 0, positive = good === "up" ? up : !up;
  const Icon = up ? ArrowUpIcon : ArrowDownIcon;
  return (
    <span className={cn("tnum inline-flex items-center gap-1 text-xs font-semibold", positive ? "text-status-success" : "text-status-error")}>
      <Icon className="size-3" aria-hidden />
      {Math.abs(value * 100).toFixed(1)}%
      {label && <span className="font-normal text-muted-foreground">{label}</span>}
    </span>
  );
}

/* One metric: caption, Figure, optional Delta, helper text and sparkline */
export function Stat({ label, value, fmt, delta, good, sub, spark, sparkKey = "a" }: { label: string; value: number; fmt?: Fmt; delta?: number; good?: "up" | "down"; sub?: React.ReactNode; spark?: number[]; sparkKey?: string }) {
  return (
    <div className="flex min-w-0 flex-col gap-1">
      <span className="text-xs text-muted-foreground">{label}</span>
      <Figure value={value} fmt={fmt} size="md" />
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {delta !== undefined && <Delta value={delta} good={good} />}
        {sub && <span className="text-xs text-muted-foreground">{sub}</span>}
      </div>
      {spark && <Spark data={spark} id={sparkKey + label} />}
    </div>
  );
}

const sparkCfg = { v: { label: "Value", color: "var(--chart-1)" } } satisfies ChartConfig;
/* Area sparkline through the chart component; color defaults to chart series 1 */
export function Spark({ data, id, color = "var(--chart-1)", className }: { data: number[]; id: string; color?: string; className?: string }) {
  const gid = "sp-" + id.replace(/[^a-z0-9]/gi, "");
  return (
    <ChartContainer config={{ ...sparkCfg, v: { label: "Value", color } }} className={cn("aspect-auto h-10 w-full", className)}>
      <AreaChart data={data.map((v, i) => ({ i, v }))} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-v)" stopOpacity={0.28} />
            <stop offset="100%" stopColor="var(--color-v)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area dataKey="v" type="monotone" stroke="var(--color-v)" strokeWidth={1.5} fill={`url(#${gid})`} isAnimationActive={false} />
      </AreaChart>
    </ChartContainer>
  );
}

/* ---------- controls ---------- */
/* Segmented control (ns-segmented): single choice for periods and views; arrow keys, Home and End move and select */
export function Segmented<T extends string>({ value, onChange, options, label }: { value: T; onChange: (v: T) => void; options: readonly { id: T; label: string }[]; label: string }) {
  const refs = React.useRef<(HTMLButtonElement | null)[]>([]);
  const key = (e: React.KeyboardEvent, i: number) => {
    const n = options.length;
    const j = e.key === "ArrowRight" || e.key === "ArrowDown" ? (i + 1) % n : e.key === "ArrowLeft" || e.key === "ArrowUp" ? (i - 1 + n) % n : e.key === "Home" ? 0 : e.key === "End" ? n - 1 : -1;
    if (j < 0) return;
    e.preventDefault(); onChange(options[j].id); refs.current[j]?.focus();
  };
  return (
    <div className="ns-segmented" role="radiogroup" aria-label={label}>
      {options.map((o, i) => (
        <button key={o.id} ref={(el) => { refs.current[i] = el; }} type="button" role="radio" aria-checked={o.id === value} tabIndex={o.id === value ? 0 : -1}
          className="tnum" onClick={() => onChange(o.id)} onKeyDown={(e) => key(e, i)}>{o.label}</button>
      ))}
    </div>
  );
}

/* The "Sample data" helper line every dashboard shows */
export function SampleNote({ children }: { children?: React.ReactNode }) {
  return <p className="text-xs text-ns-tertiary">Sample data, seeded so it stays the same on every load.{children ? <> {children}</> : null}</p>;
}

/* Status pill: role colors only, word always visible */
export type Status = "success" | "warning" | "error" | "info" | "neutral";
const PILL: Record<Status, string> = {
  success: "bg-ns-success-bg text-status-success",
  warning: "bg-ns-warning-bg text-status-warning",
  error: "bg-ns-error-bg text-status-error",
  info: "bg-ns-info-bg text-ns-link",
  neutral: "bg-secondary text-muted-foreground",
};
/* Status pill: role colors only, the word always visible */
export function Pill({ status, children }: { status: Status; children: React.ReactNode }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-semibold", PILL[status])}>
      <span className="size-1.5 rounded-full bg-current" aria-hidden />
      {children}
    </span>
  );
}

/* Horizontal share bar list: label, bar, value. Bars use chart tokens. */
export function BarList({ items, fmt = (n: number) => n.toLocaleString("en-US") }: { items: { label: string; value: number; color?: string }[]; fmt?: (n: number) => string }) {
  const max = Math.max(...items.map((i) => i.value), 1);
  return (
    <ul className="flex flex-col gap-2.5">
      {items.map((it, i) => (
        <li key={it.label} className="grid grid-cols-[minmax(0,7rem)_1fr_auto] items-center gap-3 text-sm">
          <span className="truncate text-muted-foreground">{it.label}</span>
          <span className="h-2 rounded-full bg-[var(--ns-chart-track)]">
            <span className="block h-full rounded-full" style={{ width: `${(it.value / max) * 100}%`, background: it.color ?? `var(--chart-${(i % 4) + 1})` }} />
          </span>
          <span className="tnum text-right font-semibold">{fmt(it.value)}</span>
        </li>
      ))}
    </ul>
  );
}

/* ---------- table with sort, filter and a detail sheet ---------- */
export type Col<R> = { key: string; label: string; align?: "left" | "right"; sort?: (r: R) => number | string; cell: (r: R) => React.ReactNode; hideBelow?: "sm" | "md" | "lg" };
const HIDE = { sm: "hidden sm:table-cell", md: "hidden md:table-cell", lg: "hidden lg:table-cell" };
/* Sortable, filterable table (ns-table); selecting a row (click, Enter or Space) opens a Sheet with detail(row) */
export function DataTable<R>({ rows, cols, rowKey, filterText, filterPlaceholder = "Filter", detail, detailTitle, detailDescription, initialSort, maxRows }: {
  rows: R[]; cols: Col<R>[]; rowKey: (r: R) => string; filterText?: (r: R) => string; filterPlaceholder?: string;
  detail: (r: R) => React.ReactNode; detailTitle: (r: R) => string; detailDescription?: (r: R) => string; initialSort?: { key: string; dir: "asc" | "desc" }; maxRows?: number;
}) {
  const [q, setQ] = React.useState("");
  const [sort, setSort] = React.useState(initialSort ?? null);
  const [open, setOpen] = React.useState<R | null>(null);
  const view = React.useMemo(() => {
    let out = filterText && q ? rows.filter((r) => filterText(r).toLowerCase().includes(q.toLowerCase())) : rows.slice();
    const col = sort && cols.find((c) => c.key === sort.key);
    if (col && col.sort) { const f = col.sort; out.sort((a, b) => { const x = f(a), y = f(b); return (x > y ? 1 : x < y ? -1 : 0) * (sort!.dir === "asc" ? 1 : -1); }); }
    return maxRows ? out.slice(0, maxRows) : out;
  }, [rows, q, sort, cols, filterText, maxRows]);
  const toggle = (key: string) => setSort((s) => (s && s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "desc" }));
  return (
    <div className="flex min-w-0 flex-col gap-2">
      {filterText && (
        <input className="ns-input ns-input--sm max-w-64" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={filterPlaceholder} aria-label={filterPlaceholder} />
      )}
      <div className="-mx-[var(--ns-density-pad-x)] overflow-x-auto">
        <table className="ns-table">
          <thead>
            <tr>
              {cols.map((c, i) => (
                <th key={c.key} style={c.align === "right" ? { textAlign: "right" } : undefined} className={cn(i === 0 && "pl-[var(--ns-density-pad-x)]", i === cols.length - 1 && "pr-[var(--ns-density-pad-x)]", c.hideBelow && HIDE[c.hideBelow])}
                  aria-sort={sort?.key === c.key ? (sort.dir === "asc" ? "ascending" : "descending") : undefined}>
                  {c.sort ? (
                    <button type="button" onClick={() => toggle(c.key)} style={{ all: "unset", cursor: "pointer", display: "inline-flex", alignItems: "center", verticalAlign: "top", gap: 4, flexDirection: c.align === "right" ? "row-reverse" : "row" }}>
                      {c.label}
                      {sort?.key === c.key ? (sort.dir === "asc" ? <ArrowUpIcon className="size-3" /> : <ArrowDownIcon className="size-3" />) : <ChevronsUpDownIcon className="size-3 opacity-50" />}
                    </button>
                  ) : c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {view.map((r) => (
              <tr key={rowKey(r)} tabIndex={0} onClick={() => setOpen(r)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setOpen(r); } }}
                className="cursor-pointer focus-visible:bg-[var(--ns-interactive-ghost-hover)] focus-visible:outline-none">
                {cols.map((c, i) => (
                  <td key={c.key} style={c.align === "right" ? { textAlign: "right" } : undefined} className={cn(c.align === "right" && "tnum", i === 0 && "pl-[var(--ns-density-pad-x)]", i === cols.length - 1 && "pr-[var(--ns-density-pad-x)]", c.hideBelow && HIDE[c.hideBelow])}>{c.cell(r)}</td>
                ))}
              </tr>
            ))}
            {!view.length && (
              <tr><td colSpan={cols.length} className="py-6 text-center text-muted-foreground">No rows match "{q}"</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <Sheet open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
        <SheetContent className="ns w-full gap-0 border-border bg-ns-elevated sm:max-w-md">
          {open && (
            <>
              <SheetHeader className="border-b border-border">
                <SheetTitle>{detailTitle(open)}</SheetTitle>
                {detailDescription && <SheetDescription>{detailDescription(open)}</SheetDescription>}
              </SheetHeader>
              <div className="flex flex-col gap-4 overflow-y-auto p-4">{detail(open)}</div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

/* Key and value rows for detail sheets */
export function Facts({ rows }: { rows: [string, React.ReactNode][] }) {
  return (
    <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2.5 text-sm">
      {rows.map(([k, v]) => (
        <React.Fragment key={k}>
          <dt className="text-muted-foreground">{k}</dt>
          <dd className="tnum text-right font-medium">{v}</dd>
        </React.Fragment>
      ))}
    </dl>
  );
}

/* ---------- action: dialog that confirms with a toast ---------- */
/* Button that opens a confirm dialog (ns-modal); confirming calls onConfirm and shows a success toast */
export function ConfirmAction({ trigger, title, description, confirm, success, successDescription, destructive, children, size = "sm", variant = "outline", onConfirm, label }: {
  trigger: React.ReactNode; title: string; description: string; confirm: string; success: string; successDescription?: string; destructive?: boolean; children?: React.ReactNode; onConfirm?: () => void;
  size?: "sm" | "default"; variant?: "outline" | "default" | "secondary" | "ghost"; label?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const v = variant === "default" ? "primary" : variant === "ghost" ? "ghost" : "secondary";
  return (
    <>
      <Button size={size === "sm" ? "sm" : "md"} variant={destructive && variant === "outline" ? "secondary" : v} onClick={() => setOpen(true)}>{trigger}</Button>
      <Modal open={open} onOpenChange={setOpen} label={label} title={title}
        footer={<>
          <ModalClose render={<Button variant="ghost" />}>Cancel</ModalClose>
          <Button variant={destructive ? "danger" : "primary"} onClick={() => { setOpen(false); onConfirm?.(); toast.success(success, { description: successDescription }); }}>{confirm}</Button>
        </>}>
        <p style={{ margin: 0 }}>{description}</p>
        {children}
      </Modal>
    </>
  );
}

/* Page heading used by every view: title, modeled-on line, and the view's controls on the right */
export function ViewHeader({ title, sub, children }: { title: string; sub: React.ReactNode; children?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div className="min-w-0">
        <h1 className="text-[length:var(--ns-type-h6-size)] font-bold leading-[var(--ns-type-h6-line)]">{title}</h1>
        <div className="text-sm text-muted-foreground">{sub}</div>
      </div>
      <div className="flex flex-wrap items-center gap-2">{children}</div>
    </div>
  );
}
