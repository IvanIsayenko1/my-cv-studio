"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function PersonalInfoFormSkeleton({
  collapsed = false,
}: {
  collapsed?: boolean;
}) {
  return (
    <Card className="p-0 gap-0">
      <CardHeader className="px-4 py-6 gap-2 sm:px-6">
        <CardTitle className="flex items-center gap-2">
          <Skeleton className="h-7 w-52" />
          <Skeleton className="h-7 w-24 rounded-full" />
        </CardTitle>
        <CardDescription>
          <Skeleton className="h-4 w-96 max-w-full" />
        </CardDescription>
      </CardHeader>
      {!collapsed ? (
        <CardContent className="space-y-6 pt-4 pb-6 px-4 sm:px-6">
          {/* Name row */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-[14px] w-32" />
              <Skeleton className="h-9 w-full" />
            </div>
            <div className="flex flex-col gap-2">
              <Skeleton className="h-[14px] w-32" />
              <Skeleton className="h-9 w-full" />
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Skeleton className="h-[14px] w-32" />
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-5 w-56" />
          </div>

          {/* Contact row */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="space-y-2">
              <Skeleton className="h-[14px] w-32" />
              <Skeleton className="h-9 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-[14px] w-32" />
              <Skeleton className="h-9 w-full" />
            </div>
          </div>

          {/* Location row */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="space-y-2">
              <Skeleton className="h-[14px] w-32" />
              <Skeleton className="h-9 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-[14px] w-32" />
              <Skeleton className="h-9 w-full" />
            </div>
          </div>

          {/* Professional links */}
          <div className="space-y-4 rounded-lg border border-border/70 bg-muted/20 p-4">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-4 w-80 max-w-full" />

            <div className="space-y-3 rounded-md border border-border/70 p-3">
              <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_2fr_auto]">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="flex items-end">
                  <Skeleton className="h-10 w-10 rounded-md" />
                </div>
              </div>
            </div>

            <Skeleton className="h-10 w-40" />
          </div>

          <div className="cv-form-actions">
            <Skeleton className="h-10 w-24" />
          </div>
        </CardContent>
      ) : null}
    </Card>
  );
}
