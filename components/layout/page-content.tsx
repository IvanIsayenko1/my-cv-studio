import { cn } from "@/lib/utils/cn";

export default function PageContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn(`container mx-auto px-4 sm:px-6 lg:px-8`, className)}>
      {children}
    </div>
  );
}
