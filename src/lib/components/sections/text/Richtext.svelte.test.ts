import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';

import RichText from './Richtext.svelte';

describe('RichText.svelte', () => {
	it('renders plain text content when format is text', async () => {
		const screen = await render(RichText, {
			props: {
				section: {
					id: 'rich-text',
					format: 'text',
					body: 'Plain text content'
				}
			}
		});

		const content = screen.getByText('Plain text content');

		await expect.element(content).toBeInTheDocument();
		await expect.element(content).toHaveClass('prose');
		await expect.element(content).toHaveClass('max-w-none');
	});

	it('renders markdown content in the markdown branch', async () => {
		const screen = await render(RichText, {
			props: {
				section: {
					id: 'rich-text',
					format: 'markdown',
					body: '# Example heading'
				}
			}
		});

		const content = screen.getByText('# Example heading');

		await expect.element(content).toBeInTheDocument();
		await expect.element(content).toHaveClass('max-w-3xl');
		await expect.element(content).toHaveClass('whitespace-pre-line');
	});

	it('uses the markdown branch by default', async () => {
		const screen = await render(RichText, {
			props: {
				section: {
					id: 'rich-text',
					body: 'Default content'
				}
			}
		});

		const content = screen.getByText('Default content');

		await expect.element(content).toBeInTheDocument();
		await expect.element(content).toHaveClass('max-w-3xl');
		await expect.element(content).toHaveClass('whitespace-pre-line');
	});

	it('preserves multiline content', async () => {
		const screen = await render(RichText, {
			props: {
				section: {
					id: 'rich-text',
					format: 'markdown',
					body: 'First line\nSecond line'
				}
			}
		});

		const content = screen.container.querySelector('p');

		expect(content).not.toBeNull();
		expect(content).toHaveTextContent('First line Second line');
		expect(content).toHaveClass('whitespace-pre-line');
	});
});