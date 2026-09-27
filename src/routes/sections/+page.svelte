<script lang="ts">
	import RichText from "$lib/components/sections/text/Richtext.svelte";
	import Hero from "$lib/components/sections/hero/Hero.svelte";
	import type { RichTextSection, VideoSection, ImageSection, HeroImageSection, Card, ListSection } from "$lib/components/sections/interface";
	import List from "$lib/components/sections/list/List.svelte";
	import Image from "$lib/components/sections/image/Image.svelte";
	import Video from "$lib/components/sections/video/Video.svelte";

	const richTextSection: RichTextSection = {
		id: "my-text-section",
		body: "Hello, World!",
		background: 'muted'
	};
	const heroSection: HeroImageSection = {
		id: "my-hero-section",
		image: {
			src: '/images/rhein-light.webp',
			alt: "Hero Image"
		},
		headline: "Welcome to My Site",
		headlineAlign: "right",
		layout: "full",
		size: "sm"
	};

	const cards: Card[] = [
		{
			id: "card-1",
			href: "/card-1",
			title: "Card 1",
			subtitle: "This is card 1",
			image: "/images/card-1.jpg",
			imageCover: true
		},
		{
			id: "card-2",
			href: "/card-2",
			title: "Card 2",
			subtitle: "This is card 2",
			image: "/images/card-2.jpg",
			imageCover: false
		}
	];

	const listSection: ListSection = {
		id: "my-list-section",
		cards,
		cardSize: "md"
	};

	const imageSection: ImageSection = {
		id: "my-image-section",
		image: {
			src: "/images/rhein-light.webp",
			alt: "Image Section",
			objectFit: "cover",
			aspect: "16/9"
		},
		headline: "Image Section Headline",
		description: "This is the description for the image section.",
		imageSide: "left"
	};

	const videoSection: VideoSection = {
		id: "my-video-section",
		video: {
			provider: "youtube",
			src: "https://www.youtube.com/embed/dQw4w9WgXcQ",
			poster: "/images/video-poster.jpg"
		},
		headline: "Video Section Headline",
		description: "This is the description for the video section.",
		videoSide: "right"
	};
</script>
<Hero section={heroSection} />
<RichText section={richTextSection} />
<List section={listSection} />
<Image section={imageSection} />
<Video section={videoSection} />
