<!--
@component

Renders a link that supports both internal SvelteKit routes and external destinations.

Internal links are resolved through SvelteKit, while external URLs and fragments are handled by the browser.
-->

<script lang="ts">
	import { resolve } from '$app/paths';
	import type { PathnameWithSearchOrHash } from '$app/types';
	import type { Snippet } from 'svelte';
	import type { HTMLAnchorAttributes } from 'svelte/elements';

	type Props = Omit<HTMLAnchorAttributes, 'href' | 'children'> & {
		/**
		 * Link destination.
		 *
		 * Supports app-relative paths, HTTP(S) URLs, protocol-relative URLs,
		 * mailto:, tel:, and fragment links.
		 */
		href: string;

		/**
		 * Content rendered inside the link.
		 */
		children: Snippet;
	};

	let { href, rel, children, ...attributes }: Props = $props();

	/**
	 * Whether the destination should be handled directly by the browser
	 * instead of the SvelteKit router.
	 */
	let isExternal = $derived(
		/^(?:https?:\/\/|\/\/|mailto:|tel:)/i.test(href)
	);
</script>

{#if isExternal}
	<a {...attributes} {href} rel="external {rel ?? ''}">
		{@render children()}
	</a>
{:else if href.startsWith('#')}
	<!-- Preserve the literal # prefix for the navigation lint rule. -->
	<a {...attributes} href="#{href.slice(1)}" {rel}>
		{@render children()}
	</a>
{:else}
	<a {...attributes} href={resolve(href as PathnameWithSearchOrHash)} {rel}>
		{@render children()}
	</a>
{/if}