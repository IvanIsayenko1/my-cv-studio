import { useEffect } from "react";

import { useRouter } from "next/navigation";

import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { Spinner } from "@/components/ui/spinner";

import { useDeleteCV } from "@/hooks/cv/use-cv";
import { useMediaQuery } from "@/hooks/use-media-query";

import { QUERY_KEYS } from "@/lib/constants/query-keys";
import { RESOLUTIONS } from "@/lib/constants/resolutions";

import { ROUTES } from "@/config/routes";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "../ui/drawer";

export default function DeleteCVDialog({
  id,
  open,
  setOpen,
}: {
  id: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const queryClient = useQueryClient();
  const router = useRouter();

  const isDesktop = useMediaQuery(RESOLUTIONS.DESKTOP);

  const { mutate: deleteCV, isPending: isDeletePending } = useDeleteCV({
    onSuccess: () => {
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CV_LIST] });
      toast.success("CV has been deleted");
      router.push(ROUTES.MAKER);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete CV");
    },
  });

  const handleDelete = () => {
    deleteCV({ id });
  };

  useEffect(() => {
    if (isDesktop || !open) return;

    const closeOnOutsideTouch = (event: Event) => {
      const target = event.target as Element | null;
      if (!target) return;
      if (target.closest("[data-delete-cv-drawer-content='true']")) return;
      setOpen(false);
    };

    document.addEventListener("touchstart", closeOnOutsideTouch, true);

    return () => {
      document.removeEventListener("touchstart", closeOnOutsideTouch, true);
    };
  }, [isDesktop, open, setOpen]);

  if (isDesktop) {
    return (
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent
          onClick={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <AlertDialogHeader>
            <AlertDialogTitle>Delete CV</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to delete this CV. This action cannot be undone. Are
              you sure you want to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={(e) => e.stopPropagation()}
              disabled={isDeletePending}
            >
              Keep the CV
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeletePending}
            >
              {isDeletePending && <Spinner />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent
        className="mb-4"
        data-delete-cv-drawer-content="true"
        onPointerDownOutside={() => setOpen(false)}
      >
        <DrawerHeader className="text-left">
          <DrawerTitle>Delete CV</DrawerTitle>
          <DrawerDescription>
            You are about to delete this CV. This action cannot be undone. Are
            you sure you want to continue?
          </DrawerDescription>
        </DrawerHeader>

        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button
              variant="outline"
              disabled={isDeletePending}
              onClick={(e) => e.stopPropagation()}
              size={"lg"}
            >
              Keep the CV
            </Button>
          </DrawerClose>
          <Button
            type="button"
            onClick={handleDelete}
            disabled={isDeletePending}
            variant="destructive"
            size={"lg"}
          >
            {isDeletePending && <Spinner />}
            Delete
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
