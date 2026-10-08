<script lang="ts">
	import type { PathnameWithSearchOrHash } from '$app/types';
	import { SvelteURLSearchParams } from 'svelte/reactivity';
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { languageStorageKey, pathFor, type Locale } from '$lib/i18n/locale';
	import type { Messages } from '$lib/i18n/messages';
	let {
		locale,
		messages,
		slugs
	}: { locale: Locale; messages: Messages; slugs: Record<Locale, string> } = $props();
	const languages = ['en', 'de'] as const;
	const suffix = $derived.by(() => {
		const query = new SvelteURLSearchParams(page.url.search);
		query.delete('__language');
		return (query.size ? '?' + query.toString() : '') + page.url.hash;
	});
	function remember(language: Locale) {
		try {
			localStorage.setItem(languageStorageKey, language);
		} catch {
			/* Links also work when storage is unavailable. */
		}
	}
</script>

<div
	role="group"
	aria-label={messages.settings.language}
	class="inline-flex h-[42px] shrink-0 items-center divide-x divide-border-strong/70 rounded-lg border border-border-strong"
>
	{#each languages as language, index (language)}
		<a
			href={resolve((pathFor(language, slugs[language]) + suffix) as PathnameWithSearchOrHash)}
			hreflang={language}
			lang={language}
			data-sveltekit-reload
			aria-label={language === 'en' ? messages.settings.english : messages.settings.german}
			aria-current={locale === language ? 'page' : undefined}
			onclick={() => remember(language)}
			class={'inline-flex h-10 w-10 items-center justify-center text-sm transition-colors focus-visible:ring-2 focus-visible:ring-link focus-visible:outline-none ' +
				(index === 0 ? 'rounded-l-[7px]' : 'rounded-r-[7px]') +
				' ' +
				(locale === language
					? 'bg-selection text-foreground-soft'
					: 'text-foreground-soft hover:bg-background-alt hover:text-foreground')}>{language}</a
		>
	{/each}
</div>
