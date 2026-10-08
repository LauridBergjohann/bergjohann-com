import { json } from '@sveltejs/kit';
import { searchPages } from '$lib/server/search';
import { apiLocale, contentHeaders } from '$lib/server/api-locale';
import type { RequestHandler } from './$types';
export const GET: RequestHandler = ({ url }) => {
	const locale = apiLocale(url);
	return json(searchPages(locale, url.searchParams.get('q') ?? ''), {
		headers: contentHeaders(locale)
	});
};
