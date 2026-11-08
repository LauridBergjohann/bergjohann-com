import type { ContentPage } from '$lib/api/content';
import type { PageDocument } from './content-model';
import { pageDocuments as sources } from './page-store';
import { pathFor, type Locale } from '$lib/i18n/locale';

function localized(value: unknown, locale: Locale, key?: string): unknown {
	if (Array.isArray(value)) return value.map((item) => localized(item, locale));
	if (value && typeof value === 'object') {
		const record = value as Record<string, unknown>;
		if (typeof record.en === 'string' && typeof record.de === 'string') return record[locale];
		return Object.fromEntries(
			Object.entries(record).map(([name, item]) => [name, localized(item, locale, name)])
		);
	}
	if (key === 'href' && typeof value === 'string' && value.startsWith('/')) {
		const target = sources.find((source) => `/${source.slugs.en}` === value);
		if (target) return pathFor(locale, target.slugs[locale]);
	}
	return value;
}

function localizePage(source: PageDocument, locale: Locale): ContentPage {
	const { slugs, ...content } = source;
	return {
		...(localized(content, locale) as Omit<ContentPage, 'locale' | 'slug' | 'slugs'>),
		locale,
		slug: slugs[locale],
		slugs: { ...slugs }
	};
}

export function getPages(locale: Locale): ContentPage[] {
	return sources.map((source) => localizePage(source, locale));
}

export function getPage(locale: Locale, slug: string): ContentPage | undefined {
	const source = sources.find((page) => page.slugs[locale] === slug);
	return source ? localizePage(source, locale) : undefined;
}

export function findPageBySlug(slug: string): ContentPage | undefined {
	const source = sources.find((page) => page.slugs.en === slug || page.slugs.de === slug);
	return source ? localizePage(source, 'en') : undefined;
}
