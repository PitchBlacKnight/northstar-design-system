/* Docs page for the NorthStar React kit (data in js/react-kit-data.js, generated from dashboards/app/src/kit). */
(function () {
  const NS = window.NS, K = NS.REACT_KIT;
  if (!K) return;
  const { h2, table, codeBlock, notice } = NS;
  const x = NS.esc;
  const covered = Object.keys(K.examples).filter((id) => NS.componentById(id));
  NS.PAGES["getting-started/react"] = {
    title: "React kit", status: "New",
    lede: `NorthStar's React layer: ${K.api.length} components built on shadcn/ui (Base UI), Recharts, Sonner, cmdk and NumberFlow, themed only from NorthStar tokens. The eight working dashboards use nothing else.`,
    body: () => `${h2("What it is")}<p>The kit lives in <code>${K.source}</code>. It is a copy-in kit, the way shadcn/ui works: there is no npm package to install. Every shadcn variable in <code>src/index.css</code> reads a NorthStar role (for example <code>--card</code> reads <code>--ns-background-surface</code>), so theme, density and high contrast follow the token sheet.</p>
${notice("info", "Copy in, do not install", "Copy src/kit, src/components/ui and the token mapping in src/index.css into a Vite or Next app with Tailwind 4, then load css/tokens.css. Open Sans only.")}
${h2("Set up")}${codeBlock(`npm install @base-ui/react @number-flow/react recharts sonner cmdk lucide-react class-variance-authority cn
# copy from northstar-design-system/dashboards/app:
#   src/kit/            NorthStar React kit
#   src/components/ui/  shadcn/ui on Base UI
#   src/index.css       Tailwind 4 theme mapped to --ns-* roles
# and load the token sheet before your app CSS:
#   <link rel="stylesheet" href="css/tokens.css">`, "js")}
${codeBlock(`import { Bento, Tile, Figure, DataTable, ConfirmAction, toast } from "@/kit";`, "js")}
${h2("Components")}${table(["Component", "Props", "What it does"], K.api.map((a) => [`<code>${a.name}${x(a.generic)}</code>`, `<code>${a.props.map(x).join("<br>")}</code>`, x(a.note)]))}
${h2("Docs components it implements")}<p>These docs pages show real kit code on their Code tab. The rest still show the HTML and CSS implementation with an illustrative React shape.</p><ul>${covered.map((id) => `<li><a href="#/components/${NS.componentById(id).id}/code">${NS.componentById(id).name}</a>: ${K.examples[id].uses.map((u) => `<code>${u}</code>`).join(", ")}</li>`).join("")}</ul>
${h2("See it running")}<p>The <a href="#/dashboards/apps">eight working dashboards</a> are built only from this kit. Their source is one file each in <code>dashboards/app/src/views</code>.</p>`,
  };
  const g = NS.NAV.find((n) => n.group === "Getting started");
  if (g) g.items.push(["getting-started/react", "React kit", "New"]);
})();
