import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { toast } from "sonner";

import {
  fetchTemplateConfig,
  postTemplateConfig,
} from "@/lib/api/template-config";
import { QUERY_KEYS } from "@/lib/constants/query-keys";

import { TemplateConfigFormValues } from "@/schemas/template-config";

/**
 * Mutation hook to save template settings.
 * @param id The ID of the CV/resume to update.
 */
export function useSaveTemplateConfig(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [QUERY_KEYS.TEMPLATE_CONFIG, id],
    mutationFn: (values: TemplateConfigFormValues) =>
      postTemplateConfig(id, values),
    onSuccess: () => {
      toast.success("Template config has been updated");
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.TEMPLATE_CONFIG, id],
      });
    },
    onError: (error) => {
      toast.error("Failed to update template config");
      console.error(error);
    },
  });
}

/**
 * Suspense query hook to fetch template settings.
 * @param id The ID of the CV/resume.
 */
export function useTemplateConfigSuspenseQuery(id: string): {
  data: TemplateConfigFormValues;
} {
  return useSuspenseQuery({
    queryKey: [QUERY_KEYS.TEMPLATE_CONFIG, id],
    queryFn: () => fetchTemplateConfig(id),
  });
}
