import { error } from '@sveltejs/kit';
import { isLocale } from '$lib/i18n/locale';
export function apiLocale(url: URL) {
	const locale = url.searchParams.get('lang') ?? 'en';
	if (!isLocale(locale)) error(400, 'Unsupported language');
	return locale;
}
export function contentHeaders(locale: string) {
	return { 'content-language': locale, 'cache-control': 'public, max-age=300' };
}
