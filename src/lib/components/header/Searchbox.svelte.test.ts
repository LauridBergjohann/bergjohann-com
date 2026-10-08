import { afterEach, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Searchbox from './Searchbox.svelte';
import type { Messages } from '$lib/i18n/messages';
const messages = {
	search: {
		label: 'Search',
		submit: 'Submit search',
		hint: 'Enter a keyword',
		noResults: 'No results',
		models: 'Models',
		pages: 'Pages'
	},
	links: { search: '/en/search' }
} as Messages;

afterEach(() => vi.restoreAllMocks());

it('renders model and page hits using the API response fields', async () => {
	vi.spyOn(globalThis, 'fetch').mockResolvedValue(
		new Response(
			JSON.stringify({
				models: [{ href: '/en/models/test-model', label: 'Test model' }],
				pages: [{ href: '/en/workbench', label: 'Workbench' }]
			}),
			{ status: 200, headers: { 'Content-Type': 'application/json' } }
		)
	);
	const screen = await render(Searchbox, { props: { locale: 'en', messages } });
	await screen.getByRole('textbox', { name: 'Search', exact: true }).fill('test');
	await expect
		.element(screen.getByRole('option', { name: 'Test model' }))
		.toHaveAttribute('href', '/en/models/test-model');
	await expect
		.element(screen.getByRole('option', { name: 'Workbench' }))
		.toHaveAttribute('href', '/en/workbench');
});
