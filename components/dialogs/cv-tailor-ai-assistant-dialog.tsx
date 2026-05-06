import ExperienceSuggestionCard from "@/components/cv/cv-tailor/experience-suggestion-card";
import MatchOverviewCard from "@/components/cv/cv-tailor/match-overview-card";
import SummarySuggestionCard from "@/components/cv/cv-tailor/summary-suggestion-card";
import TitleSuggestionCard from "@/components/cv/cv-tailor/title-suggestion-card";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

import { useMediaQuery } from "@/hooks/use-media-query";

import { RESOLUTIONS } from "@/lib/constants/resolutions";

import { CVTailorReview } from "@/types/ai-tailor-review";

function EmptyReview() {
  return (
    <Card className="m-[1px]">
      <CardHeader>
        <CardTitle>No review yet</CardTitle>
        <CardDescription>
          Submit a job offer to see how well your CV matches.
        </CardDescription>
      </CardHeader>
    </Card>
  );
}

export default function CVTailorAIAssistantDialog({
  isOpenDialog,
  setIsOpenDialog,
  review,
}: {
  isOpenDialog: boolean;
  setIsOpenDialog: (value: boolean) => void;
  review: CVTailorReview | null;
}) {
  const isDesktop = useMediaQuery(RESOLUTIONS.DESKTOP);

  const body = review ? (
    <div className="flex flex-col gap-4 pb-2">
      <MatchOverviewCard review={review} />
      {review.titleSuggestion ? (
        <TitleSuggestionCard suggestion={review.titleSuggestion} />
      ) : null}
      <SummarySuggestionCard suggestedSummary={review.suggestedSummary} />
      {review.suggestedExperience?.map((exp) => (
        <ExperienceSuggestionCard key={exp.roleIndex} suggestion={exp} />
      ))}
    </div>
  ) : (
    <EmptyReview />
  );

  if (isDesktop) {
    return (
      <Dialog open={isOpenDialog} onOpenChange={setIsOpenDialog}>
        <DialogContent className="flex max-h-[min(85vh,48rem)] flex-col overflow-hidden sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>How your CV matches this offer</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto pr-1">{body}</div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={isOpenDialog} onOpenChange={setIsOpenDialog}>
      <DrawerContent
        className="flex max-h-[calc(100%-1rem)] flex-col"
        onPointerDownOutside={() => setIsOpenDialog(false)}
      >
        <DrawerHeader>
          <DrawerTitle>How your CV matches this offer</DrawerTitle>
        </DrawerHeader>

        <DrawerDescription asChild>
          <div className="min-h-0 flex-1 overflow-y-auto px-4">{body}</div>
        </DrawerDescription>

        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline" size="lg" className="w-full">
              Close
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
