"use client";

import { type ReactNode, Suspense, useState } from "react";

import Link from "next/link";
import { useParams } from "next/navigation";

import { ArrowLeftIcon } from "lucide-react";

import { AwardsForm } from "@/components/forms/awards/awards-form";
import AwardsFormSkeleton from "@/components/forms/awards/awards-form-skeleton";
import { CertificationsForm } from "@/components/forms/certifications/certifications-form";
import { CertificationsFormSkeleton } from "@/components/forms/certifications/certifications-form-skeleton";
import { EducationForm } from "@/components/forms/education/education-form";
import { EducationFormSkeleton } from "@/components/forms/education/education-form-skeleton";
import { PersonalInfoForm } from "@/components/forms/personal-info/personal-info-form";
import { ProjectsForm } from "@/components/forms/projects/projects-form";
import ProjectsFormSkeleton from "@/components/forms/projects/projects-form-skeleton";
import { SkillsForm } from "@/components/forms/skills/skills-form";
import { SkillsFormSkeleton } from "@/components/forms/skills/skills-form-skeleton";
import { SummaryForm } from "@/components/forms/summary/summary-form";
import { SummaryFormSkeleton } from "@/components/forms/summary/summary-form-skeleton";
import { TemplateForm } from "@/components/forms/template/template-form";
import TemplateFormSkeleton from "@/components/forms/template/template-form-skeleton";
import { WorkExperienceForm } from "@/components/forms/work-experience/work-experience-form";
import { WorkExperienceFormSkeleton } from "@/components/forms/work-experience/work-experience-form-skeleton";

import { ROUTES } from "@/config/routes";

import { PersonalInfoFormSkeleton } from "../forms/personal-info/personal-info-form-skeleton";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Skeleton } from "../ui/skeleton";
import { Toggle } from "../ui/toggle";
import CVFormMenu from "./cv-form-menu/cv-form-menu";
import CVFormMenuSkeleton from "./cv-form-menu/cv-form-menu-skeleton";
import CVFormStatus from "./cv-form-status";
import CVFormTitle from "./cv-form-title";
import CVPreview from "./cv-preview";
import CVPreviewSkeleton from "./cv-preview-skeleton";

const noopDirtyHandler = () => {};
type SectionKey =
  | "personalInfo"
  | "summary"
  | "workExperience"
  | "education"
  | "skills"
  | "certifications"
  | "projects"
  | "awards"
  | "template";

const DEFAULT_SECTION_VISIBILITY: Record<SectionKey, boolean> = {
  personalInfo: true,
  summary: true,
  workExperience: true,
  education: true,
  skills: true,
  certifications: true,
  projects: true,
  awards: true,
  template: true,
};

const SECTION_LABELS: Record<SectionKey, string> = {
  personalInfo: "Personal Info",
  summary: "Summary",
  workExperience: "Work Experience",
  education: "Education",
  skills: "Skills",
  certifications: "Certifications",
  projects: "Projects",
  awards: "Awards",
  template: "CV Template",
};

function SectionWrapper({
  id,
  title,
  visible,
  onToggle,
  children,
  controls,
}: {
  id: string;
  title: string;
  visible: boolean;
  onToggle: (pressed: boolean) => void;
  children: ReactNode;
  controls?: ReactNode;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-24 space-y-3 border-border/70 pt-6 first:border-t-0 first:pt-0"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <Toggle
          variant="outline"
          size="sm"
          pressed={visible}
          onPressedChange={onToggle}
          aria-label={`Toggle ${title}`}
        >
          {visible ? "Visible" : "Hidden"}
        </Toggle>
      </div>
      {controls}
      {visible ? children : null}
    </section>
  );
}

