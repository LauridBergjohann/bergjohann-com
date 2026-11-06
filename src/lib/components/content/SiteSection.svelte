<script lang="ts">
	import { Section } from '@page-sections/svelte';
	import type { SiteSection } from '$lib/api/content';
	import Link from '$lib/components/helper/Link.svelte';
	import ContentBlocks from './ContentBlocks.svelte';
	let { section }: { section: SiteSection } = $props();
</script>

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
	<Section {section}><ContentBlocks blocks={section.blocks} /></Section>
{/if}
