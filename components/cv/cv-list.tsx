"use client";

import { useCVList } from "@/hooks/cv/use-cv";

import CVAdd from "./cv-add";
import CVItem from "./cv-item/cv-item";

export default function CVList() {
  const { data: cvList } = useCVList();

  return (
    <div className="grid w-full gap-4 p-2 sm:gap-5 sm:p-4 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <CVAdd />
      {cvList.map((cv, index) => (
        <CVItem key={cv.id} cv={cv} index={index + 1} />
      ))}
    </div>
  );
}
