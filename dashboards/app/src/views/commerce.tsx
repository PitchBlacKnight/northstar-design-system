import * as React from "react";
import { Area, AreaChart, CartesianGrid, Line, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import type { ViewMeta } from "./types";
import { type Period, labels, money, num, pct, person, pick, rng, seedOf, series, sum, TODAY } from "@/kit/data";
import { Bento, BarList, ConfirmAction, DataTable, Delta, Facts, Figure, Pill, SampleNote, Segmented, Spark, Stat, Tile, ViewHeader, type Col, type Status } from "@/kit/ui";

export const meta: ViewMeta = {
  slug: "commerce", title: "Store", modeledOn: "Shopify admin, Home", category: "Commerce", order: 20,
  summary: "Total sales, sessions, conversion rate and average order value, sales by channel, top products, orders to fulfill and low stock.",
};

const PERIODS = [
  { id: "today", label: "Today", points: 24, unit: "hour" },
  { id: "7d", label: "7d", points: 7, unit: "day" },
  { id: "30d", label: "30d", points: 30, unit: "day" },
  { id: "90d", label: "90d", points: 13, unit: "week" },
] as const satisfies readonly Period[];
type PeriodId = (typeof PERIODS)[number]["id"];

type Order = { id: string; customer: string; items: number; total: number; channel: string; date: string; payment: "Paid" | "Pending"; state: "Unfulfilled" | "Partially fulfilled"; city: string };
type Stock = { name: string; sku: string; onHand: number; reorderAt: number };
const CHANNELS = ["Online Store", "POS", "Shop app", "Instagram"];
const CITIES = ["Portland, OR", "Austin, TX", "Brooklyn, NY", "Denver, CO", "Chicago, IL", "Oakland, CA", "Madison, WI", "Asheville, NC"];
const PRODUCTS = ["Linen shirt", "Canvas tote", "Ceramic mug", "Wool beanie", "Trail socks", "Field notebook", "Brass key ring", "Enamel pin set"];
const STATE: Record<Order["state"], Status> = { Unfulfilled: "warning", "Partially fulfilled": "info" };

function useStore(p: Period) {
  return React.useMemo(() => {
    const unit = p.unit === "hour" ? 1 : p.unit === "day" ? 24 : 168;
    const make = (tag: string, lift: number) => {
      const sessions = series(`sess-${tag}-${p.id}`, p.points, 11 * unit * lift, { weekly: p.unit === "day" ? 0.1 : 0, noise: 0.14 });
      const conv = series(`conv-${tag}-${p.id}`, p.points, 0.029 * lift, { drift: 0, noise: 0.2 });
      const aov = series(`aov-${tag}-${p.id}`, p.points, 74 * (lift > 0.95 ? 1.03 : 1), { drift: 0.001, noise: 0.1 });
      const orders = sessions.map((s, i) => s * conv[i]);
      const sales = orders.map((o, i) => o * aov[i]);
      return { sessions, conv, aov, orders, sales };
    };
    const now = make("now", 1), prev = make("prev", 0.93);
    const r = rng(seedOf("store-" + p.id));
    const weights = [0.58, 0.17, 0.14, 0.11].map((w) => w * (0.9 + r() * 0.2));
    const wsum = sum(weights);
    const channels = CHANNELS.map((label, i) => ({ label, value: Math.round(sum(now.sales) * (weights[i] / wsum)) }));
    const prodRaw = PRODUCTS.map((name) => ({ name, rev: 0.4 + r() * r() * 2.6 + r() * 0.5 }));
    const prodTotal = prodRaw.reduce((s, x) => s + x.rev, 0);
    const products = prodRaw.map((x) => ({ label: x.name, value: Math.round(sum(now.sales) * 0.78 * (x.rev / prodTotal)) })).sort((a, b) => b.value - a.value).slice(0, 6);

    const orders: Order[] = Array.from({ length: 16 }, (_, i) => {
      const d = new Date(TODAY); d.setHours(16 - Math.floor(i * 1.3)); d.setMinutes(Math.floor(r() * 60));
      return {
        id: "#" + (1048 - i), customer: person(r), items: 1 + Math.floor(r() * r() * 5), total: Math.round((28 + r() * r() * 380) * 100) / 100,
        channel: pick(r, CHANNELS), payment: r() < 0.88 ? "Paid" : "Pending", state: r() < 0.82 ? "Unfulfilled" : "Partially fulfilled", city: pick(r, CITIES),
        date: d.toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }),
      };
    });
    const stock: Stock[] = PRODUCTS.slice(0, 5).map((name, i) => {
      const reorderAt = 12 + Math.floor(r() * 12);
      return { name, sku: "SKU-" + (1200 + i * 37 + Math.floor(r() * 30)), onHand: Math.floor(r() * reorderAt * 0.9), reorderAt };
    }).sort((a, b) => a.onHand - b.onHand);
    return { now, prev, channels, products, orders, stock, labels: labels(p) };
  }, [p]);
}

