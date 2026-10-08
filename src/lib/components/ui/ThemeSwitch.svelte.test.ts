import { afterEach, beforeEach, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import ThemeSwitch from './ThemeSwitch.svelte';
import { themeMessages as messages } from './theme-test-messages';

let saved: string | null;
let originalTheme: string | undefined;
beforeEach(() => {
	saved = sessionStorage.getItem('bergjohann-theme');
	originalTheme = document.documentElement.dataset.theme;
	sessionStorage.removeItem('bergjohann-theme');
});
afterEach(() => {
	if (saved === null) sessionStorage.removeItem('bergjohann-theme');
	else sessionStorage.setItem('bergjohann-theme', saved);
	if (originalTheme === undefined) delete document.documentElement.dataset.theme;
	else document.documentElement.dataset.theme = originalTheme;
});

it('selects the system appearance without saving a preference', async () => {
	const screen = await render(ThemeSwitch, { props: { messages } });
	const theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
	await expect
		.element(screen.getByRole('button', { name: theme === 'light' ? 'Light' : 'Dark' }))
		.toHaveAttribute('aria-pressed', 'true');
	expect(screen.container.querySelectorAll('button')).toHaveLength(2);
	expect(sessionStorage.getItem('bergjohann-theme')).toBeNull();
});

it('synchronizes header and labelled controls and keeps the choice in session storage', async () => {
	const header = await render(ThemeSwitch, { props: { messages } });
	const mobile = await render(ThemeSwitch, { props: { labelled: true, messages } });
	await mobile.getByRole('button', { name: 'Dark' }).nth(1).click();
	await expect
		.element(header.getByRole('button', { name: 'Dark' }).nth(0))
		.toHaveAttribute('aria-pressed', 'true');
	expect(document.documentElement.dataset.theme).toBe('dark');
	expect(JSON.parse(sessionStorage.getItem('bergjohann-theme')!).theme).toBe('dark');
	expect(localStorage.getItem('bergjohann-theme')).toBeNull();
	await header.getByRole('button', { name: 'Light' }).nth(0).click();
	await expect
		.element(mobile.getByRole('button', { name: 'Light' }).nth(1))
		.toHaveAttribute('aria-pressed', 'true');
	expect(document.documentElement.dataset.theme).toBe('light');
});

it('restores a saved session choice on mount', async () => {
	sessionStorage.setItem(
		'bergjohann-theme',
		JSON.stringify({ theme: 'dark', changedAt: 1, source: 'test' })
	);
	const screen = await render(ThemeSwitch, { props: { messages } });
	await expect
		.element(screen.getByRole('button', { name: 'Dark' }))
		.toHaveAttribute('aria-pressed', 'true');
	expect(document.documentElement.dataset.theme).toBe('dark');
});
