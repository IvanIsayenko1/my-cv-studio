import { useState } from "react";

import {
  Copy,
  Download,
  EditIcon,
  MoreVerticalIcon,
  Share,
  Trash,
} from "lucide-react";

import DeleteCVDialog from "@/components/dialogs/delete-cv-dialog";
import DuplicateCVDialog from "@/components/dialogs/duplicate-cv-dialog";
import ShareCVDialog from "@/components/dialogs/share-cv-dialog";
import { Button } from "@/components/ui/button";
import {
  MobileOverlay,
  MobileOverlayBody,
  MobileOverlayContent,
  MobileOverlayHeader,
  MobileOverlayTitle,
  MobileOverlayTrigger,
} from "@/components/ui/mobile-overlay";

import { useCVQueryData, useDownloadCV } from "@/hooks/cv/use-cv";
import { useStatus } from "@/hooks/cv/use-status";

import RenameCVDialog from "../dialogs/rename-cv-dialog";

export default function CVDropdownActions({ id }: { id: string }) {
  const cv = useCVQueryData({ id });
  const { data } = useStatus(id);
  const isCVReady = data?.isReady;
  const { mutate: downloadCV, isPending: isDownloadPending } = useDownloadCV(
    cv?.title || "cv.pdf"
  );

  // state of dialogs
  const [openedDelete, setOpenendDelete] = useState(false);
  const [openedDuplicate, setOpenendDuplicate] = useState(false);
  const [openedMenu, setOpenedMenu] = useState(false);
  const [openedRename, setOpenedRename] = useState(false);
  const [openedShare, setOpenedShare] = useState(false);

  const getMenu = () => {
    return (
      <MobileOverlay open={openedMenu} onOpenChange={setOpenedMenu}>
        <MobileOverlayTrigger asChild>
          <Button
            variant={"outline"}
            aria-label="Open menu"
            size={"icon-lg"}
            onClick={(e) => e.stopPropagation()}
          >
            <MoreVerticalIcon />
          </Button>
        </MobileOverlayTrigger>

        <MobileOverlayContent onPointerDownOutside={() => setOpenedMenu(false)}>
          <MobileOverlayHeader>
            <MobileOverlayTitle>CV actions</MobileOverlayTitle>
          </MobileOverlayHeader>

          <MobileOverlayBody className="flex max-h-[70dvh] flex-col gap-2 p-3">
            <Button
              size={"lg"}
              variant="ghost"
              className="font-normal h-14 flex flex-row justify-between"
              disabled={!isCVReady}
              onClick={() => {
                setOpenedMenu(false);
                setOpenedShare(true);
              }}
            >
              <span>Share</span>
              <Share />
            </Button>
            <Button
              size={"lg"}
              variant="ghost"
              className="font-normal h-14 flex flex-row justify-between"
              disabled={!isCVReady}
              onClick={() => {
                setOpenedMenu(false);
                setOpenendDuplicate(true);
              }}
            >
              <span>Duplicate</span>
              <Copy />
            </Button>
            <Button
              size={"lg"}
              variant="ghost"
              className="font-normal h-14 flex flex-row justify-between"
              disabled={!isCVReady || isDownloadPending}
              onClick={() => {
                setOpenedMenu(false);
                downloadCV(id);
              }}
            >
              <span>Download</span>
              <Download />
            </Button>
            <Button
              size={"lg"}
              variant="ghost"
              className="font-normal h-14 flex flex-row justify-between"
              disabled={isDownloadPending}
              onClick={() => {
                setOpenedMenu(false);
                setOpenedRename(true);
              }}
            >
              <span>Rename</span>
              <EditIcon />
            </Button>
            <Button
              size={"lg"}
              variant="ghost"
              className="font-normal h-14 text-destructive flex flex-row justify-between"
              onClick={() => {
                setOpenedMenu(false);
                setOpenendDelete(true);
              }}
              disabled={isDownloadPending}
            >
              <span>Delete</span>
              <Trash />
            </Button>
          </MobileOverlayBody>
        </MobileOverlayContent>
      </MobileOverlay>
    );
  };

  return (
    // Stop click bubbling to CV item/card wrapper.
    <div onClick={(e) => e.stopPropagation()}>
      {getMenu()}
      {/* Mount dialogs at container root to avoid nested trigger reopen loops. */}
      <DeleteCVDialog id={id} open={openedDelete} setOpen={setOpenendDelete} />
      <DuplicateCVDialog
        id={id}
        open={openedDuplicate}
        setOpen={setOpenendDuplicate}
      />
      <RenameCVDialog
        id={id}
        isOpenDialog={openedRename}
        setIsOpenDialog={setOpenedRename}
      />
      <ShareCVDialog id={id} open={openedShare} setOpen={setOpenedShare} />
    </div>
  );
}
