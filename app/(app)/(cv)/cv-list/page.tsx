"use client";

import dynamic from "next/dynamic";

import CVListPageSeleton from "@/components/cv-list-page-skeleton";

const CVList = dynamic(() => import("@/components/cv/cv-list"), {
  ssr: false,
  loading: () => <CVListPageSeleton />,
});

export default function MakerPage() {
  return <CVList />;
}
