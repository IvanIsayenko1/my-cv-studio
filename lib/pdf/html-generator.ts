import { CV } from "@/types/cv";

import { readFileSync } from "fs";

import { renderPreviewHTML } from "./templates/render-preview-html";

const CV_FONT_DATA_URI = `data:font/woff2;base64,${readFileSync(
  `${process.cwd()}/public/fonts/Geist-Variable.woff2`
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
    // Match the printable width so text wraps identically in preview and PDF.
    // A4 minus 16 mm margins on each side = 178 mm ≈ 673 px at 96 dpi.
    await page.setViewport({
      width: Math.round((210 - 32) * (96 / 25.4)), // ≈ 673 px
      height: Math.round((297 - 32) * (96 / 25.4)), // ≈ 1002 px
      deviceScaleFactor: 1,
    });
    await page.setContent(
      renderPreviewHTML(cv, { fontSource: CV_FONT_DATA_URI }),
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
