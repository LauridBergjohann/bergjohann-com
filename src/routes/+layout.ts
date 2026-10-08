import type { LayoutLoad } from './$types';
import { isLocale } from '$lib/i18n/locale';
import type { SiteDto } from '$lib/api/site';
export type { NavigationEntry } from '$lib/api/navigation-api';
export const load: LayoutLoad = async ({ params, url, fetch }) => {
	const locale = isLocale(params.lang) ? params.lang : 'en';
	const response = await fetch('/api/site?lang=' + locale);
	if (!response.ok) throw new Error('Site content could not be loaded');
	const site: SiteDto = await response.json();
	return { ...site, currentPath: url.pathname };
};
