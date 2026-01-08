import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { FormSchema } from "../cv-add";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCVQueryData } from "@/hooks/cv-hooks";
import { useEffect } from "react";
import { Input } from "../ui/input";
import { DialogClose } from "@radix-ui/react-dialog";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";

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
