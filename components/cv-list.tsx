import CVItem from "./cv-item";
import CVAdd from "./cv-add";
import { CV } from "@/types/cv";

export default function CVList({
  cvList,
}: {
  cvList: (CV["cvData"] & { templateId: string | null })[];
}) {
  return (
    <div className="grid w-full gap-2 p-2 sm:gap-4 sm:p-4 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <CVAdd />
      {cvList.map((cv) => (
        <CVItem cv={cv} />
      ))}
    </div>
  );
}
