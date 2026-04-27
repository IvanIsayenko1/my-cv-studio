import { CSSProperties } from "react";

import { useParams } from "next/navigation";

import AwardsFormSkeleton from "@/components/forms/awards/awards-form-skeleton";
import CertificationsFormSkeleton from "@/components/forms/certifications/certifications-form-skeleton";
import EducationFormSkeleton from "@/components/forms/education/education-form-skeleton";
import LanguagesFormSkeleton from "@/components/forms/languages/languages-form-skeleton";
import PersonalInfoFormSkeleton from "@/components/forms/personal-info/personal-info-form-skeleton";
import ProjectsFormSkeleton from "@/components/forms/projects/projects-form-skeleton";
import SkillsFormSkeleton from "@/components/forms/skills/skills-form-skeleton";
import SummaryFormSkeleton from "@/components/forms/summary/summary-form-skeleton";
import TemplateFormSkeleton from "@/components/forms/template/template-form-skeleton";
import WorkExperienceFormSkeleton from "@/components/forms/work-experience/work-experience-form-skeleton";

export default function CVBuilderFormSkeleton() {
  const params = useParams();
  const id = params.id as string;

  const stagger = (value: number) => ({ "--stagger": value }) as CSSProperties;

  const collapsedSections = JSON.parse(
    localStorage.getItem(`cv-form-closed-sections-${id}`) || "[]"
  ) as string[];

  return (
    <div className="no-scrollbar min-h-0 w-full flex-1 space-y-2 overflow-y-auto pb-4">
      <div className="load-stagger" style={stagger(3)}>
        <PersonalInfoFormSkeleton
          collapsed={collapsedSections.includes("personal-info")}
        />
      </div>

      <div className="load-stagger" style={stagger(4)}>
        <SummaryFormSkeleton
          collapsed={collapsedSections.includes("summary")}
        />
      </div>

      <div className="load-stagger" style={stagger(5)}>
        <WorkExperienceFormSkeleton
          collapsed={collapsedSections.includes("work-experience")}
        />
      </div>

      <div className="load-stagger" style={stagger(6)}>
        <SkillsFormSkeleton collapsed={collapsedSections.includes("skills")} />
      </div>

      <div className="load-stagger" style={stagger(7)}>
        <EducationFormSkeleton
          collapsed={collapsedSections.includes("education")}
        />
      </div>

      <div className="load-stagger" style={stagger(8)}>
        <LanguagesFormSkeleton
          collapsed={collapsedSections.includes("languages")}
        />
      </div>

      <div className="load-stagger" style={stagger(9)}>
        <CertificationsFormSkeleton
          collapsed={collapsedSections.includes("certifications")}
        />
      </div>

      <div className="load-stagger" style={stagger(10)}>
        <ProjectsFormSkeleton
          collapsed={collapsedSections.includes("projects")}
        />
      </div>

      <div className="load-stagger" style={stagger(11)}>
        <AwardsFormSkeleton collapsed={collapsedSections.includes("awards")} />
      </div>

      <div className="load-stagger" style={stagger(12)}>
        <TemplateFormSkeleton
          collapsed={collapsedSections.includes("template")}
        />
      </div>
    </div>
  );
}
