"use client";

import { useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Save, Trash2, X } from "lucide-react";

import SectionWrapper from "@/components/cv/cv-form-section-wrapper";
import { RemoveCertificationDialog } from "@/components/dialogs/remove-certification-dialog";
import FormStatusBedge from "@/components/form-status-bedge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
import { Spinner } from "@/components/ui/spinner";

import { useSaveCertifications } from "@/hooks/cv/use-certifications";
import { useFormDirtyState } from "@/hooks/use-form-dirty-state";

import { BuilderFormProps } from "@/types/builder-form";
import {
  CertificationsFormValues,
  certificationsSchema,
} from "@/types/certifications";

export function CertificationsForm({
  id,
  formData,
}: BuilderFormProps<CertificationsFormValues>) {
  const [removeIndex, setRemoveIndex] = useState<number | null>(null);
  const [openItems, setOpenItems] = useState<string[]>([]);

  const { mutate, isPending } = useSaveCertifications(id);

  const form = useForm<CertificationsFormValues>({
    resolver: zodResolver(certificationsSchema),
    defaultValues: {
      certifications: formData.certifications || [],
    },
  });

  // Track unsaved changes
  useFormDirtyState("certifications", form.formState.isDirty);

  const { control, handleSubmit, formState } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "certifications",
  });

  const onSubmit = (values: CertificationsFormValues) => {
    mutate(values, {
      onSuccess: () => form.reset(values),
    });
  };

  const watchedCerts = useWatch({
    control,
    name: "certifications",
  });
  const hasAny = !!watchedCerts && watchedCerts.length > 0;
  const last = watchedCerts?.[watchedCerts.length - 1];
  const requiredFilledForLast =
    !!last &&
    last.name?.trim() &&
    last.issuingOrg?.trim() &&
    last.issueDate?.trim();
  const canAddCertification = !hasAny || requiredFilledForLast;

  const getSectionTitle = (index: number) => {
    return watchedCerts[index] && watchedCerts[index].name
      ? `${watchedCerts[index].name}`
      : `Certification ${index + 1}`;
  };

  return (
    <>
      <SectionWrapper
        sectionId="certifications"
        title="Certifications"
        description="List your relevant certifications and credentials."
        cvId={id}
        status={<FormStatusBedge isNotSaved={formState.isDirty} />}
      >
        <Form {...form}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-8"
          >
            {!!fields.length && (
              <Accordion
                type="multiple"
                value={openItems}
                onValueChange={setOpenItems}
              >
                {fields.map((field, index) => (
                  <AccordionItem key={field.id} value={`item-${index}`}>
                    <AccordionTrigger>
                      {getSectionTitle(index)}
                    </AccordionTrigger>
                    <AccordionContent className="mb-0 max-h-none space-y-4">
                      {/* Name / Issuing organization */}
                      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                        <FormField
                          control={control}
                          name={`certifications.${index}.name`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Certification name{" "}
                                <span className="text-destructive">*</span>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="AWS Certified Solutions Architect"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={control}
                          name={`certifications.${index}.issuingOrg`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Issuing organization{" "}
                                <span className="text-destructive">*</span>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Amazon Web Services"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Issue date / Expiration date */}
                      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                        <FormField
                          control={control}
                          name={`certifications.${index}.issueDate`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Issue date (MM/YYYY){" "}
                                <span className="text-destructive">*</span>
                              </FormLabel>
                              <FormControl>
                                <MonthYearPicker
                                  {...field}
                                  placeholder="MM/YYYY"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={control}
                          name={`certifications.${index}.expirationDate`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Expiration date (optional)</FormLabel>
                              <FormControl>
                                <MonthYearPicker
                                  {...field}
                                  placeholder="MM/YYYY"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Credential ID */}
                      <FormField
                        control={control}
                        name={`certifications.${index}.credentialId`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Credential ID (optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. ABCD-1234" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        type="button"
                        variant="destructive"
                        className="w-full"
                        onClick={() => setRemoveIndex(index)}
                        aria-label="Remove certification"
                      >
                        <Trash2 className="h-4 w-4" />
                        Remove
                      </Button>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}

            <div className="cv-form-actions">
              <Button
                type="button"
                variant="outline"
                className="cv-form-primary-action"
                disabled={!canAddCertification}
                onClick={() => {
                  append({
                    name: "",
                    issuingOrg: "",
                    issueDate: "",
                    expirationDate: "",
                    credentialId: "",
                  });
                  setOpenItems((prev) => [...prev, `item-${fields.length}`]);
                }}
              >
                <Plus />
                {hasAny ? "Add another certification" : "Add certification"}
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={!form.formState.isDirty || isPending}
                onClick={() => form.reset()}
              >
                <X className="h-4 w-4" />
                Discard changes
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="cv-form-primary-action"
              >
                {isPending ? <Spinner /> : <Save />}
                {isPending ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </Form>
      </SectionWrapper>

      {/* Remove certification confirmation dialog */}
      <RemoveCertificationDialog
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
