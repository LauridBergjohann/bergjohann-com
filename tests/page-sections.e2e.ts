import type { SectionData } from '@page-sections/core';
import { expect, test } from '@playwright/test';

function allSections(sections: SectionData[]): SectionData[] {
	return sections.flatMap((section) => [
		section,
		...(section.type === 'grid'
			? section.blocks.flatMap((block) => allSections(block.sections))
			: [])
	]);
}
const slugs = {
	en: ['', 'blog', 'projects', 'workbench', 'about', 'privacy', 'imprint', 'sections'],
	de: ['', 'blog', 'projekte', 'werkbank', 'ueber-mich', 'datenschutz', 'impressum', 'sektionen']
};

for (const width of [390, 1920]) {
	test(`native sections keep readable text, equal cards and independent media at ${width}px`, async ({
		page
	}) => {
		await page.setViewportSize({ width, height: 1000 });
		await page.goto('/de');
		await page.locator('.ps-hero-section img').evaluate(async (image: HTMLImageElement) => {
			await image.decode();
			await document.fonts.ready;
		});
		const artwork = (await page.locator('.ps-hero-section img').boundingBox())!;
		expect(artwork.width).toBeGreaterThan(100);
		expect(artwork.height).toBeGreaterThan(100);
		await expect(page.locator('#about-website h3')).toHaveText('Bleib neugierig. Erschaffe Neues.');
		for (const id of ['themen', 'projekte']) {
			const cards = page.locator(`#${id} .ps-card`);
			const heights = await cards.evaluateAll((elements) =>
				elements.map((el) => el.getBoundingClientRect().height)
			);
			expect(Math.max(...heights) - Math.min(...heights)).toBeLessThan(1);
			for (const text of await cards.locator('.title, .description').all()) {
				expect(await text.evaluate((el) => el.scrollHeight <= el.clientHeight + 1)).toBe(true);
			}
		}
		await page.goto('/de/datenschutz');
		const body = (await page.locator('[data-body-layout="narrow"]').boundingBox())!;
		expect(body.width).toBeLessThanOrEqual(780);
		expect(body.x).toBeGreaterThanOrEqual(0);
		expect(body.x + body.width).toBeLessThanOrEqual(width);
		await expect(
			page.locator('#privacy-hosting p').filter({ hasText: 'Vercel Inc.' })
		).toContainText('340 S Lemon Ave #4133');
		await expect(
			page.locator('#privacy-hosting p').filter({ hasText: 'Vercel Inc.' }).locator('br')
		).toHaveCount(3);
		await page.route('https://www.youtube-nocookie.com/**', (route) =>
			route.fulfill({ body: '<html></html>', contentType: 'text/html' })
		);
		await page.goto('/de/sektionen');
		for (const frame of await page
			.locator('#my-list-section [data-ps-card-part="media-frame"]')
			.all()) {
			const box = (await frame.boundingBox())!;
			expect(box.width / box.height).toBeCloseTo(1.5, 2);
		}
		await expect(page.locator('#my-list-section img').first()).toHaveCSS('object-fit', 'contain');
		await expect(page.locator('#my-list-section .description').first()).toHaveText(
			'Das ist Karte 1'
		);
	});
}

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
						).toBeGreaterThanOrEqual(32);
						const api = await context.request.get(
							`/api/pages${slug ? '/' + slug : ''}?lang=${locale}`
						);
						const content = await api.json();
						await expect(page.locator('[data-ps-section]')).toHaveCount(
							allSections(content.sections).length + 1
						);
						for (const section of allSections(content.sections)) {
							await expect(page.locator(`[data-ps-section="${section.id}"]`)).toBeVisible();
							if (section.headline)
								await expect(page.locator(`[data-ps-section="${section.id}"]`)).toContainText(
									section.headline
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
			.locator('[data-header-appearance]:visible')
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

for (const javaScriptEnabled of [true, false]) {
	test.describe('package navigation with JavaScript ' + javaScriptEnabled, () => {
		test.use({ javaScriptEnabled });
		for (const width of [320, 600, 840, 1024, 1199, 1200, 1280, 1599, 1600, 1809, 1920, 2300]) {
			test('brand, menu and preferences fit at ' + width + 'px', async ({ page }) => {
				await page.setViewportSize({ width, height: 1000 });
				await page.goto('/en/projects');
				const nav = page.locator('.ps-navigation');
				await expect(nav).toBeVisible();
				await expect(nav.getByRole('link', { name: /bergjohann.com.*Home/ })).toBeVisible();
				const header = (await nav.locator('.header').boundingBox())!;
				expect(header.height).toBe(width < 1600 ? 66 : 64);
				if (width >= 1809) expect(header.width).toBe(1536);
				else if (width >= 1600) expect(header.width).toBe(width - 272);
				else expect(header.width).toBe(width);
				expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
					true
				);
				const settings = nav.locator('.settings > summary');
				if (width < 1600) {
					await expect(nav.locator('.satellite')).toHaveCount(2);
					await expect(nav.locator('.satellite.left')).toBeHidden();
					await expect(nav.locator('.satellite.right')).toBeHidden();
					await settings.click();
					const panel = nav.locator('.settings-panel');
					await expect(panel).toBeVisible();
					await expect(panel.locator('a[hreflang="de"]')).toBeVisible();
					await expect(panel.getByRole('button', { name: 'Dark', exact: true })).toBeVisible();
					const box = (await panel.boundingBox())!;
					expect(box.x).toBeGreaterThanOrEqual(0);
					expect(box.x + box.width).toBeLessThanOrEqual(width);
					await settings.click();
					await expect(panel).toBeHidden();
				} else {
					await expect(settings).toBeHidden();
					const left = (await nav.locator('.satellite.left').boundingBox())!;
					const right = (await nav.locator('.satellite.right').boundingBox())!;
					expect(left.x + left.width).toBeLessThan(header.x);
					expect(header.x + header.width).toBeLessThan(right.x);
				}
				if (width < 1200) {
					await page.locator('.mobile-menu > summary').click();
					await expect(page.locator('.mobile-panel a[aria-current="page"]')).toHaveText('Projects');
					await page
						.locator('.mobile-panel')
						.getByRole('link', { name: 'About', exact: true })
						.click();
				} else {
					await expect(nav.locator('.desktop-menu a[aria-current="page"]')).toHaveText('Projects');
					await nav
						.locator('.desktop-menu')
						.getByRole('link', { name: 'About', exact: true })
						.click();
				}
				await expect(page).toHaveURL(/\/en\/about$/);
				await expect(page.getByRole('heading', { level: 1 })).toHaveText('About');
			});
		}
	});
}

test('compact settings support keyboard dismissal, theme changes and resizing', async ({
	page
}) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto('/en');
	const settings = page.locator('.ps-navigation .settings > summary');
	const panel = page.locator('.ps-navigation .settings-panel');
	await settings.focus();
	await page.keyboard.press('Enter');
	await expect(panel).toBeVisible();
	await panel.getByRole('button', { name: 'Dark', exact: true }).click();
	await expect(page.locator('.ps-shell')).toHaveAttribute('data-ps-theme', 'dark');
	await expect
		.poll(() =>
			page.locator('.ps-hero-section img').evaluate((el: HTMLImageElement) => el.currentSrc)
		)
		.toContain('/images/heroes/home.png');
	await page.keyboard.press('Escape');
	await expect(panel).toBeHidden();
	await expect(settings).toBeFocused();
	await settings.click();
	await page.getByRole('heading', { level: 1 }).click({ position: { x: 2, y: 2 } });
	await expect(panel).toBeHidden();
	await settings.click();
	await page.setViewportSize({ width: 1800, height: 1000 });
	await expect(page.locator('.ps-navigation .settings')).not.toHaveAttribute('open');
	await expect(
		page.locator('.satellite.right').getByRole('button', { name: 'Dark', exact: true })
	).toHaveAttribute('aria-pressed', 'true');
});
