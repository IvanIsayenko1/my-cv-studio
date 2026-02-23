import { BadgeCheckIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";

import { useStatus } from "@/hooks/cv/use-status";

export default function CVFormStatus({ id }: { id: string }) {
  const { data } = useStatus(id);
  const isCVReady = data?.isReady;

  return isCVReady ? (
    <Badge
      variant="secondary"
      className="shrink-0 whitespace-nowrap bg-emerald-600 text-white dark:bg-emerald-500"
    >
      <BadgeCheckIcon aria-hidden="true" />
      Ready
    </Badge>
  ) : (
    <Badge
      variant="secondary"
      className="shrink-0 whitespace-nowrap bg-amber-200 text-amber-900 dark:bg-amber-500/30 dark:text-amber-200"
    >
      Draft
    </Badge>
  );
}
