import { BadgeCheckIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";

import { useStatus } from "@/hooks/cv/use-status";

export default function CVFormStatus({ id }: { id: string }) {
  const { data } = useStatus(id);
  const isCVReady = data?.isReady;

  return isCVReady ? (
    <Badge
      variant="secondary"
      className={`bg-green-500 text-white dark:bg-green-600 `}
    >
      <BadgeCheckIcon />
      Ready
    </Badge>
  ) : (
    <Badge
      variant="secondary"
      className={`bg-yellow-500 text-white dark:bg-yellow-600`}
    >
      Draft
    </Badge>
  );
}
