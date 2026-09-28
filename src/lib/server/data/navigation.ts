import type { NavigationItem } from "$lib/server/navigation";

export const mainNav: NavigationItem[] = [
  {
    type: "page",
    pageId: "1", // blog
  },
  { type: "page", pageId: "2" }, // projects
  { type: "page", pageId: "3" }, // workbench
  { type: "page", pageId: "4" }, // about
];
