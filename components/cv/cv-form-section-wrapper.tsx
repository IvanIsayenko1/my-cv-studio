import { ReactNode } from "react";

import { CollapsibleCard } from "../ui/collapsible-card";

export default function SectionWrapper({
  sectionId: id,
  title,
  status,
  children,
  description,
  cvId,
}: {
  status?: ReactNode;
  sectionId: string;
  cvId: string;
  title: string;
  children: ReactNode;
  description?: string;
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
        <div className="flex flex-row gap-2 items-center">
          <h4 className="font-display scroll-m-20 text-xl font-semibold tracking-tight">
            {title}
          </h4>
          <span className="hover:no-underline flex"> {status}</span>
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
