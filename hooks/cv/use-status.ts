import { useSuspenseQuery } from "@tanstack/react-query";

import { getStatus } from "@/lib/api/status";
import { QUERY_KEYS } from "@/lib/constants/query-keys";

export function useStatusSuspenseQuery(id: string) {
  return useSuspenseQuery({
    queryKey: [QUERY_KEYS.STATUS, id],
    queryFn: () => getStatus(id),
  });
}
