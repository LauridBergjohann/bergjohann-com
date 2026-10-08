import { error, json } from '@sveltejs/kit';
import { getPage } from '$lib/server/content';
import { apiLocale, contentHeaders } from '$lib/server/api-locale';
import type { RequestHandler } from './$types';
export const GET: RequestHandler = ({ params, url }) => {
	const locale = apiLocale(url);
	const page = getPage(locale, params.slug ?? '');
	if (!page) error(404, locale === 'de' ? 'Seite nicht gefunden' : 'Page not found');
	return json(page, { headers: contentHeaders(locale) });
};
