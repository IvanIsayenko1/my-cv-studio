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

type RemoveSkillsDialogProps = {
  open: boolean;
  title: string;
  description: string;
  onOpenChange: (open: boolean) => void;
  onCancel: () => void;
  onRemove: () => void;
};

export const RemoveSkillsDialog = ({
  open,
  title,
  description,
  onOpenChange,
  onCancel,
  onRemove,
}: RemoveSkillsDialogProps) => {
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
            <DrawerTitle>{title}</DrawerTitle>
          </DrawerHeader>
          <DrawerDescription className="text-muted-foreground px-4 text-left text-sm">
            {description}
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
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
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
