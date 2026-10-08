import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import type { ContentPage } from '$lib/api/content';
import type { SearchResponse } from '$lib/api/search';
import { pathFor } from '$lib/i18n/locale';
export const load: PageLoad = async ({ params, url, fetch, parent }) => {
	const { locale, messages } = await parent();
	const slug = params.slug ?? '';
	const searchSlug = locale === 'de' ? 'suche' : 'search';
	if (slug === searchSlug) {
		const response = await fetch(
			'/api/search?lang=' + locale + '&q=' + encodeURIComponent(url.searchParams.get('q') ?? '')
		);
		if (!response.ok) error(502, messages.search.error);
		const search: SearchResponse = await response.json();
		return {
			content: null,
			search,
			slugs: { en: 'search', de: 'suche' },
			title: messages.search.heading,
			description: messages.search.hint,
			canonical: pathFor(locale, searchSlug)
		};
	}
	const response = await fetch(
		'/api/pages' +
			(slug ? '/' + slug.split('/').map(encodeURIComponent).join('/') : '') +
			'?lang=' +
			locale
	);
	if (!response.ok)
		error(
			response.status === 404 ? 404 : 502,
			response.status === 404 ? messages.error.notFound : messages.error.failed
		);
	const content: ContentPage = await response.json();
	return {
		content,
		search: null,
		slugs: content.slugs,
		title: content.title,
		description: content.description,
		canonical: pathFor(locale, content.slug)
	};
};
