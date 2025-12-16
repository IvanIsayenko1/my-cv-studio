import CVItem from "./cv-item";
import { A4 } from "./a4";
import CVAdd from "./cv-add";
import { CV } from "@/types/cv";
import { useRouter } from "next/navigation";
import { routes } from "@/const/routes";

export default function CVList({ cvList }: { cvList: CV["cvData"][] }) {
  const router = useRouter();

  return (
    <div className="grid w-full gap-2 p-2 sm:gap-4 sm:p-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      <CVAdd />
      {cvList.map((cv) => (
        <A4
          key={cv.id}
          onClick={() => router.push(routes.cvDetail.replace(":id", cv.id))}
        >
          <CVItem cv={cv} />
        </A4>
      ))}
    </div>
  );
}
