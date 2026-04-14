import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { getLanguages, postLanguages } from "@/lib/api/languages";
import { QUERY_KEYS } from "@/lib/constants/query-keys";

import { LanguagesFormValues } from "@/schemas/languages";

/**
 * Mutation hook to save languages.
 * Cleans the input data by filtering out empty languages.
 * @param id The ID of the CV/resume to update.
 */
export function useSaveLanguages(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [QUERY_KEYS.LANGUAGES, id],
    mutationFn: (values: LanguagesFormValues) => {
      const cleaned: LanguagesFormValues = {
        languages: values.languages
          ? values.languages
              .map((l) => ({
                language: l.language.trim(),
                proficiency: l.proficiency,
              }))
              .filter((l) => l.language && l.proficiency)
          : [],
      };
      return postLanguages(id, cleaned);
    },
    onSuccess: () => {
      toast.success("Languages have been updated");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.LANGUAGES, id] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.STATUS, id] });
    },
    onError: (error) => {
      toast.error("Failed to update languages");
      console.error(error);
    },
  });
}

/**
 * Suspense query hook to fetch languages data.
 * @param id The ID of the CV/resume.
 */
export function useLanguagesSuspenseQuery(id: string): {
  data: LanguagesFormValues;
} {
  return useSuspenseQuery({
    queryKey: [QUERY_KEYS.LANGUAGES, id],
    queryFn: () => getLanguages(id),
  });
}
