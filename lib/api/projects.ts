import { ProjectsFormValues } from "@/types/projects";

export async function fetchProjects(
  cvId: string
): Promise<ProjectsFormValues | null> {
  const res = await fetch(`/api/cv/${cvId}/projects`);

  if (!res.ok) return null;

  return res.json();
}

export async function postProjects(cvId: string, data: ProjectsFormValues) {
  const res = await fetch(`/api/cv/${cvId}/projects`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to update projects");
  }

  return res.json() as Promise<{ success: boolean }>;
}
