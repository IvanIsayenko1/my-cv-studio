"use client";

import CVList from "@/components/cv-list";
import { fetchCVList } from "@/lib/fetches/cv-fetches";
import { useAuth, useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";

export default function Dashboard() {
  const { isLoaded, isSignedIn } = useUser();
  const { isLoaded: authLoaded } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["cv-list"],
    queryFn: () => fetchCVList(),
  });

  if (!isLoaded || !authLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="flex w-full flex-col gap-4 px-4 sm:px-6 lg:px-8">
        Hero page
      </div>
    );
  }

  return isLoading ? (
    <div className="flex min-h-screen items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
    </div>
  ) : (
    <div className="flex w-full flex-col gap-4 px-4 sm:px-6 lg:px-8">
      <section className="">
        <CVList cvList={data || []} />
      </section>
    </div>
  );
}
