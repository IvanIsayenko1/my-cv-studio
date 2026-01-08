import { CV } from "@/types/cv";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export async function fetchCV(id: string): Promise<CV | null> {
  const res = await fetch(`/api/cv/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    console.error("Failed to fetch CV data:", res.statusText);
    return null;
  }
  if (res.status === 404) {
    console.error("CV not found:", id);
    return null;
  }

  const result = await res.json();

  return result as CV;
}

export async function fetchCVList(): Promise<
  (CV["cvData"] & { templateId: string | null })[]
> {
  const res = await fetch("/api/cv", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    console.error("Failed to fetch CV list:", res.statusText);
    return [];
  }

  const result = await res.json();

  return result as (CV["cvData"] & { templateId: string | null })[];
}

export function useUpdateCVTitle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, title }: { id: string; title: string }) => {
      const res = await fetch(`/api/cv/${id}/title`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
      if (!res.ok) throw new Error("Failed to update title");
      return res.json();
    },
    onSuccess: (data, { id, title }) => {
      queryClient.setQueryData(["cv", id], (old: CV | undefined) =>
        old ? { ...old, cvData: { ...old.cvData, title } } : old
      );

      queryClient.invalidateQueries({ queryKey: ["cv-data", id] });
      queryClient.invalidateQueries({ queryKey: ["cvs"] });
    },
  });
}

export async function fetchDuplicateCV(
  id: string,
  title: string
): Promise<boolean> {
  const res = await fetch(`/api/cv/${id}/duplicate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || res.statusText);
  }

  return res.json();
}

export async function fetchDeleteCV(id: string): Promise<boolean> {
  const res = await fetch(`/api/cv/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || res.statusText);
  }

  return res.json();
}
