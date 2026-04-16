import { CSSProperties } from "react";

import Header from "@/components/layout/header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main
        className="load-stagger h-[calc(100dvh_-_4.5rem)] w-full"
        style={{ "--stagger": 1 } as CSSProperties}
      >
        {children}
      </main>
    </>
  );
}
