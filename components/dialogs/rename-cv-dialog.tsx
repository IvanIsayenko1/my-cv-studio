import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

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

  const { mutate: updateTitle, isPending: isUpdatePending } =
    useUpdateCVTitle();

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "", // initial empty; will hydrate in useEffect
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
        <DialogContent>
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
                  <Button type="button" variant="outline">
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
      <DrawerContent
        className="mb-4"
        data-duplicate-cv-drawer-content="true"
        onPointerDownOutside={() => setIsOpenDialog(false)}
      >
        <DrawerHeader className="text-left">
          <DrawerTitle>Rename CV</DrawerTitle>
        </DrawerHeader>
        <Form {...form}>
          <form
            id={formId}
            onSubmit={form.handleSubmit(onSubmit)}
            className="m-4 space-y-4"
          >
            {formField}
          </form>
        </Form>
        <DrawerFooter className="pt-2">
          <Button
            type="submit"
            form={formId}
            disabled={isUpdatePending}
            size={"lg"}
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
            >
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
