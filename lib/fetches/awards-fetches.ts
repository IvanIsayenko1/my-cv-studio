import { AwardsFormValues } from "@/types/awards";

export async function fetchAwards(
  cvId: string
): Promise<AwardsFormValues | null> {
  const res = await fetch(`/api/cv/${cvId}/awards`);

  if (!res.ok) return null;

  return res.json();
}

export async function postAwards(cvId: string, data: AwardsFormValues) {
  const res = await fetch(`/api/cv/${cvId}/awards`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to update awards");
  }

  return res.json() as Promise<{ success: boolean }>;
}
