import type { Locale } from '$lib/i18n/locale';
import type { HeroSectionData, SectionData, SectionDefinition } from '@page-sections/core';

export type ContentBlock =
	| { type: 'paragraph'; text: string; variant?: 'default' | 'lead' | 'muted' }
	| { type: 'address'; name: string; lines: string[] }
	| { type: 'contact'; label: string; email: string };

export type SiteSection =
	| (SectionDefinition & {
			type: 'topics';
			items: { id: string; number: string; title: string; text: string }[];
	  })
	| (SectionDefinition & {
			type: 'projects';
			items: { id: string; category: string; title: string; text: string }[];
			footer: string;
	  })
	| (SectionDefinition & {
			type: 'about';
			paragraphs: string[];
			panel: { headline: string; text: string; href: string; label: string };
	  })
	| (SectionDefinition & { type: 'prose'; blocks: ContentBlock[] });

declare module '@page-sections/core' {
	interface SectionTypeMap {
		topics: Extract<SiteSection, { type: 'topics' }>;
		projects: Extract<SiteSection, { type: 'projects' }>;
		about: Extract<SiteSection, { type: 'about' }>;
		prose: Extract<SiteSection, { type: 'prose' }>;
	}
}
export type ContentSection = SectionData;

/** A response contains one language's text and only the alternative page slugs. */
export type ContentPage = {
	id: string;
	locale: Locale;
	slug: string;
	slugs: Record<Locale, string>;
	title: string;
	description: string;
	layout: 'landing' | 'legal' | 'simple' | 'demo';
	hero: HeroSectionData;
	introBlocks?: ContentBlock[];
	sections: ContentSection[];
};
