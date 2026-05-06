import { useState } from "react";

import { useParams } from "next/navigation";

import { Save } from "lucide-react";

import { AccordionContent } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { Spinner } from "@/components/ui/spinner";

import { useSaveWorkExperience } from "@/hooks/cv/use-work-experience";

import { CVTailorExperienceSuggestion } from "@/types/ai-tailor-review";

import { WorkExperienceFormValues } from "@/schemas/work-experience";

export default function ExperienceSuggestionContent({
  suggestion,
  workExperienceData,
  index,
  setIsApplying,
  isApplying,
}: {
  suggestion: CVTailorExperienceSuggestion;
  workExperienceData: WorkExperienceFormValues;
  index: number;
  setIsApplying: (isApplying: boolean) => void;
  isApplying: boolean;
}) {
  const cvId = useParams().id as string;

  const { mutate, isPending, isSuccess } = useSaveWorkExperience(cvId);
  const [suggestedContent, setSuggestedContent] = useState(
    suggestion.suggested.trim()
  );

  const handleAccept = () => {
    setIsApplying(true);
    if (!workExperienceData) return;
    const edited = suggestion.suggested.trim();
    const updated = workExperienceData.workExperience.map((role, index) =>
      index === suggestion.roleIndex
        ? { ...role, achievements: edited.trim() }
        : role
    );
    mutate(
      { workExperience: updated },
      {
        onSuccess: () => {
          setIsApplying(false);
        },
        onError: () => {
          setIsApplying(false);
        },
      }
    );
  };

  const workExperienceAchievements =
    workExperienceData?.workExperience[index]?.achievements || "";

  return (
    <AccordionContent className="mb-0 max-h-none space-y-4">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <div className="flex-1">
            <label className="text-muted-foreground mb-1.5 block text-[10px] font-semibold tracking-widest uppercase">
              Current
            </label>
            <RichTextEditor
              value={workExperienceAchievements}
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
              value={suggestedContent}
              onChange={(value) => setSuggestedContent(value)}
              placeholder="Tailored achievements..."
              minHeightClassName="min-h-[120px]"
              disabled={isApplying || isPending || isSuccess}
            />
          </div>
        </div>
        <div className="cv-form-actions">
          <Button
            size="sm"
            className="cv-form-primary-action"
            onClick={() => handleAccept()}
            disabled={isPending || isSuccess || isApplying}
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
    </AccordionContent>
  );
}
