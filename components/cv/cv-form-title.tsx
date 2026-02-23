"use client";

import { useCV } from "@/hooks/cv/use-cv";

export default function CVFormTitle({ id }: { id: string }) {
  const { data: cv } = useCV(id);

  return (
    <div className="flex items-start gap-2">
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
        {cv?.title}
      </h3>
    </div>
  );
}
