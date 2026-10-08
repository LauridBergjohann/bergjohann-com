import { expect, test, type Page } from '@playwright/test';

test.use({ viewport: { width: 1800, height: 1000 } });

const pagePairs = [
	{ en: '', de: '' },
	{ en: 'blog', de: 'blog' },
	{ en: 'projects', de: 'projekte' },
	{ en: 'workbench', de: 'werkbank' },
	{ en: 'about', de: 'ueber-mich' },
	{ en: 'privacy', de: 'datenschutz' },
	{ en: 'imprint', de: 'impressum' }
] as const;

const pathFor = (locale: 'en' | 'de', slug: string) => `/${locale}${slug ? `/${slug}` : ''}`;
const languageLink = (page: Page, locale: 'en' | 'de') =>
	page.locator(`a[hreflang="${locale}"]:visible`);

function untranslatedObjects(value: unknown, path = ''): string[] {
	if (!value || typeof value !== 'object') return [];
	if (Array.isArray(value))
		return value.flatMap((item, index) => untranslatedObjects(item, `${path}[${index}]`));
	const object = value as Record<string, unknown>;
	const found = 'en' in object && 'de' in object && path !== 'slugs' ? [path] : [];
	return [
		...found,
		...Object.entries(object).flatMap(([key, item]) =>
			untranslatedObjects(item, path ? `${path}.${key}` : key)
		)
	];
}

function structureOf(value: unknown): unknown {
	if (Array.isArray(value)) return value.map(structureOf);
	if (value && typeof value === 'object') {
		return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, structureOf(item)]));
	}
	return typeof value;
}

for (const slugs of pagePairs) {
	test(`both translations of ${slugs.en || 'home'} have reciprocal metadata and localized API content`, async ({
		browser,
		baseURL,
		request
	}) => {
		const context = await browser.newContext({
			baseURL,
			viewport: { width: 1800, height: 1000 },
			javaScriptEnabled: false
		});
		const page = await context.newPage();
		const responses = [];
		try {
			for (const locale of ['en', 'de'] as const) {
				const path = pathFor(locale, slugs[locale]);
				const response = await page.goto(path);
				expect(response?.status()).toBe(200);
				await expect(page.locator('html')).toHaveAttribute('lang', locale);
				await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
				const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
				expect(new URL(canonical!).pathname).toBe(path);
				expect(new URL(canonical!).search).toBe('');
				for (const alternate of ['en', 'de'] as const) {
					const href = await page
						.locator(`link[rel="alternate"][hreflang="${alternate}"]`)
						.getAttribute('href');
					expect(new URL(href!).pathname).toBe(pathFor(alternate, slugs[alternate]));
				}
				const api = await request.get(
					`/api/pages${slugs[locale] ? `/${slugs[locale]}` : ''}?lang=${locale}`
				);
				expect(api.ok()).toBe(true);
				const data = await api.json();
				expect(data.locale).toBe(locale);
				expect(data.slugs).toEqual(slugs);
				expect(typeof data.title).toBe('string');
				expect(typeof data.description).toBe('string');
				expect(untranslatedObjects(data)).toEqual([]);
				responses.push(data);
			}
			expect(structureOf(responses[0].sections)).toEqual(structureOf(responses[1].sections));
			if (slugs.en !== 'blog') expect(responses[0].title).not.toBe(responses[1].title);
		} finally {
			await context.close();
		}
	});
}

test('German content includes translated legal information and German site navigation', async ({
	page
}) => {
	await page.goto('/de/datenschutz');
	await expect(page.getByRole('heading', { level: 1 })).toHaveText(/Datenschutz/);
	await expect(page.locator('main')).toContainText('personenbezogene');
	await expect(page.getByRole('banner')).toContainText('Projekte');
	await expect(page.locator('footer')).toContainText('Impressum');
	await page.goto('/de/impressum');
	await expect(page.getByRole('heading', { level: 1 })).toHaveText('Impressum');
	await expect(page.locator('main')).toContainText('Laurid Bergjohann');
});

test('server language detection and mobile language links work without JavaScript', async ({
	browser,
	baseURL
}) => {
	const context = await browser.newContext({
		baseURL,
		javaScriptEnabled: false,
		viewport: { width: 390, height: 844 },
		locale: 'de-AT'
	});
	const page = await context.newPage();
	try {
		await page.goto('/privacy');
		expect(new URL(page.url()).pathname).toBe('/de/datenschutz');
		await expect(page.locator('html')).toHaveAttribute('lang', 'de');
		await page.locator('button[popovertarget="appearance-settings"]').click();
		const popup = page.getByRole('dialog');
		await expect(popup).toBeVisible();
		await expect(popup.getByRole('group').first().locator('a[hreflang="en"]')).toBeVisible();
		await languageLink(page, 'en').click();
		expect(new URL(page.url()).pathname).toBe('/en/privacy');
		await expect(page.getByRole('heading', { level: 1 })).toHaveText('Privacy Policy');
	} finally {
		await context.close();
	}
});

test('a non-German system preference selects English without JavaScript', async ({
	browser,
	baseURL
}) => {
	const context = await browser.newContext({
		baseURL,
		viewport: { width: 1800, height: 1000 },
		javaScriptEnabled: false,
		locale: 'fr-FR'
	});
	const page = await context.newPage();
	try {
		await page.goto('/');
		expect(new URL(page.url()).pathname).toBe('/en');
		await expect(page.locator('html')).toHaveAttribute('lang', 'en');
	} finally {
		await context.close();
	}
});

