import * as React from "react";
import { Bar, CartesianGrid, ComposedChart, Line, XAxis, YAxis } from "recharts";
import { MailIcon, MessageSquareIcon, SmartphoneIcon } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import type { ViewMeta } from "./types";
import { type Period, labels, num, pct, person, pick, rng, seedOf, series, sum, COMPANIES, TODAY } from "@/kit/data";
import { Bento, BarList, ConfirmAction, DataTable, Delta, Facts, Figure, Pill, SampleNote, Segmented, Spark, Stat, Tile, ViewHeader, type Col, type Status } from "@/kit/ui";

export const meta: ViewMeta = {
  slug: "support", title: "Inbox", modeledOn: "Intercom, inbox overview", category: "Support", order: 130,
  summary: "Open conversations, SLA breaches, CSAT, agent load, median first response and the live conversation queue.",
};

const PERIODS: Period[] = [
  { id: "1d", label: "Today", points: 24, unit: "hour" },
  { id: "7d", label: "7d", points: 7, unit: "day" },
  { id: "30d", label: "30d", points: 30, unit: "day" },
];
type PeriodId = (typeof PERIODS)[number]["id"];

type Channel = "Email" | "Chat" | "WhatsApp";
type Priority = "Urgent" | "High" | "Normal" | "Low";
type Convo = { id: string; customer: string; company: string; subject: string; preview: string; channel: Channel; assignee: string; waiting: number; priority: Priority };
const PRIORITY: Record<Priority, Status> = { Urgent: "error", High: "warning", Normal: "info", Low: "neutral" };
const RANK: Record<Priority, number> = { Urgent: 4, High: 3, Normal: 2, Low: 1 };
const AGENTS = ["Maya Okafor", "Theo Lund", "Priya Patel", "Marco Rossi", "Aiko Ito"];
const CHANNEL_ICON = { Email: MailIcon, Chat: MessageSquareIcon, WhatsApp: SmartphoneIcon };
const TOPICS: { subject: string; preview: string }[] = [
  { subject: "Invoice shows the wrong billing address", preview: "Hi, our latest invoice still has the old office address. Can you update it and resend the PDF?" },
  { subject: "Cannot invite teammates to the workspace", preview: "I click Invite and nothing happens. We are on the Team plan with 8 of 10 seats used." },
  { subject: "Export to CSV is missing columns", preview: "The export skips the custom fields we added last week. We need them for our month-end report." },
  { subject: "Two-factor codes not arriving", preview: "Our whole team stopped getting SMS codes this morning. Is there an outage on your side?" },
  { subject: "Request to change plan mid-cycle", preview: "We would like to move to Business starting today. Will the remaining days be prorated?" },
  { subject: "Webhook deliveries failing with 502", preview: "Since about 9am we see 502 responses on every webhook. Our endpoint is healthy on our side." },
  { subject: "How do I remove a former employee?", preview: "A teammate left last month and still shows in the member list. How do I remove them safely?" },
  { subject: "Refund for duplicate charge", preview: "We were charged twice on the 1st. Please refund the second charge to the original card." },
  { subject: "Dashboard loads slowly on Safari", preview: "The main dashboard takes around 20 seconds to load for me. Chrome is fine." },
  { subject: "Question about data retention", preview: "How long do you keep deleted records, and can we set a shorter window for compliance?" },
];

const mins = (m: number) => (m >= 60 ? `${Math.floor(m / 60)}h ${String(m % 60).padStart(2, "0")}m` : `${m}m`);

