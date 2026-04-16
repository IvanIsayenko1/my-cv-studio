import { CSSProperties } from "react";

import CVBuilderHeader from "@/components/cv/cv-builder-header/cv-builder-header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CVBuilderHeader />
      <main
        className="load-stagger flex h-[calc(100dvh_-_4.5rem)] w-full flex-col overflow-hidden"
        style={{ "--stagger": 1 } as CSSProperties}
      >
        {children}
      </main>
    </>
  );
}
