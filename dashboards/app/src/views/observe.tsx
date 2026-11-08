import * as React from "react";
import { Area, AreaChart, CartesianGrid, Line, LineChart, PolarAngleAxis, RadialBar, RadialBarChart, XAxis, YAxis } from "recharts";
import { RefreshCwIcon } from "lucide-react";
import { toast } from "sonner";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
import type { ViewMeta } from "./types";
import { type Period, labels, num, pct, pick, rng, seedOf, series, sum } from "@/kit/data";
import { Bento, ConfirmAction, DataTable, Facts, Figure, Pill, SampleNote, Segmented, Spark, Stat, Tile, ViewHeader, type Col, type Status } from "@/kit/ui";

export const meta: ViewMeta = {
  slug: "observe", title: "Service health", modeledOn: "Grafana and Datadog, service overview", category: "Observability", order: 30,
  summary: "Request rate, latency, error budget, service status, active alerts and a live log tail for one production environment.",
};

const PERIODS = [
  { id: "15m", label: "15m", points: 15, unit: "minute" },
  { id: "1h", label: "1h", points: 60, unit: "minute" },
  { id: "6h", label: "6h", points: 6, unit: "hour" },
  { id: "24h", label: "24h", points: 24, unit: "hour" },
] as const satisfies readonly Period[];
type PeriodId = (typeof PERIODS)[number]["id"];

type Svc = { name: string; rps: number; p95: number; err: number; ready: number; desired: number; version: string; prev: string; status: "Healthy" | "Degraded" | "Down"; deployed: string };
const SVC_STATUS: Record<Svc["status"], Status> = { Healthy: "success", Degraded: "warning", Down: "error" };
const SERVICES = ["api-gateway", "auth", "checkout", "search", "catalog", "notifications", "billing", "media-resize"] as const;
const SVC_RPS = [820, 310, 190, 260, 440, 120, 80, 95];
const SVC_P95 = [96, 54, 240, 180, 88, 130, 210, 340];

type Level = "INFO" | "WARN" | "ERROR";
type LogLine = { t: string; level: Level; svc: string; msg: string };
const LEVEL_CLASS: Record<Level, string> = { INFO: "text-ns-link", WARN: "text-ns-warning", ERROR: "text-ns-error" };
const MSGS: Record<Level, string[]> = {
  INFO: ["GET /v2/products 200 38ms", "POST /v2/sessions 201 112ms", "GET /v2/cart 200 41ms", "cache refreshed, 1,204 keys", "health check passed", "GET /v2/search?q=lamp 200 96ms"],
  WARN: ["upstream timeout after 2000ms, retrying (1/3)", "connection pool at 87% capacity", "slow query 1,420ms on orders_by_user", "retry budget low, 14% remaining"],
  ERROR: ["payment provider returned 502 for order", "failed to resolve host cdn-origin.internal", "unhandled rejection in webhook handler", "redis read timeout after 500ms"],
};
const fmtClock = (s: number) => [Math.floor(s / 3600), Math.floor((s % 3600) / 60), s % 60].map((n) => String(n).padStart(2, "0")).join(":");
const half = (a: number[]) => {
  const h = Math.floor(a.length / 2), avg = (x: number[]) => sum(x) / Math.max(x.length, 1);
  return pct(avg(a.slice(h)), avg(a.slice(0, h)));
};