const salesCfg = { now: { label: "This period", color: "var(--chart-1)" }, prev: { label: "Previous period", color: "var(--chart-5)" } } satisfies ChartConfig;

export default function Commerce() {
  const [pid, setPid] = React.useState<PeriodId>("30d");
  const period = PERIODS.find((x) => x.id === pid)!;
  const d = useStore(period);
  const salesNow = sum(d.now.sales), salesPrev = sum(d.prev.sales);
  const sessNow = sum(d.now.sessions), sessPrev = sum(d.prev.sessions);
  const ordersNow = sum(d.now.orders), ordersPrev = sum(d.prev.orders);
  const convNow = ordersNow / sessNow, convPrev = ordersPrev / sessPrev;
  const aovNow = salesNow / ordersNow, aovPrev = salesPrev / ordersPrev;
  const chart = d.labels.map((l, i) => ({ l, now: Math.round(d.now.sales[i]), prev: Math.round(d.prev.sales[i]) }));
  const toFulfill = d.orders.length;
  const poTotal = d.stock.reduce((s, x) => s + (x.reorderAt * 2 - x.onHand) * 18, 0);

  const cols: Col<Order>[] = [
    { key: "id", label: "Order", sort: (r) => Number(r.id.slice(1)), cell: (r) => <span className="tnum font-semibold">{r.id}</span> },
    { key: "customer", label: "Customer", sort: (r) => r.customer, cell: (r) => <span className="block max-w-40 truncate">{r.customer}</span> },
    { key: "state", label: "Fulfillment", sort: (r) => r.state, cell: (r) => <Pill status={STATE[r.state]}>{r.state}</Pill> },
    { key: "channel", label: "Channel", hideBelow: "md", sort: (r) => r.channel, cell: (r) => <span className="text-muted-foreground">{r.channel}</span> },
    { key: "date", label: "Placed", hideBelow: "lg", cell: (r) => <span className="tnum whitespace-nowrap text-muted-foreground">{r.date}</span> },
    { key: "total", label: "Total", align: "right", sort: (r) => r.total, cell: (r) => <span className="font-semibold">{money(r.total, 2)}</span> },
  ];

  return (
    <>
      <ViewHeader title="Home" sub={<>Modeled on {meta.modeledOn}. <SampleNote /></>}>
        <Segmented label="Period" value={pid} onChange={setPid} options={PERIODS.map((x) => ({ id: x.id as PeriodId, label: x.label }))} />
      </ViewHeader>
      <Bento>
        <Tile tone="accent" label="Total sales" className="md:col-span-6 xl:col-span-8" action={<Delta value={pct(salesNow, salesPrev)} label="vs previous" />}>
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <Figure value={salesNow} fmt="money" size="xl" />
            <span className="tnum text-sm text-muted-foreground">{money(salesPrev)} previous period</span>
          </div>
          <ChartContainer config={salesCfg} className="aspect-auto h-56 w-full">
            <AreaChart data={chart} margin={{ left: 4, right: 8, top: 8 }}>
              <defs>
                <linearGradient id="store-now" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-now)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="var(--color-now)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="var(--ns-widget-grid)" />
              <XAxis dataKey="l" tickLine={false} axisLine={false} minTickGap={24} tick={{ fill: "var(--ns-chart-label-text)", fontSize: 11 }} />
              <YAxis width={48} tickLine={false} axisLine={false} tick={{ fill: "var(--ns-chart-label-text)", fontSize: 11 }} tickFormatter={(v: number) => "$" + (v >= 1000 ? Math.round(v / 1000) + "k" : v)} />
              <ChartTooltip content={<ChartTooltipContent formatter={(v, n) => <span className="tnum flex w-full justify-between gap-4"><span className="text-muted-foreground">{salesCfg[n as keyof typeof salesCfg]?.label}</span>{money(Number(v))}</span>} />} />
              <Line dataKey="prev" type="monotone" stroke="var(--color-prev)" strokeWidth={1.5} strokeDasharray="4 4" dot={false} isAnimationActive={false} />
              <Area dataKey="now" type="monotone" stroke="var(--color-now)" strokeWidth={2} fill="url(#store-now)" isAnimationActive={false} />
            </AreaChart>
          </ChartContainer>
        </Tile>

        <Tile label="Sales by channel" className="md:col-span-6 xl:col-span-4">
          <BarList items={d.channels} fmt={(n) => money(n)} />
          <p className="tnum mt-auto text-xs text-muted-foreground">{num(ordersNow)} orders across {CHANNELS.length} channels</p>
        </Tile>

        <Tile label="Sessions" className="md:col-span-3 xl:col-span-3">
          <Stat label="Visits to your store" value={Math.round(sessNow)} delta={pct(sessNow, sessPrev)} sub="vs previous" />
          <Spark data={d.now.sessions} id="sess" />
        </Tile>
        <Tile label="Conversion rate" className="md:col-span-3 xl:col-span-3">
          <Stat label="Sessions that became orders" value={convNow} fmt="pct" delta={pct(convNow, convPrev)} sub="vs previous" />
          <Spark data={d.now.conv} id="conv" color="var(--chart-3)" />
        </Tile>
        <Tile label="Average order value" className="md:col-span-3 xl:col-span-3">
          <Stat label="Sales per order" value={aovNow} fmt="money2" delta={pct(aovNow, aovPrev)} sub="vs previous" />
          <Spark data={d.now.aov} id="aov" color="var(--chart-2)" />
        </Tile>

        <Tile tone="alert" label="Inventory alerts" className="md:col-span-3 xl:col-span-3" action={<span className="tnum text-xs text-muted-foreground">{d.stock.length} low</span>}>
          <ul className="flex flex-col gap-3">
            {d.stock.map((s) => (
              <li key={s.sku} className="flex items-center justify-between gap-3 text-sm">
                <div className="min-w-0">
                  <span className="block truncate font-medium">{s.name}</span>
                  <span className="tnum text-xs text-muted-foreground">{s.sku} · reorder at {s.reorderAt}</span>
                </div>
                <Pill status={s.onHand === 0 ? "error" : "warning"}>{s.onHand === 0 ? "Out of stock" : `${s.onHand} left`}</Pill>
              </li>
            ))}
          </ul>
          <div className="mt-auto">
            <ConfirmAction trigger="Create purchase order" title="Create a purchase order?" description={`Restock ${d.stock.length} products to twice their reorder point. Estimated cost ${money(poTotal)}.`}
              confirm="Create order" success="Purchase order created" successDescription={`${d.stock.length} products, ${money(poTotal)} estimated`} />
          </div>
        </Tile>

        <Tile label="Orders to fulfill" className="md:col-span-6 xl:col-span-8" action={<span className="tnum text-xs text-muted-foreground">{toFulfill} open · select a row for details</span>}>
          <DataTable rows={d.orders} cols={cols} rowKey={(r) => r.id} filterText={(r) => `${r.id} ${r.customer} ${r.channel} ${r.state} ${r.city}`} filterPlaceholder="Filter orders" maxRows={8}
            initialSort={{ key: "id", dir: "desc" }}
            detailTitle={(r) => `Order ${r.id}`} detailDescription={(r) => `${r.customer} · ${r.date}`}
            detail={(r) => (
              <>
                <div className="flex flex-wrap gap-2">
                  <Pill status={STATE[r.state]}>{r.state}</Pill>
                  <Pill status={r.payment === "Paid" ? "success" : "warning"}>{r.payment}</Pill>
                </div>
                <Facts rows={[["Customer", r.customer], ["Ship to", r.city], ["Channel", r.channel], ["Items", String(r.items)], ["Total", money(r.total, 2)], ["Delivery", "Standard, 3 to 5 days"]]} />
                <ConfirmAction trigger="Fulfill" variant="default" title={`Fulfill order ${r.id}?`} description={`${r.items} ${r.items === 1 ? "item" : "items"} ship to ${r.customer} in ${r.city}. The customer gets a shipping confirmation email with tracking.`}
                  confirm="Fulfill order" success="Order fulfilled" successDescription={`${r.id} is on its way to ${r.customer}`} />
              </>
            )} />
        </Tile>


        <Tile label="Top products" className="md:col-span-6 xl:col-span-4" action={<span className="text-xs text-muted-foreground">By sales</span>}>
          <BarList items={d.products} fmt={(n) => money(n)} />
        </Tile>
      </Bento>
    </>
  );
}
