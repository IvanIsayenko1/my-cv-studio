import { Card, CardContent } from "@/components/ui/card";

import { CVTailorReview } from "@/types/ai-tailor-review";

function matchTone(pct: number) {
  if (pct >= 85) return "text-emerald-600 dark:text-emerald-400";
  if (pct >= 65) return "text-emerald-600 dark:text-emerald-400";
  if (pct >= 40) return "text-amber-600 dark:text-amber-400";
  return "text-rose-600 dark:text-rose-400";
}

function matchLabel(pct: number) {
  if (pct >= 85) return "Strong match";
  if (pct >= 65) return "Solid match";
  if (pct >= 40) return "Partial match";
  return "Weak match";
}

export default function MatchOverviewCard({
  review,
}: {
  review: CVTailorReview;
}) {
  const pct = Math.max(0, Math.min(100, Math.round(review.matchPercentage)));

  return (
    <Card className="m-[1px]">
      <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
        <div className="flex shrink-0 items-baseline gap-1 sm:flex-col sm:items-center sm:gap-0">
          <p
            className={`text-5xl font-bold leading-none tabular-nums ${matchTone(pct)}`}
          >
            {pct}
            <span className="text-3xl">%</span>
          </p>
          <p
            className={`text-xs font-semibold sm:mt-1 ${matchTone(pct)}`}
          >
            {matchLabel(pct)}
          </p>
        </div>
        <div className="min-w-0 sm:border-l sm:pl-4">
          <p className="text-muted-foreground text-[10px] font-semibold tracking-widest uppercase">
            Role in the offer
          </p>
          <p className="mt-0.5 text-sm font-semibold leading-tight">
            {review.jobTitle}
          </p>
          <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
            {review.matchSummary}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
