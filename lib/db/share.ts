import { randomBytes, randomUUID } from "crypto";

import { db } from "@/lib/db/client";

export interface ShareRecord {
  id: string;
  cvId: string;
  token: string;
  createdBy: string;
  createdAt: string;
  revokedAt: string | null;
}

let shareTableInitialized = false;

export async function ensureShareTable() {
  if (shareTableInitialized) return;

  await db.execute(`
    CREATE TABLE IF NOT EXISTS cv_shares (
      id TEXT PRIMARY KEY,
      cv_id TEXT NOT NULL,
      token TEXT NOT NULL UNIQUE,
      created_by TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      revoked_at TEXT,
      FOREIGN KEY(cv_id) REFERENCES cvs(id) ON DELETE CASCADE
    )
  `);

  await db.execute(
    "CREATE INDEX IF NOT EXISTS idx_cv_shares_cv_id ON cv_shares(cv_id)"
  );
  await db.execute(
    "CREATE INDEX IF NOT EXISTS idx_cv_shares_token ON cv_shares(token)"
  );

  shareTableInitialized = true;
}

function createShareToken(): string {
  return randomBytes(18).toString("base64url");
}

function mapShareRow(row: any): ShareRecord {
  return {
    id: row.id as string,
    cvId: row.cv_id as string,
    token: row.token as string,
    createdBy: row.created_by as string,
    createdAt: row.created_at as string,
    revokedAt: (row.revoked_at as string) ?? null,
  };
}

export async function getActiveShareByCVId(cvId: string) {
  await ensureShareTable();
  const result = await db.execute(
    `
      SELECT id, cv_id, token, created_by, created_at, revoked_at
      FROM cv_shares
      WHERE cv_id = ? AND revoked_at IS NULL
      ORDER BY created_at DESC
      LIMIT 1
    `,
    [cvId]
  );

  if (!result.rows.length) return null;
  return mapShareRow(result.rows[0]);
}

export async function createOrReuseShare(opts: {
  cvId: string;
  userId: string;
  regenerate?: boolean;
}) {
  const { cvId, userId, regenerate = false } = opts;
  await ensureShareTable();

  if (!regenerate) {
    const existing = await getActiveShareByCVId(cvId);
    if (existing) return existing;
  }

  await db.execute(
    `
      UPDATE cv_shares
      SET revoked_at = CURRENT_TIMESTAMP
      WHERE cv_id = ? AND revoked_at IS NULL
    `,
    [cvId]
  );

  const share: ShareRecord = {
    id: randomUUID(),
    cvId,
    token: createShareToken(),
    createdBy: userId,
    createdAt: new Date().toISOString(),
    revokedAt: null,
  };

  await db.execute(
    `
      INSERT INTO cv_shares (id, cv_id, token, created_by)
      VALUES (?, ?, ?, ?)
    `,
    [share.id, share.cvId, share.token, share.createdBy]
  );

  return getActiveShareByCVId(cvId);
}

export async function revokeActiveShare(cvId: string) {
  await ensureShareTable();
  await db.execute(
    `
      UPDATE cv_shares
      SET revoked_at = CURRENT_TIMESTAMP
      WHERE cv_id = ? AND revoked_at IS NULL
    `,
    [cvId]
  );
}

export async function getActiveShareByToken(token: string) {
  await ensureShareTable();
  const result = await db.execute(
    `
      SELECT id, cv_id, token, created_by, created_at, revoked_at
      FROM cv_shares
      WHERE token = ? AND revoked_at IS NULL
      LIMIT 1
    `,
    [token]
  );

  if (!result.rows.length) return null;
  return mapShareRow(result.rows[0]);
}
