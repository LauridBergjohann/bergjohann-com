/** Localized interface text returned by the site API. */
export interface Messages {
	brand: { name: string; logoLight: string; logoDark: string };
	error: { notFound: string; failed: string; backHome: string };
	navigation: {
		main: string;
		mobile: string;
		submenu: string;
		open: string;
		close: string;
		openSubmenu: string;
		closeSubmenu: string;
		home: string;
	};
	settings: {
		title: string;
		language: string;
		appearance: string;
		english: string;
		german: string;
	};
	theme: {
		light: string;
		dark: string;
		system: string;
		useLight: string;
		useDark: string;
		useSystem: string;
	};
	search: {
		label: string;
		submit: string;
		hint: string;
		didYouMean: string;
		noResults: string;
		models: string;
		pages: string;
		allModels: string;
		allPages: string;
		heading: string;
		resultsFor: string;
		emptyQuery: string;
		error: string;
	};
	footer: {
		tagline: string;
		navigation: string;
		source: string;
		linkedin: string;
		imprint: string;
		privacy: string;
	};
	links: {
		home: string;
		search: string;
		imprint: string;
		privacy: string;
		github: string;
		linkedin: string;
	};
}
