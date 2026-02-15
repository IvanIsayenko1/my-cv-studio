import { ClerkProvider } from "@clerk/nextjs";
import { GeistSans } from "geist/font/sans";

import Layout from "@/components/layout/layout";
import { QueryProvider } from "@/components/shared/providers/query-provider";
import { ThemeProvider } from "@/components/shared/providers/theme-provider";

import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <html lang="en" suppressHydrationWarning className={GeistSans.className}>
        <head />
        <body>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ClerkProvider
              publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
              appearance={{
                baseTheme: undefined,
              }}
            >
              <QueryProvider>
                <Layout>{children}</Layout>
              </QueryProvider>
            </ClerkProvider>
          </ThemeProvider>
        </body>
      </html>
    </>
  );
}
