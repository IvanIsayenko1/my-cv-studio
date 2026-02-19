import Link from "next/link";

import { ROUTES } from "@/config/routes";

import ResponsiveHeader from "../header/responsive-header";
import { Button } from "../ui/button";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Left: Branding/Title */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Button variant={"ghost"} asChild>
              <Link href={ROUTES.HOME}>
                <h1 className="text-lg sm:text-xl font-semibold">MyCVStudio</h1>
              </Link>
            </Button>
          </div>

          <ResponsiveHeader />
        </div>
      </div>
    </header>
  );
}
