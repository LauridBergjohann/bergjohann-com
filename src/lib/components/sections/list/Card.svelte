<!--
@component

Displays a linked card with optional image and subtitle.

Adapts typography to the configured card size and supports cover or contain image fitting.
-->

<script lang="ts">
	import type { Card } from '../interface';
	import Link from '../../helper/Link.svelte';

	type Props = {
		/**
		 * Card content and navigation configuration.
		 */
		card: Card;

		/**
		 * Visual card size controlling typography scale.
		 */
		size: 'sm' | 'md' | 'lg';
	};

	let { card, size }: Props = $props();

	/**
	 * Responsive title typography derived from the card size.
	 */
	const titleClass = $derived(
		size === 'lg'
			? 'text-lg md:text-xl'
			: size === 'md'
				? 'text-base md:text-lg'
				: 'text-sm md:text-base'
	);

	/**
	 * Responsive subtitle typography derived from the card size.
	 */
	const subtitleClass = $derived(
		size === 'lg'
			? 'text-sm md:text-base'
			: size === 'md'
				? 'text-sm'
				: 'text-xs md:text-sm'
	);
</script>

<Link href={card.href} class="group block aspect-square w-full" title={card.title}>
	<div
		class="bg-surface text-foreground flex h-full flex-col overflow-hidden rounded shadow-[0_0px_4px_rgba(0,0,0,0.15)] ring-1 ring-slate-200/70 transition
			hover:shadow-[0_4px_16px_rgba(0,0,0,0.2)] hover:ring-primary-hover hover:bg-surface-raised"
	>
		{#if card.image}
			<div class="relative aspect-4/3 w-full overflow-hidden">
				<img
					src={card.image}
					alt={card.title}
					class="h-full w-full object-center transition-transform duration-200
						group-hover:scale-105"
					class:object-cover={card.imageCover}
					class:object-contain={!card.imageCover}
				/>
			</div>
		{/if}

		<!-- Card content -->
		<div
			class="flex flex-1 flex-col px-3 py-2"
			class:justify-center={!card.subtitle}
		>
			<h2
				class={`text-foreground leading-snug font-semibold ${titleClass}
					line-clamp-2 overflow-hidden text-ellipsis`}
			>
				{card.title}
			</h2>

			{#if card.subtitle}
				<p class={`text-foreground-soft mt-1 leading-snug ${subtitleClass}`}>
					{card.subtitle}
				</p>
			{/if}
		</div>
	</div>
</Link>