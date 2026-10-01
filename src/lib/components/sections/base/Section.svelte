<!--
@component
Shared section layout for media, landing pages and text content.
Use layout="inherit" inside a container. Full layout preserves edge-to-edge media.
-->
<script lang="ts">
	import type { SectionBase } from '../interface';
	import type { Snippet } from 'svelte';
	let { section, children }: { section: SectionBase; children: Snippet } = $props();
	const backgrounds = {
		normal: 'bg-section',
		muted: 'bg-surface',
		transparent: 'bg-transparent'
	};
	const spacing = {
		none: 'py-0',
		tight: 'py-1 md:py-2',
		normal: 'py-2 md:py-3',
		loose: 'py-4 md:py-5',
		spacious: 'py-16 sm:py-20'
	};
	const widths = {
		full: '',
		wide: 'mx-auto w-full px-5 sm:px-8 2xl:max-w-[1800px]',
		narrow: 'mx-auto w-full px-5 sm:px-8 2xl:max-w-[var(--content-narrow-width)]',
		inherit: ''
	};
	const titles = {
		default: 'text-2xl font-semibold md:text-3xl',
		content: 'text-[clamp(1.25rem,3vw,1.5rem)] leading-[1.35] font-semibold tracking-tight',
		feature: 'text-3xl font-bold tracking-tight sm:text-4xl'
	};
	const isFull = $derived(section.layout === 'full');
	const variant = $derived(section.variant ?? 'default');
	const topDivider = $derived(!isFull && (section.divider === 'top' || section.divider === 'both'));
	const bottomDivider = $derived(
		!isFull && (section.divider === 'bottom' || section.divider === 'both')
	);
	const headingId = $derived(section.title && !isFull ? section.id + '-title' : undefined);
</script>

<section
	id={section.id}
	aria-labelledby={headingId}
	class={`relative w-full ${backgrounds[section.background ?? 'normal']}`}
>
	<div
		class={`${widths[section.layout ?? 'wide']} ${isFull ? '' : spacing[section.spacing ?? 'normal']} ${variant === 'feature' && topDivider ? 'border-t border-border' : ''} ${variant === 'feature' && bottomDivider ? 'border-b border-border' : ''}`}
	>
		{#if topDivider && variant !== 'feature'}
			<div
				class={`border-t border-border ${variant === 'content' ? 'mb-7' : 'mb-4'}`}
				aria-hidden="true"
			></div>
		{/if}
		{#if !isFull && (section.title || section.eyebrow || section.introduction)}
			<header class={variant === 'feature' ? 'mb-9 max-w-2xl' : 'mb-4'}>
				{#if section.eyebrow}<p
						class="mb-3 font-mono text-xs font-semibold tracking-widest text-link uppercase"
					>
						{section.eyebrow}
					</p>{/if}
				{#if section.title}
					<svelte:element
						this={section.headingLevel === 3 ? 'h3' : 'h2'}
						id={headingId}
						class={`wrap-anywhere text-foreground ${titles[variant]}`}
						>{section.title}</svelte:element
					>
				{/if}
				{#if section.introduction}<p class="mt-4 leading-7 text-muted">
						{section.introduction}
					</p>{/if}
			</header>
		{/if}
		<div class={variant === 'content' ? 'space-y-4' : ''}>{@render children()}</div>
		{#if bottomDivider && variant !== 'feature'}<div
				class="mt-6 border-t border-border"
				aria-hidden="true"
			></div>{/if}
	</div>
</section>
