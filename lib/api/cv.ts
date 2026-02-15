import { useMutation, useQueryClient } from "@tanstack/react-query";

import { CV } from "@/types/cv";

import { QUERY_KEYS } from "../constants/query-keys";

export async function getCV(id: string): Promise<CV["cvData"] | null> {
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

  return result as CV["cvData"];
}

export async function getCVList(): Promise<
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
// TODO: refactor to separate the logic from the API
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
      queryClient.setQueryData([QUERY_KEYS.CV, id], (old: CV | undefined) =>
        old ? { ...old, cvData: { ...old.cvData, title } } : old
      );

      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CV, id] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CV_LIST] });
    },
  });
}

export async function postDuplicateCV(
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

export async function deleteCV(id: string): Promise<boolean> {
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

export async function postCreateCV(
  name: string
): Promise<{ id: string; title: string }> {
  const res = await fetch("/api/cv", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: name }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || res.statusText);
  }

  return res.json();
}
