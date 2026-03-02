"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function SummaryFormSkeleton({
  collapsed = false,
}: {
  collapsed?: boolean;
}) {
  return (
    <Card>
      <CardHeader className="px-4 sm:px-6">
        <CardTitle className="flex items-center gap-2 my-4">
          <Skeleton className="h-6 w-52" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </CardTitle>
        <CardDescription>
          <Skeleton className="mt-2 h-4 w-[36rem] max-w-full" />
        </CardDescription>
      </CardHeader>
      {!collapsed ? (
        <CardContent className="space-y-6 px-4 sm:px-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-4 w-80 max-w-full" />
          </div>

          <div className="cv-form-actions">
            <Skeleton className="h-10 w-24" />
          </div>
        </CardContent>
      ) : null}
    </Card>
  );
}
