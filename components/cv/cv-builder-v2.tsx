"use client";

import { CSSProperties, Suspense } from "react";

import Link from "next/link";
import { useParams } from "next/navigation";

import { ArrowLeftIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { ROUTES } from "@/config/routes";

import PageContent from "../layout/page-content";
import CVBuilderForm from "./cv-builder-form";
import CVBuilderFormSkeleton from "./cv-builder-form-skeleton";
import CVBuilderMenu from "./cv-builder-header/cv-builder-menu";
import CVBuilderMenuSkeleton from "./cv-builder-header/cv-builder-menu-skeleton";
import CVBuilderTitle from "./cv-builder-title";
import CVPreview from "./cv-preview";
import CVPreviewSkeleton from "./cv-preview-skeleton";
import CVStatus from "./cv-status";

export default function CVBuilderV2({ fontDataUri }: { fontDataUri: string }) {
  const params = useParams();
  const id = params.id as string;
  const stagger = (value: number) => ({ "--stagger": value }) as CSSProperties;

  return (
    <PageContent className="flex h-full flex-col overflow-hidden">
      <div className="load-stagger bg-background flex-none" style={stagger(1)}>
        <div className="container mx-auto flex items-center gap-3 px-4 sm:gap-4 sm:px-6 lg:px-8">
          {/* Back to CV list */}
          <Button
            asChild
            variant="outline"
            size="icon-lg"
            className="shrink-0 !p-0"
            style={stagger(0)}
          >
            <Link href={ROUTES.MAKER} aria-label="Back to CV list">
              <ArrowLeftIcon aria-hidden="true" />
            </Link>
          </Button>

          <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
            <Suspense fallback={<Skeleton className="h-8 w-40" />}>
              <CVBuilderTitle id={id} />
            </Suspense>
            <Suspense fallback={<Skeleton className="h-6 w-16 shrink-0" />}>
              <CVStatus id={id} />
            </Suspense>
          </div>

          <div className="shrink-0">
            <Suspense fallback={<CVBuilderMenuSkeleton />}>
              <CVBuilderMenu id={id} />
            </Suspense>
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-hidden">
        <div className="container mx-auto mt-2 flex h-full gap-2 px-4 sm:px-6 lg:px-8">
          {/* Form panel */}
          <div
            className="no-scrollbar load-stagger min-h-0 w-full flex-1 overflow-y-auto pb-2"
            style={stagger(2)}
          >
            <Suspense fallback={<CVBuilderFormSkeleton />}>
              <CVBuilderForm />
            </Suspense>
          </div>

          {/* Preview panel — desktop (lg+) only */}
          <aside
            className="no-scrollbar load-stagger hidden min-h-0 flex-1 overflow-y-auto pb-6 lg:block"
            style={stagger(6)}
          >
            <Suspense fallback={<CVPreviewSkeleton />}>
              <CVPreview id={id} fontDataUri={fontDataUri} />
            </Suspense>
          </aside>
        </div>
      </div>
    </PageContent>
  );
}
