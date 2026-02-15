import { useRouter } from "next/navigation";

import { ArrowLeftIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";

import { ROUTES } from "@/config/routes";

import CVDesktopActions from "../cv-desktop-actions";
import CVMobileDropdownActions from "../cv-mobile-dropdown-actions";

export default function CVFormMenu({ id }: { id: string }) {
  // router
  const router = useRouter();

  return (
    <>
      <ButtonGroup>
        <Button
          variant="outline"
          size="icon"
          aria-label="Go Back"
          onClick={() => router.push(ROUTES.DASHBOARD)}
        >
          <ArrowLeftIcon />
        </Button>
      </ButtonGroup>

      {/* Desktop actions */}
      <CVDesktopActions id={id} />

      {/* Mobile actions */}
      <CVMobileDropdownActions id={id} />
    </>
  );
}
