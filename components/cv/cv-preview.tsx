"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useAwards } from "@/hooks/cv/use-awards";
import { useCertifications } from "@/hooks/cv/use-certifications";
import { useCV } from "@/hooks/cv/use-cv";
import { useEducation } from "@/hooks/cv/use-education";
import { usePersonalInfo } from "@/hooks/cv/use-personal-info";
import { useProjects } from "@/hooks/cv/use-projects";
import { useSkills } from "@/hooks/cv/use-skills";
import { useSummary } from "@/hooks/cv/use-summary";
import { useWorkExperience } from "@/hooks/cv/use-work-experience";

function PreviewSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-2">
      <h3 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        {title}
      </h3>
      {children}
    </section>
  );
}

export default function CVPreview({ id }: { id: string }) {
  const { data: cv } = useCV(id);
  const { data: personalInfo } = usePersonalInfo(id);
  const { data: summary } = useSummary(id);
  const { data: workExperience } = useWorkExperience(id);
  const { data: education } = useEducation(id);
  const { data: skills } = useSkills(id);
  const { data: projects } = useProjects(id);
  const { data: certifications } = useCertifications(id);
  const { data: awards } = useAwards(id);

  const workItems = workExperience?.workExperience ?? [];
  const educationItems = education?.education ?? [];
  const projectItems = projects?.projects ?? [];
  const certificationItems = certifications?.certifications ?? [];
  const awardItems = awards?.awards ?? [];

  const fullName = [personalInfo?.firstName, personalInfo?.lastName]
    .filter(Boolean)
    .join(" ");
  const contactLine = [personalInfo?.email, personalInfo?.phone]
    .filter(Boolean)
    .join(" • ");
  const locationLine = [personalInfo?.city, personalInfo?.country]
    .filter(Boolean)
    .join(", ");

  return (
    <Card className="max-h-[calc(100vh-7.5rem)] overflow-y-auto py-4">
      <CardHeader className="px-4 pb-3">
        <CardTitle className="text-base">Live Preview</CardTitle>
      </CardHeader>

      <CardContent className="space-y-5 px-4 text-sm">
        <section className="space-y-1 border-b border-border pb-4">
          <h2 className="text-lg font-semibold leading-tight">
            {fullName || cv?.title || "Untitled CV"}
          </h2>
          {personalInfo?.professionalTitle ? (
            <p className="text-sm text-muted-foreground">
              {personalInfo.professionalTitle}
            </p>
          ) : null}
          {contactLine ? (
            <p className="text-xs text-muted-foreground">{contactLine}</p>
          ) : null}
          {locationLine ? (
            <p className="text-xs text-muted-foreground">{locationLine}</p>
          ) : null}
        </section>

        {summary?.professionalSummary ? (
          <PreviewSection title="Summary">
            <p className="text-sm leading-relaxed">
              {summary.professionalSummary}
            </p>
          </PreviewSection>
        ) : null}

        {workItems.length > 0 ? (
          <PreviewSection title="Experience">
            <div className="space-y-3">
              {workItems.slice(0, 3).map((item, idx) => (
                <article
                  key={`${item.company}-${item.jobTitle}-${idx}`}
                  className="space-y-1"
                >
                  <p className="font-medium">
                    {item.jobTitle} · {item.company}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {item.startDate} - {item.endDate} · {item.location}
                  </p>
                  {(item.achievements ?? [])
                    .slice(0, 2)
                    .map((achievement, aidx) => (
                      <p
                        key={`${item.company}-achievement-${aidx}`}
                        className="text-sm leading-relaxed"
                      >
                        • {achievement}
                      </p>
                    ))}
                </article>
              ))}
            </div>
          </PreviewSection>
        ) : null}

        {educationItems.length > 0 ? (
          <PreviewSection title="Education">
            <div className="space-y-2">
              {educationItems.slice(0, 2).map((item, idx) => (
                <article
                  key={`${item.institution}-${item.degree}-${idx}`}
                  className="space-y-0.5"
                >
                  <p className="font-medium">
                    {item.degree} in {item.fieldOfStudy}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {item.institution} · {item.graduationDate}
                  </p>
                </article>
              ))}
            </div>
          </PreviewSection>
        ) : null}

        {skills?.skills ? (
          <PreviewSection title="Skills">
            <div className="flex flex-wrap gap-1.5">
              {(skills.skills.categories ?? [])
                .flatMap((category) => category.items)
                .slice(0, 12)
                .map((skill, idx) => (
                  <Badge key={`${skill}-${idx}`} variant="secondary">
                    {skill}
                  </Badge>
                ))}
            </div>
          </PreviewSection>
        ) : null}

        {projectItems.length > 0 ? (
          <PreviewSection title="Projects">
            <div className="space-y-2">
              {projectItems.slice(0, 2).map((project, idx) => (
                <article key={`${project.name}-${idx}`} className="space-y-0.5">
                  <p className="font-medium">
                    {project.name} · {project.role}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {project.startDate} - {project.endDate}
                  </p>
                </article>
              ))}
            </div>
          </PreviewSection>
        ) : null}

        {certificationItems.length > 0 ? (
          <PreviewSection title="Certifications">
            <div className="space-y-1">
              {certificationItems.slice(0, 2).map((item, idx) => (
                <p key={`${item.name}-${idx}`} className="text-sm">
                  {item.name}
                </p>
              ))}
            </div>
          </PreviewSection>
        ) : null}

        {awardItems.length > 0 ? (
          <PreviewSection title="Awards">
            <div className="space-y-1">
              {awardItems.slice(0, 2).map((item, idx) => (
                <p key={`${item.name}-${idx}`} className="text-sm">
                  {item.name}
                </p>
              ))}
            </div>
          </PreviewSection>
        ) : null}
      </CardContent>
    </Card>
  );
}
