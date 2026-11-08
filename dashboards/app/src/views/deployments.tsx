import * as React from "react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Line, LineChart, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import type { ViewMeta } from "./types";
import { type Period, compact, labels, num, pct, person, pick, rng, seedOf, series, sum, TODAY } from "@/kit/data";
import { Bento, BarList, ConfirmAction, DataTable, Delta, Facts, Figure, Pill, SampleNote, Segmented, Spark, Tile, ViewHeader, type Col, type Status } from "@/kit/ui";

export const meta: ViewMeta = {
  slug: "deployments", title: "Deployments", modeledOn: "Vercel, project overview", category: "Deployments", order: 120,
  summary: "Production deployment, deployment list with build steps, build times, edge and function traffic, cache hit rate and error rate.",
};

const PERIODS = [
  { id: "24h", label: "24h", points: 24, unit: "hour" },
  { id: "7d", label: "7d", points: 7, unit: "day" },
  { id: "30d", label: "30d", points: 30, unit: "day" },
] as const satisfies readonly Period[];
type PeriodId = (typeof PERIODS)[number]["id"];
const PERIOD_MIN: Record<PeriodId, number> = { "24h": 1440, "7d": 10080, "30d": 43200 };
const DEPLOY_COUNT: Record<PeriodId, number> = { "24h": 9, "7d": 22, "30d": 44 };

type DStatus = "Ready" | "Building" | "Error" | "Canceled";
type Deploy = { id: string; sha: string; msg: string; branch: string; author: string; status: DStatus; seconds: number; ageMin: number; prod: boolean; current: boolean };
const STATUS: Record<DStatus, Status> = { Ready: "success", Building: "info", Error: "error", Canceled: "neutral" };
const MESSAGES = [
  "Fix cart total rounding on discounts", "Add skeleton loader to product grid", "Bump next to 15.1.2", "Move image resizing to the edge",
  "Cache catalog responses for 60 seconds", "Update checkout copy", "Handle empty search results", "Refactor session middleware",
  "Add order history route", "Tighten CSP headers", "Fix flaky date picker test", "Lazy load the review widget",
  "Redirect legacy /shop URLs", "Add structured data to product pages", "Reduce hero image weight", "Wire up preview comments",
];
const BRANCHES = ["feat/order-history", "fix/cart-rounding", "chore/deps", "feat/edge-images", "fix/search-empty", "perf/hero-image"];
const STEPS = [["Queued", 0.04], ["Cloning repository", 0.07], ["Installing dependencies", 0.26], ["Building", 0.46], ["Uploading outputs", 0.12], ["Assigning domains", 0.05]] as const;

const ago = (m: number) => (m < 60 ? `${Math.max(1, Math.round(m))}m ago` : m < 1440 ? `${Math.round(m / 60)}h ago` : `${Math.round(m / 1440)}d ago`);
const dur = (s: number) => (s >= 60 ? `${Math.floor(s / 60)}m ${String(s % 60).padStart(2, "0")}s` : `${s}s`);
const half = (a: number[]) => {
  const h = Math.floor(a.length / 2), avg = (x: number[]) => sum(x) / Math.max(x.length, 1);
  return pct(avg(a.slice(h)), avg(a.slice(0, h)));
};

