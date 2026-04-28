"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { useAwardsSuspenseQuery } from "@/hooks/cv/use-awards";
import { useCertificationsSuspenseQuery } from "@/hooks/cv/use-certifications";
import { useCVData } from "@/hooks/cv/use-cv";
import { useEducationSuspenseQuery } from "@/hooks/cv/use-education";
import { useLanguagesSuspenseQuery } from "@/hooks/cv/use-languages";
import { usePersonalInfoSuspenseQuery } from "@/hooks/cv/use-personal-info";
import { useProjectsSuspenseQuery } from "@/hooks/cv/use-projects";
import { useSkillsSuspenseQuery } from "@/hooks/cv/use-skills";
import { useStatus } from "@/hooks/cv/use-status";
import { useSummarySuspenseQuery } from "@/hooks/cv/use-summary";
import { useTemplateSuspenseQuery } from "@/hooks/cv/use-template";
import { useTemplateConfigSuspenseQuery } from "@/hooks/cv/use-template-config";
import { useWorkExperienceSuspenseQuery } from "@/hooks/cv/use-work-experience";

import { renderPreviewHTML } from "@/lib/pdf/templates/render-preview-html";

import { CV } from "@/types/cv";
import { TemplateId } from "@/types/template";

const MM_TO_PX = 96 / 25.4;
const PAGE_WIDTH_MM = 210;
const PAGE_HEIGHT_MM = 297;
const PAGE_MARGIN_MM = 16;
const PAGE_WIDTH_PX = PAGE_WIDTH_MM * MM_TO_PX;
const PAGE_HEIGHT_PX = PAGE_HEIGHT_MM * MM_TO_PX;
const PAGE_MARGIN_PX = PAGE_MARGIN_MM * MM_TO_PX;
const PRINTABLE_WIDTH_PX = PAGE_WIDTH_PX - PAGE_MARGIN_PX * 2;
const PRINTABLE_HEIGHT_PX = PAGE_HEIGHT_PX - PAGE_MARGIN_PX * 2;

type PageMetrics = {
  pageStarts: number[];
  totalHeight: number;
};

// How far back from pageEnd we're willing to move the break to land on a
// block boundary. Covers up to ~2 wrapped text lines (≈36px) plus a little
// extra for larger fonts used in the Visual template.
const SNAP_THRESHOLD_PX = 40;

function computePageStarts(doc: Document, totalHeight: number) {
  // Collect both top and bottom edges of every block-level text element so
  // we can snap the page break to either edge — whichever is closest to
  // pageEnd — without splitting a line in half.
  const blocks = Array.from(
    doc.querySelectorAll<HTMLElement>(
      "p, li, h1, h2, h3, h4, h5, h6, .mini-block"
    )
  )
    .map((el) => ({
      top: el.offsetTop,
      bottom: el.offsetTop + el.offsetHeight,
    }))
    .filter(({ bottom }) => bottom > 0)
    .sort((a, b) => a.top - b.top);

  const pageStarts = [0];
  let currentStart = 0;

  while (currentStart + PRINTABLE_HEIGHT_PX < totalHeight - 1) {
    const pageEnd = currentStart + PRINTABLE_HEIGHT_PX;

    // Collect every element edge that is:
    //   • a bottom edge  ≤ pageEnd and within threshold  (element ends just before cut)
    //   • a top edge     < pageEnd and bottom > pageEnd  (element straddles the cut)
    //     and that top is within threshold of pageEnd
    // Then pick the edge closest to pageEnd — this is the safest break point.
    let best: number | null = null;

    for (const { top, bottom } of blocks) {
      if (top <= currentStart) continue;

      if (bottom <= pageEnd && pageEnd - bottom <= SNAP_THRESHOLD_PX) {
        if (best === null || bottom > best) best = bottom;
      }

      if (
        top < pageEnd &&
        bottom > pageEnd &&
        pageEnd - top <= SNAP_THRESHOLD_PX
      ) {
        if (best === null || top > best) best = top;
      }
    }

    const nextStart = best ?? pageEnd;
    pageStarts.push(nextStart);
    currentStart = nextStart;
  }

  return pageStarts;
}

