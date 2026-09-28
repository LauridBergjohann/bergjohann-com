export type SearchGroup = 'models' | 'pages';

export type SearchHitBase = {
	href: string;
	label: string;
	image?: string;
	icon?: string;
};

export type SearchResults = {
	models?: SearchHitBase[];
	pages?: SearchHitBase[];
	didYouMean?: string[];
};

export type FlatItem = SearchHitBase & {
	group: SearchGroup;
	indexInGroup: number;
};
