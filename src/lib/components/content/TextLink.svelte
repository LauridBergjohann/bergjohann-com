<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import Link from '$lib/components/helper/Link.svelte';
	let { children, class: className = '', ...attributes }: ComponentProps<typeof Link> = $props();
</script>

<Link
	{...attributes}
	class={`text-link underline underline-offset-4 hover:text-link-hover ${className}`}
	>{@render children()}</Link
>
