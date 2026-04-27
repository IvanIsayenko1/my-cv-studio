import Image from "next/image";

import { Check } from "lucide-react";

import {
  useSaveTemplate,
  useTemplateSuspenseQuery,
} from "@/hooks/cv/use-template";

import { cn } from "@/lib/utils";

import { TEMPLATE_OPTIONS } from "@/types/template";

import PageContent from "../layout/page-content";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "../ui/card";

export default function CVTemplateForm({ id }: { id: string }) {
  const { data: templateData } = useTemplateSuspenseQuery(id);
  const { mutate, isPending } = useSaveTemplate(id);

  const getTemplateCard = (template: (typeof TEMPLATE_OPTIONS)[number]) => {
    const isSelected = templateData?.id === template.id;
    return (
      <div className="relative">
        <Card
          className={cn(
            "w-72 cursor-pointer py-2 transition-all duration-200",
            isSelected
              ? "border-primary ring-primary/20 border-2 shadow-lg"
              : "hover:ring-primary/10 hover:shadow-lg"
          )}
          onClick={() => {
            if (!isPending && !isSelected) mutate({ id: template.id });
          }}
        >
          {isSelected && (
            <div className="bg-primary text-primary-foreground absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full shadow-md">
              <Check size={18} />
            </div>
          )}
          <CardContent className="px-2">
            <Image
              src={template.previewSrc}
              alt={template.name}
              width={400}
              height={520}
              className="rounded-2xl"
            />
          </CardContent>
          <CardFooter className="flex-col">
            <CardTitle>{template.name}</CardTitle>
            <CardDescription>{template.description}</CardDescription>
          </CardFooter>
        </Card>
      </div>
    );
  };

  return (
    <PageContent className="pb-4">
      <div className="flex flex-row flex-wrap justify-center gap-4">
        {TEMPLATE_OPTIONS.map((template) => (
          <div key={template.id}>{getTemplateCard(template)}</div>
        ))}
      </div>
    </PageContent>
  );
}
