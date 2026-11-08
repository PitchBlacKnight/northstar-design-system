import * as React from "react";
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, ReferenceLine, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import type { ViewMeta } from "./types";
import { person, rng, seedOf, sum, TODAY } from "@/kit/data";
import { Bento, BarList, ConfirmAction, DataTable, Facts, Figure, Pill, SampleNote, Segmented, Stat, Tile, ViewHeader, type Col, type Status } from "@/kit/ui";

export const meta: ViewMeta = {
  slug: "projects", title: "Cycle", modeledOn: "Linear, cycle view", category: "Projects", order: 110,
  summary: "Cycle burnup against scope, issues by status, assignee load, the triage queue and velocity over the last eight cycles.",
};

const CYCLES = [
  { id: "c41", n: 41, label: "Cycle 41", elapsed: 9 },
  { id: "c40", n: 40, label: "Cycle 40", elapsed: 14 },
  { id: "c39", n: 39, label: "Cycle 39", elapsed: 14 },
] as const;
type CycleId = (typeof CYCLES)[number]["id"];
const CURRENT = 41;
const DAYS = 14;

type Priority = "Urgent" | "High" | "Medium" | "Low";
type Issue = { id: string; title: string; note: string; priority: Priority; team: string; age: number; reporter: string };
const PRIORITY: Record<Priority, Status> = { Urgent: "error", High: "warning", Medium: "info", Low: "neutral" };
const RANK: Record<Priority, number> = { Urgent: 4, High: 3, Medium: 2, Low: 1 };
const TEAMS = ["Platform", "Web", "Mobile", "Growth", "Infra"];
const TRIAGE: { title: string; note: string }[] = [
  { title: "Webhook retries stop after the third attempt", note: "Customers report missed events after a short outage. Retries should continue with backoff for 24 hours." },
  { title: "Dashboard export times out on large workspaces", note: "CSV export fails above 50,000 rows. Needs a background job and an emailed link." },
  { title: "Mobile push token not refreshed after reinstall", note: "Users who reinstall stop receiving notifications until they sign out and back in." },
  { title: "Sidebar collapses on window resize in Safari", note: "The layout shifts when the window crosses the tablet breakpoint. Reproduces on Safari 18 only." },
  { title: "Add SCIM group sync for enterprise plans", note: "Three accounts in procurement need group provisioning before they can sign." },
  { title: "Search ranks archived projects above active ones", note: "Archived items should sort below active results unless the filter is set." },
  { title: "Rate limit headers missing on 429 responses", note: "Clients cannot back off correctly without the reset header." },
  { title: "Invite email lands in spam for Outlook domains", note: "SPF alignment looks wrong for the new sending domain. Check DKIM selectors." },
  { title: "Onboarding checklist skips the integrations step", note: "Step three is marked done even when no integration is connected." },
  { title: "Reduce cold start on the reports worker", note: "First report after idle takes about 14 seconds. Keep one instance warm." },
  { title: "Timezone shown in UTC on shared views", note: "Shared links ignore the viewer timezone and display UTC timestamps." },
  { title: "Bulk edit drops labels when more than 100 selected", note: "Labels are cleared silently above 100 rows. Add a limit warning or batch the write." },
  { title: "Audit log missing API key rotation events", note: "Rotation shows in settings but never reaches the audit log." },
  { title: "Dark theme contrast too low on empty states", note: "Secondary text on empty states fails AA against the card background." },
  { title: "Database connection pool exhausted at peak", note: "Spikes between 14:00 and 15:00 saturate the pool. Raise the limit and add alerting." },
  { title: "Keyboard shortcut for new issue conflicts in Firefox", note: "The C shortcut opens the find bar when focus is in the list." },
];

const velOf = (k: number) => Math.round(34 + rng(seedOf("vel" + k))() * 20);
const doneOf = (k: number) => (k === CURRENT ? Math.round(velOf(k) * 0.62) : velOf(k));

