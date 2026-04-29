import { CSSProperties } from "react";

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { auth } from "@clerk/nextjs/server";
import {
  ArrowRight,
  CheckCircle2,
  FileText,
  Layout,
  Wand2,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import { ROUTES } from "@/config/routes";

export const metadata: Metadata = {
  title: "ATS-Friendly CV Builder | mycvstudio",
  description:
    "Build an ATS-friendly CV that passes through applicant tracking systems. Create, improve with AI, and get hired faster.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "ATS-Friendly CV Builder | mycvstudio",
    description:
      "Build an ATS-friendly CV that passes through applicant tracking systems. Create, improve with AI, and get hired faster.",
    url: "/",
  },
  twitter: {
    title: "ATS-Friendly CV Builder | mycvstudio",
    description:
      "Build an ATS-friendly CV that passes through applicant tracking systems.",
  },
};

const atsFeatures = [
  "Simple, clean formatting without graphics or tables",
  "Readable by applicant tracking systems (ATS)",
  "Standardized fonts and sections",
  "No images or complex styling",
  "Perfect for online job applications",
] as const;

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "mycvstudio",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "https://my-cv-studio.vercel.app",
  description:
    "A web app for creating CVs, improving resume content with AI, organizing versions, sharing CV links, and downloading resumes.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Guided CV builder",
    "AI resume writing assistant",
    "CV version organization",
    "Shareable CV links",
    "CV downloads",
  ],
} as const;

export default async function Home() {
  const { userId } = await auth();

  return (
    <section
      className="load-stagger"
      style={{ "--stagger": 2 } as CSSProperties}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />

      {/* Hero Section */}
      <div className="flex min-h-screen flex-col justify-center px-4 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-6xl">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Left: Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="inline-block">
                  <span className="bg-primary text-primary-foreground rounded-full px-3 py-1 text-sm font-medium">
                    ✨ Free ATS-Friendly CV Builder
                  </span>
                </div>
                <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
                  Your CV, Built for ATS Systems
                </h1>
                <p className="text-muted-foreground max-w-xl text-lg leading-relaxed">
                  Most applications are filtered by Applicant Tracking Systems
                  before a human ever sees them. We help you build a CV that
                  passes through ATS screening and reaches recruiters.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col gap-4 sm:flex-row">
                <Button asChild size="lg" className="h-12 text-base">
                  <Link href={ROUTES.CV_LIST}>
                    Start Building Free <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                {!userId ? (
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="h-12 text-base"
                  >
                    <Link href={ROUTES.SIGN_IN}>Sign In</Link>
                  </Button>
                ) : null}
              </div>
              <p className="text-muted-foreground text-sm">
                No credit card required. Create unlimited CVs.
              </p>

              {/* ATS Features */}
              <div className="space-y-3 pt-4">
                {atsFeatures.map((feature) => (
                  <div key={feature} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-700" />
                    <span className="text-muted-foreground text-sm">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: CV Template Preview */}
            <div className="relative">
              <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
                <Image
                  src="/cv-templates/ats-friendly-simple.webp"
                  alt="ATS-Friendly CV Template Preview"
                  width={400}
                  height={550}
                  className="h-auto w-full"
                  priority
                />
              </div>
              <div className="bg-primary text-primary-foreground dark:bg-primary absolute -right-4 -bottom-4 rounded-3xl px-4 py-2 text-sm font-medium shadow-sm">
                ATS Optimized
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-card/50 border-y px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 space-y-4 text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">
              Everything You Need to Build Better
            </h2>
            <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
              A complete CV builder with forms, AI assistance, and multiple
              templates
            </p>
          </div>

          <div className="grid gap-2 sm:grid-cols-3">
            {/* Forms Feature */}
            <article className="bg-background border-border/70 hover:border-accent/30 rounded-3xl border p-8 transition-all hover:shadow-sm">
              <div className="space-y-4">
                <div className="bg-primary flex h-12 w-12 items-center justify-center rounded-3xl">
                  <FileText className="text-primary-foreground h-6 w-6" />
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-semibold">Guided Forms</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Step-by-step forms for each CV section. Add work experience,
                    education, skills, certifications, projects, awards, and
                    languages with clear prompts for every field.
                  </p>
                </div>
              </div>
            </article>

            {/* AI Assistance Feature */}
            <article className="bg-background border-border/70 hover:border-accent/30 rounded-3xl border p-8 transition-all hover:shadow-sm">
              <div className="space-y-4">
                <div className="bg-primary flex h-12 w-12 items-center justify-center rounded-3xl">
                  <Wand2 className="text-primary-foreground h-6 w-6" />
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-semibold">AI Assistant</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Get AI-powered suggestions to improve your professional
                    summary, bullet points, and descriptions. Write stronger
                    content while keeping your CV ATS-friendly.
                  </p>
                </div>
              </div>
            </article>

            {/* Templates Feature */}
            <article className="bg-background border-border/70 hover:border-accent/30 rounded-3xl border p-8 transition-all hover:shadow-sm">
              <div className="space-y-4">
                <div className="bg-primary flex h-12 w-12 items-center justify-center rounded-3xl">
                  <Layout className="text-primary-foreground h-6 w-6" />
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-semibold">
                    Multiple Templates
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Choose from different ATS-friendly CV designs. All templates
                    maintain clean formatting while giving you options for
                    different styles and preferences.
                  </p>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>

      {/* The Problem Section */}
      <div className="bg-card border-y px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="grid items-center gap-8 sm:grid-cols-2">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold sm:text-3xl">
                The ATS Problem
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Many recruiters use Applicant Tracking Systems to automatically
                parse CVs and filter candidates. These systems struggle with:
              </p>
              <ul className="text-muted-foreground space-y-2">
                <li className="flex gap-2">
                  <span className="text-red-500">✕</span> Complex formatting and
                  graphics
                </li>
                <li className="flex gap-2">
                  <span className="text-red-500">✕</span> Unusual fonts and
                  colors
                </li>
                <li className="flex gap-2">
                  <span className="text-red-500">✕</span> Tables and text boxes
                </li>
                <li className="flex gap-2">
                  <span className="text-red-500">✕</span> Headers and footers
                  with content
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h2 className="text-2xl font-bold sm:text-3xl">Our Solution</h2>
              <p className="text-muted-foreground leading-relaxed">
                mycvstudio guides you to create CVs that:
              </p>
              <ul className="text-muted-foreground space-y-2">
                <li className="flex gap-2">
                  <span className="text-green-700">✓</span> Use clean, standard
                  formatting
                </li>
                <li className="flex gap-2">
                  <span className="text-green-700">✓</span> Are easily parsed by
                  ATS software
                </li>
                <li className="flex gap-2">
                  <span className="text-green-700">✓</span> Highlight keywords
                  effectively
                </li>
                <li className="flex gap-2">
                  <span className="text-green-700">✓</span> Stay readable to
                  human recruiters
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl space-y-6 text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Ready to Build Your ATS-Friendly CV?
          </h2>
          <p className="text-muted-foreground text-lg">
            Create a CV that gets past ATS systems and impresses recruiters.
            Start now and take control of your applications.
          </p>
          <div className="space-y-3">
            <Button asChild size="lg" className="h-12 text-base">
              <Link href={ROUTES.CV_LIST}>
                Start Building Free <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <p className="text-muted-foreground text-sm">
              No credit card required. Create unlimited CVs.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
