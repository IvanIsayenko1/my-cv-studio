import { useMediaQuery } from "@/hooks/use-media-query";

import { RESOLUTIONS } from "@/lib/constants/resolutions";

import CVDesktopActions from "../cv-desktop-actions";
import CVDropdownActions from "../cv-dropdown-actions";

export default function CVFormMenu({ id }: { id: string }) {
  // custom hooks
  const isDesktop = useMediaQuery(RESOLUTIONS.DESKTOP);

  return (
    <div className="flex items-center gap-4">
      {/* Desktop actions */}
      {isDesktop && <CVDesktopActions id={id} />}

      {/* Mobile actions */}
      {!isDesktop && <CVDropdownActions id={id} />}
    </div>
  );
}
