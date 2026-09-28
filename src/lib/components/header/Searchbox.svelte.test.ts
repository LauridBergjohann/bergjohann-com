import { afterEach, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Searchbox from './Searchbox.svelte';

afterEach(() => vi.restoreAllMocks());

it('renders model and page hits using the API response fields', async () => {
	vi.spyOn(globalThis, 'fetch').mockResolvedValue(
		new Response(
			JSON.stringify({
				models: [{ href: '/models/test-model', label: 'Test model' }],
				pages: [{ href: '/workbench', label: 'Workbench' }]
			}),
			{ status: 200, headers: { 'Content-Type': 'application/json' } }
		)
	);
	const screen = await render(Searchbox);
	await screen.getByRole('textbox', { name: 'Suche', exact: true }).fill('test');
	await expect
		.element(screen.getByRole('option', { name: 'Test model' }))
		.toHaveAttribute('href', '/models/test-model');
	await expect
		.element(screen.getByRole('option', { name: 'Workbench' }))
		.toHaveAttribute('href', '/workbench');
});
