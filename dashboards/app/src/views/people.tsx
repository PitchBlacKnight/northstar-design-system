import * as React from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import type { ViewMeta } from "./types";
import { type Period, labels, num, pct, person, rng, seedOf, series, sum } from "@/kit/data";
import { Bento, BarList, ConfirmAction, DataTable, Delta, Facts, Figure, Pill, SampleNote, Segmented, Spark, Stat, Tile, ViewHeader, type Col, type Status } from "@/kit/ui";

export const meta: ViewMeta = {
  slug: "people", title: "People", modeledOn: "Lattice, people analytics", category: "People", order: 140,
  summary: "Headcount, hires and departures, attrition, engagement trend, review cycle completion and a team table with open roles.",
};

const PERIODS: (Period & { days: number })[] = [
  { id: "q", label: "Quarter", points: 13, unit: "week", days: 91 },
  { id: "h", label: "Half", points: 6, unit: "month", days: 182 },
  { id: "y", label: "Year", points: 12, unit: "month", days: 365 },
];
type PeriodId = (typeof PERIODS)[number]["id"];

type Team = { name: string; lead: string; headcount: number; open: number; engagement: number; attrition: number; pending: number; completion: number };
const TEAMS: { name: string; share: number }[] = [
  { name: "Engineering", share: 0.3 }, { name: "Product", share: 0.08 }, { name: "Design", share: 0.07 }, { name: "Data", share: 0.06 },
  { name: "Sales", share: 0.16 }, { name: "Customer success", share: 0.12 }, { name: "Marketing", share: 0.08 }, { name: "People", share: 0.05 }, { name: "Finance", share: 0.04 },
];
const CYCLE = ["Self review", "Peer review", "Manager review", "Calibration"] as const;

function usePeople(p: Period & { days: number }) {
  return React.useMemo(() => {
    const r = rng(seedOf("people-" + p.id));
    const hc = series("hc-" + p.id, p.points, 392, { drift: 0.006, noise: 0.02 });
    const total = Math.round(hc[hc.length - 1]);
    const perPoint = p.days / p.points;
    const hires = Math.round(sum(series("hires-" + p.id, p.points, perPoint * 0.16, { drift: 0, noise: 0.5 })));
    const departures = Math.round(sum(series("deps-" + p.id, p.points, perPoint * 0.1, { drift: 0, noise: 0.5 })));
    const net = hires - departures;
    const start = total - net;
    const avg = (total + start) / 2;
    const annual = (n: number) => (n / avg) * (365 / p.days);
    const attr = annual(departures);
    const attrPrev = attr * (1 + (r() - 0.45) * 0.3);
    const regretted = Math.round(departures * (0.34 + r() * 0.1));
    const enps = series("enps-" + p.id, p.points, 31, { drift: 0.006, noise: 0.12 }).map((v) => Math.round(v));
    const bench = series("bench-" + p.id, p.points, 28, { drift: 0.001, noise: 0.04 }).map((v) => Math.round(v));
    const cycle = [0.94, 0.86, 0.71, 0.48].map((base) => Math.min(1, Math.max(0.05, base + (r() - 0.5) * 0.08)));
    const teams: Team[] = TEAMS.map((t) => {
      const headcount = Math.max(8, Math.round(total * t.share * (0.94 + r() * 0.12)));
      const completion = Math.min(1, Math.max(0.2, cycle[2] + (r() - 0.5) * 0.4));
      return {
        name: t.name, lead: person(r), headcount, open: Math.round(r() * r() * headcount * 0.22),
        engagement: Math.round(64 + r() * 26), attrition: Math.round((attr * (0.5 + r() * 1.1)) * 1000) / 10,
        pending: Math.round(headcount * (1 - completion)), completion,
      };
    });
    return { hires, departures, net, start, total, attr, attrPrev, regretted, enps, bench, cycle, teams, hc, labels: labels(p) };
  }, [p]);
}

const engCfg = { enps: { label: "eNPS", color: "var(--chart-1)" }, bench: { label: "Industry benchmark", color: "var(--chart-5)" } } satisfies ChartConfig;
const attrStatus = (v: number): Status => (v >= 16 ? "error" : v >= 11 ? "warning" : "success");
const engStatus = (v: number): Status => (v >= 80 ? "success" : v >= 70 ? "info" : "warning");

