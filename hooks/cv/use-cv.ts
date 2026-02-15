import {
  UseMutationOptions,
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";

import { deleteCV, getCV, postCreateCV, postDuplicateCV } from "@/lib/api/cv";
import { downloadCV } from "@/lib/api/download";
import { QUERY_KEYS } from "@/lib/constants/query-keys";
import { downloadBlob } from "@/lib/pdf/donwload-blob";

import { CV } from "@/types/cv";

/**
 * Retrieves the CV data from the query client.
 *
 * @param id - The ID of the CV.
 * @returns The CV data if available, otherwise null.
 */
export function useCVQueryData({ id }: { id: string }) {
  const queryClient = useQueryClient();
  const cv = queryClient.getQueryData([QUERY_KEYS.CV, id]) as
    | CV["cvData"]
    | null
    | undefined;

  return cv;
}

/**
 * Downloads the CV as a PDF file.
 *
 * @param fileName - The name of the file to be downloaded.
 * @returns The mutation object for downloading the CV.
 */
export function useDownloadCV(fileName: string) {
  return useMutation({
    mutationFn: downloadCV,
    onSuccess: (blob) => {
      downloadBlob(blob, fileName);
    },
  });
}

/**
 * Mutation hook to duplicate an existing CV.
 * @param options - The options for the mutation.
 * @returns The mutation object for duplicating the CV.
 */
export function useDuplicateCV(
  options?: UseMutationOptions<
    boolean,
    Error,
    {
      id: string;
      title: string;
    }
  >
) {
  return useMutation<
    boolean,
    Error,
    {
      id: string;
      title: string;
    }
  >({
    mutationFn: ({ id, title }) => postDuplicateCV(id, title),
    ...options,
  });
}

/**
 * Mutation hook to delete a CV.
 * @param options - The options for the mutation.
 * @returns The mutation object for deleting the CV.
 */
export function useDeleteCV(
  options?: UseMutationOptions<
    boolean,
    Error,
    {
      id: string;
    }
  >
) {
  return useMutation<
    boolean,
    Error,
    {
      id: string;
    }
  >({
    mutationFn: ({ id }) => deleteCV(id),
    ...options,
  });
}

/**
 *
 * @param options
 * @returns
 */
export function useCreateCV(
  options?: UseMutationOptions<
    { id: string; title: string },
    Error,
    {
      title: string;
    }
  >
) {
  return useMutation<
    { id: string; title: string },
    Error,
    {
      title: string;
    }
  >({
    mutationFn: ({ title }) => postCreateCV(title),
    ...options,
  });
}

/**
 * Suspense query hook to fetch CV data.
 * @param id The ID of the CV/resume.
 */
export function useCV(id: string) {
  return useSuspenseQuery<CV["cvData"] | null>({
    queryKey: [QUERY_KEYS.CV, id],
    queryFn: () => getCV(id),
  });
}
