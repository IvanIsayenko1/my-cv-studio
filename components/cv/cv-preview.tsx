"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { useAwards } from "@/hooks/cv/use-awards";
import { useCertifications } from "@/hooks/cv/use-certifications";
import { useCVData } from "@/hooks/cv/use-cv";
import { useEducation } from "@/hooks/cv/use-education";
import { useLanguages } from "@/hooks/cv/use-languages";
import { usePersonalInfo } from "@/hooks/cv/use-personal-info";
import { useProjects } from "@/hooks/cv/use-projects";
import { useSkills } from "@/hooks/cv/use-skills";
import { useSummary } from "@/hooks/cv/use-summary";
import { useTemplate } from "@/hooks/cv/use-template";
import { useWorkExperience } from "@/hooks/cv/use-work-experience";

import { renderPreviewHTML } from "@/lib/pdf/templates/render-preview-html";

import { CV } from "@/types/cv";
import { TemplateId } from "@/types/template";

export default function CVPreview({ id }: { id: string }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const [iframeHeight, setIframeHeight] = useState(620);

  const { data: cvData } = useCVData(id);
  const { data: template } = useTemplate(id);
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
      templateId: (template?.id as TemplateId) ?? TemplateId.ATS_FRIENDLY_CLEAN,
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

  const htmlPreview = useMemo(() => {
    if (!fullCV) return "";
    return renderPreviewHTML(fullCV);
  }, [fullCV]);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe || !htmlPreview) return;

    const updateHeight = () => {
      const doc = iframe.contentDocument;
      if (!doc) return;

      const nextHeight = Math.max(
        doc.documentElement.scrollHeight,
        doc.body.scrollHeight,
        620
      );

      setIframeHeight(nextHeight);
    };

    const connectObserver = () => {
      const doc = iframe.contentDocument;
      if (!doc || typeof ResizeObserver === "undefined") return;

      resizeObserverRef.current?.disconnect();

      const observer = new ResizeObserver(() => updateHeight());
      observer.observe(doc.documentElement);
      observer.observe(doc.body);
      resizeObserverRef.current = observer;
    };

    const handleLoad = () => {
      updateHeight();
      connectObserver();
    };

    iframe.addEventListener("load", handleLoad);

    // `srcDoc` can already be available by the time the effect runs.
    handleLoad();

    return () => {
      iframe.removeEventListener("load", handleLoad);
      resizeObserverRef.current?.disconnect();
      resizeObserverRef.current = null;
    };
  }, [htmlPreview]);

  return htmlPreview ? (
    <div className="border-border rounded-xl">
      <div className="border-border mx-auto w-full max-w-[210mm] rounded-xl border bg-white p-8">
        <iframe
          ref={iframeRef}
          title="CV PDF preview"
          srcDoc={htmlPreview}
          style={{ height: `${iframeHeight}px` }}
          className="w-full"
        />
      </div>
    </div>
  ) : (
    <div className="border-border text-muted-foreground rounded-lg border p-4 text-sm">
      CV preview is unavailable.
    </div>
  );
}
