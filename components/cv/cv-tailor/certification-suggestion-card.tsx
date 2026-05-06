import { useState } from "react";

import { useParams } from "next/navigation";

import { Save } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

import {
  useCertificationsSuspenseQuery,
  useSaveCertifications,
} from "@/hooks/cv/use-certifications";

import { CVTailorCertificationSuggestion } from "@/types/ai-tailor-review";

export default function CertificationSuggestionCard({
  suggestion,
}: {
  suggestion: CVTailorCertificationSuggestion;
}) {
  const cvId = useParams().id as string;
  const { data: certificationsData } = useCertificationsSuspenseQuery(cvId);
  const { mutate, isPending, isSuccess } = useSaveCertifications(cvId);

  const [editedName, setEditedName] = useState(suggestion.suggestedName);
  const [editedIssuer, setEditedIssuer] = useState(suggestion.suggestedIssuer);

  const certifications = certificationsData?.certifications ?? [];
  const currentCert = certifications[suggestion.certificationIndex];

  const handleAccept = () => {
    if (!editedName.trim() || !editedIssuer.trim() || !currentCert) return;
    const updated = certifications.map((cert, index) =>
      index === suggestion.certificationIndex
        ? { ...cert, name: editedName.trim(), issuingOrg: editedIssuer.trim() }
        : cert
    );
    mutate({ certifications: updated });
  };

  return (
    <Card className="m-[1px]">
      <CardContent className="flex flex-col gap-4 p-5">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-muted-foreground text-[10px] font-semibold tracking-widest uppercase">
            Suggested certification polish
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
              Current name
            </label>
            <Input
              value={currentCert?.name || ""}
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
              placeholder="Certification name..."
              disabled={isSuccess}
            />
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-3">
          <div className="flex-1">
            <label className="text-muted-foreground mb-1.5 block text-[10px] font-semibold tracking-widest uppercase">
              Current issuer
            </label>
            <Input
              value={currentCert?.issuingOrg || ""}
              disabled
              className="pointer-events-none opacity-70"
            />
          </div>
          <div className="flex-1">
            <label className="text-muted-foreground mb-1.5 block text-[10px] font-semibold tracking-widest uppercase">
              New issuer
            </label>
            <Input
              value={editedIssuer}
              onChange={(e) => setEditedIssuer(e.target.value)}
              placeholder="Issuing organization..."
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
              !editedName.trim() ||
              !editedIssuer.trim()
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
