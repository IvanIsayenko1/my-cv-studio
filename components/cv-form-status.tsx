import { BadgeCheckIcon } from "lucide-react";
import { Badge } from "./ui/badge";
import { useIsCVStatusReady } from "@/hooks/cv-hooks";

export default function CVFormStatus({ id }: { id: string }) {
  const isCVReady = useIsCVStatusReady({ id });

  return isCVReady ? (
    <Badge
      variant="secondary"
      className="bg-green-500 text-white dark:bg-green-600"
    >
      <BadgeCheckIcon />
      Ready
    </Badge>
  ) : (
    <Badge
      variant="secondary"
      className="bg-yellow-500 text-white dark:bg-yellow-600"
    >
      Draft
    </Badge>
  );
}
