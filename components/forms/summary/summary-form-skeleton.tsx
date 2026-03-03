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
      <CardHeader className="px-4 sm:px-6 gap-2">
        <CardTitle className="flex items-center gap-2">
          <Skeleton className="h-7 w-52" />
          <Skeleton className="h-7 w-24 rounded-full" />
        </CardTitle>
        <CardDescription className="flex flex-col gap-1">
          <Skeleton className="h-4 w-96 max-w-full" />
          <Skeleton className="h-4 w-20 max-w-full" />
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
