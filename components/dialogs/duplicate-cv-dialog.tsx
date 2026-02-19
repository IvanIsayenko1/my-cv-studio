import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { DialogClose } from "@radix-ui/react-dialog";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

import { useCVQueryData, useDuplicateCV } from "@/hooks/cv/use-cv";
import { useMediaQuery } from "@/hooks/use-media-query";

import { QUERY_KEYS } from "@/lib/constants/query-keys";
import { RESOLUTIONS } from "@/lib/constants/resolutions";

import { CVNameFormValues, cvNameSchema } from "@/schemas/cv-name";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "../ui/drawer";

export default function DuplicateCVDialog({
  id,
  open,
  setOpen,
}: {
  id: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const queryClient = useQueryClient();

  const cv = useCVQueryData({ id });
  const isDesktop = useMediaQuery(RESOLUTIONS.DESKTOP);
  const formId = `duplicate-cv-form-${id}`;

  // Local form state only: parent controls dialog visibility.
  const form = useForm<CVNameFormValues>({
    resolver: zodResolver(cvNameSchema),
    defaultValues: {
      name: cv?.title || "",
    },
  });

  const { reset, clearErrors, setError } = form;

  const {
    mutate: duplicateCV,
    isPending: isDuplicatePending,
    error,
  } = useDuplicateCV({
    // Keep success side effects together to avoid fragmented lifecycle logic.
    onSuccess: () => {
      setOpen(false);
      reset({ name: cv?.title || "" });
      clearErrors("name");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CV_LIST] });
      toast.success("CV has been duplicated");
    },
  });

  // If source CV title changes (or loads later), keep input prefilled.
  useEffect(() => {
    if (!cv?.title) return;
    reset({ name: cv.title });
  }, [cv?.title, reset]);

  // Re-opening should not show stale validation/API errors from prior attempts.
  useEffect(() => {
    if (!open) return;
    clearErrors("name");
  }, [open, clearErrors]);

  // Surface mutation error inline on the name field.
  useEffect(() => {
    if (!error?.message) return;
    setError("name", {
      message: error.message,
    });
  }, [error?.message, setError]);

  const onSubmit = (data: CVNameFormValues) => {
    clearErrors("name");
    duplicateCV({ id, title: data.name });
  };

  // Shared field markup used by both desktop Dialog and mobile Drawer layouts.
  const nameField = (
    <FormField
      control={form.control}
      name="name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Name</FormLabel>
          <FormControl>
            <Input type="text" placeholder="CV name" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  if (isDesktop) {
    // Desktop presentation
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Duplicate existing CV</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form id={formId} onSubmit={form.handleSubmit(onSubmit)}>
              {nameField}

              <DialogFooter className="pt-2">
                <DialogClose asChild>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isDuplicatePending}
                    onClick={(e) => e.stopPropagation()}
                  >
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit" disabled={isDuplicatePending}>
                  {isDuplicatePending && <Spinner />}
                  {isDuplicatePending ? "Duplicating..." : "Continue"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    );
  }

  // Mobile presentation
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Duplicate existing CV</DrawerTitle>
        </DrawerHeader>
        <Form {...form}>
          <form
            id={formId}
            onSubmit={form.handleSubmit(onSubmit)}
            className="m-4 space-y-4"
          >
            {nameField}
          </form>
        </Form>
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button
              variant="outline"
              disabled={isDuplicatePending}
              onClick={(e) => e.stopPropagation()}
            >
              Cancel
            </Button>
          </DrawerClose>
          <Button type="submit" form={formId} disabled={isDuplicatePending}>
            {isDuplicatePending && <Spinner />}
            {isDuplicatePending ? "Duplicating..." : "Continue"}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
