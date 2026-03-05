import puppeteer from "puppeteer";

import { CV } from "@/types/cv";

import { renderATSCleanPreviewHTML } from "./templates/ats-friendly-clean-html";

export async function generateHTMLCVPDF(cv: CV): Promise<Buffer> {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();
    await page.setContent(renderATSCleanPreviewHTML(cv), {
      waitUntil: "domcontentloaded",
    });

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
