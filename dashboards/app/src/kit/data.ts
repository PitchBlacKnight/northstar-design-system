/* Deterministic sample data. Every view seeds its own generator, so numbers are stable across reloads
   and screenshots, and a period switch reseeds instead of using random numbers. */
export function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
export const seedOf = (s: string) => [...s].reduce((h, c) => Math.imul(h ^ c.charCodeAt(0), 16777619) >>> 0, 2166136261);

/* A walk around a base with drift and weekly rhythm; returns n points */
export function series(seed: string, n: number, base: number, opts: { drift?: number; noise?: number; weekly?: number } = {}) {
  const r = rng(seedOf(seed));
  const { drift = 0.004, noise = 0.08, weekly = 0 } = opts;
  let v = base;
  return Array.from({ length: n }, (_, i) => {
    v = v * (1 + drift + (r() - 0.5) * noise * 0.5);
    const w = weekly ? 1 + weekly * Math.sin((i / 7) * Math.PI * 2) : 1;
    return Math.max(0, v * w * (1 + (r() - 0.5) * noise));
  });
}
export const pick = <T,>(r: () => number, arr: readonly T[]) => arr[Math.floor(r() * arr.length)];
export const sum = (a: number[]) => a.reduce((s, x) => s + x, 0);
export const pct = (now: number, prev: number) => (prev ? (now - prev) / prev : 0);

export type Period = { id: string; label: string; points: number; unit: "day" | "week" | "month" | "hour" | "minute"; step?: number };
export const PERIODS_STRIPE: Period[] = [
  { id: "7d", label: "7d", points: 7, unit: "day" },
  { id: "4w", label: "4w", points: 28, unit: "day" },
  { id: "3m", label: "3m", points: 13, unit: "week" },
  { id: "12m", label: "12m", points: 12, unit: "month" },
];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
/* Axis labels counting back from a fixed "today" (Sun Nov 8 2026) so screenshots never drift */
export const TODAY = new Date(2026, 10, 8);
export function labels(p: Period) {
  return Array.from({ length: p.points }, (_, i) => {
    const back = p.points - 1 - i;
    const d = new Date(TODAY);
    if (p.unit === "day") d.setDate(d.getDate() - back);
    else if (p.unit === "week") d.setDate(d.getDate() - back * 7);
    else if (p.unit === "month") d.setMonth(d.getMonth() - back);
    else if (p.unit === "hour") return `${String((24 + 14 - back) % 24).padStart(2, "0")}:00`;
    else { const m = (24 * 60 + 14 * 60 - back * (p.step ?? 1)) % (24 * 60); return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`; }
    return p.unit === "month" ? MONTHS[d.getMonth()] : `${MONTHS[d.getMonth()]} ${d.getDate()}`;
  });
}

export const money = (n: number, digits = 0) => n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: digits, minimumFractionDigits: digits });
export const compact = (n: number) => n.toLocaleString("en-US", { notation: "compact", maximumFractionDigits: 1 });
export const num = (n: number) => Math.round(n).toLocaleString("en-US");
export const signed = (f: number) => `${f >= 0 ? "+" : ""}${(f * 100).toFixed(1)}%`;

const FIRST = ["Ava", "Liam", "Maya", "Noah", "Iris", "Owen", "Zara", "Eli", "Nina", "Theo", "Ruth", "Jonah", "Priya", "Marco", "Lena", "Sam", "Tomas", "Aiko", "Dev", "Grace"];
const LAST = ["Chen", "Okafor", "Silva", "Novak", "Haddad", "Kim", "Lund", "Rossi", "Patel", "Moreau", "Brooks", "Ito", "Garcia", "Walsh", "Berg", "Nakamura"];
export const person = (r: () => number) => `${pick(r, FIRST)} ${pick(r, LAST)}`;
export const COMPANIES = ["Acme Corp", "Globex", "Northwind", "Initech", "Umbrella Labs", "Stark Freight", "Wayne Supply", "Hooli", "Vandelay Imports", "Soylent Foods", "Cyberdyne", "Tyrell Works", "Wonka Goods", "Pied Piper", "Massive Dynamic", "Oscorp"];
