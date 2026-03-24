import { CSSProperties, Suspense } from "react";

import Link from "next/link";

import { A4 } from "@/components/shared/a4";

import { CV } from "@/types/cv";
import { TemplateName } from "@/types/template";

import { ROUTES } from "@/config/routes";

import CVFormMenu from "../cv-form-menu/cv-form-menu";
import CVFormMenuSkeleton from "../cv-form-menu/cv-form-menu-skeleton";
import CVStatus from "../cv-status";

export default function CVItem({
  cv,
  index,
}: {
  cv: CV["cvData"] & { templateId: string | null };
  index: number;
}) {
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

  return (
    <A4
      key={cv.id}
      className="load-stagger"
      style={{ "--stagger": index } as CSSProperties}
    >
      <div className="flex h-full flex-col gap-2">
        <Link
          href={ROUTES.CV_DETAIL.replace(":id", cv.id)}
          className="group/card flex h-full flex-col rounded-md border border-border/70 transition-colors duration-300 hover:border-foreground/25 overflow-hidden"
        >
          <div className="flex h-full flex-col p-4 sm:p-4">
            <div>
              <h4 className="mt-2 line-clamp-3 text-xl font-semibold leading-tight tracking-tight transition-transform duration-300 group-hover/card:translate-x-0.5 sm:text-base sm:font-medium">
                {cv.title}
              </h4>
            </div>

            <div className="mt-2 flex items-center gap-2">
              <CVStatus id={cv.id} />
            </div>

            <div className="scroll-reveal  space-y-1 text-sm text-muted-foreground sm:text-xs mt-4 sm:mt-3">
              <p>{createdLabel}</p>
              <p>{templateLabel}</p>
            </div>

            <div className="mt-4 space-y-2 opacity-35 sm:mt-3 sm:space-y-1.5 sm:opacity-30 ">
              <div className="h-2 w-full bg-border/80" />
              <div className="h-2 w-[92%] bg-border/90" />
              <div className="h-2 w-[86%] bg-border/90" />
              <div className="h-2 w-[94%] bg-border/90" />
              <div className="h-2 w-[78%] bg-border/90" />
            </div>
          </div>
        </Link>

        <div className="flex justify-end sm:justify-center">
          <Suspense fallback={<CVFormMenuSkeleton />}>
            <CVFormMenu id={cv.id} />
          </Suspense>
        </div>
      </div>
    </A4>
  );
}
