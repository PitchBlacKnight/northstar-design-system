/* NorthStar React kit: form controls, tabs and tooltip, rendered with NorthStar's own markup and classes
   from css/components.css (ns-field, ns-input, ns-select, ns-check, ns-toggle, ns-tabs, ns-tip). Native
   inputs carry the semantics; React wires the label, helper and error text with ids, aria-describedby
   and aria-invalid, and adds the keyboard behavior the docs get from ui.js. */
import * as React from "react";
import { cn } from "@/lib/utils";

function useFieldIds(helper?: React.ReactNode, error?: React.ReactNode) {
  const id = React.useId();
  const msgId = id + "-msg";
  return { id, msgId, describedBy: error || helper ? msgId : undefined };
}
function Message({ id, helper, error }: { id: string; helper?: React.ReactNode; error?: React.ReactNode }) {
  if (!error && !helper) return null;
  return <span id={id} className="ns-helper">{error || helper}</span>;
}

/* Text input (ns-field, ns-input): visible label, helper text, and an error that replaces the helper and sets aria-invalid */
export function TextField({ label, value, onChange, helper, error, required, placeholder, type = "text", disabled, size = "md", className }: { label: string; value: string; onChange: (value: string) => void; helper?: React.ReactNode; error?: React.ReactNode; required?: boolean; placeholder?: string; type?: "text" | "email" | "search" | "password" | "url" | "tel"; disabled?: boolean; size?: "sm" | "md" | "lg"; className?: string }) {
  const { id, msgId, describedBy } = useFieldIds(helper, error);
  return (
    <div className={cn("ns-field", error && "is-error", className)}>
      <label className="ns-label" htmlFor={id}>{label}{required && <span aria-hidden> *</span>}</label>
      <input id={id} className={cn("ns-input", size !== "md" && `ns-input--${size}`)} type={type} value={value} onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder} disabled={disabled} required={required} aria-invalid={error ? true : undefined} aria-describedby={describedBy} />
      <Message id={msgId} helper={helper} error={error} />
    </div>
  );
}

/* Select (ns-select): the native select NorthStar documents, with label, helper and error wired like TextField */
export function SelectField<T extends string>({ label, value, onChange, options, helper, error, placeholder = "Select", disabled, className }: { label: string; value: T | null; onChange: (value: T) => void; options: readonly { id: T; label: string }[]; helper?: React.ReactNode; error?: React.ReactNode; placeholder?: string; disabled?: boolean; className?: string }) {
  const { id, msgId, describedBy } = useFieldIds(helper, error);
  return (
    <div className={cn("ns-field", error && "is-error", className)}>
      <label className="ns-label" htmlFor={id}>{label}</label>
      <select id={id} className="ns-select" value={value ?? ""} onChange={(e) => onChange(e.target.value as T)} disabled={disabled}
        aria-invalid={error ? true : undefined} aria-describedby={describedBy}>
        {value === null && <option value="" disabled>{placeholder}</option>}
        {options.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
      </select>
      <Message id={msgId} helper={helper} error={error} />
    </div>
  );
}

/* Checkbox (ns-check): a native checkbox inside its label; supports the indeterminate (select all) state */
export function CheckboxField({ label, checked, onChange, indeterminate, helper, disabled }: { label: string; checked: boolean; onChange: (checked: boolean) => void; indeterminate?: boolean; helper?: React.ReactNode; disabled?: boolean }) {
  const { msgId, describedBy } = useFieldIds(helper);
  const ref = React.useRef<HTMLInputElement>(null);
  React.useEffect(() => { if (ref.current) ref.current.indeterminate = !!indeterminate; }, [indeterminate]);
  return (
    <div className="ns-field">
      <label className="ns-check">
        <input ref={ref} type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} disabled={disabled} aria-describedby={describedBy} />
        {label}
      </label>
      <Message id={msgId} helper={helper} />
    </div>
  );
}

/* Switch (ns-toggle): a native checkbox with role=switch for settings that apply immediately */
export function SwitchField({ label, checked, onChange, helper, disabled, size = "md" }: { label: string; checked: boolean; onChange: (checked: boolean) => void; helper?: React.ReactNode; disabled?: boolean; size?: "sm" | "md" }) {
  const { msgId, describedBy } = useFieldIds(helper);
  return (
    <div className="ns-field">
      <label className={cn("ns-toggle", size === "sm" && "ns-toggle--sm")}>
        <input type="checkbox" role="switch" checked={checked} onChange={(e) => onChange(e.target.checked)} disabled={disabled} aria-describedby={describedBy} />
        {label}
      </label>
      <Message id={msgId} helper={helper} />
    </div>
  );
}

