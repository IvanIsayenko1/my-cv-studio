import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { toast } from "sonner";

import {
  fetchWorkExperience,
  postWorkExperience,
} from "@/lib/api/work-experience";
import { QUERY_KEYS } from "@/lib/constants/query-keys";

import { WorkExperienceFormValues } from "@/types/work-experience";

/**
 * Mutation hook to save work experience.
 * Cleans the technologies array by trimming and filtering empty strings.
 * @param id The ID of the CV/resume to update.
 */
export function useSaveWorkExperience(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [QUERY_KEYS.WORK_EXPERIENCE, id],
    mutationFn: (values: WorkExperienceFormValues) => {
      const cleaned: WorkExperienceFormValues = {
        workExperience: values.workExperience.map((w) => ({
          ...w,
          technologies: (w.technologies ?? [])
            .map((t) => t.trim())
            .filter(Boolean),
        })),
      };
      return postWorkExperience(id, cleaned);
    },
    onSuccess: () => {
      toast.success("Work experience has been updated");
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.WORK_EXPERIENCE, id],
      });
    },
    onError: (error) => {
      toast.error("Failed to update work experience");
      console.error(error);
    },
  });
}

/**
 * Suspense query hook to fetch work experience data.
 * @param id The ID of the CV/resume.
 */
export function useWorkExperience(id: string) {
  return useSuspenseQuery({
    queryKey: [QUERY_KEYS.WORK_EXPERIENCE, id],
    queryFn: () => fetchWorkExperience(id),
  });
}
