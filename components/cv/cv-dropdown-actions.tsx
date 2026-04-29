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

import { useCVQueryData, useDownloadCV } from "@/hooks/cv/use-cv";
import { useStatusSuspenseQuery } from "@/hooks/cv/use-status";

import RenameCVDialog from "../dialogs/rename-cv-dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";

export default function CVDropdownActions({ id }: { id: string }) {
  const cv = useCVQueryData({ id });
  const { data } = useStatusSuspenseQuery(id);
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
      <Drawer open={openedMenu} onOpenChange={setOpenedMenu}>
        <DrawerTrigger asChild>
          <Button
            variant="outline"
            aria-label="Open menu"
            onClick={(e) => e.stopPropagation()}
            size="icon-lg"
          >
            <MoreVerticalIcon />
          </Button>
        </DrawerTrigger>

        <DrawerContent
          className="mb-4"
          onPointerDownOutside={() => setOpenedMenu(false)}
        >
          <DrawerHeader>
            <DrawerTitle>CV actions</DrawerTitle>
          </DrawerHeader>

          <DrawerDescription className="flex max-h-[70dvh] flex-col gap-2 p-3">
            <Button
              variant="secondary"
              disabled={!isCVReady}
              onClick={() => {
                setOpenedMenu(false);
                setOpenedShare(true);
              }}
            >
              <Share />
              <span>Share</span>
            </Button>
            <Button
              variant="secondary"
              disabled={!isCVReady}
              onClick={() => {
                setOpenedMenu(false);
                setOpenendDuplicate(true);
              }}
            >
              <Copy />
              <span>Duplicate</span>
            </Button>
            <Button
              variant="secondary"
              disabled={!isCVReady || isDownloadPending}
              onClick={() => {
                setOpenedMenu(false);
                downloadCV(id);
              }}
            >
              <Download />
              <span>Download</span>
            </Button>
            <Button
              variant="secondary"
              disabled={isDownloadPending}
              onClick={() => {
                setOpenedMenu(false);
                setOpenedRename(true);
              }}
            >
              <EditIcon />
              <span>Rename</span>
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setOpenedMenu(false);
                setOpenendDelete(true);
              }}
              disabled={isDownloadPending}
            >
              <Trash />
              <span>Delete</span>
            </Button>
          </DrawerDescription>
        </DrawerContent>
      </Drawer>
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
