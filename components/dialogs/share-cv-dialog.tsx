"use client";

import {
  Copy,
  Link2,
  RefreshCcw,
  ShieldBan,
  TriangleAlert,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

import {
  useCreateShare,
  useRevokeShare,
  useShareInfo,
} from "@/hooks/cv/use-share";
import { useMediaQuery } from "@/hooks/use-media-query";

import { RESOLUTIONS } from "@/lib/constants/resolutions";

import {
  MobileOverlay,
  MobileOverlayBody,
  MobileOverlayClose,
  MobileOverlayContent,
  MobileOverlayDescription,
  MobileOverlayFooter,
  MobileOverlayHeader,
  MobileOverlayTitle,
} from "../ui/mobile-overlay";

export default function ShareCVDialog({
  id,
  open,
  setOpen,
}: {
  id: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const isDesktop = useMediaQuery(RESOLUTIONS.DESKTOP);

  const { data: share, isLoading: isShareLoading } = useShareInfo(id, open);
  const { mutate: createShare, isPending: isCreatePending } =
    useCreateShare(id);
  const { mutate: revokeShare, isPending: isRevokePending } =
    useRevokeShare(id);

  const isBusy = isCreatePending || isRevokePending;
  const shareUrl = share?.url ?? "";

  const handleCreate = (regenerate = false) => {
    createShare(
      { regenerate },
      {
        onSuccess: (data) => {
          toast.success(
            regenerate ? "Share link regenerated" : "Share link ready"
          );
          if (data.url) {
            navigator.clipboard
              .writeText(data.url)
              .then(() => toast.success("Link copied"))
              .catch(() => undefined);
          }
        },
        onError: (error) => {
          toast.error(error.message || "Failed to create share link");
        },
      }
    );
  };

  const handleCopy = async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied");
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const handleRevoke = () => {
    revokeShare(undefined, {
      onSuccess: () => toast.success("Share link revoked"),
      onError: (error) => toast.error(error.message || "Failed to revoke link"),
    });
  };

  const content = (
    <>
      <div className="space-y-3">
        <div className="space-y-2">
          <p className="text-sm font-medium">Public CV link</p>
          <Input value={shareUrl} readOnly placeholder="No active share link" />
        </div>

        <p className="text-muted-foreground text-xs">
          Anyone with this link can only view the CV preview and download PDF.
          No editing actions are available.
        </p>

        <div className="flex gap-2 rounded-md border border-amber-500/30 bg-amber-500/10 p-3 text-xs leading-5 text-amber-900 dark:text-amber-200">
          <TriangleAlert className="mt-0.5 size-4 shrink-0" />
          <p>
            This is a live share link. Any update you make to this CV will also
            appear on the shared link.
          </p>
        </div>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        {!shareUrl ? (
          <Button
            disabled={isBusy}
            onClick={() => handleCreate(false)}
            className="justify-between sm:col-span-2"
          >
            {isShareLoading || isCreatePending ? (
              <>
                <span>Preparing link...</span>
                <Spinner />
              </>
            ) : (
              <>
                <span>Create share link</span>
                <Link2 />
              </>
            )}
          </Button>
        ) : (
          <>
            <Button
              variant="outline"
              disabled={isBusy}
              onClick={handleCopy}
              className="justify-between"
            >
              Copy link
              <Copy />
            </Button>

            <Button
              variant="outline"
              disabled={isBusy}
              onClick={() => handleCreate(true)}
              className="justify-between"
            >
              Regenerate
              <RefreshCcw />
            </Button>

            <Button
              variant="destructive"
              disabled={isBusy}
              onClick={handleRevoke}
              className="justify-between sm:col-span-2"
            >
              Revoke link
              <ShieldBan />
            </Button>
          </>
        )}
      </div>
    </>
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share CV</DialogTitle>
            <DialogDescription>
              Generate a public read-only link for recruiters.
            </DialogDescription>
          </DialogHeader>

          {content}

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <MobileOverlay open={open} onOpenChange={setOpen}>
      <MobileOverlayContent onPointerDownOutside={() => setOpen(false)}>
        <MobileOverlayHeader>
          <MobileOverlayTitle>Share CV</MobileOverlayTitle>
          <MobileOverlayDescription>
            Generate a public read-only link for recruiters.
          </MobileOverlayDescription>
        </MobileOverlayHeader>

        <MobileOverlayBody className="space-y-4">{content}</MobileOverlayBody>

        <MobileOverlayFooter>
          <MobileOverlayClose asChild>
            <Button variant="outline" size="lg" className="w-full">
              Close
            </Button>
          </MobileOverlayClose>
        </MobileOverlayFooter>
      </MobileOverlayContent>
    </MobileOverlay>
  );
}
