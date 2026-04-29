import AccentColorFormSkeleton from "@/components/forms/accent-color/accent-color-form-skeleton";
import SectionConfigFormSkeleton from "@/components/forms/section-config/section-config-form-skeleton";

export default function CVPersonalizationFormSkeleton() {
  return (
    <div className="no-scrollbar min-h-0 w-full flex-1 space-y-2 overflow-y-auto pb-4">
      <AccentColorFormSkeleton />
      <SectionConfigFormSkeleton />
    </div>
  );
}
