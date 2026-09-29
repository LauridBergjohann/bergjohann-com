<script lang="ts">
	import { site } from '$lib/site';
	import Container from '$lib/components/ui/Container.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import Link from '../helper/Link.svelte';
</script>

<footer class="border-t border-border py-9">
	<Container
		width="narrow"
		class="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between"
	>
		<div>
			<p class="text-xl font-bold tracking-tight">{site.name}</p>
			<p class="mt-1 text-sm text-muted">UX &middot; Engineering &middot; Model Worlds</p>
		</div>

		<nav aria-label="Footer" class="flex flex-col gap-4 sm:items-end">
			<div class="flex flex-wrap items-center gap-x-6 gap-y-3">
				<Link
					href={site.github}
					target="_blank"
					class="inline-flex items-center gap-2 text-sm text-link underline underline-offset-4"
				>
					<span aria-hidden="true"><Icon id="github" size={18} /></span>
					Source code on GitHub
				</Link>
				<Link
					href={site.linkedin}
					target="_blank"
					class="inline-flex items-center gap-2 text-sm text-link underline underline-offset-4"
				>
					<span aria-hidden="true"><Icon id="linkedin" size={18} /></span>
					LinkedIn
				</Link>
			</div>
			<div class="flex flex-wrap items-center gap-x-6 gap-y-3">
				<Link href="/imprint" class="text-sm text-link underline underline-offset-4">Imprint</Link>
				<Link href="/privacy" class="text-sm text-link underline underline-offset-4"
					>Privacy Policy</Link
				>
			</div>
		</nav>
	</Container>
</footer>
