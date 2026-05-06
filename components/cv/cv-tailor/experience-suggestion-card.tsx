import { useState } from "react";

import { useParams } from "next/navigation";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import {
  useSaveWorkExperience,
  useWorkExperienceSuspenseQuery,
} from "@/hooks/cv/use-work-experience";

import { CVTailorExperienceSuggestion } from "@/types/ai-tailor-review";

import SectionWrapper from "../cv-form-section-wrapper";
import ExperienceSuggestionContent from "./experience-suggestion-content";

export default function ExperienceSuggestionCard({
  suggestions,
}: {
  suggestions: CVTailorExperienceSuggestion[];
}) {
  const cvId = useParams().id as string;
  const { data: workExperienceData } = useWorkExperienceSuspenseQuery(cvId);
  const [isApplying, setIsApplying] = useState(false);
  const [openItems, setOpenItems] = useState<string[]>([]);

  const getWorkExperienceTitle = (index: number) => {
    const role = workExperienceData?.workExperience[index];
    return role
      ? `${role.jobTitle}${role.company ? ` at ${role.company}` : ""}`
      : `Role ${index + 1}`;
  };

  return (
    <SectionWrapper
      cvId={cvId}
      sectionId={`suggested-experience`}
      title="Suggested Achievements"
      description="AI-tailored achievements based on the job offer description."
    >
      <Accordion type="multiple" value={openItems} onValueChange={setOpenItems}>
        {suggestions.map((suggestion, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger>{getWorkExperienceTitle(index)}</AccordionTrigger>

            <ExperienceSuggestionContent
              index={index}
              suggestion={suggestion}
              workExperienceData={workExperienceData}
              isApplying={isApplying}
              setIsApplying={setIsApplying}
            />
            {/* <AccordionContent className="mb-0 max-h-none space-y-4">
              <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-4">
                  <div className="flex-1">
                    <label className="text-muted-foreground mb-1.5 block text-[10px] font-semibold tracking-widest uppercase">
                      Current
                    </label>
                    <RichTextEditor
                      value={getWorkExperienceAchievements(index)}
                      onChange={() => {}}
                      disabled
                      placeholder="(empty)"
                      minHeightClassName="min-h-[120px]"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-muted-foreground mb-1.5 block text-[10px] font-semibold tracking-widest uppercase">
                      New
                    </label>
                    <RichTextEditor
                      value={suggestion.suggested.trim()}
                      onChange={() => {}}
                      placeholder="Tailored achievements..."
                      minHeightClassName="min-h-[120px]"
                      disabled={true}
                    />
                  </div>
                </div>
                <div className="cv-form-actions">
                  <Button
                    size="sm"
                    className="cv-form-primary-action"
                    onClick={() => handleAccept(index)}
                    disabled={isPending || isSuccess}
                  >
                    {isPending ? (
                      <>
                        <Spinner />
                        Applying...
                      </>
                    ) : isSuccess ? (
                      "Applied"
                    ) : (
                      <>
                        <Save className="size-4" />
                        Apply change
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </AccordionContent> */}
          </AccordionItem>
        ))}
      </Accordion>
    </SectionWrapper>
  );
}
