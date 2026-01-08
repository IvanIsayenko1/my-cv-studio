"use client";

import { useEffect, useState } from "react";
import { EditIcon } from "lucide-react";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import { Input } from "./ui/input";
import { useCVQueryData } from "@/hooks/cv-hooks";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { DialogClose } from "@radix-ui/react-dialog";
import { useUpdateCVTitle } from "@/lib/fetches/cv-fetches";

const FormSchema = z.object({
  name: z.string().min(5, {
    message: "Name must be at least 5 characters long.",
  }),
});

type FormValues = z.infer<typeof FormSchema>;

export default function CVFormTitle({ id }: { id: string }) {
  const cv = useCVQueryData({ id });
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const updateTitle = useUpdateCVTitle();

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "", // initial empty; will hydrate in useEffect
    },
  });

  const { reset } = form;

  // when cv data arrives (or changes), update form values
  useEffect(() => {
    if (!cv?.cvData?.title) return;
    reset({ name: cv.cvData.title });
  }, [cv?.cvData?.title, reset]);

  const onSubmit = (values: FormValues) => {
    updateTitle.mutate({ id, title: values.name });
    setIsOpenDialog(false);
  };

  if (cv === null || cv === undefined) {
    return <Skeleton className="h-8 w-32" />;
  }

  return (
    <div className="flex items-start gap-2">
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
        {cv?.cvData?.title || "CV"}
      </h3>
      <Button variant="ghost" size="icon" onClick={() => setIsOpenDialog(true)}>
        <EditIcon />
      </Button>

      <Dialog open={isOpenDialog} onOpenChange={setIsOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit CV Title</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form
              id="edit-cv-title-form"
              onSubmit={form.handleSubmit(onSubmit)}
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
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit">Continue</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
