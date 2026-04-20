import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

import { useCVQueryData } from "@/hooks/cv/use-cv";
import { useMediaQuery } from "@/hooks/use-media-query";

import { useUpdateCVTitle } from "@/lib/api/cv";
import { RESOLUTIONS } from "@/lib/constants/resolutions";

import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "../ui/drawer";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Spinner } from "../ui/spinner";

const FormSchema = z.object({
  name: z.string().min(5, {
    message: "Name must be at least 5 characters long.",
  }),
});
type FormValues = z.infer<typeof FormSchema>;

export default function RenameCVDialog({
  isOpenDialog,
  setIsOpenDialog,
  id,
}: {
  isOpenDialog: boolean;
  setIsOpenDialog: (value: boolean) => void;
  id: string;
}) {
  const isDesktop = useMediaQuery(RESOLUTIONS.DESKTOP);
  const cv = useCVQueryData({ id });

  const { mutate: updateTitle, isPending: isUpdatePending } =
    useUpdateCVTitle();

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: cv?.title || "",
    },
  });

  const onSubmit = (values: FormValues) => {
    updateTitle({ id, title: values.name });
    setIsOpenDialog(false);
  };

  const formId = "rename-cv-form";
  const formField = (
    <FormField
      control={form.control}
      name="name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>New CV name</FormLabel>
          <FormControl>
            <Input type="text" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  if (isDesktop) {
    return (
      <Dialog open={isOpenDialog} onOpenChange={setIsOpenDialog}>
        <DialogContent onClick={(e) => e.stopPropagation()} onPointerDown={(e) => e.stopPropagation()}>
          <DialogHeader>
            <DialogTitle>Rename CV</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form
              id={formId}
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
            >
              {formField}

              <DialogFooter>
                <Button type="submit" disabled={isUpdatePending}>
                  {isUpdatePending && <Spinner />}
                  {isUpdatePending ? "Updating..." : "Update"}
                </Button>
                <DialogClose asChild>
                  <Button type="button" variant="outline" onClick={(e) => e.stopPropagation()}>
                    Cancel
                  </Button>
                </DialogClose>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={isOpenDialog} onOpenChange={setIsOpenDialog}>
      <DrawerContent onPointerDownOutside={() => setIsOpenDialog(false)}>
        <DrawerHeader>
          <DrawerTitle>Rename CV</DrawerTitle>
        </DrawerHeader>
        <DrawerDescription asChild>
          <div className="px-4">
            <Form {...form}>
              <form
                id={formId}
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                {formField}
              </form>
            </Form>
          </div>
        </DrawerDescription>
        <DrawerFooter>
          <Button
            type="submit"
            form={formId}
            disabled={isUpdatePending}
            size={"lg"}
            className="w-full"
          >
            {isUpdatePending && <Spinner />}
            {isUpdatePending ? "Updating..." : "Update"}
          </Button>
          <DrawerClose asChild>
            <Button
              variant="outline"
              disabled={isUpdatePending}
              onClick={(e) => e.stopPropagation()}
              size={"lg"}
              className="w-full"
            >
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
