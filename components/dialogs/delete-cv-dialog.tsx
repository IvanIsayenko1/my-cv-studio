import { Spinner } from "../ui/spinner";
import { AlertDialog } from "@radix-ui/react-alert-dialog";
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";

export default function DeleteCVDialog({
  isDialogOpen,
  setIsDialogOpen,
  isLoading,
  onSubmitDelete,
}: {
  isDialogOpen: boolean;
  setIsDialogOpen: (isDialogOpen: boolean) => void;
  isLoading: boolean;
  onSubmitDelete: () => void;
}) {
  return (
    <AlertDialog
      open={isDialogOpen}
      onOpenChange={!isLoading ? setIsDialogOpen : undefined}
    >
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
          <AlertDialogCancel onClick={() => setIsDialogOpen(false)}>
            Keep the CV
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => onSubmitDelete()}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            disabled={isLoading}
          >
            {isLoading && <Spinner />}
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
