import { getPages } from './content';
import { mainNav } from './data/navigation';
import { getMessages } from './data/ui';
import { pathFor, type Locale } from '$lib/i18n/locale';
import type { SiteDto } from '$lib/api/site';
export function getSite(locale: Locale): SiteDto {
	const pages = getPages(locale);
	return {
		locale,
		messages: getMessages(locale),
		navigation: mainNav.flatMap((item) => {
			if (item.type !== 'page') return [];
			const page = pages.find((page) => page.id === item.pageId);
			return page ? [{ label: page.title, href: pathFor(locale, page.slug) }] : [];
		})
	};
}
