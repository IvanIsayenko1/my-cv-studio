import { useState } from "react";

import { useParams } from "next/navigation";

import { Save } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { Spinner } from "@/components/ui/spinner";

import {
  useSaveWorkExperience,
  useWorkExperienceSuspenseQuery,
} from "@/hooks/cv/use-work-experience";

import { CVTailorExperienceSuggestion } from "@/types/ai-tailor-review";

export default function ExperienceSuggestionCard({
  suggestion,
}: {
  suggestion: CVTailorExperienceSuggestion;
}) {
  const cvId = useParams().id as string;
  const { data: workExperienceData } = useWorkExperienceSuspenseQuery(cvId);
  const { mutate, isPending, isSuccess } = useSaveWorkExperience(cvId);

  const [edited, setEdited] = useState(suggestion.suggested);

  const currentRole = workExperienceData?.workExperience[suggestion.roleIndex];

  const handleAccept = () => {
    if (!edited.trim() || !workExperienceData) return;
    const updated = workExperienceData.workExperience.map((role, index) =>
      index === suggestion.roleIndex
        ? { ...role, achievements: edited.trim() }
        : role
    );
    mutate({ workExperience: updated });
  };

  const roleLabel = suggestion.jobTitle
    ? `${suggestion.jobTitle}${suggestion.company ? ` at ${suggestion.company}` : ""}`
    : `Role ${suggestion.roleIndex + 1}`;

  return (
    <Card className="m-[1px]">
      <CardContent className="flex flex-col gap-4 p-5">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-muted-foreground text-[10px] font-semibold tracking-widest uppercase">
            Suggested achievements
          </p>
          {suggestion.issues.length > 0 && (
            <Badge variant="outline" className="text-xs font-normal">
              {suggestion.issues.length} issue
              {suggestion.issues.length > 1 ? "s" : ""} found
            </Badge>
          )}
        </div>

        <p className="text-sm font-medium">{roleLabel}</p>

        {suggestion.keyImprovements?.length > 0 && (
          <div className="flex flex-col gap-1.5">
            <p className="text-muted-foreground text-[10px] font-semibold tracking-widest uppercase">
              Changes made
            </p>
            <ul className="list-inside list-disc text-sm leading-relaxed">
              {suggestion.keyImprovements.map((imp, i) => (
                <li key={i} className="text-muted-foreground">
                  {imp}
                </li>
              ))}
            </ul>
          </div>
        )}

        {suggestion.issues.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {suggestion.issues.map((issue, i) => (
              <Badge
                key={i}
                variant="destructive"
                className="text-xs font-normal"
              >
                {issue}
              </Badge>
            ))}
          </div>
        )}

        <div className="flex flex-col gap-2">
          <div className="flex-1">
            <label className="text-muted-foreground mb-1.5 block text-[10px] font-semibold tracking-widest uppercase">
              Current
            </label>
            <RichTextEditor
              value={currentRole?.achievements || ""}
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
              value={edited}
              onChange={setEdited}
              placeholder="Tailored achievements..."
              minHeightClassName="min-h-[120px]"
              disabled={isSuccess}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            size="sm"
            className="cv-form-primary-action"
            onClick={handleAccept}
            disabled={isPending || isSuccess || !edited.trim()}
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
