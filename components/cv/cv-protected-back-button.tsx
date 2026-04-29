"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { ArrowLeftIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

import { useUnsavedChangesContext } from "@/lib/contexts/unsaved-changes-context";

interface CVProtectedBackButtonProps {
  href: string;
  className?: string;
}

export function CVProtectedBackButton({
  href,
  className,
}: CVProtectedBackButtonProps) {
  const router = useRouter();
  const { hasUnsavedChanges, setDialogOpen, setPendingNavigation } =
    useUnsavedChangesContext();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (hasUnsavedChanges) {
      e.preventDefault();
      setPendingNavigation({
        href,
        callback: () => router.push(href),
      });
      setDialogOpen(true);
    }
  };

  return (
    <Button asChild variant="outline" size="icon-lg" aria-label="Go Back">
      <Link href={href} onClick={handleClick}>
        <ArrowLeftIcon aria-hidden="true" />
      </Link>
    </Button>
  );
}
