<script lang="ts">
	import type { Snippet } from 'svelte';
	let {
		variant = 'default',
		children
	}: { variant?: 'default' | 'lead' | 'muted'; children: Snippet } = $props();
	const styles = {
		default: 'text-base leading-[1.8] text-foreground-soft',
		lead: 'text-lg leading-7 text-foreground-soft',
		muted: 'text-sm leading-7 text-muted'
	};
</script>

<p class={`wrap-anywhere ${styles[variant]}`}>{@render children()}</p>
