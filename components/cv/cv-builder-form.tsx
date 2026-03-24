"use client";

import { CSSProperties, Suspense, useLayoutEffect } from "react";

import { useParams } from "next/navigation";

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

import { LanguagesForm } from "../forms/languages/languages-form";
import { LanguagesFormSkeleton } from "../forms/languages/languages-form-skeleton";
import { PersonalInfoFormSkeleton } from "../forms/personal-info/personal-info-form-skeleton";

export default function CVBuilderForm() {
  const params = useParams();
  const id = params.id as string;
  const collapsedSections = JSON.parse(
    localStorage.getItem(`cv-form-closed-sections-${id}`) || "[]"
  ) as string[];
  const stagger = (value: number) => ({ "--stagger": value }) as CSSProperties;

  return (
    // <div
    //   className="load-stagger grid grid-cols-1 gap-4 lg:grid-cols-2"
    //   style={stagger(2)}
    // >
    <div className="min-h-0 w-full flex-1 space-y-2 overflow-y-auto pb-4 no-scrollbar">
      <div className="load-stagger" style={stagger(3)}>
        <Suspense
          fallback={
            <PersonalInfoFormSkeleton
              collapsed={collapsedSections.includes("personal-info")}
            />
          }
        >
          <PersonalInfoForm id={id} />
        </Suspense>
      </div>

      <div className="load-stagger" style={stagger(4)}>
        <Suspense
          fallback={
            <SummaryFormSkeleton
              collapsed={collapsedSections.includes("summary")}
            />
          }
        >
          <SummaryForm id={id} />
        </Suspense>
      </div>

      <div className="load-stagger" style={stagger(5)}>
        <Suspense
          fallback={
            <WorkExperienceFormSkeleton
              collapsed={collapsedSections.includes("work-experience")}
            />
          }
        >
          <WorkExperienceForm id={id} />
        </Suspense>
      </div>

      <div className="load-stagger" style={stagger(6)}>
        <Suspense
          fallback={
            <SkillsFormSkeleton
              collapsed={collapsedSections.includes("skills")}
            />
          }
        >
          <SkillsForm id={id} />
        </Suspense>
      </div>

      <div className="load-stagger" style={stagger(7)}>
        <Suspense
          fallback={
            <EducationFormSkeleton
              collapsed={collapsedSections.includes("education")}
            />
          }
        >
          <EducationForm id={id} />
        </Suspense>
      </div>

      <div className="load-stagger" style={stagger(8)}>
        <Suspense
          fallback={
            <LanguagesFormSkeleton
              collapsed={collapsedSections.includes("languages")}
            />
          }
        >
          <LanguagesForm id={id} />
        </Suspense>
      </div>

      <div className="load-stagger" style={stagger(9)}>
        <Suspense
          fallback={
            <CertificationsFormSkeleton
              collapsed={collapsedSections.includes("certifications")}
            />
          }
        >
          <CertificationsForm id={id} />
        </Suspense>
      </div>

      <div className="load-stagger" style={stagger(10)}>
        <Suspense
          fallback={
            <ProjectsFormSkeleton
              collapsed={collapsedSections.includes("projects")}
            />
          }
        >
          <ProjectsForm id={id} />
        </Suspense>
      </div>

      <div className="load-stagger" style={stagger(11)}>
        <Suspense
          fallback={
            <AwardsFormSkeleton
              collapsed={collapsedSections.includes("awards")}
            />
          }
        >
          <AwardsForm id={id} />
        </Suspense>
      </div>

      <div className="load-stagger" style={stagger(12)}>
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
    </div>

    //   <aside className="load-stagger hidden lg:block" style={stagger(6)}>
    //     <div className="sticky top-24">
    //       <Suspense fallback={<CVPreviewSkeleton />}>
    //         <CVPreview id={id} />
    //       </Suspense>
    //     </div>
    //   </aside>
    // </div>
  );
}
