// src/routes/+layout.ts
import type { LayoutLoad } from "./$types";

export type NavigationEntry = {
  label: string;
  href: string;
  icon?: string;
  children?: NavigationEntry[];
};

export const load: LayoutLoad = async ({ url, fetch }) => {
  const res = await fetch("/api/navigation");
  if (!res.ok) {
    // Fallback: keine Navigation (statt Hard-Crash)
    return { currentPath: url.pathname, navigation: [] as NavigationEntry[] };
  }

  const navigation = (await res.json()) as NavigationEntry[];
  return {
    currentPath: url.pathname,
    navigation
  };
};
