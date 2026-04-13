import { CSSProperties } from "react";

import { auth } from "@clerk/nextjs/server";
import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ROUTES } from "@/config/routes";

export const metadata: Metadata = {
  title: "Build a Better CV Before You Apply",
  description:
    "Use mycvstudio to create a complete CV, improve resume sections with AI, organize versions, share a live CV link, and download your resume.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Build a Better CV Before You Apply",
    description:
      "Create, improve, share, and download your CV with a guided builder and AI writing assistant.",
    url: "/",
  },
  twitter: {
    title: "Build a Better CV Before You Apply",
    description:
      "Create, improve, share, and download your CV with a guided builder and AI writing assistant.",
  },
};

const relatedApps = [
  {
    href: ROUTES.MAKER,
    eyebrow: "Here",
    name: (
      <>
        my<strong>cv</strong>studio
      </>
    ),
    description: "Create, check, and improve your CV before applying.",
    external: false,
  },
  {
    href: "https://myapplylog.com/",
    eyebrow: "Open",
    name: (
      <>
        my<strong>apply</strong>log
      </>
    ),
    description: "Track your applications, statuses, and contact dates in one place.",
    external: true,
  },
] as const;

const highlights = [
  {
    title: "Create a complete CV",
    description:
      "Add your work experience, education, skills, projects, certificates, awards, languages, and professional summary in a guided builder.",
  },
  {
    title: "Use the AI assistant",
    description:
      "Start with rough notes and ask the assistant to help write clearer bullet points, stronger summaries, and better resume sections.",
  },
  {
    title: "Keep versions organized",
    description:
      "Create different CVs for different roles, keep your edits in one place, and come back when you need to improve a version.",
  },
  {
    title: "Share and download",
    description:
      "Download your CV when you need a file, or create a share link when you want to send the latest version without attaching anything.",
  },
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
      <div className="mx-auto flex min-h-[calc(100vh-10rem)] max-w-5xl flex-col justify-center px-4 pt-6 pb-10 sm:px-6 lg:px-8">
        <div className="space-y-10 sm:space-y-12">
          <div className="space-y-6">
            <div className="space-y-5">
              <p className="text-xs font-medium tracking-[0.22em] text-muted-foreground uppercase">
                In progress
              </p>
              <h1 className="max-w-4xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                Build a better CV before you apply.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                mycvstudio helps you write, improve, share, and download your
                resume. Build your CV step by step and use the AI assistant
                when you need help turning your experience into clear resume
                text.
              </p>
            </div>
          </div>

          <div className="space-y-10">
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href={ROUTES.MAKER}>Open CV builder</Link>
              </Button>
              {!userId ? (
                <Button asChild size="lg" variant="ghost">
                  <Link href={ROUTES.SIGN_IN}>Login</Link>
                </Button>
              ) : null}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {highlights.map((item) => (
                <article
                  key={item.title}
                  className="rounded-md border border-border/70 bg-card/25 p-4"
                >
                  <div className="space-y-2">
                    <h2 className="text-sm font-semibold tracking-tight">
                      {item.title}
                    </h2>
                    <p className="text-sm leading-6 text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>

            <div className="space-y-2">
              <p className="text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">
                Related helpful apps
              </p>
              <div className="flex flex-col gap-3 border-y border-border/60 py-4 sm:flex-row sm:items-stretch">
                {relatedApps.map((app, index) => (
                  <div
                    key={app.href}
                    className="contents sm:flex sm:flex-1 sm:items-stretch"
                  >
                    <Link
                      href={app.href}
                      target={app.external ? "_blank" : undefined}
                      rel={app.external ? "noreferrer" : undefined}
                      className="group flex min-w-0 flex-1 items-start justify-between gap-4 rounded-md px-4 py-3 transition-colors hover:bg-card/45"
                    >
                      <div className="min-w-0 space-y-1">
                        <p className="text-sm tracking-tight">{app.name}</p>
                        <p className="text-sm leading-6 text-muted-foreground">
                          {app.description}
                        </p>
                      </div>
                      <span className="pt-0.5 text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase transition-colors group-hover:text-foreground">
                        {app.eyebrow}
                      </span>
                    </Link>
                    {index === 0 ? (
                      <div className="hidden w-px bg-border/60 sm:block" />
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
