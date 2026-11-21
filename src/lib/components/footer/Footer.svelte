<script lang="ts">
	import { Footer as PageFooter } from '@page-sections/svelte';
	import { resolve } from '$app/paths';
	import type { PathnameWithSearchOrHash } from '$app/types';
	import Icon from '$lib/components/ui/Icon.svelte';
	import type { Messages } from '$lib/i18n/messages';
	let { messages }: { messages: Messages } = $props();
	const year = new Date().getFullYear();
</script>

{#snippet githubIcon()}<Icon id="github" size={18} />{/snippet}
{#snippet linkedinIcon()}<Icon id="linkedin" size={18} />{/snippet}

<PageFooter
	class="site-footer"
	footnote={'© ' + year + ' ' + messages.brand.name}
	socialLabel={messages.footer.social}
	linksLabel={messages.footer.navigation}
	social={[
		{ label: messages.footer.source, href: messages.links.github, icon: githubIcon },
		{ label: messages.footer.linkedin, href: messages.links.linkedin, icon: linkedinIcon }
	]}
	links={[
		{
			label: messages.footer.imprint,
			href: resolve(messages.links.imprint as PathnameWithSearchOrHash)
		},
		{
			label: messages.footer.privacy,
			href: resolve(messages.links.privacy as PathnameWithSearchOrHash)
		}
	]}
>
	{#snippet brand()}
		<p class="footer-brand">{messages.brand.name}</p>
		<p class="footer-tagline">{messages.footer.tagline}</p>
	{/snippet}
</PageFooter>

<style>
	:global(.site-footer) {
		margin-top: 3rem;
	}
	.footer-brand {
		margin: 0;
		font-size: 1.25rem;
		font-weight: 700;
		letter-spacing: -0.025em;
	}
	.footer-tagline {
		margin: 0.25rem 0 0;
	}
</style>
