import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";

import { getStatus } from "@/lib/api/status";
import { QUERY_KEYS } from "@/lib/constants/query-keys";

export const useStatusSuspenseQuery = (id: string) => {
  return useSuspenseQuery({
    queryKey: [QUERY_KEYS.STATUS, id],
    queryFn: () => getStatus(id),
  });
};

export const useStatusQueryData = (id: string) => {
  const queryClient = useQueryClient();
  return queryClient.getQueryData([QUERY_KEYS.STATUS, id]);
};
