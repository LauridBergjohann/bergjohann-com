import type { SectionData, SectionDefinition } from '@page-sections/core';
import type { ContentSection } from '$lib/api/content';
import type { Locale } from '$lib/i18n/locale';

type SiteType = 'topics' | 'projects' | 'about' | 'prose';
type SiteSectionOf<T extends SiteType> = Omit<
	Extract<ContentSection, { type: T }>,
	keyof SectionDefinition
> &
	SectionDefinition;
export type SiteSection = { [T in SiteType]: SiteSectionOf<T> }[SiteType];

declare module '@page-sections/core' {
	interface SectionTypeMap {
		topics: SiteSectionOf<'topics'>;
		projects: SiteSectionOf<'projects'>;
		about: SiteSectionOf<'about'>;
		prose: SiteSectionOf<'prose'>;
	}
}

const sizes = { sm: 's', md: 'm', lg: 'l' } as const;
const labels = {
	en: { richText: 'Text', list: 'Cards', image: 'Image', video: 'Video' },
	de: { richText: 'Text', list: 'Karten', image: 'Bild', video: 'Video' }
};

/** Keep the localized API contract stable while adapting it to the published package. */
export function toPageSection(section: ContentSection, locale: Locale): SectionData {
	const headline = section.title ?? ('headline' in section ? section.headline : undefined);
	const base = {
		id: section.id,
		title:
			headline ??
			(section.type in labels[locale]
				? labels[locale][section.type as keyof typeof labels.en]
				: section.id),
		headline: section.layout === 'full' ? undefined : headline,
		eyebrow: section.eyebrow,
		introduction: section.introduction,
		headingLevel: section.headingLevel,
		layout: section.layout ?? 'wide',
		spacing: section.layout === 'full' ? 'none' : section.spacing,
		divider: section.layout === 'full' ? 'none' : section.divider,
		variant: section.variant,
		background: {
			color:
				section.background === 'muted'
					? 'muted'
					: section.background === 'transparent'
						? 'transparent'
						: 'standard',
			size: 'full'
		}
	} satisfies SectionDefinition;
	if (section.type === 'list') {
		return {
			...base,
			type: 'cardGrid',
			cardSize: sizes[section.cardSize ?? 'md'],
			list: section.cards.map((card) => ({
				id: card.id,
				title: card.title,
				subtitle: card.subtitle,
				href: card.href,
				image: card.image
					? { src: card.image, alt: '', objectFit: card.imageCover ? 'cover' : 'contain' }
					: undefined
			}))
		};
	}
	return { ...section, ...base };
}

export function toPageSections(sections: ContentSection[], locale: Locale): SectionData[] {
	return sections.map((section) => toPageSection(section, locale));
}
