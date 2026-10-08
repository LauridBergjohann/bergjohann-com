import { json } from '@sveltejs/kit';
import { getSite } from '$lib/server/site';
import { apiLocale, contentHeaders } from '$lib/server/api-locale';
import type { RequestHandler } from './$types';
export const GET: RequestHandler = ({ url }) => {
	const locale = apiLocale(url);
	return json(getSite(locale), { headers: contentHeaders(locale) });
};
