import { useParams } from "next/navigation";

import { AwardsForm } from "@/components/forms/awards/awards-form";
import { CertificationsForm } from "@/components/forms/certifications/certifications-form";
import { EducationForm } from "@/components/forms/education/education-form";
import { PersonalInfoForm } from "@/components/forms/personal-info/personal-info-form";
import { ProjectsForm } from "@/components/forms/projects/projects-form";
import { SkillsForm } from "@/components/forms/skills/skills-form";
import { SummaryForm } from "@/components/forms/summary/summary-form";
import { WorkExperienceForm } from "@/components/forms/work-experience/work-experience-form";

import { useAwardsSuspenseQuery } from "@/hooks/cv/use-awards";
import { useCertificationsSuspenseQuery } from "@/hooks/cv/use-certifications";
import { useEducationSuspenseQuery } from "@/hooks/cv/use-education";
import { useLanguagesSuspenseQuery } from "@/hooks/cv/use-languages";
import { usePersonalInfoSuspenseQuery } from "@/hooks/cv/use-personal-info";
import { useProjectsSuspenseQuery } from "@/hooks/cv/use-projects";
import { useSkillsSuspenseQuery } from "@/hooks/cv/use-skills";
import { useSummarySuspenseQuery } from "@/hooks/cv/use-summary";
import { useTemplateConfigSuspenseQuery } from "@/hooks/cv/use-template-config";
import { useWorkExperienceSuspenseQuery } from "@/hooks/cv/use-work-experience";

import { DEFAULT_CV_SECTIONS } from "@/lib/constants/cv-sections";

import { LanguagesForm } from "../forms/languages/languages-form";

export default function CVDataForm() {
  const params = useParams();
  const id = params.id as string;

  const { data: personalInfoData } = usePersonalInfoSuspenseQuery(id);
  const { data: summaryData } = useSummarySuspenseQuery(id);
  const { data: awardsData } = useAwardsSuspenseQuery(id);
  const { data: workExperienceData } = useWorkExperienceSuspenseQuery(id);
  const { data: skillsData } = useSkillsSuspenseQuery(id);
  const { data: educationData } = useEducationSuspenseQuery(id);
  const { data: languagesData } = useLanguagesSuspenseQuery(id);
  const { data: certificationsData } = useCertificationsSuspenseQuery(id);
  const { data: projectsData } = useProjectsSuspenseQuery(id);
  const { data: templateConfig } = useTemplateConfigSuspenseQuery(id);

  const sections = templateConfig?.sections?.length
    ? templateConfig.sections
    : DEFAULT_CV_SECTIONS;
  const sectionMap = new Map(sections.map((s) => [s.id, s]));

  const getSectionProps = (sectionId: string) => {
    const section = sectionMap.get(sectionId);
    return {
      sectionLabel: section?.label,
      sectionVisible: section?.visible,
    };
  };

  return (
    <div className="no-scrollbar min-h-0 w-full flex-1 space-y-2 overflow-y-auto pb-4">
      <PersonalInfoForm id={id} formData={personalInfoData} />
      <SummaryForm id={id} formData={summaryData} {...getSectionProps("summary")} />
      <WorkExperienceForm id={id} formData={workExperienceData} {...getSectionProps("experience")} />
      <SkillsForm id={id} formData={skillsData} {...getSectionProps("skills")} />
      <EducationForm id={id} formData={educationData} {...getSectionProps("education")} />
      <LanguagesForm id={id} formData={languagesData} {...getSectionProps("languages")} />
      <CertificationsForm id={id} formData={certificationsData} {...getSectionProps("certifications")} />
      <ProjectsForm id={id} formData={projectsData} {...getSectionProps("projects")} />
      <AwardsForm id={id} formData={awardsData} {...getSectionProps("awards")} />
    </div>
  );
}
