import { expect, test, type Page } from '@playwright/test';

async function scrollDocument(page: Page, amount: number) {
	await page.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), amount);
	await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(amount);
}

for (const javaScriptEnabled of [true, false]) {
	test.describe(javaScriptEnabled ? 'with JavaScript' : 'without JavaScript', () => {
		test.use({ javaScriptEnabled });

		test('desktop header and preference controls scroll with the document', async ({ page }) => {
			await page.goto('/en');
			const controls = [
				page.getByRole('banner'),
				page.locator('[data-header-language]'),
				page.locator('[data-header-appearance]')
			];
			const initial = [];
			for (const control of controls) {
				await expect(control).toBeVisible();
				const box = await control.boundingBox();
				expect(box).not.toBeNull();
				initial.push(box!);
			}
			expect(initial[1].y).toBe(initial[0].y);
			expect(initial[2].y).toBe(initial[0].y);
			await scrollDocument(page, 300);
			for (const [index, control] of controls.entries()) {
				const box = await control.boundingBox();
				expect(box).not.toBeNull();
				expect(box!.y).toBeCloseTo(initial[index].y - 300, 1);
				expect(box!.y + box!.height).toBeLessThan(0);
			}
			await scrollDocument(page, 0);
			for (const [index, control] of controls.entries()) {
				expect((await control.boundingBox())!.y).toBeCloseTo(initial[index].y, 1);
			}
		});

		for (const panelId of ['appearance-settings', 'mobile-menu-panel', 'mobile-search']) {
			test('mobile ' + panelId + ' scrolls together with the header', async ({ page }) => {
				await page.setViewportSize({ width: 390, height: 844 });
				await page.goto('/en');
				if (javaScriptEnabled)
					await expect(page.locator('#appearance-settings button').first()).toBeEnabled();
				await page.locator('button[popovertarget="' + panelId + '"]').click();
				const panel = page.locator('#' + panelId);
				await expect(panel).toBeVisible();
				const initial = (await panel.boundingBox())!;
				const header = (await page.getByRole('banner').boundingBox())!;
				expect(initial.y).toBeGreaterThanOrEqual(header.y + header.height - 1);
				expect(initial.x).toBeGreaterThanOrEqual(0);
				expect(initial.x + initial.width).toBeLessThanOrEqual(390);
				await scrollDocument(page, 300);
				const scrolled = (await panel.boundingBox())!;
				expect(scrolled.y).toBeCloseTo(initial.y - 300, 1);
				expect((await page.getByRole('banner').boundingBox())!.y).toBeCloseTo(header.y - 300, 1);
				await scrollDocument(page, 0);
				await expect(panel).toBeVisible();
				expect((await panel.boundingBox())!.y).toBeCloseTo(initial.y, 1);
				if (panelId === 'appearance-settings') {
					await panel.locator('a[hreflang="de"]').click();
					await expect(page).toHaveURL(/\/de$/);
				}
			});
		}
	});
}
