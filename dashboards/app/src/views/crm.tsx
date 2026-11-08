import * as React from "react";
import { Area, AreaChart, CartesianGrid, Line, XAxis, YAxis } from "recharts";
import { CalendarDaysIcon, MailIcon, PhoneIcon } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import type { ViewMeta } from "./types";
import { type Period, COMPANIES, TODAY, compact, labels, money, num, pct, person, pick, rng, seedOf, series, sum } from "@/kit/data";
import { Bento, ConfirmAction, DataTable, Delta, Facts, Figure, Pill, SampleNote, Segmented, Stat, Tile, ViewHeader, type Col, type Status } from "@/kit/ui";

export const meta: ViewMeta = {
  slug: "crm", title: "Sales pipeline", modeledOn: "HubSpot, Sales dashboard", category: "CRM", order: 100,
  summary: "Deal stages with counts and value, forecast against quota, recent sales activity and a deals table with stage moves.",
};

const PERIODS = [
  { id: "month", label: "This month", points: 30, unit: "day" },
  { id: "quarter", label: "This quarter", points: 13, unit: "week" },
  { id: "year", label: "This year", points: 12, unit: "month" },
] as const satisfies readonly Period[];
type PeriodId = (typeof PERIODS)[number]["id"];

const STAGES = ["Appointment scheduled", "Qualified", "Presentation", "Decision maker bought in", "Contract sent", "Closed won"] as const;
const PROB = [0.1, 0.25, 0.45, 0.65, 0.85, 1];
const STAGE_STATUS: Status[] = ["neutral", "info", "info", "warning", "warning", "success"];
const KEEP = [1, 0.62, 0.43, 0.3, 0.2, 0.13];
const AVG = [9500, 11500, 14000, 16500, 18500, 19500];
const OWNERS = ["Priya Patel", "Marco Rossi", "Grace Walsh", "Theo Lund", "Nina Haddad"];
const PRODUCT = ["Platform renewal", "Team plan", "Enterprise rollout", "Analytics add-on", "Onboarding package", "Annual license"];

type Deal = { id: string; name: string; company: string; owner: string; stage: number; amount: number; close: string; contact: string; next: string };
type Activity = { id: string; kind: "Call" | "Email" | "Meeting"; who: string; company: string; note: string; time: string };
const NEXT = ["Send pricing", "Schedule demo", "Intro to finance", "Security review", "Redline contract", "Confirm signers"];

function useCrm(p: Period) {
  return React.useMemo(() => {
    const r = rng(seedOf("crm-" + p.id));
    const top = p.id === "month" ? 46 : p.id === "quarter" ? 138 : 520;
    const stages = STAGES.map((name, i) => {
      const count = Math.max(1, Math.round(top * KEEP[i] * (0.94 + r() * 0.12)));
      return { name, count, value: Math.round(count * AVG[i] * (0.92 + r() * 0.16)) };
    });
    const won = stages[5].value;
    const quota = Math.round(won / (0.8 + r() * 0.22) / 5000) * 5000;
    const open = stages.slice(0, 5).reduce((s, x, i) => s + x.value * PROB[i] * 0.22, 0);
    const forecast = won + open;
    const prevScale = 0.86 + r() * 0.2;
    const weights = series("crm-won-" + p.id, p.points, 1, { drift: 0.01, noise: 0.5 });
    const wsum = sum(weights);
    let acc = 0;
    const cum = weights.map((w) => (acc += (w / wsum) * won));

    const deals: Deal[] = Array.from({ length: 18 }, (_, i) => {
      const stage = Math.min(5, Math.floor(r() * r() * 7));
      const company = pick(r, COMPANIES);
      const d = new Date(TODAY); d.setDate(d.getDate() + 3 + Math.floor(r() * 50));
      return {
        id: "D-" + (4100 + i * 7 + Math.floor(r() * 5)), name: `${company} - ${pick(r, PRODUCT)}`, company, owner: pick(r, OWNERS), stage,
        amount: Math.round((6 + r() * r() * 70) * 1000 / 50) * 50, contact: person(r), next: NEXT[stage],
        close: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      };
    });
    const kinds: Activity["kind"][] = ["Call", "Email", "Meeting", "Email", "Call", "Meeting", "Email", "Call"];
    const notes: Record<Activity["kind"], string[]> = {
      Call: ["Discovery call, 24 min", "Pricing follow-up, 12 min", "Check-in on legal review"],
      Email: ["Sent proposal v2", "Shared security questionnaire", "Replied on renewal terms"],
      Meeting: ["Product demo with 5 attendees", "Executive alignment", "Onboarding kickoff"],
    };
    const activity: Activity[] = kinds.map((kind, i) => {
      const mins = 9 * 60 + 12 + i * 47 + Math.floor(r() * 20);
      const h = Math.floor(mins / 60), m = mins % 60;
      return { id: "a" + i, kind, who: pick(r, OWNERS), company: pick(r, COMPANIES), note: pick(r, notes[kind]), time: `${h > 12 ? h - 12 : h}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}` };
    }).reverse();
    const winRate = 0.22 + r() * 0.1, cycle = 34 + Math.floor(r() * 14);
    return { stages, won, quota, forecast, cum, deals, activity, winRate, cycle, prev: { won: won / prevScale, winRate: winRate * (0.92 + r() * 0.12), cycle: cycle * (0.95 + r() * 0.12), avg: (won / stages[5].count) * (0.94 + r() * 0.1) }, labels: labels(p) };
  }, [p]);
}

