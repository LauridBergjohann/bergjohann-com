import type { Locale } from '$lib/i18n/locale';
import type { HeroSectionData, PageData, SectionData } from '@page-sections/core';
export type ContentSection = SectionData;
/** Public Page Sections models with the site's routing and SEO metadata. */
export type ContentPage = PageData & {
	id: string;
	locale: Locale;
	slug: string;
	slugs: Record<Locale, string>;
	description: string;
	hero: HeroSectionData;
};
