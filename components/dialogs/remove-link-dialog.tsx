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

type RemoveLinkDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCancel: () => void;
  onRemove: () => void;
  linkLabel?: string;
};

export const RemoveLinkDialog = ({
  open,
  onOpenChange,
  onCancel,
  onRemove,
  linkLabel = "this link",
}: RemoveLinkDialogProps) => {
  const isDesktop = useMediaQuery(RESOLUTIONS.DESKTOP);

  if (!isDesktop) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent
          className="mb-4"
          data-remove-link-drawer-content="true"
          onPointerDownOutside={() => onOpenChange(false)}
        >
          <DrawerHeader className="text-left">
            <DrawerTitle>Remove this link?</DrawerTitle>
          </DrawerHeader>
          <DrawerDescription className="text-muted-foreground px-4 text-left text-sm">
            The "{linkLabel}" link will be permanently removed from your personal
            information. You can add it again later if needed.
          </DrawerDescription>
          <DrawerFooter className="pt-2">
            <DrawerClose asChild>
              <Button variant="outline" size="lg" onClick={onCancel}>
                Cancel
              </Button>
            </DrawerClose>
            <Button
              type="button"
              variant="destructive"
              size="lg"
              onClick={onRemove}
            >
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
          <AlertDialogTitle>Remove this link?</AlertDialogTitle>
          <AlertDialogDescription>
            The "{linkLabel}" link will be permanently removed from your personal
            information. You can add it again later if needed.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={onRemove}>
            Remove
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
