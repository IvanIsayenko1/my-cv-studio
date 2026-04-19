import { CheckIcon, Pencil } from "lucide-react";

import { Badge } from "@/components/ui/badge";

import { useStatus } from "@/hooks/cv/use-status";

export default function CVStatus({ id }: { id: string }) {
  const { data } = useStatus(id);
  const isCVReady = data?.isReady;

  return isCVReady ? (
    <Badge variant="default">
      <CheckIcon aria-hidden="true" />
      Complete
    </Badge>
  ) : (
    <Badge variant="secondary">
      <Pencil aria-hidden="true" />
      Draft
    </Badge>
  );
}
