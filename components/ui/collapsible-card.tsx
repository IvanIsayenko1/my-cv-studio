"use client";

import * as React from "react";

import { ChevronDownIcon } from "lucide-react";

import { cn } from "@/lib/utils/cn";

type CollapsibleCardProps = {
  title: React.ReactNode;
  children: React.ReactNode;
  description?: React.ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  className?: string;
  triggerClassName?: string;
  contentClassName?: string;
};

export function CollapsibleCard({
  title,
  children,
  description,
  defaultOpen = false,
  open,
  onOpenChange,
  disabled = false,
  className,
  triggerClassName,
  contentClassName,
}: CollapsibleCardProps) {
  const isControlled = open !== undefined;
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const isOpen = isControlled ? open : internalOpen;
  const contentId = React.useId();

  const setOpenState = React.useCallback(
    (nextOpen: boolean) => {
      if (!isControlled) setInternalOpen(nextOpen);
      onOpenChange?.(nextOpen);
    },
    [isControlled, onOpenChange]
  );

  return (
    <section
      className={cn(
        "bg-card text-card-foreground rounded-4xl border shadow-sm",
        className
      )}
    >
      <button
        type="button"
        disabled={disabled}
        aria-expanded={isOpen}
        aria-controls={contentId}
        onClick={() => setOpenState(!isOpen)}
        className={cn(
          "focus-visible:border-ring focus-visible:ring-ring/50 hover:bg-accent/40 flex min-h-11 w-full [touch-action:manipulation] items-center justify-between gap-4 rounded-3xl px-4 py-6 text-left transition-colors outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-60 sm:min-h-10 sm:px-6",
          triggerClassName
        )}
      >
        <span className="flex min-w-0 flex-col gap-1">
          <span className="truncate">{title}</span>
          {description ? (
            <span className="text-muted-foreground text-sm">{description}</span>
          ) : null}
        </span>
        <ChevronDownIcon
          className={cn(
            "text-muted-foreground size-4 shrink-0 transition-transform duration-300 ease-out motion-reduce:transition-none",
            isOpen ? "rotate-180" : "rotate-0"
          )}
        />
      </button>

      <div
        id={contentId}
        aria-hidden={!isOpen}
        hidden={!isOpen}
        className="overflow-hidden"
      >
        <div className={cn("px-4 pb-4 sm:px-6 sm:pb-6", contentClassName)}>
          {children}
        </div>
      </div>
    </section>
  );
}
