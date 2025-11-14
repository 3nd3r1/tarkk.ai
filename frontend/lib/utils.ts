import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatScore(score: number): string {
  return score.toFixed(0);
}

export function getScoreColor(score: number): string {
  if (score >= 71) return "text-green-500";
  if (score >= 41) return "text-yellow-500";
  return "text-red-500";
}

export function getScoreBgColor(score: number): string {
  if (score >= 71) return "bg-green-500";
  if (score >= 41) return "bg-yellow-500";
  return "bg-red-500";
}

export function getScoreGradient(score: number): string {
  if (score >= 71) return "from-green-500 to-emerald-600";
  if (score >= 41) return "from-yellow-500 to-orange-500";
  return "from-red-500 to-rose-600";
}

export function truncate(str: string, length: number): string {
  return str.length > length ? `${str.substring(0, length)}...` : str;
}
