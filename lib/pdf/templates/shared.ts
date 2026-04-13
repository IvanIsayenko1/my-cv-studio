import { categoryItemsToList } from "@/lib/utils/skill-items";

import { CV } from "@/types/cv";

export type PreviewRenderOptions = {
  fontSource?: string;
};

const DEFAULT_CV_FONT_SOURCE = "/fonts/Geist-Variable.woff2";

export function renderCVFontFace(options: PreviewRenderOptions = {}) {
  const fontSource = options.fontSource ?? DEFAULT_CV_FONT_SOURCE;

  return `
    @font-face {
      font-family: "CVGeist";
      src: url("${fontSource}") format("woff2");
      font-weight: 100 900;
      font-style: normal;
      font-display: swap;
    }
  `;
}

const ALLOWED_RICH_TEXT_TAGS = new Set([
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

export function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function sanitizeRichTextHtml(html: string): string {
  if (!html) return "";

  return html.replace(
    /<\/?([a-zA-Z0-9-]+)(\s[^>]*)?>/g,
    (match: string, rawTagName: string) => {
      const tagName = rawTagName.toLowerCase();
      if (!ALLOWED_RICH_TEXT_TAGS.has(tagName)) {
        return "";
      }

      const isClosing = match.startsWith("</");
      return isClosing ? `</${tagName}>` : `<${tagName}>`;
    }
  );
}

export function renderRichTextBlock(html: string, className = "rich-text") {
  const sanitized = sanitizeRichTextHtml(html).trim();
  return sanitized ? `<div class="${className}">${sanitized}</div>` : "";
}

export function getSharedTemplateData(cv: CV) {
  const fullName = [cv.personalInfo.firstName, cv.personalInfo.lastName]
    .filter(Boolean)
    .join(" ");
  const contactLine = [cv.personalInfo.email, cv.personalInfo.phone]
    .filter(Boolean)
    .join(" • ");
  const locationLine = [cv.personalInfo.city, cv.personalInfo.country]
    .filter(Boolean)
    .join(", ");
  const linkItems =
    cv.personalInfo.professionalLinks?.filter(
      (item) => item?.label?.trim() && item?.url?.trim()
    ) ?? [];
  const linksLine = linkItems.length
    ? linkItems
        .map((item) => `${item.label.trim()}: ${item.url.trim()}`)
        .join(" | ")
    : [cv.personalInfo.linkedIn, cv.personalInfo.portfolio]
        .filter(Boolean)
        .join(" | ");

  const skillCategories = (cv.skills?.categories ?? [])
    .map((category) => ({
      name: category.name,
      items: categoryItemsToList(category.items),
    }))
    .filter((category) => category.name && category.items.length > 0);

  return {
    fullName,
    contactLine,
    locationLine,
    linksLine,
    skillCategories,
    workItems: cv.workExperience ?? [],
    educationItems: cv.education ?? [],
    projectItems: cv.projects ?? [],
    certificationItems: cv.certifications ?? [],
    awardItems: cv.awards ?? [],
    languageItems: cv.languages ?? [],
  };
}
