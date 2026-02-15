import { TemplateFormValues } from "@/types/template";

export async function fetchTemplate(
  cvId: string
): Promise<TemplateFormValues | null> {
  const res = await fetch(`/api/cv/${cvId}/template`);
  if (!res.ok) return null;
  return res.json();
}

export async function postTemplate(cvId: string, data: TemplateFormValues) {
  const res = await fetch(`/api/cv/${cvId}/template`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Failed to update template");

  return res.json() as Promise<{ success: boolean }>;
}
