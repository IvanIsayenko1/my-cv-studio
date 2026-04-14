import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { fetchSummary, postSummary } from "@/lib/api/summary";
import { QUERY_KEYS } from "@/lib/constants/query-keys";

import { SummaryFormValues } from "@/types/summary";

/**
 * Mutation hook to save the professional summary.
 * @param id The ID of the CV/resume to update.
 */
export function useSaveSummary(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [QUERY_KEYS.SUMMARY, id],
    mutationFn: (values: SummaryFormValues) => postSummary(id, values),
    onSuccess: () => {
      toast.success("Summary has been updated");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SUMMARY, id] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.STATUS, id] });
    },
    onError: (error) => {
      toast.error("Failed to update summary");
      console.error(error);
    },
  });
}

/**
 * Suspense query hook to fetch the professional summary.
 * @param id The ID of the CV/resume.
 */
export function useSummarySuspenseQuery(id: string): {
  data: SummaryFormValues;
} {
  return useSuspenseQuery({
    queryKey: [QUERY_KEYS.SUMMARY, id],
    queryFn: () => fetchSummary(id),
  });
}
