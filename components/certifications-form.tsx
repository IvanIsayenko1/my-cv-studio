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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  CertificationsFormValues,
  certificationsSchema,
} from "@/types/certifications";
import {
  fetchCertifications,
  postCertifications,
} from "@/lib/fetches/certifications-fetches";
import { CertificationsFormSkeleton } from "./certifications-form-skeleton";

interface CertificationsFormProps {
  setIsDirtyForm: (isDirty: boolean) => void;
  id: string;
}

export function CertificationsForm({
  setIsDirtyForm,
  id,
}: CertificationsFormProps) {
  const queryClient = useQueryClient();
  const [removeIndex, setRemoveIndex] = useState<number | null>(null);

  const { data, isLoading } = useQuery<CertificationsFormValues | null>({
    queryKey: ["certifications", id],
    queryFn: () => fetchCertifications(id),
  });

  const form = useForm<CertificationsFormValues>({
    resolver: zodResolver(certificationsSchema),
    defaultValues: {
      certifications: [],
    },
  });

  const { control, reset, formState, handleSubmit } = form;
  const { isDirty } = formState;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "certifications",
  });

  // hydrate from API, but always ensure at least one item
  useEffect(() => {
    if (!data) return;

    reset({
      certifications:
        data.certifications && data.certifications.length > 0
          ? data.certifications
          : [],
    });

    setIsDirtyForm(false);
  }, [data, reset, setIsDirtyForm]);

  useEffect(() => {
    setIsDirtyForm(isDirty);
  }, [isDirty, setIsDirtyForm]);

  const mutation = useMutation({
    mutationKey: ["certifications", id],
    mutationFn: (values: CertificationsFormValues) =>
      postCertifications(id, values),
    onSuccess: () => {
      toast.success("Certifications have been updated");
      queryClient.invalidateQueries({ queryKey: ["certifications", id] });
      setIsDirtyForm(false);
    },
  });

  const onSubmit = (values: CertificationsFormValues) => {
    const cleaned: CertificationsFormValues = {
      certifications: (values.certifications ?? []).filter(
        (c) =>
          c.name.trim() ||
          c.issuingOrg.trim() ||
          c.issueDate.trim() ||
          c.expirationDate?.trim() ||
          c.credentialId?.trim()
      ),
    };

    // if user cleared everything, send explicit empty array
    mutation.mutate(cleaned);
  };

  // "Add another" button enabled only when last required fields are filled
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

  if (isLoading && !data) {
    return <CertificationsFormSkeleton />;
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Certifications</CardTitle>
          <CardDescription>
            List your relevant certifications and credentials.
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                            <Input placeholder="05/2023" {...field} />
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
                            <Input
                              placeholder="05/2026 or leave blank"
                              {...field}
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
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
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

              <div className="flex justify-end gap-3">
                <Button type="submit" disabled={mutation.isPending}>
                  {mutation.isPending ? "Saving..." : "Save"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Remove certification confirmation dialog */}
      <AlertDialog
        open={removeIndex !== null}
        onOpenChange={(open) => {
          if (!open) setRemoveIndex(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove this certification?</AlertDialogTitle>
            <AlertDialogDescription>
              This certification will be permanently removed from your CV. You
              can add it again later if needed.
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
