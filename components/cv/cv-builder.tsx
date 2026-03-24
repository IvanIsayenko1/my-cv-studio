"use client";

import { CSSProperties, Suspense } from "react";

import { useParams } from "next/navigation";

import ContentPage from "../layout/content-page";
import CVBuilderForm from "./cv-builder-form";
import CVBuilderHeader from "./cv-builder-header/cv-builder-header";
import CVPreview from "./cv-preview";
import CVPreviewSkeleton from "./cv-preview-skeleton";

export default function CVBuilder() {
  const params = useParams();
  const id = params.id as string;
  const stagger = (value: number) => ({ "--stagger": value }) as CSSProperties;

  return (
    <ContentPage className="flex h-full min-h-0 w-full flex-col gap-2">
      {/* Title, navigations and form actions */}
      <CVBuilderHeader />
      <div className="grid h-full min-h-0 w-full grid-cols-1 gap-2 overflow-hidden lg:grid-cols-2">
        {/* The forms */}
        <CVBuilderForm />

        {/* The preview, hidden on smaller screens to save space */}
        <aside
          className="load-stagger no-scrollbar hidden min-h-0 overflow-y-auto pb-4 lg:block"
          style={stagger(6)}
        >
          <div className="min-h-0">
            <Suspense fallback={<CVPreviewSkeleton />}>
              <CVPreview id={id} />
            </Suspense>
          </div>
        </aside>
      </div>
    </ContentPage>
  );
}
