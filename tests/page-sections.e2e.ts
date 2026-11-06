import { expect, test } from '@playwright/test';

const slugs = {
	en: ['', 'blog', 'projects', 'workbench', 'about', 'privacy', 'imprint', 'sections'],
	de: ['', 'blog', 'projekte', 'werkbank', 'ueber-mich', 'datenschutz', 'impressum', 'sektionen']
};

for (const width of [390, 1800])
	for (const javaScriptEnabled of [false, true]) {
		test(`Page Sections preserves all content at ${width}px with JavaScript ${javaScriptEnabled}`, async ({
			browser,
			baseURL
		}) => {
			test.setTimeout(120000);
			const context = await browser.newContext({
				baseURL,
				javaScriptEnabled,
				viewport: { width, height: 1000 }
			});
			// Third-party video availability is not part of this integration check.
			await context.route('https://www.youtube-nocookie.com/**', (route) =>
				route.fulfill({ body: '<html></html>', contentType: 'text/html' })
			);
			const page = await context.newPage();
			const errors: string[] = [];
			page.on('pageerror', (error) => errors.push(error.message));
			try {
				for (const locale of ['en', 'de'] as const)
					for (const slug of slugs[locale]) {
						const path = `/${locale}${slug ? '/' + slug : ''}`;
						const response = await page.goto(path);
						expect(response?.status()).toBe(200);
						await expect(page.locator('main')).toHaveCount(1);
						await expect(page.locator('main.ps-page')).toHaveAttribute('lang', locale);
						await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
						await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
						// Detect missing component CSS as well as missing content.
						expect(
							await page.locator('h1').evaluate((el) => parseFloat(getComputedStyle(el).fontSize))
						).toBeGreaterThan(32);
						const api = await context.request.get(
							`/api/pages${slug ? '/' + slug : ''}?lang=${locale}`
						);
						const content = await api.json();
						await expect(page.locator('[data-ps-section]')).toHaveCount(content.sections.length);
						for (const section of content.sections) {
							await expect(page.locator(`[data-ps-section="${section.id}"]`)).toBeVisible();
							if (section.title)
								await expect(page.locator(`[data-ps-section="${section.id}"]`)).toContainText(
									section.title
								);
						}
						expect(await page.title()).toBeTruthy();
						await expect(page.locator('head title')).toHaveCount(1);
						expect(
							new URL((await page.locator('link[rel="canonical"]').getAttribute('href'))!).pathname
						).toBe(path);
						expect(
							await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)
						).toBe(true);
						if (slug === 'imprint' || slug === 'impressum') {
							await expect(page.locator('main address').first()).toContainText('Laurid Bergjohann');
							await expect(page.locator('main a[href^="mailto:"]').first()).toBeVisible();
						}
					}
				expect(errors).toEqual([]);
			} finally {
				await context.close();
			}
		});
	}

test('package media and surfaces follow the host theme', async ({ page }) => {
	await page.route('https://www.youtube-nocookie.com/**', (route) =>
		route.fulfill({ body: '<html></html>', contentType: 'text/html' })
	);
	await page.goto('/en/sections');
	const image = page.locator('#my-image-section img');
	await image.scrollIntoViewIfNeeded();
	for (const theme of ['dark', 'light'] as const) {
		await page
			.locator('[data-header-appearance]')
			.getByRole('button', { name: theme === 'dark' ? 'Dark' : 'Light', exact: true })
			.click();
		await expect(page.locator('.site-page-sections .ps-shell')).toHaveAttribute(
			'data-ps-theme',
			theme
		);
		await expect
			.poll(() => image.evaluate((el: HTMLImageElement) => el.currentSrc))
			.toContain(`rhein-${theme}.webp`);
		expect(
			await page.locator('.site-page-sections .ps-shell').evaluate((el) => {
				const css = getComputedStyle(el);
				return (
					css.getPropertyValue('--ps-section-standard').trim() ===
					css.getPropertyValue('--section-background').trim()
				);
			})
		).toBe(true);
	}
});

test('package images honor the system dark theme without JavaScript', async ({
	browser,
	baseURL
}) => {
	const context = await browser.newContext({
		baseURL,
		javaScriptEnabled: false,
		colorScheme: 'dark'
	});
	await context.route('https://www.youtube-nocookie.com/**', (route) =>
		route.fulfill({ body: '<html></html>', contentType: 'text/html' })
	);
	try {
		const page = await context.newPage();
		await page.goto('/de/sektionen');
		const image = page.locator('#my-image-section img');
		await image.scrollIntoViewIfNeeded();
		await expect
			.poll(() => image.evaluate((el: HTMLImageElement) => el.currentSrc))
			.toContain('rhein-dark.webp');
		await expect(page.locator('html')).not.toHaveAttribute('data-theme');
	} finally {
		await context.close();
	}
});
