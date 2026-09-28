<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		children: Snippet;
		class?: string;
		width?: 'wide' | 'narrow';
	};

	let { children, class: className = '', width = 'wide' }: Props = $props();
</script>

<div
	class={`mx-auto w-full ${width === 'narrow' ? 'max-w-3xl' : 'max-w-6xl'} px-5 sm:px-8 ${className}`}
>
	{@render children()}
</div>
