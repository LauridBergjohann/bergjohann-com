// src/routes/api/navigation/+server.ts
import { json, error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

import { pages } from "$lib/server/data/pages";
import { mainNav } from "$lib/server/data/navigation";
import type { NavigationItem } from "$lib/server/navigation";
import type { NavigationEntry } from "$lib/api/navigation-api";

// --- Indexe ----------------------------------------------------

const pagesById = new Map(pages.map((p) => [p.id, p]));

// --- Helpers ---------------------------------------------------

/**
 * Findet einen Page-Knoten anhand seines vollständigen Slug-Pfades
 * z.B. "/produkte/frigolink"
 */
function findNavNodeBySlug(
  items: NavigationItem[],
  targetPath: string,
  parentSlugs: string[] = []
): NavigationItem | null {
  for (const item of items) {
    if (item.type !== "page") continue;

    const page = pagesById.get(item.pageId);
    if (!page) continue;

    const slugs = [...parentSlugs, page.slug];
    const currentPath = "/" + slugs.join("/");

    if (currentPath === targetPath) return item;

    if (item.children?.length) {
      const found = findNavNodeBySlug(item.children, targetPath, slugs);
      if (found) return found;
    }
  }
  return null;
}

/**
 * Baut NavigationEntries ab einem bestimmten Knoten
 * - berücksichtigt maxDepth
 * - ignoriert product-Knoten
 */
function buildNavigationEntries(
  items: NavigationItem[],
  parentPath: string,
  maxDepth: number
): NavigationEntry[] {
  if (maxDepth < 1) return [];

  return items
    .filter((i): i is Extract<NavigationItem, { type: "page" }> => i.type === "page")
    .map((item) => {
      const page = pagesById.get(item.pageId);
      if (!page) return null;

      const href = `${parentPath}/${page.slug}`.replace(/\/+/g, "/");

      const entry: NavigationEntry = {
        label: page.title,
        href,
        icon: page.icon
      };

      if (item.children?.length && maxDepth > 1) {
        const children = buildNavigationEntries(
          item.children,
          href,
          maxDepth - 1
        );
        if (children.length) entry.children = children;
      }

      return entry;
    })
    .filter((e): e is NavigationEntry => Boolean(e));
}

// --- GET-Handler -----------------------------------------------

export const GET: RequestHandler = ({ url }) => {
  const root = url.searchParams.get("root"); // optional, z.B. "/produkte"
  const maxDepthRaw = url.searchParams.get("maxDepth") ?? "2";
  const maxDepth = Math.max(1, Number(maxDepthRaw) || 2);

  // MODE A: Main Navigation (kein root => ab mainNav)
  if (!root) {
    const navigation = buildNavigationEntries(mainNav, "", maxDepth);

    return json(navigation, {
      headers: {
        "cache-control": "public, max-age=300"
      }
    });
  }

  // MODE B: Subtree Navigation (root gesetzt)
  if (!root.startsWith("/")) {
    throw error(400, "Invalid root parameter (must start with '/')");
  }

  const rootNode = findNavNodeBySlug(mainNav, root);

  if (!rootNode || rootNode.type !== "page") {
    throw error(404, `Navigation root '${root}' not found`);
  }

  const navigation = buildNavigationEntries(
    rootNode.children ?? [],
    root,
    maxDepth
  );

  return json(navigation, {
    headers: {
      "cache-control": "public, max-age=300"
    }
  });
};
