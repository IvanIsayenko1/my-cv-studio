import { useState } from "react";

import { useRouter } from "next/navigation";

import { Copy, Download, Share, Trash } from "lucide-react";

import DeleteCVDialog from "@/components/dialogs/delete-cv-dialog";
import DuplicateCVDialog from "@/components/dialogs/duplicate-cv-dialog";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";

import { useCVQueryData, useDownloadCV } from "@/hooks/cv/use-cv";
import { useStatus } from "@/hooks/cv/use-status";

export default function CVDesktopActions({ id }: { id: string }) {
  // router
  const router = useRouter();

  // custom hooks
  const cv = useCVQueryData({ id });
  const { data } = useStatus(id);
  const isCVReady = data?.isReady;

  const { mutate: downloadCV, isPending: isDownloadPending } = useDownloadCV(
    cv?.title || "cv.pdf"
  );

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
        open={isOpenDuplicateDialog}
        setOpen={setIsOpenDuplicateDialog}
      />

      <DeleteCVDialog
        id={id}
        open={isOpenDeleteDialog}
        setOpen={setIsOpenDeleteDialog}
      />
    </>
  );
}
