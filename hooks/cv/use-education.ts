import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { fetchEducation, postEducation } from "@/lib/api/education";
import { QUERY_KEYS } from "@/lib/constants/query-keys";

import { EducationFormValues } from "@/types/education";

/**
 * Mutation hook to save education details.
 * @param id The ID of the CV/resume to update.
 */
export function useSaveEducation(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [QUERY_KEYS.EDUCATION, id],
    mutationFn: (values: EducationFormValues) => postEducation(id, values),
    onSuccess: () => {
      toast.success("Education has been updated");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.EDUCATION, id] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.STATUS, id] });
    },
    onError: (error) => {
      toast.error("Failed to update education");
      console.error(error);
    },
  });
}

/**
 * Suspense query hook to fetch education data.
 * @param id The ID of the CV/resume.
 */
export function useEducationSuspenseQuery(id: string): {
  data: EducationFormValues;
} {
  return useSuspenseQuery({
    queryKey: [QUERY_KEYS.EDUCATION, id],
    queryFn: () => fetchEducation(id),
  });
}
