import { afterEach, beforeEach, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import ThemeSwitch from './ThemeSwitch.svelte';
import { themeMessages as messages } from './theme-test-messages';

let saved: string | null;
let originalTheme: string | undefined;
beforeEach(() => {
	saved = localStorage.getItem('bergjohann-theme');
	originalTheme = document.documentElement.dataset.theme;
	localStorage.removeItem('bergjohann-theme');
});
afterEach(() => {
	if (saved === null) localStorage.removeItem('bergjohann-theme');
	else localStorage.setItem('bergjohann-theme', saved);
	if (originalTheme === undefined) delete document.documentElement.dataset.theme;
	else document.documentElement.dataset.theme = originalTheme;
});

it('synchronizes header and labelled controls and persists the selection', async () => {
	const header = await render(ThemeSwitch, { props: { messages } });
	const mobile = await render(ThemeSwitch, { props: { labelled: true, messages } });
	await mobile.getByRole('button', { name: 'Use dark theme' }).nth(1).click();
	await expect
		.element(header.getByRole('button', { name: 'Use dark theme' }).nth(0))
		.toHaveAttribute('aria-pressed', 'true');
	expect(document.documentElement.dataset.theme).toBe('dark');
	expect(localStorage.getItem('bergjohann-theme')).toBe('dark');
	await header.getByRole('button', { name: 'Use light theme' }).nth(0).click();
	await expect
		.element(mobile.getByRole('button', { name: 'Use light theme' }).nth(1))
		.toHaveAttribute('aria-pressed', 'true');
	expect(document.documentElement.dataset.theme).toBe('light');
	await header.getByRole('button', { name: 'Use system theme' }).nth(0).click();
	expect(localStorage.getItem('bergjohann-theme')).toBeNull();
	expect(document.documentElement.dataset.theme).toBe(
		window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
	);
});

it('restores a saved preference on mount', async () => {
	localStorage.setItem('bergjohann-theme', 'dark');
	const screen = await render(ThemeSwitch, { props: { messages } });
	await expect
		.element(screen.getByRole('button', { name: 'Use dark theme' }))
		.toHaveAttribute('aria-pressed', 'true');
	expect(document.documentElement.dataset.theme).toBe('dark');
});
