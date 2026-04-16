"use client";

import { CSSProperties, Suspense } from "react";

import Link from "next/link";
import { useParams } from "next/navigation";

import { ArrowLeftIcon } from "lucide-react";

import { ROUTES } from "@/config/routes";

import { Button } from "../../ui/button";
import { Skeleton } from "../../ui/skeleton";
import CVBuilderTitle from "../cv-builder-title";
import CVStatus from "../cv-status";
import CVBuilderMenu from "./cv-builder-menu";
import CVBuilderMenuSkeleton from "./cv-builder-menu-skeleton";

export default function CVBuilderHeader() {
  const params = useParams();
  const id = params.id as string;
  const stagger = (value: number) => ({ "--stagger": value }) as CSSProperties;

  return (
    <header
      className="sticky top-0 z-50 w-full backdrop-blur-sm"
      aria-label="Site header"
    >
      <div className="mx-auto px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
        <div className="flex items-center justify-between gap-4 sm:gap-6">
          <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-4 md:flex">
            <Button
              asChild
              variant="outline"
              size="icon-lg"
              className="!p-0"
              style={stagger(0)}
            >
              <Link href={ROUTES.CV_LIST} aria-label="Go Back">
                <ArrowLeftIcon aria-hidden="true" />
              </Link>
            </Button>
            <Suspense fallback={<Skeleton className="h-9 w-32" />}>
              <CVBuilderTitle id={id} />
            </Suspense>
          </div>
          <Suspense fallback={<Skeleton className="h-6 w-16" />}>
            <CVStatus id={id} />
          </Suspense>
          <div className="shrink-0">
            <Suspense fallback={<CVBuilderMenuSkeleton />}>
              <CVBuilderMenu id={id} />
            </Suspense>
          </div>
        </div>
      </div>
    </header>
  );
}
