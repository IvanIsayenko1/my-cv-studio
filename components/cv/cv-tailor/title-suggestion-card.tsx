import { useState } from "react";

import { useParams } from "next/navigation";

import { Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

import {
  usePersonalInfoSuspenseQuery,
  useSavePersonalInfo,
} from "@/hooks/cv/use-personal-info";

import { CVTailorTitleSuggestion } from "@/types/ai-tailor-review";

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
    <Card className="m-[1px]">
      <CardContent className="flex flex-col gap-4 p-5">
        <div>
          <p className="text-muted-foreground text-[10px] font-semibold tracking-widest uppercase">
            Suggested professional title
          </p>
          <p className="text-muted-foreground mt-2 text-sm">
            {suggestion.reason}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-3">
          <div className="flex-1">
            <label className="text-muted-foreground mb-1.5 block text-[10px] font-semibold tracking-widest uppercase">
              Current title
            </label>
            <Input
              value={suggestion.current}
              disabled
              className="pointer-events-none opacity-70"
            />
          </div>
          <div className="flex-1">
            <label className="text-muted-foreground mb-1.5 block text-[10px] font-semibold tracking-widest uppercase">
              New title
            </label>
            <Input
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              placeholder="Enter your new professional title..."
              disabled={isSuccess}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button
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
      </CardContent>
    </Card>
  );
}
