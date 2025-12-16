import { EducationFormValues } from "@/types/education";

export async function fetchEducation(
  cvId: string
): Promise<EducationFormValues | null> {
  const res = await fetch(`/api/cv/${cvId}/education`);
  if (!res.ok) return null;
  return res.json();
}

export async function postEducation(cvId: string, data: EducationFormValues) {
  const res = await fetch(`/api/cv/${cvId}/education`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to update education");
  }

  return res.json() as Promise<{ success: boolean }>;
}
