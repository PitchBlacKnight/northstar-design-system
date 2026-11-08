import * as React from "react";
import { Area, AreaChart, CartesianGrid, Line, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import type { ViewMeta } from "./types";
import { PERIODS_STRIPE, type Period, labels, money, num, pct, person, rng, seedOf, series, sum, COMPANIES, pick, TODAY } from "@/kit/data";
import { Bento, BarList, ConfirmAction, DataTable, Delta, Facts, Figure, Pill, SampleNote, Segmented, Spark, Stat, Tile, ViewHeader, type Col, type Status } from "@/kit/ui";

export const meta: ViewMeta = {
  slug: "finance", title: "Payments", modeledOn: "Stripe Dashboard, Home", category: "Finance", order: 10,
  summary: "Gross and net volume against the previous period, balance and next payout, failed payments, new customers and recent payments.",
};

type PeriodId = (typeof PERIODS_STRIPE)[number]["id"];
type Payment = { id: string; amount: number; status: "Succeeded" | "Refunded" | "Failed" | "Pending"; customer: string; email: string; method: string; date: string; fee: number };
const STATUS: Record<Payment["status"], Status> = { Succeeded: "success", Refunded: "neutral", Failed: "error", Pending: "warning" };
const METHODS = ["Visa 4242", "Mastercard 4444", "Amex 0005", "ACH Debit", "Apple Pay", "Link"];

function useFinance(p: Period) {
  return React.useMemo(() => {
    const scale = p.unit === "day" ? 1 : p.unit === "week" ? 7 : 30;
    const gross = series("gross-" + p.id, p.points, 18400 * scale, { weekly: p.unit === "day" ? 0.12 : 0, noise: 0.1 });
    const prev = series("gross-prev-" + p.id, p.points, 16900 * scale, { weekly: p.unit === "day" ? 0.12 : 0, noise: 0.1 });
    const net = gross.map((g) => g * 0.968 - 0.3 * scale * 40);
    const cust = series("cust-" + p.id, p.points, 34 * scale, { noise: 0.3 });
    const custPrev = series("cust-prev-" + p.id, p.points, 31 * scale, { noise: 0.3 });
    const r = rng(seedOf("pay-" + p.id));
    const payments: Payment[] = Array.from({ length: 24 }, (_, i) => {
      const roll = r();
      const status: Payment["status"] = roll < 0.78 ? "Succeeded" : roll < 0.86 ? "Pending" : roll < 0.94 ? "Failed" : "Refunded";
      const amount = Math.round((40 + r() * r() * 4200) * 100) / 100;
      const d = new Date(TODAY); d.setHours(17 - Math.floor(i * 1.7)); d.setMinutes(Math.floor(r() * 60));
      const company = pick(r, COMPANIES);
      return { id: "py_" + Math.floor(r() * 1e8).toString(36).padStart(6, "0"), amount, status, customer: company, email: person(r).toLowerCase().replace(" ", ".") + "@" + company.toLowerCase().replace(/[^a-z]/g, "") + ".com", method: pick(r, METHODS), date: d.toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }), fee: Math.round((amount * 0.029 + 0.3) * 100) / 100 };
    });
    const failed = Math.round(sum(cust) * 0.11), failedPrev = Math.round(sum(custPrev) * 0.13);
    return { gross, prev, net, cust, custPrev, payments, failed, failedPrev, labels: labels(p) };
  }, [p]);
}

const volCfg = { now: { label: "This period", color: "var(--chart-1)" }, prev: { label: "Previous period", color: "var(--chart-5)" } } satisfies ChartConfig;

