import { useState } from "react";

import { useParams } from "next/navigation";

import { Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { Spinner } from "@/components/ui/spinner";

import {
  useSaveSummary,
  useSummarySuspenseQuery,
} from "@/hooks/cv/use-summary";

function plainToHtml(text: string) {
  if (!text.trim()) return "";
  return text
    .split(/\n\n+/)
    .filter(Boolean)
    .map((p) => `<p>${p.replace(/\n/g, "<br/>")}</p>`)
    .join("");
}

export default function SummarySuggestionCard({
  suggestedSummary,
}: {
  suggestedSummary: string;
}) {
  const cvId = useParams().id as string;
  const { data: summary } = useSummarySuspenseQuery(cvId);
  const { mutate, isPending, isSuccess } = useSaveSummary(cvId);

  const [editedSummary, setEditedSummary] = useState(
    plainToHtml(suggestedSummary)
  );

  const handleAccept = () => {
    if (!editedSummary.trim()) return;
    mutate({ professionalSummary: editedSummary.trim() });
  };

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
              value={summary?.professionalSummary || ""}
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
              disabled={isSuccess}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            size="sm"
            className="cv-form-primary-action"
            onClick={handleAccept}
            disabled={isPending || isSuccess || !editedSummary.trim()}
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
