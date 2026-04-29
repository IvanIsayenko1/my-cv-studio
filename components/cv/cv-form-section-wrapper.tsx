import { EyeOff } from "lucide-react";
import { ReactNode } from "react";

import { Badge } from "../ui/badge";
import { CollapsibleCard } from "../ui/collapsible-card";

export default function SectionWrapper({
  sectionId: id,
  title,
  status,
  children,
  description,
  cvId,
  hiddenInPreview,
}: {
  status?: ReactNode;
  sectionId: string;
  cvId: string;
  title: string;
  children: ReactNode;
  description?: string;
  hiddenInPreview?: boolean;
}) {
  const localStorageKey = `cv-form-closed-sections-${cvId}`;
  const getClosedSections = () => {
    if (typeof window === "undefined") return [];
    return JSON.parse(
      localStorage.getItem(localStorageKey) || "[]"
    ) as string[];
  };
  let isThisSectionClosed = getClosedSections().includes(id);

  const onOpenChangeHandler = (isOpen: boolean) => {
    const closedSections = getClosedSections();

    if (isOpen) {
      // Remove the section ID from the closed sections list
      const newClosedSections = closedSections.filter(
        (sectionId) => sectionId !== id
      );
      localStorage.setItem(localStorageKey, JSON.stringify(newClosedSections));
      return;
    }

    // Add the section ID to the closed sections list
    closedSections.push(id);
    localStorage.setItem(localStorageKey, JSON.stringify(closedSections));
  };

  return (
    <CollapsibleCard
      title={
        <div className="flex flex-row items-center gap-2">
          <h4 className="font-display scroll-m-20 text-xl font-semibold tracking-tight">
            {title}
          </h4>
          <span className="flex items-center gap-2 hover:no-underline">
            {hiddenInPreview && (
              <Badge variant="outline" className="gap-1 text-muted-foreground">
                <EyeOff className="h-3 w-3" />
                Hidden
              </Badge>
            )}
            {status}
          </span>
        </div>
      }
      description={description}
      defaultOpen={!isThisSectionClosed}
      onOpenChange={onOpenChangeHandler}
    >
      <div className="pt-4">{children}</div>
    </CollapsibleCard>
  );
}
