import { expect, test } from '@playwright/test';

for (const width of [320, 390, 840, 1200, 1920, 2560]) {
	test(`package footer keeps localized links accessible at ${width}px`, async ({ page }) => {
		await page.setViewportSize({ width, height: 1000 });
		for (const locale of ['en', 'de'] as const) {
			await page.goto('/' + locale);
			await expect(page.getByRole('banner')).toHaveCount(1);
			const footer = page.getByRole('contentinfo');
			await expect(footer).toHaveCount(1);
			await footer.scrollIntoViewIfNeeded();
			await expect(footer.locator('.ps-footer-brand')).toContainText('bergjohann');
			for (const name of ['GitHub', 'LinkedIn']) {
				const link = footer.getByRole('link', { name, exact: true });
				await expect(link).toBeVisible();
				await expect(link).toHaveAttribute('target', '_blank');
				await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
				await expect(link).toHaveAttribute('href', /^https:\/\//);
			}
			for (const [name, slug] of locale === 'en'
				? [
						['Imprint', 'imprint'],
						['Privacy Policy', 'privacy']
					]
				: [
						['Impressum', 'impressum'],
						['Datenschutz', 'datenschutz']
					]) {
				const link = footer.getByRole('link', { name, exact: true });
				await expect(link).toBeVisible();
				await expect(link).toHaveAttribute('href', `/${locale}/${slug}`);
				await expect(link).not.toHaveAttribute('target', '_blank');
			}
			expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
				true
			);
			const labels = await footer.locator('a').evaluateAll((links) =>
				links.map((link) => {
					const range = document.createRange();
					range.selectNodeContents(link);
					const { left, right } = range.getBoundingClientRect();
					return { left, right };
				})
			);
			for (const label of labels) {
				expect(label.left).toBeGreaterThanOrEqual(0);
				expect(label.right).toBeLessThanOrEqual(width);
			}
		}
	});
}
