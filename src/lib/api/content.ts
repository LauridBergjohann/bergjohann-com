import type { Locale } from '$lib/i18n/locale';
import type {
	HeroImageSection,
	SectionBase,
	RichTextSectionTyped,
	ListSectionTyped,
	ImageSectionTyped,
	VideoSectionTyped
} from '$lib/components/sections/interface';

export type ContentBlock =
	| { type: 'paragraph'; text: string; variant?: 'default' | 'lead' | 'muted' }
	| { type: 'address'; name: string; lines: string[] }
	| { type: 'contact'; label: string; email: string };

export type ContentSection =
	| (SectionBase & {
			type: 'topics';
			items: { id: string; number: string; title: string; text: string }[];
	  })
	| (SectionBase & {
			type: 'projects';
			items: { id: string; category: string; title: string; text: string }[];
			footer: string;
	  })
	| (SectionBase & {
			type: 'about';
			paragraphs: string[];
			panel: { headline: string; text: string; href: string; label: string };
	  })
	| (SectionBase & { type: 'prose'; blocks: ContentBlock[] })
	| RichTextSectionTyped
	| ListSectionTyped
	| ImageSectionTyped
	| VideoSectionTyped;

/** A response contains one language's text and only the alternative page slugs. */
export type ContentPage = {
	id: string;
	locale: Locale;
	slug: string;
	slugs: Record<Locale, string>;
	title: string;
	description: string;
	layout: 'landing' | 'legal' | 'simple' | 'demo';
	hero: HeroImageSection;
	actions?: { href: string; label: string; primary?: boolean }[];
	introBlocks?: ContentBlock[];
	sections: ContentSection[];
};
