import { CV } from "@/types/cv";

export async function postPersonalInfo(cvId: string, data: CV["personalInfo"]) {
  const res = await fetch(`/api/cv/${cvId}/personal-info`, {
    method: "POST",
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    console.error("Failed to post personal info:", res.statusText);
    return null;
  }

  return res.json() as Promise<{ success: boolean }>;
}

export async function getPersonalInfo(cvId: string) {
  const res = await fetch(`/api/cv/${cvId}/personal-info`);

  if (!res.ok) {
    console.error("Failed to fetch personal info:", res.statusText);
    return null;
  }

  return res.json() as Promise<CV["personalInfo"] | null>;
}
