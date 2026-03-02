"use client";
import { MouseEvent, useRef } from "react";

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
  ...props
}: A4Props) {
  const widthValue = typeof width === "number" ? `${width}px` : width;
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform =
      "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
  };

  return (
    <button className="w-full flex justify-center" onClick={onClick}>
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={cn(
          "w-full max-w-[210mm] rounded-xl cursor-pointer",
          "bg-card text-card-foreground border border-border",
          "shadow-lg transition-all duration-200 ease-out",
          "hover:shadow-2xl",
          className
        )}
        style={{
          width: widthValue,
          maxWidth: "210mm",
          aspectRatio: "210 / 297",
          transformStyle: "preserve-3d",
        }}
        {...props}
      >
        <div className="w-full h-full p-3 overflow-auto">{children}</div>
      </div>
    </button>
  );
}
