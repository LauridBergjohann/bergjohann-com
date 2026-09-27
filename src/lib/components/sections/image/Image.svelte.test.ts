import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';

import Image from './Image.svelte';

describe('Image.svelte', () => {
	it('renders the configured image', async () => {
		const screen = await render(Image, {
			props: {
				section: {
					id: 'image-section',
					image: {
						src: '/images/example.jpg',
						alt: 'Example image'
					}
				}
			}
		});

		const image = screen.getByRole('img', { name: 'Example image' });

		await expect.element(image).toHaveAttribute('src', '/images/example.jpg');
		await expect.element(image).toHaveAttribute('alt', 'Example image');
	});

	it('renders the optional headline', async () => {
		const screen = await render(Image, {
			props: {
				section: {
					id: 'image-section',
					headline: 'Example headline',
					image: {
						src: '/images/example.jpg',
						alt: 'Example image'
					}
				}
			}
		});

		await expect
			.element(
				screen.getByRole('heading', {
					level: 3,
					name: 'Example headline'
				})
			)
			.toBeInTheDocument();
	});

	it('renders the optional description', async () => {
		const screen = await render(Image, {
			props: {
				section: {
					id: 'image-section',
					description: 'Example description',
					image: {
						src: '/images/example.jpg',
						alt: 'Example image'
					}
				}
			}
		});

		await expect
			.element(screen.getByText('Example description'))
			.toBeInTheDocument();
	});

	it('does not render text content when headline and description are missing', async () => {
		const screen = await render(Image, {
			props: {
				section: {
					id: 'image-section',
					image: {
						src: '/images/example.jpg',
						alt: 'Example image'
					}
				}
			}
		});

		await expect
			.element(screen.getByRole('heading', { level: 3 }))
			.not.toBeInTheDocument();

		expect(
			screen.container.querySelector('.md\\:flex-1')
		).toBeNull();
	});

	it('positions the image on the left by default', async () => {
		const screen = await render(Image, {
			props: {
				section: {
					id: 'image-section',
					image: {
						src: '/images/example.jpg',
						alt: 'Example image'
					}
				}
			}
		});

		const image = screen.getByRole('img', { name: 'Example image' }).element();
		const layout = image.parentElement?.parentElement;

		expect(layout).not.toBeNull();
		expect(layout).toHaveClass('md:flex-row');
		expect(layout).not.toHaveClass('md:flex-row-reverse');
	});

	it('positions the image on the right when configured', async () => {
		const screen = await render(Image, {
			props: {
				section: {
					id: 'image-section',
					imageSide: 'right',
					image: {
						src: '/images/example.jpg',
						alt: 'Example image'
					}
				}
			}
		});

		const image = screen.getByRole('img', { name: 'Example image' }).element();
		const layout = image.parentElement?.parentElement;

		expect(layout).not.toBeNull();
		expect(layout).toHaveClass('md:flex-row-reverse');
		expect(layout).not.toHaveClass('md:flex-row');
	});

	it('does not apply an aspect ratio class by default', async () => {
		const screen = await render(Image, {
			props: {
				section: {
					id: 'image-section',
					image: {
						src: '/images/example.jpg',
						alt: 'Example image'
					}
				}
			}
		});

		const image = screen.getByRole('img', { name: 'Example image' }).element();
		const container = image.parentElement;

		expect(container).not.toBeNull();
		expect(container).not.toHaveClass('aspect-[4/3]');
		expect(container).not.toHaveClass('aspect-video');
		expect(container).not.toHaveClass('aspect-[2/1]');
		expect(container).not.toHaveClass('aspect-square');
	});

	it('applies a 4/3 aspect ratio', async () => {
		const screen = await render(Image, {
			props: {
				section: {
					id: 'image-section',
					image: {
						src: '/images/example.jpg',
						alt: 'Example image',
						aspect: '4/3'
					}
				}
			}
		});

		const image = screen.getByRole('img', { name: 'Example image' }).element();

		expect(image.parentElement).toHaveClass('aspect-[4/3]');
	});

	it('applies a 16/9 aspect ratio', async () => {
		const screen = await render(Image, {
			props: {
				section: {
					id: 'image-section',
					image: {
						src: '/images/example.jpg',
						alt: 'Example image',
						aspect: '16/9'
					}
				}
			}
		});

		const image = screen.getByRole('img', { name: 'Example image' }).element();

		expect(image.parentElement).toHaveClass('aspect-video');
	});

	it('applies a 2/1 aspect ratio', async () => {
		const screen = await render(Image, {
			props: {
				section: {
					id: 'image-section',
					image: {
						src: '/images/example.jpg',
						alt: 'Example image',
						aspect: '2/1'
					}
				}
			}
		});

		const image = screen.getByRole('img', { name: 'Example image' }).element();

		expect(image.parentElement).toHaveClass('aspect-[2/1]');
	});

	it('applies a square aspect ratio', async () => {
		const screen = await render(Image, {
			props: {
				section: {
					id: 'image-section',
					image: {
						src: '/images/example.jpg',
						alt: 'Example image',
						aspect: 'square'
					}
				}
			}
		});

		const image = screen.getByRole('img', { name: 'Example image' }).element();

		expect(image.parentElement).toHaveClass('aspect-square');
	});

	it('uses object-cover by default', async () => {
		const screen = await render(Image, {
			props: {
				section: {
					id: 'image-section',
					image: {
						src: '/images/example.jpg',
						alt: 'Example image'
					}
				}
			}
		});

		const image = screen.getByRole('img', { name: 'Example image' });

		await expect.element(image).toHaveClass('object-cover');
		await expect.element(image).not.toHaveClass('object-contain');
	});

	it('uses object-contain when configured', async () => {
		const screen = await render(Image, {
			props: {
				section: {
					id: 'image-section',
					image: {
						src: '/images/example.jpg',
						alt: 'Example image',
						objectFit: 'contain'
					}
				}
			}
		});

		const image = screen.getByRole('img', { name: 'Example image' });

		await expect.element(image).toHaveClass('object-contain');
		await expect.element(image).not.toHaveClass('object-cover');
	});

	it('renders headline and description together', async () => {
		const screen = await render(Image, {
			props: {
				section: {
					id: 'image-section',
					headline: 'Example headline',
					description: 'Example description',
					image: {
						src: '/images/example.jpg',
						alt: 'Example image'
					}
				}
			}
		});

		await expect
			.element(
				screen.getByRole('heading', {
					level: 3,
					name: 'Example headline'
				})
			)
			.toBeInTheDocument();

		await expect
			.element(screen.getByText('Example description'))
			.toBeInTheDocument();
	});
});