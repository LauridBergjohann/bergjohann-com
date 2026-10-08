import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import ThemeSwitch from '../../ui/ThemeSwitch.svelte';
import { themeMessages } from '../../ui/theme-test-messages';

import Image from './Image.svelte';

describe('Image.svelte', () => {
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
		const screen = await render(Image, {
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
		const screen = await render(Image, {
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
		const switchScreen = await render(ThemeSwitch, { props: { messages: themeMessages } });
		const screen = await render(Image, {
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

		await expect.element(screen.getByText('Example description')).toBeInTheDocument();
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

		await expect.element(screen.getByRole('heading', { level: 3 })).not.toBeInTheDocument();

		expect(screen.container.querySelector('.md\\:flex-1')).toBeNull();
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

		await expect.element(screen.getByText('Example description')).toBeInTheDocument();
	});
});
