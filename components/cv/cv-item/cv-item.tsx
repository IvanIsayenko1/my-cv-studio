import { useRouter } from "next/navigation";

import { A4 } from "@/components/shared/a4";

import { CV } from "@/types/cv";
import { TemplateName } from "@/types/template";

import { ROUTES } from "@/config/routes";

import CVMobileDropdownActions from "../cv-mobile-dropdown-actions";

export default function CVItem({
  cv,
}: {
  cv: CV["cvData"] & { templateId: string | null };
}) {
  const router = useRouter();

  return (
    <A4
      key={cv.id}
      onClick={() => router.push(ROUTES.CV_DETAIL.replace(":id", cv.id))}
    >
      <div className="w-full flex justify-between items-center">
        <CVMobileDropdownActions id={cv.id} isAutoHide={false} />
      </div>

      <p className="leading-7 [&:not(:first-child)]:mt-6">{cv.title}</p>
      <p className="text-sm text-gray-500">
        Created {new Date(cv.createdAt).toLocaleDateString()}
      </p>
      {cv.templateId && (
        <p className="text-sm text-gray-500">
          Template: {TemplateName[cv.templateId as keyof typeof TemplateName]}
        </p>
      )}
    </A4>
  );
}
