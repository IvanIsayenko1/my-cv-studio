import Link from "next/link";

import { Download } from "lucide-react";

import { Button } from "@/components/ui/button";

import { getCompleteCVByShareToken } from "@/lib/db/queries";
import { renderATSCleanPreviewHTML } from "@/lib/pdf/templates/ats-friendly-clean-html";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function SharedCVPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const cv = await getCompleteCVByShareToken(token);

  if (!cv) {
    return (
      <main className="mx-auto flex min-h-[70dvh] max-w-3xl items-center justify-center px-4">
        <div className="rounded-lg border border-border p-6 text-center">
          <h1 className="text-lg font-semibold">Shared CV not available</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            This link is invalid or has been revoked.
          </p>
        </div>
      </main>
    );
  }

  const htmlPreview = renderATSCleanPreviewHTML(cv);

  return (
    <div className="flex flex-col gap-4">
      <section className="mx-auto w-full flex flex-row justify-between max-w-[210mm] overflow-auto rounded-lg">
        <div className="min-w-0">
          <h1 className="truncate text-base font-semibold">
            {cv.cvData.title}
          </h1>
          <p className="text-xs text-muted-foreground">
            Shared CV preview (read-only)
          </p>
        </div>

        <Button asChild>
          <Link href={`/api/share/${token}/download`}>
            <Download />
            Download PDF
          </Link>
        </Button>
      </section>

      <section className="">
        <div className="mx-auto w-full max-w-[210mm] overflow-auto rounded-lg border border-border bg-background shadow-xl">
          <iframe
            title="Shared CV preview"
            srcDoc={htmlPreview}
            className="h-[calc(100vh-13rem)] w-full bg-white p-8"
          />
        </div>
      </section>
    </div>
  );
}
