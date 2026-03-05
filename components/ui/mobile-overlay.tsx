"use client";

import * as React from "react";

import * as DialogPrimitive from "@radix-ui/react-dialog";

import { cn } from "@/lib/utils/cn";

function MobileOverlay({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="mobile-overlay" {...props} />;
}

function MobileOverlayTrigger({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return (
    <DialogPrimitive.Trigger data-slot="mobile-overlay-trigger" {...props} />
  );
}

function MobileOverlayClose({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="mobile-overlay-close" {...props} />;
}

function MobileOverlayPortal({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return (
    <DialogPrimitive.Portal data-slot="mobile-overlay-portal" {...props} />
  );
}

function MobileOverlayContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content>) {
  const [viewportRect, setViewportRect] = React.useState<{
    height: number;
    offsetTop: number;
  } | null>(null);

  React.useEffect(() => {
    if (typeof window === "undefined" || !window.visualViewport) return;

    const viewport = window.visualViewport;

    const updateViewportRect = () => {
      setViewportRect({
        height: viewport.height,
        offsetTop: viewport.offsetTop,
      });
    };

    updateViewportRect();
    viewport.addEventListener("resize", updateViewportRect);
    viewport.addEventListener("scroll", updateViewportRect);

    return () => {
      viewport.removeEventListener("resize", updateViewportRect);
      viewport.removeEventListener("scroll", updateViewportRect);
    };
  }, []);

  const viewportStyle = viewportRect
    ? {
        top: `${viewportRect.offsetTop}px`,
        height: `${viewportRect.height}px`,
        bottom: "auto" as const,
      }
    : undefined;

  return (
    <MobileOverlayPortal>
      <DialogPrimitive.Close asChild>
        <DialogPrimitive.Overlay
          data-slot="mobile-overlay-backdrop"
          className="fixed top-0 right-0 bottom-0 left-0 z-50 bg-black/55 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
          style={viewportStyle}
        />
      </DialogPrimitive.Close>

      <div
        className="pointer-events-none fixed top-0 right-0 bottom-0 left-0 z-50 flex items-end p-2"
        style={viewportStyle}
      >
        <DialogPrimitive.Content
          data-slot="mobile-overlay-content"
          className={cn(
            "pointer-events-auto bg-background w-full max-h-[calc(100%-1rem)] overflow-hidden rounded-2xl border shadow-2xl",
            "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 duration-200",
            className
          )}
          {...props}
        >
          {children}
        </DialogPrimitive.Content>
      </div>
    </MobileOverlayPortal>
  );
}

function MobileOverlayHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="mobile-overlay-header"
      className={cn("border-b px-4 py-3", className)}
      {...props}
    />
  );
}

function MobileOverlayBody({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="mobile-overlay-body"
      className={cn("overflow-y-auto px-4 py-3", className)}
      {...props}
    />
  );
}

function MobileOverlayFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="mobile-overlay-footer"
      className={cn("border-t px-4 py-3", className)}
      {...props}
    />
  );
}

function MobileOverlayTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="mobile-overlay-title"
      className={cn("text-base font-semibold", className)}
      {...props}
    />
  );
}

function MobileOverlayDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="mobile-overlay-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

export {
  MobileOverlay,
  MobileOverlayBody,
  MobileOverlayClose,
  MobileOverlayContent,
  MobileOverlayDescription,
  MobileOverlayFooter,
  MobileOverlayHeader,
  MobileOverlayTitle,
  MobileOverlayTrigger,
};
