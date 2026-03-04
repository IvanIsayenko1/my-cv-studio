import { CSSProperties } from "react";

export default function CheckerPage() {
  return (
    <section
      className="load-stagger mx-auto w-full max-w-4xl p-4 sm:p-6"
      style={{ "--stagger": 2 } as CSSProperties}
    >
      <div className="flex min-h-[52vh] w-full items-center justify-center rounded-2xl border border-dashed border-border/80 bg-card/40 p-10 text-center">
        <div className="space-y-2">
          <p className="text-xs tracking-[0.18em] uppercase text-muted-foreground">
            ATS Checker
          </p>
          <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Placeholder
          </h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            ATS scan workflow, score breakdown, and improvement suggestions will appear here.
          </p>
        </div>
      </div>
    </section>
  );
}
