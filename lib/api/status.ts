export async function getStatus(cvId: string) {
  const res = await fetch(`/api/cv/${cvId}/status`);

  if (!res.ok) {
    console.error("Failed to fetch cv status:", res.statusText);
    return null;
  }

  return res.json() as Promise<{ isReady: boolean }>;
}
