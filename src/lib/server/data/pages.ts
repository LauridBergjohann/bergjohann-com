import type { Page } from '$lib/server/page';

export const pages: Page[] = [
	{
		id: '1',
		slug: 'blog',
		title: 'Blog',
		image: '/images/blog-icon.png',
		sections: [
			{
				id: 'hero',
				type: 'heroImage',
				image: {
					src: '/images/blog-hero-light.png',
					srcDark: '/images/blog-hero-dark.png',
					alt: 'Blog'
				},
				layout: 'full',
				headline: 'Blog',
				size: 'sm',
				introduction: 'This blog is a work in progress.'
			}
		]
	},
	{
		id: '2',
		slug: 'projects',
		title: 'Projects',
		image: 'frigolink.jpg',
		sections: [
			{
				id: 'hero',
				type: 'heroImage',
				image: {
					src: '/images/projects-hero-light.png',
					srcDark: '/images/projects-hero-dark.png',
					alt: 'Projects'
				},
				layout: 'full',
				headline: 'Projects',
				size: 'sm',
				introduction: 'This Project-Section is a work in progress.'
			}
		]
	},
	{
		id: '3',
		slug: 'workbench',
		title: 'Workbench',
		image: 'frigolink.jpg',
		sections: [
			{
				id: 'hero',
				type: 'heroImage',
				image: {
					src: '/images/workbench-hero-light.png',
					srcDark: '/images/workbench-hero-dark.png',
					alt: 'Workbench'
				},
				layout: 'full',
				headline: 'Workbench',
				size: 'sm',
				introduction: 'This Workbench-Section is a work in progress.'
			}
		]
	},
	{
		id: '4',
		slug: 'about',
		title: 'About',
		image: 'frigolink.jpg',
		sections: [
			{
				id: 'hero',
				type: 'heroImage',
				image: {
					src: '/images/about-hero-light.png',
					srcDark: '/images/about-hero-dark.png',
					alt: 'About'
				},
				layout: 'full',
				headline: 'About',
				size: 'sm',
				introduction: 'This Section about me is a work in progress.'
			}
		]
	}
];
