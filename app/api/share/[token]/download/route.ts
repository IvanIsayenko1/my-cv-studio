import { NextRequest, NextResponse } from "next/server";

import { getCompleteCVByShareToken } from "@/lib/db/queries";
import { generateHTMLCVPDF } from "@/lib/pdf/html-generator";

export const runtime = "nodejs";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ token: string }> }
) {
  const { token } = await context.params;

  try {
    const cv = await getCompleteCVByShareToken(String(token));
    if (!cv) {
      return NextResponse.json(
        { error: "Shared CV not found or revoked" },
        { status: 404 }
      );
    }

    const pdfBuffer = await generateHTMLCVPDF(cv);

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Cache-Control": "no-store",
        "Content-Disposition": `attachment; filename="${cv.cvData.title
          .toLowerCase()
          .replace(/\s+/g, "-")}.pdf"`,
        "Content-Length": pdfBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error("Shared CV PDF generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}
