import type { PageDocument } from './content-model';
import order from './data/pages/index.json';

// Eager, server-only imports are bundled into the deployment. No runtime filesystem
// or sibling checkout is required. check:content validates these documents before builds.
const files = import.meta.glob('./data/pages/*.page.json', { eager: true, import: 'default' });

export const pageDocuments: readonly PageDocument[] = order.map((id) => {
	const document = files[`./data/pages/${id}.page.json`];
	if (!document) throw new Error(`Missing page document: ${id}.page.json`);
	return document as PageDocument;
});
