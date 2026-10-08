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
		slugs,
		labelled = false
	}: {
		locale: Locale;
		messages: Messages;
		slugs: Record<Locale, string>;
		labelled?: boolean;
	} = $props();
	let dismissed = $state(false);
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
		{@const description =
			language === locale
				? language === 'en'
					? messages.settings.englishSelected
					: messages.settings.germanSelected
				: language === 'en'
					? messages.settings.english
					: messages.settings.german}
		<div class="group relative">
			<a
				href={resolve((pathFor(language, slugs[language]) + suffix) as PathnameWithSearchOrHash)}
				hreflang={language}
				lang={language}
				data-sveltekit-reload
				data-button
				aria-label={description}
				aria-current={locale === language ? 'page' : undefined}
				onclick={() => remember(language)}
				onmouseenter={() => (dismissed = false)}
				onfocus={() => (dismissed = false)}
				onkeydown={(event) => {
					if (event.key === 'Escape') dismissed = true;
				}}
				class={'inline-flex h-10 items-center justify-center text-sm transition-colors focus-visible:ring-2 focus-visible:ring-link focus-visible:outline-none ' +
					(labelled ? 'px-2 ' : 'w-10 ') +
					(index === 0 ? 'rounded-l-[7px]' : 'rounded-r-[7px]') +
					' ' +
					(locale === language
						? 'bg-selection text-foreground-soft'
						: 'text-foreground-soft hover:bg-background-alt hover:text-foreground')}
				>{labelled ? messages.settings.names[language] : language}</a
			>
			{#if !labelled && !dismissed}
				<span
					aria-hidden="true"
					class="pointer-events-none absolute top-full left-0 z-50 pt-2 opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:pointer-events-auto group-hover:opacity-100"
				>
					<span
						class="block rounded-lg border border-border bg-surface-raised px-3 py-2 text-xs whitespace-nowrap text-foreground shadow-md"
						>{description}</span
					>
				</span>
			{/if}
		</div>
	{/each}
</div>
