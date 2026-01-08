import { Copy, Download, Share, Trash } from "lucide-react";
import { Button } from "./ui/button";
import { ButtonGroup } from "./ui/button-group";
import DuplicateCVDialog from "./dialogs/duplicate-cv-dialog";
import { useState } from "react";
import DeleteCVDialog from "./dialogs/delete-cv-dialog";
import {
  useCVQueryData,
  useDeleteCV,
  useDownloadCV,
  useDuplicateCV,
  useIsCVStatusReady,
} from "@/hooks/cv-hooks";
import { toast } from "sonner";
import { routes } from "@/const/routes";
import { useRouter } from "next/navigation";

export default function CVDesktopActions({ id }: { id: string }) {
  // router
  const router = useRouter();

  // custom hooks
  const cv = useCVQueryData({ id });
  const isCVReady = useIsCVStatusReady({ id });

  const { mutate: downloadCV, isPending: isDownloadPending } = useDownloadCV(
    cv?.cvData?.title || "cv.pdf"
  );
  const {
    mutate: duplicateCV,
    isPending: isDuplicatePending,
    error,
  } = useDuplicateCV({
    onSuccess: () => {
      setIsOpenDuplicateDialog(false);
      toast.success("CV has been duplicated");
    },
  });
  const { mutate: deleteCV, isPending: isDeletePending } = useDeleteCV({
    onSuccess: () => {
      setIsOpenDeleteDialog(false);
      toast.success("CV has been deleted");
      router.push(routes.dashboard);
    },
  });

  // state of the dialog
  const [isOpenDuplicateDialog, setIsOpenDuplicateDialog] = useState(false);
  const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState(false);

  return (
    <>
      <ButtonGroup className="hidden sm:flex">
        <Button variant="outline" disabled={!isCVReady}>
          <Share />
          Share
        </Button>
        <Button
          variant="outline"
          disabled={!isCVReady}
          onClick={() => setIsOpenDuplicateDialog(true)}
        >
          <Copy />
          Duplicate
        </Button>
        <Button
          variant="outline"
          onClick={() => downloadCV(id)}
          disabled={isDownloadPending || !isCVReady}
        >
          <Download />
          Download
        </Button>
        <Button
          variant="destructive"
          onClick={() => setIsOpenDeleteDialog(true)}
        >
          <Trash />
          Delete
        </Button>
      </ButtonGroup>

      <DuplicateCVDialog
        id={id}
        isDialogOpen={isOpenDuplicateDialog}
        setIsDialogOpen={setIsOpenDuplicateDialog}
        isLoading={isDuplicatePending}
        onSubmitDuplicate={(data) => duplicateCV({ id, title: data.name })}
        errorMessage={error?.message}
      />

      <DeleteCVDialog
        isDialogOpen={isOpenDeleteDialog}
        setIsDialogOpen={setIsOpenDeleteDialog}
        isLoading={isDeletePending}
        onSubmitDelete={() => deleteCV({ id })}
      />
    </>
  );
}
