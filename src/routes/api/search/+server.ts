import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

import { models } from "$lib/server/data/models";
import { pages } from "$lib/server/data/pages";
import { mainNav } from "$lib/server/data/navigation";
import type { Page } from "$lib/server/page";

type NavigationItem =
  | { type: "page"; pageId: string; children?: NavigationItem[] }
  | { type: "model"; modelId: string };

const fallbackImage = '/logo.png';

export type SearchHit =
  | {
      type: "model";
      id: string;
      label: string;
      href: string;
      image: string;
      score: number;
    }
  | {
      type: "page";
      id: string;
      label: string;
      href: string;
      image: string;
      score: number;
    };

export type SearchResponse = {
  query: string;
  models: SearchHit[];
  pages: SearchHit[];
  didYouMean?: string[]; // UI: Strings sind ok (kannst du klickbar machen über /search?q=...)
};

const pagesById = new Map<string, Page>(pages.map((p) => [p.id, p]));

function normalize(s: string) {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9\- ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function looksLikeArticleNumber(q: string) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/i.test(q.trim());
}

// --- Navigation: pageId -> canonical href
function buildPageHrefByIdFromNav(nav: NavigationItem[]): Map<string, string> {
  const map = new Map<string, string>();

  const walk = (items: NavigationItem[], parentSlugs: string[]) => {
    for (const item of items) {
      if (item.type !== "page") continue;

      const page = pagesById.get(item.pageId);
      if (!page) continue;

      const slugs = [...parentSlugs, page.slug];
      const href = "/" + slugs.join("/");
      map.set(page.id, href.replace(/\/+/g, "/"));

      if (item.children?.length) walk(item.children, slugs);
    }
  };

  walk(nav, []);
  return map;
}

const pageHrefById = buildPageHrefByIdFromNav(mainNav);

function modelHref(modelId: string) {
  return `/produkte/${encodeURIComponent(modelId)}`;
}

// --- scoring
function scoreTextMatch(q: string, haystack: string) {
  if (!q) return 0;
  if (haystack === q) return 100;
  if (haystack.startsWith(q)) return 80;
  if (haystack.includes(q)) return 60;

  const qTokens = q.split(" ").filter(Boolean);
  const hTokens = new Set(haystack.split(" ").filter(Boolean));
  const hitCount = qTokens.filter((t) => hTokens.has(t)).length;
  return hitCount ? 30 + hitCount * 5 : 0;
}

function levenshtein(a: string, b: string) {
  const m = a.length,
    n = b.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }
  return dp[m][n];
}

type SuggestCandidate = {
  display: string;   // was du UI-seitig anzeigen willst
  norm: string;      // normalize(display or key)
  kind: "modelId" | "modelName" | "pageTitle";
};

// sauber: Distanz auf norm, zurückgeben display (nicht norm)
function bestSuggestions(queryNorm: string, candidates: SuggestCandidate[], limit = 3) {
  if (queryNorm.length < 3) return [];

  const maxDist = Math.max(2, Math.floor(queryNorm.length * 0.35));

  // duplikate (z.B. gleiche Modelnamen) raus
  const seen = new Set<string>();
  const ranked = candidates
    .map((c) => ({ c, d: levenshtein(queryNorm, c.norm) }))
    .filter((x) => x.c.norm && x.d <= maxDist)
    .sort((a, b) => a.d - b.d)
    .filter((x) => {
      const key = x.c.display;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, limit);

  return ranked.map((r) => r.c.display);
}

export const GET: RequestHandler = ({ url }) => {
  const qRaw = url.searchParams.get("q") ?? "";
  const q = qRaw.trim();
  const qNorm = normalize(q);
  const isArticle = looksLikeArticleNumber(q);

  const modelHits: SearchHit[] = [];
  const pageHits: SearchHit[] = [];

  if (qNorm) {
    // --- models
    for (const p of models) {
      const idNorm = normalize(p.id);
      const nameNorm = normalize(p.name ?? "");

      const score = Math.max(scoreTextMatch(qNorm, idNorm), scoreTextMatch(qNorm, nameNorm));
      if (score > 0) {
        modelHits.push({
          type: "model",
          id: p.id,
          label: `${p.id} — ${p.name}`,
          href: modelHref(p.id),
          image: p.image || fallbackImage,
          score
        });
      }
    }

    // --- pages (nur Seiten mit canonical href aus Nav)
    for (const page of pages) {
      const href = pageHrefById.get(page.id);
      if (!href) continue;

      const titleNorm = normalize(page.title ?? "");
      const subtitleNorm = normalize((page as any).subtitle ?? "");

      const score = Math.max(scoreTextMatch(qNorm, titleNorm), scoreTextMatch(qNorm, subtitleNorm));
      if (score > 0) {
        pageHits.push({
          type: "page",
          id: page.id,
          label: page.title,
          href,
          // ✅ Bildlogik: image bevorzugen, sonst icon, sonst fallback
          image: (page as any).image ?? (page as any).icon ?? fallbackImage,
          score
        });
      }
    }
  }

  modelHits.sort((a, b) => b.score - a.score);
  pageHits.sort((a, b) => b.score - a.score);

  const modelsTop = modelHits.slice(0, 8);
  const pagesTop = pageHits.slice(0, 8);

  // --- didYouMean (sauber + artikelnummer-freundlich)
  let didYouMean: string[] | undefined;

  if (qNorm && modelsTop.length === 0 && pagesTop.length === 0) {
    const candidates: SuggestCandidate[] = [];

    // Produkt-IDs und Produktnamen
    for (const p of models) {
      candidates.push({ kind: "modelId", display: p.id, norm: normalize(p.id) });
      if (p.name) candidates.push({ kind: "modelName", display: p.name, norm: normalize(p.name) });
    }

    // Seitentitel (nur wenn in Nav)
    for (const pg of pages) {
      if (!pageHrefById.has(pg.id)) continue;
      if (pg.title) candidates.push({ kind: "pageTitle", display: pg.title, norm: normalize(pg.title) });
    }

    // Wenn artikelnummer-like, priorisiere IDs, sonst gemischt
    const ordered = isArticle
      ? [
          ...candidates.filter((c) => c.kind === "modelId"),
          ...candidates.filter((c) => c.kind !== "modelId")
        ]
      : candidates;

    const suggestions = bestSuggestions(qNorm, ordered, 3);

    // optional: wenn artikelnummer-like, und die beste suggestion exakt eine Produkt-ID ist,
    // ist das meist viel hilfreicher als ein Produktname
    didYouMean = suggestions.length ? suggestions : undefined;
  }

  const res: SearchResponse = {
    query: q,
    models: modelsTop,
    pages: pagesTop,
    didYouMean
  };

  return json(res, {
    headers: { "cache-control": "public, max-age=30" }
  });
};
