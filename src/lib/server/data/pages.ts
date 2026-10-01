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
					src: '/images/heroes/blog.png',
					alt: '',
					objectFit: 'contain'
				},
				layout: 'full',
				textBackground: false,
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
					src: '/images/heroes/projects.png',
					alt: '',
					objectFit: 'contain'
				},
				layout: 'full',
				textBackground: false,
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
					src: '/images/heroes/workbench.png',
					alt: '',
					objectFit: 'contain'
				},
				layout: 'full',
				textBackground: false,
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
					src: '/images/heroes/about.png',
					alt: '',
					objectFit: 'contain'
				},
				layout: 'full',
				textBackground: false,
				headline: 'About',
				size: 'sm',
				introduction: 'This Section about me is a work in progress.'
			}
		]
	}
];
