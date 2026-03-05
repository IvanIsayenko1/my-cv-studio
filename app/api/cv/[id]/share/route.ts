import { NextRequest, NextResponse } from "next/server";

import { auth } from "@clerk/nextjs/server";

import {
  createOrReuseShare,
  getActiveShareByCVId,
  revokeActiveShare,
} from "@/lib/db/share";
import { db } from "@/lib/db/client";

async function ensureOwnership(cvId: string, userId: string) {
  const existing = await db.execute({
    sql: "SELECT id FROM cvs WHERE id = ? AND user_id = ? LIMIT 1",
    args: [cvId, userId],
  });

  return existing.rows.length > 0;
}

function toPayload(origin: string, token: string | null) {
  return {
    isShared: Boolean(token),
    token,
    url: token ? `${origin}/s/${token}` : null,
  };
}

const NO_STORE_HEADERS = { "Cache-Control": "no-store" };

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  if (!(await ensureOwnership(id, userId))) {
    return NextResponse.json({ error: "CV not found" }, { status: 404 });
  }

  const share = await getActiveShareByCVId(id);
  return NextResponse.json(toPayload(req.nextUrl.origin, share?.token ?? null), {
    headers: NO_STORE_HEADERS,
  });
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  if (!(await ensureOwnership(id, userId))) {
    return NextResponse.json({ error: "CV not found" }, { status: 404 });
  }

  const body = await req.json().catch(() => ({}));
  const regenerate = Boolean(body?.regenerate);

  const share = await createOrReuseShare({ cvId: id, userId, regenerate });
  if (!share) {
    return NextResponse.json(
      { error: "Failed to create share link" },
      { status: 500 }
    );
  }

  return NextResponse.json(toPayload(req.nextUrl.origin, share.token), {
    headers: NO_STORE_HEADERS,
  });
}

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  if (!(await ensureOwnership(id, userId))) {
    return NextResponse.json({ error: "CV not found" }, { status: 404 });
  }

  await revokeActiveShare(id);
  return NextResponse.json(
    { success: true },
    {
      headers: NO_STORE_HEADERS,
    }
  );
}
