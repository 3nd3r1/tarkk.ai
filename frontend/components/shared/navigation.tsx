"use client"

import Link from "next/link";
import { useTheme } from "next-themes";
import { Moon, Sun, Grid3x3, DollarSign, Info, LogIn, Menu, X, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { UserMenu } from "@/components/auth/user-menu";
import { AuthModal } from "@/components/auth/auth-modal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Logo } from "./logo";

export function Navigation() {
  const { theme, setTheme } = useTheme();
  const { isAuthenticated } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl">
              <Logo size={28} className="text-primary" />
              <span className="gradient-text">Tarkist.us</span>
            </Link>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <>
      <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="h-16 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link href="/" className="flex items-center gap-2 font-bold text-xl">
                <Logo size={28} className="text-primary" />
                <span className="gradient-text">Tarkist.us</span>
              </Link>
              
              <div className="hidden md:flex items-center gap-4">
                <Link href="/history" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <Grid3x3 className="h-4 w-4" />
                  <span>Applications</span>
                </Link>
                <Link href="/about" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <Info className="h-4 w-4" />
                  <span>About</span>
                </Link>
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
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="Select theme">
                    {theme === "dark" ? (
                      <Moon className="h-5 w-5" />
                    ) : theme === "matrix" ? (
                      <Terminal className="h-5 w-5" />
                    ) : (
                      <Sun className="h-5 w-5" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setTheme("light")}>
                    <Sun className="h-4 w-4 mr-2" />
                    <span>Light</span>
                    {theme === "light" && <span className="ml-auto">✓</span>}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("dark")}>
                    <Moon className="h-4 w-4 mr-2" />
                    <span>Dark</span>
                    {theme === "dark" && <span className="ml-auto">✓</span>}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("matrix")}>
                    <Terminal className="h-4 w-4 mr-2" />
                    <span>Matrix</span>
                    {theme === "matrix" && <span className="ml-auto">✓</span>}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {isAuthenticated ? (
                <UserMenu />
              ) : (
                <Button onClick={() => setAuthModalOpen(true)} size="sm">
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
              )}
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t py-4 space-y-3">
              <Link
                href="/history"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors px-2 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Grid3x3 className="h-4 w-4" />
                <span>Applications</span>
              </Link>
              <Link
                href="/about"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors px-2 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Info className="h-4 w-4" />
                <span>About</span>
              </Link>
              <Link
                href="/pricing"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors px-2 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <DollarSign className="h-4 w-4" />
                <span>Pricing</span>
              </Link>
            </div>
          )}
        </div>
      </nav>

      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </>
  );
}
