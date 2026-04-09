import { Suspense } from "react";

import CVList from "@/components/cv/cv-list";
import MakerPageSeleton from "@/components/maker-page-skeleton";

export default function MakerPage() {
  return (
    <Suspense fallback={<MakerPageSeleton />}>
      <CVList />;
    </Suspense>
  );
}
