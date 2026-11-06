import { describe, expect, it } from 'vitest';
import { getPages, getPage } from '$lib/server/content';
import { getSite } from '$lib/server/site';

describe('Page Sections content contract', () => {
	it('serves package models directly with unique identities and a single page heading', () => {
		for (const locale of ['en', 'de'] as const)
			for (const page of getPages(locale)) {
				expect(page.hero.type).toBe('hero');
				expect(page.hero.headingLevel).toBe(1);
				const sections = [page.hero, ...page.sections];
				expect(new Set(sections.map((section) => section.id)).size).toBe(sections.length);
				for (const section of sections) {
					expect(section.title.trim()).not.toBe('');
					if (section.background) expect(typeof section.background).toBe('object');
				}
				expect(page.sections.every((section) => section.headingLevel !== 1)).toBe(true);
			}
	});
	it('preserves localized hero actions and card images in the package model', () => {
		expect(getPage('de', '')?.hero.actions?.map((action) => action.href)).toEqual([
			'/de/projekte',
			'/de/ueber-mich'
		]);
		const cards = getPage('de', 'sektionen')!.sections.find(
			(section) => section.type === 'cardGrid'
		);
		if (cards?.type !== 'cardGrid') throw new Error('Missing card grid');
		expect(cards.list.map((card) => card.href)).toEqual(['/de/projekte', '/de/werkbank']);
		expect(cards.list.map((card) => card.image?.objectFit)).toEqual(['cover', 'contain']);
	});
	it('keeps navigation labels distinct from visible headlines and legal text structured', () => {
		const section = getPage('en', '')!.sections[0];
		expect(section.title).toBe('Topics');
		expect(section.headline).toBe('What I’m exploring.');
		const legal = getPage('en', 'privacy')!.sections[0];
		expect(legal.type).toBe('prose');
		if (legal.type !== 'prose') throw new Error('Missing legal blocks');
		expect(legal.blocks.some((block) => block.type === 'address')).toBe(true);
	});
	it('serves menu items with stable ids and localized destinations', () => {
		const english = getSite('en').navigation;
		const german = getSite('de').navigation;
		expect(english.map((item) => item.id)).toEqual(german.map((item) => item.id));
		expect(new Set(english.map((item) => item.id)).size).toBe(english.length);
		expect(german.every((item) => item.href?.startsWith('/de/'))).toBe(true);
	});
});
