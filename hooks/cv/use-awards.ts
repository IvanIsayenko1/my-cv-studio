import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { fetchAwards, postAwards } from "@/lib/api/awards";
import { QUERY_KEYS } from "@/lib/constants/query-keys";

import { AwardsFormValues } from "@/types/awards";

/**
 * Mutation hook to save awards.
 * Cleans the input data by filtering out empty awards suitable for backend processing.
 * @param id The ID of the CV/resume to update.
 */
export function useSaveAwards(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [QUERY_KEYS.AWARDS, id],
    mutationFn: (values: AwardsFormValues) => {
      const cleaned: AwardsFormValues = {
        awards: (values.awards ?? []).filter(
          (a) =>
            a.name.trim() ||
            a.issuer.trim() ||
            a.date.trim() ||
            a.description.trim()
        ),
      };
      return postAwards(id, cleaned);
    },
    onSuccess: () => {
      toast.success("Awards have been updated");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.AWARDS, id] });
    },
    onError: (error) => {
      toast.error("Failed to update awards");
      console.error(error);
    },
  });
}

/**
 * Suspense query hook to fetch awards data.
 * @param id The ID of the CV/resume.
 */
export function useAwards(id: string) {
  return useSuspenseQuery({
    queryKey: [QUERY_KEYS.AWARDS, id],
    queryFn: () => fetchAwards(id),
  });
}
