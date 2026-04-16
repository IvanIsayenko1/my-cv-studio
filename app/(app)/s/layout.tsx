"use client";

import { CSSProperties } from "react";

import Link from "next/link";
import { useParams } from "next/navigation";

import { Download } from "lucide-react";

import { Button } from "@/components/ui/button";

import { ROUTES } from "@/config/routes";

export default function Layout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const token = params.token as string;
  return (
    <>
      <header
        className="sticky top-0 z-50 w-full backdrop-blur-sm"
        aria-label="Site header"
      >
        <div className="mx-auto px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
          <div className="flex items-center justify-between gap-4 sm:gap-6">
            {/* Left: Branding/Title */}
            <div className="shrink-0">
              <Link href={ROUTES.HOME} aria-label="Go to mycvstudio home page">
                <p className="font-display text-xl leading-none font-normal tracking-tight sm:text-2xl">
                  my<span className="font-bold">cv</span>studio
                </p>
              </Link>
            </div>

            <div className="flex min-w-0 flex-1 justify-end">
              <Button asChild>
                <Link href={`/api/share/${token}/download`}>
                  <Download />
                  Download PDF
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>
      <main
        className="load-stagger flex h-[calc(100dvh_-_4.5rem)] w-full"
        style={{ "--stagger": 1 } as CSSProperties}
      >
        {children}
      </main>
    </>
  );
}
