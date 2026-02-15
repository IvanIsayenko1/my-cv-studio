"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function SummaryFormSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-6 w-48" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-4 w-64" />
        <Skeleton className="h-24 w-full" />
        <div className="flex justify-end">
          <Skeleton className="h-9 w-20" />
        </div>
      </CardContent>
    </Card>
  );
}
