import type { Handle } from '@sveltejs/kit';
import { isLocale, languageFromHeader, pathFor } from '$lib/i18n/locale';
import { findPageBySlug } from '$lib/server/content';

export const handle: Handle = async ({ event, resolve }) => {
	const { pathname } = event.url;
	const first = pathname.split('/')[1];
	const localized = isLocale(first);
	const isDocument =
		!pathname.startsWith('/api/') &&
		pathname !== '/api' &&
		!pathname.startsWith('/_app/') &&
		!pathname.split('/').at(-1)?.includes('.');
	if (!localized && isDocument && ['GET', 'HEAD'].includes(event.request.method)) {
		const locale = languageFromHeader(event.request.headers.get('accept-language'));
		const slug = pathname.replace(/^\/+|\/+$/g, '');
		const knownPage = findPageBySlug(slug);
		const targetSlug =
			knownPage?.slugs[locale] ??
			(slug === 'search' || slug === 'suche' ? (locale === 'de' ? 'suche' : 'search') : slug);
		const target = new URL(event.url);
		target.pathname = pathFor(locale, targetSlug);
		target.searchParams.set('__language', 'auto');
		return new Response(null, {
			status: 307,
			headers: {
				location: target.pathname + target.search,
				vary: 'Accept-Language',
				'cache-control': 'private, no-store'
			}
		});
	}
	const locale = localized
		? first
		: languageFromHeader(event.request.headers.get('accept-language'));
	const response = await resolve(event, {
		transformPageChunk: ({ html }) => html.replace('%lang%', locale)
	});
	if (localized) {
		response.headers.set('content-language', locale);
		// Automatic negotiation is per-browser; explicit localized URLs remain stable.
		if (event.url.searchParams.get('__language') === 'auto')
			response.headers.set('cache-control', 'private, no-store');
	}
	return response;
};
