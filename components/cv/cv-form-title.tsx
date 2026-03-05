"use client";

import { useCVData } from "@/hooks/cv/use-cv";

export default function CVFormTitle({ id }: { id: string }) {
  const { data: cv } = useCVData(id);

  return (
    <div className="min-w-0">
      <h3 className="font-display truncate text-xl font-semibold tracking-tight sm:text-2xl">
        {cv?.title ?? "Untitled CV"}
      </h3>
    </div>
  );
}
