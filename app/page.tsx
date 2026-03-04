import { CSSProperties } from "react";

export default function Home() {
  return (
    <section className="load-stagger" style={{ "--stagger": 2 } as CSSProperties}>
      <div className="mx-auto flex min-h-[55vh] w-full max-w-3xl items-center justify-center rounded-2xl border border-dashed border-border/80 bg-card/40 p-10 text-center">
        <div className="space-y-2">
          <p className="text-xs tracking-[0.18em] uppercase text-muted-foreground">
            Main Page
          </p>
          <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Placeholder
          </h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            This area is reserved for future homepage content.
          </p>
        </div>
      </div>
    </section>
  );
}
