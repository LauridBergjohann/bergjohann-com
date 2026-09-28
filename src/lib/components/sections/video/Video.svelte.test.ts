import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';

import Video from './Video.svelte';

describe('Video.svelte', () => {
	it('renders a YouTube video as an iframe', async () => {
		const screen = await render(Video, {
			props: {
				section: {
					id: 'video-section',
					headline: 'Example video',
					video: {
						src: 'https://www.youtube.com/embed/example',
						provider: 'youtube'
					}
				}
			}
		});

		const iframe = screen.container.querySelector('iframe');

		expect(iframe).not.toBeNull();
		expect(iframe).toHaveAttribute(
			'src',
			'https://www.youtube.com/embed/example'
		);
		expect(iframe).toHaveAttribute('title', 'Example video');
		expect(iframe).toHaveAttribute('allowfullscreen');
	});

	it('renders an HTML5 video element', async () => {
		const screen = await render(Video, {
			props: {
				section: {
					id: 'video-section',
					video: {
						src: '/videos/example.mp4',
						provider: 'html5'
					}
				}
			}
		});

		const video = screen.container.querySelector('video');
		const source = screen.container.querySelector('video source');

		expect(video).not.toBeNull();
		expect(video).toHaveAttribute('controls');

		expect(source).not.toBeNull();
		expect(source).toHaveAttribute('src', '/videos/example.mp4');
	});

	it('renders the configured poster for HTML5 video', async () => {
		const screen = await render(Video, {
			props: {
				section: {
					id: 'video-section',
					video: {
						src: '/videos/example.mp4',
						poster: '/images/poster.jpg',
						provider: 'html5'
					}
				}
			}
		});

		const video = screen.container.querySelector('video');

		expect(video).not.toBeNull();
		expect(video).toHaveAttribute('poster', '/images/poster.jpg');
	});

	it('renders the optional headline', async () => {
		const screen = await render(Video, {
			props: {
				section: {
					id: 'video-section',
					headline: 'Example video',
					video: {
						src: '/videos/example.mp4',
						provider: 'html5'
					}
				}
			}
		});

		await expect
			.element(
				screen.getByRole('heading', {
					level: 3,
					name: 'Example video'
				})
			)
			.toBeInTheDocument();
	});

	it('renders the optional description', async () => {
		const screen = await render(Video, {
			props: {
				section: {
					id: 'video-section',
					description: 'Example description',
					video: {
						src: '/videos/example.mp4',
						provider: 'html5'
					}
				}
			}
		});

		await expect
			.element(screen.getByText('Example description'))
			.toBeInTheDocument();
	});

	it('does not render text content when headline and description are missing', async () => {
		const screen = await render(Video, {
			props: {
				section: {
					id: 'video-section',
					video: {
						src: '/videos/example.mp4',
						provider: 'html5'
					}
				}
			}
		});

		await expect
			.element(screen.getByRole('heading', { level: 3 }))
			.not.toBeInTheDocument();

		expect(screen.container.querySelector('p')).toBeNull();
	});

	it('positions the video on the left by default', async () => {
		const screen = await render(Video, {
			props: {
				section: {
					id: 'video-section',
					video: {
						src: '/videos/example.mp4',
						provider: 'html5'
					}
				}
			}
		});

		const video = screen.container.querySelector('video');
		const layout = video?.parentElement?.parentElement;

		expect(layout).not.toBeNull();
		expect(layout).toHaveClass('md:flex-row');
		expect(layout).not.toHaveClass('md:flex-row-reverse');
	});

	it('positions the video on the right when configured', async () => {
		const screen = await render(Video, {
			props: {
				section: {
					id: 'video-section',
					videoSide: 'right',
					video: {
						src: '/videos/example.mp4',
						provider: 'html5'
					}
				}
			}
		});

		const video = screen.container.querySelector('video');
		const layout = video?.parentElement?.parentElement;

		expect(layout).not.toBeNull();
		expect(layout).toHaveClass('md:flex-row-reverse');
		expect(layout).not.toHaveClass('md:flex-row');
	});

	it('renders headline and description together', async () => {
		const screen = await render(Video, {
			props: {
				section: {
					id: 'video-section',
					headline: 'Example video',
					description: 'Example description',
					video: {
						src: '/videos/example.mp4',
						provider: 'html5'
					}
				}
			}
		});

		await expect
			.element(
				screen.getByRole('heading', {
					level: 3,
					name: 'Example video'
				})
			)
			.toBeInTheDocument();

		await expect
			.element(screen.getByText('Example description'))
			.toBeInTheDocument();
	});

	it('renders only an iframe for YouTube sources', async () => {
		const screen = await render(Video, {
			props: {
				section: {
					id: 'video-section',
					headline: 'YouTube video',
					video: {
						src: 'https://www.youtube.com/embed/example',
						provider: 'youtube'
					}
				}
			}
		});

		expect(screen.container.querySelector('iframe')).not.toBeNull();
		expect(screen.container.querySelector('video')).toBeNull();
	});

	it('renders only a video element for HTML5 sources', async () => {
		const screen = await render(Video, {
			props: {
				section: {
					id: 'video-section',
					video: {
						src: '/videos/example.mp4',
						provider: 'html5'
					}
				}
			}
		});

		expect(screen.container.querySelector('video')).not.toBeNull();
		expect(screen.container.querySelector('iframe')).toBeNull();
	});
});