function useDeployments(p: Period, pid: PeriodId) {
  return React.useMemo(() => {
    const n = DEPLOY_COUNT[pid], r = rng(seedOf("dep-list-" + pid)), span = PERIOD_MIN[pid];
    let currentSet = false;
    const deploys: Deploy[] = Array.from({ length: n }, (_, i) => {
      const roll = r();
      const status: DStatus = i === 0 ? "Building" : roll < 0.78 ? "Ready" : roll < 0.88 ? "Error" : "Canceled";
      const prod = i === 1 || (i > 1 && r() < 0.3);
      const seconds = status === "Error" ? 28 + Math.floor(r() * 50) : status === "Canceled" ? 9 + Math.floor(r() * 25) : 42 + Math.floor(r() * 150);
      const forcedReady = i === 1;
      const st: DStatus = forcedReady ? "Ready" : status;
      const current = !currentSet && prod && st === "Ready";
      if (current) currentSet = true;
      return {
        id: "dpl_" + Math.floor(r() * 1e8).toString(36).padStart(5, "0"), sha: Math.floor(r() * 0xfffffff).toString(16).padStart(7, "0"), msg: pick(r, MESSAGES),
        branch: prod ? "main" : pick(r, BRANCHES), author: person(r), status: st, seconds, ageMin: (i + 0.2 + r() * 0.6) * (span / n) * 0.9, prod, current,
      };
    });
    const edge = series("dep-edge-" + pid, p.points, p.unit === "hour" ? 46000 : 1050000, { drift: 0.002, noise: 0.14, weekly: p.unit === "day" ? 0.1 : 0 });
    const rf = rng(seedOf("dep-fn-" + pid));
    const fn = edge.map((v) => v * (0.19 + rf() * 0.05));
    const cache = series("dep-cache-" + pid, p.points, 0.93, { drift: 0, noise: 0.04 }).map((v) => Math.min(v, 0.985));
    const e4 = series("dep-4xx-" + pid, p.points, 0.0112, { drift: 0, noise: 0.4 });
    const e5 = series("dep-5xx-" + pid, p.points, 0.0013, { drift: 0, noise: 0.7 });
    const perBucket = series("dep-count-" + pid, p.points, p.unit === "hour" ? 0.4 : 3.1, { drift: 0, noise: 0.5 }).map(Math.round);
    const dplDelta = rng(seedOf("dep-delta-" + pid))() * 0.3 - 0.08;
    const ls = labels(p);
    return { deploys, edge, fn, cache, e4, e5, perBucket, dplDelta, ls };
  }, [p, pid]);
}

const trafficCfg = { edge: { label: "Edge requests", color: "var(--chart-1)" }, fn: { label: "Function invocations", color: "var(--chart-4)" } } satisfies ChartConfig;
const errCfg = { e4: { label: "4xx", color: "var(--ns-status-warning)" }, e5: { label: "5xx", color: "var(--ns-status-error)" } } satisfies ChartConfig;
const buildCfg = { s: { label: "Build time", color: "var(--chart-1)" } } satisfies ChartConfig;
const axisTick = { fill: "var(--ns-chart-label-text)", fontSize: 11 };
const pc = (v: number) => (v * 100).toFixed(2) + "%";

