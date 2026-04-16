import { Button } from "../ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Spinner } from "../ui/spinner";

export default function AIContentSuggestionCard({
  children,
  cardKey,
  title,
  summary,
  issues,
  typos,
  onAccept,
  isPending = false,
  showDefaultAction = true,
}: {
  children: React.ReactNode;
  cardKey: string;
  title: string;
  summary: string;
  issues: string[];
  typos?: {
    hasTypos: boolean;
    details: string[];
  };
  onAccept: () => void;
  isPending?: boolean;
  showDefaultAction?: boolean;
}) {
  return (
    <Card key={cardKey} className="m-1">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          {summary}
          {issues.length > 0 ? (
            <ul className="mt-2 list-disc pl-6">
              {issues.map((issue, index) => (
                <li key={index}>{issue}</li>
              ))}
            </ul>
          ) : null}
          {typos?.hasTypos && typos.details.length > 0 ? (
            <div className="mt-3">
              <div className="text-foreground font-medium">Typos</div>
              <ul className="mt-1 list-disc pl-6">
                {typos.details.map((detail, index) => (
                  <li key={index}>{detail}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </CardDescription>
      </CardHeader>
      {children}
      {showDefaultAction ? (
        <CardFooter className="justify-end">
          <Button
            onClick={onAccept}
            disabled={isPending}
            className="cv-form-primary-action"
          >
            {isPending && <Spinner />}
            {isPending ? "Applying..." : "Apply Suggestion"}
          </Button>
        </CardFooter>
      ) : null}
    </Card>
  );
}
