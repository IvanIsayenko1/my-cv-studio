"use client";
import { KeyboardEvent } from "react";

import { cn } from "@/lib/utils/cn";

interface A4Props extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  width?: string | number;
  onClick?: () => void;
}

export function A4({
  children,
  className,
  width = "100%",
  onClick,
  style,
  ...props
}: A4Props) {
  const widthValue = typeof width === "number" ? `${width}px` : width;

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!onClick) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onClick();
    }
  };

  return (
    <div className="flex w-full justify-center">
      <div
        onClick={onClick}
        onKeyDown={handleKeyDown}
        role={onClick ? "button" : undefined}
        tabIndex={onClick ? 0 : undefined}
        className={cn(
          "group w-full max-w-[210mm] rounded-4xl",
          "bg-card text-card-foreground border-border border",
          "shadow-lg transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
          "hover:-translate-y-1 hover:scale-[1.01] hover:shadow-2xl",
          onClick ? "cursor-pointer" : "",
          className
        )}
        style={{
          width: widthValue,
          maxWidth: "210mm",
          aspectRatio: "210 / 297",
          ...style,
        }}
        {...props}
      >
        <div className="h-full w-full overflow-auto p-3">{children}</div>
      </div>
    </div>
  );
}
