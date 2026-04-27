import { useForm } from "react-hook-form";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { DialogClose } from "@radix-ui/react-dialog";
import { toast } from "sonner";

import { useCreateCV } from "@/hooks/cv/use-cv";
import { useMediaQuery } from "@/hooks/use-media-query";

import { RESOLUTIONS } from "@/lib/constants/resolutions";

import { CVNameFormValues, cvNameSchema } from "@/schemas/cv-name";

import { ROUTES } from "@/config/routes";

import { Button } from "../ui/button";
import {
  Dialog,
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

export default function CreateCVDialog({
  isOpenDialog,
  setIsOpenDialog,
}: {
  isOpenDialog: boolean;
  setIsOpenDialog: (value: boolean) => void;
}) {
  const isDesktop = useMediaQuery(RESOLUTIONS.DESKTOP);
  const router = useRouter();
  const formId = "create-cv-form";

  const form = useForm<CVNameFormValues>({
    resolver: zodResolver(cvNameSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (data: CVNameFormValues) => {
    createCV({ title: data.name });
  };

  const { mutate: createCV, isPending: isCreatePending } = useCreateCV({
    onSuccess: ({ id }) => {
      setIsOpenDialog(false);
      toast.success("CV has been created");
      router.push(ROUTES.CV_BUILD.replace(":id", id));
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

  const formInput = (
    <FormField
      control={form.control}
      name="name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>New CV Name</FormLabel>
          <FormControl>
            <Input type="text" {...field} className={isDesktop ? "" : "h-10"} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  if (isDesktop) {
    return (
      <Dialog open={isOpenDialog} onOpenChange={setIsOpenDialog}>
        <DialogContent
          onClick={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <DialogHeader>
            <DialogTitle>Create CV</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form
              id={formId}
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
            >
              {formInput}

              <DialogFooter>
                <Button type="submit" disabled={isCreatePending}>
                  {isCreatePending && <Spinner />}
                  {isCreatePending ? "Creating..." : "Create"}
                </Button>
                <DialogClose asChild>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={(e) => e.stopPropagation()}
                  >
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
          <DrawerTitle>Create CV</DrawerTitle>
        </DrawerHeader>
        <DrawerDescription asChild>
          <Form {...form}>
            <form
              id={formId}
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 px-4"
            >
              {formInput}
            </form>
          </Form>
        </DrawerDescription>
        <DrawerFooter>
          <Button
            type="submit"
            form={formId}
            disabled={isCreatePending}
            size={"lg"}
          >
            {isCreatePending && <Spinner />}
            {isCreatePending ? "Creating..." : "Create"}
          </Button>
          <DrawerClose asChild>
            <Button
              variant="outline"
              disabled={isCreatePending}
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
