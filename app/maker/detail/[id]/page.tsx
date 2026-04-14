import { readFileSync } from "fs";

import CVBuilder from "@/components/cv/cv-builder";

// Read once at request time on the server so the preview iframe gets the
// font as an inline data URI — same delivery as the PDF generator — removing
// any async font-load timing gap between preview measurement and rendering.
const CV_FONT_DATA_URI = `data:font/woff2;base64,${readFileSync(
  `${process.cwd()}/public/fonts/Geist-Variable.woff2`
).toString("base64")}`;

export default function CVCreate() {
  return <CVBuilder fontDataUri={CV_FONT_DATA_URI} />;
}
