"use client";

import { useMemo } from "react";

import { useAwards } from "@/hooks/cv/use-awards";
import { useCertifications } from "@/hooks/cv/use-certifications";
import { useCVData } from "@/hooks/cv/use-cv";
import { useEducation } from "@/hooks/cv/use-education";
import { useLanguages } from "@/hooks/cv/use-languages";
import { usePersonalInfo } from "@/hooks/cv/use-personal-info";
import { useProjects } from "@/hooks/cv/use-projects";
import { useSkills } from "@/hooks/cv/use-skills";
import { useSummary } from "@/hooks/cv/use-summary";
import { useWorkExperience } from "@/hooks/cv/use-work-experience";

import { renderATSCleanPreviewHTML } from "@/lib/pdf/templates/ats-friendly-clean-html";

import { CV } from "@/types/cv";
import { TemplateId } from "@/types/template";

export default function CVPreview({ id }: { id: string }) {
  const { data: cvData } = useCVData(id);
  const { data: personalInfo } = usePersonalInfo(id);
  const { data: summary } = useSummary(id);
  const { data: workExperience } = useWorkExperience(id);
  const { data: education } = useEducation(id);
  const { data: skills } = useSkills(id);
  const { data: languages } = useLanguages(id);
  const { data: projects } = useProjects(id);
  const { data: certifications } = useCertifications(id);
  const { data: awards } = useAwards(id);

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
        sortOrder: 0,
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
      templateId: TemplateId.ATS_FRIENDLY_CLEAN,
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
    workExperience,
  ]);

  const htmlPreview = useMemo(() => {
    if (!fullCV) return "";
    return renderATSCleanPreviewHTML(fullCV);
  }, [fullCV]);

  return htmlPreview ? (
    <div className="rounded-xl border-border bg-muted/30">
      <div className="mx-auto w-full max-w-[210mm] overflow-auto rounded-lg border border-border bg-background shadow-xl">
        <iframe
          title="CV PDF preview"
          srcDoc={htmlPreview}
          className="h-[calc(100vh-7rem)]  min-h-[620px] w-full bg-white p-8"
        />
      </div>
    </div>
  ) : (
    <div className="rounded-lg border border-border p-4 text-sm text-muted-foreground ">
      CV preview is unavailable.
    </div>
  );
}
