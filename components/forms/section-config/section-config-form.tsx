"use client";

import { useForm } from "react-hook-form";

import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, GripVertical, RotateCcw, Save, X } from "lucide-react";
import { z } from "zod";

import SectionWrapper from "@/components/cv/cv-form-section-wrapper";
import FormStatusBedge from "@/components/form-status-bedge";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";

import { useSaveTemplateConfig } from "@/hooks/cv/use-template-config";

import {
  TemplateConfigFormValues,
  templateConfigSchema,
} from "@/schemas/template-config";

const DEFAULT_SECTIONS = [
  { id: "summary", label: "Summary", order: 0, visible: true },
  { id: "experience", label: "Experience", order: 1, visible: true },
  { id: "skills", label: "Skills", order: 2, visible: true },
  { id: "education", label: "Education", order: 3, visible: true },
  { id: "languages", label: "Languages", order: 4, visible: true },
  { id: "projects", label: "Projects", order: 5, visible: true },
  { id: "certifications", label: "Certifications", order: 6, visible: true },
  { id: "awards", label: "Awards", order: 7, visible: true },
];

const sectionConfigFormSchema = templateConfigSchema
  .pick({ sections: true })
  .required();

type FormValues = z.infer<typeof sectionConfigFormSchema>;
type Section = FormValues["sections"][number];

function SortableSection({
  section,
  index,
  total,
  onChange,
  onToggleVisible,
}: {
  section: Section;
  index: number;
  total: number;
  onChange: (label: string) => void;
  onToggleVisible: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <div className="flex cursor-default items-center gap-3 p-3">
        <button
          type="button"
          className="text-muted-foreground flex-shrink-0 cursor-grab touch-none active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-5 w-5" />
        </button>
        <Input
          value={section.label}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1"
          placeholder="Section name"
        />
        <Button
          type="button"
          variant="outline"
          size="icon-lg"
          onClick={onToggleVisible}
          className="flex-shrink-0"
          title={section.visible ? "Hide section" : "Show section"}
        >
          {section.visible ? (
            <Eye className="h-4 w-4" />
          ) : (
            <EyeOff className="h-4 w-4 opacity-50" />
          )}
        </Button>
      </div>
      {index < total - 1 && <Separator orientation="horizontal" />}
    </div>
  );
}

export default function SectionConfigForm({
  id,
  configData,
}: {
  id: string;
  configData: TemplateConfigFormValues;
}) {
  const { mutate, isPending } = useSaveTemplateConfig(id);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const sections = configData?.sections?.length
    ? configData.sections
    : DEFAULT_SECTIONS;

  const form = useForm<FormValues>({
    resolver: zodResolver(sectionConfigFormSchema),
    defaultValues: { sections },
  });

  const onSubmit = async (values: FormValues) => {
    mutate(
      { ...configData, sections: values.sections },
      { onSuccess: () => form.reset(values) }
    );
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const current = form.getValues("sections");
    const oldIndex = current.findIndex((s) => s.id === active.id);
    const newIndex = current.findIndex((s) => s.id === over.id);

    const reordered = [...current];
    const [moved] = reordered.splice(oldIndex, 1);
    reordered.splice(newIndex, 0, moved);

    form.setValue(
      "sections",
      reordered.map((s, i) => ({ ...s, order: i })),
      { shouldDirty: true, shouldValidate: true }
    );
  };

  const resetOrder = () => {
    const current = form.getValues("sections");
    const sorted = [...DEFAULT_SECTIONS].map((def) => {
      const existing = current.find((s) => s.id === def.id);
      return existing ? { ...existing, order: def.order } : { ...def };
    });
    form.setValue("sections", sorted, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const resetNames = () => {
    const current = form.getValues("sections");
    const renamed = current.map((s) => {
      const def = DEFAULT_SECTIONS.find((d) => d.id === s.id);
      return def ? { ...s, label: def.label } : s;
    });
    form.setValue("sections", renamed, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  return (
    <SectionWrapper
      sectionId="section-config"
      title="Sections"
      description="Customize section titles and order"
      cvId="section-config"
      status={
        <div className="space-x-2">
          <FormStatusBedge isNotSaved={form.formState.isDirty} />
        </div>
      }
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-8"
        >
          <FormField
            control={form.control}
            name="sections"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={field.value.map((s) => s.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div>
                        {field.value.map((section, index) => (
                          <SortableSection
                            key={section.id}
                            section={section}
                            index={index}
                            total={field.value.length}
                            onChange={(label) => {
                              const updated = [...field.value];
                              updated[index] = { ...section, label };
                              field.onChange(updated);
                            }}
                            onToggleVisible={() => {
                              const updated = [...field.value];
                              updated[index] = {
                                ...section,
                                visible: !section.visible,
                              };
                              field.onChange(updated);
                            }}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="cv-form-actions">
            <Button type="button" variant="outline" onClick={resetOrder}>
              <RotateCcw className="h-3.5 w-3.5" />
              Reset order
            </Button>
            <Button type="button" variant="outline" onClick={resetNames}>
              <RotateCcw className="h-3.5 w-3.5" />
              Reset names
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={!form.formState.isDirty || isPending}
              onClick={() => form.reset()}
            >
              <X className="h-4 w-4" />
              Discard changes
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="cv-form-primary-action"
            >
              {isPending ? <Spinner /> : <Save />}
              {isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </Form>
    </SectionWrapper>
  );
}
