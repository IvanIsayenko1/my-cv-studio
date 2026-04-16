import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "../ui/drawer";

export default function SelectorDrawer({
  open,
  onOpenChange,
  title,
  content,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  content: React.ReactNode;
}) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="mb-4">
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
        </DrawerHeader>
        <DrawerDescription className="max-h-[55vh] space-y-1">
          {content}
        </DrawerDescription>
      </DrawerContent>
    </Drawer>
  );
}
