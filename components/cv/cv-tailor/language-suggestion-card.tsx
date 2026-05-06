import { useState } from "react";

import { useParams } from "next/navigation";

import { Save } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

import {
  useLanguagesSuspenseQuery,
  useSaveLanguages,
} from "@/hooks/cv/use-languages";

import { CVTailorLanguageSuggestion } from "@/types/ai-tailor-review";

export default function LanguageSuggestionCard({
  suggestion,
}: {
  suggestion: CVTailorLanguageSuggestion;
}) {
  const cvId = useParams().id as string;
  const { data: languagesData } = useLanguagesSuspenseQuery(cvId);
  const { mutate, isPending, isSuccess } = useSaveLanguages(cvId);

  const [editedLanguage, setEditedLanguage] = useState(
    suggestion.suggestedLanguage
  );
  const [editedProficiency, setEditedProficiency] = useState(
    suggestion.suggestedProficiency
  );

  const languages = languagesData?.languages ?? [];
  const currentLanguage = languages[suggestion.languageIndex];

  const handleAccept = () => {
    if (!editedLanguage.trim() || !editedProficiency.trim() || !currentLanguage)
      return;
    const updated = languages.map((lang, index) =>
      index === suggestion.languageIndex
        ? {
            ...lang,
            language: editedLanguage.trim(),
            proficiency: editedProficiency.trim(),
          }
        : lang
    );
    mutate({ languages: updated });
  };

  return (
    <Card className="m-[1px]">
      <CardContent className="flex flex-col gap-4 p-5">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-muted-foreground text-[10px] font-semibold tracking-widest uppercase">
            Suggested language polish
          </p>
          {suggestion.issues.length > 0 && (
            <Badge variant="outline" className="text-xs font-normal">
              {suggestion.issues.length} issue
              {suggestion.issues.length > 1 ? "s" : ""} found
            </Badge>
          )}
        </div>

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

        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-3">
          <div className="flex-1">
            <label className="text-muted-foreground mb-1.5 block text-[10px] font-semibold tracking-widest uppercase">
              Current language
            </label>
            <Input
              value={currentLanguage?.language || ""}
              disabled
              className="pointer-events-none opacity-70"
            />
          </div>
          <div className="flex-1">
            <label className="text-muted-foreground mb-1.5 block text-[10px] font-semibold tracking-widest uppercase">
              New language
            </label>
            <Input
              value={editedLanguage}
              onChange={(e) => setEditedLanguage(e.target.value)}
              placeholder="Language..."
              disabled={isSuccess}
            />
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-3">
          <div className="flex-1">
            <label className="text-muted-foreground mb-1.5 block text-[10px] font-semibold tracking-widest uppercase">
              Current proficiency
            </label>
            <Input
              value={currentLanguage?.proficiency || ""}
              disabled
              className="pointer-events-none opacity-70"
            />
          </div>
          <div className="flex-1">
            <label className="text-muted-foreground mb-1.5 block text-[10px] font-semibold tracking-widest uppercase">
              New proficiency
            </label>
            <Input
              value={editedProficiency}
              onChange={(e) => setEditedProficiency(e.target.value)}
              placeholder="Proficiency..."
              disabled={isSuccess}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            size="sm"
            className="cv-form-primary-action"
            onClick={handleAccept}
            disabled={
              isPending ||
              isSuccess ||
              !editedLanguage.trim() ||
              !editedProficiency.trim()
            }
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
