import { CSSProperties, Suspense } from "react";

import Link from "next/link";

import { A4 } from "@/components/shared/a4";

import { CV } from "@/types/cv";
import { TemplateName } from "@/types/template";

import { ROUTES } from "@/config/routes";

import CVFormMenu from "../cv-form-menu/cv-form-menu";
import CVFormMenuSkeleton from "../cv-form-menu/cv-form-menu-skeleton";

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
      className="load-stagger card-hover-surprise"
      style={{ "--stagger": index } as CSSProperties}
    >
      <div className="flex h-full flex-col gap-2">
        <Link
          href={ROUTES.CV_DETAIL.replace(":id", cv.id)}
          className="group/card flex h-full flex-col rounded-md border border-border/70 transition-colors duration-300 hover:border-foreground/25"
        >
          <div className="flex h-full flex-col justify-between p-3 sm:p-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground transition-colors duration-300 group-hover/card:text-foreground/70">
                CV
              </p>
              <h4 className="mt-2 line-clamp-2 text-sm font-medium leading-tight transition-transform duration-300 group-hover/card:translate-x-0.5">
                {cv.title}
              </h4>
            </div>

            <div className="scroll-reveal space-y-1 text-xs text-muted-foreground">
              <p>{createdLabel}</p>
              <p>{templateLabel}</p>
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
