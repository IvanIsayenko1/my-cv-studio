import { ThemeSwitcher } from "@/components/layout/theme-switcher";
import { Toaster } from "@/components/ui/sonner";

import Header from "./header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      {/* Sticky Header with Actions */}
      <Header />

      {/* Main Content */}
      <main className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {children}
      </main>

      <Toaster position="top-center" richColors />

      {/* Optional Footer
      <footer className="w-full border-t bg-background">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="h-6 sm:h-8 bg-muted rounded flex items-center justify-center text-muted-foreground text-xs sm:text-sm">
            Footer (Optional)
          </div>
        </div>
      </footer> */}
    </div>
  );
}
