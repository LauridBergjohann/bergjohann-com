import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { createRawSnippet } from 'svelte';

import Link from './Link.svelte';

const children = createRawSnippet(() => ({
	render: () => '<span>Test link</span>'
}));

describe('Link.svelte', () => {
	it('renders an internal link', async () => {
		const screen = await render(Link, {
			props: {
				href: '/projects',
				children
			}
		});

		const link = screen.getByRole('link', { name: 'Test link' });

		await expect.element(link).toHaveAttribute('href', '/projects');
		await expect.element(link).not.toHaveAttribute(
			'rel',
			expect.stringContaining('external')
		);
	});

	it('renders an external HTTPS link', async () => {
		const screen = await render(Link, {
			props: {
				href: 'https://example.com',
				children
			}
		});

		const link = screen.getByRole('link', { name: 'Test link' });

		await expect.element(link).toHaveAttribute(
			'href',
			'https://example.com'
		);
		await expect.element(link).toHaveAttribute(
			'rel',
			expect.stringContaining('external')
		);
	});

	it('renders a protocol-relative link as external', async () => {
		const screen = await render(Link, {
			props: {
				href: '//example.com',
				children
			}
		});

		const link = screen.getByRole('link', { name: 'Test link' });

		await expect.element(link).toHaveAttribute(
			'href',
			'//example.com'
		);
		await expect.element(link).toHaveAttribute(
			'rel',
			expect.stringContaining('external')
		);
	});

	it('renders a mailto link as external', async () => {
		const screen = await render(Link, {
			props: {
				href: 'mailto:hello@example.com',
				children
			}
		});

		const link = screen.getByRole('link', { name: 'Test link' });

		await expect.element(link).toHaveAttribute(
			'href',
			'mailto:hello@example.com'
		);
		await expect.element(link).toHaveAttribute(
			'rel',
			expect.stringContaining('external')
		);
	});

	it('renders a telephone link as external', async () => {
		const screen = await render(Link, {
			props: {
				href: 'tel:+49123456789',
				children
			}
		});

		const link = screen.getByRole('link', { name: 'Test link' });

		await expect.element(link).toHaveAttribute(
			'href',
			'tel:+49123456789'
		);
		await expect.element(link).toHaveAttribute(
			'rel',
			expect.stringContaining('external')
		);
	});

	it('renders a fragment link without resolving it', async () => {
		const screen = await render(Link, {
			props: {
				href: '#contact',
				children
			}
		});

		const link = screen.getByRole('link', { name: 'Test link' });

		await expect.element(link).toHaveAttribute('href', '#contact');
		await expect.element(link).not.toHaveAttribute(
			'rel',
			expect.stringContaining('external')
		);
	});

	it('preserves additional rel values for external links', async () => {
		const screen = await render(Link, {
			props: {
				href: 'https://example.com',
				rel: 'noopener noreferrer',
				children
			}
		});

		const link = screen.getByRole('link', { name: 'Test link' });

		await expect.element(link).toHaveAttribute(
			'rel',
			expect.stringContaining('external')
		);
		await expect.element(link).toHaveAttribute(
			'rel',
			expect.stringContaining('noopener')
		);
		await expect.element(link).toHaveAttribute(
			'rel',
			expect.stringContaining('noreferrer')
		);
	});

	it('forwards anchor attributes', async () => {
		const screen = await render(Link, {
			props: {
				href: '/projects',
				title: 'Open projects',
				class: 'custom-link',
				target: '_blank',
				'aria-label': 'Projects',
				children
			}
		});

		const link = screen.getByRole('link', { name: 'Projects' });

		await expect.element(link).toHaveAttribute(
			'title',
			'Open projects'
		);
		await expect.element(link).toHaveClass('custom-link');
		await expect.element(link).toHaveAttribute(
			'target',
			'_blank'
		);
		await expect.element(link).toHaveAttribute(
			'aria-label',
			'Projects'
		);
	});
});