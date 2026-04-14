import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { fetchProjects, postProjects } from "@/lib/api/projects";
import { QUERY_KEYS } from "@/lib/constants/query-keys";

import { ProjectsFormValues } from "@/types/projects";

/**
 * Mutation hook to save projects.
 * Cleans the input data by removing empty strings and filtering out empty projects.
 * @param id The ID of the CV/resume to update.
 */
export function useSaveProjects(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [QUERY_KEYS.PROJECTS, id],
    mutationFn: (values: ProjectsFormValues) => {
      // clean + allow sending explicit empty array
      const cleaned: ProjectsFormValues = {
        projects: (values.projects ?? [])
          .filter(
            (p) =>
              p.name.trim() ||
              p.role.trim() ||
              p.startDate.trim() ||
              p.endDate.trim() ||
              p.description.trim() ||
              p.url?.trim()
          )
          .map((p) => ({
            ...p,
            url: p.url?.trim() || "",
          })),
      };
      return postProjects(id, cleaned);
    },
    onSuccess: () => {
      toast.success("Projects have been updated");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROJECTS, id] });
    },
    onError: (error) => {
      toast.error("Failed to update projects");
      console.error(error);
    },
  });
}

/**
 * Suspense query hook to fetch projects data.
 * @param id The ID of the CV/resume.
 */
export function useProjectsSuspenseQuery(id: string): {
  data: ProjectsFormValues;
} {
  return useSuspenseQuery({
    queryKey: [QUERY_KEYS.PROJECTS, id],
    queryFn: () => fetchProjects(id),
  });
}
