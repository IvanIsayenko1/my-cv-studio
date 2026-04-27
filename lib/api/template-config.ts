import { TemplateConfigFormValues } from "@/schemas/template-config";

export async function fetchTemplateConfig(
  cvId: string
): Promise<TemplateConfigFormValues | null> {
  const res = await fetch(`/api/cv/${cvId}/template-config`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) return null;
  return res.json();
}

export async function postTemplateConfig(
  cvId: string,
  data: TemplateConfigFormValues
) {
  const res = await fetch(`/api/cv/${cvId}/template-config`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Failed to update template config");

  return res.json() as Promise<{ success: boolean }>;
}
