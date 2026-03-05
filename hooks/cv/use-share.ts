import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createShareLink,
  getShareInfo,
  revokeShareLink,
  ShareInfoResponse,
} from "@/lib/api/share";
import { QUERY_KEYS } from "@/lib/constants/query-keys";

export function useShareInfo(cvId: string, enabled = true) {
  return useQuery<ShareInfoResponse>({
    queryKey: [QUERY_KEYS.SHARE, cvId],
    queryFn: () => getShareInfo(cvId),
    enabled,
  });
}

export function useCreateShare(cvId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ regenerate = false }: { regenerate?: boolean }) =>
      createShareLink(cvId, regenerate),
    onSuccess: (data) => {
      queryClient.setQueryData([QUERY_KEYS.SHARE, cvId], data);
    },
  });
}

export function useRevokeShare(cvId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => revokeShareLink(cvId),
    onSuccess: () => {
      queryClient.setQueryData([QUERY_KEYS.SHARE, cvId], {
        isShared: false,
        token: null,
        url: null,
      } satisfies ShareInfoResponse);
    },
  });
}
