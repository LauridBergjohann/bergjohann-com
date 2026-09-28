<script lang="ts">
	import HeroSection from './hero/Hero.svelte';
	import RichTextSectionCmp from './text/Richtext.svelte';
	import VideoSectionCmp from './video/Video.svelte';
	import ImageSectionCmp from './image/Image.svelte';

	import type {
		HeroImageSection,
		RichTextSection,
		VideoSection,
		ImageSection,
		Section
	} from './interface';

	let { sections }: { sections: Section[] } = $props();
</script>

{#each sections as section (section)}
	{#if section.type === 'heroImage'}
		<HeroSection section={section as HeroImageSection} />
	{:else if section.type === 'richText'}
		<RichTextSectionCmp section={section as RichTextSection} />
	{:else if section.type === 'image'}
		<ImageSectionCmp section={section as ImageSection} />
	{:else if section.type === 'video'}
		<VideoSectionCmp section={section as VideoSection} />
	{/if}
{/each}
