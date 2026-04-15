import { readFileSync } from "fs";

import CVBuilder from "@/components/cv/cv-builder";
import CVBuilderV2 from "@/components/cv/cv-builder-v2";

const CV_FONT_DATA_URI = `data:font/woff2;base64,${readFileSync(
  `${process.cwd()}/public/fonts/Inter.woff2`
).toString("base64")}`;

export default function CVCreate() {
  return <CVBuilderV2 fontDataUri={CV_FONT_DATA_URI} />;
}
