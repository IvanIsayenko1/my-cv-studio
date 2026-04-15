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
  MobileOverlay,
  MobileOverlayClose,
  MobileOverlayContent,
  MobileOverlayDescription,
  MobileOverlayFooter,
  MobileOverlayHeader,
  MobileOverlayTitle,
} from "../ui/mobile-overlay";

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
              variant="destructive"
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeletePending}
            >
              {isDeletePending && <Spinner />}
              {isDeletePending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <MobileOverlay open={open} onOpenChange={setOpen}>
      <MobileOverlayContent onPointerDownOutside={() => setOpen(false)}>
        <MobileOverlayHeader>
          <MobileOverlayTitle>Delete CV</MobileOverlayTitle>
          <MobileOverlayDescription>
            You are about to delete this CV. This action cannot be undone. Are
            you sure you want to continue?
          </MobileOverlayDescription>
        </MobileOverlayHeader>

        <MobileOverlayFooter className="space-y-2">
          <MobileOverlayClose asChild>
            <Button
              variant="outline"
              disabled={isDeletePending}
              onClick={(e) => e.stopPropagation()}
              size={"lg"}
              className="w-full"
            >
              Keep the CV
            </Button>
          </MobileOverlayClose>
          <Button
            type="button"
            onClick={handleDelete}
            disabled={isDeletePending}
            variant="destructive"
            size={"lg"}
            className="w-full"
          >
            {isDeletePending && <Spinner />}
            {isDeletePending ? "Deleting..." : "Delete"}
          </Button>
        </MobileOverlayFooter>
      </MobileOverlayContent>
    </MobileOverlay>
  );
}
