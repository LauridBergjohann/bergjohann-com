<script lang="ts">
	import '../app.css';
	import Header from '$lib/components/header/Header.svelte';
	import Footer from '$lib/components/footer/Footer.svelte';
	import { page } from '$app/state';
	import type { LayoutProps } from './$types';
	let { children, data }: LayoutProps = $props();
	const slugs = $derived(page.data.slugs ?? { en: '', de: '' });
</script>

<Header
	currentPath={data.currentPath}
	navigation={data.navigation}
	locale={data.locale}
	messages={data.messages}
	{slugs}
/>
{@render children()}
<Footer messages={data.messages} />
