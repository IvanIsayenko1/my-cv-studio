import { CV } from "@/types/cv";

import {
  escapeHtml,
  getSharedTemplateData,
  renderCVFontFace,
  renderRichTextBlock,
} from "./shared";
import type { PreviewRenderOptions } from "./shared";

export function renderATSCleanPreviewHTML(
  cv: CV,
  options?: PreviewRenderOptions
): string {
  const {
    awardItems,
    certificationItems,
    contactLine,
    educationItems,
    fullName,
    languageItems,
    linksLine,
    locationLine,
    projectItems,
    skillCategories,
    workItems,
  } = getSharedTemplateData(cv);

  const sections: string[] = [];

  if (cv.professionalSummary) {
    sections.push(`
      <section class="preview-section">
        <h3 class="section-title">Summary</h3>
        ${renderRichTextBlock(cv.professionalSummary.trim())}
      </section>
    `);
  }

  if (workItems.length > 0) {
    sections.push(`
      <section class="preview-section">
        <h3 class="section-title">Experience</h3>
        <div class="entry-list">
          ${workItems
            .map(
              (item) => `
                <article class="entry stack-sm">
                  <p class="line-title">
                    ${escapeHtml(item.jobTitle)} · ${escapeHtml(item.company)}
                  </p>
                  <p class="line-meta">
                    ${escapeHtml(item.startDate)} - ${escapeHtml(item.endDate)} · ${escapeHtml(item.location)}
                  </p>
                  ${
                    item.toolsAndMethods?.length
                      ? `<p class="line-meta"><span class="line-label">Tools/Systems/Methods:</span> ${escapeHtml(item.toolsAndMethods.join(", "))}</p>`
                      : ""
                  }
                  ${
                    item.achievements
                      ? `
                        <section class="preview-section nested">
                          ${renderRichTextBlock(item.achievements)}
                        </section>
                      `
                      : ""
                  }
                </article>
              `
            )
            .join("")}
        </div>
      </section>
    `);
  }

  if (skillCategories.length > 0) {
    sections.push(`
      <section class="preview-section">
        <h3 class="section-title">Skills</h3>
        
        <div class="stack-sm">
          ${skillCategories
            .map(
              (category) =>
                `<p class="line-meta"><span class="line-label">${escapeHtml(category.name)}:</span> ${escapeHtml(category.items.join(", "))}</p>`
            )
            .join("")}
        </div>
      </section>
    `);
  }

  if (educationItems.length > 0) {
    sections.push(`
      <section class="preview-section">
        <h3 class="section-title">Education</h3>
        <div class="entry-list">
          ${educationItems
            .map(
              (item) => `
                <article class="entry stack-xs">
                  <p class="line-title">${escapeHtml(item.degree)} in ${escapeHtml(item.fieldOfStudy)}</p>
                  <p class="line-meta">${escapeHtml(item.institution)} · ${escapeHtml(item.graduationDate)}</p>
                    ${
                      item.grade
                        ? `<p class="line-meta"><span class="line-label">Grade:</span> ${escapeHtml(item.grade)}${item.gradingScale ? ` (${escapeHtml(item.gradingScale)})` : ""}</p>`
                        : ""
                    }
                    ${
                      item.honors
                        ? `<p class="line-meta"><span class="line-label">Honors:</span> ${escapeHtml(item.honors)}</p>`
                        : ""
                    }
                </article>
              `
            )
            .join("")}
        </div>
      </section>
    `);
  }

  if (languageItems.length > 0) {
    sections.push(`
      <section class="preview-section">
        <h3 class="section-title">Languages</h3>
        <div>
          ${languageItems
            .map(
              (item, index) =>
                `<span>
                    <span>
                      <span class="line-meta">${escapeHtml(item.language)}</span>
                      -
                      <span class="line-meta">${escapeHtml(item.proficiency)}${index < languageItems.length - 1 ? ", " : ""}</span>
                    </span>
                </span>`
            )
            .join("")}
        </div>
      </section>
    `);
  }

  if (projectItems.length > 0) {
    sections.push(`
      <section class="preview-section">
        <h3 class="section-title">Projects</h3>
        <div class="stack-sm">
          ${projectItems
            .map(
              (project) => `
                <article class="stack-xs">
                  <p class="line-title">${escapeHtml(project.name)} · ${escapeHtml(project.role)}</p>
                  <p class="line-meta">${escapeHtml(project.startDate)} - ${escapeHtml(project.endDate)}</p>
                  ${
                    project.description
                      ? renderRichTextBlock(project.description)
                      : ""
                  }
                  ${
                    project.url
                      ? `<p class="line-meta"><span class="line-label">URL:</span> ${escapeHtml(project.url)}</p>`
                      : ""
                  }
                </article>
              `
            )
            .join("")}
        </div>
      </section>
    `);
  }

  if (certificationItems.length > 0) {
    sections.push(`
      <section class="preview-section">
        <h3 class="section-title">Certifications</h3>
        <div class="entry-list">
          ${certificationItems
            .map(
              (item) => `
                <article class="entry stack-xs">
                  <p class="line-title">${escapeHtml(item.name)}</p>
                  <p class="line-meta"><span class="line-label">Issuer:</span> ${escapeHtml(item.issuingOrg)}</p>
                  <p class="line-meta"><span class="line-label">Issued:</span> ${escapeHtml(item.issueDate)}</p>
                  ${
                    item.expirationDate
                      ? `<p class="line-meta"><span class="line-label">Expires:</span> ${escapeHtml(item.expirationDate)}</p>`
                      : ""
                  }
                  ${
                    item.credentialId
                      ? `<p class="line-meta"><span class="line-label">Credential ID:</span> ${escapeHtml(item.credentialId)}</p>`
                      : ""
                  }
                </article>
              `
            )
            .join("")}
        </div>
      </section>
    `);
  }

  if (awardItems.length > 0) {
    sections.push(`
      <section class="preview-section">
        <h3 class="section-title">Awards</h3>
        <div class="entry-list">
          ${awardItems
            .map(
              (item) => `
                <article class="entry stack-xs">
                  <p class="line-title">${escapeHtml(item.name)}</p>
                  <p class="line-meta"><span class="line-label">Issuer:</span> ${escapeHtml(item.issuer)}</p>
                  <p class="line-meta"><span class="line-label">Date:</span> ${escapeHtml(item.date)}</p>
                  ${
                    item.description
                      ? renderRichTextBlock(item.description)
                      : ""
                  }
                </article>
              `
            )
            .join("")}
        </div>
      </section>
    `);
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
            --text-primary: #0a0a0a;
            --text-secondary: #525252;
          }

          * {
            box-sizing: border-box;
          }

          html,
          body {
            margin: 0;
            padding: 0;
            background: #ffffff;
            color: var(--text-primary);
            font-family: "CVGeist", Arial, Helvetica, sans-serif;
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

          .cv-page {
            width: 100%;
          }

          .header {
            border-bottom: 1px solid #e5e7eb;
            padding-bottom: 12px;
            margin-bottom: 12px;
          }

          .name {
            margin: 0;
            font-size: 20px;
            line-height: 1.2;
            font-weight: 600;
          }

          .title {
            margin: 4px 0 0;
            font-size: 13px;
            color: var(--text-secondary);
          }

          .meta {
            margin: 3px 0 0;
            font-size: 11px;
            color: var(--text-secondary);
          }

          .content {
            display: block;
          }

          .content > .preview-section + .preview-section {
            margin-top: 16px;
          }

          .preview-section {
            display: grid;
            gap: 5px;
          }

          .entry-list {
            display: grid;
            gap: 0;
          }

          .entry {
            padding: 4px 0;
          }

          .entry-list > .entry + .entry {
            margin-top: 4px;
            padding-top: 8px;
          }

          .preview-section.nested {
            margin-top: 2px;
          }

          .section-title {
            margin: 0;
            font-size: 11px;
            letter-spacing: 0.04em;
            text-transform: uppercase;
            color: var(--text-secondary);
            font-weight: 600;
          }

          .stack-md {
            display: grid;
            gap: 12px;
          }

          .stack-sm {
            display: grid;
            gap: 2px;
          }

          .stack-xs {
            display: grid;
            gap: 2px;
          }

          .line-title {
            margin: 0;
            font-size: 11px;
            font-weight: 500;
            color: var(--text-primary);
          }

          .line-meta {
            margin: 0;
            font-size: 11px;
            color: var(--text-secondary);
          }

          .line-body {
            margin: 0;
            font-size: 11px;
            color: var(--text-primary);
          }

          .line-label {
            font-weight: 600;
            color: inherit;
          }

          .rich-text {
            font-size: 11px;
            line-height: 1.5;
            color: var(--text-primary);
          }

          .rich-text p,
          .rich-text div {
            margin-bottom: 0;
            margin-top: 0;
          }

          .rich-text ul,
          .rich-text ol {
            margin: 0;
            padding-left: 20px;
          }

        </style>
      </head>
      <body>
        <main class="cv-page">
          <section class="header">
            <h1 class="name">${escapeHtml(fullName || cv.cvData.title || "Untitled CV")}</h1>
            ${
              cv.personalInfo.professionalTitle
                ? `<p class="title">${escapeHtml(cv.personalInfo.professionalTitle)}</p>`
                : ""
            }
            ${
              contactLine
                ? `<p class="meta">${escapeHtml(contactLine)}</p>`
                : ""
            }
            ${
              locationLine
                ? `<p class="meta">${escapeHtml(locationLine)}</p>`
                : ""
            }
            ${linksLine ? `<p class="meta">${escapeHtml(linksLine)}</p>` : ""}
          </section>

          <section class="content">
            ${sections.join("")}
          </section>
        </main>
      </body>
    </html>
  `;
}
