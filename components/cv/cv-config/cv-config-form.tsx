import { useParams } from "next/navigation";

import { useTemplateConfigSuspenseQuery } from "@/hooks/cv/use-template-config";

import AccentColorForm from "../../forms/accent-color/accent-color-form";
import SectionConfigForm from "../../forms/section-config/section-config-form";

export default function CVConfigForm() {
  const params = useParams();
  const id = params.id as string;

  const { data: configData } = useTemplateConfigSuspenseQuery(id);

  return (
    <div className="no-scrollbar min-h-0 w-full flex-1 space-y-2 overflow-y-auto pb-4">
      <AccentColorForm id={id} configData={configData} />
      <SectionConfigForm id={id} configData={configData} />
    </div>
  );
}
