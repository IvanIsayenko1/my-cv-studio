import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { DialogClose } from "@radix-ui/react-dialog";
import z from "zod";

import { FormSchema } from "@/components/cv/cv-add";
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

import { useCVQueryData } from "@/hooks/cv/use-cv";

export default function DuplicateCVDialog({
  id,
  isDialogOpen,
  setIsDialogOpen,
  isLoading,
  onSubmitDuplicate,
  errorMessage,
}: {
  id: string;
  isDialogOpen: boolean;
  setIsDialogOpen: (isDialogOpen: boolean) => void;
  isLoading: boolean;
  onSubmitDuplicate: (data: z.infer<typeof FormSchema>) => void;
  errorMessage?: string;
}) {
  // custom hooks
  const cv = useCVQueryData({ id });

  // form
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: cv?.cvData?.title || "",
    },
  });
  const { reset } = form;

  useEffect(() => {
    if (!cv?.cvData?.title) return;
    reset({ name: cv.cvData.title });
  }, [cv?.cvData?.title, reset]);

  useEffect(() => {
    if (!isDialogOpen) return;
    form.setError("name", {
      message: errorMessage,
    });
  }, [errorMessage]);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent
        showCloseButton={!isLoading}
        onClick={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
      >
        <DialogHeader>
          <DialogTitle>Duplicate existing CV</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            id="new-cv-form"
            onSubmit={form.handleSubmit(onSubmitDuplicate)}
            className="space-y-4"
          >
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

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline" disabled={isLoading}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Spinner />}
                Continue
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
