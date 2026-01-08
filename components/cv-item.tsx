import { CV } from "@/types/cv";
import CVMobileDropdownActions from "./cv-mobile-dropdown-actions";
import { A4 } from "./a4";
import { useRouter } from "next/navigation";
import { routes } from "@/const/routes";
import { TemplateName } from "@/types/template";

export default function CVItem({
  cv,
}: {
  cv: CV["cvData"] & { templateId: string | null };
}) {
  const router = useRouter();

  return (
    <A4
      key={cv.id}
      onClick={() => router.push(routes.cvDetail.replace(":id", cv.id))}
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
