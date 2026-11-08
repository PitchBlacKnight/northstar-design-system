import type { ComponentType } from "react";
import type { ViewMeta } from "./types";

const modules = import.meta.glob<{ meta: ViewMeta; default: ComponentType }>("./*.tsx", { eager: true });
export const views = Object.values(modules)
  .filter((m) => m.meta && m.default)
  .sort((a, b) => a.meta.order - b.meta.order);
export const findView = (slug: string) => views.find((v) => v.meta.slug === slug) ?? views[0];
