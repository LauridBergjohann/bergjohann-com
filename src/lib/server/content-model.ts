import type { ContentPage } from '$lib/api/content';
import type { Locale } from '$lib/i18n/locale';

/** Text may be shared or translated; structural enum values stay untranslated. */
type Translatable<T> = T extends string
	? string extends T
		? T | Record<Locale, string>
		: T
	: T extends (infer Item)[]
		? Translatable<Item>[]
		: T extends object
			? { [Key in keyof T]: Translatable<T[Key]> }
			: T;

/** One self-contained document per page, independent of its storage backend. */
export type PageDocument = Translatable<Omit<ContentPage, 'locale' | 'slug' | 'slugs'>> & {
	slugs: Record<Locale, string>;
};
