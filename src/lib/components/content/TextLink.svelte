<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import Link from '$lib/components/helper/Link.svelte';
	let { children, class: className = '', ...attributes }: ComponentProps<typeof Link> = $props();
</script>

<Link
	{...attributes}
	class={`text-link underline-offset-4 hover:text-link-hover hover:underline ${className}`}
	>{@render children()}</Link
>
