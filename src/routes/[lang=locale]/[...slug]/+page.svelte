<script lang="ts">
	import ContentPage from '$lib/components/content/ContentPage.svelte';
	import Container from '$lib/components/ui/Container.svelte';
	import HeaderSpacer from '$lib/components/header/HeaderSpacer.svelte';
	import Link from '$lib/components/helper/Link.svelte';
	import { pathFor } from '$lib/i18n/locale';
	import type { PageProps } from './$types';
	let { data }: PageProps = $props();
	const origin = 'https://bergjohann.com';
</script>

<svelte:head>
	<title>{data.title}</title>
	<meta name="description" content={data.description} />
	<link rel="canonical" href={origin + data.canonical} />
	<link rel="alternate" hreflang="en" href={origin + pathFor('en', data.slugs.en)} />
	<link rel="alternate" hreflang="de" href={origin + pathFor('de', data.slugs.de)} />
	<link rel="alternate" hreflang="x-default" href={origin + pathFor('en', data.slugs.en)} />
	<meta property="og:title" content={data.title} />
	<meta property="og:description" content={data.description} />
	<meta property="og:url" content={origin + data.canonical} />
	<meta property="og:locale" content={data.locale === 'de' ? 'de_DE' : 'en_GB'} />
	<meta property="og:locale:alternate" content={data.locale === 'de' ? 'en_GB' : 'de_DE'} />
	{#if data.search}<meta name="robots" content="noindex, follow" />{/if}
</svelte:head>
{#if data.content}
	<ContentPage page={data.content} />
{:else if data.search}
	<HeaderSpacer />
	<main>
		<Container width="narrow" class="min-h-[60vh] py-12 sm:py-20">
			<h1 class="text-4xl font-semibold tracking-tight">{data.messages.search.heading}</h1>
			<!-- Native GET also works without JavaScript. -->
			<form action={data.messages.links.search} method="GET" class="mt-8 flex gap-3">
				<input
					name="q"
					aria-label={data.messages.search.label}
					value={data.search.query}
					class="min-w-0 flex-1 rounded-lg border border-border-strong bg-surface px-4 py-3"
				/>
				<button
					type="submit"
					class="rounded-lg bg-primary px-5 py-3 text-on-primary hover:bg-primary-hover"
					>{data.messages.search.submit}</button
				>
			</form>
			{#if !data.search.query}
				<p class="mt-8 text-muted">{data.messages.search.emptyQuery}</p>
			{:else}
				<p class="mt-8 text-muted">{data.messages.search.resultsFor} “{data.search.query}”</p>
				{#if data.search.pages.length}
					<ul class="mt-6 divide-y divide-border">
						{#each data.search.pages as hit (hit.id)}
							<li class="py-5">
								<Link href={hit.href} class="text-xl text-link underline-offset-4 hover:underline"
									>{hit.label}</Link
								>
							</li>
						{/each}
					</ul>
				{:else}
					<p class="mt-6">{data.messages.search.noResults}</p>
					{#if data.search.didYouMean?.length}
						<p class="mt-6">{data.messages.search.didYouMean}</p>
						<ul class="mt-2 flex flex-wrap gap-4">
							{#each data.search.didYouMean as suggestion (suggestion)}
								<li>
									<Link
										href={data.messages.links.search + '?q=' + encodeURIComponent(suggestion)}
										class="text-link underline">{suggestion}</Link
									>
								</li>
							{/each}
						</ul>
					{/if}
				{/if}
			{/if}
		</Container>
	</main>
{/if}
