"use client";

import { useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2 } from "lucide-react";

import SectionWrapper from "@/components/cv/cv-form-section-wrapper";
import { RemoveProjectDialog } from "@/components/dialogs/remove-project-dialog";
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
import { MonthYearPicker } from "@/components/ui/month-year-picker";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { Separator } from "@/components/ui/separator";

import { useSaveProjects } from "@/hooks/cv/use-projects";

import { BuilderFormProps } from "@/types/builder-form";
import { ProjectsFormValues, projectsSchema } from "@/types/projects";

export function ProjectsForm({
  id,
  formData,
}: BuilderFormProps<ProjectsFormValues>) {
  const [removeIndex, setRemoveIndex] = useState<number | null>(null);

  const { mutate, isPending } = useSaveProjects(id);

  const form = useForm<ProjectsFormValues>({
    resolver: zodResolver(projectsSchema),
    defaultValues: {
      projects: formData?.projects || [], // allow having no projects
    },
  });

  const { control, handleSubmit } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "projects",
  });

  const onSubmit = (values: ProjectsFormValues) => {
    mutate(values);
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
        sectionId="projects"
        title="Projects"
        description="Add notable projects that showcase your skills and impact."
        cvId={id}
      >
        <Form {...form}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-8 space-y-8"
          >
            {fields.map((field, index) => (
              <div key={field.id} className="mb-0 space-y-4">
                <div className="mb-2 flex items-start justify-between">
                  <div className="text-muted-foreground text-sm font-medium">
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
                          <MonthYearPicker {...field} placeholder="MM/YYYY" />
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
                          <MonthYearPicker
                            {...field}
                            placeholder="MM/YYYY"
                            includePresentOption={true}
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
                        Description <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <RichTextEditor
                          value={field.value || ""}
                          onChange={field.onChange}
                          placeholder="Briefly describe the project, your responsibilities, and key outcomes."
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

                {index < fields.length - 1 && <Separator className="mt-8" />}
              </div>
            ))}

            <div className="cv-form-actions">
              <Button
                type="button"
                variant="outline"
                className="cv-form-primary-action"
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
              <Button
                type="submit"
                disabled={
                  isPending ||
                  !form.formState.isValid ||
                  form.formState.isDirty === false
                }
                className="cv-form-primary-action"
              >
                {isPending ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </Form>
      </SectionWrapper>

      {/* Remove project confirmation dialog */}
      <RemoveProjectDialog
        open={removeIndex !== null}
        onOpenChange={(open) => {
          if (!open) setRemoveIndex(null);
        }}
        onCancel={() => setRemoveIndex(null)}
        onRemove={() => {
          if (removeIndex !== null) {
            remove(removeIndex);
            setRemoveIndex(null);
          }
        }}
      />
    </>
  );
}
