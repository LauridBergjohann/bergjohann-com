import { expect, test, type Locator, type Page } from '@playwright/test';

const themeKey = 'bergjohann-theme';
const themeButton = (page: Page, theme: 'light' | 'dark') =>
	page.locator('[data-header-appearance]').getByRole('button', {
		name: theme === 'light' ? 'Use light theme' : 'Use dark theme',
		exact: true
	});

async function expectTheme(page: Page, theme: 'light' | 'dark') {
	await expect(themeButton(page, theme)).toBeEnabled();
	await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
	await expect(themeButton(page, theme)).toHaveAttribute('aria-pressed', 'true');
	await expect(themeButton(page, theme === 'light' ? 'dark' : 'light')).toHaveAttribute(
		'aria-pressed',
		'false'
	);
}

for (const systemTheme of ['light', 'dark'] as const) {
	test(
		'theme follows the ' + systemTheme + ' system preference until a session choice is made',
		async ({ page }) => {
			await page.emulateMedia({ colorScheme: systemTheme });
			await page.goto('/en');
			await expectTheme(page, systemTheme);
			await expect(page.locator('[data-header-appearance] button')).toHaveCount(2);
			expect(await page.evaluate((key) => sessionStorage.getItem(key), themeKey)).toBeNull();
			const otherTheme = systemTheme === 'light' ? 'dark' : 'light';
			await page.emulateMedia({ colorScheme: otherTheme });
			await expectTheme(page, otherTheme);
			await themeButton(page, systemTheme).click();
			await expectTheme(page, systemTheme);
			expect(
				await page.evaluate((key) => JSON.parse(sessionStorage.getItem(key)!), themeKey)
			).toMatchObject({ theme: systemTheme });
			expect(await page.evaluate((key) => localStorage.getItem(key), themeKey)).toBeNull();
			await page.emulateMedia({ colorScheme: systemTheme });
			await page.emulateMedia({ colorScheme: otherTheme });
			await expectTheme(page, systemTheme);
			await page.reload();
			await expectTheme(page, systemTheme);
			await page.locator('[data-header-language] a[hreflang="de"]').click();
			await expect(page).toHaveURL(/\/de$/);
			await expect(page.locator('html')).toHaveAttribute('data-theme', systemTheme);
		}
	);
}

test('session theme synchronizes between open and joining tabs without leaking into a new session', async ({
	browser,
	context,
	page,
	baseURL
}) => {
	await page.emulateMedia({ colorScheme: 'dark' });
	await page.goto('/en');
	const second = await context.newPage();
	await second.emulateMedia({ colorScheme: 'dark' });
	await second.goto('/en/privacy');
	await expectTheme(page, 'dark');
	await expectTheme(second, 'dark');
	await themeButton(page, 'light').click();
	await expectTheme(second, 'light');
	expect(
		await second.evaluate((key) => JSON.parse(sessionStorage.getItem(key)!), themeKey)
	).toMatchObject({ theme: 'light' });
	await themeButton(second, 'dark').click();
	await expectTheme(page, 'dark');
	const joining = await context.newPage();
	await joining.emulateMedia({ colorScheme: 'light' });
	await joining.goto('/en/about');
	await expectTheme(joining, 'dark');
	await themeButton(joining, 'light').click();
	await expectTheme(page, 'light');
	await expectTheme(second, 'light');
	await second.reload();
	await expectTheme(second, 'light');
	// A restored tab can carry an older session choice; live tabs keep the newest choice.
	await joining.evaluate((key) => {
		sessionStorage.setItem(
			key,
			JSON.stringify({ theme: 'dark', changedAt: 1, source: 'restored-tab' })
		);
	}, themeKey);
	await joining.reload();
	await expectTheme(joining, 'light');
	await expectTheme(page, 'light');
	const fresh = await browser.newContext({
		baseURL,
		colorScheme: 'dark',
		viewport: { width: 1800, height: 1000 }
	});
	try {
		const freshPage = await fresh.newPage();
		await freshPage.goto('/en');
		await expectTheme(freshPage, 'dark');
		expect(await freshPage.evaluate((key) => sessionStorage.getItem(key), themeKey)).toBeNull();
	} finally {
		await fresh.close();
	}
});

