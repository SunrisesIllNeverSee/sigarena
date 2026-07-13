import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1) + "B";
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toFixed(0);
}

export function formatYield(n: number): string {
  if (n >= 1000) return n.toLocaleString(undefined, { maximumFractionDigits: 0 });
  return n.toFixed(1);
}

export function formatMovement(n: number): { text: string; direction: "up" | "down" | "none" } {
  if (n === 0 || n === null || n === undefined) return { text: "No change", direction: "none" };
  if (n > 0) return { text: `${n}`, direction: "up" };
  return { text: `${Math.abs(n)}`, direction: "down" };
}

export function operatorDisplayName(name: string | null | undefined, codename: string): string {
  if (name && name.trim()) return name;
  return codename;
}

/**
 * Slugify a display name for use in URLs.
 * "Ólafur Nils Sigurðsson" → "olafur-nils-sigurdsson"
 * Falls back to codename if no display name.
 */
export function operatorSlug(name: string | null | undefined, codename: string): string {
  if (!name || !name.trim()) return codename;
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // strip diacritics
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

export function classTierColor(tier: string): string {
  const colors: Record<string, string> = {
    APEX: "text-amber-600 bg-amber-50 border-amber-200",
    S_CLASS: "text-purple-600 bg-purple-50 border-purple-200",
    A_CLASS: "text-blue-600 bg-blue-50 border-blue-200",
    B_CLASS: "text-green-600 bg-green-50 border-green-200",
    BASE: "text-gray-600 bg-gray-50 border-gray-200",
  };
  return colors[tier] ?? "text-gray-600 bg-gray-50 border-gray-200";
}

export function platformColor(platform: string): string {
  const colors: Record<string, string> = {
    claude: "text-orange-600 bg-orange-50 border-orange-200",
    codex: "text-green-600 bg-green-50 border-green-200",
    chatgpt: "text-teal-600 bg-teal-50 border-teal-200",
    cursor: "text-blue-600 bg-blue-50 border-blue-200",
    windsurf: "text-cyan-600 bg-cyan-50 border-cyan-200",
  };
  return colors[platform?.toLowerCase()] ?? "text-gray-600 bg-gray-50 border-gray-200";
}
