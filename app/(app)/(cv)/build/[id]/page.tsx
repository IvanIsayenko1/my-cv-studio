import { readFileSync } from "fs";

import CVBuilder from "@/components/cv/cv-builder";

const CV_FONT_DATA_URI = `data:font/woff2;base64,${readFileSync(
  `${process.cwd()}/public/fonts/Inter.woff2`
).toString("base64")}`;

export default function CVCreate() {
  return <CVBuilder fontDataUri={CV_FONT_DATA_URI} />;
}
