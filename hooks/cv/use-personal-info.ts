import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { getPersonalInfo, postPersonalInfo } from "@/lib/api/personal-info";
import { QUERY_KEYS } from "@/lib/constants/query-keys";

import { PersonalInfoFormValues } from "@/types/personal-info";

/**
 * Mutation hook to save the personal information section.
 * @param id The ID of the CV/resume to update.
 */
export function useSavePersonalInfo(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [QUERY_KEYS.PERSONAL_INFO, id],
    mutationFn: (values: PersonalInfoFormValues) =>
      postPersonalInfo(id, values),
    onSuccess: () => {
      toast.success("Personal information has been updated");
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.PERSONAL_INFO, id],
      });
    },
    onError: (error) => {
      toast.error("Failed to update personal information");
      console.error(error);
    },
  });
}

/**
 * Suspense query hook to fetch personal information.
 * @param id The ID of the CV/resume.
 */
export function usePersonalInfo(id: string) {
  return useSuspenseQuery({
    queryKey: [QUERY_KEYS.PERSONAL_INFO, id],
    queryFn: () => getPersonalInfo(id),
  });
}
