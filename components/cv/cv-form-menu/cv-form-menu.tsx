import { useRouter } from "next/navigation";

import { ArrowLeftIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";

import { useMediaQuery } from "@/hooks/use-media-query";

import { RESOLUTIONS } from "@/lib/constants/resolutions";

import { ROUTES } from "@/config/routes";

import CVDesktopActions from "../cv-desktop-actions";
import CVDropdownActions from "../cv-dropdown-actions";

export default function CVFormMenu({ id }: { id: string }) {
  // router
  const router = useRouter();

  // custom hooks
  const isDesktop = useMediaQuery(RESOLUTIONS.DESKTOP);

  return (
    <>
      <ButtonGroup>
        <Button
          variant="outline"
          size="icon"
          aria-label="Go Back"
          onClick={() => router.push(ROUTES.MAKER)}
        >
          <ArrowLeftIcon />
        </Button>
      </ButtonGroup>

      {/* Desktop actions */}
      {isDesktop && <CVDesktopActions id={id} />}

      {/* Mobile actions */}
      {!isDesktop && <CVDropdownActions id={id} />}
    </>
  );
}
