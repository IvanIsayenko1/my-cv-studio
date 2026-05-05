import { useEffect, useState } from "react";

import { Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { Spinner } from "@/components/ui/spinner";

import { CVTailorReview } from "@/types/ai-tailor-review";

function plainToHtml(text: string) {
  if (!text.trim()) return "";
  return text
    .split(/\n\n+/)
    .filter(Boolean)
    .map((p) => `<p>${p.replace(/\n/g, "<br/>")}</p>`)
    .join("");
}

export default function SummarySuggestionCard({
  currentSummary,
  review,
  isApplying,
  isApplied,
  onAccept,
}: {
  currentSummary: string;
  review: CVTailorReview;
  isApplying: boolean;
  isApplied: boolean;
  onAccept: (value: string) => void;
}) {
  const [editedSummary, setEditedSummary] = useState(
    plainToHtml(review.suggestedSummary)
  );

  useEffect(() => {
    setEditedSummary(plainToHtml(review.suggestedSummary));
  }, [review.suggestedSummary]);

  return (
    <Card className="m-[1px]">
      <CardContent className="flex flex-col gap-4 p-5">
        <div>
          <p className="text-muted-foreground text-[10px] font-semibold tracking-widest uppercase">
            Suggested professional summary
          </p>
          <p className="text-muted-foreground mt-2 text-sm">
            Tailored to match the role requirements while preserving your actual
            experience.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex-1">
            <label className="text-muted-foreground mb-1.5 block text-[10px] font-semibold tracking-widest uppercase">
              Current summary
            </label>
            <RichTextEditor
              value={currentSummary}
              onChange={() => {}}
              disabled
              placeholder="(empty)"
              minHeightClassName="min-h-[120px]"
            />
          </div>
          <div className="flex-1">
            <label className="text-muted-foreground mb-1.5 block text-[10px] font-semibold tracking-widest uppercase">
              New summary
            </label>
            <RichTextEditor
              value={editedSummary}
              onChange={setEditedSummary}
              placeholder="Your tailored professional summary..."
              minHeightClassName="min-h-[120px]"
              disabled={isApplied}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            size="sm"
            className="cv-form-primary-action"
            onClick={() => onAccept(editedSummary)}
            disabled={isApplying || isApplied || !editedSummary.trim()}
          >
            {isApplying ? (
              <>
                <Spinner />
                Applying...
              </>
            ) : isApplied ? (
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
