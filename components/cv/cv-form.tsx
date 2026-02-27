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

import { PersonalInfoFormSkeleton } from "../forms/personal-info/personal-info-form-skeleton";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import CVFormMenu from "./cv-form-menu/cv-form-menu";
import CVFormMenuSkeleton from "./cv-form-menu/cv-form-menu-skeleton";
import CVFormStatus from "./cv-form-status";
import CVFormTitle from "./cv-form-title";
import CVPreview from "./cv-preview";
import CVPreviewSkeleton from "./cv-preview-skeleton";

const noopDirtyHandler = () => {};

export default function CVForm() {
  const params = useParams();
  const id = params.id as string;

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
          <Suspense fallback={<PersonalInfoFormSkeleton />}>
            <PersonalInfoForm id={id} />
          </Suspense>

          <Suspense fallback={<SummaryFormSkeleton />}>
            <SummaryForm setIsDirtyForm={noopDirtyHandler} id={id} />
          </Suspense>

          <Suspense fallback={<WorkExperienceFormSkeleton />}>
            <WorkExperienceForm setIsDirtyForm={noopDirtyHandler} id={id} />
          </Suspense>

          <Suspense fallback={<EducationFormSkeleton />}>
            <EducationForm setIsDirtyForm={noopDirtyHandler} id={id} />
          </Suspense>

          <Suspense fallback={<SkillsFormSkeleton />}>
            <SkillsForm setIsDirtyForm={noopDirtyHandler} id={id} />
          </Suspense>

          <Suspense fallback={<CertificationsFormSkeleton />}>
            <CertificationsForm setIsDirtyForm={noopDirtyHandler} id={id} />
          </Suspense>

          <Suspense fallback={<ProjectsFormSkeleton />}>
            <ProjectsForm setIsDirtyForm={noopDirtyHandler} id={id} />
          </Suspense>

          <Suspense fallback={<AwardsFormSkeleton />}>
            <AwardsForm setIsDirtyForm={noopDirtyHandler} id={id} />
          </Suspense>

          <Suspense fallback={<TemplateFormSkeleton />}>
            <TemplateForm setIsDirtyForm={noopDirtyHandler} id={id} />
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
