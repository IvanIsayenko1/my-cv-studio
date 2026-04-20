"use client";

import { CSSProperties, useState } from "react";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

import CreateCVDialog from "../dialogs/create-cv-dialog";

export default function CVAdd() {
  const [isOpenDialog, setIsOpenDialog] = useState(false);

  return (
    <>
      <div
        className="load-stagger flex min-h-32 items-center justify-center overflow-hidden rounded-4xl border border-border/50 bg-muted/30 transition-all duration-300 hover:border-border hover:bg-muted/50 cursor-pointer group/add"
        style={{ "--stagger": 0 } as CSSProperties}
        onClick={() => setIsOpenDialog(true)}
      >
        <Button
          className="flex items-center gap-2 transition-transform duration-300 group-hover/add:scale-[1.05]"
          variant="ghost"
          onClick={() => setIsOpenDialog(true)}
        >
          <Plus className="h-5 w-5" />
          <span>Create CV</span>
        </Button>
      </div>

      <CreateCVDialog
        isOpenDialog={isOpenDialog}
        setIsOpenDialog={setIsOpenDialog}
      />
    </>
  );
}
