import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';

import Card from './Card.svelte';

describe('Card.svelte', () => {
	it('renders the card title', async () => {
		const screen = await render(Card, {
			props: {
				card: {
					id: 'example-card',
					href: '/projects/example',
					title: 'Example project'
				},
				size: 'sm'
			}
		});

		await expect
			.element(
				screen.getByRole('heading', {
					level: 2,
					name: 'Example project'
				})
			)
			.toBeInTheDocument();
	});

	it('renders the card as a link', async () => {
		const screen = await render(Card, {
			props: {
				card: {
					id: 'example-card',
					href: '/projects/example',
					title: 'Example project'
				},
				size: 'sm'
			}
		});

		const link = screen.getByRole('link', {
			name: 'Example project'
		});

		await expect.element(link).toHaveAttribute(
			'href',
			'/projects/example'
		);

		await expect.element(link).toHaveAttribute(
			'title',
			'Example project'
		);
	});

	it('renders an external card link', async () => {
		const screen = await render(Card, {
			props: {
				card: {
					id: 'external-card',
					href: 'https://example.com',
					title: 'External project'
				},
				size: 'sm'
			}
		});

		const link = screen.getByRole('link', {
			name: 'External project'
		});

		await expect.element(link).toHaveAttribute(
			'href',
			'https://example.com'
		);

		await expect.element(link).toHaveAttribute(
			'rel',
			expect.stringContaining('external')
		);
	});

	it('renders the optional subtitle', async () => {
		const screen = await render(Card, {
			props: {
				card: {
					id: 'example-card',
					href: '/projects/example',
					title: 'Example project',
					subtitle: 'Example subtitle'
				},
				size: 'sm'
			}
		});

		await expect
			.element(screen.getByText('Example subtitle'))
			.toBeInTheDocument();
	});

	it('does not render a subtitle when none is provided', async () => {
		const screen = await render(Card, {
			props: {
				card: {
					id: 'example-card',
					href: '/projects/example',
					title: 'Example project'
				},
				size: 'sm'
			}
		});

		expect(screen.container.querySelector('p')).toBeNull();
	});

	it('centers the content vertically when no subtitle is present', async () => {
		const screen = await render(Card, {
			props: {
				card: {
					id: 'example-card',
					href: '/projects/example',
					title: 'Example project'
				},
				size: 'sm'
			}
		});

		const heading = screen
			.getByRole('heading', {
				level: 2,
				name: 'Example project'
			})
			.element();

		const content = heading.parentElement;

		expect(content).not.toBeNull();
		expect(content).toHaveClass('justify-center');
	});

	it('does not vertically center the content when a subtitle is present', async () => {
		const screen = await render(Card, {
			props: {
				card: {
					id: 'example-card',
					href: '/projects/example',
					title: 'Example project',
					subtitle: 'Example subtitle'
				},
				size: 'sm'
			}
		});

		const heading = screen
			.getByRole('heading', {
				level: 2,
				name: 'Example project'
			})
			.element();

		const content = heading.parentElement;

		expect(content).not.toBeNull();
		expect(content).not.toHaveClass('justify-center');
	});

	it('renders the optional image', async () => {
		const screen = await render(Card, {
			props: {
				card: {
					id: 'example-card',
					href: '/projects/example',
					title: 'Example project',
					image: '/images/example.jpg'
				},
				size: 'sm'
			}
		});

		const image = screen.getByRole('img', {
			name: 'Example project'
		});

		await expect.element(image).toHaveAttribute(
			'src',
			'/images/example.jpg'
		);

		await expect.element(image).toHaveAttribute(
			'alt',
			'Example project'
		);
	});

	it('does not render an image when none is provided', async () => {
		const screen = await render(Card, {
			props: {
				card: {
					id: 'example-card',
					href: '/projects/example',
					title: 'Example project'
				},
				size: 'sm'
			}
		});

		await expect
			.element(screen.getByRole('img'))
			.not.toBeInTheDocument();
	});

	it('uses object-contain for images by default', async () => {
		const screen = await render(Card, {
			props: {
				card: {
					id: 'example-card',
					href: '/projects/example',
					title: 'Example project',
					image: '/images/example.jpg'
				},
				size: 'sm'
			}
		});

		const image = screen.getByRole('img', {
			name: 'Example project'
		});

		await expect.element(image).toHaveClass('object-contain');
		await expect.element(image).not.toHaveClass('object-cover');
	});

	it('uses object-cover when imageCover is enabled', async () => {
		const screen = await render(Card, {
			props: {
				card: {
					id: 'example-card',
					href: '/projects/example',
					title: 'Example project',
					image: '/images/example.jpg',
					imageCover: true
				},
				size: 'sm'
			}
		});

		const image = screen.getByRole('img', {
			name: 'Example project'
		});

		await expect.element(image).toHaveClass('object-cover');
		await expect.element(image).not.toHaveClass('object-contain');
	});

	it('applies small title typography', async () => {
		const screen = await render(Card, {
			props: {
				card: {
					id: 'example-card',
					href: '/projects/example',
					title: 'Example project'
				},
				size: 'sm'
			}
		});

		const heading = screen.getByRole('heading', {
			level: 2,
			name: 'Example project'
		});

		await expect.element(heading).toHaveClass('text-sm');
		await expect.element(heading).toHaveClass('md:text-base');
	});

	it('applies medium title typography', async () => {
		const screen = await render(Card, {
			props: {
				card: {
					id: 'example-card',
					href: '/projects/example',
					title: 'Example project'
				},
				size: 'md'
			}
		});

		const heading = screen.getByRole('heading', {
			level: 2,
			name: 'Example project'
		});

		await expect.element(heading).toHaveClass('text-base');
		await expect.element(heading).toHaveClass('md:text-lg');
	});

	it('applies large title typography', async () => {
		const screen = await render(Card, {
			props: {
				card: {
					id: 'example-card',
					href: '/projects/example',
					title: 'Example project'
				},
				size: 'lg'
			}
		});

		const heading = screen.getByRole('heading', {
			level: 2,
			name: 'Example project'
		});

		await expect.element(heading).toHaveClass('text-lg');
		await expect.element(heading).toHaveClass('md:text-xl');
	});

	it('applies small subtitle typography', async () => {
		const screen = await render(Card, {
			props: {
				card: {
					id: 'example-card',
					href: '/projects/example',
					title: 'Example project',
					subtitle: 'Example subtitle'
				},
				size: 'sm'
			}
		});

		const subtitle = screen.getByText('Example subtitle');

		await expect.element(subtitle).toHaveClass('text-xs');
		await expect.element(subtitle).toHaveClass('md:text-sm');
	});

	it('applies medium subtitle typography', async () => {
		const screen = await render(Card, {
			props: {
				card: {
					id: 'example-card',
					href: '/projects/example',
					title: 'Example project',
					subtitle: 'Example subtitle'
				},
				size: 'md'
			}
		});

		const subtitle = screen.getByText('Example subtitle');

		await expect.element(subtitle).toHaveClass('text-sm');
	});

	it('applies large subtitle typography', async () => {
		const screen = await render(Card, {
			props: {
				card: {
					id: 'example-card',
					href: '/projects/example',
					title: 'Example project',
					subtitle: 'Example subtitle'
				},
				size: 'lg'
			}
		});

		const subtitle = screen.getByText('Example subtitle');

		await expect.element(subtitle).toHaveClass('text-sm');
		await expect.element(subtitle).toHaveClass('md:text-base');
	});
});