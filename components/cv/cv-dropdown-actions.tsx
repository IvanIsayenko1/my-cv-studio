import { useState } from "react";

import { useRouter } from "next/navigation";

import { Copy, Download, MoreHorizontalIcon, Share, Trash } from "lucide-react";

import DeleteCVDialog from "@/components/dialogs/delete-cv-dialog";
import DuplicateCVDialog from "@/components/dialogs/duplicate-cv-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useCVQueryData, useDownloadCV } from "@/hooks/cv/use-cv";
import { useStatus } from "@/hooks/cv/use-status";
import { useMediaQuery } from "@/hooks/use-media-query";

import { RESOLUTIONS } from "@/lib/constants/resolutions";

import { Drawer, DrawerContent, DrawerTrigger } from "../ui/drawer";

export default function CVDropdownActions({ id }: { id: string }) {
  // router
  const router = useRouter();

  // custom hooks
  const isDesktop = useMediaQuery(RESOLUTIONS.DESKTOP);

  const cv = useCVQueryData({ id });
  const { data } = useStatus(id);
  const isCVReady = data?.isReady;
  const { mutate: downloadCV, isPending: isDownloadPending } = useDownloadCV(
    cv?.title || "cv.pdf"
  );

  // state of dialogs
  const [openedDelete, setOpenendDelete] = useState(false);
  const [openedDuplicate, setOpenendDuplicate] = useState(false);

  // Keep markup split by viewport to preserve native-feeling interactions:
  // dropdown menu on desktop, bottom drawer on mobile.
  const getMenu = () => {
    if (isDesktop) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              aria-label="Open menu"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontalIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52 py-2 space-y-1">
            <DropdownMenuItem disabled={!isCVReady}>
              <Share className="h-5 w-5" />
              <span>Share</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={!isCVReady}
              onClick={(e) => {
                // Prevent parent card click/navigation handlers from firing.
                e.stopPropagation();
                setOpenendDuplicate(true);
              }}
            >
              <span className="flex flex-row items-center gap-2">
                <Copy className="h-5 w-5" />
                <span>Duplicate</span>
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={!isCVReady || isDownloadPending}
              onClick={(e) => {
                // Keep action scoped to this menu item only.
                e.stopPropagation();
                downloadCV(id);
              }}
            >
              <Download className="h-5 w-5" />
              <span>Download</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              variant="destructive"
              onClick={(e) => {
                // Avoid bubbling into parent interactive containers.
                e.stopPropagation();
                setOpenendDelete(true);
              }}
            >
              <span className="flex flex-row items-center gap-2">
                <Trash className="h-5 w-5" />
                <span>Delete</span>
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }
    return (
      <Drawer>
        <DrawerTrigger asChild>
          <Button variant="outline" aria-label="Open menu">
            <MoreHorizontalIcon />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="p-2 flex flex-col gap-2">
          {/* Mobile actions mirror desktop behavior with larger touch targets. */}
          <Button
            size={"lg"}
            variant="ghost"
            className="font-normal h-14 flex flex-row justify-between"
            disabled={!isCVReady}
          >
            <span>Share</span>
            <Share />
          </Button>
          <Button
            size={"lg"}
            variant="ghost"
            className="font-normal h-14 flex flex-row justify-between"
            disabled={!isCVReady}
            onClick={() => setOpenendDuplicate(true)}
          >
            <span>Duplicate</span>
            <Copy />
          </Button>
          <Button
            size={"lg"}
            variant="ghost"
            className="font-normal h-14 flex flex-row justify-between"
            disabled={!isCVReady || isDownloadPending}
            onClick={() => downloadCV(id)}
          >
            <span>Download</span>
            <Download />
          </Button>
          <Button
            size={"lg"}
            variant="ghost"
            className="font-normal h-14 text-destructive flex flex-row justify-between"
            onClick={() => setOpenendDelete(true)}
          >
            <span>Delete</span>
            <Trash />
          </Button>
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
    </div>
  );
}
