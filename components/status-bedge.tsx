import { BadgeCheckIcon } from "lucide-react";

import { Badge } from "./ui/badge";

export default function StatusBedge({
  isReady,
  readyText,
  notReadyText,
  className,
}: {
  isReady: boolean;
  readyText?: string;
  notReadyText?: string;
  className?: string;
}) {
  return isReady ? (
    <Badge
      variant="secondary"
      className={`shrink-0 whitespace-nowrap bg-emerald-600 text-white dark:bg-emerald-500 ${className ?? ""}`}
    >
      {readyText ?? "Ready"}
    </Badge>
  ) : (
    <Badge
      variant="secondary"
      className={`shrink-0 whitespace-nowrap bg-amber-200 text-amber-900 dark:bg-amber-500/30 dark:text-amber-200 ${className ?? ""}`}
    >
      {notReadyText ?? "Draft"}
    </Badge>
  );
}
