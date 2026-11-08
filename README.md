# sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```sh
# create a new project
npx sv create my-app
```

To recreate this project with the same configuration:

```sh
# recreate this project
npx sv@0.17.1 create --template minimal --types ts --add prettier eslint vitest="usages:unit,component" playwright tailwindcss="plugins:none" storybook --install npm bergjohann-com
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```sh
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```sh
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.

## Languages and content

### Page Sections integration

Content pages use the published `@page-sections/core` and `@page-sections/svelte`
packages, pinned to 0.2.0. No sibling checkout or workspace alias is needed.

- The localized content API serves public `PageData` and `SectionData` models with
  site routing and SEO metadata. There is no `SectionTypeMap` augmentation or custom
  renderer. Bilingual page documents live in `src/lib/server/data/pages/*.page.json`.
- `ContentPage.svelte` composes the package's `ContentPage` and `Sections`.
  Artwork heroes, editorial card grids (topics/projects), nested grids with text
  and panels (about), and structured rich text/panels (privacy/imprint) all use
  built-in renderers. Legal bodies use `bodyLayout: 'narrow'`; addresses and email
  links remain semantic HTML. SvelteKit owns document titles and SEO.
- Editorial cards retain complete descriptions and equal heights. Demo images use
  a separate 3:2 media area with `mediaFit: 'contain'`, independent of text height.
- `Header.svelte` supplies items, logo, search and preference controls to
  `Navigation`. The package owns the mobile menu below 1200px, settings below
  1600px, and delayed scrolling (112px). Its canonical header is 1536px at 2XL.
  Native disclosures and the site's search popover work without JavaScript.
- `PageSectionsTheme.svelte` connects package components to the website theme
  store after mounting. Before hydration and without JavaScript, media follow
  the system preference. `src/lib/content/page-sections.css` contains brand
  presentation only; responsive widths, spacing, hero composition, card sizing
  and heading hierarchy come from the package.
- Search, locale routing, preferences, footer and error pages remain application
  responsibilities. Their container uses the package's shared width rules.

`tests/page-sections.e2e.ts` checks all localized pages, single h1/main landmarks,
metadata, legal semantics, mobile overflow and theme-aware package media with and
without JavaScript. Run the production browser suite with `npx playwright test`;
set `BERGJOHANN_TEST_PORT` to use a dedicated preview port.

`npm run build:preview` creates production client/server output for local preview
and browser tests without deployment packaging. `npm run build` remains the
Vercel deployment build. This distinction lets the browser suite run on Windows
without requiring permission to create the Vercel adapter's symlinks.

Every public page has an English and German URL. Examples: /en, /de,
/en/projects, /de/projekte, /en/privacy and /de/datenschutz.

- Shared page structures, media and translated text leaves live in
  `src/lib/server/data/pages/*.page.json`. Add both slugs and both text translations there;
  the page API emits only the requested language plus the alternate slugs.
- UI text, branding and footer destinations come from src/lib/server/data/ui.ts.
- GET /api/pages/privacy?lang=en and GET /api/pages/datenschutz?lang=de return
  the same page in different languages. GET /api/pages?lang=de returns the homepage.
  GET /api/site?lang=de provides UI/navigation; GET /api/search?lang=de&q=Modellbau
  provides localized search results. Unsupported language parameters return 400.
- A URL with an explicit language takes precedence. URLs without a language
  redirect using Accept-Language. The temporary __language=auto query flag lets
  the early browser script apply the first navigator.languages entry or the explicit
  bergjohann-language localStorage preference, then remove the flag. Without
  JavaScript, the server-selected page is fully usable; its canonical URL omits
  the flag. No language cookie is required.
- Language controls are ordinary links with a full document reload. They preserve
  the page identity, query string and (with JavaScript) fragment. Mobile settings,
  navigation use native disclosures; search uses a native popover. All work without JavaScript.
- Canonical URLs, reciprocal hreflang links and document language are server-rendered.

### Editing JSON page content

Each `*.page.json` file is a complete document for one page, including its stable
`id`, localized `slugs`, SEO title/description, hero and sections. Translated text
uses `{ "en": "English text", "de": "Deutscher Text" }`; shared text stays a string.
Structural values such as `type`, `layout` and `cardVariant` are not translated.
Internal content links use the English source slug (for example `/projects`);
the content service resolves them to the requested language.

To add a page, create `<id>.page.json` and add its ID to `pages/index.json`. This
manifest controls the order of the page collection; it does not control the main
menu, which remains in `src/lib/server/data/navigation.ts`. UI messages and the
demo model catalogue also remain separate from page content.

Run `npm run check:content` after editing. It checks the manifest, unique IDs/slugs,
required translations and all section properties against `PageDocument` and the
installed Page Sections types. It uses in-memory TypeScript files; diagnostics
identify the corresponding `<id>.page.json.ts` document. No generated TypeScript
content files or extra validation dependencies are needed. The check also runs
as part of `npm run check`, `npm run build` and `npm run build:preview`.

`page-store.ts` is the server-only JSON storage boundary. Vite bundles the files
into the deployment, so production requires no writable filesystem. JSON changes
take effect during local development and require a rebuild/deployment in production.
`content.ts` handles localization and returns independent response objects; routing,
search and rendering continue to use its existing API.

The documents contain plain JSON with no functions, imports or template references,
so they can later become MongoDB documents. That later migration will add database
access, runtime validation and asynchronous reads at the storage/service boundary;
MongoDB is not connected by this change.

Validation (Node.js 24 or newer):

```sh
npm run check
npx vitest run --project server --project client
npm run test:i18n
npm run build
```

The i18n browser suite starts or reuses the development server on port 5173.
On Windows, Vercel packaging may fail with EPERM when the OS does not allow
symlinks; this occurs after successful client/server compilation.

Theme choices follow the operating system until the user selects Light or Dark.
An explicit choice is stored only in sessionStorage (bergjohann-theme) and
synchronized across open same-origin tabs via BroadcastChannel. New tabs request
the latest choice from existing tabs; without an open tab or saved session choice,
the system appearance is used. The former persistent theme setting is discarded.
Language preferences continue to use localStorage.

The favicon source is static/branding/favicon.svg. Regenerate its PNG exports and
multi-resolution ICO fallback with npm run generate:icons (requires Playwright
Chromium; install it with npx playwright install chromium if needed). The exports
include Apple Touch 180px, PWA icons at 192px/512px, and opaque maskable variants
with a protected logo area. static/site.webmanifest links the app icons and starts
at / so the existing language detection remains available.
