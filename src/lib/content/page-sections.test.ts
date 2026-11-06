import { describe, expect, it } from 'vitest';
import { getPages } from '$lib/server/content';
import { toPageSection, toPageSections } from './page-sections';

describe('published Page Sections adapter', () => {
	it('adapts every localized page without mutating the API response or losing section identities', () => {
		for (const locale of ['en', 'de'] as const) {
			for (const page of getPages(locale)) {
				const snapshot = JSON.stringify(page);
				const sections = toPageSections(page.sections, locale);
				expect(sections.map((section) => section.id)).toEqual(
					page.sections.map((section) => section.id)
				);
				expect(
					sections.every(
						(section) => typeof section.title === 'string' && typeof section.background === 'object'
					)
				).toBe(true);
				expect(JSON.stringify(page)).toBe(snapshot);
			}
		}
	});

	it('preserves localized card links and cover/contain choices', () => {
		const page = getPages('de').find((page) => page.id === 'sections')!;
		const list = toPageSections(page.sections, 'de').find((section) => section.type === 'cardGrid');
		expect(list?.type).toBe('cardGrid');
		if (list?.type !== 'cardGrid') throw new Error('Missing card grid');
		expect(list.list.map((card) => card.href)).toEqual(['/de/projekte', '/de/werkbank']);
		expect(list.list.map((card) => card.image?.objectFit)).toEqual(['cover', 'contain']);
		expect(list.cardSize).toBe('m');
	});

	it('keeps legal blocks structured and separates visible headings from navigation labels', () => {
		const legal = getPages('de').find((page) => page.id === 'imprint')!;
		const section = toPageSection(legal.sections[0], 'de');
		expect(section.type).toBe('prose');
		expect(section.headline).toBe('Kontakt');
		expect(section.layout).toBe('inherit');
		expect(section.background).toEqual({ color: 'transparent', size: 'full' });
		if (section.type === 'prose' && legal.sections[0].type === 'prose') {
			expect(section.blocks).toEqual(legal.sections[0].blocks);
		}
		expect(toPageSection({ id: 'text', type: 'richText', body: 'Text' }, 'de')).toMatchObject({
			title: 'Text',
			headline: undefined,
			body: 'Text'
		});
	});

	it('retains theme-aware media and their visible headline', () => {
		const section = toPageSection(
			{
				id: 'image',
				type: 'image',
				headline: 'A river',
				image: {
					src: '/light.png',
					srcDark: '/dark.png',
					alt: 'River',
					objectFit: 'contain',
					aspect: '16/9'
				}
			},
			'en'
		);
		expect(section).toMatchObject({
			title: 'A river',
			headline: 'A river',
			image: {
				src: '/light.png',
				srcDark: '/dark.png',
				alt: 'River',
				objectFit: 'contain',
				aspect: '16/9'
			}
		});
	});
});
