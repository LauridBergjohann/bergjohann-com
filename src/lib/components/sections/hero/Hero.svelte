<!--
@component

Displays a large hero image with an optional headline overlay.

Supports configurable image height and horizontal headline alignment.
-->

<script lang="ts">
	import type { HeroImageSection } from '../interface';
	import Section from '../base/Section.svelte';

	type Props = {
		/**
		 * Hero image section configuration containing the image,
		 * optional headline, size, and alignment settings.
		 */
		section: HeroImageSection;
	};

	let { section }: Props = $props();

	const sizeClassesMap: Record<NonNullable<HeroImageSection['size']>, string> = {
		sm: 'h-32 md:h-48 lg:h-64',
		md: 'h-64 md:h-80 lg:h-[480px]',
		lg: 'h-72 md:h-[520px] lg:h-[620px]'
	};

	/**
	 * Default hero image size.
	 */
	const defaultSize: HeroImageSection['size'] = 'md';

	const alignClassesMap: Record<'left' | 'center' | 'right', string> = {
		left: 'justify-start',
		center: 'justify-center',
		right: 'justify-end'
	};

	/**
	 * Responsive height classes derived from the configured hero size.
	 */
	const sizeClasses = $derived(sizeClassesMap[section.size ?? defaultSize]);

	/**
	 * Horizontal alignment class used for the headline overlay.
	 *
	 * @defaultValue `"right"`
	 */
	const alignClass = $derived(
		alignClassesMap[section.headlineAlign ?? 'right']
	);
</script>

<Section {section}>
	<!-- Hero image -->
	<img
		src={section.image.src}
		alt={section.image.alt}
		class={`w-full object-cover ${sizeClasses}`}
	/>

	<!-- Optional headline overlay -->
	{#if section.headline}
		<div
			class={`pointer-events-none absolute inset-0 flex items-start ${alignClass}`}
		>
			<div class="pointer-events-auto mx-4 mt-6 md:mx-16 md:mt-10">
				<div class="bg-background px-6 py-4 shadow-lg md:px-8 md:py-5">
					<h2
						class="text-lg font-semibold tracking-wide uppercase md:text-3xl md:tracking-[0.16em]"
					>
						{section.headline}
					</h2>
				</div>
			</div>
		</div>
	{/if}
</Section>