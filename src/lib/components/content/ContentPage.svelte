<script lang="ts">
	import { ContentPage as Page, HeroSection, Sections } from '@page-sections/svelte';
	import type { ContentPage } from '$lib/api/content';
	import Container from '$lib/components/ui/Container.svelte';
	import ContentBlocks from './ContentBlocks.svelte';
	import SiteSection from './SiteSection.svelte';
	let { page }: { page: ContentPage } = $props();
	const renderers = {
		topics: SiteSection,
		projects: SiteSection,
		about: SiteSection,
		prose: SiteSection
	};
</script>

<Page
	{page}
	id={page.id}
	lang={page.locale}
	class="site-content-page"
	manageDocumentTitle={false}
	aria-labelledby={page.hero.id + '-title'}
>
	{#snippet header()}
		<div class="site-hero" data-artwork={page.hero.image?.objectFit === 'contain'}>
			<HeroSection section={page.hero} />
		</div>
	{/snippet}
	{#if page.layout === 'legal'}
		<Container width="narrow" class="site-legal space-y-10 bg-section pt-8 pb-16 sm:pt-12 sm:pb-24">
			<ContentBlocks blocks={page.introBlocks ?? []} />
			<Sections sections={page.sections} {renderers} />
		</Container>
	{:else}
		<ContentBlocks blocks={page.introBlocks ?? []} />
		<Sections sections={page.sections} {renderers} />
	{/if}
</Page>
