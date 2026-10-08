import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { models } from '$lib/server/data/models';
import { getPages } from '$lib/server/content';
import { mainNav } from '$lib/server/data/navigation';
import { apiLocale, contentHeaders } from '$lib/server/api-locale';
import { pathFor } from '$lib/i18n/locale';
import type { NavigationItem } from '$lib/server/navigation';

function modelParents(
	items: NavigationItem[],
	id: string,
	parents: string[] = []
): string[] | undefined {
	for (const item of items) {
		if (item.type === 'model') {
			if (item.modelId === id) return parents;
		} else if (item.children) {
			const found = modelParents(item.children, id, [...parents, item.pageId]);
			if (found) return found;
		}
	}
}
export const GET: RequestHandler = ({ params, url }) => {
	const locale = apiLocale(url);
	const model = models.find((model) => model.id === params.id);
	if (url.searchParams.has('exists'))
		return json(
			{ exists: !!model },
			{ status: model ? 200 : 404, headers: contentHeaders(locale) }
		);
	if (!model) error(404, locale === 'de' ? 'Modell nicht gefunden' : 'Model not found');
	const pages = getPages(locale);
	const parents = modelParents(mainNav, model.id) ?? [];
	const breadcrumb = parents.flatMap((id) => {
		const page = pages.find((page) => page.id === id);
		return page ? [{ label: page.title, href: pathFor(locale, page.slug) }] : [];
	});
	return json(
		{ ...model, breadcrumb: [...breadcrumb, { label: model.name }] },
		{ headers: contentHeaders(locale) }
	);
};
