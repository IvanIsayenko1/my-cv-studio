import { CV } from "@/types/cv";

export async function fetchCVData(id: string): Promise<CV["cvData"] | null> {
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

export async function fetchCVList(): Promise<CV["cvData"][]> {
  const res = await fetch("/api/cv", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    console.error("Failed to fetch CV list:", res.statusText);
    return [];
  }

  const result = await res.json();

  return result as CV["cvData"][];
}
