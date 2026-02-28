import { useMediaQuery } from "@/hooks/use-media-query";

import { RESOLUTIONS } from "@/lib/constants/resolutions";

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

export const RemoveEducationDialog = ({
  open,
  onOpenChange,
  onCancel,
  onRemove,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCancel: () => void;
  onRemove: () => void;
}) => {
  const isDesktop = useMediaQuery(RESOLUTIONS.DESKTOP);

  if (!isDesktop) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent
          className="mb-4"
          data-duplicate-cv-drawer-content="true"
          onPointerDownOutside={() => onOpenChange(false)}
        >
          <DrawerHeader className="text-left">
            <DrawerTitle>Remove this education?</DrawerTitle>
          </DrawerHeader>
          <DrawerDescription className="px-4 text-left text-sm text-muted-foreground">
            This education entry will be permanently removed from your CV. You
            can add it again later if needed.
          </DrawerDescription>
          <DrawerFooter className="pt-2">
            <DrawerClose asChild>
              <Button variant="outline" size={"lg"}>
                Cancel
              </Button>
            </DrawerClose>
            <Button type="submit" variant="destructive" size={"lg"}>
              Remove
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove this education?</AlertDialogTitle>
          <AlertDialogDescription>
            This education entry will be permanently removed from your CV. You
            can add it again later if needed.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={onRemove}
          >
            Remove
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
