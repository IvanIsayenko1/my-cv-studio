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

---

## Component Structure & Naming Conventions

### File & Component Naming
- All component files use **kebab-case** (e.g., `create-cv-dialog.tsx`, `cv-builder.tsx`)
- Component exports use **PascalCase** matching the file name (e.g., `CreateCvDialog` from `create-cv-dialog.tsx`)
- Non-JSX files use `.ts` extension, JSX-containing components use `.tsx`

### Folder Organization
- `components/ui/`: Shared, reusable base components (buttons, inputs, modals). Use CVA for variants.
- Feature-based grouping: Co-locate related components in domain folders (`cv/`, `auth/`, `dialogs/`, `layout/`, `forms/`)
- Complex features: Use nested subfolders for subcomponents (e.g., `cv/cv-builder/`, `cv/cv-tailor/`)
- Dialogs: Place all dialog components in `components/dialogs/` with `-dialog` suffix

### Special Patterns
- Loading skeletons: Use `-skeleton` suffix (e.g., `cv-builder-form-skeleton.tsx`)
- Client components: Add `"use client"` directive at the top when using client-side hooks/features
- Imports: Use `@/` path aliases for internal imports, avoid relative paths for cross-folder imports
- UI components: Prefer CVA (class-variance-authority) for styling variants, follow `button.tsx` pattern

### Component Internal Rules
- **`useEffect` restriction**: Use of `useEffect` is forbidden unless absolutely necessary. Only use `useEffect` for imperative integrations (e.g., DOM manipulations, subscriptions) where no other React hook (e.g., `useMemo`, `useCallback`, derived state) suffices.
- **Type/Interface placement**: Never declare interfaces or types inside the component file. Always import types/interfaces from dedicated type/schema files (e.g., `@/types/*`, `@/schemas/*`).
- **Component body order** (inside the component function):
  1. React built-in hooks (`useState`, `useParams`, `useMemo`, `useRef`, etc.)
  2. Third-party hooks (`useForm`, `useFieldArray`, `useWatch` from react-hook-form, etc.)
  3. Custom hooks (`useCreateCV`, `useMediaQuery`, `useFormDirtyState`, etc.)
  4. Extract values from hook returns (e.g., `const { control, handleSubmit } = form`)
  5. Variables/derived values (add a single-line comment for every variable)
  6. Arrow functions only (add JSDoc comment for every function)
- **Function syntax**: Use only arrow functions for component-internal functions.
- **Function comments**: Component-internal functions must use JSDoc-style comments with:
  - A description of what the function does
  - `@param` tags for each parameter (describing the parameter's purpose)
  - `@returns` tag describing the return value (if applicable)
  Example format:
  ```ts
  /**
   * Converts raw text to editor-compatible HTML format
   * @param value - The input string to convert
   * @returns Formatted HTML string for the rich text editor
   */
  ```
- **Documentation**: Comment every variable and function declared inside the component. Variables require a brief single-line comment explaining their purpose.
