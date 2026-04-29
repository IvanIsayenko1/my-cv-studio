# CV Studio — Project Instructions

## Adding a new CV template

A template has two parts: an **HTML renderer** (used for both the live preview and PDF generation via Puppeteer) and optionally a legacy **PDFKit renderer** (used only if a direct-PDF path exists). The HTML renderer is the authoritative one — always implement it.

---

### 1. Create the HTML renderer

Add a new file: `lib/pdf/templates/<template-id>-html.ts`

**Required imports:**

```ts
import { DEFAULT_CV_SECTIONS } from "@/lib/constants/cv-sections";
import { CV } from "@/types/cv";
import { SectionConfig } from "@/schemas/template-config";
import {
  escapeHtml,
  getSharedTemplateData,
  renderCVFontFace,
  renderRichTextBlock,
} from "./shared";
import type { PreviewRenderOptions } from "./shared";
```

**Function signature:**

```ts
export function render<TemplateName>PreviewHTML(
  cv: CV,
  options?: PreviewRenderOptions & {
    accentColor?: string;
    sections?: SectionConfig[];
  }
): string
```

**Mandatory section handling pattern — follow this exactly:**

```ts
const accentColor = options?.accentColor || "#0066CC";
const sectionConfig = options?.sections || DEFAULT_CV_SECTIONS;
const sectionMap = new Map(sectionConfig.map((s) => [s.id, s]));

// Destructure shared data
const { workItems, educationItems, skillCategories, ... } = getSharedTemplateData(cv);

// Build content map — one key per section ID
const sectionContent: Record<string, string> = {};

if (cv.professionalSummary) {
  sectionContent.summary = `...${sectionMap.get("summary")?.label || "Summary"}...`;
}
if (workItems.length > 0) {
  sectionContent.experience = `...${sectionMap.get("experience")?.label || "Experience"}...`;
}
// ... repeat for: skills, education, languages, projects, certifications, awards

// Render in user-defined order, respecting visibility
const orderedSections = sectionConfig
  .filter((s) => s.visible !== false)
  .sort((a, b) => a.order - b.order)
  .map((s) => sectionContent[s.id])
  .filter(Boolean);
```

The final HTML body must render `orderedSections.join("")` — never hardcode the section order.

**Safety rules:**
- All user-supplied strings must pass through `escapeHtml()` before being placed in HTML attributes or text nodes.
- Rich text fields (e.g. `professionalSummary`, `achievements`, `description`) must use `renderRichTextBlock()` — never inject them raw.
- Font loading must use `renderCVFontFace(options)` inside `<style>`.
- The `accentColor` CSS custom property (`--accent-color` or equivalent) must be set from the `accentColor` variable, not hardcoded.

**Section IDs** (must match `DEFAULT_CV_SECTIONS` and `sectionContent` keys):
`summary`, `experience`, `skills`, `education`, `languages`, `projects`, `certifications`, `awards`

---

### 2. Register the template

**`types/template.ts`** — add to `TemplateId`, `TemplateName`, and `TEMPLATE_OPTIONS`.

**`lib/pdf/templates/render-preview-html.ts`** — add a `case` for the new `TemplateId`:

```ts
case TemplateId.YOUR_NEW_TEMPLATE:
  return renderYourNewTemplatePreviewHTML(cv, options);
```

---

### 3. Wire up accent color in the PDF generator

`lib/pdf/html-generator.ts` already reads `cv.customAccentColor || cv.accentColor` and passes it as `accentColor` in options. No changes needed there — as long as the template uses the `accentColor` parameter.

---

### 4. Checklist before marking done

- [ ] `sectionContent` map covers all 8 section IDs
- [ ] `orderedSections` filter+sort+join pattern used for final output
- [ ] All user strings go through `escapeHtml()`
- [ ] Rich text fields use `renderRichTextBlock()`
- [ ] `renderCVFontFace(options)` called in `<style>`
- [ ] `accentColor` applied as a CSS variable, not hardcoded
- [ ] Section labels come from `sectionMap.get(id)?.label || "Fallback"`
- [ ] New `TemplateId` added to `types/template.ts`
- [ ] New `case` added in `render-preview-html.ts`
- [ ] Template preview image added to `public/cv-templates/<template-id>.webp`
