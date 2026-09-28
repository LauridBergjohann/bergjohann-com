<!--
@component

Displays an image with optional accompanying text inside a section.

Supports configurable image position, aspect ratio, and object fit.
-->

<script lang="ts">
	import type { ImageSection, ImageAspect } from '../interface';
	import Section from '../base/Section.svelte';
	import ThemeImage from '../../helper/ThemeImage.svelte';

	type Props = {
		/**
		 * Image section configuration containing the image,
		 * optional text content, and layout settings.
		 */
		section: ImageSection;
	};

	const { section }: Props = $props();

	/**
	 * Whether the image is displayed to the left of the text.
	 *
	 * @defaultValue `true`
	 */
	const imageLeft = $derived(section.imageSide !== 'right');

	const aspectToClass: Record<ImageAspect, string> = {
		none: '',
		'4/3': 'aspect-[4/3]',
		'16/9': 'aspect-video',
		'2/1': 'aspect-[2/1]',
		square: 'aspect-square'
	};

	/**
	 * Effective aspect ratio of the image container.
	 *
	 * @defaultValue `"none"`
	 */
	const aspect: ImageAspect = $derived(section.image.aspect ?? 'none');

	/**
	 * CSS class corresponding to the configured image aspect ratio.
	 */
	const ratioClass = $derived(aspectToClass[aspect]);

	/**
	 * CSS class controlling how the image fits inside its container.
	 *
	 * @defaultValue `"object-cover"`
	 */
	const fitClass = $derived(
		section.image.objectFit === 'contain' ? 'object-contain' : 'object-cover'
	);
</script>

<Section {section}>
	<div
		class="
			mx-auto flex w-full max-w-7xl flex-col gap-10
			md:items-center
		"
		class:md:flex-row={imageLeft}
		class:md:flex-row-reverse={!imageLeft}
	>
		<!-- Image -->
		<div
			class={`w-full overflow-hidden rounded bg-background shadow-lg ring-1 ring-slate-900/10 md:flex-[1.7] ${ratioClass}`}
		>
			<ThemeImage
				src={section.image.src}
				srcDark={section.image.srcDark}
				alt={section.image.alt}
				class={`h-full w-full ${fitClass}`}
			/>
		</div>

		<!-- Optional text content -->
		{#if section.headline || section.description}
			<div class="flex flex-col gap-4 md:flex-1">
				{#if section.headline}
					<h3 class="text-wurm-100 text-2xl font-semibold md:text-3xl">
						{section.headline}
					</h3>
				{/if}

				{#if section.description}
					<p class="text-base leading-relaxed whitespace-pre-line md:text-lg">
						{section.description}
					</p>
				{/if}
			</div>
		{/if}
	</div>
</Section>
