export type SearchHit = {
	type: 'page' | 'model';
	id: string;
	label: string;
	href: string;
	image: string;
	score: number;
};
export type SearchResponse = {
	query: string;
	models: SearchHit[];
	pages: SearchHit[];
	didYouMean?: string[];
};