function PreviewPage({
  htmlPreview,
  pageStart,
  visibleHeight,
  totalHeight,
  scale,
}: {
  htmlPreview: string;
  pageStart: number;
  visibleHeight: number;
  totalHeight: number;
  scale: number;
}) {
  const marginH = PAGE_MARGIN_PX * scale;
  const marginW = PAGE_MARGIN_PX * scale;

  return (
    <article
      className="border-border relative w-full overflow-hidden rounded-3xl border bg-white shadow-lg"
      style={{ aspectRatio: `${PAGE_WIDTH_MM} / ${PAGE_HEIGHT_MM}` }}
    >
      <div
        className="absolute overflow-hidden"
        style={{
          top: marginH,
          left: marginW,
          width: PRINTABLE_WIDTH_PX * scale,
          height: visibleHeight * scale,
        }}
      >
        <iframe
          title={`CV preview page`}
          srcDoc={htmlPreview}
          scrolling="no"
          className="block border-0 bg-white"
          style={{
            width: PRINTABLE_WIDTH_PX,
            height: totalHeight,
            transform: `scale(${scale}) translateY(-${pageStart}px)`,
            transformOrigin: "top left",
          }}
        />
      </div>
      {/* White bars covering the margin areas — prevents iframe content from
          bleeding through when CSS transforms escape the overflow:hidden clip */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 bg-white"
        style={{ height: marginH }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 bg-white"
        style={{ height: marginH }}
      />
      <div
        className="pointer-events-none absolute inset-y-0 left-0 bg-white"
        style={{ width: marginW }}
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 bg-white"
        style={{ width: marginW }}
      />
    </article>
  );
}

export default function CVPreview({
  id,
  fontDataUri,
}: {
  id: string;
  fontDataUri: string;
}) {
  const measureIframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [pageWidth, setPageWidth] = useState(0);
  const [pageMetrics, setPageMetrics] = useState<PageMetrics>({
    pageStarts: [0],
    totalHeight: PRINTABLE_HEIGHT_PX,
  });

  const { data: status } = useStatus(id);
  const { data: cvData } = useCVData(id);
  const { data: template } = useTemplateSuspenseQuery(id);
  const { data: personalInfo } = usePersonalInfoSuspenseQuery(id);
  const { data: summary } = useSummarySuspenseQuery(id);
  const { data: workExperience } = useWorkExperienceSuspenseQuery(id);
  const { data: education } = useEducationSuspenseQuery(id);
  const { data: skills } = useSkillsSuspenseQuery(id);
  const { data: languages } = useLanguagesSuspenseQuery(id);
  const { data: projects } = useProjectsSuspenseQuery(id);
  const { data: certifications } = useCertificationsSuspenseQuery(id);
  const { data: awards } = useAwardsSuspenseQuery(id);
  const { data: templateConfigData } = useTemplateConfigSuspenseQuery(id);

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
      templateId:
        (template?.id as TemplateId) ?? TemplateId.ATS_FRIENDLY_SIMPLE,
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
    return renderPreviewHTML(fullCV, {
      fontSource: fontDataUri,
      accentColor:
        templateConfigData?.customAccentColor ||
        templateConfigData?.accentColor,
      sections: templateConfigData?.sections,
    });
  }, [
    fullCV,
    fontDataUri,
    templateConfigData?.accentColor,
    templateConfigData?.customAccentColor,
    templateConfigData?.sections,
  ]);

  useEffect(() => {
    const element = containerRef.current;
    if (!element || typeof ResizeObserver === "undefined") return;

    const updateWidth = () => {
      setPageWidth(element.clientWidth);
    };

    updateWidth();

    const observer = new ResizeObserver(updateWidth);
    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const handleMeasureLoad = () => {
    const iframe = measureIframeRef.current;
    const doc = iframe?.contentDocument;

    if (!iframe || !doc) return;

    const totalHeight = Math.max(
      doc.documentElement.scrollHeight,
      doc.body.scrollHeight,
      PRINTABLE_HEIGHT_PX
    );

    setPageMetrics({
      pageStarts: computePageStarts(doc, totalHeight),
      totalHeight,
    });
  };

  if (!status?.isReady) {
    return (
      <div className="border-border bg-muted/30 flex h-full w-full max-w-[210mm] items-center justify-center rounded-3xl border border-dashed px-6 py-12 text-center">
        <p className="text-muted-foreground max-w-[32ch] text-sm">
          Fill the required sections to see the preview.
        </p>
      </div>
    );
  }

  if (!htmlPreview) {
    return (
      <div className="border-border text-muted-foreground rounded-3xl border p-4 text-sm">
        CV preview is unavailable.
      </div>
    );
  }

  const scale = pageWidth > 0 ? pageWidth / PAGE_WIDTH_PX : 1;
  const pages = pageMetrics.pageStarts.map((pageStart, index, allStarts) => {
    const nextStart = allStarts[index + 1] ?? pageMetrics.totalHeight;
    return {
      pageStart,
      visibleHeight: Math.max(
        0,
        Math.min(PRINTABLE_HEIGHT_PX, nextStart - pageStart)
      ),
    };
  });

  return (
    <div
      ref={containerRef}
      className="mx-auto flex w-full max-w-[210mm] flex-col gap-2"
    >
      <div className="pointer-events-none absolute h-0 w-0 overflow-hidden opacity-0">
        <iframe
          key={htmlPreview}
          ref={measureIframeRef}
          title="CV preview measure"
          srcDoc={htmlPreview}
          scrolling="no"
          onLoad={handleMeasureLoad}
          className="block border-0 bg-white"
          style={{
            width: PRINTABLE_WIDTH_PX,
            height: PRINTABLE_HEIGHT_PX,
          }}
        />
      </div>

      {pages.map(({ pageStart, visibleHeight }, index) => (
        <PreviewPage
          key={`${index}-${pageStart}`}
          htmlPreview={htmlPreview}
          pageStart={pageStart}
          visibleHeight={visibleHeight}
          totalHeight={pageMetrics.totalHeight}
          scale={scale}
        />
      ))}
    </div>
  );
}
