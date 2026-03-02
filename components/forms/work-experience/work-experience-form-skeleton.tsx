"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function WorkExperienceFormSkeleton({
  collapsed = false,
}: {
  collapsed?: boolean;
}) {
  return (
    <Card>
      <CardHeader className="px-4 sm:px-6">
        <CardTitle className="flex items-center gap-2 my-4">
          <Skeleton className="h-6 w-44" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </CardTitle>
        <CardDescription>
          <Skeleton className="mt-2 h-4 w-80 max-w-full" />
        </CardDescription>
      </CardHeader>
      {!collapsed ? (
        <CardContent className="space-y-8 px-4 sm:px-6">
          {[0, 1].map((i) => (
            <div key={i} className="space-y-4">
              <div className="mb-2 flex justify-between items-start">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-8 rounded-md" />
              </div>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>

              <div className="space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-36 w-full" />
              </div>

              <div className="space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-10 w-full" />
              </div>

              {i === 0 ? <Skeleton className="mt-8 h-px w-full" /> : null}
            </div>
          ))}

          <div className="cv-form-actions">
            <Skeleton className="h-10 w-36" />
            <Skeleton className="h-10 w-24" />
          </div>
        </CardContent>
      ) : null}
    </Card>
  );
}
