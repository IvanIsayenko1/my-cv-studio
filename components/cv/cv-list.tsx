"use client";

import { useCVDataList } from "@/hooks/cv/use-cv";

import PageContent from "../layout/page-content";
import CVAdd from "./cv-add";
import CVItem from "./cv-item/cv-item";

export default function CVList() {
  const { data: cvList } = useCVDataList();

  return (
    <PageContent className="grid h-full grid-cols-1 gap-2 pb-7 sm:grid-cols-1 sm:p-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <CVAdd />
      {cvList.map((cv, index) => (
        <CVItem key={cv.id} cv={cv} index={index + 1} />
      ))}
    </PageContent>
  );
}
