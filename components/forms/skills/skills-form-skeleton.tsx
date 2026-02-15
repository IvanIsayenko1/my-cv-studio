"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function SkillsFormSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-6 w-32" />
        </CardTitle>
        <CardDescription>
          <Skeleton className="h-4 w-64 mt-2" />
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Skills overview block */}
        <div className="space-y-4 border rounded-lg p-4 pb-6">
          <Skeleton className="h-4 w-28" /> {/* "Skills overview" label */}
          {/* Technical textarea */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" /> {/* label */}
            <Skeleton className="h-20 w-full" /> {/* textarea */}
          </div>
          {/* Hard textarea */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-20 w-full" />
          </div>
          {/* Soft textarea */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>

        {/* One or two fake language cards */}
        {[0, 1].map((i) => (
          <div key={i} className="space-y-4 border rounded-lg p-4 pb-6">
            <div className="flex justify-between items-start mb-2">
              <Skeleton className="h-4 w-24" /> {/* "Language 1" */}
              <Skeleton className="h-8 w-8 rounded-full" /> {/* delete icon */}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" /> {/* Language label */}
                <Skeleton className="h-10 w-full" /> {/* input */}
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" /> {/* Proficiency label */}
                <Skeleton className="h-10 w-full" /> {/* select */}
              </div>
            </div>
          </div>
        ))}

        {/* Add another language + Save buttons */}
        <div className="flex justify-between items-center">
          <Skeleton className="h-9 w-40" /> {/* "Add another language" */}
          <Skeleton className="h-9 w-24" /> {/* "Save" */}
        </div>
      </CardContent>
    </Card>
  );
}
