"use client";

import { useMemo } from "react";

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

import { categoryItemsToList } from "@/lib/utils/skill-items";

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

function sanitizeRichTextHtml(html: string): string {
  if (!html) return "";
  if (typeof window === "undefined") return html;

  const allowedTags = new Set([
    "p",
    "div",
    "br",
    "strong",
    "b",
    "em",
    "i",
    "ul",
    "ol",
    "li",
  ]);

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  const cleanNode = (node: Node): Node | null => {
    if (node.nodeType === Node.TEXT_NODE) {
      return document.createTextNode(node.textContent ?? "");
    }

    if (node.nodeType !== Node.ELEMENT_NODE) {
      return null;
    }

    const element = node as HTMLElement;
    const tag = element.tagName.toLowerCase();

    if (!allowedTags.has(tag)) {
      const fragment = document.createDocumentFragment();
      for (const child of Array.from(element.childNodes)) {
        const cleanedChild = cleanNode(child);
        if (cleanedChild) fragment.appendChild(cleanedChild);
      }
      return fragment;
    }

    const cleanElement = document.createElement(tag);
    for (const child of Array.from(element.childNodes)) {
      const cleanedChild = cleanNode(child);
      if (cleanedChild) cleanElement.appendChild(cleanedChild);
    }

    return cleanElement;
  };

  const wrapper = document.createElement("div");
  for (const child of Array.from(doc.body.childNodes)) {
    const cleaned = cleanNode(child);
    if (cleaned) wrapper.appendChild(cleaned);
  }

  return wrapper.innerHTML;
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
  const sanitizedSummaryHtml = useMemo(
    () => sanitizeRichTextHtml(summary?.professionalSummary ?? ""),
    [summary?.professionalSummary]
  );

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

        {sanitizedSummaryHtml ? (
          <PreviewSection title="Summary">
            <div
              className="prose prose-sm dark:prose-invert max-w-none text-sm leading-relaxed [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:pl-5"
              dangerouslySetInnerHTML={{ __html: sanitizedSummaryHtml }}
            />
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
                  {item.achievements ? (
                    <PreviewSection title="Summary">
                      <div
                        className="prose prose-sm dark:prose-invert max-w-none text-sm leading-relaxed [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:pl-5"
                        dangerouslySetInnerHTML={{
                          __html: sanitizeRichTextHtml(item.achievements),
                        }}
                      />
                    </PreviewSection>
                  ) : null}
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

        {skills ? (
          <PreviewSection title="Skills">
            <div className="flex flex-wrap gap-1.5">
              {(skills.categories ?? [])
                .flatMap((category) => categoryItemsToList(category.items))
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
