<script lang="ts">
	type Props = {
		src: string;
		srcDark?: string;
		alt: string;
		class?: string;
	};

	let { src, srcDark, alt, class: className }: Props = $props();
</script>

<img src={src} {alt} class={className} class:theme-light={!!srcDark} />
{#if srcDark}
	<img src={srcDark} {alt} class={className} class:theme-dark={true} />
{/if}

<style>
	.theme-dark {
		display: none;
	}

	:global(html[data-theme='dark']) .theme-light {
		display: none;
	}

	:global(html[data-theme='dark']) .theme-dark {
		display: block;
	}

	@media (prefers-color-scheme: dark) {
		:global(html:not([data-theme])) .theme-light {
			display: none;
		}

		:global(html:not([data-theme])) .theme-dark {
			display: block;
		}
	}
</style>
