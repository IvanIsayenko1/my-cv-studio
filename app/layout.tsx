import type { Metadata, Viewport } from "next";

import { ClerkProvider } from "@clerk/nextjs";
import { GeistSans } from "geist/font/sans";

import Layout from "@/components/layout/layout";
import { QueryProvider } from "@/components/shared/providers/query-provider";
import { ThemeProvider } from "@/components/shared/providers/theme-provider";

import "./globals.css";

const siteUrl =
  process.env.NEXT_PUBLIC_APP_URL ?? "https://my-cv-studio.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "mycvstudio",
  title: {
    default: "mycvstudio | AI CV Builder",
    template: "%s | mycvstudio",
  },
  description:
    "Build a better CV before you apply. Create, improve, share, and download resumes with a guided CV builder and AI writing assistant.",
  keywords: [
    "CV builder",
    "resume builder",
    "AI resume assistant",
    "AI CV assistant",
    "resume writing",
    "CV maker",
    "download CV",
    "share CV",
    "job application resume",
  ],
  authors: [{ name: "mycvstudio" }],
  creator: "mycvstudio",
  publisher: "mycvstudio",
  category: "productivity",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "mycvstudio",
    title: "mycvstudio | AI CV Builder",
    description:
      "Create a complete CV, improve resume sections with AI, share a live link, and download your CV when you are ready to apply.",
  },
  twitter: {
    card: "summary",
    title: "mycvstudio | AI CV Builder",
    description:
      "Build, improve, share, and download your CV with a guided builder and AI assistant.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <html lang="en" suppressHydrationWarning className={GeistSans.className}>
        <head />
        <body>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ClerkProvider
              publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
              appearance={{
                baseTheme: undefined,
              }}
            >
              <QueryProvider>
                <Layout>{children}</Layout>
              </QueryProvider>
            </ClerkProvider>
          </ThemeProvider>
        </body>
      </html>
    </>
  );
}
