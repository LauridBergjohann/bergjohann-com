<script lang="ts">
	type Props = {
		id: string;
		image: {
			light: string;
			dark: string;
		};
		title?: string;
		eyebrow?: string;
		description?: string;
	};

	let { id, image, title, eyebrow, description }: Props = $props();
</script>

<section
	{id}
	class="hero relative h-96"
	aria-labelledby={title ? `${id}-title` : undefined}
	style:--hero-image-light={`url("${image.light}")`}
	style:--hero-image-dark={`url("${image.dark}")`}
>
	{#if eyebrow || title || description}
		<article
			class="absolute top-6 right-6 w-md rounded-xl bg-background/80 p-8 backdrop-blur-md"
		>
			{#if eyebrow}
				<p
					class="text-link mb-3 font-mono text-xs font-semibold tracking-widest uppercase"
				>
					{eyebrow}
				</p>
			{/if}

			{#if title}
				<h2
					id={`${id}-title`}
					class="text-3xl font-bold tracking-tight sm:text-4xl"
				>
					{title}
				</h2>
			{/if}

			{#if description}
				<p class="text-muted mt-4 leading-7">
					{description}
				</p>
			{/if}
		</article>
	{/if}
</section>

<style>
	.hero {
		background-color: var(--surface);
		background-image: var(--hero-image-light);
		background-position: center;
		background-repeat: no-repeat;
		background-size: cover;
	}

	:global(html[data-theme='dark']) .hero {
		background-image: var(--hero-image-dark);
	}

	@media (prefers-color-scheme: dark) {
		:global(html:not([data-theme])) .hero {
			background-image: var(--hero-image-dark);
		}
	}
</style>