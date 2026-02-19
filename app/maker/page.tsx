"use client";

import dynamic from "next/dynamic";

import MakerPageSeleton from "@/components/maker-page-skeleton";

const CVList = dynamic(() => import("@/components/cv/cv-list"), {
  ssr: false,
  loading: () => <MakerPageSeleton />,
});

export default function MakerPage() {
  return (
    <div className="flex w-full flex-col gap-4 px-4 sm:px-6 lg:px-8">
      <section>
        <CVList />
      </section>
    </div>
  );
}
