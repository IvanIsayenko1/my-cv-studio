import { fetchDeleteCV, fetchDuplicateCV } from "@/lib/fetches/cv-fetches";
import { downloadCV } from "@/lib/fetches/download-cv-fetches";
import { downloadBlob } from "@/lib/pdf/donwload-blob";
import { CV } from "@/types/cv";
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query";

/**
 * Checks if the CV status is ready.
 *
 * @param id - The ID of the CV.
 * @returns True if the CV status is ready, false otherwise.
 */
export function useIsCVStatusReady({ id }: { id: string }) {
  const queryClient = useQueryClient();
  const cv = queryClient.getQueryData(["cv", id]) as CV | null | undefined;

  return (
    !!cv?.personalInfo &&
    !!cv?.professionalSummary &&
    !!cv?.education &&
    !!cv?.workExperience &&
    !!cv?.skills
  );
}

/**
 * Retrieves the CV data from the query client.
 *
 * @param id - The ID of the CV.
 * @returns The CV data if available, otherwise null.
 */
export function useCVQueryData({ id }: { id: string }) {
  const queryClient = useQueryClient();
  const cv = queryClient.getQueryData(["cv", id]) as CV | null | undefined;

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
 * Duplicates the CV.
 *
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
    mutationFn: ({ id, title }) => fetchDuplicateCV(id, title),
    ...options,
  });
}

/**
 * Deletes the CV.
 *
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
    mutationFn: ({ id }) => fetchDeleteCV(id),
    ...options,
  });
}
