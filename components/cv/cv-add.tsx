"use client";

import { CSSProperties, useState } from "react";

import { Plus } from "lucide-react";

import { A4 } from "@/components/shared/a4";
import { Button } from "@/components/ui/button";

import CreateCVDialog from "../dialogs/create-cv-dialog";

export default function CVAdd() {
  const [isOpenDialog, setIsOpenDialog] = useState(false);

  return (
    <>
      <A4 className="load-stagger" style={{ "--stagger": 0 } as CSSProperties}>
        <Button
          className="w-full h-full flex justify-center items-center transition-transform duration-300 group-hover:scale-[1.02]"
          variant="ghost"
          onClick={() => setIsOpenDialog(true)}
        >
          <Plus />
          Create
        </Button>
      </A4>

      <CreateCVDialog
        isOpenDialog={isOpenDialog}
        setIsOpenDialog={setIsOpenDialog}
      />
    </>
  );
}
