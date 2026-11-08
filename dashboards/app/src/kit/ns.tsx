/* NorthStar React kit: core controls rendered with NorthStar's own classes from css/components.css (the same
   markup the docs show), with Base UI or cmdk only for behavior: focus, keyboard and popups. A style change in
   components.css reaches the docs and React together. */
import * as React from "react";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { Command } from "cmdk";
import { SearchIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/* NorthStar button (ns-btn): primary by default; secondary, ghost and danger variants; sm, md and lg sizes */
export function Button({ variant = "primary", size = "md", icon, className, type = "button", ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "ghost" | "danger"; size?: "sm" | "md" | "lg"; icon?: boolean }) {
  return <button type={type} className={cn("ns-btn", variant !== "primary" && `ns-btn--${variant}`, size !== "md" && `ns-btn--${size}`, icon && "ns-btn--icon", className)} {...props} />;
}

/* NorthStar badge (ns-badge): filled by default, outline optional; status sets the color role */
export function Badge({ status = "neutral", outline, size = "md", children }: { status?: "success" | "warning" | "error" | "info" | "neutral"; outline?: boolean; size?: "sm" | "md" | "lg"; children: React.ReactNode }) {
  const cls = { success: "ns-badge--success", warning: "ns-badge--warning", error: "ns-badge--error", info: "", neutral: "ns-badge--neutral" }[status];
  return <span className={cn("ns-badge", cls, outline && "ns-badge--outline", size !== "md" && `ns-badge--${size}`)}>{children}</span>;
}

export type PaletteItem = { id: string; label: string; meta?: string; keywords?: string };
/* Command palette (ns-cmdk) in a modal dialog: typing filters, arrows move, Enter runs onSelect. Bind Cmd K yourself. */
export function CommandPalette({ open, onOpenChange, groups, onSelect, placeholder = "Search", label = "Command palette" }: { open: boolean; onOpenChange: (open: boolean) => void; groups: readonly { heading: string; items: readonly PaletteItem[] }[]; onSelect: (item: PaletteItem) => void; placeholder?: string; label?: string }) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop className="ns-modal-backdrop" />
        <DialogPrimitive.Popup aria-label={label} className="ns ns-cmdk-popup" style={{ position: "fixed", left: "50%", top: "18vh", transform: "translateX(-50%)", width: "min(560px, calc(100vw - 32px))", zIndex: 1001 }}>
          <Command label={label} className="ns-cmdk">
            <div className="ns-cmdk__query">
              <SearchIcon aria-hidden />
              <Command.Input placeholder={placeholder} autoFocus />
              <kbd>Esc</kbd>
            </div>
            <Command.List className="ns-cmdk__list">
              <Command.Empty className="ns-helper ns-list-empty">No results.</Command.Empty>
              {groups.map((g) => (
                <Command.Group key={g.heading} heading={g.heading}>
                  {g.items.map((it) => (
                    <Command.Item key={it.id} value={`${it.label} ${it.meta ?? ""} ${it.keywords ?? ""}`} onSelect={() => onSelect(it)} className="ns-cmdk__item">
                      <span>{it.label}</span>
                      {it.meta && <span className="ns-cmdk__meta">{it.meta}</span>}
                    </Command.Item>
                  ))}
                </Command.Group>
              ))}
            </Command.List>
            <div className="ns-cmdk__foot"><span><kbd>↑</kbd><kbd>↓</kbd> Navigate</span><span><kbd>↵</kbd> Open</span><span><kbd>Esc</kbd> Close</span></div>
          </Command>
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

/* Confirm dialog (ns-modal) with focus trap and Escape from Base UI; confirming calls onConfirm */
export function Modal({ open, onOpenChange, label, title, children, footer, size = "sm" }: { open: boolean; onOpenChange: (open: boolean) => void; label?: string; title: string; children?: React.ReactNode; footer: React.ReactNode; size?: "sm" | "md" | "lg" }) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop className="ns-modal-backdrop" />
        <DialogPrimitive.Popup className={cn("ns ns-modal", size !== "md" && `ns-modal--${size}`)} style={{ position: "fixed", left: "50%", top: "50%", transform: "translate(-50%, -50%)", zIndex: 1001 }}>
          <div className="ns-modal__head">
            <div>
              {label && <p className="ns-modal__label">{label}</p>}
              <DialogPrimitive.Title className="ns-modal__title">{title}</DialogPrimitive.Title>
            </div>
          </div>
          <DialogPrimitive.Description render={<div className="ns-modal__body" />}>{children}</DialogPrimitive.Description>
          <div className="ns-modal__foot">{footer}</div>
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
export const ModalClose = DialogPrimitive.Close;
