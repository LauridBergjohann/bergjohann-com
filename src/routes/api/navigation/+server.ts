import { error, json } from '@sveltejs/kit';
import { getSite } from '$lib/server/site';
import { apiLocale, contentHeaders } from '$lib/server/api-locale';
import type { RequestHandler } from './$types';
export const GET: RequestHandler = ({ url }) => {
	const locale = apiLocale(url);
	const navigation = getSite(locale).navigation;
	const root = url.searchParams.get('root');
	if (root && !navigation.some((item) => item.href === root))
		error(404, 'Navigation root not found');
	return json(root ? [] : navigation, { headers: contentHeaders(locale) });
};
