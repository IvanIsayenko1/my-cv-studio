import { SkillsFormValues } from "@/types/skills";

export async function getSkills(
  cvId: string
): Promise<SkillsFormValues | null> {
  const res = await fetch(`/api/cv/${cvId}/skills`);
  if (!res.ok) return null;
  return res.json();
}

export async function postSkills(cvId: string, data: SkillsFormValues) {
  const res = await fetch(`/api/cv/${cvId}/skills`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to update skills");
  }

  return res.json() as Promise<{ success: boolean }>;
}
