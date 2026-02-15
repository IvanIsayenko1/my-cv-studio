"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import z from "zod";

import { A4 } from "@/components/shared/a4";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
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

import { useCreateCV } from "@/hooks/cv/use-cv";

import { ROUTES } from "@/config/routes";

export const FormSchema = z.object({
  name: z.string().min(5, {
    message: "Name must be at least 5 characters long.",
  }),
});

export default function CVAdd() {
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const router = useRouter();

  const { mutate: createCV, isPending: isCreatePending } = useCreateCV({
    onSuccess: ({ id }) => {
      setIsOpenDialog(false);
      toast.success("CV has been created");
      router.push(ROUTES.CV_DETAIL.replace(":id", id));
    },
    onError: (error) => {
      if (error.message === "Name already in use") {
        form.setError("name", {
          message: "You already have a CV with this name.",
        });
        return;
      }

      toast.error(error.message);
    },
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    createCV({ title: data.name });
  };

  return (
    <>
      <A4>
        <Button
          className="w-full h-full flex justify-center items-center"
          variant="ghost"
          onClick={() => setIsOpenDialog(true)}
        >
          <Plus />
          Create
        </Button>
      </A4>

      <Dialog open={isOpenDialog} onOpenChange={setIsOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New CV</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form
              id="new-cv-form"
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
                <Button type="submit" disabled={isCreatePending}>
                  {isCreatePending ? "Creating..." : "Continue"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