test('navigator.languages takes precedence during automatic detection and only its first entry matters', async ({
	browser,
	baseURL
}) => {
	const context = await browser.newContext({
		baseURL,
		viewport: { width: 1800, height: 1000 },
		locale: 'de-DE'
	});
	await context.addInitScript(() => {
		Object.defineProperty(navigator, 'languages', { get: () => ['fr-FR', 'de-DE'] });
	});
	const page = await context.newPage();
	try {
		await page.goto('/privacy');
		await expect(page).toHaveURL(/\/en\/privacy$/);
		await expect(page.locator('html')).toHaveAttribute('lang', 'en');
	} finally {
		await context.close();
	}
});

test('desktop selection reloads the same page, persists on return, and preserves explicit localized links', async ({
	page
}) => {
	await page.goto('/en/privacy');
	await expect(page.locator('[data-header-appearance] button').first()).toBeEnabled();
	await expect(languageLink(page, 'de')).toHaveCount(1);
	await page.evaluate(() => {
		document.documentElement.dataset.languageDocument = 'before-switch';
	});
	const [navigation] = await Promise.all([
		page.waitForRequest(
			(request) =>
				request.isNavigationRequest() && new URL(request.url()).pathname === '/de/datenschutz'
		),
		languageLink(page, 'de').click()
	]);
	expect(navigation.resourceType()).toBe('document');
	await expect(page).toHaveURL(/\/de\/datenschutz$/);
	await expect(page.locator('html')).not.toHaveAttribute('data-language-document');
	expect(await page.evaluate(() => localStorage.getItem('bergjohann-language'))).toBe('de');
	await page.goto('/');
	await expect(page).toHaveURL(/\/de$/);
	await page.goto('/en/projects');
	await expect(page).toHaveURL(/\/en\/projects$/);
	await expect(page.locator('html')).toHaveAttribute('lang', 'en');
	await languageLink(page, 'de').click();
	await expect(page).toHaveURL(/\/de\/projekte$/);
});

test('language detection and selection survive unavailable browser storage', async ({
	browser,
	baseURL
}) => {
	const context = await browser.newContext({
		baseURL,
		viewport: { width: 1800, height: 1000 }
	});
	await context.addInitScript(() => {
		Object.defineProperty(navigator, 'languages', { get: () => ['de-CH', 'en'] });
		Object.defineProperty(window, 'localStorage', {
			get: () => {
				throw new DOMException('Storage unavailable', 'SecurityError');
			}
		});
	});
	const page = await context.newPage();
	try {
		await page.goto('/about');
		await expect(page).toHaveURL(/\/de\/ueber-mich$/);
		await languageLink(page, 'en').click();
		await expect(page).toHaveURL(/\/en\/about$/);
	} finally {
		await context.close();
	}
});

test('search and site APIs use the selected language and localized destinations', async ({
	request
}) => {
	for (const locale of ['en', 'de'] as const) {
		const site = await request.get(`/api/site?lang=${locale}`);
		expect(site.ok()).toBe(true);
		const data = await site.json();
		expect(data.locale).toBe(locale);
		expect(data.navigation.length).toBeGreaterThan(0);
		expect(
			data.navigation.every((item: { href: string }) => item.href.startsWith(`/${locale}`))
		).toBe(true);
		expect(untranslatedObjects(data)).toEqual([]);
		const search = await request.get(
			`/api/search?lang=${locale}&q=${locale === 'de' ? 'Projekte' : 'Projects'}`
		);
		expect(search.ok()).toBe(true);
		const hits = await search.json();
		expect(hits.pages).toContainEqual(
			expect.objectContaining({
				label: locale === 'de' ? 'Projekte' : 'Projects',
				href: locale === 'de' ? '/de/projekte' : '/en/projects'
			})
		);
	}
});

test('mobile navigation and search remain usable without JavaScript', async ({
	browser,
	baseURL
}) => {
	const context = await browser.newContext({
		baseURL,
		javaScriptEnabled: false,
		viewport: { width: 390, height: 844 }
	});
	const page = await context.newPage();
	try {
		await page.goto('/de');
		await page.locator('button[popovertarget="mobile-menu-panel"]').click();
		await page
			.locator('#mobile-menu-panel')
			.getByRole('link', { name: 'Projekte', exact: true })
			.click();
		await expect(page).toHaveURL(/\/de\/projekte$/);
		await page.locator('button[popovertarget="mobile-search"]').click();
		await page.locator('#mobile-search input[name="q"]').fill('Projekte');
		await page.locator('#mobile-search button[type="submit"]').click();
		await expect(page).toHaveURL(/\/de\/suche\?q=Projekte$/);
		const projectHref = await page
			.locator('main')
			.getByRole('link', { name: 'Projekte', exact: true })
			.getAttribute('href');
		expect(new URL(projectHref!, page.url()).pathname).toBe('/de/projekte');
		await page.locator('button[popovertarget="appearance-settings"]').click();
		await languageLink(page, 'en').click();
		await expect(page).toHaveURL(/\/en\/search\?q=Projekte$/);
	} finally {
		await context.close();
	}
});

test('automatic redirects respect the first accepted language and prevent shared caching', async ({
	request
}) => {
	for (const [header, target] of [
		['de-AT,de;q=0.9,en;q=0.8', '/de/datenschutz'],
		['fr-FR,fr;q=0.9,de-DE;q=0.8', '/en/privacy'],
		['en;q=0.5,de-DE;q=0.9', '/de/datenschutz']
	]) {
		const response = await request.get('/privacy', {
			headers: { 'Accept-Language': header },
			maxRedirects: 0
		});
		expect(response.status()).toBe(307);
		expect(response.headers().location).toBe(target + '?__language=auto');
		expect(response.headers().vary).toContain('Accept-Language');
		expect(response.headers()['cache-control']).toContain('no-store');
	}
});
