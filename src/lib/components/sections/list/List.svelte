<!--
@component

Displays a responsive grid of cards inside a section.

The grid density adapts to the configured card size.
-->

<script lang="ts">
	import Card from "./Card.svelte";
	import Section from "../base/Section.svelte";
	import type { ListSection } from "../interface";

	type Props = {
		/**
		 * List section configuration containing the cards
		 * and their visual size.
		 */
		section: ListSection;
	};

	let { section }: Props = $props();

	/**
	 * Effective card size used by all cards in the section.
	 *
	 * @defaultValue `"sm"`
	 */
	const cardSize = $derived(section.cardSize ?? "sm");

	/**
	 * Responsive grid column classes derived from the selected card size.
	 */
	const gridColsClass = $derived(
		cardSize === "lg"
			? "grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4"
			: cardSize === "md"
				? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
				: "grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6"
	);
</script>

<Section {section}>
	<div class={`grid gap-4 ${gridColsClass}`}>
		{#each section.cards as card (card.id)}
			<Card {card} size={cardSize} />
		{/each}
	</div>
</Section>