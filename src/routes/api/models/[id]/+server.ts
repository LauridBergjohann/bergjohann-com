// src/routes/api/models/[id]/+server.ts
import type { RequestHandler } from "./$types";
import { json, error } from "@sveltejs/kit";

import { models } from "$lib/server/data/models";
import { pages } from "$lib/server/data/pages";
import { mainNav } from "$lib/server/data/navigation";

import type { Model } from "$lib/server/model";
import type { Page } from "$lib/server/page";
import type { Breadcrumb, BreadcrumbElement } from "$lib/api/navigation-api";
import type { ModelDto } from "$lib/api/model-api";

// ----------------- Navigation Types -----------------

type NavigationItem =
  | {
      type: "page";
      pageId: string;
      children?: NavigationItem[];
    }
  | {
      type: "model";
      modelId: string;
    };

// ----------------- Indexe -----------------

const pagesById = new Map<string, Page>(pages.map((p) => [p.id, p]));

// ----------------- Navigation Helpers -----------------

/**
 * Findet den Navigationspfad zu einem Produkt-Knoten.
 * Ergebnis: [Root, ..., CategoryPage] als Page-Knoten (Produkt selbst ist NICHT im Pfad),
 * oder null wenn Produkt nicht im Tree ist.
 */
function findNavPathToModel(
  items: NavigationItem[],
  modelId: string,
  path: Extract<NavigationItem, { type: "page" }>[] = []
): Extract<NavigationItem, { type: "page" }>[] | null {
  for (const item of items) {
    if (item.type === "model") {
      if (item.modelId === modelId) return path;
      continue;
    }

    // item ist page
    const nextPath = [...path, item];

    if (item.children?.length) {
      const found = findNavPathToModel(item.children, modelId, nextPath);
      if (found) return found;
    }
  }
  return null;
}

function navPathToPages(navPath: Extract<NavigationItem, { type: "page" }>[]): Page[] {
  return navPath
    .map((n) => pagesById.get(n.pageId))
    .filter((p): p is Page => Boolean(p));
}

function getNavPathSlug(navPathPages: Page[]): string {
  return navPathPages.map((p) => p.slug).join("/");
}

/**
 * Breadcrumb für ein Produkt ausschließlich auf Basis von mainNav.
 *
 * Schema:
 *  [
 *    { label: 'Produkte', href: '/produkte' },
 *    { label: 'Frigolink', href: '/produkte/frigolink' },
 *    { label: '...' , href: '/produkte/frigolink/<kategorie>' },
 *    { label: 'Mein Produkt' } // Produkt selbst, ohne href
 *  ]
 */
function buildModelBreadcrumbFromNav(model: Model): Breadcrumb {
  const navPath = findNavPathToModel(mainNav, model.id);

  // Wenn Produkt nicht im Navigationsbaum ist: Fallback nur Produkt
  if (!navPath) return [{ label: model.name }];

  const navPathPages = navPathToPages(navPath);

  const breadcrumb: Breadcrumb = navPathPages.map((p, index): BreadcrumbElement => ({
    label: p.title,
    href: ("/" + getNavPathSlug(navPathPages.slice(0, index + 1))).replace(/\/+/g, "/")
  }));

  breadcrumb.push({ label: model.name });
  return breadcrumb;
}

// ----------------- GET-Handler -----------------

export const GET: RequestHandler = ({ params, url }) => {
  const { id } = params;

  const existsOnly = url.searchParams.has("exists");

  const model = models.find((p) => p.id === id) as Model | undefined;

  if (!model) {
    if (existsOnly) return json({ exists: false }, { status: 404 });
    throw error(404, "Model not found");
  }

  if (existsOnly) {
    return json({ exists: true });
  }

  // Breadcrumb ausschließlich über mainNav (kanonischer Pfad)
  const breadcrumb = buildModelBreadcrumbFromNav(model);

  const dto: ModelDto = {
    ...model,
    breadcrumb
  };

  return json(dto);
};
