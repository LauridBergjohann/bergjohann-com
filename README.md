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
packages, pinned to 0.1.1. No sibling checkout or workspace alias is needed.

- The localized content API uses the published section models directly. Standard
  sections need no adapter. Website-specific topics, project previews, about panels
  and structured legal text extend `SectionTypeMap` in `src/lib/api/content.ts`.
- `ContentPage.svelte` uses the package's `ContentPage`, `HeroSection` and `Sections`.
  Text, cards, images and video use the built-in renderers. `SiteSection.svelte`
  supplies website-specific content inside the package's `Section`.
- `Header.svelte` composes the package's `Navigation` and `MainMenu` with the website
  logo, search, language and theme controls. Below 1600px the package exposes the
  satellite controls through its native settings disclosure. The mobile menu also
  uses `MainMenu`, inside a native popover. Navigation works without JavaScript.
- The old `components/sections` directory, duplicate menu renderers, obsolete DTOs
  and section adapter have been removed. The package hero owns the single h1;
  SvelteKit routes continue to own document titles and SEO.
- `PageSectionsTheme.svelte` wraps the app layout and connects all package components
  to the website theme store after mounting. Before hydration and without JavaScript,
  media follow the system preference. `src/lib/content/page-sections.css` supplies
  website typography, spacing, palette and artwork composition.

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
  src/lib/server/content.ts. Add both slugs and both text translations there;
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
  navigation and search use native popovers and work without JavaScript.
- Canonical URLs, reciprocal hreflang links and document language are server-rendered.

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
