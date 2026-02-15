import { useState } from "react";

import { useRouter } from "next/navigation";

import { useQueryClient } from "@tanstack/react-query";
import { Copy, Download, MoreHorizontalIcon, Share, Trash } from "lucide-react";
import { toast } from "sonner";

import DeleteCVDialog from "@/components/dialogs/delete-cv-dialog";
import DuplicateCVDialog from "@/components/dialogs/duplicate-cv-dialog";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  useCVQueryData,
  useDeleteCV,
  useDownloadCV,
  useDuplicateCV,
} from "@/hooks/cv/use-cv";
import { useStatus } from "@/hooks/cv/use-status";

import { QUERY_KEYS } from "@/lib/constants/query-keys";

import { ROUTES } from "@/config/routes";

export default function CVMobileDropdownActions({
  id,
  isAutoHide = true,
}: {
  id: string;
  isAutoHide?: boolean;
}) {
  // router
  const router = useRouter();

  // custom hooks
  const queryClient = useQueryClient();
  const cv = useCVQueryData({ id });
  const { data } = useStatus(id);
  const isCVReady = data?.isReady;
  const { mutate: downloadCV, isPending: isDownloadPending } = useDownloadCV(
    cv?.title || "cv.pdf"
  );
  const {
    mutate: duplicateCV,
    isPending: isDuplicatePending,
    error,
  } = useDuplicateCV({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CV_LIST] });
      setIsOpenDuplicateDialog(false);
      toast.success("CV has been duplicated");
    },
  });
  const { mutate: deleteCV, isPending: isDeletePending } = useDeleteCV({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CV_LIST] });
      setIsOpenDeleteDialog(false);
      toast.success("CV has been deleted");
      router.push(ROUTES.DASHBOARD);
    },
  });

  // state of the dialog
  const [isOpenDuplicateDialog, setIsOpenDuplicateDialog] = useState(false);
  const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState(false);

  return (
    <>
      <ButtonGroup className={`flex  ${isAutoHide ? "sm:hidden" : ""}`}>
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
          <DropdownMenuContent
            align="end"
            className="w-52 py-2 space-y-1 sm:w-48 sm:py-1" // more padding on mobile
          >
            <DropdownMenuItem
              className="flex items-center gap-3 py-3 text-base active:bg-accent sm:py-2 sm:text-sm"
              disabled={!isCVReady}
            >
              <Share className="h-5 w-5" />
              <span>Share</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={!isCVReady}
              className="flex items-center gap-3 py-3 text-base active:bg-accent sm:py-2 sm:text-sm"
              onClick={(e) => {
                e.stopPropagation();
                setIsOpenDuplicateDialog(true);
              }}
            >
              <Copy className="h-5 w-5" />
              <span>Duplicate</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={!isCVReady || isDownloadPending}
              className="flex items-center gap-3 py-3 text-base active:bg-accent sm:py-2 sm:text-sm"
              onClick={(e) => {
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
              className="flex items-center gap-3 py-3 text-base text-destructive focus:text-destructive active:bg-destructive/10 sm:py-2 sm:text-sm"
              onClick={(e) => {
                e.stopPropagation();
                setIsOpenDeleteDialog(true);
              }}
            >
              <Trash className="h-5 w-5" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
