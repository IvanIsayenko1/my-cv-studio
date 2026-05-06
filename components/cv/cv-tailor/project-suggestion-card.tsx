import { useState } from "react";

import { useParams } from "next/navigation";

import { Save } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { Spinner } from "@/components/ui/spinner";

import {
  useProjectsSuspenseQuery,
  useSaveProjects,
} from "@/hooks/cv/use-projects";

import { CVTailorProjectSuggestion } from "@/types/ai-tailor-review";

export default function ProjectSuggestionCard({
  suggestion,
}: {
  suggestion: CVTailorProjectSuggestion;
}) {
  const cvId = useParams().id as string;
  const { data: projectsData } = useProjectsSuspenseQuery(cvId);
  const { mutate, isPending, isSuccess } = useSaveProjects(cvId);

  const [edited, setEdited] = useState(suggestion.suggested);

  const projects = projectsData?.projects ?? [];
  const currentProject = projects[suggestion.projectIndex];

  const handleAccept = () => {
    if (!edited.trim() || !currentProject) return;
    const updated = projects.map((project, index) =>
      index === suggestion.projectIndex
        ? { ...project, description: edited.trim() }
        : project
    );
    mutate({ projects: updated });
  };

  return (
    <Card className="m-[1px]">
      <CardContent className="flex flex-col gap-4 p-5">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-muted-foreground text-[10px] font-semibold tracking-widest uppercase">
            Suggested project polish
          </p>
          {suggestion.issues.length > 0 && (
            <Badge variant="outline" className="text-xs font-normal">
              {suggestion.issues.length} issue
              {suggestion.issues.length > 1 ? "s" : ""} found
            </Badge>
          )}
        </div>

        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
          {suggestion.projectName || `Project ${suggestion.projectIndex + 1}`}
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
              value={currentProject?.description || ""}
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
