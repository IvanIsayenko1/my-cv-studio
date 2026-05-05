import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { CVTailorTitleSuggestion } from "@/types/ai-tailor-review";

export default function TitleSuggestionCard({
  suggestion,
  isApplying,
  isApplied,
  onAccept,
}: {
  suggestion: CVTailorTitleSuggestion;
  isApplying: boolean;
  isApplied: boolean;
  onAccept: () => void;
}) {
  return (
    <Card className="m-[1px]">
      <CardContent className="flex flex-col gap-4 p-5">
        <div>
          <p className="text-muted-foreground text-[10px] font-semibold tracking-widest uppercase">
            Suggested title change
          </p>
          <p className="text-muted-foreground mt-2 text-sm">
            {suggestion.reason}
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch sm:gap-3">
          <div className="flex-1 rounded-lg border bg-muted/40 p-3">
            <p className="text-muted-foreground text-[10px] font-semibold tracking-widest uppercase">
              Current
            </p>
            <p className="mt-1 text-sm font-medium leading-snug">
              {suggestion.current}
            </p>
          </div>
          <div className="flex items-center justify-center sm:px-1">
            <ArrowRight className="text-muted-foreground size-4 rotate-90 sm:rotate-0" />
          </div>
          <div className="flex-1 rounded-lg border border-emerald-200 bg-emerald-50/60 p-3 dark:border-emerald-800 dark:bg-emerald-950/30">
            <p className="text-[10px] font-semibold tracking-widest text-emerald-700 uppercase dark:text-emerald-400">
              Suggested
            </p>
            <p className="mt-1 text-sm font-semibold leading-snug">
              {suggestion.suggested}
            </p>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            size="sm"
            className="cv-form-primary-action"
            onClick={onAccept}
            disabled={isApplying || isApplied}
          >
            {isApplied
              ? "Applied"
              : isApplying
                ? "Applying..."
                : "Apply this title"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
