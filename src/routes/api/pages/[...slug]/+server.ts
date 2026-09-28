// src/routes/api/pages/[...slug]/+server.ts
import type { RequestHandler } from "./$types";
import { json, error } from "@sveltejs/kit";

import { pages } from "$lib/server/data/pages";
import { models } from "$lib/server/data/models";
import { mainNav } from "$lib/server/data/navigation";

import type {
  Page,
  ModelListSection,
  PageListSection,
  PageSection
} from "$lib/server/page";
import type {
  PageDto,
  PageSectionDto,
  ModelSummary,
  PageSummary
} from "$lib/api/page-api";
import type { Breadcrumb, BreadcrumbElement } from "$lib/api/navigation-api";

const fallbackImage = '/logo.png';

// --- Typen ------------------------------------------------------

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

// --- Indexe ----------------------------------------------------

const modelsById = new Map<string, any>(models.map((p) => [p.id, p]));
const pagesById = new Map<string, Page>(pages.map((p) => [p.id, p]));

// --- Navigation-Helpers ----------------------------------------

/**
 * Findet den Navigationspfad (als Page-Knoten) bis zur pageId.
 * Ergebnis: [Root, ..., Parent, Self] oder null wenn nicht gefunden.
 */
function findNavPathToPage(
  items: NavigationItem[],
  pageId: string,
  path: Extract<NavigationItem, { type: "page" }>[] = []
): Extract<NavigationItem, { type: "page" }>[] | null {
  for (const item of items) {
    if (item.type !== "page") continue;

    const nextPath = [...path, item];

    if (item.pageId === pageId) return nextPath;

    if (item.children?.length) {
      const found = findNavPathToPage(item.children, pageId, nextPath);
      if (found) return found;
    }
  }
  return null;
}

/**
 * Wandelt einen NavigationItem-Pfad in einen Page-Pfad um.
 * Ergebnis: [RootPage, ..., ParentPage, SelfPage]
 */
function navPathToPages(navPath: Extract<NavigationItem, { type: "page" }>[]): Page[] {
  return navPath
    .map((n) => pagesById.get(n.pageId))
    .filter((p): p is Page => Boolean(p));
}

/**
 * Baut den Slug-Pfad anhand des Nav-Pfads (ohne führenden Slash),
 * z.B. "katalog/frigolink".
 */
function getNavPathSlug(navPathPages: Page[]): string {
  return navPathPages.map((p) => p.slug).join("/");
}

/**
 * Map von Pfad (ohne führenden Slash) -> Page.
 * Grundlage ist ausschließlich die Navigation (mainNav).
 * Produkt-Knoten werden ignoriert.
 */
function buildPagesByPathFromNav(nav: NavigationItem[]): Map<string, Page> {
  const map = new Map<string, Page>();

  const walk = (items: NavigationItem[], parentSlugs: string[]) => {
    for (const item of items) {
      if (item.type !== "page") continue;

      const page = pagesById.get(item.pageId);
      if (!page) continue;

      const slugs = [...parentSlugs, page.slug];
      const path = slugs.join("/");
      map.set(path, page);

      if (item.children?.length) walk(item.children, slugs);
    }
  };

  walk(nav, []);
  return map;
}

const pagesByPath = buildPagesByPathFromNav(mainNav);

/**
 * Für schnelle Lookups: pageId -> voller Pfad (mit führendem Slash)
 * ausschließlich aus Navigation.
 * Produkt-Knoten werden ignoriert.
 */
function buildSlugPathByPageIdFromNav(nav: NavigationItem[]): Map<string, string> {
  const map = new Map<string, string>();

  const walk = (items: NavigationItem[], parentSlugs: string[]) => {
    for (const item of items) {
      if (item.type !== "page") continue;

      const page = pagesById.get(item.pageId);
      if (!page) continue;

      const slugs = [...parentSlugs, page.slug];
      const full = ("/" + slugs.join("/")).replace(/\/+/g, "/");
      map.set(page.id, full);

      if (item.children?.length) walk(item.children, slugs);
    }
  };

  walk(nav, []);
  return map;
}

const slugPathByPageId = buildSlugPathByPageIdFromNav(mainNav);

// --- DTO-Mapping ------------------------------------------------

function toModelSummary(model: any): ModelSummary {
  return {
    id: model.id,
    slug: model.slug,
    name: model.name,
    shortDescription: model.shortDescription,
    image: model.image
  };
}

function toPageSummary(page: Page): PageSummary {
  return {
    id: page.id,
    slug: slugPathByPageId.get(page.id) ?? "/" + page.slug,
    title: page.title,
    image: page.image,
    subtitle: page.subtitle
  };
}

function hydrateSection(section: PageSection): PageSectionDto {
  switch (section.type) {
    case "modelList": {
      const s = section as ModelListSection;
      const hydratedModels = s.modelIds
        .map((id) => modelsById.get(id))
        .filter((p): p is any => Boolean(p))
        .map(toModelSummary);

      return { ...s, models: hydratedModels };
    }

    case "pageList": {
      const s = section as PageListSection;
      const hydratedPages = s.pageIds
        .map((id) => pagesById.get(id))
        .filter((p): p is Page => Boolean(p))
        .map(toPageSummary);

      return { ...s, pages: hydratedPages };
    }

    default:
      return section as PageSectionDto;
  }
}

/**
 * Breadcrumb ausschließlich auf Basis der Navigation.
 */
function buildBreadcrumbFromNavPath(navPathPages: Page[]): Breadcrumb {
  return navPathPages.map((p, index) => {
    const isLast = index === navPathPages.length - 1;

    const element: BreadcrumbElement = {
      label: p.title
    };

    if (!isLast) {
      const href = "/" + getNavPathSlug(navPathPages.slice(0, index + 1));
      element.href = href.replace(/\/+/g, "/");
    }

    return element;
  });
}

// --- GET-Handler ------------------------------------------------

export const GET: RequestHandler = ({ params }) => {
  const slugParam = params.slug;

  // 🔹 STARTSEITE: /
  if (!slugParam || (Array.isArray(slugParam) && slugParam.length === 0)) {
    const page = pagesById.get("13"); // Startseite
    if (!page) throw error(500, "Start page not found");

    const dto: PageDto = {
      ...page,
      slug: "/", // canonical root
      image: page.image || fallbackImage,
      sections: page.sections.map(hydrateSection),
      breadcrumb: []
    };

    return json(dto);
  }

  const path = Array.isArray(slugParam) ? slugParam.join("/") : slugParam;

  if (!path) {
    throw error(400, "Missing Page slug");
  }

  // Page lookup ausschließlich über Navigation-Pfade:
  const page = pagesByPath.get(path);

  if (!page) {
    throw error(404, "Page not found");
  }

  // Nav-Pfad für Breadcrumb + canonical slug (nur Page-Knoten)
  const navPath = findNavPathToPage(mainNav, page.id);
  if (!navPath) {
    throw error(500, `Page '${page.id}' not present in navigation`);
  }

  const navPathPages = navPathToPages(navPath);
  const breadcrumb = buildBreadcrumbFromNavPath(navPathPages);

  const canonicalSlug = ("/" + getNavPathSlug(navPathPages)).replace(/\/+/g, "/");

  const dto: PageDto = {
    ...page,
    image: page.image || fallbackImage,
    slug: canonicalSlug,
    sections: page.sections.map(hydrateSection),
    breadcrumb
  };

  return json(dto);
};
