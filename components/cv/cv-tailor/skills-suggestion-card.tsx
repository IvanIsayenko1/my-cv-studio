import { useState } from "react";

import { useParams } from "next/navigation";

import { Save } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { Spinner } from "@/components/ui/spinner";

import {
  useSaveSkills,
  useSkillsSuspenseQuery,
} from "@/hooks/cv/use-skills";

import { CVTailorSkillsSuggestion } from "@/types/ai-tailor-review";

export default function SkillsSuggestionCard({
  suggestion,
}: {
  suggestion: CVTailorSkillsSuggestion;
}) {
  const cvId = useParams().id as string;
  const { data: skillsData } = useSkillsSuspenseQuery(cvId);
  const { mutate, isPending, isSuccess } = useSaveSkills(cvId);

  const [editedItems, setEditedItems] = useState(suggestion.suggested);
  const [editedName, setEditedName] = useState(suggestion.suggestedName);

  const currentCategory = skillsData?.categories[suggestion.categoryIndex];

  const handleAccept = () => {
    if (!editedItems.trim() || !editedName.trim() || !skillsData) return;
    const updated = skillsData.categories.map((category, index) =>
      index === suggestion.categoryIndex
        ? { name: editedName.trim(), items: editedItems.trim() }
        : category
    );
    mutate({ categories: updated });
  };

  return (
    <Card className="m-[1px]">
      <CardContent className="flex flex-col gap-4 p-5">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-muted-foreground text-[10px] font-semibold tracking-widest uppercase">
            Suggested skill category
          </p>
          {suggestion.issues.length > 0 && (
            <Badge variant="outline" className="text-xs font-normal">
              {suggestion.issues.length} issue
              {suggestion.issues.length > 1 ? "s" : ""} found
            </Badge>
          )}
        </div>

        <p className="text-sm font-medium">{suggestion.categoryName}</p>

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

        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-3">
          <div className="flex-1">
            <label className="text-muted-foreground mb-1.5 block text-[10px] font-semibold tracking-widest uppercase">
              Current name
            </label>
            <Input
              value={currentCategory?.name || ""}
              disabled
              className="pointer-events-none opacity-70"
            />
          </div>
          <div className="flex-1">
            <label className="text-muted-foreground mb-1.5 block text-[10px] font-semibold tracking-widest uppercase">
              New name
            </label>
            <Input
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              placeholder="Category name..."
              disabled={isSuccess}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex-1">
            <label className="text-muted-foreground mb-1.5 block text-[10px] font-semibold tracking-widest uppercase">
              Current items
            </label>
            <RichTextEditor
              value={currentCategory?.items || ""}
              onChange={() => {}}
              disabled
              placeholder="(empty)"
              minHeightClassName="min-h-[120px]"
            />
          </div>
          <div className="flex-1">
            <label className="text-muted-foreground mb-1.5 block text-[10px] font-semibold tracking-widest uppercase">
              New items
            </label>
            <RichTextEditor
              value={editedItems}
              onChange={setEditedItems}
              placeholder="Tailored items..."
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
            disabled={
              isPending ||
              isSuccess ||
              !editedItems.trim() ||
              !editedName.trim()
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
