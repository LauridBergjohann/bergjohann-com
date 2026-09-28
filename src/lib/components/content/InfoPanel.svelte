<script lang="ts">
	import type { Snippet } from 'svelte';
	let { children }: { children: Snippet } = $props();
</script>

<div
	class="space-y-4 rounded-2xl border border-border bg-surface px-6 py-5 text-base leading-[1.8] wrap-anywhere text-foreground-soft"
>
	{@render children()}
</div>
