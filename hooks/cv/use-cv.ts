import { useMemo } from "react";

import {
  UseMutationOptions,
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";

import {
  deleteCV,
  getCV,
  getCVList,
  postCreateCV,
  postDuplicateCV,
} from "@/lib/api/cv";
import { downloadCV } from "@/lib/api/download";
import { QUERY_KEYS } from "@/lib/constants/query-keys";
import { downloadBlob } from "@/lib/pdf/donwload-blob";

import { CV } from "@/types/cv";
import { TemplateId } from "@/types/template";

import { useAwardsSuspenseQuery } from "./use-awards";
import { useCertificationsSuspenseQuery } from "./use-certifications";
import { useEducationSuspenseQuery } from "./use-education";
import { useLanguagesSuspenseQuery } from "./use-languages";
import { usePersonalInfoSuspenseQuery } from "./use-personal-info";
import { useProjectsSuspenseQuery } from "./use-projects";
import { useSkillsSuspenseQuery } from "./use-skills";
import { useSummarySuspenseQuery } from "./use-summary";
import { useTemplateSuspenseQuery } from "./use-template";
import { useWorkExperienceSuspenseQuery } from "./use-work-experience";

/**
 * Retrieves the CV data from the query client.
 *
 * @param id - The ID of the CV.
 * @returns The CV data if available, otherwise null.
 */
export const useCVQueryData = ({ id }: { id: string }) => {
  const queryClient = useQueryClient();
  const cv = queryClient.getQueryData([QUERY_KEYS.CV_DATA, id]) as
    | CV["cvData"]
    | null
    | undefined;

  return cv;
};

/**
 * Suspense query hook to fetch the complete CV data.
 * @param id The ID of the CV/resume.
 * @returns The complete CV data if available, otherwise null.
 */
export const useCompleteCvSuspenseQuery = (id: string): CV | null => {
  const { data: cvData } = useCVDataSuspenseQuery(id);
  const { data: template } = useTemplateSuspenseQuery(id);
  const { data: personalInfo } = usePersonalInfoSuspenseQuery(id);
  const { data: summary } = useSummarySuspenseQuery(id);
  const { data: workExperience } = useWorkExperienceSuspenseQuery(id);
  const { data: education } = useEducationSuspenseQuery(id);
  const { data: skills } = useSkillsSuspenseQuery(id);
  const { data: languages } = useLanguagesSuspenseQuery(id);
  const { data: projects } = useProjectsSuspenseQuery(id);
  const { data: certifications } = useCertificationsSuspenseQuery(id);
  const { data: awards } = useAwardsSuspenseQuery(id);

  const fullCV = useMemo<CV | null>(() => {
    if (!cvData) return null;

    return {
      cvData,
      personalInfo: personalInfo ?? {
        firstName: "",
        lastName: "",
        professionalTitle: "",
        email: "",
        phone: "",
        city: "",
        country: "",
        linkedIn: "",
        portfolio: "",
      },
      professionalSummary: summary?.professionalSummary ?? "",
      workExperience: (workExperience?.workExperience ?? []).map((item) => ({
        jobTitle: item.jobTitle,
        company: item.company,
        location: item.location,
        employmentType: item.employmentType,
        startDate: item.startDate,
        endDate: item.endDate,
        achievements: item.achievements ?? "",
        toolsAndMethods: item.toolsAndMethods ?? [],
      })),
      education: (education?.education ?? []).map((item) => ({
        degree: item.degree,
        fieldOfStudy: item.fieldOfStudy,
        institution: item.institution,
        location: item.location,
        graduationDate: item.graduationDate,
        grade: item.grade ?? "",
        gradingScale: item.gradingScale ?? "",
        honors: item.honors ?? "",
      })),
      skills: skills ?? { categories: [] },
      languages: languages?.languages ?? [],
      certifications: (certifications?.certifications ?? []).map((item) => ({
        name: item.name,
        issuingOrg: item.issuingOrg,
        issueDate: item.issueDate,
        expirationDate: item.expirationDate ?? "",
        credentialId: item.credentialId ?? "",
      })),
      projects: (projects?.projects ?? []).map((item) => ({
        name: item.name,
        role: item.role,
        startDate: item.startDate,
        endDate: item.endDate,
        description: item.description,
        url: item.url || undefined,
      })),
      awards: (awards?.awards ?? []).map((item) => ({
        name: item.name,
        issuer: item.issuer,
        date: item.date,
        description: item.description,
      })),
      templateId:
        (template?.id as TemplateId) ?? TemplateId.ATS_FRIENDLY_SIMPLE,
    };
  }, [
    awards,
    certifications,
    cvData,
    education,
    languages,
    personalInfo,
    projects,
    skills,
    summary,
    template,
    workExperience,
  ]);

  return fullCV;
};

/**
 * Downloads the CV as a PDF file.
 *
 * @param fileName - The name of the file to be downloaded.
 * @returns The mutation object for downloading the CV.
 */
export const useDownloadCV = (fileName: string) => {
  return useMutation({
    mutationFn: downloadCV,
    onSuccess: (blob) => {
      downloadBlob(blob, fileName);
    },
  });
};

/**
 * Mutation hook to duplicate an existing CV.
 * @param options - The options for the mutation.
 * @returns The mutation object for duplicating the CV.
 */
export const useDuplicateCV = (
  options?: UseMutationOptions<
    boolean,
    Error,
    {
      id: string;
      title: string;
    }
  >
) => {
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
};

/**
 * Mutation hook to delete a CV.
 * @param options - The options for the mutation.
 * @returns The mutation object for deleting the CV.
 */
export const useDeleteCV = (
  options?: UseMutationOptions<
    boolean,
    Error,
    {
      id: string;
    }
  >
) => {
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
};

/**
 * Mutation hook to create a new CV.
 * @param options
 * @returns
 */
export const useCreateCV = (
  options?: UseMutationOptions<
    { id: string; title: string },
    Error,
    {
      title: string;
    }
  >
) => {
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
};

/**
 * Suspense query hook to fetch CV data.
 * @param id The ID of the CV/resume.
 */
export const useCVDataSuspenseQuery = (id: string) => {
  return useSuspenseQuery<CV["cvData"] | null>({
    queryKey: [QUERY_KEYS.CV_DATA, id],
    queryFn: () => getCV(id),
  });
};

/**
 * Suspense query hook to fetch CV list.
 */
export const useCVDataList = () => {
  return useSuspenseQuery<(CV["cvData"] & { templateId: string | null })[]>({
    queryKey: [QUERY_KEYS.CV_LIST],
    queryFn: () => getCVList(),
  });
};