function useInbox(p: Period) {
  return React.useMemo(() => {
    const scale = p.unit === "hour" ? 1 : p.unit === "day" ? 1 : 1;
    const base = p.unit === "hour" ? 9 : 214;
    const recv = series("recv-" + p.id, p.points, base * scale, { weekly: p.unit === "day" ? 0.14 : 0, noise: 0.16, drift: 0 });
    const closed = recv.map((v, i) => v * (0.9 + 0.06 * Math.sin(i)));
    const recvPrev = series("recv-prev-" + p.id, p.points, base * 0.94, { weekly: p.unit === "day" ? 0.14 : 0, noise: 0.16, drift: 0 });
    const frt = series("frt-" + p.id, p.points, 4.2, { noise: 0.3, drift: -0.002 });
    const frtPrev = series("frt-prev-" + p.id, p.points, 4.6, { noise: 0.3, drift: 0 });
    const csat = series("csat-" + p.id, p.points, 0.92, { noise: 0.05, drift: 0 }).map((v) => Math.min(0.99, v));
    const csatPrev = series("csat-prev-" + p.id, p.points, 0.9, { noise: 0.05, drift: 0 }).map((v) => Math.min(0.99, v));
    const r = rng(seedOf("inbox-" + p.id));
    const open = 58 + Math.floor(r() * 30), snoozed = Math.round(open * (0.18 + r() * 0.08));
    const breaches = 3 + Math.floor(r() * 5), breachesPrev = breaches + 1 + Math.floor(r() * 3);
    const breached = Array.from({ length: 4 }, () => ({ id: "#" + (48200 + Math.floor(r() * 700)), company: pick(r, COMPANIES), over: 6 + Math.floor(r() * 90) })).sort((a, b) => b.over - a.over);
    const stars = [0.62, 0.22, 0.08, 0.04, 0.04].map((s) => s + (r() - 0.5) * 0.04);
    const agents = AGENTS.map((name) => ({ name, open: 6 + Math.floor(r() * 16), frt: Math.round((2.2 + r() * 4) * 10) / 10 })).sort((a, b) => b.open - a.open);
    const off = Math.floor(r() * TOPICS.length);
    const convos: Convo[] = Array.from({ length: 18 }, (_, i) => {
      const t = TOPICS[(i * 3 + off) % TOPICS.length], roll = r(), ch = r();
      const company = pick(r, COMPANIES);
      return {
        id: "#" + (48100 + i * 17 + Math.floor(r() * 12)), customer: person(r), company, subject: t.subject, preview: t.preview,
        channel: ch < 0.5 ? "Email" : ch < 0.85 ? "Chat" : "WhatsApp", assignee: r() < 0.2 ? "Unassigned" : pick(r, AGENTS),
        waiting: 3 + Math.floor(r() * r() * 400), priority: roll < 0.1 ? "Urgent" : roll < 0.3 ? "High" : roll < 0.85 ? "Normal" : "Low",
      };
    });
    const avg = (a: number[]) => sum(a) / a.length;
    return { recv, closed, recvPrev, frt, frtPrev, csat, csatPrev, open, snoozed, breaches, breachesPrev, breached, stars, agents, convos, avg, labels: labels(p) };
  }, [p]);
}

const flowCfg = { recv: { label: "Received", color: "var(--chart-1)" }, closed: { label: "Closed", color: "var(--chart-3)" } } satisfies ChartConfig;
const tick = { fill: "var(--ns-chart-label-text)", fontSize: 11 };

