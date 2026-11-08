import type { SectionData } from '@page-sections/core';
import { describe, expect, it } from 'vitest';
import { getPages, getPage } from '$lib/server/content';
import { getSite } from '$lib/server/site';
import { searchPages } from '$lib/server/search';

function allSections(sections: SectionData[]): SectionData[] {
	return sections.flatMap((section) => [
		section,
		...(section.type === 'grid'
			? section.blocks.flatMap((block) => allSections(block.sections))
			: [])
	]);
}

describe('Page Sections content contract', () => {
	it('indexes editorial cards, nested text and structured contact details in both languages', () => {
		for (const locale of ['en', 'de'] as const) {
			for (const query of [
				'THREE.JS',
				'SvelteKit',
				locale === 'en' ? 'conversations' : 'Gespräche'
			])
				expect(searchPages(locale, query).pages.map((page) => page.id)).toContain('home');
			expect(searchPages(locale, 'info@bergjohann.com').pages.map((page) => page.id)).toEqual(
				expect.arrayContaining(['privacy', 'imprint'])
			);
		}
	});
	it('serves package models directly with unique identities and a single page heading', () => {
		for (const locale of ['en', 'de'] as const)
			for (const page of getPages(locale)) {
				expect(page.hero.type).toBe('hero');
				expect(page.hero.headingLevel).toBe(1);
				const sections = allSections([page.hero, ...page.sections]);
				expect(new Set(sections.map((section) => section.id)).size).toBe(sections.length);
				for (const section of sections) {
					expect(section.title.trim()).not.toBe('');
					expect(['hero', 'richText', 'panel', 'grid', 'cardGrid', 'image', 'video']).toContain(
						section.type
					);
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
		expect(cards.cardVariant).toBe('editorial');
		expect(cards.mediaAspect).toBe('3/2');
		expect(cards.mediaFit).toBe('contain');
	});
	it('keeps navigation labels distinct from visible headlines and legal text structured', () => {
		const section = getPage('en', '')!.sections[0];
		expect(section.title).toBe('Topics');
		expect(section.headline).toBe('What I’m exploring.');
		const legal = getPage('en', 'privacy')!.sections[0];
		expect(legal.type).toBe('richText');
		if (legal.type !== 'richText') throw new Error('Missing legal blocks');
		expect(legal.blocks?.some((block) => block.type === 'address')).toBe(true);
	});
	it('serves menu items with stable ids and localized destinations', () => {
		const english = getSite('en').navigation;
		const german = getSite('de').navigation;
		expect(english.map((item) => item.id)).toEqual(german.map((item) => item.id));
		expect(new Set(english.map((item) => item.id)).size).toBe(english.length);
		expect(german.every((item) => item.href?.startsWith('/de/'))).toBe(true);
	});
});
