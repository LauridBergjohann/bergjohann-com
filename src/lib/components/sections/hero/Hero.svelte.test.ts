import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import ThemeSwitch from '../../ui/ThemeSwitch.svelte';

import HeroImageSection from './Hero.svelte';

describe('HeroImageSection.svelte', () => {
	it('renders a page title and introduction after the hero image', async () => {
		const screen = await render(HeroImageSection, {
			props: {
				headingLevel: 1,
				section: {
					id: 'hero',
					layout: 'full',
					headline: 'Blog',
					introduction: 'Work in progress.',
					image: { src: '/hero.jpg', alt: 'Workshop' }
				}
			}
		});
		const heading = screen.getByRole('heading', { level: 1, name: 'Blog' });
		await expect.element(heading).toBeInTheDocument();
		await expect.element(screen.getByText('Work in progress.')).toBeInTheDocument();
		const image = screen.getByRole('img', { name: 'Workshop' }).element();
		expect(
			image.compareDocumentPosition(heading.element()) & Node.DOCUMENT_POSITION_FOLLOWING
		).toBeTruthy();
	});
	let originalTheme: string | undefined;
	let originalPreference: string | null;

	beforeEach(() => {
		originalTheme = document.documentElement.dataset.theme;
		originalPreference = localStorage.getItem('bergjohann-theme');
	});

	afterEach(() => {
		if (originalTheme === undefined) {
			delete document.documentElement.dataset.theme;
		} else {
			document.documentElement.dataset.theme = originalTheme;
		}
		if (originalPreference === null) {
			localStorage.removeItem('bergjohann-theme');
		} else {
			localStorage.setItem('bergjohann-theme', originalPreference);
		}
	});

	it.each(['light', 'dark'])('uses the configured image in %s mode', async (theme) => {
		document.documentElement.dataset.theme = theme;
		const screen = await render(HeroImageSection, {
			props: {
				section: {
					id: 'themed-image',
					image: { src: '/light.jpg', srcDark: '/dark.jpg', alt: 'Themed image' }
				}
			}
		});

		const image = screen.getByRole('img', { name: 'Themed image' });
		await expect.element(image).toBeVisible();
		await expect.element(image).toHaveAttribute('src', `/${theme}.jpg`);
	});

	it('keeps the light image visible in dark mode when srcDark is omitted', async () => {
		document.documentElement.dataset.theme = 'dark';
		const screen = await render(HeroImageSection, {
			props: {
				section: {
					id: 'fallback-image',
					image: { src: '/light.jpg', alt: 'Fallback image' }
				}
			}
		});

		const image = screen.getByRole('img', { name: 'Fallback image' });
		await expect.element(image).toBeVisible();
		await expect.element(image).toHaveAttribute('src', '/light.jpg');
		expect(screen.container.querySelectorAll('img')).toHaveLength(1);
	});

	it('updates the visible image when ThemeSwitch changes the theme', async () => {
		localStorage.setItem('bergjohann-theme', 'light');
		const switchScreen = await render(ThemeSwitch);
		const screen = await render(HeroImageSection, {
			props: {
				section: {
					id: 'switchable-image',
					image: { src: '/light.jpg', srcDark: '/dark.jpg', alt: 'Switchable image' }
				}
			}
		});
		const image = screen.getByRole('img', { name: 'Switchable image' });

		await expect.element(image).toHaveAttribute('src', '/light.jpg');
		await switchScreen.getByRole('button', { name: 'Use dark theme' }).click();
		await expect.element(image).toHaveAttribute('src', '/dark.jpg');
		await switchScreen.getByRole('button', { name: 'Use light theme' }).click();
		await expect.element(image).toHaveAttribute('src', '/light.jpg');
		await switchScreen.getByRole('button', { name: 'Use system theme' }).click();
		const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
			? 'dark'
			: 'light';
		await expect.element(image).toHaveAttribute('src', `/${systemTheme}.jpg`);
	});

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

		await expect.element(image).toHaveAttribute('src', '/images/hero.jpg');
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

		await expect.element(screen.getByRole('heading', { level: 2 })).not.toBeInTheDocument();
	});
});