export default function Inbox() {
  const [pid, setPid] = React.useState<PeriodId>("7d");
  const period = PERIODS.find((x) => x.id === pid)!;
  const d = useInbox(period);
  const chart = d.labels.map((l, i) => ({ l, recv: Math.round(d.recv[i]), closed: Math.round(d.closed[i]) }));
  const total = Math.round(sum(d.recv)), totalPrev = Math.round(sum(d.recvPrev));
  const frtNow = Math.round(d.avg(d.frt) * 10) / 10, frtPrev = d.avg(d.frtPrev);
  const csatNow = d.avg(d.csat), csatPrev = d.avg(d.csatPrev);
  const waiting = d.open - d.snoozed;
  const maxOpen = Math.max(...d.agents.map((a) => a.open), 1);
  const stars = d.stars.map((s, i) => ({ label: `${5 - i} stars`, value: Math.round(s * 100), color: i < 2 ? "var(--ns-status-success)" : i === 2 ? "var(--chart-5)" : "var(--ns-status-error)" }));

  const cols: Col<Convo>[] = [
    { key: "customer", label: "Customer", sort: (r) => r.customer, cell: (r) => <div className="max-w-44 truncate"><span className="font-semibold">{r.customer}</span> <span className="text-muted-foreground">{r.company}</span></div> },
    { key: "subject", label: "Subject", hideBelow: "md", sort: (r) => r.subject, cell: (r) => <span className="block max-w-56 truncate">{r.subject}</span> },
    { key: "channel", label: "Channel", hideBelow: "lg", sort: (r) => r.channel, cell: (r) => { const Icon = CHANNEL_ICON[r.channel]; return <span className="inline-flex items-center gap-1.5 text-muted-foreground"><Icon className="size-3.5" aria-hidden />{r.channel}</span>; } },
    { key: "assignee", label: "Assignee", hideBelow: "sm", sort: (r) => r.assignee, cell: (r) => <span className={r.assignee === "Unassigned" ? "text-ns-tertiary" : "text-muted-foreground"}>{r.assignee}</span> },
    { key: "priority", label: "Priority", sort: (r) => RANK[r.priority], cell: (r) => <Pill status={PRIORITY[r.priority]}>{r.priority}</Pill> },
    { key: "waiting", label: "Waiting", align: "right", sort: (r) => r.waiting, cell: (r) => <span className="whitespace-nowrap">{mins(r.waiting)}</span> },
  ];

  return (
    <>
      <ViewHeader title="Inbox" sub={<>Modeled on {meta.modeledOn}. <SampleNote /></>}>
        <Segmented label="Period" value={pid} onChange={setPid} options={PERIODS.map((x) => ({ id: x.id as PeriodId, label: x.label }))} />
      </ViewHeader>
      <Bento>
        <Tile tone="accent" label="Conversations over time" className="md:col-span-6 xl:col-span-8" action={<Delta value={pct(total, totalPrev)} label="vs previous" />}>
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <Figure value={total} size="xl" />
            <span className="tnum text-sm text-muted-foreground">{num(totalPrev)} previous period</span>
          </div>
          <ChartContainer config={flowCfg} className="aspect-auto h-56 w-full">
            <ComposedChart data={chart} margin={{ left: 4, right: 8, top: 8 }}>
              <CartesianGrid vertical={false} stroke="var(--ns-widget-grid)" />
              <XAxis dataKey="l" tickLine={false} axisLine={false} minTickGap={24} tick={tick} />
              <YAxis width={36} tickLine={false} axisLine={false} tick={tick} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="recv" fill="var(--color-recv)" radius={[3, 3, 0, 0]} isAnimationActive={false} />
              <Line dataKey="closed" type="monotone" stroke="var(--color-closed)" strokeWidth={2} dot={false} isAnimationActive={false} />
            </ComposedChart>
          </ChartContainer>
        </Tile>

        <Tile label="Open conversations" className="md:col-span-6 xl:col-span-4">
          <Figure value={d.open} size="xl" />
          <div className="flex h-2 overflow-hidden rounded-full bg-[var(--ns-chart-track)]" role="img" aria-label={`${waiting} waiting, ${d.snoozed} snoozed`}>
            <span style={{ width: `${(waiting / d.open) * 100}%`, background: "var(--chart-1)" }} />
            <span style={{ width: `${(d.snoozed / d.open) * 100}%`, background: "var(--chart-4)" }} />
          </div>
          <Facts rows={[["Waiting on us", String(waiting)], ["Snoozed", String(d.snoozed)], ["Unassigned", String(d.convos.filter((c) => c.assignee === "Unassigned").length)]]} />
        </Tile>

        <Tile label="Median first response" className="md:col-span-3 xl:col-span-4">
          <Stat label="Time to first reply" value={frtNow} fmt="dec1" delta={pct(frtNow, frtPrev)} good="down" sub="min, vs previous" />
          <Spark data={d.frt} id="frt" color="var(--chart-2)" />
        </Tile>

        <Tile tone="alert" label="SLA breaches" className="md:col-span-3 xl:col-span-4">
          <Stat label="Past target" value={d.breaches} delta={pct(d.breaches, d.breachesPrev)} good="down" sub="vs previous" />
          <ul className="flex flex-col gap-2 text-sm">
            {d.breached.map((b) => (
              <li key={b.id} className="flex items-center justify-between gap-3">
                <span className="min-w-0 truncate"><span className="tnum font-semibold">{b.id}</span> <span className="text-muted-foreground">{b.company}</span></span>
                <span className="tnum whitespace-nowrap text-xs font-semibold text-status-error">{mins(b.over)} over</span>
              </li>
            ))}
          </ul>
        </Tile>

        <Tile label="CSAT" className="md:col-span-6 xl:col-span-4">
          <Stat label="Rated 4 or 5 stars" value={csatNow} fmt="pct" delta={pct(csatNow, csatPrev)} sub="vs previous" />
          <Spark data={d.csat} id="csat" color="var(--chart-3)" />
          <BarList items={stars} fmt={(n) => n + "%"} />
        </Tile>

        <Tile label="Conversations" className="md:col-span-6 xl:col-span-8" action={<span className="text-xs text-muted-foreground">Select a row for details</span>}>
          <DataTable rows={d.convos} cols={cols} rowKey={(r) => r.id} filterText={(r) => `${r.customer} ${r.company} ${r.subject} ${r.channel} ${r.assignee} ${r.priority}`} filterPlaceholder="Filter conversations" maxRows={9}
            initialSort={{ key: "waiting", dir: "desc" }}
            detailTitle={(r) => r.subject} detailDescription={(r) => `${r.id} · ${r.customer}, ${r.company}`}
            detail={(r) => (
              <>
                <div className="flex flex-wrap gap-2"><Pill status={PRIORITY[r.priority]}>{r.priority}</Pill><Pill status="neutral">{r.channel}</Pill></div>
                <blockquote className="rounded-lg border border-border bg-ns-inset p-3 text-sm">{r.preview}</blockquote>
                <Facts rows={[["Customer", r.customer], ["Company", r.company], ["Channel", r.channel], ["Assignee", r.assignee], ["Waiting", mins(r.waiting)], ["Received", new Date(TODAY.getTime() + 15 * 3600000 - r.waiting * 60000).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })]]} />
                {r.assignee === "Unassigned" ? (
                  <ConfirmAction trigger="Assign to me" variant="default" title={`Assign ${r.id} to yourself?`} description={`${r.customer} from ${r.company} has waited ${mins(r.waiting)}. The conversation moves to your inbox.`} confirm="Assign to me" success="Conversation assigned" successDescription={`${r.id} is now yours`} />
                ) : (
                  <ConfirmAction trigger="Close conversation" title={`Close ${r.id}?`} description={`${r.customer} is notified and can reopen it by replying within 7 days.`} confirm="Close" success="Conversation closed" successDescription={`${r.id} for ${r.company}`} />
                )}
              </>
            )} />
        </Tile>

        <Tile label="Agent load" className="md:col-span-6 xl:col-span-4">
          <ul className="flex flex-col gap-3">
            {d.agents.map((a) => (
              <li key={a.name} className="grid grid-cols-[minmax(0,6rem)_1fr_auto] items-center gap-3 text-sm">
                <span className="truncate text-muted-foreground">{a.name}</span>
                <span className="h-2 rounded-full bg-[var(--ns-chart-track)]"><span className="block h-full rounded-full" style={{ width: `${(a.open / maxOpen) * 100}%`, background: "var(--chart-1)" }} /></span>
                <span className="tnum text-right"><span className="font-semibold">{a.open}</span> <span className="text-xs text-muted-foreground">open, {a.frt.toFixed(1)} min</span></span>
              </li>
            ))}
          </ul>
        </Tile>
      </Bento>
    </>
  );
}
