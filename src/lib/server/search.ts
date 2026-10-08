import { getPages } from './content';
import { pathFor, type Locale } from '$lib/i18n/locale';
import type { SearchResponse } from '$lib/api/search';
function normalize(text: string) {
	return text
		.toLowerCase()
		.normalize('NFKD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/\u00df/g, 'ss')
		.replace(/[^a-z0-9 ]/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();
}
function distance(a: string, b: string): number {
	let previous = Array.from({ length: b.length + 1 }, (_, index) => index);
	for (let i = 1; i <= a.length; i++) {
		const row = [i];
		for (let j = 1; j <= b.length; j++)
			row[j] = Math.min(
				row[j - 1] + 1,
				previous[j] + 1,
				previous[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
			);
		previous = row;
	}
	return previous[b.length];
}
/** Index visible content, excluding IDs, layout tokens and asset paths. */
function contentText(value: unknown, field = ''): string {
	if (Array.isArray(value)) return value.map((item) => contentText(item, field)).join(' ');
	if (value && typeof value === 'object')
		return Object.entries(value)
			.map(([key, item]) => contentText(item, key))
			.join(' ');
	return typeof value === 'string' &&
		[
			'title',
			'headline',
			'introduction',
			'text',
			'body',
			'paragraphs',
			'label',
			'description',
			'name',
			'lines',
			'email',
			'footer',
			'category'
		].includes(field)
		? value
		: '';
}
export function searchPages(locale: Locale, query: string): SearchResponse {
	const q = query.trim().slice(0, 200);
	const normalized = normalize(q);
	const pages = getPages(locale).filter((page) => page.id !== 'sections');
	const hits = normalized
		? pages
				.map((page) => {
					const title = normalize(page.title);
					const description = normalize(page.description);
					const body = normalize(
						contentText([page.hero, ...page.sections, ...(page.introBlocks ?? [])])
					);
					const score =
						title === normalized
							? 100
							: title.includes(normalized)
								? 80
								: description.includes(normalized)
									? 60
									: body.includes(normalized)
										? 30
										: 0;
					return {
						type: 'page' as const,
						id: page.id,
						label: page.title,
						href: pathFor(locale, page.slug),
						image: page.hero?.image.src ?? '/branding/logo-light.svg',
						score
					};
				})
				.filter((hit) => hit.score > 0)
				.sort((a, b) => b.score - a.score)
		: [];
	const suggestions =
		normalized.length >= 3 && !hits.length
			? pages
					.map((page) => ({
						title: page.title,
						distance: distance(normalized, normalize(page.title))
					}))
					.filter((item) => item.distance <= Math.max(2, Math.floor(normalized.length * 0.35)))
					.sort((a, b) => a.distance - b.distance)
					.slice(0, 3)
					.map((item) => item.title)
			: [];
	return {
		query: q,
		models: [],
		pages: hits,
		...(suggestions.length ? { didYouMean: suggestions } : {})
	};
}
