import { CV } from "@/types/cv";

import { readFileSync } from "fs";

import { renderPreviewHTML } from "./templates/render-preview-html";

const CV_FONT_DATA_URI = `data:font/woff2;base64,${readFileSync(
  `${process.cwd()}/public/fonts/Inter.woff2`
).toString("base64")}`;

async function launchBrowser() {
  if (process.env.NODE_ENV === "production") {
    const chromium = (await import("@sparticuz/chromium")).default;
    const puppeteerCore = await import("puppeteer-core");

    return puppeteerCore.launch({
      args: puppeteerCore.default.defaultArgs({
        args: chromium.args,
        headless: "shell",
      }),
      executablePath: await chromium.executablePath(),
      headless: "shell",
    });
  }

  const puppeteer = await import("puppeteer");
  return puppeteer.default.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
}

export async function generateHTMLCVPDF(cv: CV): Promise<Buffer> {
  const browser = await launchBrowser();

  try {
    const page = await browser.newPage();

    // Match the viewport to the A4 printable width (210mm − 2×16mm at 96 dpi).
    // Without this Puppeteer defaults to 800px, then reflows to ~673px when
    // page.pdf() switches to print mode — causing different text wrapping than
    // the preview iframe which already renders at the printable width.
    await page.setViewport({
      width: Math.round((210 - 32) * (96 / 25.4)), // ≈ 673 px
      height: Math.round((297 - 32) * (96 / 25.4)), // ≈ 1004 px
      deviceScaleFactor: 1,
    });

    const accentColor = cv.customAccentColor || cv.accentColor || "#0066CC";

    await page.setContent(
      renderPreviewHTML(cv, {
        fontSource: CV_FONT_DATA_URI,
        accentColor,
      }),
      {
        waitUntil: "domcontentloaded",
      }
    );

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
    });

    return Buffer.from(pdf);
  } finally {
    await browser.close();
  }
}