const fcCfg = { won: { label: "Closed won", color: "var(--chart-1)" }, pace: { label: "Quota pace", color: "var(--chart-5)" } } satisfies ChartConfig;
const ICON = { Call: PhoneIcon, Email: MailIcon, Meeting: CalendarDaysIcon } as const;

export default function Crm() {
  const [pid, setPid] = React.useState<PeriodId>("quarter");
  const period = PERIODS.find((x) => x.id === pid)!;
  const d = useCrm(period);
  const deals = d.deals;
  const chart = d.labels.map((l, i) => ({ l, won: Math.round(d.cum[i]), pace: Math.round((d.quota * (i + 1)) / d.labels.length) }));
  const maxCount = d.stages[0].count;
  const openValue = d.stages.slice(0, 5).reduce((s, x) => s + x.value, 0);
  const avgDeal = d.won / d.stages[5].count;
  const span = Math.max(d.quota, d.forecast);

  const cols: Col<Deal>[] = [
    { key: "name", label: "Deal", sort: (r) => r.name, cell: (r) => <span className="block max-w-56 truncate font-medium">{r.name}</span> },
    { key: "stage", label: "Stage", sort: (r) => r.stage, cell: (r) => <Pill status={STAGE_STATUS[r.stage]}>{STAGES[r.stage]}</Pill> },
    { key: "owner", label: "Owner", hideBelow: "md", sort: (r) => r.owner, cell: (r) => <span className="text-muted-foreground">{r.owner}</span> },
    { key: "close", label: "Close date", hideBelow: "lg", cell: (r) => <span className="tnum whitespace-nowrap text-muted-foreground">{r.close}</span> },
    { key: "amount", label: "Amount", align: "right", sort: (r) => r.amount, cell: (r) => <span className="font-semibold">{money(r.amount)}</span> },
  ];

  return (
    <>
      <ViewHeader title="Sales" sub={<>Modeled on {meta.modeledOn}. <SampleNote /></>}>
        <Segmented label="Period" value={pid} onChange={setPid} options={PERIODS.map((x) => ({ id: x.id as PeriodId, label: x.label }))} />
      </ViewHeader>
      <Bento>
        <Tile label="Deal stages" className="md:col-span-6 xl:col-span-5" action={<span className="tnum text-xs text-muted-foreground">{money(openValue)} open</span>}>
          <ul className="flex flex-col gap-3">
            {d.stages.map((s, i) => (
              <li key={s.name} className="flex flex-col gap-1.5">
                <div className="flex items-baseline justify-between gap-3 text-sm">
                  <span className="truncate text-muted-foreground">{s.name}</span>
                  <span className="tnum shrink-0 font-semibold">{num(s.count)} <span className="font-normal text-muted-foreground">· {money(s.value)}</span></span>
                </div>
                <span className="h-2.5 rounded-full bg-[var(--ns-chart-track)]">
                  <span className="block h-full rounded-full" style={{ width: `${(s.count / maxCount) * 100}%`, background: i === 5 ? "var(--ns-status-success)" : `var(--chart-${(i % 4) + 1})` }} />
                </span>
              </li>
            ))}
          </ul>
          <p className="tnum mt-auto text-xs text-muted-foreground">{((d.stages[5].count / maxCount) * 100).toFixed(1)}% of scheduled appointments close</p>
        </Tile>

        <Tile tone="accent" label="Forecast vs quota" className="md:col-span-6 xl:col-span-7" action={<Delta value={pct(d.forecast, d.quota)} label="forecast vs quota" />}>
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <Figure value={d.forecast} fmt="money" size="xl" />
            <span className="tnum text-sm text-muted-foreground">of {money(d.quota)} quota</span>
          </div>
          <div className="flex flex-col gap-1.5" role="img" aria-label={`Closed won ${money(d.won)}, forecast ${money(d.forecast)}, quota ${money(d.quota)}`}>
            <div className="relative h-2.5 rounded-full bg-[var(--ns-chart-track)]">
              <span className="absolute inset-y-0 left-0 rounded-full opacity-45" style={{ width: `${(d.forecast / span) * 100}%`, background: "var(--chart-3)" }} />
              <span className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${(d.won / span) * 100}%`, background: "var(--chart-1)" }} />
              <span className="absolute -inset-y-1 w-0.5 rounded-full bg-foreground" style={{ left: `${(d.quota / span) * 100}%` }} />
            </div>
            <div className="tnum flex flex-wrap justify-between gap-x-4 text-xs text-muted-foreground">
              <span>Closed won {money(d.won)} ({((d.won / d.quota) * 100).toFixed(0)}%)</span>
              <span>Quota {money(d.quota)}</span>
            </div>
          </div>
          <ChartContainer config={fcCfg} className="aspect-auto h-44 w-full">
            <AreaChart data={chart} margin={{ left: 4, right: 8, top: 8 }}>
              <defs>
                <linearGradient id="crm-won" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-won)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="var(--color-won)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="var(--ns-widget-grid)" />
              <XAxis dataKey="l" tickLine={false} axisLine={false} minTickGap={24} tick={{ fill: "var(--ns-chart-label-text)", fontSize: 11 }} />
              <YAxis width={48} tickLine={false} axisLine={false} tick={{ fill: "var(--ns-chart-label-text)", fontSize: 11 }} tickFormatter={(v: number) => "$" + compact(v)} />
              <ChartTooltip content={<ChartTooltipContent formatter={(v, n) => <span className="tnum flex w-full justify-between gap-4"><span className="text-muted-foreground">{fcCfg[n as keyof typeof fcCfg]?.label}</span>{money(Number(v))}</span>} />} />
              <Line dataKey="pace" type="linear" stroke="var(--color-pace)" strokeWidth={1.5} strokeDasharray="4 4" dot={false} isAnimationActive={false} />
              <Area dataKey="won" type="monotone" stroke="var(--color-won)" strokeWidth={2} fill="url(#crm-won)" isAnimationActive={false} />
            </AreaChart>
          </ChartContainer>
        </Tile>

        <Tile tone="info" label="Closed won" className="md:col-span-3 xl:col-span-3">
          <Stat label="Revenue this period" value={Math.round(d.won)} fmt="money" delta={pct(d.won, d.prev.won)} sub="vs previous" />
        </Tile>
        <Tile label="Win rate" className="md:col-span-3 xl:col-span-3">
          <Stat label="Won of all closed deals" value={d.winRate} fmt="pct" delta={pct(d.winRate, d.prev.winRate)} sub="vs previous" />
        </Tile>
        <Tile label="Average deal size" className="md:col-span-3 xl:col-span-3">
          <Stat label="Closed won" value={Math.round(avgDeal)} fmt="money" delta={pct(avgDeal, d.prev.avg)} sub="vs previous" />
        </Tile>
        <Tile label="Sales cycle" className="md:col-span-3 xl:col-span-3">
          <Stat label="Days from create to close" value={d.cycle} delta={pct(d.cycle, d.prev.cycle)} good="down" sub="vs previous" />
        </Tile>

        <Tile label="Deals" className="md:col-span-6 xl:col-span-8" action={<span className="text-xs text-muted-foreground">Select a row for details</span>}>
          <DataTable rows={deals} cols={cols} rowKey={(r) => r.id} filterText={(r) => `${r.name} ${r.owner} ${STAGES[r.stage]} ${r.contact}`} filterPlaceholder="Filter deals" maxRows={8}
            initialSort={{ key: "amount", dir: "desc" }}
            detailTitle={(r) => r.name} detailDescription={(r) => `${r.id} · closes ${r.close}`}
            detail={(r) => (
              <>
                <Pill status={STAGE_STATUS[r.stage]}>{STAGES[r.stage]}</Pill>
                <Facts rows={[["Amount", money(r.amount)], ["Weighted", money(r.amount * PROB[r.stage])], ["Probability", `${Math.round(PROB[r.stage] * 100)}%`], ["Owner", r.owner], ["Primary contact", r.contact], ["Next step", r.next]]} />
                {r.stage < 5 && (
                  <ConfirmAction trigger="Move to next stage" variant="default" title={`Move to ${STAGES[r.stage + 1]}?`} description={`${r.name} goes from ${STAGES[r.stage]} to ${STAGES[r.stage + 1]}. Win probability rises to ${Math.round(PROB[r.stage + 1] * 100)}%.`}
                    confirm="Move deal" success="Deal moved" successDescription={`${r.company} is now ${STAGES[r.stage + 1]}`} />
                )}
              </>
            )} />
        </Tile>

        <Tile label="Recent activity" className="md:col-span-6 xl:col-span-4">
          <ul className="flex flex-col gap-3">
            {d.activity.map((a) => {
              const Icon = ICON[a.kind];
              return (
                <li key={a.id} className="grid grid-cols-[auto_1fr_auto] items-start gap-3 text-sm">
                  <span className="mt-0.5 grid size-7 place-items-center rounded-full bg-secondary text-muted-foreground"><Icon className="size-3.5" aria-hidden /></span>
                  <div className="min-w-0">
                    <span className="block truncate font-medium">{a.who} <span className="font-normal text-muted-foreground">· {a.company}</span></span>
                    <span className="block truncate text-xs text-muted-foreground">{a.note}</span>
                  </div>
                  <span className="tnum whitespace-nowrap text-xs text-muted-foreground">{a.time}</span>
                </li>
              );
            })}
          </ul>
        </Tile>
      </Bento>
    </>
  );
}
