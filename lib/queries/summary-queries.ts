import { CV } from "@/types/cv";

export async function fetchSummary(
  id: string
): Promise<Pick<CV, "professionalSummary"> | null> {
  const res = await fetch(`/api/cv/${id}/summary`);
  if (!res.ok) return null;
  return res.json();
}

export async function postSummary(
  id: string,
  { professionalSummary }: { professionalSummary: string }
) {
  const res = await fetch(`/api/cv/${id}/summary`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ professionalSummary }),
  });

  if (!res.ok) {
    throw new Error("Failed to update summary");
  }

  return res.json() as Promise<{ success: boolean }>;
}
