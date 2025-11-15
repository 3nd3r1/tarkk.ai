"use client"

import Link from "next/link";
import { useTheme } from "next-themes";
import { Moon, Sun, Shield, GitCompare, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export function Navigation() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl">
              <Shield className="h-6 w-6 text-primary" />
              <span className="gradient-text">Security Assessor</span>
            </Link>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <Shield className="h-6 w-6 text-primary" />
            <span className="gradient-text">Security Assessor</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-4">
            <Link href="/compare" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <GitCompare className="h-4 w-4" />
              <span>Compare</span>
            </Link>
            <Link href="/about" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <Info className="h-4 w-4" />
              <span>About</span>
            <Link href="/pricing" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <DollarSign className="h-4 w-4" />
              <span>Pricing</span>
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </nav>
  );
}