test('legacy persistent themes are ignored and removed', async ({ page }) => {
	await page.emulateMedia({ colorScheme: 'light' });
	await page.addInitScript((key) => localStorage.setItem(key, 'dark'), themeKey);
	await page.goto('/en');
	await expectTheme(page, 'light');
	expect(await page.evaluate((key) => localStorage.getItem(key), themeKey)).toBeNull();
	expect(await page.evaluate((key) => sessionStorage.getItem(key), themeKey)).toBeNull();
});

test('theme selection and tab synchronization work when browser storage is unavailable', async ({
	context,
	page
}) => {
	await context.addInitScript(() => {
		for (const name of ['localStorage', 'sessionStorage']) {
			Object.defineProperty(window, name, {
				get() {
					throw new DOMException('Storage unavailable', 'SecurityError');
				}
			});
		}
	});
	await page.emulateMedia({ colorScheme: 'light' });
	await page.goto('/en');
	await expectTheme(page, 'light');
	const second = await context.newPage();
	await second.emulateMedia({ colorScheme: 'light' });
	await second.goto('/en/privacy');
	await expectTheme(second, 'light');
	await themeButton(page, 'dark').click();
	await expectTheme(page, 'dark');
	await expectTheme(second, 'dark');
	await themeButton(second, 'light').click();
	await expectTheme(page, 'light');
});

test('desktop language controls show translated tooltips on hover and focus and dismiss on Escape', async ({
	page
}) => {
	await page.goto('/en');
	await expect(themeButton(page, 'light')).toBeEnabled();
	const group = page.locator('[data-header-language]');
	const english = group.locator('a[hreflang="en"]');
	const german = group.locator('a[hreflang="de"]');
	await german.hover();
	const tooltip = group.locator('a[hreflang="de"] + span');
	await expect(tooltip).toBeVisible();
	await expect(tooltip).toContainText(/German/i);
	await expect(tooltip).toHaveCSS('opacity', '1');
	await english.focus();
	await page.mouse.move(900, 900);
	const currentTooltip = group.locator('a[hreflang="en"] + span');
	await expect(currentTooltip).toBeVisible();
	await expect(currentTooltip).toContainText(/English/i);
	await expect(currentTooltip).toHaveCSS('opacity', '1');
	await page.keyboard.press('Escape');
	await expect(currentTooltip).toHaveCount(0);
	await german.click();
	await expect(page).toHaveURL(/\/de$/);
	await page.locator('[data-header-language] a[hreflang="en"]').hover();
	await expect(page.locator('[data-header-language] a[hreflang="en"] + span')).toHaveCSS(
		'opacity',
		'1'
	);
});

test('mobile settings show full language names above the two theme options', async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto('/en');
	await page.locator('button[popovertarget="appearance-settings"]').click();
	const popup = page.getByRole('dialog');
	const language = popup.getByRole('group').first();
	await expect(language.locator('a[hreflang="en"]')).toHaveText('english');
	await expect(language.locator('a[hreflang="de"]')).toHaveText('deutsch');
	const appearance = popup.getByRole('group').nth(1);
	await expect(appearance.getByRole('button')).toHaveCount(2);
	await expect(appearance).toContainText('Light');
	await expect(appearance).toContainText('Dark');
});

async function expectHoverUnderline(page: Page, link: Locator) {
	await page.mouse.move(0, 0);
	await expect(link).toHaveCSS('text-decoration-line', 'none');
	await link.hover();
	await expect(link).toHaveCSS('text-decoration-line', 'underline');
}

test('text links consistently underline only on hover while CTA buttons remain undecorated', async ({
	page
}) => {
	await page.goto('/en');
	await expectHoverUnderline(page, page.locator('.hero-actions a').nth(1));
	const cta = page.locator('.hero-actions a').first();
	await page.mouse.move(0, 0);
	await expect(cta).toHaveCSS('text-decoration-line', 'none');
	await cta.hover();
	await expect(cta).toHaveCSS('text-decoration-line', 'none');
	await expectHoverUnderline(page, page.locator('footer a').first());
	await expectHoverUnderline(page, page.locator('footer a[href="/en/privacy"]'));
	await page.goto('/en/privacy');
	await expectHoverUnderline(page, page.locator('main a[href^="mailto:"]').first());
});
