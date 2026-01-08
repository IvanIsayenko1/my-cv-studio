import { Copy, Download, MoreHorizontalIcon, Share, Trash } from "lucide-react";
import { Button } from "./ui/button";
import { ButtonGroup } from "./ui/button-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import DuplicateCVDialog from "./dialogs/duplicate-cv-dialog";
import { useState } from "react";
import DeleteCVDialog from "./dialogs/delete-cv-dialog";
import {
  useCVQueryData,
  useDeleteCV,
  useDownloadCV,
  useDuplicateCV,
} from "@/hooks/cv-hooks";
import { toast } from "sonner";
import { routes } from "@/const/routes";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

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
  const { mutate: downloadCV, isPending: isDownloadPending } = useDownloadCV(
    cv?.cvData?.title || "cv.pdf"
  );
  const {
    mutate: duplicateCV,
    isPending: isDuplicatePending,
    error,
  } = useDuplicateCV({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cv-list"] });
      setIsOpenDuplicateDialog(false);
      toast.success("CV has been duplicated");
    },
  });
  const { mutate: deleteCV, isPending: isDeletePending } = useDeleteCV({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cv-list"] });
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
            <DropdownMenuItem className="flex items-center gap-3 py-3 text-base active:bg-accent sm:py-2 sm:text-sm">
              <Share className="h-5 w-5" />
              <span>Share</span>
            </DropdownMenuItem>
            <DropdownMenuItem
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
              className="flex items-center gap-3 py-3 text-base active:bg-accent sm:py-2 sm:text-sm"
              onClick={(e) => {
                e.stopPropagation();
                downloadCV(id);
              }}
              disabled={isDownloadPending}
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
