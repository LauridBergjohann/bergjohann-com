<script lang="ts">
	import HeaderSpacer from '$lib/components/header/HeaderSpacer.svelte';
	import type { PageDto } from '$lib/api/page-api.js';
	import type { NavigationEntry } from '$lib/api/navigation-api';
	import type {
		HeroImageSection,
		RichTextSection,
		ImageSection,
		VideoSection
	} from '$lib/components/sections/interface';
	import Hero from '$lib/components/sections/hero/Hero.svelte';
	import RichText from '$lib/components/sections/text/Richtext.svelte';
	import Image from '$lib/components/sections/image/Image.svelte';
	import Video from '$lib/components/sections/video/Video.svelte';

	const { data } = $props<{ data: { page: PageDto; navigation: NavigationEntry[] } }>();

	// reaktiv aus data ableiten
	const page = $derived.by(() => data.page);
</script>

<svelte:head>
	<title>{page.title}</title>
</svelte:head>

{#if page.sections[0]?.type !== 'heroImage'}
	<HeaderSpacer />
{/if}

{#each page.sections as section, index (section)}
	{#if section.type === 'heroImage'}
		<Hero section={section as HeroImageSection} headingLevel={index === 0 ? 1 : 2} />
	{:else if section.type === 'richText'}
		<RichText section={section as RichTextSection} />
	{:else if section.type === 'image'}
		<Image section={section as ImageSection} />
	{:else if section.type === 'video'}
		<Video section={section as VideoSection} />
	{/if}
{/each}
