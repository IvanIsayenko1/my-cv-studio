import { CV } from "@/types/cv";

import { SectionConfig } from "@/schemas/template-config";

import {
  escapeHtml,
  getSharedTemplateData,
  renderCVFontFace,
  renderRichTextBlock,
} from "./shared";
import type { PreviewRenderOptions } from "./shared";

function renderBadgeSection(
  title: string,
  content: string,
  sectionClassName = ""
) {
  if (!content.trim()) return "";
  const sectionClass = ["section", sectionClassName].filter(Boolean).join(" ");

  return `
    <section class="${sectionClass}">
      <div class="section-kicker"><span>${escapeHtml(title)}</span></div>
      <div class="section-body">${content}</div>
    </section>
  `;
}

export function renderVisualClearPreviewHTML(
  cv: CV,
  options?: PreviewRenderOptions & {
    accentColor?: string;
    sections?: SectionConfig[];
  }
): string {
  const accentColor = options?.accentColor || "#0066CC";
  const {
    awardItems,
    certificationItems,
    contactLineHTML,
    educationItems,
    fullName,
    languageItems,
    linksLineHTML,
    locationLine,
    projectItems,
    skillCategories,
    workItems,
  } = getSharedTemplateData(cv);

  const heroMeta = [
    { text: cv.personalInfo.professionalTitle, isHtml: false },
    { text: locationLine, isHtml: false },
    { text: contactLineHTML, isHtml: true },
    { text: linksLineHTML, isHtml: true },
  ].filter((item) => item.text);

  const sections: string[] = [];

  if (cv.professionalSummary) {
    sections.push(
      renderBadgeSection(
        "Profile",
        `<div class="lead-copy">${renderRichTextBlock(cv.professionalSummary)}</div>`
      )
    );
  }

  if (workItems.length > 0) {
    sections.push(
      renderBadgeSection(
        "Employment History",
        `<div class="timeline-list">${workItems
          .map(
            (item) => `
              <article class="timeline-entry">
                <div class="entry-header">
                  <div>
                    <h3 class="entry-title">${escapeHtml(item.jobTitle)}${item.company ? `, ${escapeHtml(item.company)}` : ""}</h3>
                    ${
                      item.location
                        ? `<p class="entry-subtitle">${escapeHtml(item.location)}</p>`
                        : ""
                    }
                  </div>
                  <p class="entry-date">${escapeHtml(item.startDate)}${item.endDate ? ` - ${escapeHtml(item.endDate)}` : ""}</p>
                </div>
                ${
                  item.toolsAndMethods?.length
                    ? `<p class="entry-tools">${escapeHtml(item.toolsAndMethods.join(" • "))}</p>`
                    : ""
                }
                ${
                  item.achievements
                    ? renderRichTextBlock(
                        item.achievements,
                        "entry-copy rich-text"
                      )
                    : ""
                }
              </article>
            `
          )
          .join("")}</div>`
      )
    );
  }

  if (projectItems.length > 0) {
    sections.push(
      renderBadgeSection(
        "Projects",
        `<div class="timeline-list">${projectItems
          .map(
            (project) => `
              <article class="timeline-entry compact">
                <div class="entry-header">
                  <div>
                    <h3 class="entry-title">${escapeHtml(project.name)}${project.role ? `, ${escapeHtml(project.role)}` : ""}</h3>
                    ${
                      project.url
                        ? `<p class="entry-subtitle"><a href="${escapeHtml(project.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(project.url)}</a></p>`
                        : ""
                    }
                  </div>
                  <p class="entry-date">${escapeHtml(project.startDate)}${project.endDate ? ` - ${escapeHtml(project.endDate)}` : ""}</p>
                </div>
                ${
                  project.description
                    ? renderRichTextBlock(
                        project.description,
                        "entry-copy rich-text"
                      )
                    : ""
                }
              </article>
            `
          )
          .join("")}</div>`
      )
    );
  }

  const sideSections: string[] = [];

  if (skillCategories.length > 0) {
    sideSections.push(
      renderBadgeSection(
        "Skills",
        `<div class="skills-grid">${skillCategories
          .map(
            (category) => `
              <article class="mini-block">
                <div class="mini-title">${escapeHtml(category.name)}</div>
                <div class="mini-copy">${escapeHtml(category.items.join(", "))}</div>
              </article>
            `
          )
          .join("")}</div>`
      )
    );
  }

  if (educationItems.length > 0) {
    sideSections.push(
      renderBadgeSection(
        "Education",
        `<div class="timeline-list timeline-grid timeline-grid-2">${educationItems
          .map(
            (item) => `
              <article class="timeline-entry compact">
                <div class="entry-header">
                  <div>
                    <h3 class="entry-title">${escapeHtml(item.degree)}${item.fieldOfStudy ? `, ${escapeHtml(item.fieldOfStudy)}` : ""}</h3>
                    <p class="entry-subtitle">${escapeHtml(item.institution)}${item.location ? `, ${escapeHtml(item.location)}` : ""}</p>
                  </div>
                  ${
                    item.graduationDate
                      ? `<p class="entry-date">${escapeHtml(item.graduationDate)}</p>`
                      : ""
                  }
                </div>
                ${
                  item.honors
                    ? `<p class="entry-tools">${escapeHtml(item.honors)}</p>`
                    : ""
                }
                ${
                  item.grade
                    ? `<p class="entry-tools">Grade: ${escapeHtml(item.grade)}${item.gradingScale ? ` (${escapeHtml(item.gradingScale)})` : ""}</p>`
                    : ""
                }
              </article>
            `
          )
          .join("")}</div>`
      )
    );
  }

  if (languageItems.length > 0) {
    sideSections.push(
      renderBadgeSection(
        "Languages",
        `<div class="language-list">${languageItems
          .map(
            (item) => `
              <div>
                <p class="mini-title">${escapeHtml(item.language)}${item.proficiency ? `<span class="language-level"> - ${escapeHtml(item.proficiency)}</span>` : ""}</p>
              </div>
            `
          )
          .join("")}</div>`,
        "section-compact"
      )
    );
  }

  if (certificationItems.length > 0) {
    sideSections.push(
      renderBadgeSection(
        "Certifications",
        `<div class="timeline-list timeline-grid timeline-grid-2">${certificationItems
          .map(
            (item) => `
              <article class="timeline-entry compact">
                <div class="entry-header">
                  <div>
                    <h3 class="entry-title">${escapeHtml(item.name)}</h3>
                    ${
                      item.issuingOrg
                        ? `<p class="entry-subtitle">${escapeHtml(item.issuingOrg)}</p>`
                        : ""
                    }
                  </div>
                  <p class="entry-date">${escapeHtml(item.issueDate)}${item.expirationDate ? ` - ${escapeHtml(item.expirationDate)}` : ""}</p>
                </div>
                ${
                  item.credentialId
                    ? `<p class="entry-tools">Credential ID: ${escapeHtml(item.credentialId)}</p>`
                    : ""
                }
              </article>
            `
          )
          .join("")}</div>`
      )
    );
  }

  if (awardItems.length > 0) {
    sideSections.push(
      renderBadgeSection(
        "Awards",
        `<div class="timeline-list">${awardItems
          .map(
            (item) => `
              <article class="timeline-entry compact">
                <div class="entry-header">
                  <div>
                    <h3 class="entry-title">${escapeHtml(item.name)}</h3>
                    ${
                      item.issuer
                        ? `<p class="entry-subtitle">${escapeHtml(item.issuer)}</p>`
                        : ""
                    }
                  </div>
                  ${
                    item.date
                      ? `<p class="entry-date">${escapeHtml(item.date)}</p>`
                      : ""
                  }
                </div>
                ${
                  item.description
                    ? renderRichTextBlock(
                        item.description,
                        "entry-copy rich-text"
                      )
                    : ""
                }
              </article>
            `
          )
          .join("")}</div>`
      )
    );
  }

  return `
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>${escapeHtml(fullName || cv.cvData.title || "CV")}</title>
        <style>
          ${renderCVFontFace(options)}

          :root {
            color-scheme: light;
            --page-bg: #ffffff;
            --paper-bg: #ffffff;
            --hero-bg: #f86a5d;
            --hero-text: #121826;
            --body-text: #313a47;
            --muted-text: #586171;
            --section-accent: ${accentColor};
            --section-border: rgba(18, 24, 38, 0.1);
            --font-body: "CVInter", "Aptos", "Segoe UI", "Helvetica Neue", Helvetica, sans-serif;
            --font-heading: "CVInter", "Helvetica Neue", Helvetica, Arial, sans-serif;
            --section-gap: 11px;
            --section-title-gap: 7px;
            --entry-gap: 9px;
          }

          * {
            box-sizing: border-box;
          }

          html,
          body {
            margin: 0;
            padding: 0;
            background: var(--page-bg);
            color: var(--body-text);
            font-family: var(--font-body);
            font-size: 12px;
            line-height: 1.5;
            overflow: auto;
            scrollbar-width: none;
            -ms-overflow-style: none;
          }

          body::-webkit-scrollbar {
            width: 0;
            height: 0;
            display: none;
          }

          @page {
            size: A4;
            margin: 16mm;
          }

          .page {
            width: 100%;
            background: var(--paper-bg);
          }

          .hero {
            display: grid;
            grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr);
            gap: 18px;
            padding: 12px;
            margin-bottom: 18px;
            color: var(--section-accent);
            align-items: center;
          }

          .hero-name {
            margin: 0;
            font-family: var(--font-heading);
            font-size: 37px;
            line-height: 0.88;
            letter-spacing: -0.05em;
            font-weight: 500;
            text-transform: uppercase;
            max-width: 165px;
          }

          .hero-name span {
            display: block;
          }

          .hero-panel {
            align-self: center;
            display: grid;
            gap: 4px;
            justify-items: start;
            max-width: 340px;
            padding-top: 0;
          }

          .hero-title {
            margin: 0;
            font-size: 12.2px;
            line-height: 1.38;
            font-family: var(--font-body);
            font-weight: 700;
          }

          .hero-meta {
            margin: 0;
            font-size: 10.8px;
            line-height: 1.32;
            color: rgba(18, 24, 38, 0.88);
          }

          a {
            color: inherit;
            text-decoration: underline;
          }

          a:hover {
            opacity: 0.7;
          }

          .main {
            padding: 0 2mm 0;
          }

          .layout {
            display: grid;
            gap: var(--section-gap);
          }

          .section {
            display: grid;
            gap: var(--section-title-gap);
          }

          .section-kicker {
            display: inline-flex;
            width: fit-content;
            padding: 0;
            font-size: 9.2px;
            letter-spacing: 0.18em;
            text-transform: uppercase;
            font-family: var(--font-body);
            font-weight: 700;
            color: #ffffff;
          }

          .section-kicker span {
            display: inline-block;
            padding: 4px 10px 3px;
            background: var(--section-accent);
          }

          .section-body {
            display: grid;
            gap: var(--entry-gap);
          }

          .lead-copy,
          .entry-copy,
          .mini-copy,
          .rich-text {
            font-size: 10.9px;
            line-height: 1.5;
            color: var(--body-text);
          }

          .timeline-entry,
          .mini-block {
            display: grid;
            gap: 2px;
          }

          .skills-grid .mini-block {
            gap: 0;
          }

          .timeline-list,
          .language-list {
            display: flex;
            flex-direction: column;
          }

          .timeline-list {
            gap: var(--entry-gap);
          }

          .timeline-grid {
            display: grid;
            align-items: start;
          }

          .timeline-grid-2 {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 10px 18px;
          }

          .skills-grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 7px 16px;
            align-items: start;
          }

          .language-list {
            display: grid;
            grid-template-columns: repeat(4, minmax(0, 1fr));
            gap: 4px 14px;
          }

          .language-list div {
            display: block;
          }

          .mini-block + .mini-block {
            padding-top: 6px;
          }

          .skills-grid > .mini-block + .mini-block {
            padding-top: 0;
            border-top: 0;
          }

          .timeline-entry {
            break-inside: avoid;
            page-break-inside: avoid;
            padding-bottom: 2px;
          }

          .timeline-entry.compact {
            gap: 2px;
          }

          .entry-header {
            display: grid;
            gap: 1px;
          }

          .entry-header > div:first-child {
            flex: 1 1 auto;
            min-width: 0;
          }

          .entry-title,
          .mini-title {
            margin: 0;
            font-size: 11.8px;
            line-height: 1.34;
            font-family: var(--font-body);
            font-weight: 700;
            color: #182231;
          }

          .entry-subtitle,
          .entry-tools,
          .entry-date {
            margin: 0;
            font-size: 9.6px;
            line-height: 1.34;
            color: var(--muted-text);
            text-transform: none;
            letter-spacing: 0.01em;
            font-family: var(--font-body);
            font-weight: 600;
          }

          .entry-date {
            text-align: left;
            padding-top: 0;
          }

          .entry-subtitle {
            font-weight: 700;
          }

          .rich-text p,
          .rich-text div {
            margin: 0;
          }

          .rich-text ul,
          .rich-text ol {
            margin: 0;
            padding-left: 18px;
          }

          .rich-text li + li {
            margin-top: 3px;
          }

          .lead-copy {
            max-width: 100%;
          }

          .entry-tools {
            margin-top: 0;
          }

          .section-compact .section-body {
            gap: 5px;
          }

          .section-compact .mini-title {
            font-size: 10.8px;
          }

          .language-level {
            color: var(--muted-text);
            font-size: 10px;
            font-weight: 600;
          }

          .section-compact .mini-copy,
          .section-compact .rich-text {
            font-size: 10px;
            line-height: 1.35;
          }

          .section-compact .mini-block {
            gap: 1px;
          }

          .section-compact .mini-block + .mini-block {
            padding-top: 0;
          }

          .section-compact .rich-text ul,
          .section-compact .rich-text ol {
            padding-left: 16px;
          }

          .section-compact .rich-text li + li {
            margin-top: 1px;
          }

          @media print {
            html,
            body {
              background: #ffffff;
            }
          }
        </style>
      </head>
      <body>
        <main class="page">
          <section class="hero">
            <div>
              <h1 class="hero-name">
                ${
                  fullName
                    ? fullName
                        .split(/\s+/)
                        .map((part) => `<span>${escapeHtml(part)}</span>`)
                        .join("")
                    : `<span>${escapeHtml(cv.cvData.title || "Untitled CV")}</span>`
                }
              </h1>
            </div>
            <div class="hero-panel">
              ${
                heroMeta.length > 0
                  ? heroMeta
                      .map((item, index) => {
                        const content = item.isHtml
                          ? item.text
                          : escapeHtml(item.text);
                        return index === 0
                          ? `<p class="hero-title">${content}</p>`
                          : `<p class="hero-meta">${content}</p>`;
                      })
                      .join("")
                  : ""
              }
            </div>
          </section>

          <section class="main">
            <div class="layout">${sections.concat(sideSections).join("")}</div>
          </section>
        </main>
      </body>
    </html>
  `;
}
