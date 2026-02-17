"use client";

import { Suspense } from "react";

import CVList from "@/components/cv/cv-list";
import DashboardSkeleton from "@/components/dashboard-skeleton";

export default function Dashboard() {
  return (
    <div className="flex w-full flex-col gap-4 px-4 sm:px-6 lg:px-8">
      <section>
        <Suspense fallback={<DashboardSkeleton />}>
          <CVList />
        </Suspense>
      </section>
    </div>
  );
}
