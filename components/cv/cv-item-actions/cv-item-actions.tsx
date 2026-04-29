import { useState } from "react";

import {
  CopyIcon,
  DownloadIcon,
  EditIcon,
  Share2Icon,
  TrashIcon,
} from "lucide-react";

import DeleteCVDialog from "@/components/dialogs/delete-cv-dialog";
import DuplicateCVDialog from "@/components/dialogs/duplicate-cv-dialog";
import RenameCVDialog from "@/components/dialogs/rename-cv-dialog";
import ShareCVDialog from "@/components/dialogs/share-cv-dialog";
import { Button } from "@/components/ui/button";

import { useCVDataSuspendedQuery, useDownloadCV } from "@/hooks/cv/use-cv";
import { useStatusSuspenseQuery } from "@/hooks/cv/use-status";

export default function CVItemActions({ id }: { id: string }) {
  const { data: cvData } = useCVDataSuspendedQuery(id);
  const { data } = useStatusSuspenseQuery(id);
  const isCVReady = data?.isReady;

  const { mutate: downloadCV, isPending: isDownloadPending } = useDownloadCV(
    cvData?.title || "cv.pdf"
  );

  const [isOpenShareDialog, setIsOpenShareDialog] = useState(false);
  const [isOpenDuplicateDialog, setIsOpenDuplicateDialog] = useState(false);
  const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState(false);
  const [isOpenRenameDialog, setIsOpenRenameDialog] = useState(false);

  return (
    <>
      <div className="flex gap-2">
        <Button
          size="icon-lg"
          variant="outline"
          disabled={!isCVReady}
          onClick={() => {
            setIsOpenShareDialog(true);
          }}
        >
          <Share2Icon />
        </Button>
        <Button
          size="icon-lg"
          variant="outline"
          onClick={() => {
            downloadCV(id);
          }}
          disabled={isDownloadPending || !isCVReady}
        >
          <DownloadIcon />
        </Button>
        <Button
          size="icon-lg"
          variant="outline"
          onClick={() => {
            setIsOpenDuplicateDialog(true);
          }}
          disabled={!isCVReady}
        >
          <CopyIcon />
        </Button>
        <Button
          size="icon-lg"
          variant="outline"
          onClick={() => {
            setIsOpenRenameDialog(true);
          }}
          disabled={!isCVReady}
        >
          <EditIcon />
        </Button>
        <Button
          variant="destructive"
          onClick={() => {
            setIsOpenDeleteDialog(true);
          }}
          disabled={isDownloadPending}
        >
          <TrashIcon />
        </Button>
      </div>

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

      <RenameCVDialog
        id={id}
        isOpenDialog={isOpenRenameDialog}
        setIsOpenDialog={setIsOpenRenameDialog}
      />

      <ShareCVDialog
        id={id}
        open={isOpenShareDialog}
        setOpen={setIsOpenShareDialog}
      />
    </>
  );
}
