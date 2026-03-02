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

  const contentRef = React.useRef<HTMLDivElement>(null);
  const contentId = React.useId();
  const [contentHeight, setContentHeight] = React.useState(0);
  const [isInitialized, setIsInitialized] = React.useState(false);

  const setOpenState = React.useCallback(
    (nextOpen: boolean) => {
      if (!isControlled) setInternalOpen(nextOpen);
      onOpenChange?.(nextOpen);
    },
    [isControlled, onOpenChange]
  );

  React.useLayoutEffect(() => {
    const node = contentRef.current;
    if (!node) return;

    const measure = () => setContentHeight(node.scrollHeight);
    measure();
    setIsInitialized(true);

    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(() => measure());
    observer.observe(node);

    return () => observer.disconnect();
  }, [children, isOpen]);

  return (
    <section
      className={cn(
        "bg-card text-card-foreground rounded-xl border shadow-sm",
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
          "focus-visible:border-ring focus-visible:ring-ring/50 flex w-full min-h-11 items-center justify-between gap-4 rounded-xl px-4 py-6 text-left outline-none transition-colors hover:bg-accent/40 focus-visible:ring-[3px] sm:min-h-10 sm:px-6 disabled:cursor-not-allowed disabled:opacity-60 [touch-action:manipulation]",
          triggerClassName
        )}
      >
        <span className="flex min-w-0 flex-col gap-1">
          <span className="truncate text-base font-semibold sm:text-lg">
            {title}
          </span>
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
        style={{
          maxHeight: isOpen
            ? isInitialized
              ? `${contentHeight}px`
              : "none"
            : "0px",
        }}
        className={cn(
          "overflow-hidden",
          isInitialized &&
            "transition-[max-height] duration-300 ease-out motion-reduce:transition-none"
        )}
      >
        <div
          ref={contentRef}
          className={cn("px-4 pb-4 sm:px-6 sm:pb-6", contentClassName)}
        >
          {children}
        </div>
      </div>
    </section>
  );
}
