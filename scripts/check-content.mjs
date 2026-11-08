import { readFileSync, readdirSync } from 'node:fs';
import { dirname, resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const directory = resolve(root, 'src/lib/server/data/pages');
const read = (name) => JSON.parse(readFileSync(resolve(directory, name), 'utf8'));
const order = read('index.json');
if (
	!Array.isArray(order) ||
	order.some((id) => typeof id !== 'string' || !/^[a-z0-9-]+$/.test(id))
) {
	throw new Error(
		'pages/index.json must contain page IDs (lowercase letters, numbers and hyphens).'
	);
}
if (new Set(order).size !== order.length)
	throw new Error('Duplicate page IDs in pages/index.json.');
const filenames = readdirSync(directory).filter((name) => name.endsWith('.page.json'));
if (
	filenames.length !== order.length ||
	order.some((id) => !filenames.includes(`${id}.page.json`))
) {
	throw new Error('pages/index.json must list every .page.json file exactly once.');
}

// Check JSON literals against the actual package types, without duplicating their
// schema or widening discriminator strings as TypeScript JSON imports would do.
// Virtual source files are used only by the compiler; no generated files are written.
const configPath = resolve(root, 'tsconfig.json');
const config = ts.readConfigFile(configPath, ts.sys.readFile);
if (config.error) throw new Error(ts.flattenDiagnosticMessageText(config.error.messageText, '\n'));
const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, root);
const virtual = new Map();
const slugs = { en: new Set(), de: new Set() };
for (const id of order) {
	const name = `${id}.page.json`;
	const document = read(name);
	if (document.id !== id) throw new Error(`${name}: id must match the filename.`);
	for (const locale of ['en', 'de']) {
		const slug = document.slugs?.[locale];
		if (typeof slug !== 'string' || (slug !== '' && !/^[a-z0-9-]+(?:\/[a-z0-9-]+)*$/.test(slug))) {
			throw new Error(`${name}: invalid ${locale} slug.`);
		}
		if (slugs[locale].has(slug)) throw new Error(`${name}: duplicate ${locale} slug "${slug}".`);
		slugs[locale].add(slug);
	}
	const path = resolve(directory, `${name}.ts`);
	virtual.set(
		path,
		`import type { PageDocument } from '../../content-model';\nconst document: PageDocument = ${JSON.stringify(document, null, '\t')};\nexport default document;\n`
	);
}
const options = { ...parsed.options, noEmit: true, incremental: false };
const host = ts.createCompilerHost(options);
const originalGetSourceFile = host.getSourceFile.bind(host);
host.getSourceFile = (file, languageVersion, onError, shouldCreateNewSourceFile) => {
	const source = virtual.get(resolve(file));
	return source === undefined
		? originalGetSourceFile(file, languageVersion, onError, shouldCreateNewSourceFile)
		: ts.createSourceFile(file, source, languageVersion, true);
};
const program = ts.createProgram([...virtual.keys()], options, host);
const diagnostics = [...parsed.errors, ...ts.getPreEmitDiagnostics(program)];
if (diagnostics.length) {
	console.error(
		ts.formatDiagnosticsWithColorAndContext(diagnostics, {
			getCurrentDirectory: () => root,
			getCanonicalFileName: (file) => relative(root, file),
			getNewLine: () => '\n'
		})
	);
	process.exitCode = 1;
} else {
	console.log(`Validated ${order.length} JSON page documents against Page Sections types.`);
}
