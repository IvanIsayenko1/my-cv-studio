"use client";

import { CSSProperties, Suspense } from "react";

import { useParams } from "next/navigation";

import CVBuilderForm from "./cv-builder-form";
import CVBuilderFormSkeleton from "./cv-builder-form-skeleton";
import CVPreview from "./cv-preview";
import CVPreviewSkeleton from "./cv-preview-skeleton";

export default function CVBuilder({ fontDataUri }: { fontDataUri: string }) {
  const params = useParams();
  const id = params.id as string;
  const stagger = (value: number) => ({ "--stagger": value }) as CSSProperties;

  return (
    <div className="min-h-0 flex-1 overflow-hidden">
      <div className="container mx-auto flex h-full gap-2 px-4 sm:px-6 lg:px-8">
        {/* Form panel */}
        <div
          className="no-scrollbar load-stagger min-h-0 w-full flex-1 overflow-y-auto"
          style={stagger(2)}
        >
          <Suspense fallback={<CVBuilderFormSkeleton />}>
            <CVBuilderForm />
          </Suspense>
        </div>

        {/* Preview panel — desktop (lg+) only */}
        <aside
          className="no-scrollbar load-stagger hidden min-h-0 flex-1 overflow-y-auto pb-4 lg:block"
          style={stagger(6)}
        >
          <Suspense fallback={<CVPreviewSkeleton />}>
            <CVPreview id={id} fontDataUri={fontDataUri} />
          </Suspense>
        </aside>
      </div>
    </div>
  );
}
