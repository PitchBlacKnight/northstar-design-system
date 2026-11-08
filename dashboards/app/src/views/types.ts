/* Contract for every dashboard view. One file per dashboard in src/views/<slug>.tsx:
   export const meta: ViewMeta  and  export default function View(): JSX.Element
   The shell discovers views with import.meta.glob, so no shared file needs editing. */
export type ViewMeta = {
  slug: string;        /* hash route, e.g. "finance" -> #finance */
  title: string;       /* "Payments" */
  modeledOn: string;   /* "Stripe Dashboard, Home" */
  category: "Finance" | "Commerce" | "Observability" | "CRM" | "Projects" | "Deployments" | "Support" | "People" | "Other";
  order: number;       /* nav order; 10, 20, 30 for the first three; others 100+ */
  summary: string;     /* one line for the docs entry */
};
