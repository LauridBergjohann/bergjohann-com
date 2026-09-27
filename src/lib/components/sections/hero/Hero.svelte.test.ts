import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';

import HeroImageSection from './Hero.svelte';

describe('HeroImageSection.svelte', () => {
	it('renders the hero image', async () => {
		const screen = await render(HeroImageSection, {
			props: {
				section: {
					id: 'hero',
					image: {
						src: '/images/hero.jpg',
						alt: 'Mountain landscape'
					}
				}
			}
		});

		const image = screen.getByRole('img', {
			name: 'Mountain landscape'
		});

		await expect.element(image).toHaveAttribute(
			'src',
			'/images/hero.jpg'
		);
	});

	it('uses medium size by default', async () => {
		const screen = await render(HeroImageSection, {
			props: {
				section: {
					id: 'hero',
					image: {
						src: '/images/hero.jpg',
						alt: 'Hero'
					}
				}
			}
		});

		const image = screen.getByRole('img', { name: 'Hero' });

		await expect.element(image).toHaveClass('h-64');
		await expect.element(image).toHaveClass('md:h-80');
		await expect.element(image).toHaveClass('lg:h-[480px]');
	});

	it('applies small size classes', async () => {
		const screen = await render(HeroImageSection, {
			props: {
				section: {
					id: 'hero',
					size: 'sm',
					image: {
						src: '/images/hero.jpg',
						alt: 'Hero'
					}
				}
			}
		});

		const image = screen.getByRole('img', { name: 'Hero' });

		await expect.element(image).toHaveClass('h-32');
		await expect.element(image).toHaveClass('md:h-48');
		await expect.element(image).toHaveClass('lg:h-64');
	});

	it('applies large size classes', async () => {
		const screen = await render(HeroImageSection, {
			props: {
				section: {
					id: 'hero',
					size: 'lg',
					image: {
						src: '/images/hero.jpg',
						alt: 'Hero'
					}
				}
			}
		});

		const image = screen.getByRole('img', { name: 'Hero' });

		await expect.element(image).toHaveClass('h-72');
		await expect.element(image).toHaveClass('md:h-[520px]');
		await expect.element(image).toHaveClass('lg:h-[620px]');
	});

	it('renders the optional headline', async () => {
		const screen = await render(HeroImageSection, {
			props: {
				section: {
					id: 'hero',
					headline: 'Welcome',
					image: {
						src: '/images/hero.jpg',
						alt: 'Hero'
					}
				}
			}
		});

		await expect
			.element(
				screen.getByRole('heading', {
					level: 2,
					name: 'Welcome'
				})
			)
			.toBeInTheDocument();
	});

	it('does not render a headline when none is configured', async () => {
		const screen = await render(HeroImageSection, {
			props: {
				section: {
					id: 'hero',
					image: {
						src: '/images/hero.jpg',
						alt: 'Hero'
					}
				}
			}
		});

		await expect
			.element(screen.getByRole('heading', { level: 2 }))
			.not.toBeInTheDocument();
	});

	it('aligns the headline to the right by default', async () => {
		const screen = await render(HeroImageSection, {
			props: {
				section: {
					id: 'hero',
					headline: 'Welcome',
					image: {
						src: '/images/hero.jpg',
						alt: 'Hero'
					}
				}
			}
		});

		const heading = screen.getByRole('heading', {
			level: 2,
			name: 'Welcome'
		});

		const overlay = heading.element().parentElement?.parentElement?.parentElement;

		expect(overlay).toHaveClass('justify-end');
	});

	it('aligns the headline to the left', async () => {
		const screen = await render(HeroImageSection, {
			props: {
				section: {
					id: 'hero',
					headline: 'Welcome',
					headlineAlign: 'left',
					image: {
						src: '/images/hero.jpg',
						alt: 'Hero'
					}
				}
			}
		});

		const heading = screen.getByRole('heading', {
			level: 2,
			name: 'Welcome'
		});

		const overlay = heading.element().parentElement?.parentElement?.parentElement;

		expect(overlay).toHaveClass('justify-start');
	});

	it('aligns the headline to the center', async () => {
		const screen = await render(HeroImageSection, {
			props: {
				section: {
					id: 'hero',
					headline: 'Welcome',
					headlineAlign: 'center',
					image: {
						src: '/images/hero.jpg',
						alt: 'Hero'
					}
				}
			}
		});

		const heading = screen.getByRole('heading', {
			level: 2,
			name: 'Welcome'
		});

		const overlay = heading.element().parentElement?.parentElement?.parentElement;

		expect(overlay).toHaveClass('justify-center');
	});
});