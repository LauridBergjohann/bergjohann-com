<script lang="ts">
	import { ContentPage as Page, HeroSection, Sections } from '@page-sections/svelte';
	import type { ContentPage } from '$lib/api/content';
	let { page }: { page: ContentPage } = $props();
</script>

<Page {page} id={page.id} lang={page.locale} class="site-content-page" manageDocumentTitle={false}>
	<HeroSection section={page.hero} />
	<Sections sections={page.sections} />
</Page>
