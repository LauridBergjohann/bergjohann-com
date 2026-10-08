<!--
@component
Text over hero media with an optional readable panel for photography.
-->
<script lang="ts">
	import type { HeroImageSection } from '../interface';
	import type { Snippet } from 'svelte';
	import ThemeImage from '../../helper/ThemeImage.svelte';
	let {
		section,
		headingLevel = 2,
		children
	}: { section: HeroImageSection; headingLevel?: 1 | 2; children?: Snippet } = $props();
</script>

<section
	id={section.id}
	aria-labelledby={section.headline ? section.id + '-headline' : undefined}
	class="hero"
	class:hero-leading={headingLevel === 1}
	class:hero-artwork={section.image.objectFit === 'contain'}
	data-size={section.size ?? 'md'}
	data-layout={section.layout ?? 'wide'}
>
	<div class="hero-media">
		<ThemeImage
			src={section.image.src}
			srcDark={section.image.srcDark}
			alt={section.image.alt}
			class="hero-image"
		/>
	</div>
	<div class="hero-inner">
		{#if section.headline || section.introduction || section.eyebrow || children}
			<div class="hero-copy" class:hero-panel={section.textBackground !== false}>
				{#if section.eyebrow}<p class="hero-eyebrow">{section.eyebrow}</p>{/if}
				{#if section.headline}
					<svelte:element this={headingLevel === 1 ? 'h1' : 'h2'} id={section.id + '-headline'}
						>{section.headline}</svelte:element
					>
				{/if}
				{#if section.introduction}<p class="hero-description">{section.introduction}</p>{/if}
				{#if children}<div class="hero-actions">{@render children()}</div>{/if}
			</div>
		{/if}
	</div>
</section>

<style>
	.hero {
		position: relative;
		isolation: isolate;
		background: var(--hero-background);
		--hero-height: 32rem;
	}
	.hero[data-size='sm'] {
		--hero-height: 24rem;
	}
	.hero[data-size='lg'] {
		--hero-height: 42rem;
	}
	.hero-leading {
		padding-top: var(--header-clearance);
	}
	.hero-media {
		position: absolute;
		inset: 0;
		z-index: -1;
		overflow: hidden;
	}
	.hero-media::after {
		content: '';
		position: absolute;
		inset: 0;
		background: linear-gradient(transparent 65%, var(--section-background));
	}
	.hero-media :global(.hero-image) {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	.hero-artwork .hero-media {
		inset: var(--header-clearance) 0 0;
	}
	/* Transparent artwork already blends into the gradient; keep its details visible. */
	.hero-artwork .hero-media::after {
		background: none;
	}
	.hero-artwork .hero-media :global(.hero-image) {
		position: absolute;
		right: max(0px, calc((100% - 1554px) / 2));
		bottom: 0;
		width: 75%;
		object-fit: contain;
		object-position: right center;
	}
	.hero-inner {
		display: flex;
		align-items: center;
		min-height: var(--hero-height);
		max-width: var(--content-narrow-width);
		margin-inline: auto;
		padding: 4rem 2rem 6rem;
	}
	.hero[data-layout='wide'] .hero-inner {
		max-width: 1800px;
	}
	.hero[data-layout='inherit'] .hero-inner {
		padding-inline: 0;
	}
	.hero-copy {
		width: min(100%, 38rem);
	}
	.hero-panel {
		padding: clamp(1.5rem, 4vw, 3rem);
		border: 1px solid var(--border);
		border-radius: 1rem;
		background: var(--hero-text-background);
		backdrop-filter: blur(16px);
	}
	.hero-eyebrow {
		margin-bottom: 1.5rem;
		font-size: 0.75rem;
		font-weight: 600;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--link);
	}
	h1,
	h2 {
		font-size: clamp(2.75rem, 5.5vw, 5.5rem);
		line-height: 1.04;
		font-weight: 700;
		letter-spacing: -0.055em;
		text-wrap: balance;
		hyphens: auto;
		overflow-wrap: break-word;
	}
	.hero[data-size='sm'] :is(h1, h2) {
		font-size: clamp(2.75rem, 5vw, 4.5rem);
	}
	.hero-description {
		max-width: 31rem;
		margin-top: 1.75rem;
		font-size: clamp(1rem, 1.5vw, 1.2rem);
		line-height: 1.75;
		color: var(--foreground-soft);
	}
	.hero-actions {
		margin-top: 2rem;
	}
	@media (min-width: 1024px) {
		.hero-artwork[data-size='sm'] .hero-copy {
			width: min(100%, 44rem);
		}
	}
	@media (max-width: 1023px) {
		.hero {
			--hero-height: 28rem;
		}
		.hero[data-size='sm'] {
			--hero-height: 26rem;
		}
		.hero[data-size='lg'] {
			--hero-height: 38rem;
		}
		.hero-inner {
			align-items: flex-start;
			padding: 3rem 1.25rem 4rem;
		}
		.hero-artwork .hero-inner {
			padding-bottom: 17rem;
		}
		.hero-artwork .hero-media :global(.hero-image) {
			width: 100%;
			height: 20rem;
			right: 0;
			object-position: right bottom;
		}
	}
</style>
