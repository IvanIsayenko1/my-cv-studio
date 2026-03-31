# my-cv-studio

`my-cv-studio` is a free web app for creating resumes and CVs that are clear, structured, and easier for recruiters to scan.

The goal is simple: help people build a professional CV without fighting formatting, guessing what sections to include, or starting from a blank page.

## What is my-cv-studio?

Today, your resume is often the first contact between you and a potential employer. It needs to represent your skills, experience, and value quickly. In many cases, it is reviewed first by a recruiter or an applicant tracking system (ATS), so it must be easy to read, easy to scan, and well organized.

That is where `my-cv-studio` helps.

Creating a strong CV can feel difficult and repetitive, especially if you are unsure what to write, how to structure it, or what “ATS-friendly” actually means. Instead of forcing you to figure everything out on your own, the app gives you a guided builder with clear sections and templates designed for practical job searching.

## What the app helps with

- Creating a resume from structured sections instead of an empty document
- Choosing from multiple templates, including ATS-friendly layouts
- Filling in important CV sections with clear labels and guidance
- Keeping your CV readable for both recruiters and automated systems
- Exporting your CV as a PDF
- Sharing your CV with a public read-only link
- Managing multiple CV versions for different roles

## What you can do today

The current app already includes:

- CV creation and editing
- Separate forms for personal information, summary, work experience, skills, education, languages, certifications, projects, awards, and template selection
- Multiple templates, including `ATS Friendly Clean` and `Visual Clear`
- Live CV preview rendering
- PDF download
- CV status indicators such as `Draft` and `Ready`
- Duplicate, rename, and delete actions
- Public share links for recruiter-friendly read-only access
- Authenticated workspace support

## Planned / in progress

Some product ideas are already reflected in the app direction but are not fully shipped yet.

- ATS/job description checking
- Match scoring between a CV and a target job description
- Improvement suggestions based on role fit

These features should be documented as planned functionality for now, not as completed features.

## Why it is useful

`my-cv-studio` is built for people who want help with both structure and presentation.

- You do not need to guess which sections matter
- You do not need to design a CV layout from scratch
- You can prepare different versions of your CV for different roles
- You can create a cleaner, more professional document faster

This is especially useful for students, junior candidates, career changers, and anyone who wants a faster way to prepare a solid CV.

## Is it free?

Yes. `my-cv-studio` is totally free.

- No credit card required
- No subscription required
- No paid plans

You can use the app without a pricing barrier.

## Tech stack

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS 4
- Clerk for authentication
- Turso / LibSQL for storage
- React Query for client-side data fetching
- Puppeteer and PDF tooling for CV export

## Getting started

Install dependencies and run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

The app expects these environment variables:

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
TURSO_DATABASE_URL=
TURSO_AUTH_TOKEN=
```

Depending on your Clerk setup, you may also need the corresponding server-side Clerk secret variables in your local environment.

## Project status

`my-cv-studio` already works as a CV builder and exporter. The documentation should present it primarily as:

1. A free CV/resume builder
2. A template-based PDF generator
3. A shareable recruiter-facing resume tool

ATS checking should be described as upcoming until the workflow is fully implemented.