/* Tabs (ns-tabs): two to four peer views of one object; arrow keys, Home and End move and select */
export function ViewTabs<T extends string>({ label, value, onChange, tabs, pill }: { label: string; value: T; onChange: (value: T) => void; tabs: readonly { id: T; label: string; content: React.ReactNode }[]; pill?: boolean }) {
  const base = React.useId();
  const refs = React.useRef<(HTMLButtonElement | null)[]>([]);
  const move = (e: React.KeyboardEvent, i: number) => {
    const n = tabs.length;
    const j = e.key === "ArrowRight" ? (i + 1) % n : e.key === "ArrowLeft" ? (i - 1 + n) % n : e.key === "Home" ? 0 : e.key === "End" ? n - 1 : -1;
    if (j < 0) return;
    e.preventDefault(); onChange(tabs[j].id); refs.current[j]?.focus();
  };
  return (
    <div>
      <div className={cn("ns-tabs", pill && "ns-tabs--pill")} role="tablist" aria-label={label}>
        {tabs.map((t, i) => (
          <button key={t.id} ref={(el) => { refs.current[i] = el; }} type="button" role="tab" className="ns-tab" id={`${base}-t${i}`} aria-controls={`${base}-p${i}`}
            aria-selected={t.id === value} tabIndex={t.id === value ? 0 : -1} onClick={() => onChange(t.id)} onKeyDown={(e) => move(e, i)}>{t.label}</button>
        ))}
      </div>
      {tabs.map((t, i) => (
        <div key={t.id} role="tabpanel" id={`${base}-p${i}`} aria-labelledby={`${base}-t${i}`} hidden={t.id !== value} tabIndex={0} style={{ paddingTop: "var(--ns-space-5)" }}>{t.content}</div>
      ))}
    </div>
  );
}

/* Tooltip (ns-tip): short help shown on hover and focus, described by aria-describedby; never essential info */
export function Hint({ content, children }: { content: React.ReactNode; children: React.ReactElement<{ "aria-describedby"?: string }> }) {
  const id = React.useId();
  return (
    <span className="ns-tip">
      {React.cloneElement(children, { "aria-describedby": id })}
      <span className="ns-tip__bubble" role="tooltip" id={id}>{content}</span>
    </span>
  );
}

/* Radio group (ns-check--radio in a fieldset): one choice from two to five visible options; arrow keys move
   and select, as native radios do */
export function RadioGroupField<T extends string>({ label, value, onChange, options, helper, horizontal, disabled }: { label: string; value: T; onChange: (value: T) => void; options: readonly { id: T; label: string }[]; helper?: React.ReactNode; horizontal?: boolean; disabled?: boolean }) {
  const name = React.useId();
  const { msgId, describedBy } = useFieldIds(helper);
  return (
    <fieldset className="ns-field" style={{ border: 0, padding: 0, margin: 0 }} aria-describedby={describedBy}>
      <legend className="ns-label" style={{ marginBottom: 10 }}>{label}</legend>
      <div style={{ display: "flex", flexDirection: horizontal ? "row" : "column", flexWrap: "wrap", gap: horizontal ? 24 : 12 }}>
        {options.map((o) => (
          <label key={o.id} className="ns-check ns-check--radio">
            <input type="radio" name={name} value={o.id} checked={o.id === value} disabled={disabled} onChange={() => onChange(o.id)} />
            {o.label}
          </label>
        ))}
      </div>
      <Message id={msgId} helper={helper} />
    </fieldset>
  );
}

/* Multi-line text (ns-textarea) with label, helper or error, and an optional character counter tied to maxLength */
export function TextAreaField({ label, value, onChange, helper, error, maxLength, placeholder, required, disabled, rows }: { label: string; value: string; onChange: (value: string) => void; helper?: React.ReactNode; error?: React.ReactNode; maxLength?: number; placeholder?: string; required?: boolean; disabled?: boolean; rows?: number }) {
  const { id, msgId } = useFieldIds(helper, error);
  const countId = id + "-count";
  const described = [error || helper ? msgId : null, maxLength ? countId : null].filter(Boolean).join(" ") || undefined;
  return (
    <div className={cn("ns-field", error && "is-error")}>
      <label className="ns-label" htmlFor={id}>{label}{required && <span aria-hidden> *</span>}</label>
      <textarea id={id} className="ns-textarea" rows={rows} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} maxLength={maxLength}
        required={required} disabled={disabled} aria-invalid={error ? true : undefined} aria-describedby={described} />
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
        <Message id={msgId} helper={helper} error={error} />
        {maxLength && <span id={countId} className="ns-helper tnum" style={{ marginLeft: "auto" }}>{value.length} / {maxLength}</span>}
      </div>
    </div>
  );
}
