"use client"

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { X, Palette, Sun, Moon, Terminal, Sparkles, Zap, PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "tarkist-theme-notification-shown";

export function ThemeNotification() {
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [celebrating, setCelebrating] = useState(false);
  const { theme, setTheme } = useTheme();
  const isMatrix = theme === "matrix";

  useEffect(() => {
    setMounted(true);
    // Check if notification has been shown before
    const hasSeenNotification = localStorage.getItem(STORAGE_KEY);
    if (!hasSeenNotification) {
      // Small delay to let page load
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem(STORAGE_KEY, "true");
  };

  const handleThemeChange = (newTheme: "light" | "dark" | "matrix") => {
    setTheme(newTheme);
    setCelebrating(true);
    setTimeout(() => setCelebrating(false), 2000);
    
    // Playful messages based on theme
    if (newTheme === "matrix") {
      // Matrix gets special treatment!
      setTimeout(() => {
        setCelebrating(false);
      }, 3000);
    }
  };

  if (!mounted || !isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -100, rotate: -10, scale: 0.5 }}
          animate={{ 
            opacity: 1, 
            y: 0, 
            rotate: 0, 
            scale: 1,
            ...(celebrating && {
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0],
            })
          }}
          exit={{ 
            opacity: 0, 
            y: -100, 
            rotate: 10, 
            scale: 0.5,
            transition: { duration: 0.3 }
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 20,
          }}
          className={cn(
            "fixed top-20 right-4 z-50 max-w-sm",
            "bg-background border-2 rounded-2xl shadow-2xl",
            "p-5 md:p-6",
            "backdrop-blur-sm",
            isMatrix && "border-[#00ff00]/50 bg-black/95 shadow-[0_0_40px_rgba(0,255,0,0.5)]",
            celebrating && "ring-4 ring-primary/50"
          )}
        >
          {/* Animated background particles */}
          <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className={cn(
                  "absolute w-2 h-2 rounded-full",
                  isMatrix ? "bg-[#00ff00]/30" : "bg-primary/20"
                )}
                initial={{
                  x: Math.random() * 100 + "%",
                  y: Math.random() * 100 + "%",
                  opacity: 0,
                }}
                animate={{
                  y: [null, "-100%"],
                  opacity: [0, 1, 0],
                  scale: [0, 1.5, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.5,
                  ease: "easeOut",
                }}
              />
            ))}
          </div>

          {/* Close button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-3 right-3 h-7 w-7 z-10 hover:bg-accent transition-colors"
            onClick={handleDismiss}
          >
            <motion.div
              whileHover={{ rotate: 90 }}
              transition={{ duration: 0.2 }}
            >
              <X className="h-4 w-4" />
            </motion.div>
          </Button>

          {/* Content */}
          <div className="pr-8 space-y-4 relative z-10">
            {/* Header with animated icon */}
            <div className="flex items-center gap-3">
              <motion.div
                animate={{
                  rotate: [0, 15, -15, 15, 0],
                  scale: [1, 1.15, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 2,
                }}
                className={cn(
                  "p-3 rounded-xl relative overflow-hidden",
                  isMatrix
                    ? "bg-[#00ff00]/10 border-2 border-[#00ff00]/40 shadow-[0_0_20px_rgba(0,255,0,0.3)]"
                    : "bg-primary/10 border-2 border-primary/30"
                )}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  <Palette
                    className={cn(
                      "h-6 w-6",
                      isMatrix ? "text-[#00ff00]" : "text-primary"
                    )}
                  />
                </motion.div>
                {celebrating && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: [0, 1.5, 0], opacity: [0, 1, 0] }}
                    transition={{ duration: 0.6 }}
                    className="absolute inset-0 bg-primary/20 rounded-xl"
                  />
                )}
              </motion.div>
              <div>
                <motion.h3
                  animate={celebrating ? {
                    scale: [1, 1.2, 1],
                  } : {}}
                  className={cn(
                    "font-bold text-lg",
                    isMatrix && "text-[#00ff00] [text-shadow:0_0_15px_rgba(0,255,0,0.6)]"
                  )}
                >
                  🎨 Theme Party! 🎉
                </motion.h3>
                <p className="text-xs text-muted-foreground">
                  Click a theme to transform!
                </p>
              </div>
            </div>

            {/* Theme options - now clickable! */}
            <div className="space-y-3">
              <motion.p 
                animate={celebrating ? { scale: [1, 1.05, 1] } : {}}
                className="text-sm font-medium text-muted-foreground"
              >
                Choose your vibe:
              </motion.p>
              <div className="grid grid-cols-3 gap-3">
                <motion.button
                  whileHover={{ scale: 1.1, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleThemeChange("light")}
                  className={cn(
                    "p-3 rounded-xl border-2 text-center transition-all cursor-pointer relative overflow-hidden group",
                    theme === "light"
                      ? isMatrix
                        ? "border-[#00ff00] bg-[#00ff00]/20 shadow-[0_0_20px_rgba(0,255,0,0.4)]"
                        : "border-primary bg-primary/20 shadow-lg"
                      : "border-border bg-muted/50 hover:border-primary/50 hover:bg-primary/5"
                  )}
                >
                  {theme === "light" && (
                    <motion.div
                      layoutId="activeTheme"
                      className="absolute inset-0 bg-primary/10 rounded-xl"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <motion.div
                    animate={theme === "light" ? {
                      rotate: [0, 360],
                      scale: [1, 1.2, 1],
                    } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Sun className={cn(
                      "h-5 w-5 mx-auto mb-1.5 relative z-10",
                      theme === "light" && isMatrix && "text-[#00ff00]",
                      theme === "light" && !isMatrix && "text-primary"
                    )} />
                  </motion.div>
                  <span className={cn(
                    "text-xs font-semibold relative z-10",
                    theme === "light" && isMatrix && "text-[#00ff00]"
                  )}>Light</span>
                  {celebrating && theme === "light" && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: [0, 1.5, 0], opacity: [0, 1, 0] }}
                      className="absolute inset-0 bg-yellow-400/30 rounded-xl"
                    />
                  )}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleThemeChange("dark")}
                  className={cn(
                    "p-3 rounded-xl border-2 text-center transition-all cursor-pointer relative overflow-hidden group",
                    theme === "dark"
                      ? isMatrix
                        ? "border-[#00ff00] bg-[#00ff00]/20 shadow-[0_0_20px_rgba(0,255,0,0.4)]"
                        : "border-primary bg-primary/20 shadow-lg"
                      : "border-border bg-muted/50 hover:border-primary/50 hover:bg-primary/5"
                  )}
                >
                  {theme === "dark" && (
                    <motion.div
                      layoutId="activeTheme"
                      className="absolute inset-0 bg-primary/10 rounded-xl"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <motion.div
                    animate={theme === "dark" ? {
                      rotate: [0, -360],
                      scale: [1, 1.2, 1],
                    } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Moon className={cn(
                      "h-5 w-5 mx-auto mb-1.5 relative z-10",
                      theme === "dark" && isMatrix && "text-[#00ff00]",
                      theme === "dark" && !isMatrix && "text-primary"
                    )} />
                  </motion.div>
                  <span className={cn(
                    "text-xs font-semibold relative z-10",
                    theme === "dark" && isMatrix && "text-[#00ff00]"
                  )}>Dark</span>
                  {celebrating && theme === "dark" && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: [0, 1.5, 0], opacity: [0, 1, 0] }}
                      className="absolute inset-0 bg-blue-400/30 rounded-xl"
                    />
                  )}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleThemeChange("matrix")}
                  className={cn(
                    "p-3 rounded-xl border-2 text-center transition-all cursor-pointer relative overflow-hidden group",
                    theme === "matrix"
                      ? "border-[#00ff00] bg-[#00ff00]/30 shadow-[0_0_25px_rgba(0,255,0,0.6)]"
                      : "border-border bg-muted/50 hover:border-[#00ff00]/50 hover:bg-[#00ff00]/5"
                  )}
                >
                  {theme === "matrix" && (
                    <motion.div
                      layoutId="activeTheme"
                      className="absolute inset-0 bg-[#00ff00]/20 rounded-xl"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <motion.div
                    animate={theme === "matrix" ? {
                      scale: [1, 1.3, 1],
                      filter: ["brightness(1)", "brightness(1.5)", "brightness(1)"],
                    } : {}}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <Terminal className={cn(
                      "h-5 w-5 mx-auto mb-1.5 relative z-10",
                      theme === "matrix" ? "text-[#00ff00]" : "",
                      "drop-shadow-[0_0_8px_rgba(0,255,0,0.6)]"
                    )} />
                  </motion.div>
                  <span className={cn(
                    "text-xs font-semibold relative z-10",
                    theme === "matrix" && "text-[#00ff00] [text-shadow:0_0_8px_rgba(0,255,0,0.6)]"
                  )}>Matrix</span>
                  {celebrating && theme === "matrix" && (
                    <>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: [0, 2, 0], opacity: [0, 0.8, 0] }}
                        className="absolute inset-0 bg-[#00ff00]/40 rounded-xl"
                      />
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-1 h-1 bg-[#00ff00] rounded-full"
                          initial={{
                            x: "50%",
                            y: "50%",
                            scale: 0,
                          }}
                          animate={{
                            x: `${50 + (Math.random() - 0.5) * 200}%`,
                            y: `${50 + (Math.random() - 0.5) * 200}%`,
                            scale: [0, 1, 0],
                            opacity: [1, 1, 0],
                          }}
                          transition={{
                            duration: 1,
                            delay: i * 0.1,
                          }}
                        />
                      ))}
                    </>
                  )}
                </motion.button>
              </div>
            </div>

            {/* Fun animated message */}
            <motion.div
              animate={celebrating ? {
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
              } : {}}
              className={cn(
                "flex items-center gap-2 text-xs pt-3 border-t",
                isMatrix
                  ? "border-[#00ff00]/30 text-[#00ff00]/90"
                  : "border-border text-muted-foreground"
              )}
            >
              <motion.div
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.2, 1],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {theme === "matrix" ? (
                  <Zap className={cn(
                    "h-4 w-4 text-[#00ff00]",
                    "drop-shadow-[0_0_8px_rgba(0,255,0,0.8)]"
                  )} />
                ) : (
                  <Sparkles className={cn(
                    "h-4 w-4",
                    isMatrix && "text-[#00ff00]"
                  )} />
                )}
              </motion.div>
              <motion.span
                animate={celebrating ? {
                  scale: [1, 1.2, 1],
                } : {}}
              >
                {theme === "matrix"
                  ? "Welcome to the Matrix! 🟢⚡"
                  : theme === "dark"
                  ? "Dark mode activated! 🌙"
                  : "Bright and beautiful! ☀️"}
              </motion.span>
              {celebrating && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 180 }}
                >
                  <PartyPopper className="h-4 w-4 text-primary" />
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Matrix theme glow effect */}
          {isMatrix && (
            <motion.div
              animate={{
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 rounded-2xl pointer-events-none"
            >
              <div className="absolute inset-0 rounded-2xl bg-[#00ff00]/10" />
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

