/* NorthStar React kit: form controls, tabs and tooltip. Thin wrappers over the shadcn/ui (Base UI) parts
   that wire a visible label, helper text and error text to the control with ids, aria-describedby and
   aria-invalid, and style them only from NorthStar roles. */
import * as React from "react";
import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox";
import { CheckIcon, MinusIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const FIELD = "h-[var(--ns-density-control)] border-ns-default bg-[var(--ns-field-bg)] text-sm aria-invalid:border-[var(--ns-status-error)]";

function useFieldIds(helper?: React.ReactNode, error?: React.ReactNode) {
  const id = React.useId();
  const msgId = id + "-msg";
  return { id, msgId, describedBy: error || helper ? msgId : undefined };
}
function Message({ id, helper, error }: { id: string; helper?: React.ReactNode; error?: React.ReactNode }) {
  if (!error && !helper) return null;
  return <p id={id} className={cn("text-xs", error ? "text-status-error" : "text-muted-foreground")}>{error || helper}</p>;
}
function Label({ htmlFor, id, children, required }: { htmlFor?: string; id?: string; children: React.ReactNode; required?: boolean }) {
  return (
    <label htmlFor={htmlFor} id={id} className="text-sm font-semibold text-foreground">
      {children}{required && <span className="ml-0.5 text-status-error" aria-hidden>*</span>}
    </label>
  );
}

/* Text input with a visible label, helper text, and an error that replaces the helper and sets aria-invalid */
export function TextField({ label, value, onChange, helper, error, required, placeholder, type = "text", disabled, className }: { label: string; value: string; onChange: (value: string) => void; helper?: React.ReactNode; error?: React.ReactNode; required?: boolean; placeholder?: string; type?: "text" | "email" | "search" | "password" | "url" | "tel"; disabled?: boolean; className?: string }) {
  const { id, msgId, describedBy } = useFieldIds(helper, error);
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Label htmlFor={id} required={required}>{label}</Label>
      <Input id={id} type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} disabled={disabled} required={required}
        aria-invalid={error ? true : undefined} aria-describedby={describedBy} className={FIELD} />
      <Message id={msgId} helper={helper} error={error} />
    </div>
  );
}

/* Single choice from a short list (Base UI Select): label, helper and error wired like TextField */
export function SelectField<T extends string>({ label, value, onChange, options, helper, error, placeholder = "Select", disabled, className }: { label: string; value: T | null; onChange: (value: T) => void; options: readonly { id: T; label: string }[]; helper?: React.ReactNode; error?: React.ReactNode; placeholder?: string; disabled?: boolean; className?: string }) {
  const { id, msgId, describedBy } = useFieldIds(helper, error);
  const labelId = id + "-label";
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Label id={labelId}>{label}</Label>
      <Select items={options.map((o) => ({ value: o.id, label: o.label }))} value={value} onValueChange={(v) => { if (v) onChange(v as T); }} disabled={disabled}>
        <SelectTrigger aria-labelledby={labelId} aria-invalid={error ? true : undefined} aria-describedby={describedBy} className={cn(FIELD, "w-full justify-between")}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="border-ns-default bg-ns-elevated">
          {options.map((o) => <SelectItem key={o.id} value={o.id}>{o.label}</SelectItem>)}
        </SelectContent>
      </Select>
      <Message id={msgId} helper={helper} error={error} />
    </div>
  );
}

/* Checkbox with its label as the click target; supports the indeterminate (select all) state */
export function CheckboxField({ label, checked, onChange, indeterminate, helper, disabled }: { label: string; checked: boolean; onChange: (checked: boolean) => void; indeterminate?: boolean; helper?: React.ReactNode; disabled?: boolean }) {
  const { id, msgId, describedBy } = useFieldIds(helper);
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className={cn("inline-flex cursor-pointer items-center gap-2.5 text-sm", disabled && "cursor-not-allowed opacity-50")}>
        <CheckboxPrimitive.Root id={id} checked={checked} indeterminate={indeterminate} disabled={disabled} onCheckedChange={(c) => onChange(c)} aria-describedby={describedBy}
          className="grid size-4 shrink-0 place-items-center rounded-[var(--ns-radius-xs)] border border-ns-strong bg-[var(--ns-field-bg)] outline-none focus-visible:ring-3 focus-visible:ring-ring/50 data-[checked]:border-primary data-[checked]:bg-primary data-[indeterminate]:border-primary data-[indeterminate]:bg-primary">
          <CheckboxPrimitive.Indicator className="text-primary-foreground">
            {indeterminate ? <MinusIcon className="size-3" strokeWidth={3} /> : <CheckIcon className="size-3" strokeWidth={3} />}
          </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>
        {label}
      </label>
      <Message id={msgId} helper={helper} />
    </div>
  );
}

/* On and off setting that applies immediately (role=switch), label on the left */
export function SwitchField({ label, checked, onChange, helper, disabled }: { label: string; checked: boolean; onChange: (checked: boolean) => void; helper?: React.ReactNode; disabled?: boolean }) {
  const { id, msgId, describedBy } = useFieldIds(helper);
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between gap-4">
        <label htmlFor={id} className="text-sm">{label}</label>
        <Switch id={id} checked={checked} onCheckedChange={(c) => onChange(c)} disabled={disabled} aria-describedby={describedBy} />
      </div>
      <Message id={msgId} helper={helper} />
    </div>
  );
}

/* Two to four peer views of one object; arrow keys move between tabs (Base UI Tabs) */
export function ViewTabs<T extends string>({ label, value, onChange, tabs }: { label: string; value: T; onChange: (value: T) => void; tabs: readonly { id: T; label: string; content: React.ReactNode }[] }) {
  return (
    <Tabs value={value} onValueChange={(v) => onChange(v as T)}>
      <TabsList variant="line" aria-label={label}>
        {tabs.map((t) => <TabsTrigger key={t.id} value={t.id} className="data-active:text-foreground">{t.label}</TabsTrigger>)}
      </TabsList>
      {tabs.map((t) => <TabsContent key={t.id} value={t.id} className="pt-3">{t.content}</TabsContent>)}
    </Tabs>
  );
}

/* Short help on hover and focus for one control, for example an icon-only button; never essential info */
export function Hint({ content, children, side = "top" }: { content: React.ReactNode; children: React.ReactElement; side?: "top" | "bottom" | "left" | "right" }) {
  return (
    <TooltipProvider delay={300}>
      <Tooltip>
        <TooltipTrigger render={children} />
        <TooltipContent side={side}>{content}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