function useObserve(p: Period, tick: number) {
  return React.useMemo(() => {
    const k = `${p.id}-${tick}`, n = p.points;
    const drift = 0.0006;
    const req = series("obs-req-" + k, n, 1840, { drift, noise: 0.1 });
    const p95 = series("obs-p95-" + k, n, 212, { drift, noise: 0.16 });
    const err = series("obs-err-" + k, n, 0.0042, { drift, noise: 0.5 }).map((v) => Math.min(v, 0.02));
    const cpu = series("obs-cpu-" + k, n, 0.52, { drift, noise: 0.08 }).map((v) => Math.min(v, 0.94));
    const mem = series("obs-mem-" + k, n, 0.64, { drift: 0.0003, noise: 0.04 }).map((v) => Math.min(v, 0.94));
    const rp = rng(seedOf("obs-pods-" + k));
    const desired = 24;
    const ready = Array.from({ length: n }, () => (rp() < 0.12 ? desired - 1 : desired));
    const r = rng(seedOf("obs-lat-" + k));
    const rows = labels(p).map((l, i) => {
      const s4 = req[i] * (0.009 + r() * 0.004), s5 = req[i] * err[i];
      return { l, s2: Math.round(req[i] - s4 - s5), s4: Math.round(s4), s5: Math.round(s5), p50: Math.round(p95[i] * (0.34 + r() * 0.05)), p95: Math.round(p95[i]), p99: Math.round(p95[i] * (1.6 + r() * 0.35)) };
    });

    const rs = rng(seedOf("obs-svc-" + k));
    const bad = Math.floor(rs() * SERVICES.length), slow = (bad + 3) % SERVICES.length;
    const services: Svc[] = SERVICES.map((name, i) => {
      const isBad = i === bad, isSlow = i === slow;
      const desiredPods = 3 + Math.floor(rs() * 7);
      const err = isBad ? 0.021 + rs() * 0.02 : rs() * 0.004;
      const minor = 14 + Math.floor(rs() * 20);
      return {
        name, rps: Math.round(SVC_RPS[i] * (0.85 + rs() * 0.3)), p95: Math.round(SVC_P95[i] * (isBad ? 2.3 : isSlow ? 1.35 : 0.9 + rs() * 0.2)), err,
        desired: desiredPods, ready: isBad ? desiredPods - 1 : desiredPods, version: `v2.${minor}.${Math.floor(rs() * 4)}`, prev: `v2.${minor - 1}.${Math.floor(rs() * 4)}`,
        status: err > 0.04 ? "Down" : err > 0.01 || isSlow ? "Degraded" : "Healthy", deployed: pick(rs, ["2h ago", "5h ago", "yesterday", "2 days ago", "4 days ago"]),
      };
    });

    const rb = rng(seedOf("obs-budget-" + tick));
    const consumed = 0.22 + rb() * 0.4;

    const rl = rng(seedOf("obs-log-" + k));
    const lines: LogLine[] = Array.from({ length: 12 }, (_, i) => {
      const roll = rl();
      const level: Level = roll < 0.62 ? "INFO" : roll < 0.86 ? "WARN" : "ERROR";
      const svc = pick(rl, SERVICES);
      const base = pick(rl, MSGS[level]);
      const msg = level === "ERROR" && base.includes("order") ? base + " ord_" + Math.floor(rl() * 1e6).toString(36) : base;
      return { t: fmtClock(14 * 3600 + 52 * 60 + i * 11 + Math.floor(rl() * 8)), level, svc, msg };
    });

    return { req, p95, err, cpu, mem, ready, desired, rows, services, consumed, lines, bad: services[bad], slow: services[slow] };
  }, [p, tick]);
}

const reqCfg = { s2: { label: "2xx", color: "var(--chart-1)" }, s4: { label: "4xx", color: "var(--ns-status-warning)" }, s5: { label: "5xx", color: "var(--ns-status-error)" } } satisfies ChartConfig;
const latCfg = { p50: { label: "p50", color: "var(--chart-2)" }, p95: { label: "p95", color: "var(--chart-1)" }, p99: { label: "p99", color: "var(--chart-4)" } } satisfies ChartConfig;
const budgetCfg = { v: { label: "Remaining", color: "var(--ns-status-success)" } } satisfies ChartConfig;
const axisTick = { fill: "var(--ns-chart-label-text)", fontSize: 11 };
const mmss = (m: number) => `${Math.floor(m)}m ${String(Math.round((m % 1) * 60)).padStart(2, "0")}s`;

