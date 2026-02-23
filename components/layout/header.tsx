import Link from "next/link";

import { ROUTES } from "@/config/routes";

import ResponsiveHeader from "../header/responsive-header";

export default function Header() {
  return (
    <header
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur"
      aria-label="Site header"
    >
      <div className="container mx-auto max-w-7xl px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
        <div className="flex items-center justify-between gap-4 sm:gap-6">
          {/* Left: Branding/Title */}
          <div className="shrink-0">
            <Link href={ROUTES.HOME} aria-label="Go to mycvstudio home page">
              <p className="text-xl leading-none font-light tracking-tight sm:text-2xl">
                my<span className="font-bold">cv</span>studio
              </p>
            </Link>
          </div>

          <div className="min-w-0 flex flex-1 justify-end">
            <ResponsiveHeader />
          </div>
        </div>
      </div>
    </header>
  );
}
