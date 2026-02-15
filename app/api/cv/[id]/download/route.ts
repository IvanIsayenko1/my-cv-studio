import { NextRequest, NextResponse } from "next/server";

import { auth } from "@clerk/nextjs/server";

import { getCompleteCV } from "@/lib/db/queries";
import { generateCVPDF } from "@/lib/pdf/cv-generator";

export const runtime = "nodejs";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const cvId = String(id);

  try {
    // Fetch complete CV
    const cv = await getCompleteCV(cvId);
    if (!cv) {
      return NextResponse.json({ error: "CV not found" }, { status: 404 });
    }

    // Generate PDF
    const pdfBuffer = await generateCVPDF(cv);

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${cv.cvData.title
          .toLowerCase()
          .replace(/\s+/g, "-")}.pdf"`,
        "Content-Length": pdfBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error("CV PDF generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}
