"use client";

import { CSSProperties, Suspense } from "react";

import { useParams } from "next/navigation";

import PageContent from "../layout/page-content";
import CVBuilderForm from "./cv-builder-form";
import CVBuilderFormSkeleton from "./cv-builder-form-skeleton";
import CVBuilderHeader from "./cv-builder-header/cv-builder-header";
import CVPreview from "./cv-preview";
import CVPreviewSkeleton from "./cv-preview-skeleton";

export default function CVBuilder({ fontDataUri }: { fontDataUri: string }) {
  const params = useParams();
  const id = params.id as string;
  const stagger = (value: number) => ({ "--stagger": value }) as CSSProperties;

  return (
    <PageContent className="flex h-full flex-col gap-2">
      {/* Back button, title, status, actions */}
      <CVBuilderHeader />

      {/* Form + Preview — each column scrolls independently */}
      <div className="flex min-h-0 flex-1 gap-2">
        {/* Form — full width on mobile, half on desktop */}
        <Suspense fallback={<CVBuilderFormSkeleton />}>
          <CVBuilderForm />
        </Suspense>

        {/* Preview — hidden on mobile, half on desktop */}
        <aside
          className="load-stagger no-scrollbar hidden min-h-0 flex-1 overflow-y-auto pb-4 lg:block"
          style={stagger(6)}
        >
          <Suspense fallback={<CVPreviewSkeleton />}>
            <CVPreview id={id} fontDataUri={fontDataUri} />
          </Suspense>
        </aside>
      </div>
    </PageContent>
  );
}