export default function CVForm() {
  const params = useParams();
  const id = params.id as string;
  const [visibleSections, setVisibleSections] = useState(
    DEFAULT_SECTION_VISIBILITY
  );
  const [projectsSectionTitle, setProjectsSectionTitle] = useState("Projects");

  const toggleSection = (key: SectionKey, pressed: boolean) => {
    setVisibleSections((prev) => ({ ...prev, [key]: pressed }));
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start">
        <Button asChild variant="link" size="lg" className="!p-0">
          <Link href={ROUTES.MAKER} aria-label="Go Back">
            <ArrowLeftIcon aria-hidden="true" /> To the list
          </Link>
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-3 sm:gap-4">
        <div className="min-w-0 flex-1">
          <Suspense fallback={<Skeleton className="h-9 w-32" />}>
            <CVFormTitle id={id} />
          </Suspense>
        </div>
        <Suspense fallback={<Skeleton className="h-6 w-16" />}>
          <CVFormStatus id={id} />
        </Suspense>
        <div className="shrink-0">
          <Suspense fallback={<CVFormMenuSkeleton />}>
            <CVFormMenu id={id} />
          </Suspense>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-2">
          <SectionWrapper
            id="section-personal-info"
            title={SECTION_LABELS.personalInfo}
            visible={visibleSections.personalInfo}
            onToggle={(pressed) => toggleSection("personalInfo", pressed)}
          >
            <Suspense fallback={<PersonalInfoFormSkeleton />}>
              <PersonalInfoForm id={id} />
            </Suspense>
          </SectionWrapper>

          <SectionWrapper
            id="section-summary"
            title={SECTION_LABELS.summary}
            visible={visibleSections.summary}
            onToggle={(pressed) => toggleSection("summary", pressed)}
          >
            <Suspense fallback={<SummaryFormSkeleton />}>
              <SummaryForm setIsDirtyForm={noopDirtyHandler} id={id} />
            </Suspense>
          </SectionWrapper>

          <SectionWrapper
            id="section-work-experience"
            title={SECTION_LABELS.workExperience}
            visible={visibleSections.workExperience}
            onToggle={(pressed) => toggleSection("workExperience", pressed)}
          >
            <Suspense fallback={<WorkExperienceFormSkeleton />}>
              <WorkExperienceForm setIsDirtyForm={noopDirtyHandler} id={id} />
            </Suspense>
          </SectionWrapper>

          <SectionWrapper
            id="section-education"
            title={SECTION_LABELS.education}
            visible={visibleSections.education}
            onToggle={(pressed) => toggleSection("education", pressed)}
          >
            <Suspense fallback={<EducationFormSkeleton />}>
              <EducationForm setIsDirtyForm={noopDirtyHandler} id={id} />
            </Suspense>
          </SectionWrapper>

          <SectionWrapper
            id="section-skills"
            title={SECTION_LABELS.skills}
            visible={visibleSections.skills}
            onToggle={(pressed) => toggleSection("skills", pressed)}
          >
            <Suspense fallback={<SkillsFormSkeleton />}>
              <SkillsForm setIsDirtyForm={noopDirtyHandler} id={id} />
            </Suspense>
          </SectionWrapper>

          <SectionWrapper
            id="section-certifications"
            title={SECTION_LABELS.certifications}
            visible={visibleSections.certifications}
            onToggle={(pressed) => toggleSection("certifications", pressed)}
          >
            <Suspense fallback={<CertificationsFormSkeleton />}>
              <CertificationsForm setIsDirtyForm={noopDirtyHandler} id={id} />
            </Suspense>
          </SectionWrapper>

          <SectionWrapper
            id="section-projects"
            title={projectsSectionTitle}
            visible={visibleSections.projects}
            onToggle={(pressed) => toggleSection("projects", pressed)}
            controls={
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-[10rem_1fr] sm:items-center">
                <p className="text-xs font-medium text-muted-foreground uppercase">
                  Section title
                </p>
                <Input
                  value={projectsSectionTitle}
                  onChange={(e) =>
                    setProjectsSectionTitle(e.target.value || "Projects")
                  }
                  placeholder="Projects"
                />
              </div>
            }
          >
            <Suspense fallback={<ProjectsFormSkeleton />}>
              <ProjectsForm
                setIsDirtyForm={noopDirtyHandler}
                id={id}
                sectionTitle={projectsSectionTitle}
              />
            </Suspense>
          </SectionWrapper>

          <SectionWrapper
            id="section-awards"
            title={SECTION_LABELS.awards}
            visible={visibleSections.awards}
            onToggle={(pressed) => toggleSection("awards", pressed)}
          >
            <Suspense fallback={<AwardsFormSkeleton />}>
              <AwardsForm setIsDirtyForm={noopDirtyHandler} id={id} />
            </Suspense>
          </SectionWrapper>

          <SectionWrapper
            id="section-cv-template"
            title={SECTION_LABELS.template}
            visible={visibleSections.template}
            onToggle={(pressed) => toggleSection("template", pressed)}
          >
            <Suspense fallback={<TemplateFormSkeleton />}>
              <TemplateForm setIsDirtyForm={noopDirtyHandler} id={id} />
            </Suspense>
          </SectionWrapper>
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <Suspense fallback={<CVPreviewSkeleton />}>
              <CVPreview id={id} />
            </Suspense>
          </div>
        </aside>
      </div>
    </div>
  );
}
