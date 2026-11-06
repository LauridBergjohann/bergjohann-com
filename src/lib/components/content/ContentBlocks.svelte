<script lang="ts">
	import type { ContentBlock } from '$lib/api/content';
	import Paragraph from './Paragraph.svelte';
	import InfoPanel from './InfoPanel.svelte';
	import TextLink from './TextLink.svelte';
	let { blocks }: { blocks: ContentBlock[] } = $props();
</script>

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