export default function Observe() {
  const [pid, setPid] = React.useState<PeriodId>("1h");
  const [refresh, setRefresh] = React.useState(0);
  const period = PERIODS.find((x) => x.id === pid)!;
  const d = useObserve(period, refresh);
  const last = <T,>(a: T[]) => a[a.length - 1];
  const remaining = 1 - d.consumed, remPct = Math.round(remaining * 100);
  const gaugeColor = remPct > 40 ? "var(--ns-status-success)" : remPct > 15 ? "var(--ns-status-warning)" : "var(--ns-status-error)";
  const readyNow = last(d.ready);
  const alerts = [
    { sev: "error" as Status, label: "Critical", name: `5xx rate above 2% on ${d.bad.name}`, svc: d.bad.name, since: "14 min" },
    { sev: "warning" as Status, label: "Warning", name: `p95 latency above ${Math.round(d.slow.p95 * 0.8)} ms on ${d.slow.name}`, svc: d.slow.name, since: "38 min" },
    { sev: "warning" as Status, label: "Warning", name: "Memory above 80% on 2 pods", svc: "billing", since: "1 h 12 min" },
    { sev: "info" as Status, label: "Notice", name: "Certificate expires in 21 days", svc: "api-gateway", since: "3 days" },
  ];

  const cols: Col<Svc>[] = [
    { key: "name", label: "Service", sort: (r) => r.name, cell: (r) => <span className="font-mono text-[13px] font-semibold">{r.name}</span> },
    { key: "rps", label: "Req/s", align: "right", sort: (r) => r.rps, cell: (r) => num(r.rps) },
    { key: "p95", label: "p95", align: "right", sort: (r) => r.p95, cell: (r) => `${num(r.p95)} ms` },
    { key: "err", label: "Errors", align: "right", hideBelow: "sm", sort: (r) => r.err, cell: (r) => <span className={r.err > 0.01 ? "font-semibold text-ns-error" : undefined}>{(r.err * 100).toFixed(2)}%</span> },
    { key: "status", label: "Status", sort: (r) => r.status, cell: (r) => <Pill status={SVC_STATUS[r.status]}>{r.status}</Pill> },
  ];

  return (
    <>
      <ViewHeader title="Service health" sub={<>Modeled on {meta.modeledOn}. <SampleNote /></>}>
        <Segmented label="Time range" value={pid} onChange={setPid} options={PERIODS.map((x) => ({ id: x.id, label: x.label }))} />
        <Button size="sm" variant="outline" onClick={() => { setRefresh((n) => n + 1); toast.success("Refreshed"); }}>
          <RefreshCwIcon aria-hidden /> Refresh
        </Button>
      </ViewHeader>
      <Bento>
        <Tile label="Requests" className="md:col-span-3 xl:col-span-2">
          <Stat label="Per second" value={Math.round(last(d.req))} delta={half(d.req)} sub={`last ${pid}`} spark={d.req} sparkKey="req" />
        </Tile>
        <Tile label="Latency" className="md:col-span-3 xl:col-span-2">
          <Stat label="p95" value={Math.round(last(d.p95))} fmt="ms" delta={half(d.p95)} good="down" sub={`last ${pid}`} spark={d.p95} sparkKey="p95" />
        </Tile>
        <Tile label="Error rate" className="md:col-span-3 xl:col-span-2">
          <Stat label="5xx share" value={last(d.err)} fmt="pct" delta={half(d.err)} good="down" sub={`last ${pid}`} spark={d.err} sparkKey="err" />
        </Tile>
        <Tile label="CPU" className="md:col-span-3 xl:col-span-2">
          <Stat label="Cluster average" value={last(d.cpu)} fmt="pct" delta={half(d.cpu)} good="down" sub={`last ${pid}`} spark={d.cpu} sparkKey="cpu" />
        </Tile>
        <Tile label="Memory" className="md:col-span-3 xl:col-span-2">
          <Stat label="Cluster average" value={last(d.mem)} fmt="pct" delta={half(d.mem)} good="down" sub={`last ${pid}`} spark={d.mem} sparkKey="mem" />
        </Tile>
        <Tile label="Pods" className="md:col-span-3 xl:col-span-2">
          <div className="flex min-w-0 flex-col gap-1">
            <span className="text-xs text-muted-foreground">Ready of desired</span>
            <Figure value={readyNow} size="md" suffix={` / ${d.desired}`} />
            <span className={readyNow < d.desired ? "tnum text-xs font-semibold text-ns-warning" : "tnum text-xs text-muted-foreground"}>{readyNow < d.desired ? `${d.desired - readyNow} pod restarting` : "All pods ready"}</span>
            <Spark data={d.ready} id="pods" color="var(--chart-3)" />
          </div>
        </Tile>

        <Tile label="Request rate by status" className="md:col-span-6 xl:col-span-8" action={<span className="tnum text-xs text-muted-foreground">{num(sum(d.req) / d.req.length)} req/s average</span>}>
          <ChartContainer config={reqCfg} className="aspect-auto h-56 w-full">
            <AreaChart data={d.rows} margin={{ left: 4, right: 8, top: 8 }}>
              <CartesianGrid vertical={false} stroke="var(--ns-widget-grid)" />
              <XAxis dataKey="l" tickLine={false} axisLine={false} minTickGap={32} tick={axisTick} />
              <YAxis width={44} tickLine={false} axisLine={false} tick={axisTick} tickFormatter={(v: number) => (v >= 1000 ? (v / 1000).toFixed(1) + "k" : String(v))} />
              <ChartTooltip content={<ChartTooltipContent formatter={(v, n) => <span className="tnum flex w-full justify-between gap-4"><span className="text-muted-foreground">{reqCfg[n as keyof typeof reqCfg]?.label}</span>{num(Number(v))} req/s</span>} />} />
              <Area dataKey="s2" stackId="a" type="monotone" stroke="var(--color-s2)" fill="var(--color-s2)" fillOpacity={0.25} strokeWidth={1.5} isAnimationActive={false} />
              <Area dataKey="s4" stackId="a" type="monotone" stroke="var(--color-s4)" fill="var(--color-s4)" fillOpacity={0.45} strokeWidth={1.5} isAnimationActive={false} />
              <Area dataKey="s5" stackId="a" type="monotone" stroke="var(--color-s5)" fill="var(--color-s5)" fillOpacity={0.6} strokeWidth={1.5} isAnimationActive={false} />
            </AreaChart>
          </ChartContainer>
        </Tile>

        <Tile tone="accent" label="Error budget" className="md:col-span-6 xl:col-span-4" action={<span className="tnum text-xs text-muted-foreground">SLO 99.9%, 30 days</span>}>
          <div className="relative mx-auto h-36 w-full max-w-64">
            <ChartContainer config={budgetCfg} className="aspect-auto h-full w-full">
              <RadialBarChart data={[{ v: remPct, fill: gaugeColor }]} startAngle={180} endAngle={0} cx="50%" cy="88%" innerRadius="150%" outerRadius="190%" barSize={16}>
                <PolarAngleAxis type="number" domain={[0, 100]} tick={false} axisLine={false} />
                <RadialBar dataKey="v" cornerRadius={8} background={{ fill: "var(--ns-chart-track)" }} isAnimationActive={false} />
              </RadialBarChart>
            </ChartContainer>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col items-center">
              <Figure value={remaining} fmt="pct" size="lg" />
              <span className="text-xs text-muted-foreground">budget remaining</span>
            </div>
          </div>
          <Facts rows={[["Allowed downtime", "43m 12s"], ["Left this window", mmss(remaining * 43.2)], ["Burn rate", `${(d.consumed / 0.6).toFixed(1)}x`]]} />
        </Tile>

        <Tile label="Latency percentiles" className="md:col-span-6 xl:col-span-7">
          <ChartContainer config={latCfg} className="aspect-auto h-52 w-full">
            <LineChart data={d.rows} margin={{ left: 4, right: 8, top: 8 }}>
              <CartesianGrid vertical={false} stroke="var(--ns-widget-grid)" />
              <XAxis dataKey="l" tickLine={false} axisLine={false} minTickGap={32} tick={axisTick} />
              <YAxis width={48} tickLine={false} axisLine={false} tick={axisTick} tickFormatter={(v: number) => v + " ms"} />
              <ChartTooltip content={<ChartTooltipContent formatter={(v, n) => <span className="tnum flex w-full justify-between gap-4"><span className="text-muted-foreground">{latCfg[n as keyof typeof latCfg]?.label}</span>{num(Number(v))} ms</span>} />} />
              <Line dataKey="p50" type="monotone" stroke="var(--color-p50)" strokeWidth={1.75} dot={false} isAnimationActive={false} />
              <Line dataKey="p95" type="monotone" stroke="var(--color-p95)" strokeWidth={1.75} dot={false} isAnimationActive={false} />
              <Line dataKey="p99" type="monotone" stroke="var(--color-p99)" strokeWidth={1.75} dot={false} isAnimationActive={false} />
            </LineChart>
          </ChartContainer>
        </Tile>

        <Tile tone="alert" label="Active alerts" className="md:col-span-6 xl:col-span-5" action={<span className="tnum text-xs text-muted-foreground">{alerts.length} firing</span>}>
          <ul className="flex flex-col divide-y divide-border">
            {alerts.map((a) => (
              <li key={a.name} className="flex items-start justify-between gap-3 py-2.5 first:pt-0 last:pb-0">
                <div className="min-w-0">
                  <p className="text-sm font-medium">{a.name}</p>
                  <p className="text-xs text-muted-foreground">{a.svc} · firing for <span className="tnum">{a.since}</span></p>
                </div>
                <Pill status={a.sev}>{a.label}</Pill>
              </li>
            ))}
          </ul>
        </Tile>

        <Tile label="Services" className="md:col-span-6 xl:col-span-7" action={<span className="text-xs text-muted-foreground">Select a row for details</span>}>
          <DataTable rows={d.services} cols={cols} rowKey={(r) => r.name} filterText={(r) => `${r.name} ${r.status} ${r.version}`} filterPlaceholder="Filter services"
            initialSort={{ key: "err", dir: "desc" }}
            detailTitle={(r) => r.name} detailDescription={(r) => `${r.version}, deployed ${r.deployed}`}
            detail={(r) => (
              <>
                <Pill status={SVC_STATUS[r.status]}>{r.status}</Pill>
                <Facts rows={[["Requests", `${num(r.rps)} req/s`], ["p95 latency", `${num(r.p95)} ms`], ["Error rate", `${(r.err * 100).toFixed(2)}%`], ["Pods ready", `${r.ready} / ${r.desired}`], ["Version", r.version], ["Previous", r.prev]]} />
                <div className="flex flex-wrap gap-2">
                  <ConfirmAction trigger="Restart pods" title={`Restart ${r.desired} pods?`} description={`${r.name} pods restart one at a time, so traffic keeps flowing. Expect about ${r.desired * 20} seconds until all are ready.`}
                    confirm="Restart pods" success="Restart started" successDescription={`${r.name}: rolling restart of ${r.desired} pods`} />
                  {r.status !== "Healthy" && (
                    <ConfirmAction trigger="Roll back" destructive title={`Roll back to ${r.prev}?`} description={`${r.name} returns to ${r.prev}. Changes shipped in ${r.version} stop serving traffic right away.`}
                      confirm="Roll back" success="Rollback started" successDescription={`${r.name} ${r.version} to ${r.prev}`} />
                  )}
                </div>
              </>
            )} />
        </Tile>

        <Tile label="Log tail" className="md:col-span-6 xl:col-span-5" action={<span className="tnum text-xs text-muted-foreground">{d.lines.length} lines</span>}>
          <div role="log" aria-label="Log tail" tabIndex={0} className="h-64 overflow-y-auto rounded-md bg-ns-inset p-3 font-mono text-xs leading-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            {d.lines.map((l, i) => (
              <div key={i} className="flex gap-2 whitespace-nowrap">
                <span className="tnum shrink-0 text-ns-tertiary">{l.t}</span>
                <span className={"w-11 shrink-0 font-semibold " + LEVEL_CLASS[l.level]}>{l.level}</span>
                <span className="shrink-0 text-muted-foreground">{l.svc}</span>
                <span className="text-foreground">{l.msg}</span>
              </div>
            ))}
          </div>
        </Tile>
      </Bento>
    </>
  );
}
