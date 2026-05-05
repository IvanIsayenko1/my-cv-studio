import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { askGroqTailor } from "@/app/actions/groq";
import { zodResolver } from "@hookform/resolvers/zod";

import CVTailorAIAssistantDialog from "@/components/dialogs/cv-tailor-ai-assistant-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { Spinner } from "@/components/ui/spinner";

import { useCompleteCvSuspenseQuery } from "@/hooks/cv/use-cv";
import {
  usePersonalInfoSuspenseQuery,
  useSavePersonalInfo,
} from "@/hooks/cv/use-personal-info";

import { buildTailorMessages } from "@/lib/utils/ai";

import { CVTailorReview } from "@/types/ai-tailor-review";

import { TailorFormValues, tailorSchema } from "@/schemas/tailor";

export default function CVTailorForm({ id }: { id: string }) {
  const fullCV = useCompleteCvSuspenseQuery(id);
  const { data: personalInfo } = usePersonalInfoSuspenseQuery(id);
  const savePersonalInfo = useSavePersonalInfo(id);

  const [isConsultingAI, setIsConsultingAI] = useState(false);
  const [review, setReview] = useState<CVTailorReview | null>(null);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [isTitleApplied, setIsTitleApplied] = useState(false);

  const form = useForm<TailorFormValues>({
    resolver: zodResolver(tailorSchema),
    defaultValues: {
      offerDescription: "",
    },
  });

  useEffect(() => {
    setIsTitleApplied(false);
  }, [review]);

  const onSubmit = async (values: TailorFormValues) => {
    if (!fullCV) {
      console.error("Full CV data is not available.");
      return;
    }
    setIsConsultingAI(true);
    try {
      const response = await askGroqTailor<CVTailorReview>(
        buildTailorMessages(fullCV, values.offerDescription)
      );
      setReview(response);
      setIsReviewOpen(true);
      console.log("Tailor review received:", response);
    } catch (err) {
      console.error("Tailor request failed:", err);
    } finally {
      setIsConsultingAI(false);
    }
  };

  const handleAcceptTitle = () => {
    if (!review?.titleSuggestion || !personalInfo) return;
    savePersonalInfo.mutate(
      { ...personalInfo, professionalTitle: review.titleSuggestion.suggested },
      { onSuccess: () => setIsTitleApplied(true) }
    );
  };

  return (
    <div className="mb-4 w-full p-[1px]">
      <CVTailorAIAssistantDialog
        isOpenDialog={isReviewOpen}
        setIsOpenDialog={setIsReviewOpen}
        review={review}
        isApplyingTitle={savePersonalInfo.isPending}
        isTitleApplied={isTitleApplied}
        onAcceptTitle={handleAcceptTitle}
      />
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Tailor Your CV</CardTitle>
          <CardDescription>
            Addapt your CV to specific job offers by analyzing the offer
            description and providing tailored suggestions for improvements.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-8"
              id="tailor-form"
            >
              <FormField
                control={form.control}
                name="offerDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Offer Description
                      <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <RichTextEditor
                        key={field.name}
                        {...field}
                        placeholder="Paste the job offer description here..."
                        minHeightClassName="min-h-[400px]"
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </CardContent>
        <CardFooter className="cv-form-actions">
          {review ? (
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsReviewOpen(true)}
            >
              View last review
            </Button>
          ) : null}
          <Button
            type="submit"
            form="tailor-form"
            className="cv-form-primary-action ml-auto"
            disabled={isConsultingAI}
          >
            {isConsultingAI && <Spinner />}
            {isConsultingAI ? "Consulting AI..." : "Get Tailored Suggestions"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
