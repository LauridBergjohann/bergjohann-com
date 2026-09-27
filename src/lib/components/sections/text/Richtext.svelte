<!--
@component

Displays rich text content inside a section.

Supports plain text and Markdown content.
-->

<script lang="ts">
	import type { RichTextSection } from "$lib/components/sections/interface";
	import Section from "../base/Section.svelte";

	type Props = {
		/**
		 * Rich text section configuration containing the content
		 * and its format.
		 */
		section: RichTextSection;
	};

	let { section }: Props = $props();
</script>

<Section {section}>
	{#if section.format === "text"}
		<div class="prose max-w-none">
			{section.body}
		</div>
	{:else}
		<p class="max-w-3xl whitespace-pre-line">
			<!-- TODO: Convert Markdown to rendered HTML -->
			{section.body}
		</p>
	{/if}
</Section>