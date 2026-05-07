import { useState } from "react";

import { useParams } from "next/navigation";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { useWorkExperienceSuspenseQuery } from "@/hooks/cv/use-work-experience";

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
          </AccordionItem>
        ))}
      </Accordion>
    </SectionWrapper>
  );
}
