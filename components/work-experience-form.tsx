"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
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

import {
  WorkExperienceFormValues,
  workExperienceSchema,
} from "@/types/work-experience";
import {
  fetchWorkExperience,
  postWorkExperience,
} from "@/lib/queries/work-experience-queries";
import { WorkExperienceFormSkeleton } from "./work-experience-form-skeleton";

interface WorkExperienceFormProps {
  setIsDirtyForm: (isDirty: boolean) => void;
  id: string;
}

export function WorkExperienceForm({
  setIsDirtyForm,
  id,
}: WorkExperienceFormProps) {
  const queryClient = useQueryClient();
  const [removeIndex, setRemoveIndex] = useState<number | null>(null);

  const { data, isLoading } = useQuery<WorkExperienceFormValues | null>({
    queryKey: ["work-experience", id],
    queryFn: () => fetchWorkExperience(id),
  });

  const form = useForm<WorkExperienceFormValues>({
    resolver: zodResolver(workExperienceSchema),
    defaultValues: {
      workExperience: [
        {
          jobTitle: "",
          company: "",
          location: "",
          employmentType: "Full-time",
          startDate: "",
          endDate: "Present",
          achievements: [],
          technologies: [],
        },
      ],
    },
  });

  const { control, reset, formState, handleSubmit } = form;
  const { isDirty } = formState;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "workExperience",
  });

  // hydrate from API
  useEffect(() => {
    if (!data) return;

    reset({
      workExperience:
        data.workExperience && data.workExperience.length > 0
          ? data.workExperience
          : [
              {
                jobTitle: "",
                company: "",
                location: "",
                employmentType: "Full-time",
                startDate: "",
                endDate: "Present",
                achievements: [],
                technologies: [],
              },
            ],
    });

    setIsDirtyForm(false);
  }, [data, reset, setIsDirtyForm]);

  useEffect(() => {
    setIsDirtyForm(isDirty);
  }, [isDirty, setIsDirtyForm]);

  const mutation = useMutation({
    mutationKey: ["work-experience", id],
    mutationFn: (values: WorkExperienceFormValues) =>
      postWorkExperience(id, values),
    onSuccess: () => {
      toast.success("Work experience has been updated");
      queryClient.invalidateQueries({ queryKey: ["work-experience", id] });
      setIsDirtyForm(false);
    },
  });

  const onSubmit = (values: WorkExperienceFormValues) => {
    const cleaned: WorkExperienceFormValues = {
      workExperience: values.workExperience.map((w) => ({
        ...w,
        technologies: (w.technologies ?? [])
          .map((t) => t.trim())
          .filter(Boolean),
      })),
    };

    mutation.mutate(cleaned);
  };

  // Watch all workExperience items for "can add another role" logic
  const watchedExperiences = useWatch({
    control,
    name: "workExperience",
  });

  const last = watchedExperiences?.[watchedExperiences.length - 1];
  const requiredFilledForLast =
    !!last &&
    last.jobTitle?.trim() &&
    last.company?.trim() &&
    last.location?.trim() &&
    last.startDate?.trim() &&
    last.endDate?.trim();

  if (isLoading && !data) {
    // Improved skeleton
    return <WorkExperienceFormSkeleton />;
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Work Experience</CardTitle>
          <CardDescription>
            Add your recent roles, focusing on achievements and impact.
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
                  {/* Top row with title and delete button */}
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-medium text-sm text-muted-foreground">
                      Role {index + 1}
                    </div>
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => setRemoveIndex(index)}
                        aria-label="Remove role"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  {/* Job title / company */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={control}
                      name={`workExperience.${index}.jobTitle`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Job Title{" "}
                            <span className="text-destructive">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Senior Frontend Developer"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name={`workExperience.${index}.company`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Company <span className="text-destructive">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="Acme Inc." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Location / Employment Type */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={control}
                      name={`workExperience.${index}.location`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Location <span className="text-destructive">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Remote / City, Country"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name={`workExperience.${index}.employmentType`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Employment Type{" "}
                            <span className="text-destructive">*</span>
                          </FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Full-time">
                                  Full-time
                                </SelectItem>
                                <SelectItem value="Part-time">
                                  Part-time
                                </SelectItem>
                                <SelectItem value="Contract">
                                  Contract
                                </SelectItem>
                                <SelectItem value="Freelance">
                                  Freelance
                                </SelectItem>
                                <SelectItem value="Internship">
                                  Internship
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={control}
                      name={`workExperience.${index}.startDate`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Start Date (MM/YYYY){" "}
                            <span className="text-destructive">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="01/2022" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name={`workExperience.${index}.endDate`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            End Date (MM/YYYY or Present){" "}
                            <span className="text-destructive">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="Present" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Achievements */}
                  <FormField
                    control={control}
                    name={`workExperience.${index}.achievements`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Key Achievements</FormLabel>
                        <FormControl>
                          <Textarea
                            rows={4}
                            placeholder="Use one line per achievement"
                            value={field.value?.join("\n") ?? ""}
                            onChange={(e) =>
                              field.onChange(e.target.value.split("\n"))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Technologies */}
                  <FormField
                    control={control}
                    name={`workExperience.${index}.technologies`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Technologies</FormLabel>
                        <FormControl>
                          <div className="space-y-2">
                            <div className="flex flex-wrap gap-2">
                              {field.value?.map((tech, i) => (
                                <span
                                  key={tech + i}
                                  className="inline-flex items-center rounded-full border px-2 py-1 text-xs"
                                >
                                  {tech}
                                  <button
                                    type="button"
                                    className="ml-1 text-muted-foreground hover:text-destructive"
                                    onClick={() =>
                                      field.onChange(
                                        (field.value ?? []).filter(
                                          (_, idx) => idx !== i
                                        )
                                      )
                                    }
                                  >
                                    ×
                                  </button>
                                </span>
                              ))}
                            </div>
                            <Input
                              placeholder="Type a technology and press Enter"
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  const input = (
                                    e.target as HTMLInputElement
                                  ).value.trim();
                                  if (!input) return;
                                  field.onChange([
                                    ...(field.value ?? []),
                                    input,
                                  ]);
                                  (e.target as HTMLInputElement).value = "";
                                }
                              }}
                            />
                          </div>
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
                disabled={!requiredFilledForLast}
                onClick={() =>
                  append({
                    jobTitle: "",
                    company: "",
                    location: "",
                    employmentType: "Full-time",
                    startDate: "",
                    endDate: "Present",
                    achievements: [],
                    technologies: [],
                  })
                }
              >
                Add another role
              </Button>

              <div className="flex justify-end gap-3">
                <Button type="submit" disabled={mutation.isPending}>
                  {mutation.isPending ? "Saving..." : "Save"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Remove role confirmation dialog */}
      <AlertDialog
        open={removeIndex !== null}
        onOpenChange={(open) => {
          if (!open) setRemoveIndex(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove this role?</AlertDialogTitle>
            <AlertDialogDescription>
              This work experience entry will be permanently removed from your
              CV. You can add it again later if needed.
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
