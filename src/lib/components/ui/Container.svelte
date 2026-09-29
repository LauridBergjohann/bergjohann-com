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
	class={`mx-auto w-full ${width === 'narrow' ? '2xl:max-w-[var(--content-narrow-width)]' : '2xl:max-w-[1800px]'} px-5 sm:px-8 ${className}`}
>
	{@render children()}
</div>
