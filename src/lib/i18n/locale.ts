export const locales = ['en', 'de'] as const;
export type Locale = (typeof locales)[number];
export const languageStorageKey = 'bergjohann-language';

export function isLocale(value: unknown): value is Locale {
	return value === 'en' || value === 'de';
}

/** Only the user's first preferred language determines the default. */
export function detectLanguage(languages: readonly string[]): Locale {
	return /^de(?:-|$)/i.test(languages[0]?.trim() ?? '') ? 'de' : 'en';
}

/** Accept-Language is the server-side equivalent when JavaScript is unavailable. */
export function languageFromHeader(header: string | null): Locale {
	const preferences = (header ?? '')
		.split(',')
		.map((entry, index) => {
			const [tag, ...parameters] = entry.trim().split(';');
			const quality = parameters.find((part) => part.trim().startsWith('q='));
			const q = quality ? Number(quality.trim().slice(2)) : 1;
			return { tag, q, index };
		})
		.filter(({ tag, q }) => tag && Number.isFinite(q) && q > 0 && q <= 1)
		.sort((a, b) => b.q - a.q || a.index - b.index);
	return detectLanguage(preferences.map(({ tag }) => tag));
}

export function pathFor(locale: Locale, slug = ''): string {
	const path = slug.replace(/^\/+|\/+$/g, '');
	return '/' + locale + (path ? '/' + path : '');
}
