"use client";

import { useParams } from "next/navigation";

import { AwardsForm } from "@/components/forms/awards/awards-form";
import { CertificationsForm } from "@/components/forms/certifications/certifications-form";
import { EducationForm } from "@/components/forms/education/education-form";
import { PersonalInfoForm } from "@/components/forms/personal-info/personal-info-form";
import { ProjectsForm } from "@/components/forms/projects/projects-form";
import { SkillsForm } from "@/components/forms/skills/skills-form";
import { SummaryForm } from "@/components/forms/summary/summary-form";
import { TemplateForm } from "@/components/forms/template/template-form";
import { WorkExperienceForm } from "@/components/forms/work-experience/work-experience-form";

import { useAwardsSuspenseQuery } from "@/hooks/cv/use-awards";
import { useCertificationsSuspenseQuery } from "@/hooks/cv/use-certifications";
import { useEducationSuspenseQuery } from "@/hooks/cv/use-education";
import { useLanguagesSuspenseQuery } from "@/hooks/cv/use-languages";
import { usePersonalInfoSuspenseQuery } from "@/hooks/cv/use-personal-info";
import { useProjectsSuspenseQuery } from "@/hooks/cv/use-projects";
import { useSkillsSuspenseQuery } from "@/hooks/cv/use-skills";
import { useSummarySuspenseQuery } from "@/hooks/cv/use-summary";
import { useTemplateSuspenseQuery } from "@/hooks/cv/use-template";
import { useWorkExperienceSuspenseQuery } from "@/hooks/cv/use-work-experience";

import { LanguagesForm } from "../forms/languages/languages-form";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

export default function CVBuilderForm() {
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
  const { data: templateData } = useTemplateSuspenseQuery(id);

  const items = [
    {
      value: "plans",
      trigger: "What subscription plans do you offer?",
      content:
        "We offer three subscription tiers: Starter ($9/month), Professional ($29/month), and Enterprise ($99/month). Each plan includes increasing storage limits, API access, priority support, and team collaboration features.",
    },
    {
      value: "billing",
      trigger: "How does billing work?",
      content:
        "Billing occurs automatically at the start of each billing cycle. We accept all major credit cards, PayPal, and ACH transfers for enterprise customers. You'll receive an invoice via email after each payment.",
    },
    {
      value: "cancel",
      trigger: "How do I cancel my subscription?",
      content:
        "You can cancel your subscription anytime from your account settings. There are no cancellation fees or penalties. Your access will continue until the end of your current billing period.",
    },
  ];

  return (
    <div className="no-scrollbar min-h-0 w-full flex-1 space-y-2 overflow-y-auto pb-4">
      <PersonalInfoForm id={id} formData={personalInfoData} />
      <SummaryForm id={id} formData={summaryData} />
      <WorkExperienceForm id={id} formData={workExperienceData} />
      <SkillsForm id={id} formData={skillsData} />
      <EducationForm id={id} formData={educationData} />
      <LanguagesForm id={id} formData={languagesData} />
      <CertificationsForm id={id} formData={certificationsData} />
      <ProjectsForm id={id} formData={projectsData} />
      <AwardsForm id={id} formData={awardsData} />
      <TemplateForm id={id} formData={templateData} />
      {/* <Card className="w-full">
        <CardHeader>
          <CardTitle>Subscription & Billing</CardTitle>
          <CardDescription>
            Common questions about your account, plans, payments and
            cancellations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion defaultValue={["plans"]} type="multiple">
            {items.map((item) => (
              <AccordionItem key={item.value} value={item.value}>
                <AccordionTrigger>{item.trigger}</AccordionTrigger>
                <AccordionContent>{item.content}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card> */}
    </div>
  );
}
