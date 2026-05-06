import { useState } from "react";

import { useParams } from "next/navigation";

import { Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

import {
  usePersonalInfoSuspenseQuery,
  useSavePersonalInfo,
} from "@/hooks/cv/use-personal-info";

import { CVTailorTitleSuggestion } from "@/types/ai-tailor-review";

import SectionWrapper from "../cv-form-section-wrapper";

export default function TitleSuggestionCard({
  suggestion,
}: {
  suggestion: CVTailorTitleSuggestion;
}) {
  const cvId = useParams().id as string;
  const { data: personalInfo } = usePersonalInfoSuspenseQuery(cvId);
  const { mutate, isPending, isSuccess } = useSavePersonalInfo(cvId);

  const [editedTitle, setEditedTitle] = useState(suggestion.suggested);

  const handleAccept = () => {
    if (!editedTitle.trim() || !personalInfo) return;
    mutate({ ...personalInfo, professionalTitle: editedTitle.trim() });
  };

  return (
    <SectionWrapper
      cvId={cvId}
      sectionId="suggested-title"
      title="Suggested Professional Title"
      description={suggestion.reason}
    >
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <div className="flex-1">
            <label className="text-muted-foreground mb-1.5 block text-[10px] font-semibold tracking-widest uppercase">
              Current
            </label>
            <Input
              value={suggestion.current}
              disabled
              className="pointer-events-none opacity-70"
            />
          </div>
          <div className="flex-1">
            <label className="text-muted-foreground mb-1.5 block text-[10px] font-semibold tracking-widest uppercase">
              New
            </label>
            <Input
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              placeholder="Enter your new professional title..."
              disabled={isSuccess}
            />
          </div>
        </div>
        <div className="cv-form-actions">
          <Button
            size="sm"
            className="cv-form-primary-action"
            onClick={handleAccept}
            disabled={isPending || isSuccess || !editedTitle.trim()}
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
    </SectionWrapper>
  );
}
