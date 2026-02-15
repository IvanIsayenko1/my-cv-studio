"use client";

import { useEffect, useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2 } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { useAwards, useSaveAwards } from "@/hooks/cv/use-awards";

import { AwardsFormValues, awardsSchema } from "@/types/awards";

interface AwardsFormProps {
  setIsDirtyForm: (isDirty: boolean) => void;
  id: string;
}

export function AwardsForm({ setIsDirtyForm, id }: AwardsFormProps) {
  const [removeIndex, setRemoveIndex] = useState<number | null>(null);

  const { data } = useAwards(id);
  const { mutate, isPending } = useSaveAwards(id);

  const form = useForm<AwardsFormValues>({
    resolver: zodResolver(awardsSchema),
    defaultValues: {
      awards: [],
    },
  });
  const { control, reset, formState, handleSubmit } = form;
  const { isDirty } = formState;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "awards",
  });

  useEffect(() => {
    if (!data) return;

    reset({
      awards: data.awards && data.awards.length > 0 ? data.awards : [],
    });

    setIsDirtyForm(false);
  }, [data, reset, setIsDirtyForm]);

  useEffect(() => {
    setIsDirtyForm(isDirty);
  }, [isDirty, setIsDirtyForm]);

  const onSubmit = (values: AwardsFormValues) => {
    mutate(values, {
      onSuccess: () => {
        setIsDirtyForm(false);
      },
    });
  };

  const watchedAwards = useWatch({
    control,
    name: "awards",
  });
  const hasAny = !!watchedAwards && watchedAwards.length > 0;
  const last = hasAny ? watchedAwards[watchedAwards.length - 1] : null;
  const lastComplete =
    !!last &&
    last.name?.trim() &&
    last.issuer?.trim() &&
    last.date?.trim() &&
    last.description?.trim();
  const canAddAward = !hasAny || lastComplete;

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Awards</CardTitle>
          <CardDescription>
            Add notable awards or recognitions relevant to your career.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="space-y-4 border rounded-lg p-4 pb-6"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-medium text-sm text-muted-foreground">
                      Award {index + 1}
                    </div>
                    {fields.length > 0 && (
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => setRemoveIndex(index)}
                        aria-label="Remove award"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  {/* Name / Issuer */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={control}
                      name={`awards.${index}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Award name{" "}
                            <span className="text-destructive">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Best Developer Award"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={control}
                      name={`awards.${index}.issuer`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Issuer <span className="text-destructive">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Company / Organization"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Date */}
                  <FormField
                    control={control}
                    name={`awards.${index}.date`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Date (MM/YYYY){" "}
                          <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="04/2024" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Description */}
                  <FormField
                    control={control}
                    name={`awards.${index}.description`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Description{" "}
                          <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            rows={3}
                            placeholder="Briefly describe the award and why you received it."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                disabled={!canAddAward}
                onClick={() =>
                  append({
                    name: "",
                    issuer: "",
                    date: "",
                    description: "",
                  })
                }
              >
                {hasAny ? "Add another award" : "Add award"}
              </Button>

              <div className="flex justify-end gap-3">
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Saving..." : "Save"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Remove award confirmation dialog */}
      <AlertDialog
        open={removeIndex !== null}
        onOpenChange={(open) => {
          if (!open) setRemoveIndex(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove this award?</AlertDialogTitle>
            <AlertDialogDescription>
              This award will be permanently removed from your CV. You can add
              it again later if needed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setRemoveIndex(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (removeIndex !== null) {
                  remove(removeIndex);
                  setRemoveIndex(null);
                }
              }}
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
