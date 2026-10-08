<script lang="ts">
	import Container from '$lib/components/ui/Container.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import Link from '../helper/Link.svelte';
	import type { Messages } from '$lib/i18n/messages';
	let { messages }: { messages: Messages } = $props();
</script>

<footer class="border-t border-border py-9">
	<Container
		width="narrow"
		class="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between"
	>
		<div>
			<p class="text-xl font-bold tracking-tight">{messages.brand.name}</p>
			<p class="mt-1 text-sm text-muted">{messages.footer.tagline}</p>
		</div>

		<nav aria-label={messages.footer.navigation} class="flex flex-col gap-4 sm:items-end">
			<div class="flex flex-wrap items-center gap-x-6 gap-y-3">
				<Link
					href={messages.links.github}
					target="_blank"
					class="inline-flex items-center gap-2 text-sm text-link underline-offset-4 hover:underline"
				>
					<span aria-hidden="true"><Icon id="github" size={18} /></span>
					{messages.footer.source}
				</Link>
				<Link
					href={messages.links.linkedin}
					target="_blank"
					class="inline-flex items-center gap-2 text-sm text-link underline-offset-4 hover:underline"
				>
					<span aria-hidden="true"><Icon id="linkedin" size={18} /></span>
					{messages.footer.linkedin}
				</Link>
			</div>
			<div class="flex flex-wrap items-center gap-x-6 gap-y-3">
				<Link
					href={messages.links.imprint}
					class="text-sm text-link underline-offset-4 hover:underline"
					>{messages.footer.imprint}</Link
				>
				<Link
					href={messages.links.privacy}
					class="text-sm text-link underline-offset-4 hover:underline"
					>{messages.footer.privacy}</Link
				>
			</div>
		</nav>
	</Container>
</footer>
