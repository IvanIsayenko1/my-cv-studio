"use client";

import { Plus } from "lucide-react";
import { A4 } from "./a4";
import { Button } from "./ui/button";
import { routes } from "@/const/routes";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { useState } from "react";

const FormSchema = z.object({
  name: z.string().min(5, {
    message: "Name must be at least 5 characters long.",
  }),
});

export default function CVAdd() {
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    const res = await fetch("/api/cv", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: data.name }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      if (body.error === "Name already in use") {
        form.setError("name", {
          message: "You already have a CV with this name.",
        });
        return;
      }
      return;
    }

    const cv = await res.json(); // { id, title, status }
    setIsOpenDialog(false);
    router.push(routes.cvCreate.replace(":id", cv.id));
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
                <Button type="submit">Continue</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
