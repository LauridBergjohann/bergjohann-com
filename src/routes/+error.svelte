<script lang="ts">
	import { page } from '$app/state';
	import Container from '$lib/components/ui/Container.svelte';
	import HeaderSpacer from '$lib/components/header/HeaderSpacer.svelte';
	import Link from '$lib/components/helper/Link.svelte';
</script>

<svelte:head>
	<title>{page.status} – {page.data.messages?.error.notFound ?? page.error?.message}</title>
	<meta name="robots" content="noindex" />
</svelte:head>
<HeaderSpacer />
<main>
	<Container width="narrow" class="min-h-[60vh] py-20">
		<p class="font-mono text-link">{page.status}</p>
		<h1 class="mt-4 text-4xl font-semibold">
			{page.status === 404 ? page.data.messages?.error.notFound : page.data.messages?.error.failed}
		</h1>
		<p class="mt-8">
			<Link href={page.data.messages?.links.home ?? '/en'} class="text-link hover:underline"
				>{page.data.messages?.error.backHome}</Link
			>
		</p>
	</Container>
</main>
