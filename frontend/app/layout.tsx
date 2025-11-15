import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/shared/theme-provider";
import { AuthProvider } from "@/lib/auth-context";
import { Navigation } from "@/components/shared/navigation";
import { ThemeNotification } from "@/components/shared/theme-notification";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tarkist.us - Comprehensive Third-Party Software Security Analysis",
  description: "Evaluate third-party software across 15 comprehensive security dimensions. Get actionable insights through beautiful, data-driven reports.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          themes={["light", "dark", "matrix"]}
        >
          <AuthProvider>
            <Navigation />
            <ThemeNotification />
            <main className="min-h-screen">
              {children}
            </main>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
