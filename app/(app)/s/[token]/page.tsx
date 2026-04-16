import { Suspense } from "react";

import { readFileSync } from "fs";

import CVPreview from "@/components/cv/cv-preview";
import CVPreviewSkeleton from "@/components/cv/cv-preview-skeleton";
import PageContent from "@/components/layout/page-content";

import { getCVBasicInfoByShareToken } from "@/lib/db/queries";

const CV_FONT_DATA_URI = `data:font/woff2;base64,${readFileSync(
  `${process.cwd()}/public/fonts/Inter.woff2`
).toString("base64")}`;

export default async function SharedCVPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const cv = await getCVBasicInfoByShareToken(token);

  if (!cv) {
    return (
      <PageContent className="flex flex-col gap-2">
        <div className="border-border rounded-lg border p-6 text-center">
          <h1 className="text-lg font-semibold">Shared CV not available</h1>
          <p className="text-muted-foreground mt-2 text-sm">
            This link is invalid or has been revoked.
          </p>
        </div>
      </PageContent>
    );
  }

  return (
    <PageContent className="flex flex-col gap-2">
      <Suspense fallback={<CVPreviewSkeleton />}>
        <div className="py-4">
          <CVPreview id={cv.cvId} fontDataUri={CV_FONT_DATA_URI} />
        </div>
      </Suspense>
    </PageContent>
  );
}
