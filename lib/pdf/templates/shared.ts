import { categoryItemsToList } from "@/lib/utils/skill-items";

import { CV } from "@/types/cv";

export type PreviewRenderOptions = {
  fontSource?: string;
};

const DEFAULT_CV_FONT_SOURCE = "/fonts/Inter.woff2";

export function renderCVFontFace(options: PreviewRenderOptions = {}) {
  const fontSource = options.fontSource ?? DEFAULT_CV_FONT_SOURCE;

  return `
    @font-face {
      font-family: "CVInter";
      src: url("${fontSource}") format("woff2");
      font-weight: 100 900;
      font-style: normal;
      font-display: block;
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

function renderContactLineHTML(email: string, phone: string): string {
  const parts: string[] = [];

  if (email) {
    parts.push(`<a href="mailto:${escapeHtml(email)}" target="_blank" rel="noopener noreferrer">${escapeHtml(email)}</a>`);
  }
  if (phone) {
    parts.push(`<a href="tel:${escapeHtml(phone)}" target="_blank" rel="noopener noreferrer">${escapeHtml(phone)}</a>`);
  }

  return parts.join(" • ");
}

function renderLinksLineHTML(
  professionalLinks: Array<{ label: string; url: string }> | undefined,
  linkedIn: string | undefined,
  portfolio: string | undefined
): string {
  const linkItems =
    professionalLinks?.filter(
      (item) => item?.label?.trim() && item?.url?.trim()
    ) ?? [];

  const links = linkItems.length
    ? linkItems.map(
        (item) =>
          `<span>${escapeHtml(item.label.trim())}: <a href="${escapeHtml(item.url.trim())}" target="_blank" rel="noopener noreferrer">${escapeHtml(item.url.trim())}</a></span>`
      )
    : [
        linkedIn ? `<span>LinkedIn: <a href="${escapeHtml(linkedIn)}" target="_blank" rel="noopener noreferrer">${escapeHtml(linkedIn)}</a></span>` : null,
        portfolio ? `<span>Portfolio: <a href="${escapeHtml(portfolio)}" target="_blank" rel="noopener noreferrer">${escapeHtml(portfolio)}</a></span>` : null,
      ].filter(Boolean);

  return links.join(" | ");
}

export function getSharedTemplateData(cv: CV) {
  const fullName = [cv.personalInfo.firstName, cv.personalInfo.lastName]
    .filter(Boolean)
    .join(" ");
  const contactLine = [cv.personalInfo.email, cv.personalInfo.phone]
    .filter(Boolean)
    .join(" • ");
  const contactLineHTML = renderContactLineHTML(
    cv.personalInfo.email,
    cv.personalInfo.phone
  );
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
  const linksLineHTML = renderLinksLineHTML(
    cv.personalInfo.professionalLinks,
    cv.personalInfo.linkedIn,
    cv.personalInfo.portfolio
  );

  const skillCategories = (cv.skills?.categories ?? [])
    .map((category) => ({
      name: category.name,
      items: categoryItemsToList(category.items),
    }))
    .filter((category) => category.name && category.items.length > 0);

  return {
    fullName,
    contactLine,
    contactLineHTML,
    locationLine,
    linksLine,
    linksLineHTML,
    skillCategories,
    workItems: cv.workExperience ?? [],
    educationItems: cv.education ?? [],
    projectItems: cv.projects ?? [],
    certificationItems: cv.certifications ?? [],
    awardItems: cv.awards ?? [],
    languageItems: cv.languages ?? [],
  };
}
