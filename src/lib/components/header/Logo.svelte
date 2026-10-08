<script lang="ts">
	import type { Asset, PathnameWithSearchOrHash } from '$app/types';
	import { asset, resolve } from '$app/paths';
	import type { Messages } from '$lib/i18n/messages';
	let { messages }: { messages: Messages } = $props();
</script>

<a
	href={resolve(messages.links.home as PathnameWithSearchOrHash)}
	aria-label={messages.navigation.home}
	class="brand"
>
	<img
		src={asset(messages.brand.logoLight as Asset)}
		alt=""
		width="645"
		height="154"
		class="logo logo-light"
	/>

	<img
		src={asset(messages.brand.logoDark as Asset)}
		alt=""
		width="645"
		height="154"
		class="logo logo-dark"
	/>
</a>

<style>
	.brand {
		display: block;
		flex-shrink: 0;
		width: clamp(144px, 24vw, 192px);
		max-width: 100%;
	}

	.logo {
		width: 100%;
		height: auto;
	}

	/* Standard: Logo für den hellen Hintergrund. */
	.logo-light {
		display: block;
	}

	.logo-dark {
		display: none;
	}

	/* Das vorhandene ThemeSwitch setzt data-theme auf <html>. */
	:global(html[data-theme='dark']) .logo-light {
		display: none;
	}

	:global(html[data-theme='dark']) .logo-dark {
		display: block;
	}

	/* Fallback, solange kein data-theme gesetzt ist, auch ohne JavaScript. */
	@media (prefers-color-scheme: dark) {
		:global(html:not([data-theme])) .logo-light {
			display: none;
		}

		:global(html:not([data-theme])) .logo-dark {
			display: block;
		}
	}
</style>
