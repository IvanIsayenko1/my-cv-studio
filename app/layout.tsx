import "./globals.css";

import { ThemeProvider } from "@/components/theme-provider";
import Layout from "@/components/layout";
import { ClerkProvider } from "@clerk/nextjs";
import { QueryProvider } from "@/components/query-provider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
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