export default function Finance() {
  const [pid, setPid] = React.useState<PeriodId>("4w");
  const period = PERIODS_STRIPE.find((x) => x.id === pid)!;
  const d = useFinance(period);
  const grossNow = sum(d.gross), grossPrev = sum(d.prev), netNow = sum(d.net), netPrev = sum(d.prev.map((g) => g * 0.968));
  const chart = d.labels.map((l, i) => ({ l, now: Math.round(d.gross[i]), prev: Math.round(d.prev[i]) }));
  const balance = 48210.37 + (pid === "7d" ? 0 : 0), incoming = Math.round(d.gross[d.gross.length - 1] * 0.94 * (period.unit === "day" ? 2 : 0.3));
  const methods = METHODS.slice(0, 5).map((m, i) => ({ label: m.split(" ")[0], value: Math.round(grossNow * [0.46, 0.21, 0.12, 0.13, 0.08][i]) }));

  const cols: Col<Payment>[] = [
    { key: "amount", label: "Amount", align: "right", sort: (r) => r.amount, cell: (r) => <span className="font-semibold">{money(r.amount, 2)}</span> },
    { key: "status", label: "Status", sort: (r) => r.status, cell: (r) => <Pill status={STATUS[r.status]}>{r.status}</Pill> },
    { key: "customer", label: "Customer", sort: (r) => r.customer, cell: (r) => <span className="block max-w-48 truncate">{r.customer}</span> },
    { key: "method", label: "Method", hideBelow: "md", cell: (r) => <span className="text-muted-foreground">{r.method}</span> },
    { key: "date", label: "Date", hideBelow: "sm", cell: (r) => <span className="tnum whitespace-nowrap text-muted-foreground">{r.date}</span> },
  ];

  return (
    <>
      <ViewHeader title="Today" sub={<>Modeled on {meta.modeledOn}. <SampleNote /></>}>
        <Segmented label="Period" value={pid} onChange={setPid} options={PERIODS_STRIPE.map((x) => ({ id: x.id as PeriodId, label: x.label }))} />
      </ViewHeader>
      <Bento>
        <Tile tone="accent" label="Gross volume" className="md:col-span-6 xl:col-span-8" action={<Delta value={pct(grossNow, grossPrev)} label="vs previous" />}>
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <Figure value={grossNow} fmt="money" size="xl" />
            <span className="tnum text-sm text-muted-foreground">{money(grossPrev)} previous period</span>
          </div>
          <ChartContainer config={volCfg} className="aspect-auto h-56 w-full">
            <AreaChart data={chart} margin={{ left: 4, right: 8, top: 8 }}>
              <defs>
                <linearGradient id="fin-now" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-now)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="var(--color-now)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="var(--ns-widget-grid)" />
              <XAxis dataKey="l" tickLine={false} axisLine={false} minTickGap={24} tick={{ fill: "var(--ns-chart-label-text)", fontSize: 11 }} />
              <YAxis width={48} tickLine={false} axisLine={false} tick={{ fill: "var(--ns-chart-label-text)", fontSize: 11 }} tickFormatter={(v: number) => "$" + (v >= 1000 ? Math.round(v / 1000) + "k" : v)} />
              <ChartTooltip content={<ChartTooltipContent formatter={(v, n) => <span className="tnum flex w-full justify-between gap-4"><span className="text-muted-foreground">{volCfg[n as keyof typeof volCfg]?.label}</span>{money(Number(v))}</span>} />} />
              <Line dataKey="prev" type="monotone" stroke="var(--color-prev)" strokeWidth={1.5} strokeDasharray="4 4" dot={false} isAnimationActive={false} />
              <Area dataKey="now" type="monotone" stroke="var(--color-now)" strokeWidth={2} fill="url(#fin-now)" isAnimationActive={false} />
            </AreaChart>
          </ChartContainer>
        </Tile>

        <Tile tone="info" label="USD balance" className="md:col-span-6 xl:col-span-4">
          <Figure value={balance} fmt="money2" size="xl" />
          <Facts rows={[["Incoming", money(incoming, 2)], ["Next payout", "Tue, Nov 10"], ["Payout schedule", "Daily, 2 day rolling"], ["Bank", "Chase •••• 6789"]]} />
          <div className="mt-auto flex flex-wrap gap-2">
            <ConfirmAction trigger="Pay out now" variant="default" title="Pay out the available balance?" description={`${money(balance, 2)} goes to Chase •••• 6789 with an instant payout fee of 1.5%. Funds usually arrive within 30 minutes.`}
              confirm={`Pay out ${money(balance * 0.985, 2)}`} success="Payout started" successDescription={`${money(balance * 0.985, 2)} on its way to Chase •••• 6789`} />
          </div>
        </Tile>

        <Tile label="Net volume" className="md:col-span-3 xl:col-span-4">
          <Stat label="After fees and refunds" value={netNow} fmt="money" delta={pct(netNow, netPrev)} sub="vs previous" />
          <Spark data={d.net} id="net" />
        </Tile>
        <Tile label="New customers" className="md:col-span-3 xl:col-span-4">
          <Stat label="First payment this period" value={Math.round(sum(d.cust))} delta={pct(sum(d.cust), sum(d.custPrev))} sub="vs previous" />
          <Spark data={d.cust} id="cust" color="var(--chart-3)" />
        </Tile>
        <Tile tone="alert" label="Failed payments" className="md:col-span-6 xl:col-span-4">
          <Stat label="Declined or errored" value={d.failed} delta={pct(d.failed, d.failedPrev)} good="down" sub="vs previous" />
          <BarList items={[{ label: "Card declined", value: Math.round(d.failed * 0.52), color: "var(--ns-status-error)" }, { label: "Insufficient funds", value: Math.round(d.failed * 0.29), color: "var(--ns-status-warning)" }, { label: "Expired card", value: Math.round(d.failed * 0.19), color: "var(--chart-5)" }]} fmt={num} />
        </Tile>

        <Tile label="Recent payments" className="md:col-span-6 xl:col-span-8" action={<span className="text-xs text-muted-foreground">Select a row for details</span>}>
          <DataTable rows={d.payments} cols={cols} rowKey={(r) => r.id} filterText={(r) => `${r.customer} ${r.email} ${r.status} ${r.method}`} filterPlaceholder="Filter payments" maxRows={10}
            detailTitle={(r) => money(r.amount, 2) + " from " + r.customer} detailDescription={(r) => `${r.id} · ${r.date}`}
            detail={(r) => (
              <>
                <Pill status={STATUS[r.status]}>{r.status}</Pill>
                <Facts rows={[["Customer", r.customer], ["Email", <span className="break-all">{r.email}</span>], ["Method", r.method], ["Amount", money(r.amount, 2)], ["Stripe fee", money(r.fee, 2)], ["Net", money(r.amount - r.fee, 2)]]} />
                {r.status === "Succeeded" && (
                  <ConfirmAction trigger="Refund payment" destructive title={`Refund ${money(r.amount, 2)}?`} description={`${r.customer} gets the full amount back in 5 to 10 business days. The ${money(r.fee, 2)} fee is not returned.`} confirm="Refund" success="Refund issued" successDescription={`${money(r.amount, 2)} to ${r.customer}`} />
                )}
              </>
            )} />
        </Tile>
        <Tile label="Volume by method" className="md:col-span-6 xl:col-span-4">
          <BarList items={methods} fmt={(n) => money(n)} />
        </Tile>
      </Bento>
    </>
  );
}
