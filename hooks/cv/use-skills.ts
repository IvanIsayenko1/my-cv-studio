import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { getSkills, postSkills } from "@/lib/api/skills";
import { QUERY_KEYS } from "@/lib/constants/query-keys";

import { SkillsFormValues } from "@/types/skills";

/**
 * Mutation hook to save skills.
 * Cleans the input data by filtering out empty skills in technical, hard, soft, and languages categories.
 * @param id The ID of the CV/resume to update.
 */
export function useSaveSkills(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [QUERY_KEYS.SKILLS, id],
    mutationFn: (values: SkillsFormValues) => {
      const cleaned: SkillsFormValues = {
        categories: values.categories
          ? values.categories
              .map((category) => ({
                name: category.name.trim(),
                items: category.items.trim(),
              }))
              .filter((category) => category.name && category.items.length > 0)
          : [],
        languages: values.languages
          ? values.languages
              .map((l) => ({
                language: l.language.trim(),
                proficiency: l.proficiency,
              }))
              .filter((l) => l.language && l.proficiency)
          : [],
      };
      return postSkills(id, cleaned);
    },
    onSuccess: () => {
      toast.success("Skills have been updated");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SKILLS, id] });
    },
    onError: (error) => {
      toast.error("Failed to update skills");
      console.error(error);
    },
  });
}

/**
 * Suspense query hook to fetch skills data.
 * @param id The ID of the CV/resume.
 */
export function useSkills(id: string) {
  return useSuspenseQuery({
    queryKey: [QUERY_KEYS.SKILLS, id],
    queryFn: () => getSkills(id),
  });
}
