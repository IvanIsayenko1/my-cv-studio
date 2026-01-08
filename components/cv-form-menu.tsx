import { routes } from "@/const/routes";
import { ArrowLeftIcon } from "lucide-react";
import { Button } from "./ui/button";
import { ButtonGroup } from "./ui/button-group";
import { useRouter } from "next/navigation";
import CVMobileDropdownActions from "./cv-mobile-dropdown-actions";
import CVDesktopActions from "./cv-desktop-actions";

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
          onClick={() => router.push(routes.dashboard)}
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
