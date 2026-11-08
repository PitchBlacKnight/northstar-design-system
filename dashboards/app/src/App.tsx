/* Dashboard shell: sidebar built from the view registry, top bar with breadcrumb, Cmd-K palette,
   theme and density toggles, Sonner toaster. Routing is the hash: #finance, #commerce ... */
import * as React from "react";
import { MoonIcon, SearchIcon, SunIcon, Rows3Icon, Rows4Icon } from "lucide-react";
import { views, findView } from "@/views/registry";
import type { ViewMeta } from "@/views/types";
import { Toaster } from "sonner";
import { Button, CommandPalette } from "@/kit";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";

const slugFromHash = () => decodeURIComponent(location.hash.replace(/^#\/?/, "")) || views[0]?.meta.slug || "";
const groups = () => {
  const m = new Map<ViewMeta["category"], typeof views>();
  views.forEach((v) => m.set(v.meta.category, [...(m.get(v.meta.category) ?? []), v]));
  return [...m.entries()];
};
const store = { get: (k: string) => { try { return localStorage.getItem("nsd-" + k); } catch { return null; } }, set: (k: string, v: string) => { try { localStorage.setItem("nsd-" + k, v); } catch { /* private mode */ } } };

function Logo() {
  return (
    <svg viewBox="0 0 24 24" className="size-6 shrink-0" aria-hidden>
      <path d="M3 15 12 4l9 11" fill="none" stroke="var(--ns-text-tertiary)" strokeWidth="2.2" strokeLinejoin="round" />
      <path d="M12 11.5 15.5 16 12 20.5 8.5 16Z" fill="var(--ns-text-accent)" />
    </svg>
  );
}

function Nav({ slug }: { slug: string }) {
  const { setOpenMobile } = useSidebar();
  return (
    <Sidebar collapsible="offcanvas" className="border-r border-border">
      <SidebarHeader className="px-4 pt-4">
        <a href={"#" + (views[0]?.meta.slug ?? "")} className="flex items-center gap-2.5" onClick={() => setOpenMobile(false)}>
          <Logo />
          <span className="flex flex-col leading-tight">
            <span className="text-sm font-bold text-foreground">NorthStar</span>
            <span className="text-xs text-ns-tertiary">Dashboards</span>
          </span>
        </a>
      </SidebarHeader>
      <SidebarContent>
        {groups().map(([cat, items]) => (
          <SidebarGroup key={cat} className="py-1">
            <SidebarGroupLabel className="ns-overline h-7">{cat}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map(({ meta }) => (
                  <SidebarMenuItem key={meta.slug}>
                    <SidebarMenuButton isActive={meta.slug === slug} render={<a href={"#" + meta.slug} aria-current={meta.slug === slug ? "page" : undefined} onClick={() => setOpenMobile(false)} />}
                      className="data-active:bg-ns-selected data-active:text-foreground data-active:shadow-[inset_2px_0_0_var(--ns-text-accent)]">
                      <span className="truncate">{meta.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="px-4 pb-4">
        <a href="../../#/" className="text-xs text-ns-link hover:underline">Back to the NorthStar docs</a>
      </SidebarFooter>
    </Sidebar>
  );
}

export default function App() {
  const [slug, setSlug] = React.useState(slugFromHash);
  /* ?theme=light|dark overrides the saved choice; ?still turns off motion (used by the visual check) */
  const params = React.useMemo(() => new URLSearchParams(location.search), []);
  const [theme, setTheme] = React.useState<"dark" | "light">(() => { const t = params.get("theme") || store.get("theme"); return t === "light" ? "light" : "dark"; });
  React.useEffect(() => { if (!params.has("still")) return; const s = document.createElement("style"); s.textContent = "*,*::before,*::after{animation:none!important;transition:none!important}"; document.head.appendChild(s); }, [params]);
  const [compact, setCompact] = React.useState(() => store.get("density") === "compact");
  const [palette, setPalette] = React.useState(false);
  const embed = params.has("embed");

  React.useEffect(() => { const on = () => setSlug(slugFromHash()); addEventListener("hashchange", on); return () => removeEventListener("hashchange", on); }, []);
  React.useEffect(() => { document.documentElement.dataset.theme = theme; store.set("theme", theme); }, [theme]);
  React.useEffect(() => { if (compact) document.documentElement.dataset.density = "compact"; else delete document.documentElement.dataset.density; store.set("density", compact ? "compact" : "comfortable"); }, [compact]);
  React.useEffect(() => {
    const on = (e: KeyboardEvent) => { if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); setPalette((p) => !p); } };
    addEventListener("keydown", on); return () => removeEventListener("keydown", on);
  }, []);

  const current = findView(slug);
  React.useEffect(() => { if (current) document.title = `${current.meta.title} | NorthStar dashboards`; window.scrollTo(0, 0); }, [current]);
  if (!current) return null;
  const View = current.default;
  const go = (s: string) => { setPalette(false); location.hash = s; };

  return (
    <SidebarProvider defaultOpen={!embed}>
      <Nav slug={current.meta.slug} />
      <SidebarInset className="min-w-0 bg-background">
        <header className="sticky top-0 z-20 flex h-14 items-center gap-2 border-b border-border bg-[color-mix(in_srgb,var(--ns-background-primary)_88%,transparent)] px-3 backdrop-blur sm:px-5">
          <SidebarTrigger className="-ml-1" />
          <Breadcrumb className="min-w-0">
            <BreadcrumbList className="flex-nowrap">
              <BreadcrumbItem className="hidden sm:inline-flex">{current.meta.category}</BreadcrumbItem>
              <BreadcrumbSeparator className="hidden sm:inline-flex" />
              <BreadcrumbItem><BreadcrumbPage className="truncate font-semibold">{current.meta.title}</BreadcrumbPage></BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="ml-auto flex items-center gap-1.5">
            <Button variant="secondary" size="sm" onClick={() => setPalette(true)} aria-label="Jump to a dashboard">
              <SearchIcon className="size-3.5" aria-hidden />
              <span className="hidden md:inline">Jump to</span>
              <kbd className="hidden md:inline-grid">⌘K</kbd>
            </Button>
            <Button variant="ghost" size="sm" icon onClick={() => setCompact((c) => !c)} aria-pressed={compact} aria-label={compact ? "Comfortable density" : "Compact density"} title="Density">
              {compact ? <Rows4Icon aria-hidden /> : <Rows3Icon aria-hidden />}
            </Button>
            <Button variant="ghost" size="sm" icon onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))} aria-label={theme === "dark" ? "Light theme" : "Dark theme"} title="Theme">
              {theme === "dark" ? <SunIcon aria-hidden /> : <MoonIcon aria-hidden />}
            </Button>
          </div>
        </header>
        <main id="main" className="mx-auto flex w-full max-w-[1600px] min-w-0 flex-col gap-4 p-3 sm:p-5">
          <View key={current.meta.slug} />
        </main>
      </SidebarInset>
      <CommandPalette open={palette} onOpenChange={setPalette} label="Jump to a dashboard" placeholder="Search dashboards"
        groups={groups().map(([cat, items]) => ({ heading: cat, items: items.map(({ meta }) => ({ id: meta.slug, label: meta.title, meta: meta.modeledOn.split(",")[0], keywords: meta.category })) }))}
        onSelect={(it) => go(it.id)} />
      {/* Toasts render as NorthStar notices (ns-notice--toast); Sonner keeps stacking, timing and swipe */}
      <Toaster theme={theme} position="bottom-right" visibleToasts={3}
        icons={{ success: "✓", info: "i", warning: "!", error: "×" }}
        toastOptions={{ unstyled: true, classNames: { toast: "ns ns-notice ns-notice--toast ns-notice--info w-[360px]", title: "ns-notice__title", description: "ns-notice__body", icon: "ns-notice__icon", success: "ns-notice--success", error: "ns-notice--error", warning: "ns-notice--warning", info: "ns-notice--info", actionButton: "ns-btn ns-btn--ghost ns-btn--sm", cancelButton: "ns-btn ns-btn--ghost ns-btn--sm" } }} />
    </SidebarProvider>
  );
}
