"use client";

import { Suspense, useCallback, useEffect, useState } from "react";

import Link from "next/link";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

import { ArrowLeftIcon } from "lucide-react";

import { AwardsForm } from "@/components/forms/awards/awards-form";
import AwardsFormSkeleton from "@/components/forms/awards/awards-form-skeleton";
import { CertificationsForm } from "@/components/forms/certifications/certifications-form";
import { CertificationsFormSkeleton } from "@/components/forms/certifications/certifications-form-skeleton";
import { EducationForm } from "@/components/forms/education/education-form";
import { EducationFormSkeleton } from "@/components/forms/education/education-form-skeleton";
import { PersonalInfoForm } from "@/components/forms/personal-info/personal-info-form";
import { ProjectsForm } from "@/components/forms/projects/projects-form";
import ProjectsFormSkeleton from "@/components/forms/projects/projects-form-skeleton";
import { SkillsForm } from "@/components/forms/skills/skills-form";
import { SkillsFormSkeleton } from "@/components/forms/skills/skills-form-skeleton";
import { SummaryForm } from "@/components/forms/summary/summary-form";
import { SummaryFormSkeleton } from "@/components/forms/summary/summary-form-skeleton";
import { TemplateForm } from "@/components/forms/template/template-form";
import TemplateFormSkeleton from "@/components/forms/template/template-form-skeleton";
import { WorkExperienceForm } from "@/components/forms/work-experience/work-experience-form";
import { WorkExperienceFormSkeleton } from "@/components/forms/work-experience/work-experience-form-skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useMediaQuery } from "@/hooks/use-media-query";

import { RESOLUTIONS } from "@/lib/constants/resolutions";

import { ROUTES } from "@/config/routes";

import { PersonalInfoFormSkeleton } from "../forms/personal-info/personal-info-form-skeleton";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import CVFormMenu from "./cv-form-menu/cv-form-menu";
import CVFormMenuSkeleton from "./cv-form-menu/cv-form-menu-skeleton";
import CVFormStatus from "./cv-form-status";
import CVFormTitle from "./cv-form-title";

const FORM_TABS = [
  "personal-info",
  "summary",
  "work-experience",
  "education",
  "skills",
  "certifications",
  "projects",
  "awards",
  "cv-template",
] as const;

type FormTab = (typeof FORM_TABS)[number];

const isFormTab = (value: string | null): value is FormTab =>
  Boolean(value && FORM_TABS.includes(value as FormTab));

