import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";

import { ClerkProvider } from "@clerk/nextjs";
import { GeistSans } from "geist/font/sans";
import { Toaster } from "sonner";

import AppLayout from "@/components/layout/app-layout";
import { QueryProvider } from "@/components/shared/providers/query-provider";
import { ThemeProvider } from "@/components/shared/providers/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";

import { cn } from "@/lib/utils";

import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

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
      <html
        lang="en"
        suppressHydrationWarning
        className={cn(GeistSans.className, "font-sans", geist.variable)}
      >
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
                <TooltipProvider>
                  <AppLayout>{children}</AppLayout>
                  <Toaster position="top-center" richColors />
                </TooltipProvider>
              </QueryProvider>
            </ClerkProvider>
          </ThemeProvider>
        </body>
      </html>
    </>
  );
}
