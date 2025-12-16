"use client";

import { PersonalInfoForm } from "@/components/personal-info-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import {
  ArrowLeftIcon,
  BadgeCheckIcon,
  MoreHorizontalIcon,
} from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchCVData } from "@/lib/queries/cv-queries";
import { useParams, useRouter } from "next/navigation";
import { routes } from "@/const/routes";
import { Input } from "./ui/input";
import { WorkExperienceForm } from "./work-experience-form";
import { SummaryForm } from "./summary-form";
import { EducationForm } from "./education-form";
import { SkillsForm } from "./skills-form";
import { CertificationsForm } from "./certifications-form";
import { ProjectsForm } from "./projects-form";
import { AwardsForm } from "./awards-form";

export default function CVForm() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("personal-info");
  const [isDirtyForm, setIsDirtyForm] = useState(false);
  const [pendingTab, setPendingTab] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["cv-data", id],
    queryFn: () => fetchCVData(id),
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
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
        {data?.title || "CV"}
      </h3>

      <div className="flex flex-row gap-4 items-center">
        <ButtonGroup>
          <Button
            variant="outline"
            size="icon"
            aria-label="Go Back"
            onClick={() => router.push(routes.dashboard)}
          >
            <ArrowLeftIcon />
          </Button>
        </ButtonGroup>
        <ButtonGroup className="hidden sm:flex">
          <Button variant="outline">Share</Button>
          <Button variant="outline">Duplicate</Button>
          <Button variant="outline">Download</Button>
          <Button variant="destructive">Delete</Button>
        </ButtonGroup>
        <ButtonGroup className="flex sm:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" aria-label="Open menu">
                <MoreHorizontalIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Share</DropdownMenuItem>
              <DropdownMenuItem>Duplicate</DropdownMenuItem>
              <DropdownMenuItem>Download</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </ButtonGroup>

        {data?.status === "draft" ? (
          <Badge
            variant="secondary"
            className="bg-yellow-500 text-white dark:bg-yellow-600"
          >
            draft
          </Badge>
        ) : (
          <Badge
            variant="secondary"
            className="bg-green-500 text-white dark:bg-green-600"
          >
            <BadgeCheckIcon />
            Ready
          </Badge>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <div className="overflow-auto scrollbar-hide snap-x snap-mandatory">
          <TabsList className="h-auto py-2">
            <TabsTrigger value="personal-info">Personal Info</TabsTrigger>
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="work-experience">Work Experience</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="certifications">Certifications</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="awards">Awards</TabsTrigger>
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