export default function CVForm() {
  const params = useParams();
  const id = params.id as string;

  const pathname = usePathname();
  const searchParams = useSearchParams();

  const urlTab = searchParams.get("tab");
  const initialTab = isFormTab(urlTab) ? urlTab : "personal-info";

  const [activeTab, setActiveTab] = useState<FormTab>(initialTab);
  const [isDirtyForm, setIsDirtyForm] = useState(false);
  const [pendingTab, setPendingTab] = useState<FormTab | null>(null);

  // router
  const router = useRouter();

  // custom hooks
  const isDesktop = useMediaQuery(RESOLUTIONS.DESKTOP);

  const syncTabToUrl = useCallback(
    (nextTab: FormTab) => {
      const nextParams = new URLSearchParams(searchParams.toString());
      nextParams.set("tab", nextTab);
      router.replace(`${pathname}?${nextParams.toString()}`, {
        scroll: false,
      });
    },
    [pathname, router, searchParams]
  );

  useEffect(() => {
    if (!isFormTab(urlTab)) {
      syncTabToUrl("personal-info");
      return;
    }

    if (pendingTab === null && urlTab !== activeTab) {
      setActiveTab(urlTab);
    }
  }, [activeTab, pendingTab, syncTabToUrl, urlTab]);

  const handleTabChange = (value: string) => {
    if (!isFormTab(value)) return;

    if (isDirtyForm) {
      setPendingTab(value);
    } else {
      setActiveTab(value);
      syncTabToUrl(value);
    }
  };

  const confirmTabChange = () => {
    if (pendingTab) {
      setActiveTab(pendingTab);
      syncTabToUrl(pendingTab);
      setPendingTab(null);
      setIsDirtyForm(false);
    }
  };

  const cancelTabChange = () => {
    setPendingTab(null);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start">
        <Button
          asChild
          variant="link"
          size={isDesktop ? "default" : "lg"}
          className="!p-0"
        >
          <Link href={ROUTES.MAKER} aria-label="Go Back">
            <ArrowLeftIcon aria-hidden="true" /> To the list
          </Link>
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-3 sm:gap-4">
        <div className="min-w-0 flex-1">
          <Suspense fallback={<Skeleton className="h-9 w-32" />}>
            <CVFormTitle id={id} />
          </Suspense>
        </div>
        <Suspense fallback={<Skeleton className="h-6 w-16" />}>
          <CVFormStatus id={id} />
        </Suspense>
        <div className="shrink-0">
          <Suspense fallback={<CVFormMenuSkeleton />}>
            <CVFormMenu id={id} />
          </Suspense>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="gap-4">
        {/* <div className="sticky top-[4rem] z-30 border-b border-border bg-background/95 py-2 backdrop-blur sm:top-[4.5rem] lg:top-[4.3rem]">
          <div className="pointer-events-none absolute top-2 bottom-2 left-0 z-10 w-6 bg-gradient-to-r from-background to-transparent sm:hidden" />
          <div className="pointer-events-none absolute top-2 right-0 bottom-2 z-10 w-6 bg-gradient-to-l from-background to-transparent sm:hidden" />
          <div className="overflow-x-auto scrollbar-hide [touch-action:pan-x]"> */}
        <TabsList
          className={`h-auto min-w-max py-1 ${isDesktop ? "" : "h-12"}`}
        >
          <TabsTrigger value="personal-info">
            Personal Info<span className="text-destructive">*</span>
          </TabsTrigger>
          <TabsTrigger value="summary">
            Summary<span className="text-destructive">*</span>
          </TabsTrigger>
          <TabsTrigger value="work-experience">
            Work Experience<span className="text-destructive">*</span>
          </TabsTrigger>
          <TabsTrigger value="education">
            Education<span className="text-destructive">*</span>
          </TabsTrigger>
          <TabsTrigger value="skills">
            Skills<span className="text-destructive">*</span>
          </TabsTrigger>
          <TabsTrigger value="certifications">Certifications</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="awards">Awards</TabsTrigger>
          <TabsTrigger value="cv-template">CV Template</TabsTrigger>
        </TabsList>
        {/* </div>
        </div> */}

        <TabsContent value="personal-info">
          <Suspense fallback={<PersonalInfoFormSkeleton />}>
            <PersonalInfoForm setIsDirtyForm={setIsDirtyForm} id={id} />
          </Suspense>
        </TabsContent>
        <TabsContent value="summary">
          <Suspense fallback={<SummaryFormSkeleton />}>
            <SummaryForm setIsDirtyForm={setIsDirtyForm} id={id} />
          </Suspense>
        </TabsContent>
        <TabsContent value="work-experience">
          <Suspense fallback={<WorkExperienceFormSkeleton />}>
            <WorkExperienceForm setIsDirtyForm={setIsDirtyForm} id={id} />
          </Suspense>
        </TabsContent>
        <TabsContent value="education">
          <Suspense fallback={<EducationFormSkeleton />}>
            <EducationForm setIsDirtyForm={setIsDirtyForm} id={id} />
          </Suspense>
        </TabsContent>
        <TabsContent value="skills">
          <Suspense fallback={<SkillsFormSkeleton />}>
            <SkillsForm setIsDirtyForm={setIsDirtyForm} id={id} />
          </Suspense>
        </TabsContent>
        <TabsContent value="certifications">
          <Suspense fallback={<CertificationsFormSkeleton />}>
            <CertificationsForm setIsDirtyForm={setIsDirtyForm} id={id} />
          </Suspense>
        </TabsContent>
        <TabsContent value="projects">
          <Suspense fallback={<ProjectsFormSkeleton />}>
            <ProjectsForm setIsDirtyForm={setIsDirtyForm} id={id} />
          </Suspense>
        </TabsContent>
        <TabsContent value="awards">
          <Suspense fallback={<AwardsFormSkeleton />}>
            <AwardsForm setIsDirtyForm={setIsDirtyForm} id={id} />
          </Suspense>
        </TabsContent>
        <TabsContent value="cv-template">
          <Suspense fallback={<TemplateFormSkeleton />}>
            <TemplateForm setIsDirtyForm={setIsDirtyForm} id={id} />
          </Suspense>
        </TabsContent>
      </Tabs>

      {/* Unsaved Changes Warning Dialog */}
      <AlertDialog
        open={pendingTab !== null}
        onOpenChange={(open) => !open && cancelTabChange()}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes in this section. If you leave now, your
              changes will be lost. Are you sure you want to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelTabChange}>
              Stay & Save
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmTabChange}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Leave Without Saving
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
