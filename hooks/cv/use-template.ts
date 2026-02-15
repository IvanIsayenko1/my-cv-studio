import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { fetchTemplate, postTemplate } from "@/lib/api/template";
import { QUERY_KEYS } from "@/lib/constants/query-keys";

import { TemplateFormValues } from "@/types/template";

/**
 * Mutation hook to save template settings.
 * @param id The ID of the CV/resume to update.
 */
export function useSaveTemplate(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [QUERY_KEYS.TEMPLATE, id],
    mutationFn: (values: TemplateFormValues) => postTemplate(id, values),
    onSuccess: () => {
      toast.success("Template has been updated");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TEMPLATE, id] });
    },
    onError: (error) => {
      toast.error("Failed to update template");
      console.error(error);
    },
  });
}

/**
 * Suspense query hook to fetch template settings.
 * @param id The ID of the CV/resume.
 */
export function useTemplate(id: string) {
  return useSuspenseQuery({
    queryKey: [QUERY_KEYS.TEMPLATE, id],
    queryFn: () => fetchTemplate(id),
  });
}
