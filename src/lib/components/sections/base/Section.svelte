<!--
@component

Provides the shared layout wrapper for all section types.

Handles background, spacing, width, optional title, and section dividers.
-->

<script lang="ts">
	import type { SectionBase } from '../interface';
	import type { Snippet } from 'svelte';

	type Props = {
		/**
		 * Base section configuration controlling layout, spacing,
		 * background, title, and dividers.
		 */
		section: SectionBase;
		children: Snippet;
	};

	let { section, children }: Props = $props();

	const bgMap = {
		normal: 'bg-background',
		muted: 'bg-muted',
		transparent: 'bg-transparent'
	} as const;

	const spacingMap = {
		none: 'py-0',
		tight: 'py-1 md:py-2',
		normal: 'py-2 md:py-3',
		loose: 'py-4 md:py-5'
	} as const;

	/**
	 * Background class derived from the section configuration.
	 */
	const bgClass = $derived(bgMap[section.background ?? 'normal']);

	/**
	 * Vertical spacing class derived from the section configuration.
	 */
	const spacingClass = $derived(spacingMap[section.spacing ?? 'normal']);

	/**
	 * Whether the section uses the full-width layout.
	 */
	const isFull = $derived(section.layout === 'full');

	/**
	 * Whether a divider should be rendered above the section content.
	 */
	const hasTopDivider = $derived(
		section.divider === 'top' || section.divider === 'both'
	);

	/**
	 * Whether a divider should be rendered below the section content.
	 */
	const hasBottomDivider = $derived(
		section.divider === 'bottom' || section.divider === 'both'
	);
</script>

<section
	id={section.id}
	class={`relative w-full scroll-mt-10 ${bgClass} ${isFull ? '' : spacingClass}`}
>
	{#if !isFull && hasTopDivider}
		<div
			class="mx-4 mb-4 border-t border-slate-200 md:mx-6"
			aria-hidden="true"
		></div>
	{/if}

	{#if !isFull && section.title}
		<header class="mb-4 px-4 pt-2 md:px-6">
			<h2 class="text-2xl font-semibold text-wurm-100 md:text-3xl">
				{section.title}
			</h2>
		</header>
	{/if}

	<div class={isFull ? '' : 'px-4 md:px-6'}>
		{@render children()}
	</div>

	{#if !isFull && hasBottomDivider}
		<div
			class="mx-4 mt-6 border-t border-slate-200 md:mx-6"
			aria-hidden="true"
		></div>
	{/if}
</section>