function dayLabel(start: Date, i: number) {
  const d = new Date(start); d.setDate(d.getDate() + i);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
function norm(r: () => number, n: number) {
  let t = 0; const c = Array.from({ length: n }, () => (t += 0.4 + r()));
  return c.map((v) => v / t);
}

function useCycle(c: (typeof CYCLES)[number]) {
  return React.useMemo(() => {
    const r = rng(seedOf("cycle-" + c.id));
    const done = doneOf(c.n);
    const scopeEnd = Math.round(velOf(c.n) / (0.85 + r() * 0.1));
    const startScope = Math.round(scopeEnd * 0.82);
    const sc = norm(r, DAYS), cm = norm(r, c.elapsed);
    const scope = sc.map((f) => Math.round(startScope + (scopeEnd - startScope) * f));
    const comp = cm.map((f) => Math.round(done * f));
    const start = new Date(TODAY); start.setDate(start.getDate() - (c.elapsed - 1) - (CURRENT - c.n) * DAYS);
    const chart = scope.map((s, i) => ({ l: dayLabel(start, i), scope: s, done: i < c.elapsed ? comp[i] : null }));
    const percent = done / scopeEnd;
    const n = Math.round(scopeEnd / 2.6);
    const nDone = Math.round(n * percent), canceled = 2 + Math.floor(r() * 3);
    const rem = Math.max(0, n - nDone - canceled);
    const progress = Math.round(rem * 0.33), review = Math.round(rem * 0.25), todo = Math.round(rem * 0.3);
    const backlog = Math.max(0, rem - progress - review - todo);
    const status = [
      { label: "Backlog", value: backlog, color: "var(--chart-5)" }, { label: "Todo", value: todo, color: "var(--chart-4)" },
      { label: "In progress", value: progress, color: "var(--chart-1)" }, { label: "In review", value: review, color: "var(--chart-3)" },
      { label: "Done", value: nDone, color: "var(--ns-status-success)" }, { label: "Canceled", value: canceled, color: "var(--ns-status-error)" },
    ];
    const names: string[] = [];
    while (names.length < 6) { const p = person(r); if (!names.includes(p)) names.push(p); }
    const assigned = Math.max(1, n - backlog - canceled), w = names.map(() => 0.5 + r()), sw = sum(w);
    const load = names.map((name, i) => { const issues = Math.max(1, Math.round((assigned * w[i]) / sw)); return { name, issues, points: Math.round(issues * (2.2 + r() * 1.4)) }; }).sort((a, b) => b.points - a.points);
    const off = Math.floor(r() * TRIAGE.length);
    const issues: Issue[] = Array.from({ length: 14 }, (_, i) => {
      const t = TRIAGE[(i * 5 + off) % TRIAGE.length], roll = r();
      return { id: "ENG-" + (1380 + c.n * 3 + i * 9 + Math.floor(r() * 8)), title: t.title, note: t.note, priority: roll < 0.12 ? "Urgent" : roll < 0.4 ? "High" : roll < 0.75 ? "Medium" : "Low", team: TEAMS[Math.floor(r() * TEAMS.length)], age: 1 + Math.floor(r() * 12), reporter: person(r) };
    });
    const vel = Array.from({ length: 8 }, (_, i) => { const k = c.n - 7 + i; return { l: "C" + k, v: doneOf(k), k }; });
    const full = vel.filter((x) => x.k !== CURRENT), avg = Math.round((sum(full.map((x) => x.v)) / full.length) * 10) / 10;
    return { chart, done, scopeEnd, startScope, percent, daysLeft: DAYS - c.elapsed, status, n, load, issues, vel, avg };
  }, [c]);
}

const burnCfg = { scope: { label: "Scope", color: "var(--chart-5)" }, done: { label: "Completed", color: "var(--chart-1)" } } satisfies ChartConfig;
const velCfg = { v: { label: "Points completed", color: "var(--chart-1)" } } satisfies ChartConfig;
const tick = { fill: "var(--ns-chart-label-text)", fontSize: 11 };

export default function Cycle() {
  const [cid, setCid] = React.useState<CycleId>("c41");
  const cycle = CYCLES.find((x) => x.id === cid)!;
  const d = useCycle(cycle);
  const maxPts = Math.max(...d.load.map((x) => x.points), 1);
  const byPri = (["Urgent", "High", "Medium", "Low"] as Priority[]).map((p) => ({ label: p, value: d.issues.filter((x) => x.priority === p).length, color: p === "Urgent" ? "var(--ns-status-error)" : p === "High" ? "var(--ns-status-warning)" : p === "Medium" ? "var(--chart-2)" : "var(--chart-5)" }));
  const oldest = Math.max(...d.issues.map((x) => x.age));

  const cols: Col<Issue>[] = [
    { key: "id", label: "ID", sort: (r) => r.id, cell: (r) => <span className="tnum whitespace-nowrap font-semibold">{r.id}</span> },
    { key: "title", label: "Title", sort: (r) => r.title, cell: (r) => <span className="block max-w-72 truncate">{r.title}</span> },
    { key: "priority", label: "Priority", sort: (r) => RANK[r.priority], cell: (r) => <Pill status={PRIORITY[r.priority]}>{r.priority}</Pill> },
    { key: "team", label: "Team", hideBelow: "md", sort: (r) => r.team, cell: (r) => <span className="text-muted-foreground">{r.team}</span> },
    { key: "age", label: "Age", align: "right", sort: (r) => r.age, cell: (r) => <span className="whitespace-nowrap text-muted-foreground">{r.age}d</span> },
  ];

  return (
    <>
      <ViewHeader title="Cycle" sub={<>Modeled on {meta.modeledOn}. <SampleNote /></>}>
        <Segmented label="Cycle" value={cid} onChange={setCid} options={CYCLES.map((x) => ({ id: x.id as CycleId, label: x.label }))} />
      </ViewHeader>
      <Bento>
        <Tile tone="accent" label="Cycle progress" className="md:col-span-6 xl:col-span-8" action={<span className="tnum text-xs text-muted-foreground">{cycle.label}{cycle.n === CURRENT ? " (current)" : ""}</span>}>
          <div className="flex flex-wrap items-baseline gap-x-6 gap-y-1">
            <Figure value={d.percent} fmt="pct" size="xl" />
            <span className="tnum text-sm text-muted-foreground">{d.done} of {d.scopeEnd} points done</span>
            <span className="tnum text-sm text-muted-foreground">{d.daysLeft === 0 ? "Cycle closed" : `${d.daysLeft} days left`}</span>
            <span className="tnum text-sm text-muted-foreground">Scope up {d.scopeEnd - d.startScope} since start</span>
          </div>
          <ChartContainer config={burnCfg} className="aspect-auto h-56 w-full">
            <LineChart data={d.chart} margin={{ left: 4, right: 8, top: 8 }}>
              <CartesianGrid vertical={false} stroke="var(--ns-widget-grid)" />
              <XAxis dataKey="l" tickLine={false} axisLine={false} minTickGap={24} tick={tick} />
              <YAxis width={36} tickLine={false} axisLine={false} tick={tick} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line dataKey="scope" type="stepAfter" stroke="var(--color-scope)" strokeWidth={1.5} strokeDasharray="4 4" dot={false} isAnimationActive={false} />
              <Line dataKey="done" type="monotone" stroke="var(--color-done)" strokeWidth={2} dot={false} connectNulls={false} isAnimationActive={false} />
            </LineChart>
          </ChartContainer>
        </Tile>

        <Tile label="Issues by status" className="md:col-span-6 xl:col-span-4">
          <Stat label="Issues in cycle" value={d.n} sub={`${d.status[4].value} done`} />
          <BarList items={d.status} max={d.n} />
        </Tile>

        <Tile label="Velocity" className="md:col-span-3 xl:col-span-7" action={<span className="tnum text-xs text-muted-foreground">Average {d.avg} pts</span>}>
          <ChartContainer config={velCfg} className="aspect-auto h-48 w-full">
            <BarChart data={d.vel} margin={{ left: 4, right: 8, top: 8 }}>
              <CartesianGrid vertical={false} stroke="var(--ns-widget-grid)" />
              <XAxis dataKey="l" tickLine={false} axisLine={false} tick={tick} />
              <YAxis width={36} tickLine={false} axisLine={false} tick={tick} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ReferenceLine y={d.avg} stroke="var(--ns-status-warning)" strokeDasharray="4 4" />
              <Bar dataKey="v" radius={[4, 4, 0, 0]} isAnimationActive={false}>
                {d.vel.map((x) => <Cell key={x.k} fill={x.k === cycle.n ? "var(--chart-2)" : "var(--chart-1)"} />)}
              </Bar>
            </BarChart>
          </ChartContainer>
          <p className="text-xs text-muted-foreground">Points completed per cycle. Dashed line is the average of closed cycles.</p>
        </Tile>

        <Tile label="Assignee load" className="md:col-span-3 xl:col-span-5">
          <ul className="flex flex-col gap-2.5">
            {d.load.map((p) => (
              <li key={p.name} className="grid grid-cols-[minmax(0,7rem)_1fr_auto_auto] items-center gap-3 text-sm">
                <span className="truncate text-muted-foreground">{p.name}</span>
                <span className="h-2 rounded-full bg-[var(--ns-chart-track)]"><span className="block h-full rounded-full" style={{ width: `${(p.points / maxPts) * 100}%`, background: "var(--chart-1)" }} /></span>
                <span className="tnum text-right text-muted-foreground">{p.issues} issues</span>
                <span className="tnum w-14 text-right font-semibold">{p.points} pts</span>
              </li>
            ))}
          </ul>
        </Tile>

        <Tile label="Triage" className="md:col-span-6 xl:col-span-8" action={<span className="text-xs text-muted-foreground">Select a row for details</span>}>
          <DataTable rows={d.issues} cols={cols} rowKey={(r) => r.id} filterText={(r) => `${r.id} ${r.title} ${r.priority} ${r.team}`} filterPlaceholder="Filter issues" maxRows={8}
            initialSort={{ key: "priority", dir: "desc" }}
            detailTitle={(r) => r.id + " " + r.title} detailDescription={(r) => `Reported by ${r.reporter} in ${r.team}`}
            detail={(r) => (
              <>
                <Pill status={PRIORITY[r.priority]}>{r.priority}</Pill>
                <p className="text-sm text-muted-foreground">{r.note}</p>
                <Facts rows={[["Team", r.team], ["Reporter", r.reporter], ["Priority", r.priority], ["Age", `${r.age} days`], ["Opened", new Date(TODAY.getTime() - r.age * 86400000).toLocaleDateString("en-US", { month: "short", day: "numeric" })]]} />
                <ConfirmAction trigger="Accept into cycle" variant="default" title={`Accept ${r.id} into ${cycle.label}?`} description={`${r.title} moves from triage to Todo and counts toward the scope of ${cycle.label}.`} confirm="Accept" success="Issue accepted" successDescription={`${r.id} added to ${cycle.label}`} />
              </>
            )} />
        </Tile>

        <Tile tone="alert" label="Awaiting triage" className="md:col-span-6 xl:col-span-4">
          <Stat label="Incoming issues" value={d.issues.length} sub={`Oldest waiting ${oldest} days`} />
          <BarList items={byPri} max={d.issues.length} />
        </Tile>
      </Bento>
    </>
  );
}
