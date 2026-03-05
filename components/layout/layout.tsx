import { CSSProperties } from "react";

import { ThemeSwitcher } from "@/components/layout/theme-switcher";
import { Toaster } from "@/components/ui/sonner";

import Header from "./header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
      >
        <div className="absolute -top-28 left-[-8%] h-72 w-72 rounded-full bg-primary/10 blur-3xl sm:h-96 sm:w-96" />
        <div className="absolute top-[28%] right-[-10%] h-80 w-80 rounded-full bg-foreground/8 blur-3xl sm:h-[28rem] sm:w-[28rem]" />
        <div className="absolute bottom-[-9rem] left-[30%] h-72 w-72 rounded-full bg-primary/8 blur-3xl sm:h-96 sm:w-96" />
        <div
          className="absolute inset-0 opacity-[0.22] dark:opacity-[0.12]"
          style={{
            backgroundImage:
              "linear-gradient(to right, color-mix(in oklab, var(--foreground) 10%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in oklab, var(--foreground) 10%, transparent) 1px, transparent 1px)",
            backgroundSize: "42px 42px",
          }}
        />
      </div>

      {/* Sticky Header with Actions */}
      <div className="relative z-10">
        <Header />

        {/* Main Content */}
        <main
          className="load-stagger container mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8"
          style={{ "--stagger": 1 } as CSSProperties}
        >
          {children}
        </main>

        <Toaster position="top-center" richColors />
      </div>

      {/* Optional Footer
      <footer className="w-full border-t bg-background">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="h-6 sm:h-8 bg-muted rounded flex items-center justify-center text-muted-foreground text-xs sm:text-sm">
            Footer (Optional)
          </div>
        </div>
      </footer> */}
    </div>
  );
}
