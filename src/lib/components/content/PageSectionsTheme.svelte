<script lang="ts">
	import { onMount, type Snippet } from 'svelte';
	import { PageShell } from '@page-sections/svelte';
	import { themePreference, type ThemePreference } from '$lib/theme';
	let { children }: { children: Snippet } = $props();
	// Subscribe only in the browser: the existing store owns system/session preferences.
	// Undefined on the server lets package images use prefers-color-scheme without JS.
	let mode = $state<ThemePreference>();
	onMount(() =>
		themePreference.subscribe((value) => {
			mode = value;
		})
	);
</script>

<div class="site-page-sections">
	<PageShell
		{mode}
		theme={{
			background: 'var(--page-background)',
			ink: 'var(--foreground)',
			body: 'var(--muted)',
			accent: 'var(--link)',
			onAccent: 'var(--on-primary)',
			standard: 'var(--section-background)',
			muted: 'var(--surface)',
			radius: '12px',
			fontFamily: 'var(--font-sans)'
		}}
	>
		{@render children()}
	</PageShell>
</div>
