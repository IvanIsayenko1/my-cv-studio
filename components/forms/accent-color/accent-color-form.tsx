import { useState } from "react";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronDown, Save, X } from "lucide-react";

import SectionWrapper from "@/components/cv/cv-form-section-wrapper";
import SelectorDrawer from "@/components/dialogs/selector-drawer";
import FormStatusBedge from "@/components/form-status-bedge";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";

import { useSaveTemplateConfig } from "@/hooks/cv/use-template-config";
import { useMediaQuery } from "@/hooks/use-media-query";

import { RESOLUTIONS } from "@/lib/constants/resolutions";
import { PRESET_COLORS } from "@/lib/constants/template-accent-colors";

import {
  TemplateConfigFormValues,
  templateConfigSchema,
} from "@/schemas/template-config";

export default function AccentColorForm({
  id,
  configData,
}: {
  id: string;
  configData: TemplateConfigFormValues;
}) {
  const isDesktop = useMediaQuery(RESOLUTIONS.DESKTOP);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const { mutate, isPending } = useSaveTemplateConfig(id);

  const form = useForm<TemplateConfigFormValues>({
    resolver: zodResolver(templateConfigSchema),
    mode: "onTouched",
    defaultValues: {
      accentColor: configData?.accentColor || "#0066CC",
      customAccentColor: configData?.customAccentColor || undefined,
    },
  });

  const onSubmit = async (values: TemplateConfigFormValues) => {
    mutate(values);
  };

  return (
    <>
      <SectionWrapper
        sectionId="accent-color"
        title="Accent color"
        description="Change the accent color of the template"
        cvId="accent-color"
        status={
          <div className="space-x-2">
            <FormStatusBedge isNotSaved={form.formState.isDirty} />
          </div>
        }
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, (errors) => {
              console.log("Validation errors:", errors);
            })}
            className="flex flex-col gap-8"
          >
            <FormField
              control={form.control}
              name="accentColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Accent Color</FormLabel>
                  <FormControl>
                    {isDesktop ? (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-full">
                          <div className="flex items-center gap-2">
                            <SelectValue />
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          {PRESET_COLORS.map((color) => (
                            <SelectItem key={color.value} value={color.value}>
                              <div className="flex items-center gap-2">
                                <div
                                  className="h-4 w-4 rounded-3xl border"
                                  style={{ backgroundColor: color.value }}
                                />
                                {color.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Button
                        type="button"
                        variant="outline"
                        className="h-11 w-full justify-between px-3"
                        onClick={() => setShowColorPicker(true)}
                        aria-label="Choose accent color"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className="h-4 w-4 rounded-3xl border"
                            style={{ backgroundColor: field.value }}
                          />
                          {field.value
                            ? PRESET_COLORS.find(
                                (color) => color.value === field.value
                              )?.name || "Custom Color"
                            : "Select Accent Color"}
                        </div>
                        <ChevronDown className="size-4 opacity-70" />
                      </Button>
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="customAccentColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Custom Accent Color</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="HEX color code (e.g., #ff5733)"
                        value={field.value || ""}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                      />
                      {field.value && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            form.setValue("customAccentColor", "", {
                              shouldDirty: true,
                              shouldValidate: true,
                            });
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="cv-form-actions">
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

      <SelectorDrawer
        open={showColorPicker}
        onOpenChange={(open) => {
          if (!open) setShowColorPicker(false);
        }}
        title="Select Accent Color"
        content={PRESET_COLORS.map((option) => {
          const selected =
            form.getValues("accentColor") !== null &&
            form.getValues("accentColor") === option.value;

          return (
            <Button
              key={option.value}
              type="button"
              variant={selected ? "default" : "ghost"}
              size="lg"
              className="h-12 w-full justify-between px-4 text-left"
              onClick={() => {
                if (form.getValues("accentColor") === null) return;
                form.setValue("accentColor", option.value, {
                  shouldDirty: true,
                  shouldTouch: true,
                  shouldValidate: true,
                });
                setShowColorPicker(false);
              }}
            >
              <div className="flex items-center gap-2">
                <div
                  className="h-4 w-4 rounded-3xl border"
                  style={{ backgroundColor: option.value }}
                />
                {option.name}
              </div>
              {selected ? <Check className="size-4" /> : null}
            </Button>
          );
        })}
      ></SelectorDrawer>
    </>
  );
}
