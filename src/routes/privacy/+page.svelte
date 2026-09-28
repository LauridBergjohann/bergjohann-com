<script lang="ts">
	import HeaderSpacer from '$lib/components/header/HeaderSpacer.svelte';
	import Container from '$lib/components/ui/Container.svelte';
	import Section from '$lib/components/sections/base/Section.svelte';
	import PageIntro from '$lib/components/content/PageIntro.svelte';
	import Paragraph from '$lib/components/content/Paragraph.svelte';
	import InfoPanel from '$lib/components/content/InfoPanel.svelte';
	import TextLink from '$lib/components/content/TextLink.svelte';
</script>

<svelte:head><title>Privacy Policy</title></svelte:head>

<HeaderSpacer />
<main id="privacy" aria-labelledby="privacy-title" class="pt-8 pb-16 sm:pt-12 sm:pb-24">
	<Container width="narrow" class="space-y-10">
		<PageIntro
			id="privacy-title"
			title="Privacy Policy"
			eyebrow="Legal information"
			description="This privacy policy explains how personal data is processed when you visit bergjohann.com."
		/>

		<Section
			section={{
				id: 'privacy-controller',
				title: '1. Controller',
				variant: 'content',
				layout: 'inherit',
				spacing: 'none',
				divider: 'top',
				background: 'transparent'
			}}
		>
			<InfoPanel>
				<address class="not-italic">
					<strong class="font-semibold text-foreground">Laurid Bergjohann</strong><br />
					Geschwister-Scholl-Straße 6<br />
					42897 Remscheid<br />
					Germany
				</address>
			</InfoPanel>

			<Paragraph>
				Email:
				<TextLink href="mailto:info@bergjohann.com">info@bergjohann.com</TextLink>
			</Paragraph>
		</Section>
		<Section
			section={{
				id: 'privacy-hosting',
				title: '2. Hosting',
				variant: 'content',
				layout: 'inherit',
				spacing: 'none',
				divider: 'top',
				background: 'transparent'
			}}
		>
			<Paragraph>This website is hosted by Vercel.</Paragraph>

			<Paragraph>
				When you access this website, technical information may be processed that is required to
				deliver the website securely and reliably. This may include, in particular, your IP address,
				browser and device information, the requested URL, date and time of the request, and
				technical log and diagnostic data.
			</Paragraph>

			<Paragraph>
				This processing is carried out for the purpose of providing, securing and maintaining the
				website. Where applicable, the legal basis is Article 6(1)(f) GDPR. The legitimate interest
				lies in the secure, reliable and efficient operation of this website.
			</Paragraph>

			<Paragraph>The hosting provider is:</Paragraph>

			<Paragraph>
				Vercel Inc.<br />
				340 S Lemon Ave #4133<br />
				Walnut, CA 91789<br />
				United States
			</Paragraph>

			<Paragraph>
				Further information about data processing by Vercel can be found in Vercel's privacy
				documentation.
			</Paragraph>
		</Section>
		<Section
			section={{
				id: 'privacy-theme-preference',
				title: '3. Theme preference',
				variant: 'content',
				layout: 'inherit',
				spacing: 'none',
				divider: 'top',
				background: 'transparent'
			}}
		>
			<Paragraph>
				This website allows you to choose between a light theme, a dark theme and your system
				preference. If you explicitly select a theme, this preference is stored locally in your
				browser so that your choice can be retained when you revisit the website.
			</Paragraph>

			<Paragraph>
				This information is not used for tracking, advertising or analytics and is not transmitted
				to me.
			</Paragraph>
		</Section>
		<Section
			section={{
				id: 'privacy-contact-by-email',
				title: '4. Contact by email',
				variant: 'content',
				layout: 'inherit',
				spacing: 'none',
				divider: 'top',
				background: 'transparent'
			}}
		>
			<Paragraph>
				If you contact me by email, the information you provide will be processed for the purpose of
				handling your request and communicating with you.
			</Paragraph>

			<Paragraph>
				Depending on the nature of your request, the legal basis may be Article 6(1)(b) GDPR where
				the communication relates to contractual or pre-contractual matters, or Article 6(1)(f) GDPR
				for general enquiries.
			</Paragraph>

			<Paragraph>
				The data will be deleted when it is no longer required for the purpose for which it was
				collected, unless statutory retention obligations require longer storage.
			</Paragraph>
		</Section>
		<Section
			section={{
				id: 'privacy-cookies-and-tracking',
				title: '5. Cookies and tracking',
				variant: 'content',
				layout: 'inherit',
				spacing: 'none',
				divider: 'top',
				background: 'transparent'
			}}
		>
			<Paragraph
				>This website currently does not use analytics, advertising or other tracking services.</Paragraph
			>

			<Paragraph>No tracking or marketing cookies are currently used.</Paragraph>
		</Section>
		<Section
			section={{
				id: 'privacy-your-rights',
				title: '6. Your rights',
				variant: 'content',
				layout: 'inherit',
				spacing: 'none',
				divider: 'top',
				background: 'transparent'
			}}
		>
			<Paragraph>
				Subject to the requirements of the GDPR, you have rights including the right of access,
				rectification, erasure, restriction of processing, objection to processing and data
				portability.
			</Paragraph>

			<Paragraph>
				You also have the right to lodge a complaint with a competent data protection supervisory
				authority.
			</Paragraph>
		</Section>
		<Section
			section={{
				id: 'privacy-changes-to-this-privacy-policy',
				title: '7. Changes to this privacy policy',
				variant: 'content',
				layout: 'inherit',
				spacing: 'none',
				divider: 'top',
				background: 'transparent'
			}}
		>
			<Paragraph
				>This privacy policy may be updated if the website or the services used on it change.</Paragraph
			>

			<Paragraph variant="muted">Last updated: September 2026</Paragraph>
		</Section>
	</Container>
</main>
