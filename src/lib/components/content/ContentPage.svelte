<script lang="ts">
	import { ContentPage as Page, Sections } from '@page-sections/svelte';
	import type { ContentPage } from '$lib/api/content';
	import { toPageSections } from '$lib/content/page-sections';
	import Hero from '$lib/components/sections/hero/Hero.svelte';
	import Container from '$lib/components/ui/Container.svelte';
	import Link from '$lib/components/helper/Link.svelte';
	import ContentBlocks from './ContentBlocks.svelte';
	import SiteSection from './SiteSection.svelte';
	import PageSectionsTheme from './PageSectionsTheme.svelte';
	let { page }: { page: ContentPage } = $props();
	const sections = $derived(toPageSections(page.sections, page.locale));
	const renderers = {
		topics: SiteSection,
		projects: SiteSection,
		about: SiteSection,
		prose: SiteSection
	};
</script>

<PageSectionsTheme>
	<Page
		{page}
		id={page.id}
		lang={page.locale}
		class="site-content-page"
		manageDocumentTitle={false}
		aria-labelledby={page.hero.id + '-headline'}
	>
		{#snippet header()}
			{#if page.actions?.length}
				<Hero headingLevel={1} section={page.hero}>
					<div class="flex flex-wrap items-center gap-6 text-sm font-semibold">
						{#each page.actions as action (action.href)}
							<Link
								href={action.href}
								data-button={action.primary ? '' : undefined}
								class={action.primary
									? 'rounded-lg bg-primary px-5 py-3 text-on-primary transition-colors hover:bg-primary-hover'
									: 'text-link underline-offset-4 hover:underline'}
							>
								{action.label} <span aria-hidden="true">→</span>
							</Link>
						{/each}
					</div>
				</Hero>
			{:else}
				<Hero headingLevel={1} section={page.hero} />
			{/if}
		{/snippet}
		{#if page.layout === 'legal'}
			<Container
				width="narrow"
				class="site-legal space-y-10 bg-section pt-8 pb-16 sm:pt-12 sm:pb-24"
			>
				<ContentBlocks blocks={page.introBlocks ?? []} />
				<Sections {sections} {renderers} />
			</Container>
		{:else}
			<ContentBlocks blocks={page.introBlocks ?? []} />
			<Sections {sections} {renderers} />
		{/if}
	</Page>
</PageSectionsTheme>
