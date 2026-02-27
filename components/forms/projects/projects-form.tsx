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
import SectionWrapper from "@/components/cv/cv-form-section-wrapper";
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

import { useProjects, useSaveProjects } from "@/hooks/cv/use-projects";

import { ProjectsFormValues, projectsSchema } from "@/types/projects";

interface ProjectsFormProps {
  setIsDirtyForm: (isDirty: boolean) => void;
  id: string;
  sectionTitle?: string;
}

export function ProjectsForm({
  setIsDirtyForm,
  id,
  sectionTitle = "Projects",
}: ProjectsFormProps) {
  const [removeIndex, setRemoveIndex] = useState<number | null>(null);

  const { data } = useProjects(id);
  const { mutate, isPending } = useSaveProjects(id);

  const form = useForm<ProjectsFormValues>({
    resolver: zodResolver(projectsSchema),
    defaultValues: {
      projects: [], // allow having no projects
    },
  });

  const { control, reset, formState, handleSubmit } = form;
  const { isDirty } = formState;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "projects",
  });

  useEffect(() => {
    if (!data) return;

    reset({
      projects: data.projects && data.projects.length > 0 ? data.projects : [],
    });

    setIsDirtyForm(false);
  }, [data, reset, setIsDirtyForm]);

  useEffect(() => {
    setIsDirtyForm(isDirty);
  }, [isDirty, setIsDirtyForm]);

  const onSubmit = (values: ProjectsFormValues) => {
    mutate(values, {
      onSuccess: () => {
        setIsDirtyForm(false);
      },
    });
  };

  // "Add project" button state: enabled if no projects OR last is complete
  const watchedProjects = useWatch({
    control,
    name: "projects",
  });
  const hasAny = !!watchedProjects && watchedProjects.length > 0;
  const last = hasAny ? watchedProjects[watchedProjects.length - 1] : null;
  const lastComplete =
    !!last &&
    last.name?.trim() &&
    last.role?.trim() &&
    last.startDate?.trim() &&
    last.endDate?.trim() &&
    last.description?.trim();
  const canAddProject = !hasAny || lastComplete;

  return (
    <>
      <SectionWrapper
        id="projects"
        title={sectionTitle}
        description="Add notable projects that showcase your skills and impact."
      >
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="space-y-4 border rounded-lg p-4 pb-6"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-medium text-sm text-muted-foreground">
                      Project {index + 1}
                    </div>
                    {fields.length > 0 && (
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => setRemoveIndex(index)}
                        aria-label="Remove project"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  {/* Name / Role */}
                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    <FormField
                      control={control}
                      name={`projects.${index}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Project name{" "}
                            <span className="text-destructive">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="Portfolio Website" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name={`projects.${index}.role`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Role <span className="text-destructive">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Full-stack Developer"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    <FormField
                      control={control}
                      name={`projects.${index}.startDate`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Start date (MM/YYYY){" "}
                            <span className="text-destructive">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="01/2023" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name={`projects.${index}.endDate`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            End date (MM/YYYY or Present){" "}
                            <span className="text-destructive">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="06/2023 or Present"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Description */}
                  <FormField
                    control={control}
                    name={`projects.${index}.description`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Description{" "}
                          <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            rows={4}
                            placeholder="Briefly describe the project, your responsibilities, and key outcomes."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* URL */}
                  <FormField
                    control={control}
                    name={`projects.${index}.url`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project URL (optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com" {...field} />
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
                disabled={!canAddProject}
                onClick={() =>
                  append({
                    name: "",
                    role: "",
                    startDate: "",
                    endDate: "",
                    description: "",
                    url: "",
                  })
                }
              >
                {hasAny ? "Add another project" : "Add project"}
              </Button>

              <div className="cv-form-actions">
                <Button
                  type="submit"
                  disabled={isPending}
                  className="cv-form-primary-action"
                >
                  {isPending ? "Saving..." : "Save"}
                </Button>
              </div>
            </form>
          </Form>
      </SectionWrapper>

      {/* Remove project confirmation dialog */}
      <AlertDialog
        open={removeIndex !== null}
        onOpenChange={(open) => {
          if (!open) setRemoveIndex(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove this project?</AlertDialogTitle>
            <AlertDialogDescription>
              This project will be permanently removed from your CV. You can add
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
