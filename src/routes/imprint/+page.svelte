<script lang="ts">
	import HeaderSpacer from '$lib/components/header/HeaderSpacer.svelte';
	import Container from '$lib/components/ui/Container.svelte';
	import Section from '$lib/components/sections/base/Section.svelte';
	import PageIntro from '$lib/components/content/PageIntro.svelte';
	import Paragraph from '$lib/components/content/Paragraph.svelte';
	import InfoPanel from '$lib/components/content/InfoPanel.svelte';
	import TextLink from '$lib/components/content/TextLink.svelte';
</script>

<svelte:head><title>Imprint</title></svelte:head>

<HeaderSpacer />
<main id="imprint" aria-labelledby="imprint-title" class="pt-8 pb-16 sm:pt-12 sm:pb-24">
	<Container width="narrow" class="space-y-10">
		<PageIntro
			id="imprint-title"
			title="Imprint"
			eyebrow="Legal information"
			description="Information pursuant to Section 5 of the German Digital Services Act (DDG) and Section 18 (1) of the German Interstate Media Treaty (MStV)."
		/>

		<InfoPanel>
			<address class="not-italic">
				<strong class="font-semibold text-foreground">Laurid Bergjohann</strong><br />
				Geschwister-Scholl-Straße 6<br />
				42897 Remscheid<br />
				Germany
			</address>
		</InfoPanel>

		<Section
			section={{
				id: 'imprint-contact',
				title: 'Contact',
				variant: 'content',
				layout: 'inherit',
				spacing: 'none',
				divider: 'top',
				background: 'transparent'
			}}
		>
			<Paragraph>
				Email:
				<TextLink href="mailto:info@bergjohann.com">info@bergjohann.com</TextLink>
			</Paragraph>
		</Section>
		<Section
			section={{
				id: 'imprint-responsible-for-editorial-content',
				title: 'Responsible for editorial content',
				variant: 'content',
				layout: 'inherit',
				spacing: 'none',
				divider: 'top',
				background: 'transparent'
			}}
		>
			<Paragraph>Responsible for editorial content pursuant to Section 18 (2) MStV:</Paragraph>

			<InfoPanel>
				<address class="not-italic">
					<strong class="font-semibold text-foreground">Laurid Bergjohann</strong><br />
					Geschwister-Scholl-Straße 6<br />
					42897 Remscheid<br />
					Germany
				</address>
			</InfoPanel>
		</Section>
	</Container>
</main>
