<script lang="ts">
	import { ContentPage as Page, Sections } from '@page-sections/svelte';
	import type { ContentPage } from '$lib/api/content';
	let { page }: { page: ContentPage } = $props();
</script>

<Page {page} id={page.id} lang={page.locale} class="site-content-page" manageDocumentTitle={false}>
	<Sections sections={page.sections} />
</Page>
