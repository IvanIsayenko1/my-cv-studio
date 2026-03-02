import { LanguagesFormValues } from "@/schemas/languages";

export async function getLanguages(
  cvId: string
): Promise<LanguagesFormValues | null> {
  const res = await fetch(`/api/cv/${cvId}/languages`);
  if (!res.ok) return null;
  return res.json();
}

export async function postLanguages(cvId: string, data: LanguagesFormValues) {
  const res = await fetch(`/api/cv/${cvId}/languages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to update languages");
  }

  return res.json() as Promise<{ success: boolean }>;
}
