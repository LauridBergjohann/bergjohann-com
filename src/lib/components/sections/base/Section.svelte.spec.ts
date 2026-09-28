import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { createRawSnippet } from 'svelte';

import Section from './Section.svelte';

const children = createRawSnippet(() => ({
	render: () => '<span>Section content</span>'
}));

function getSection(container: HTMLElement) {
	const section = container.querySelector('#example-section');

	expect(section).not.toBeNull();

	return section as HTMLElement;
}

describe('Section.svelte', () => {
	it('labels a nested content section with its h3 and renders its introduction', async () => {
		const screen = await render(Section, {
			props: {
				section: {
					id: 'example-section',
					title: 'Hosting',
					headingLevel: 3,
					variant: 'content',
					layout: 'inherit',
					eyebrow: 'Details',
					introduction: 'Hosting information'
				},
				children
			}
		});
		await expect.element(screen.getByRole('region', { name: 'Hosting' })).toBeInTheDocument();
		await expect
			.element(screen.getByRole('heading', { level: 3, name: 'Hosting' }))
			.toHaveAttribute('id', 'example-section-title');
		await expect.element(screen.getByText('Details')).toBeVisible();
		await expect.element(screen.getByText('Hosting information')).toBeVisible();
		const wrapper = getSection(screen.container).firstElementChild;
		expect(wrapper).not.toHaveClass('px-5');
		expect(wrapper).not.toHaveClass('max-w-3xl');
	});

	it.each([
		['narrow', 'max-w-3xl'],
		['wide', 'max-w-6xl']
	] as const)('constrains the %s layout', async (layout, widthClass) => {
		const screen = await render(Section, {
			props: { section: { id: 'example-section', layout }, children }
		});
		expect(getSection(screen.container).firstElementChild).toHaveClass(widthClass);
	});

	it('renders feature sections with their introduction and full-width divider', async () => {
		const screen = await render(Section, {
			props: {
				section: {
					id: 'example-section',
					variant: 'feature',
					title: 'Projects',
					introduction: 'From my workbench',
					spacing: 'spacious',
					divider: 'top'
				},
				children
			}
		});
		await expect.element(screen.getByRole('region', { name: 'Projects' })).toBeInTheDocument();
		await expect.element(screen.getByText('From my workbench')).toBeVisible();
		expect(getSection(screen.container)).toHaveClass('border-t', 'py-16');
	});
	it('renders the section id and child content', async () => {
		const screen = await render(Section, {
			props: {
				section: {
					id: 'example-section'
				},
				children
			}
		});

		const section = getSection(screen.container);

		expect(section).toHaveAttribute('id', 'example-section');

		await expect.element(screen.getByText('Section content')).toBeInTheDocument();
	});

	it('renders the optional section title', async () => {
		const screen = await render(Section, {
			props: {
				section: {
					id: 'example-section',
					title: 'Example Section'
				},
				children
			}
		});

		await expect
			.element(
				screen.getByRole('heading', {
					level: 2,
					name: 'Example Section'
				})
			)
			.toBeInTheDocument();
	});

	it('does not render a heading when no title is provided', async () => {
		const screen = await render(Section, {
			props: {
				section: {
					id: 'example-section'
				},
				children
			}
		});

		await expect.element(screen.getByRole('heading', { level: 2 })).not.toBeInTheDocument();
	});

	it('uses the normal background by default', async () => {
		const screen = await render(Section, {
			props: {
				section: {
					id: 'example-section'
				},
				children
			}
		});

		const section = getSection(screen.container);

		expect(section).toHaveClass('bg-background');
	});

	it('applies the configured background style', async () => {
		const screen = await render(Section, {
			props: {
				section: {
					id: 'example-section',
					background: 'muted'
				},
				children
			}
		});

		const section = getSection(screen.container);

		expect(section).toHaveClass('bg-background-alt');
	});

	it('uses normal spacing by default', async () => {
		const screen = await render(Section, {
			props: {
				section: {
					id: 'example-section'
				},
				children
			}
		});

		const section = getSection(screen.container);

		expect(section).toHaveClass('py-2');
		expect(section).toHaveClass('md:py-3');
	});

	it('applies configured section spacing', async () => {
		const screen = await render(Section, {
			props: {
				section: {
					id: 'example-section',
					spacing: 'loose'
				},
				children
			}
		});

		const section = getSection(screen.container);

		expect(section).toHaveClass('py-4');
		expect(section).toHaveClass('md:py-5');
	});

	it('renders top and bottom dividers when divider is both', async () => {
		const screen = await render(Section, {
			props: {
				section: {
					id: 'example-section',
					divider: 'both'
				},
				children
			}
		});

		const dividers = screen.container.querySelectorAll('[aria-hidden="true"]');

		expect(dividers).toHaveLength(2);
	});

	it('renders only the top divider when configured', async () => {
		const screen = await render(Section, {
			props: {
				section: {
					id: 'example-section',
					divider: 'top'
				},
				children
			}
		});

		const dividers = screen.container.querySelectorAll('[aria-hidden="true"]');

		expect(dividers).toHaveLength(1);
		expect(dividers[0]).toHaveClass('mb-4');
	});

	it('renders only the bottom divider when configured', async () => {
		const screen = await render(Section, {
			props: {
				section: {
					id: 'example-section',
					divider: 'bottom'
				},
				children
			}
		});

		const dividers = screen.container.querySelectorAll('[aria-hidden="true"]');

		expect(dividers).toHaveLength(1);
		expect(dividers[0]).toHaveClass('mt-6');
	});

	it('suppresses title, spacing, and dividers in full-width layout', async () => {
		const screen = await render(Section, {
			props: {
				section: {
					id: 'example-section',
					title: 'Hidden Title',
					layout: 'full',
					spacing: 'loose',
					divider: 'both'
				},
				children
			}
		});

		const section = getSection(screen.container);

		expect(section).not.toHaveClass('py-4');
		expect(section).not.toHaveClass('md:py-5');

		await expect
			.element(
				screen.getByRole('heading', {
					level: 2,
					name: 'Hidden Title'
				})
			)
			.not.toBeInTheDocument();

		const dividers = screen.container.querySelectorAll('[aria-hidden="true"]');

		expect(dividers).toHaveLength(0);
	});

	it('removes horizontal content padding in full-width layout', async () => {
		const screen = await render(Section, {
			props: {
				section: {
					id: 'example-section',
					layout: 'full'
				},
				children
			}
		});

		const content = screen.getByText('Section content').element().parentElement?.parentElement;

		expect(content).not.toBeNull();
		expect(content).not.toHaveClass('px-5');
		expect(content).not.toHaveClass('sm:px-8');
	});

	it('adds horizontal content padding for non-full layouts', async () => {
		const screen = await render(Section, {
			props: {
				section: {
					id: 'example-section',
					layout: 'wide'
				},
				children
			}
		});

		const content = screen.getByText('Section content').element().parentElement?.parentElement;

		expect(content).not.toBeNull();
		expect(content).toHaveClass('px-5');
		expect(content).toHaveClass('sm:px-8');
	});
});
