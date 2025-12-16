import { CertificationsFormValues } from "@/types/certifications";

export async function fetchCertifications(
  cvId: string
): Promise<CertificationsFormValues | null> {
  const res = await fetch(`/api/cv/${cvId}/certifications`);

  if (!res.ok) {
    // return null so the form can fall back to defaultValues
    return null;
  }

  return res.json();
}

export async function postCertifications(
  cvId: string,
  data: CertificationsFormValues
) {
  const res = await fetch(`/api/cv/${cvId}/certifications`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to update certifications");
  }

  // shape: { success: boolean }
  return res.json() as Promise<{ success: boolean }>;
}
