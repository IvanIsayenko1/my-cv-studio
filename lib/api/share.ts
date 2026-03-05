export interface ShareInfoResponse {
  isShared: boolean;
  token: string | null;
  url: string | null;
}

export async function getShareInfo(cvId: string): Promise<ShareInfoResponse> {
  const res = await fetch(`/api/cv/${cvId}/share`, {
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch share info");
  }

  return res.json();
}

export async function createShareLink(
  cvId: string,
  regenerate = false
): Promise<ShareInfoResponse> {
  const res = await fetch(`/api/cv/${cvId}/share`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ regenerate }),
  });

  if (!res.ok) {
    throw new Error("Failed to create share link");
  }

  return res.json();
}

export async function revokeShareLink(cvId: string): Promise<{ success: true }> {
  const res = await fetch(`/api/cv/${cvId}/share`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Failed to revoke share link");
  }

  return res.json();
}
