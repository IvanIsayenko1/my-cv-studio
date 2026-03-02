"use client";

import { Suspense } from "react";

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

import { LanguagesForm } from "../forms/languages/languages-form";
import { LanguagesFormSkeleton } from "../forms/languages/languages-form-skeleton";
import { PersonalInfoFormSkeleton } from "../forms/personal-info/personal-info-form-skeleton";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import CVFormMenu from "./cv-form-menu/cv-form-menu";
import CVFormMenuSkeleton from "./cv-form-menu/cv-form-menu-skeleton";
import CVFormStatus from "./cv-form-status";
import CVFormTitle from "./cv-form-title";
import CVPreview from "./cv-preview";
import CVPreviewSkeleton from "./cv-preview-skeleton";

export default function CVForm() {
  const params = useParams();
  const id = params.id as string;
  const collapsedSections = JSON.parse(
    localStorage.getItem("cv-form-closed-sections") || "[]"
  ) as string[];

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
          <Suspense
            fallback={
              <PersonalInfoFormSkeleton
                collapsed={collapsedSections.includes("personal-info")}
              />
            }
          >
            <PersonalInfoForm id={id} />
          </Suspense>

          <Suspense
            fallback={
              <SummaryFormSkeleton
                collapsed={collapsedSections.includes("summary")}
              />
            }
          >
            <SummaryForm id={id} />
          </Suspense>

          <Suspense
            fallback={
              <WorkExperienceFormSkeleton
                collapsed={collapsedSections.includes("work-experience")}
              />
            }
          >
            <WorkExperienceForm id={id} />
          </Suspense>

          <Suspense
            fallback={
              <EducationFormSkeleton
                collapsed={collapsedSections.includes("education")}
              />
            }
          >
            <EducationForm id={id} />
          </Suspense>

          <Suspense
            fallback={
              <SkillsFormSkeleton
                collapsed={collapsedSections.includes("skills")}
              />
            }
          >
            <SkillsForm id={id} />
          </Suspense>

          <Suspense
            fallback={
              <LanguagesFormSkeleton
                collapsed={collapsedSections.includes("languages")}
              />
            }
          >
            <LanguagesForm id={id} />
          </Suspense>

          <Suspense
            fallback={
              <CertificationsFormSkeleton
                collapsed={collapsedSections.includes("certifications")}
              />
            }
          >
            <CertificationsForm id={id} />
          </Suspense>

          <Suspense
            fallback={
              <ProjectsFormSkeleton
                collapsed={collapsedSections.includes("projects")}
              />
            }
          >
            <ProjectsForm id={id} />
          </Suspense>

          <Suspense
            fallback={
              <AwardsFormSkeleton
                collapsed={collapsedSections.includes("awards")}
              />
            }
          >
            <AwardsForm id={id} />
          </Suspense>

          <Suspense
            fallback={
              <TemplateFormSkeleton
                collapsed={collapsedSections.includes("template")}
              />
            }
          >
            <TemplateForm id={id} />
          </Suspense>
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
