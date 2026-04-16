import { Badge } from "./ui/badge";

export default function SectionStatusBedge({
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
      className={`shrink-0 bg-emerald-700 whitespace-nowrap text-white dark:bg-emerald-600 ${className ?? ""}`}
    >
      {readyText ?? "Ready"}
    </Badge>
  ) : (
    <Badge
      variant="secondary"
      className={`shrink-0 bg-amber-200 whitespace-nowrap text-amber-900 dark:bg-amber-500/30 dark:text-amber-200 ${className ?? ""}`}
    >
      {notReadyText ?? "Draft"}
    </Badge>
  );
}
