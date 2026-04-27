"use client";

import { CSSProperties, Suspense } from "react";

import { useParams } from "next/navigation";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import CVConfigForm from "../cv-config/cv-config-form";
import CVConfigFormSkeleton from "../cv-config/cv-config-form-skeleton";
import CVDataForm from "../cv-data-form";
import CVPreview from "../cv-preview";
import CVPreviewSkeleton from "../cv-preview-skeleton";
import CVTemplateForm from "../cv-template-form";
import CVUnsavedChangesDialog from "../cv-unsaved-changes-dialog";
import CVBuilderFormSkeleton from "./cv-builder-form-skeleton";

export default function CVBuilder({ fontDataUri }: { fontDataUri: string }) {
  const params = useParams();
  const id = params.id as string;
  const stagger = (value: number) => ({ "--stagger": value }) as CSSProperties;

  return (
    <>
      <CVUnsavedChangesDialog />
      <div className="min-h-0 flex-1 overflow-hidden">
        <div className="container mx-auto flex h-full gap-2 px-4 sm:px-6 lg:px-8">
          <div
            className="no-scrollbar load-stagger min-h-0 w-full flex-1 overflow-y-auto"
            style={stagger(2)}
          >
            <Tabs
              defaultValue="data"
              className="flex w-full flex-col items-center"
            >
              <TabsList>
                <TabsTrigger value="data">Data</TabsTrigger>
                <TabsTrigger value="template">Template</TabsTrigger>
                <TabsTrigger value="config">Config</TabsTrigger>
                <TabsTrigger value="preview" className="lg:hidden">
                  Preview
                </TabsTrigger>
              </TabsList>

              <TabsContent value="data" className="w-full overflow-y-auto p-1">
                <div
                  className="no-scrollbar load-stagger min-h-0 w-full flex-1 overflow-y-auto"
                  style={stagger(2)}
                >
                  {/* DATA FORM */}
                  <Suspense fallback={<CVBuilderFormSkeleton />}>
                    <CVDataForm />
                  </Suspense>
                </div>
              </TabsContent>

              <TabsContent
                value="template"
                className="load-stagger w-full overflow-y-auto p-1"
              >
                {/* TEMPLATE FORM */}
                <CVTemplateForm id={id} />
              </TabsContent>

              <TabsContent
                value="config"
                className="flex w-full overflow-y-auto p-1"
              >
                <div
                  className="no-scrollbar load-stagger min-h-0 w-full flex-1 overflow-y-auto"
                  style={stagger(2)}
                >
                  {/* CONFIG FORM */}
                  <Suspense fallback={<CVConfigFormSkeleton />}>
                    <CVConfigForm />
                  </Suspense>
                </div>
              </TabsContent>

              <TabsContent
                value="preview"
                className="w-full overflow-y-auto p-1"
              >
                <div
                  className="no-scrollbar load-stagger min-h-0 w-full flex-1 overflow-y-auto"
                  style={stagger(2)}
                >
                  {/* PREVIEW */}
                  <Suspense fallback={<CVPreviewSkeleton />}>
                    <CVPreview id={id} fontDataUri={fontDataUri} />
                  </Suspense>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Preview panel — desktop (lg+) only */}
          <aside
            className="no-scrollbar load-stagger hidden min-h-0 flex-1 overflow-y-auto pb-4 lg:block"
            style={stagger(6)}
          >
            <Suspense fallback={<CVPreviewSkeleton />}>
              <CVPreview id={id} fontDataUri={fontDataUri} />
            </Suspense>
          </aside>
        </div>
      </div>
    </>
  );
}
