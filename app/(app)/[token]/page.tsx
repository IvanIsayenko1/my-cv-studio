import { Suspense } from "react";

import Link from "next/link";

import { readFileSync } from "fs";
import { Download } from "lucide-react";

import CVPreview from "@/components/cv/cv-preview";
import CVPreviewSkeleton from "@/components/cv/cv-preview-skeleton";
import PageContent from "@/components/layout/page-content";
import { Button } from "@/components/ui/button";

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
      <main className="mx-auto flex min-h-[70dvh] max-w-3xl items-center justify-center px-4">
        <div className="border-border rounded-lg border p-6 text-center">
          <h1 className="text-lg font-semibold">Shared CV not available</h1>
          <p className="text-muted-foreground mt-2 text-sm">
            This link is invalid or has been revoked.
          </p>
        </div>
      </main>
    );
  }

  return (
    <PageContent className="mb-4 flex flex-col gap-2">
      <section className="mx-auto flex w-full max-w-[210mm] flex-row justify-between overflow-auto rounded-lg">
        <div>
          <p className="text-muted-foreground text-sm">Shared CV</p>
        </div>
        <Button asChild>
          <Link href={`/api/share/${token}/download`}>
            <Download />
            Download PDF
          </Link>
        </Button>
      </section>

      <Suspense fallback={<CVPreviewSkeleton />}>
        <CVPreview id={cv.cvId} fontDataUri={CV_FONT_DATA_URI} />
      </Suspense>
    </PageContent>
  );
}
