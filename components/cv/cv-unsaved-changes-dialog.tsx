"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useUnsavedChangesContext } from "@/lib/contexts/unsaved-changes-context";

export default function CVUnsavedChangesDialog() {
  const { isDialogOpen, setDialogOpen, confirmNavigation } =
    useUnsavedChangesContext();

  return (
    <AlertDialog open={isDialogOpen} onOpenChange={setDialogOpen}>
      <AlertDialogContent>
        <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
        <AlertDialogDescription>
          You have unsaved changes in this CV. Are you sure you want to leave
          without saving?
        </AlertDialogDescription>
        <div className="flex justify-end gap-2">
          <AlertDialogCancel onClick={() => setDialogOpen(false)}>
            Keep Editing
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={confirmNavigation}
            className="bg-destructive hover:bg-destructive/90"
          >
            Discard Changes
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