export default function Deployments() {
  const [pid, setPid] = React.useState<PeriodId>("7d");
  const period = PERIODS.find((x) => x.id === pid)!;
  const d = useDeployments(period, pid);
  const prod = d.deploys.find((x) => x.current)!;
  const finished = d.deploys.filter((x) => x.status === "Ready").map((x) => x.seconds).sort((a, b) => a - b);
  const p50 = finished[Math.floor(finished.length * 0.5)] ?? 0, p90 = finished[Math.floor(finished.length * 0.9)] ?? 0;
  const builds = d.deploys.filter((x) => x.status !== "Building" && x.status !== "Canceled").slice(0, 14).reverse().map((x) => ({ l: x.sha.slice(0, 5), s: x.seconds, ok: x.status === "Ready" }));
  const chart = d.ls.map((l, i) => ({ l, edge: Math.round(d.edge[i]), fn: Math.round(d.fn[i]) }));
  const errs = d.ls.map((l, i) => ({ l, e4: d.e4[i], e5: d.e5[i] }));
  const errTotal = d.e4.map((v, i) => v + d.e5[i]);
  const errNow = sum(errTotal) / errTotal.length;
  const cacheNow = sum(d.cache) / d.cache.length;
  const edgeTotal = sum(d.edge);
  const shaClass = "font-mono text-[13px]";

  const cols: Col<Deploy>[] = [
    { key: "msg", label: "Deployment", sort: (r) => r.msg, cell: (r) => (
      <span className="flex min-w-0 flex-col py-1"><span className="block max-w-64 truncate font-medium">{r.msg}</span><span className={shaClass + " text-muted-foreground"}>{r.sha}{r.prod ? " · Production" : " · Preview"}</span></span>
    ) },
    { key: "branch", label: "Branch", hideBelow: "lg", sort: (r) => r.branch, cell: (r) => <span className="block max-w-36 truncate font-mono text-[13px] text-muted-foreground">{r.branch}</span> },
    { key: "author", label: "Author", hideBelow: "md", sort: (r) => r.author, cell: (r) => <span className="whitespace-nowrap text-muted-foreground">{r.author}</span> },
    { key: "status", label: "Status", sort: (r) => r.status, cell: (r) => <Pill status={STATUS[r.status]}>{r.status}</Pill> },
    { key: "seconds", label: "Duration", align: "right", hideBelow: "sm", sort: (r) => r.seconds, cell: (r) => <span className="whitespace-nowrap">{r.status === "Building" ? "Building" : dur(r.seconds)}</span> },
    { key: "age", label: "Age", align: "right", sort: (r) => -r.ageMin, cell: (r) => <span className="whitespace-nowrap text-muted-foreground">{ago(r.ageMin)}</span> },
  ];

  const stepsFor = (r: Deploy) => {
    const failAt = r.status === "Error" ? 3 : r.status === "Canceled" ? 2 : r.status === "Building" ? 3 : -1;
    return STEPS.map(([name, share], i) => {
      const state: Status = failAt < 0 || i < failAt ? "success" : i === failAt ? (r.status === "Error" ? "error" : r.status === "Building" ? "info" : "neutral") : "neutral";
      const word = state === "success" ? "Done" : r.status === "Error" && i === failAt ? "Failed" : r.status === "Building" && i === failAt ? "Running" : r.status === "Canceled" && i === failAt ? "Canceled" : "Skipped";
      return { name, state, word, s: state === "success" || i === failAt ? Math.max(1, Math.round(r.seconds * share)) : 0 };
    });
  };

  return (
    <>
      <ViewHeader title="Deployments" sub={<>Modeled on {meta.modeledOn}. <SampleNote /></>}>
        <Segmented label="Period" value={pid} onChange={setPid} options={PERIODS.map((x) => ({ id: x.id, label: x.label }))} />
      </ViewHeader>
      <Bento>
        <Tile tone="accent" label="Production deployment" className="md:col-span-6 xl:col-span-6" action={<Pill status="success">Ready</Pill>}>
          <div className="flex min-w-0 flex-col gap-1">
            <p className="text-[length:var(--ns-type-title-size)] font-bold leading-7">{prod.msg}</p>
            <p className="text-sm text-muted-foreground">Deployed <span className="tnum">{ago(prod.ageMin)}</span> by {prod.author}</p>
          </div>
          <Facts rows={[["Domain", <span className="font-mono text-[13px]">shop.northwind.app</span>], ["Commit", <span className={shaClass}>{prod.sha}</span>], ["Branch", <span className="font-mono text-[13px]">main</span>], ["Build time", dur(prod.seconds)], ["Region", "iad1, fra1, sfo1"]]} />
          <div className="mt-auto flex flex-wrap gap-2">
            <ConfirmAction trigger="Redeploy" title="Redeploy production?" description={`A fresh build of ${prod.sha} runs with the current environment variables. The live site keeps serving until the new build is ready.`}
              confirm="Redeploy" success="Redeploy started" successDescription={`${prod.sha} on main, about ${dur(prod.seconds)}`} />
          </div>
        </Tile>

        <Tile label="Deploys this period" className="md:col-span-3 xl:col-span-3">
          <div className="flex min-w-0 flex-col gap-1">
            <span className="text-xs text-muted-foreground">Last {pid}</span>
            <Figure value={d.deploys.length} size="md" />
            <div className="flex items-center gap-2"><Delta value={d.dplDelta} /><span className="text-xs text-muted-foreground">vs previous</span></div>
            <Spark data={d.perBucket} id="dpl" />
          </div>
        </Tile>
        <Tile label="Build time" className="md:col-span-3 xl:col-span-3">
          <div className="flex min-w-0 flex-col gap-1">
            <span className="text-xs text-muted-foreground">Median, successful builds</span>
            <Figure value={p50} size="md" suffix=" s" />
            <span className="tnum text-xs text-muted-foreground">p90 {dur(p90)}</span>
            <Spark data={builds.map((b) => b.s)} id="bt" color="var(--chart-3)" />
          </div>
        </Tile>

        <Tile label="Deployment list" className="md:col-span-6 xl:col-span-8" action={<span className="text-xs text-muted-foreground">Select a row for build steps</span>}>
          <DataTable rows={d.deploys} cols={cols} rowKey={(r) => r.id} filterText={(r) => `${r.msg} ${r.branch} ${r.author} ${r.status} ${r.sha}`} filterPlaceholder="Filter deployments" maxRows={8}
            detailTitle={(r) => r.msg} detailDescription={(r) => `${r.sha} on ${r.branch}, ${TODAY.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`}
            detail={(r) => (
              <>
                <Pill status={STATUS[r.status]}>{r.status}</Pill>
                <Facts rows={[["Environment", r.prod ? "Production" : "Preview"], ["Branch", <span className="font-mono text-[13px]">{r.branch}</span>], ["Author", r.author], ["Created", ago(r.ageMin)], ["Duration", r.status === "Building" ? "Building" : dur(r.seconds)]]} />
                <ol className="flex flex-col divide-y divide-border rounded-md border border-border">
                  {stepsFor(r).map((s) => (
                    <li key={s.name} className="flex items-center justify-between gap-3 px-3 py-2 text-sm">
                      <span className="min-w-0 truncate">{s.name}</span>
                      <span className="flex items-center gap-3">
                        <span className="tnum text-muted-foreground">{s.s ? dur(s.s) : "-"}</span>
                        <Pill status={s.state}>{s.word}</Pill>
                      </span>
                    </li>
                  ))}
                </ol>
                {r.status === "Ready" && !r.current && (
                  <ConfirmAction trigger="Promote to production" variant="default" title="Promote to production?" description={`${r.sha} replaces the current production deployment on shop.northwind.app. Rolling back later takes about a minute.`}
                    confirm="Promote" success="Promotion started" successDescription={`${r.sha} is going live on shop.northwind.app`} />
                )}
                {(r.current || r.status === "Error") && (
                  <ConfirmAction trigger="Redeploy" title="Redeploy this commit?" description={`A new build of ${r.sha} starts from the same source with the current environment variables.`}
                    confirm="Redeploy" success="Redeploy started" successDescription={`${r.sha} on ${r.branch}`} />
                )}
              </>
            )} />
        </Tile>

        <Tile label="Build times" className="md:col-span-6 xl:col-span-4" action={<span className="tnum text-xs text-muted-foreground">p50 {dur(p50)} · p90 {dur(p90)}</span>}>
          <ChartContainer config={buildCfg} className="aspect-auto h-64 w-full">
            <BarChart data={builds} margin={{ left: 4, right: 4, top: 8 }}>
              <CartesianGrid vertical={false} stroke="var(--ns-widget-grid)" />
              <XAxis dataKey="l" tickLine={false} axisLine={false} interval={0} tick={{ ...axisTick, fontSize: 10 }} />
              <YAxis width={36} tickLine={false} axisLine={false} tick={axisTick} tickFormatter={(v: number) => v + "s"} />
              <ChartTooltip content={<ChartTooltipContent formatter={(v) => <span className="tnum flex w-full justify-between gap-4"><span className="text-muted-foreground">Build time</span>{dur(Number(v))}</span>} />} />
              <Bar dataKey="s" radius={[3, 3, 0, 0]} isAnimationActive={false}>
                {builds.map((b) => <Cell key={b.l} fill={b.ok ? "var(--chart-1)" : "var(--ns-status-error)"} />)}
              </Bar>
            </BarChart>
          </ChartContainer>
        </Tile>

        <Tile label="Edge requests and function invocations" className="md:col-span-6 xl:col-span-8" action={<span className="tnum text-xs text-muted-foreground">{compact(edgeTotal)} edge requests</span>}>
          <ChartContainer config={trafficCfg} className="aspect-auto h-56 w-full">
            <AreaChart data={chart} margin={{ left: 4, right: 8, top: 8 }}>
              <defs>
                <linearGradient id="dep-edge" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-edge)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="var(--color-edge)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="dep-fn" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-fn)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="var(--color-fn)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="var(--ns-widget-grid)" />
              <XAxis dataKey="l" tickLine={false} axisLine={false} minTickGap={24} tick={axisTick} />
              <YAxis width={44} tickLine={false} axisLine={false} tick={axisTick} tickFormatter={(v: number) => compact(v)} />
              <ChartTooltip content={<ChartTooltipContent formatter={(v, n) => <span className="tnum flex w-full justify-between gap-4"><span className="text-muted-foreground">{trafficCfg[n as keyof typeof trafficCfg]?.label}</span>{num(Number(v))}</span>} />} />
              <Area dataKey="edge" type="monotone" stroke="var(--color-edge)" strokeWidth={2} fill="url(#dep-edge)" isAnimationActive={false} />
              <Area dataKey="fn" type="monotone" stroke="var(--color-fn)" strokeWidth={2} fill="url(#dep-fn)" isAnimationActive={false} />
            </AreaChart>
          </ChartContainer>
        </Tile>

        <Tile label="Cache hit rate" className="md:col-span-6 xl:col-span-4">
          <div className="flex flex-wrap items-baseline gap-x-3">
            <Figure value={cacheNow} fmt="pct" size="xl" />
            <Delta value={half(d.cache)} label="vs first half" />
          </div>
          <Spark data={d.cache} id="cache" color="var(--chart-2)" />
          <BarList items={[{ label: "Hit", value: Math.round(edgeTotal * cacheNow), color: "var(--ns-status-success)" }, { label: "Stale", value: Math.round(edgeTotal * (1 - cacheNow) * 0.4), color: "var(--ns-status-warning)" }, { label: "Miss", value: Math.round(edgeTotal * (1 - cacheNow) * 0.6), color: "var(--chart-5)" }]} fmt={compact} />
        </Tile>

        <Tile label="Error rate" className="md:col-span-6 xl:col-span-8" action={<Delta value={half(errTotal)} good="down" label="vs first half" />}>
          <div className="flex flex-wrap items-baseline gap-x-3">
            <Figure value={errNow} fmt="pct" size="lg" />
            <span className="text-sm text-muted-foreground">4xx and 5xx combined</span>
          </div>
          <ChartContainer config={errCfg} className="aspect-auto h-44 w-full">
            <LineChart data={errs} margin={{ left: 4, right: 8, top: 8 }}>
              <CartesianGrid vertical={false} stroke="var(--ns-widget-grid)" />
              <XAxis dataKey="l" tickLine={false} axisLine={false} minTickGap={24} tick={axisTick} />
              <YAxis width={44} tickLine={false} axisLine={false} tick={axisTick} tickFormatter={(v: number) => (v * 100).toFixed(1) + "%"} />
              <ChartTooltip content={<ChartTooltipContent formatter={(v, n) => <span className="tnum flex w-full justify-between gap-4"><span className="text-muted-foreground">{errCfg[n as keyof typeof errCfg]?.label}</span>{pc(Number(v))}</span>} />} />
              <Line dataKey="e4" type="monotone" stroke="var(--color-e4)" strokeWidth={1.75} dot={false} isAnimationActive={false} />
              <Line dataKey="e5" type="monotone" stroke="var(--color-e5)" strokeWidth={1.75} dot={false} isAnimationActive={false} />
            </LineChart>
          </ChartContainer>
        </Tile>

        <Tile tone="alert" label="Top failing routes" className="md:col-span-6 xl:col-span-4">
          <BarList items={[
            { label: "/api/checkout", value: Math.round(sum(d.e5) * edgeTotal / d.e5.length * 0.38), color: "var(--ns-status-error)" },
            { label: "/api/search", value: Math.round(sum(d.e5) * edgeTotal / d.e5.length * 0.24), color: "var(--ns-status-error)" },
            { label: "/products/[slug]", value: Math.round(sum(d.e4) * edgeTotal / d.e4.length * 0.31), color: "var(--ns-status-warning)" },
            { label: "/api/cart", value: Math.round(sum(d.e5) * edgeTotal / d.e5.length * 0.17), color: "var(--ns-status-error)" },
          ]} fmt={num} />
          <p className="text-xs text-muted-foreground">Failed requests in the last {pid}, by route.</p>
        </Tile>
      </Bento>
    </>
  );
}
