import { cn } from "@/lib/utils/cn";

export default function ContentPage({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        `container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8`,
        className
      )}
    >
      {children}
    </div>
  );
}
