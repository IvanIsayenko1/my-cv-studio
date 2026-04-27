import { CSSProperties, Suspense } from "react";

import { useRouter } from "next/navigation";

import { CV } from "@/types/cv";
import { TemplateName } from "@/types/template";

import { ROUTES } from "@/config/routes";

import CVBuilderMenu from "../cv-builder-header/cv-builder-menu";
import CVBuilderMenuSkeleton from "../cv-builder-header/cv-builder-menu-skeleton";
import CVStatus from "../cv-status";

export default function CVItem({
  cv,
  index,
}: {
  cv: CV["cvData"] & { templateId: string | null };
  index: number;
}) {
  const router = useRouter();
  const templateKey = cv.templateId ?? "ats-friendly-clean";
  const templateLabel =
    TemplateName[templateKey as keyof typeof TemplateName] ??
    "Unknown template";
  const createdDate = new Date(cv.createdAt);
  const createdLabel = Number.isNaN(createdDate.getTime())
    ? "Unknown date"
    : new Intl.DateTimeFormat(undefined, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(createdDate);

  const handleCardClick = () => {
    router.push(ROUTES.CV_BUILD.replace(":id", cv.id));
  };

  return (
    <div
      key={cv.id}
      className="load-stagger"
      style={{ "--stagger": index } as CSSProperties}
    >
      <div
        onClick={handleCardClick}
        className="group/card bg-card flex h-full cursor-pointer flex-col gap-3 overflow-hidden rounded-4xl p-4 shadow-sm transition-[box-shadow] duration-300 hover:shadow-md"
      >
        {/* Title */}
        <h4 className="line-clamp-2 text-lg leading-tight font-semibold tracking-tight transition-transform duration-300 group-hover/card:translate-x-0.5 active:scale-[0.96]">
          {cv.title}
        </h4>

        {/* Info Row: Status | Date | Template */}
        <div className="flex flex-wrap items-center gap-2">
          <CVStatus id={cv.id} />
          <span className="text-muted-foreground text-xs">{createdLabel}</span>
          <span className="text-muted-foreground text-xs">{templateLabel}</span>
        </div>

        {/* Action Menu */}
        <div className="mt-auto flex justify-end pt-2" onClick={(e) => e.stopPropagation()}>
          <Suspense fallback={<CVBuilderMenuSkeleton />}>
            <CVBuilderMenu id={cv.id} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
