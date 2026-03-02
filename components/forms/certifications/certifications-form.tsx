"use client";

import { useEffect, useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2 } from "lucide-react";

import SectionWrapper from "@/components/cv/cv-form-section-wrapper";
import { RemoveCertificationDialog } from "@/components/dialogs/remove-certification-dialog";
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
import { Separator } from "@/components/ui/separator";

import {
  useCertifications,
  useSaveCertifications,
} from "@/hooks/cv/use-certifications";

import {
  CertificationsFormValues,
  certificationsSchema,
} from "@/types/certifications";

interface CertificationsFormProps {
  id: string;
}

export function CertificationsForm({ id }: CertificationsFormProps) {
  const [removeIndex, setRemoveIndex] = useState<number | null>(null);

  const { data } = useCertifications(id);
  const { mutate, isPending } = useSaveCertifications(id);

  const form = useForm<CertificationsFormValues>({
    resolver: zodResolver(certificationsSchema),
    defaultValues: {
      certifications: [],
    },
  });

  const { control, reset, formState, handleSubmit } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "certifications",
  });

  useEffect(() => {
    if (!data) return;

    reset({
      certifications:
        data.certifications && data.certifications.length > 0
          ? data.certifications
          : [],
    });
  }, [data, reset]);

  const onSubmit = (values: CertificationsFormValues) => {
    mutate(values);
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

  return (
    <>
      <SectionWrapper
        id="certifications"
        title="Certifications"
        description="List your relevant certifications and credentials."
      >
        <Form {...form}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-8 flex gap-8 flex-col"
          >
            {fields.map((field, index) => (
              <div key={field.id} className="space-y-4 mb-0">
                <div className="flex justify-between items-start mb-2">
                  <div className="font-medium text-sm text-muted-foreground">
                    Certification {index + 1}
                  </div>
                  {fields.length > 0 && (
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => setRemoveIndex(index)}
                      aria-label="Remove certification"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

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
                          <Input placeholder="Amazon Web Services" {...field} />
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
                          <MonthYearPicker {...field} placeholder="MM/YYYY" />
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
                          <MonthYearPicker {...field} placeholder="MM/YYYY" />
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

                {index < fields.length - 1 && <Separator className="mt-8" />}
              </div>
            ))}

            <div className="cv-form-actions">
              <Button
                type="button"
                variant="outline"
                className="cv-form-primary-action"
                disabled={!canAddCertification}
                onClick={() =>
                  append({
                    name: "",
                    issuingOrg: "",
                    issueDate: "",
                    expirationDate: "",
                    credentialId: "",
                  })
                }
              >
                {hasAny ? "Add another certification" : "Add certification"}
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
