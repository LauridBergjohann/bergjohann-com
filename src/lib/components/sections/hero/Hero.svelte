<!--
@component
A hero image followed by a page introduction aligned with the content.
-->
<script lang="ts">
	import type { HeroImageSection } from '../interface';
	import Section from '../base/Section.svelte';
	import ThemeImage from '../../helper/ThemeImage.svelte';
	import PageIntro from '../../content/PageIntro.svelte';
	import Container from '../../ui/Container.svelte';
	let { section, headingLevel = 2 }: { section: HeroImageSection; headingLevel?: 1 | 2 } = $props();
	const sizes = {
		sm: 'h-32 md:h-48 lg:h-64',
		md: 'h-64 md:h-80 lg:h-[480px]',
		lg: 'h-72 md:h-[520px] lg:h-[620px]'
	};
</script>

{#snippet intro()}
	<div class="py-10 sm:py-12">
		<PageIntro
			id={section.id + '-headline'}
			title={section.headline ?? ''}
			description={section.introduction}
			{headingLevel}
			accent
		/>
	</div>
{/snippet}

<Section section={{ ...section, introduction: undefined }}>
	<ThemeImage
		src={section.image.src}
		srcDark={section.image.srcDark}
		alt={section.image.alt}
		class={`w-full object-cover ${sizes[section.size ?? 'md']}`}
	/>
	{#if section.headline}
		{#if section.layout === 'full'}
			<Container width="narrow">{@render intro()}</Container>
		{:else}
			{@render intro()}
		{/if}
	{/if}
</Section>
