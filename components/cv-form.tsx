"use client";

import { PersonalInfoForm } from "@/components/personal-info-form";
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
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { WorkExperienceForm } from "./work-experience-form";
import { SummaryForm } from "./summary-form";
import { EducationForm } from "./education-form";
import { SkillsForm } from "./skills-form";
import { CertificationsForm } from "./certifications-form";
import { ProjectsForm } from "./projects-form";
import { AwardsForm } from "./awards-form";
import CVFormMenu from "./cv-form-menu";
import { TemplateForm } from "./template-form";
import CVFormStatus from "./cv-form-status";
import { fetchCV } from "@/lib/fetches/cv-fetches";
import { Skeleton } from "./ui/skeleton";
import CVFormTitle from "./cv-form-title";

export default function CVForm() {
  const params = useParams();
  const id = params.id as string;

  const [activeTab, setActiveTab] = useState("personal-info");
  const [isDirtyForm, setIsDirtyForm] = useState(false);
  const [pendingTab, setPendingTab] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["cv", id],
    queryFn: () => fetchCV(id),
  });

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
      <CVFormTitle id={id} />

      <div className="flex flex-row gap-4 items-center">
        <CVFormMenu id={id} />
        <CVFormStatus id={id} />
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
          <PersonalInfoForm setIsDirtyForm={setIsDirtyForm} id={id} />
        </TabsContent>
        <TabsContent value="summary">
          <SummaryForm setIsDirtyForm={setIsDirtyForm} id={id} />
        </TabsContent>
        <TabsContent value="work-experience">
          <WorkExperienceForm setIsDirtyForm={setIsDirtyForm} id={id} />
        </TabsContent>
        <TabsContent value="education">
          <EducationForm setIsDirtyForm={setIsDirtyForm} id={id} />
        </TabsContent>
        <TabsContent value="skills">
          <SkillsForm setIsDirtyForm={setIsDirtyForm} id={id} />
        </TabsContent>
        <TabsContent value="certifications">
          <CertificationsForm setIsDirtyForm={setIsDirtyForm} id={id} />
        </TabsContent>
        <TabsContent value="projects">
          <ProjectsForm setIsDirtyForm={setIsDirtyForm} id={id} />
        </TabsContent>
        <TabsContent value="awards">
          <AwardsForm setIsDirtyForm={setIsDirtyForm} id={id} />
        </TabsContent>
        <TabsContent value="cv-template">
          <TemplateForm setIsDirtyForm={setIsDirtyForm} id={id} />
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
