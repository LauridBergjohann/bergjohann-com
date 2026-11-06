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
	class={`ps-content-width mx-auto px-5 sm:px-8 ${className}`}
	style:max-width={width === 'narrow' ? 'var(--ps-narrow-max)' : undefined}
>
	{@render children()}
</div>
