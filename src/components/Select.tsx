"use client";

import * as RS from "@radix-ui/react-select";
import { Icon } from "./Icon";

export interface Option {
  value: string;
  label: string;
  hint?: string;
}

/**
 * Accessible dropdown (Radix) styled to match the app: white trigger with a hairline,
 * solid popover, check mark on the selected row. Keyboard + screen reader support
 * come from Radix; no native <select> chrome that renders differently per OS.
 */
export function Select({
  value,
  onChange,
  options,
  label,
  className = "",
  size = "md",
}: {
  value: string;
  onChange: (v: string) => void;
  options: Option[];
  label: string;
  className?: string;
  size?: "sm" | "md";
}) {
  // Radix reserves "" for "no value", so map it to a sentinel.
  const EMPTY = "__empty__";
  const toR = (v: string) => (v === "" ? EMPTY : v);
  const fromR = (v: string) => (v === EMPTY ? "" : v);

  return (
    <RS.Root value={toR(value)} onValueChange={(v) => onChange(fromR(v))}>
      <RS.Trigger
        aria-label={label}
        className={`group inline-flex w-full items-center justify-between gap-2 rounded-xl border border-[rgba(28,29,31,0.12)] bg-white text-left font-medium text-ink outline-none transition-colors hover:border-[rgba(28,29,31,0.25)] focus-visible:border-graphite-900 data-[state=open]:border-graphite-900 ${
          size === "sm" ? "min-h-[38px] px-3 text-sm" : "min-h-[44px] px-3.5 text-[0.95rem]"
        } ${className}`}
      >
        <span className="truncate">
          <RS.Value />
        </span>
        <RS.Icon className="shrink-0 text-ink-muted transition-transform group-data-[state=open]:rotate-180">
          <Icon name="chev" size={16} />
        </RS.Icon>
      </RS.Trigger>
      <RS.Portal>
        <RS.Content
          position="popper"
          sideOffset={6}
          className="z-[70] max-h-[min(360px,var(--radix-select-content-available-height))] min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-2xl border border-[rgba(28,29,31,0.08)] bg-white p-1.5 shadow-[0_18px_40px_-12px_rgba(28,29,31,0.35)]"
        >
          <RS.Viewport>
            {options.map((o) => (
              <RS.Item
                key={o.value}
                value={toR(o.value)}
                className="relative flex cursor-pointer select-none items-center justify-between gap-3 rounded-xl py-2.5 pl-3 pr-9 text-sm text-ink outline-none data-[highlighted]:bg-glacier-100 data-[state=checked]:font-semibold"
              >
                <RS.ItemText>{o.label}</RS.ItemText>
                {o.hint && <span className="text-xs text-ink-muted">{o.hint}</span>}
                <RS.ItemIndicator className="absolute right-3 text-graphite-900">
                  <Icon name="check" size={15} />
                </RS.ItemIndicator>
              </RS.Item>
            ))}
          </RS.Viewport>
        </RS.Content>
      </RS.Portal>
    </RS.Root>
  );
}
