import { CSSProperties } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

import { CV } from "@/types/cv";
import { TEMPLATE_OPTIONS, TemplateName } from "@/types/template";

import { ROUTES } from "@/config/routes";

import CVItemActions from "../cv-item-actions/cv-item-actions";
import CVStatus from "../cv-status";

export default function CVItem({
  cv,
  index,
}: {
  cv: CV["cvData"] & { templateId: string | null };
  index: number;
}) {
  const router = useRouter();
  const templateKey = cv.templateId ?? "ats-friendly-simple";
  const templateLabel =
    TemplateName[templateKey as keyof typeof TemplateName] ??
    "Unknown template";
  const template = TEMPLATE_OPTIONS.find((t) => t.id === templateKey);

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
      className="load-stagger"
      style={{ "--stagger": index } as CSSProperties}
    >
      <div className="group/card bg-card flex h-full flex-col overflow-hidden rounded-4xl border">
        {/* Template preview thumbnail */}
        {template?.previewSrc && (
          <div className="bg-muted relative h-36 w-full overflow-hidden">
            <Image
              src={template.previewSrc}
              alt={templateLabel}
              fill
              className="object-cover object-top"
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            />
          </div>
        )}

        {/* Card body */}
        <div className="flex flex-1 flex-col gap-3 p-4">
          {/* Title */}
          <h4 className="line-clamp-2 text-lg leading-tight font-semibold tracking-tight">
            {cv.title}
          </h4>

          {/* Info Row: Status | Date | Template */}
          <div className="flex flex-wrap items-center gap-2">
            <CVStatus id={cv.id} />
            <span className="text-muted-foreground text-xs">
              {createdLabel}
            </span>
            <span className="text-muted-foreground text-xs">
              {templateLabel}
            </span>
          </div>

          {/* Action */}
          <div className="mt-auto flex flex-col items-center gap-2 pt-2">
            <CVItemActions id={cv.id} />
            <Button
              variant="secondary"
              onClick={handleCardClick}
              className="h-12 w-full"
            >
              Open
              <ArrowRight />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
