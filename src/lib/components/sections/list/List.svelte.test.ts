import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';

import List from './List.svelte';

describe('List.svelte', () => {
	it('renders all configured cards', async () => {
		const screen = await render(List, {
			props: {
				section: {
					id: 'list-section',
					cards: [
						{
							id: 'card-1',
							href: '/projects/one',
							title: 'Project One'
						},
						{
							id: 'card-2',
							href: '/projects/two',
							title: 'Project Two'
						}
					]
				}
			}
		});

		await expect
			.element(screen.getByRole('heading', { level: 2, name: 'Project One' }))
			.toBeInTheDocument();

		await expect
			.element(screen.getByRole('heading', { level: 2, name: 'Project Two' }))
			.toBeInTheDocument();
	});

	it('renders an empty grid when no cards are configured', async () => {
		const screen = await render(List, {
			props: {
				section: {
					id: 'list-section',
					cards: []
				}
			}
		});

		expect(screen.container.querySelectorAll('a')).toHaveLength(0);
	});

	it('uses small cards by default', async () => {
		const screen = await render(List, {
			props: {
				section: {
					id: 'list-section',
					cards: [
						{
							id: 'card-1',
							href: '/projects/one',
							title: 'Project One'
						}
					]
				}
			}
		});

		const heading = screen.getByRole('heading', {
			level: 2,
			name: 'Project One'
		});

		await expect.element(heading).toHaveClass('text-sm');
		await expect.element(heading).toHaveClass('md:text-base');
	});

	it('passes medium card size to the cards', async () => {
		const screen = await render(List, {
			props: {
				section: {
					id: 'list-section',
					cardSize: 'md',
					cards: [
						{
							id: 'card-1',
							href: '/projects/one',
							title: 'Project One'
						}
					]
				}
			}
		});

		const heading = screen.getByRole('heading', {
			level: 2,
			name: 'Project One'
		});

		await expect.element(heading).toHaveClass('text-base');
		await expect.element(heading).toHaveClass('md:text-lg');
	});

	it('passes large card size to the cards', async () => {
		const screen = await render(List, {
			props: {
				section: {
					id: 'list-section',
					cardSize: 'lg',
					cards: [
						{
							id: 'card-1',
							href: '/projects/one',
							title: 'Project One'
						}
					]
				}
			}
		});

		const heading = screen.getByRole('heading', {
			level: 2,
			name: 'Project One'
		});

		await expect.element(heading).toHaveClass('text-lg');
		await expect.element(heading).toHaveClass('md:text-xl');
	});

	it('uses the small grid layout by default', async () => {
		const screen = await render(List, {
			props: {
				section: {
					id: 'list-section',
					cards: []
				}
			}
		});

		const grid = screen.container.querySelector('.grid');

		expect(grid).not.toBeNull();
		expect(grid).toHaveClass('grid-cols-2');
		expect(grid).toHaveClass('md:grid-cols-3');
		expect(grid).toHaveClass('lg:grid-cols-5');
		expect(grid).toHaveClass('xl:grid-cols-6');
	});

	it('uses the medium grid layout when configured', async () => {
		const screen = await render(List, {
			props: {
				section: {
					id: 'list-section',
					cardSize: 'md',
					cards: []
				}
			}
		});

		const grid = screen.container.querySelector('.grid');

		expect(grid).not.toBeNull();
		expect(grid).toHaveClass('grid-cols-2');
		expect(grid).toHaveClass('md:grid-cols-3');
		expect(grid).toHaveClass('lg:grid-cols-4');
		expect(grid).toHaveClass('xl:grid-cols-5');
	});

	it('uses the large grid layout when configured', async () => {
		const screen = await render(List, {
			props: {
				section: {
					id: 'list-section',
					cardSize: 'lg',
					cards: []
				}
			}
		});

		const grid = screen.container.querySelector('.grid');

		expect(grid).not.toBeNull();
		expect(grid).toHaveClass('grid-cols-2');
		expect(grid).toHaveClass('md:grid-cols-3');
		expect(grid).toHaveClass('lg:grid-cols-3');
		expect(grid).toHaveClass('xl:grid-cols-4');
	});

	it('renders card links with their configured destinations', async () => {
		const screen = await render(List, {
			props: {
				section: {
					id: 'list-section',
					cards: [
						{
							id: 'card-1',
							href: '/projects/one',
							title: 'Project One'
						},
						{
							id: 'card-2',
							href: 'https://example.com',
							title: 'External Project'
						}
					]
				}
			}
		});

		await expect
			.element(screen.getByRole('link', { name: 'Project One' }))
			.toHaveAttribute('href', '/projects/one');

		await expect
			.element(screen.getByRole('link', { name: 'External Project' }))
			.toHaveAttribute('href', 'https://example.com');
	});
});