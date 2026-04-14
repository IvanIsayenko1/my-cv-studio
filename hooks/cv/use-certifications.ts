import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { toast } from "sonner";

import {
  fetchCertifications,
  postCertifications,
} from "@/lib/api/certifications";
import { QUERY_KEYS } from "@/lib/constants/query-keys";

import { CertificationsFormValues } from "@/types/certifications";

/**
 * Mutation hook to save certifications.
 * Filters empty certifications before sending to the API.
 * @param id The ID of the CV/resume to update.
 */
export function useSaveCertifications(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [QUERY_KEYS.CERTIFICATIONS, id],
    mutationFn: (values: CertificationsFormValues) => {
      const cleaned: CertificationsFormValues = {
        certifications: (values.certifications ?? []).filter(
          (c) =>
            c.name.trim() ||
            c.issuingOrg.trim() ||
            c.issueDate.trim() ||
            c.expirationDate?.trim() ||
            c.credentialId?.trim()
        ),
      };
      return postCertifications(id, cleaned);
    },
    onSuccess: () => {
      toast.success("Certifications have been updated");
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.CERTIFICATIONS, id],
      });
    },
    onError: (error) => {
      toast.error("Failed to update certifications");
      console.error(error);
    },
  });
}

/**
 * Suspense query hook to fetch certifications data.
 * @param id The ID of the CV/resume.
 */
export function useCertificationsSuspenseQuery(id: string): {
  data: CertificationsFormValues;
} {
  return useSuspenseQuery({
    queryKey: [QUERY_KEYS.CERTIFICATIONS, id],
    queryFn: () => fetchCertifications(id),
  });
}
