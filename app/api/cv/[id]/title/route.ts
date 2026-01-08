// app/api/cv/[id]/title/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

type Params = { params: { id: string } };

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const { id } = params;

    const body = (await req.json()) as { title?: string };
    const title = body.title?.trim();

    if (!title || title.length < 1) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    // Update DB
    await db.execute({
      sql: "UPDATE cvs SET title = ? WHERE id = ?",
      args: [title, id],
    });

    // Optionally read back the row or just echo the new title
    return NextResponse.json({ id, title }, { status: 200 });
  } catch (error) {
    console.error("Error updating CV title:", error);
    return NextResponse.json(
      { error: "Failed to update title" },
      { status: 500 }
    );
  }
}
