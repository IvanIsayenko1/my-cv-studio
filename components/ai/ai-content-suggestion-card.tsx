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
  onAccept,
  isPending = false,
}: {
  children: React.ReactNode;
  cardKey: string;
  title: string;
  summary: string;
  issues: string[];
  onAccept: () => void;
  isPending?: boolean;
}) {
  return (
    <Card key={cardKey}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          {summary}
          <ul className="list-disc pl-6">
            {issues.map((issue, index) => (
              <li key={index}>{issue}</li>
            ))}
          </ul>
        </CardDescription>
      </CardHeader>
      {children}
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
    </Card>
  );
}