export default function People() {
  const [pid, setPid] = React.useState<PeriodId>("q");
  const period = PERIODS.find((x) => x.id === pid)!;
  const d = usePeople(period);
  const chart = d.labels.map((l, i) => ({ l, enps: d.enps[i], bench: d.bench[i] }));
  const enpsNow = d.enps[d.enps.length - 1], enpsFirst = d.enps[0];
  const departuresNonRegretted = d.departures - d.regretted;
  const openTotal = sum(d.teams.map((t) => t.open));
  const openByTeam = d.teams.filter((t) => t.open > 0).sort((a, b) => b.open - a.open).slice(0, 6).map((t) => ({ label: t.name, value: t.open }));
  const maxHiresDeps = Math.max(d.hires, d.departures, 1);

  const cols: Col<Team>[] = [
    { key: "name", label: "Team", sort: (r) => r.name, cell: (r) => <span className="font-semibold">{r.name}</span> },
    { key: "lead", label: "Lead", hideBelow: "md", sort: (r) => r.lead, cell: (r) => <span className="block max-w-40 truncate text-muted-foreground">{r.lead}</span> },
    { key: "headcount", label: "Headcount", align: "right", sort: (r) => r.headcount, cell: (r) => num(r.headcount) },
    { key: "open", label: "Open roles", align: "right", hideBelow: "sm", sort: (r) => r.open, cell: (r) => num(r.open) },
    { key: "engagement", label: "Engagement", align: "right", sort: (r) => r.engagement, cell: (r) => r.engagement },
    { key: "attrition", label: "Attrition", align: "right", sort: (r) => r.attrition, cell: (r) => <span className="tnum">{r.attrition.toFixed(1)}%</span> },
  ];

  return (
    <>
      <ViewHeader title="People" sub={<>Modeled on {meta.modeledOn}. <SampleNote /></>}>
        <Segmented label="Period" value={pid} onChange={setPid} options={PERIODS.map((x) => ({ id: x.id as PeriodId, label: x.label }))} />
      </ViewHeader>
      <Bento>
        <Tile tone="accent" label="Headcount" className="md:col-span-3 xl:col-span-6" action={<Delta value={pct(d.total, d.start)} label="this period" />}>
          <Figure value={d.total} fmt="int" size="xl" />
          <div className="grid grid-cols-3 gap-3">
            <Stat label="Hires" value={d.hires} />
            <Stat label="Departures" value={d.departures} />
            <Stat label="Net change" value={d.net} />
          </div>
          <ul className="flex flex-col gap-2 text-xs text-muted-foreground">
            <li className="grid grid-cols-[4.5rem_1fr] items-center gap-2">Hires<span className="h-2 rounded-full bg-[var(--ns-chart-track)]"><span className="block h-full rounded-full" style={{ width: `${(d.hires / maxHiresDeps) * 100}%`, background: "var(--ns-status-success)" }} /></span></li>
            <li className="grid grid-cols-[4.5rem_1fr] items-center gap-2">Departures<span className="h-2 rounded-full bg-[var(--ns-chart-track)]"><span className="block h-full rounded-full" style={{ width: `${(d.departures / maxHiresDeps) * 100}%`, background: "var(--chart-5)" }} /></span></li>
          </ul>
          <Spark data={d.hc} id="hc" />
        </Tile>

        <Tile tone="alert" label="Attrition" className="md:col-span-3 xl:col-span-6" action={<Delta value={pct(d.attr, d.attrPrev)} good="down" label="vs previous" />}>
          <div className="flex flex-wrap items-baseline gap-x-3">
            <Figure value={d.attr} fmt="pct" size="xl" />
            <span className="text-sm text-muted-foreground">annualized</span>
          </div>
          <BarList fmt={num} items={[{ label: "Regretted", value: d.regretted, color: "var(--ns-status-error)" }, { label: "Non-regretted", value: departuresNonRegretted, color: "var(--chart-5)" }]} />
          <p className="tnum text-xs text-muted-foreground">{num(d.departures)} departures over {period.days} days</p>
        </Tile>

        <Tile label="Engagement trend" className="md:col-span-6 xl:col-span-7" action={<Delta value={pct(enpsNow, enpsFirst)} label="since start" />}>
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <Figure value={enpsNow} fmt="int" size="lg" />
            <span className="text-sm text-muted-foreground">eNPS, latest pulse</span>
          </div>
          <ChartContainer config={engCfg} className="aspect-auto h-52 w-full">
            <LineChart data={chart} margin={{ left: 4, right: 8, top: 8 }}>
              <CartesianGrid vertical={false} stroke="var(--ns-widget-grid)" />
              <XAxis dataKey="l" tickLine={false} axisLine={false} minTickGap={24} tick={{ fill: "var(--ns-chart-label-text)", fontSize: 11 }} />
              <YAxis width={36} tickLine={false} axisLine={false} domain={["dataMin - 6", "dataMax + 6"]} tickFormatter={(v: number) => String(Math.round(v))} tick={{ fill: "var(--ns-chart-label-text)", fontSize: 11 }} />
              <ChartTooltip content={<ChartTooltipContent formatter={(v, n) => <span className="tnum flex w-full justify-between gap-4"><span className="text-muted-foreground">{engCfg[n as keyof typeof engCfg]?.label}</span>{Number(v)}</span>} />} />
              <Line dataKey="bench" type="monotone" stroke="var(--color-bench)" strokeWidth={1.5} strokeDasharray="4 4" dot={false} isAnimationActive={false} />
              <Line dataKey="enps" type="monotone" stroke="var(--color-enps)" strokeWidth={2} dot={false} isAnimationActive={false} />
            </LineChart>
          </ChartContainer>
        </Tile>

        <Tile tone="info" label="Fall 2026 review cycle" className="md:col-span-6 xl:col-span-5" action={<span className="text-xs text-muted-foreground">Closes Nov 20</span>}>
          <ul className="flex flex-col gap-4">
            {CYCLE.map((step, i) => {
              const v = d.cycle[i];
              return (
                <li key={step} className="flex flex-col gap-1.5">
                  <div className="flex items-baseline justify-between text-sm">
                    <span>{step}</span>
                    <span className="tnum font-semibold">{Math.round(v * 100)}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-[var(--ns-chart-track)]" role="progressbar" aria-label={step} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(v * 100)}>
                    <div className="h-full rounded-full" style={{ width: `${v * 100}%`, background: i === 3 ? "var(--chart-3)" : "var(--chart-1)" }} />
                  </div>
                  <span className="tnum text-xs text-muted-foreground">{num(Math.round(d.total * v))} of {num(d.total)} complete</span>
                </li>
              );
            })}
          </ul>
        </Tile>

        <Tile label="Teams" className="md:col-span-6 xl:col-span-8" action={<span className="text-xs text-muted-foreground">Select a row for details</span>}>
          <DataTable rows={d.teams} cols={cols} rowKey={(r) => r.name} filterText={(r) => `${r.name} ${r.lead}`} filterPlaceholder="Filter teams" initialSort={{ key: "headcount", dir: "desc" }}
            detailTitle={(r) => r.name} detailDescription={(r) => `Led by ${r.lead}`}
            detail={(r) => (
              <>
                <div className="flex flex-wrap gap-2">
                  <Pill status={engStatus(r.engagement)}>Engagement {r.engagement}</Pill>
                  <Pill status={attrStatus(r.attrition)}>Attrition {r.attrition.toFixed(1)}%</Pill>
                </div>
                <Facts rows={[["Lead", r.lead], ["Headcount", num(r.headcount)], ["Open roles", num(r.open)], ["Engagement score", String(r.engagement)], ["Attrition, annualized", r.attrition.toFixed(1) + "%"], ["Manager reviews done", Math.round(r.completion * 100) + "%"], ["Reviews pending", num(r.pending)]]} />
                <ConfirmAction trigger="Send review reminder" variant="default" title={`Remind ${r.lead}'s team?`}
                  description={`${num(r.pending)} reviews are still pending in ${r.name}. Managers get an email and a Slack message today.`}
                  confirm="Send reminder" success="Reminder sent" successDescription={`${r.name}: ${num(r.pending)} pending reviews`} />
              </>
            )} />
        </Tile>
        <Tile label="Open roles" className="md:col-span-6 xl:col-span-4">
          <Stat label="Approved and hiring" value={openTotal} sub={`${num(d.hires)} filled this period`} />
          <BarList items={openByTeam} fmt={num} />
        </Tile>
      </Bento>
    </>
  );
}
