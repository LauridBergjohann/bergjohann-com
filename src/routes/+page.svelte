<script lang="ts">
	import HeaderSpacer from '$lib/components/header/HeaderSpacer.svelte';
	import { site } from '$lib/site';

	import Section from '$lib/components/sections/base/Section.svelte';

	const topics = [
		{
			number: '01',
			title: 'User Experience & Interfaces',
			text: 'What makes digital products intuitive and enjoyable to use? Thoughts on interaction, design, and the details in between.'
		},
		{
			number: '02',
			title: 'Software Architecture',
			text: 'Structures that work beyond the drawing board. Exploring frontends, platforms, and the reasoning behind technical decisions.'
		},
		{
			number: '03',
			title: 'Model Making & Small Worlds',
			text: 'Ships, helicopters, planes, trucks, and a Dutch town in H0 scale. Projects, repairs, and fresh ideas from the workshop.'
		}
	];

	const projects = [
		{
			category: 'WEB / THREE.JS',
			title: 'Exploring Products in 3D',
			text: 'Experiments with interactive 3D product views and interfaces that make digital objects feel more tangible.'
		},
		{
			category: 'MODEL MAKING / H0',
			title: 'Zeewijk',
			text: 'A fictional Dutch town growing piece by piece, with architecture, little stories, and close attention to detail.'
		}
	];
</script>

<svelte:head>
	<title>{site.title}</title>
	<meta name="description" content={site.description} />
</svelte:head>

<HeaderSpacer />

<main lang="en">
	<Section
		section={{
			id: 'themen',
			eyebrow: '01 / Topics',
			title: 'What I’m exploring.',
			introduction: 'The screen and the workbench have more in common than you might think.',
			variant: 'feature',
			spacing: 'spacious',
			divider: 'none'
		}}
	>
		<div class="grid gap-5 md:grid-cols-3">
			{#each topics as topic (topic.number)}
				<article class="rounded-xl border border-border bg-surface p-6">
					<p class="mb-8 font-mono text-xs text-link">
						{topic.number}
					</p>

					<h3 class="text-xl font-semibold tracking-tight">
						{topic.title}
					</h3>

					<p class="mt-3 text-sm leading-7 text-muted">
						{topic.text}
					</p>
				</article>
			{/each}
		</div>
	</Section>

	<Section
		section={{
			id: 'projekte',
			eyebrow: '02 / Projects',
			title: 'On my workbench.',
			introduction: 'A first look at my projects. More detailed write-ups will follow over time.',
			variant: 'feature',
			spacing: 'spacious',
			divider: 'top'
		}}
	>
		<div class="grid gap-5 md:grid-cols-2">
			{#each projects as project (project.title)}
				<article class="rounded-xl border border-border bg-surface p-6 sm:p-8">
					<p class="font-mono text-xs tracking-wider text-link">
						{project.category}
					</p>

					<h3 class="mt-5 text-2xl font-semibold tracking-tight">
						{project.title}
					</h3>

					<p class="mt-3 leading-7 text-muted">
						{project.text}
					</p>

					<p class="mt-6 border-t border-border pt-4 text-sm text-muted">
						Project preview · Full write-up coming soon
					</p>
				</article>
			{/each}
		</div>
	</Section>

	<Section
		section={{
			id: 'ueber-mich',
			eyebrow: '03 / About me',
			title: 'Hi, I’m Laurid.',
			variant: 'feature',
			spacing: 'spacious',
			divider: 'top'
		}}
	>
		<div class="grid gap-8 md:grid-cols-[1.4fr_1fr] md:gap-16">
			<div class="space-y-4 leading-8 text-muted">
				<p>
					I enjoy figuring out how things are put together and how to improve them. That applies
					just as much to an interface or a software architecture as it does to a model I build
					myself.
				</p>

				<p>
					This site is meant to be a personal space for ideas, experiences, and conversations,
					rather than a glossy portfolio. Over time, I hope it will grow into a blog and a journal
					of my projects.
				</p>
			</div>

			<div class="rounded-xl border border-border bg-surface p-6">
				<p class="text-lg font-semibold">Stay curious. Build things.</p>

				<p class="mt-3 text-sm leading-7 text-muted">
					This website is built with SvelteKit, TypeScript and Tailwind.
				</p>

				<a
					// eslint-disable-next-line svelte/no-navigation-without-resolve
					href={site.github}
					class="mt-5 inline-block text-sm text-link underline underline-offset-4"
				>
					View the website repository
					<span aria-hidden="true">→</span>
				</a>
			</div>
		</div>
	</Section>
</main>
