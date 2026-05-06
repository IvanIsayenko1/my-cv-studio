import { useState } from "react";

import { useParams } from "next/navigation";

import { Save } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { Spinner } from "@/components/ui/spinner";

import {
  useAwardsSuspenseQuery,
  useSaveAwards,
} from "@/hooks/cv/use-awards";

import { CVTailorAwardSuggestion } from "@/types/ai-tailor-review";

export default function AwardSuggestionCard({
  suggestion,
}: {
  suggestion: CVTailorAwardSuggestion;
}) {
  const cvId = useParams().id as string;
  const { data: awardsData } = useAwardsSuspenseQuery(cvId);
  const { mutate, isPending, isSuccess } = useSaveAwards(cvId);

  const [edited, setEdited] = useState(suggestion.suggested);

  const awards = awardsData?.awards ?? [];
  const currentAward = awards[suggestion.awardIndex];

  const handleAccept = () => {
    if (!edited.trim() || !currentAward) return;
    const updated = awards.map((award, index) =>
      index === suggestion.awardIndex
        ? { ...award, description: edited.trim() }
        : award
    );
    mutate({ awards: updated });
  };

  return (
    <Card className="m-[1px]">
      <CardContent className="flex flex-col gap-4 p-5">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-muted-foreground text-[10px] font-semibold tracking-widest uppercase">
            Suggested award polish
          </p>
          {suggestion.issues.length > 0 && (
            <Badge variant="outline" className="text-xs font-normal">
              {suggestion.issues.length} issue
              {suggestion.issues.length > 1 ? "s" : ""} found
            </Badge>
          )}
        </div>

        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
          {suggestion.awardName || `Award ${suggestion.awardIndex + 1}`}
        </h4>

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
              value={currentAward?.description || ""}
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
              placeholder="Polished description..."
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
