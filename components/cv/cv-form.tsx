"use client";

import { Suspense, useState } from "react";

import { useParams } from "next/navigation";

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

import { useCV } from "@/hooks/cv/use-cv";

import { PersonalInfoFormSkeleton } from "../forms/personal-info/personal-info-form-skeleton";
import { Skeleton } from "../ui/skeleton";
import CVFormMenu from "./cv-form-menu/cv-form-menu";
import CVFormMenuSkeleton from "./cv-form-menu/cv-form-menu-skeleton";
import CVFormStatus from "./cv-form-status";
import CVFormTitle from "./cv-form-title";

export default function CVForm() {
  const params = useParams();
  const id = params.id as string;

  const [activeTab, setActiveTab] = useState("personal-info");
  const [isDirtyForm, setIsDirtyForm] = useState(false);
  const [pendingTab, setPendingTab] = useState<string | null>(null);

  const handleTabChange = (value: string) => {
    if (isDirtyForm) {
      setPendingTab(value);
    } else {
      setActiveTab(value);
    }
  };

  const confirmTabChange = () => {
    if (pendingTab) {
      setActiveTab(pendingTab);
      setPendingTab(null);
      setIsDirtyForm(false);
    }
  };

  const cancelTabChange = () => {
    setPendingTab(null);
  };

  return (
    <div className="flex flex-col gap-4">
      <Suspense fallback={<Skeleton className="h-9 w-32" />}>
        <CVFormTitle id={id} />
      </Suspense>

      <div className="flex flex-row gap-4 items-center">
        <Suspense fallback={<CVFormMenuSkeleton />}>
          <CVFormMenu id={id} />
        </Suspense>
        <Suspense fallback={<Skeleton className="h-6 w-16" />}>
          <CVFormStatus id={id} />
        </Suspense>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <div className="overflow-auto scrollbar-hide snap-x snap-mandatory">
          <TabsList className="h-auto py-2">
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
        </div>

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
