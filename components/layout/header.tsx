import { CSSProperties } from "react";

import Link from "next/link";

import { ROUTES } from "@/config/routes";

import ResponsiveHeader from "../header/responsive-header";

export default function Header() {
  return (
    <header
      className="load-stagger sticky top-0 z-50 w-full backdrop-blur-3xl"
      style={{ "--stagger": 0 } as CSSProperties}
      aria-label="Site header"
    >
      <div className="container mx-auto max-w-7xl px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
        <div className="flex items-center justify-between gap-4 sm:gap-6 h-14">
          {/* Left: Branding/Title */}
          <div className="shrink-0">
            <Link href={ROUTES.HOME} aria-label="Go to mycvstudio home page">
              <p className="font-display text-xl leading-none font-normal tracking-tight sm:text-2xl">
                my<span className="font-bold">cv</span>studio
              </p>
            </Link>
          </div>

          <div className="min-w-0 flex flex-1 justify-end">
            <ResponsiveHeader />
          </div>
        </div>
      </div>
      {/* sharp center line */}
      {/* <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-foreground/20 to-transparent" /> */}

      {/* soft glow under it */}
      {/* <div className="pointer-events-none absolute inset-x-8 -bottom-1 h-3 bg-gradient-to-r from-transparent via-foreground/12 to-transparent blur-md" /> */}
    </header>
  );
}
