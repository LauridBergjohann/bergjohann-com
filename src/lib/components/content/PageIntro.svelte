<script lang="ts">
	import Paragraph from './Paragraph.svelte';
	let {
		id,
		title,
		eyebrow,
		description,
		headingLevel = 1,
		accent = false
	}: {
		id: string;
		title: string;
		eyebrow?: string;
		description?: string;
		headingLevel?: 1 | 2;
		accent?: boolean;
	} = $props();
</script>

<header class="space-y-5">
	{#if eyebrow}
		<p class="flex items-center gap-3 text-xs font-semibold tracking-[0.16em] text-muted uppercase">
			<span class="h-0.5 w-8 shrink-0 rounded-full bg-accent" aria-hidden="true"></span>{eyebrow}
		</p>
	{/if}
	{#if accent && !eyebrow}<div
			class="h-0.5 w-8 rounded-full bg-accent"
			aria-hidden="true"
		></div>{/if}
	<svelte:element
		this={headingLevel === 1 ? 'h1' : 'h2'}
		{id}
		class="text-[clamp(2.25rem,6vw,3.5rem)] leading-[1.1] font-bold tracking-[-0.04em] wrap-anywhere text-foreground"
	>
		{title}
	</svelte:element>
	{#if description}<Paragraph variant="lead">{description}</Paragraph>{/if}
</header>
