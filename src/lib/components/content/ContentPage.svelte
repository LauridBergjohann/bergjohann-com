<script lang="ts">
	import type { ContentBlock, ContentPage, ContentSection } from '$lib/api/content';
	import Hero from '$lib/components/sections/hero/Hero.svelte';
	import Section from '$lib/components/sections/base/Section.svelte';
	import RichText from '$lib/components/sections/text/Richtext.svelte';
	import List from '$lib/components/sections/list/List.svelte';
	import Image from '$lib/components/sections/image/Image.svelte';
	import Video from '$lib/components/sections/video/Video.svelte';
	import Container from '$lib/components/ui/Container.svelte';
	import Link from '$lib/components/helper/Link.svelte';
	import Paragraph from './Paragraph.svelte';
	import InfoPanel from './InfoPanel.svelte';
	import TextLink from './TextLink.svelte';

	let { page }: { page: ContentPage } = $props();
</script>

{#snippet renderBlocks(blocks: ContentBlock[])}
	{#each blocks as block, index (index)}
		{#if block.type === 'paragraph'}
			<Paragraph variant={block.variant}
				><span class="whitespace-pre-line">{block.text}</span></Paragraph
			>
		{:else if block.type === 'address'}
			<InfoPanel>
				<address class="not-italic">
					<strong class="font-semibold text-foreground">{block.name}</strong>
					{#each block.lines as line, lineIndex (lineIndex)}<br />{line}{/each}
				</address>
			</InfoPanel>
		{:else if block.type === 'contact'}
			<Paragraph
				>{block.label} <TextLink href={`mailto:${block.email}`}>{block.email}</TextLink></Paragraph
			>
		{/if}
	{/each}
{/snippet}

{#snippet renderSections(sections: ContentSection[])}
	{#each sections as section (section.id)}
		{#if section.type === 'topics'}
			<Section {section}>
				<div class="grid gap-5 md:grid-cols-3">
					{#each section.items as topic (topic.id)}
						<article class="rounded-xl border border-border bg-surface p-6">
							<p class="mb-8 font-mono text-xs text-link">{topic.number}</p>
							<h3 class="text-xl font-semibold tracking-tight">{topic.title}</h3>
							<p class="mt-3 text-sm leading-7 text-muted">{topic.text}</p>
						</article>
					{/each}
				</div>
			</Section>
		{:else if section.type === 'projects'}
			<Section {section}>
				<div class="grid gap-5 md:grid-cols-2">
					{#each section.items as project (project.id)}
						<article class="rounded-xl border border-border bg-surface p-6 sm:p-8">
							<p class="font-mono text-xs tracking-wider text-link">{project.category}</p>
							<h3 class="mt-5 text-2xl font-semibold tracking-tight">{project.title}</h3>
							<p class="mt-3 leading-7 text-muted">{project.text}</p>
							<p class="mt-6 border-t border-border pt-4 text-sm text-muted">{section.footer}</p>
						</article>
					{/each}
				</div>
			</Section>
		{:else if section.type === 'about'}
			<Section {section}>
				<div class="grid gap-8 md:grid-cols-[1.4fr_1fr] md:gap-16">
					<div class="space-y-4 leading-8 text-muted">
						{#each section.paragraphs as paragraph, index (index)}<p>{paragraph}</p>{/each}
					</div>
					<div class="rounded-xl border border-border bg-surface p-6">
						<p class="text-lg font-semibold">{section.panel.headline}</p>
						<p class="mt-3 text-sm leading-7 text-muted">{section.panel.text}</p>
						<Link
							href={section.panel.href}
							class="mt-5 inline-block text-sm text-link underline-offset-4 hover:underline"
						>
							{section.panel.label} <span aria-hidden="true">→</span>
						</Link>
					</div>
				</div>
			</Section>
		{:else if section.type === 'prose'}
			<Section {section}>{@render renderBlocks(section.blocks)}</Section>
		{:else if section.type === 'richText'}
			<RichText {section} />
		{:else if section.type === 'list'}
			<List {section} />
		{:else if section.type === 'image'}
			<Image {section} />
		{:else if section.type === 'video'}
			<Video {section} />
		{/if}
	{/each}
{/snippet}

<main id={page.id} lang={page.locale} aria-labelledby={`${page.hero.id}-headline`}>
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
	{#if page.layout === 'legal'}
		<Container width="narrow" class="space-y-10 bg-section pt-8 pb-16 sm:pt-12 sm:pb-24">
			{@render renderBlocks(page.introBlocks ?? [])}
			{@render renderSections(page.sections)}
		</Container>
	{:else}
		{@render renderBlocks(page.introBlocks ?? [])}
		{@render renderSections(page.sections)}
	{/if}
</main>
