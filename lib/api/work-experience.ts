import { WorkExperienceFormValues } from "@/types/work-experience";

export async function fetchWorkExperience(
  cvId: string
): Promise<WorkExperienceFormValues | null> {
  const res = await fetch(`/api/cv/${cvId}/work-experience`);
  if (!res.ok) return null;
  return res.json();
}

export async function postWorkExperience(
  cvId: string,
  workExperience: WorkExperienceFormValues
) {
  const res = await fetch(`/api/cv/${cvId}/work-experience`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(workExperience),
  });

  if (!res.ok) {
    throw new Error("Failed to update work experience");
  }

  return res.json() as Promise<{ success: boolean }>;
}
