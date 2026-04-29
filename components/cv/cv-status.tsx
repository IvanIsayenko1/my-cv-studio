import { CheckIcon, Pencil } from "lucide-react";

import { Badge } from "@/components/ui/badge";

import { useStatusSuspenseQuery } from "@/hooks/cv/use-status";

export default function CVStatus({ id }: { id: string }) {
  const { data } = useStatusSuspenseQuery(id);
  const isCVReady = data?.isReady;

  return isCVReady ? (
    <Badge variant="default">
      <CheckIcon aria-hidden="true" />
      Ready
    </Badge>
  ) : (
    <Badge variant="secondary">
      <Pencil aria-hidden="true" />
      Draft
    </Badge>
  );
}
