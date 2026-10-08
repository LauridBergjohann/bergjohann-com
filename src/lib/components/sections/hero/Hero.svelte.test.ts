import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import ThemeSwitch from '../../ui/ThemeSwitch.svelte';
import { themeMessages } from '../../ui/theme-test-messages';

import HeroImageSection from './Hero.svelte';

describe('HeroImageSection.svelte', () => {
	it('places the page title and introduction within the hero image', async () => {
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
		const imageBounds = image.getBoundingClientRect();
		const titleBounds = heading.element().getBoundingClientRect();
		expect(titleBounds.top).toBeGreaterThanOrEqual(imageBounds.top);
		expect(titleBounds.bottom).toBeLessThanOrEqual(imageBounds.bottom);
		expect(screen.container.querySelector('.hero-panel')).not.toBeNull();
	});
	let originalTheme: string | undefined;
	let originalPreference: string | null;

	beforeEach(() => {
		originalTheme = document.documentElement.dataset.theme;
		originalPreference = sessionStorage.getItem('bergjohann-theme');
	});

	afterEach(() => {
		if (originalTheme === undefined) {
			delete document.documentElement.dataset.theme;
		} else {
			document.documentElement.dataset.theme = originalTheme;
		}
		if (originalPreference === null) {
			sessionStorage.removeItem('bergjohann-theme');
		} else {
			sessionStorage.setItem('bergjohann-theme', originalPreference);
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
		sessionStorage.setItem(
			'bergjohann-theme',
			JSON.stringify({ theme: 'light', changedAt: 1, source: 'test' })
		);
		const switchScreen = await render(ThemeSwitch, { props: { messages: themeMessages } });
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
		await switchScreen.getByRole('button', { name: 'Dark' }).click();
		await expect.element(image).toHaveAttribute('src', '/dark.jpg');
		await switchScreen.getByRole('button', { name: 'Light' }).click();
		await expect.element(image).toHaveAttribute('src', '/light.jpg');
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

		expect(image.element().getBoundingClientRect().height).toBeGreaterThanOrEqual(512);
	});

	it('reserves a small hero area', async () => {
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

		expect(image.element().getBoundingClientRect().height).toBeGreaterThanOrEqual(384);
	});

	it('reserves a large hero area', async () => {
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

		expect(image.element().getBoundingClientRect().height).toBeGreaterThanOrEqual(672);
	});

	it('allows transparent artwork without a text panel', async () => {
		const screen = await render(HeroImageSection, {
			props: {
				section: {
					id: 'artwork',
					headline: 'Build things',
					textBackground: false,
					image: { src: '/artwork.png', alt: 'Abstract workshop', objectFit: 'contain' }
				}
			}
		});
		await expect.element(screen.getByRole('heading', { name: 'Build things' })).toBeVisible();
		expect(screen.container.querySelector('.hero-panel')).toBeNull();
		expect(getComputedStyle(screen.getByRole('img').element()).objectFit).toBe('contain');
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
