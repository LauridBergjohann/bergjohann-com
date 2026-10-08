import { describe, expect, it } from 'vitest';
import { detectLanguage, languageFromHeader, pathFor } from './locale';

describe('language preference detection', () => {
	it('uses German when the first preference is German, including regional variants', () => {
		for (const languages of [['de'], ['de-DE', 'en'], ['de-AT'], ['DE-ch']]) {
			expect(detectLanguage(languages)).toBe('de');
		}
	});

	it('uses English for every other first preference, even when German follows', () => {
		for (const languages of [[], ['en', 'de'], ['fr-FR', 'de-DE'], ['deu'], ['']]) {
			expect(detectLanguage(languages)).toBe('en');
		}
	});

	it('uses the most preferred accepted language for server rendering without JavaScript', () => {
		expect(languageFromHeader('de-AT,de;q=0.9,en;q=0.8')).toBe('de');
		expect(languageFromHeader('fr-FR,fr;q=0.9,de;q=0.8')).toBe('en');
		expect(languageFromHeader('en;q=0.5,de-DE;q=0.9')).toBe('de');
	});

	it('ignores languages explicitly excluded by the browser', () => {
		expect(languageFromHeader('de;q=0,en;q=0.9')).toBe('en');
		expect(languageFromHeader('en;q=0,de;q=1')).toBe('de');
	});

	it('falls back to English without a usable preference', () => {
		for (const value of [null, '', '*']) expect(languageFromHeader(value)).toBe('en');
	});
});

describe('localized paths', () => {
	it('prefixes translated slugs and does not add a trailing slash to home pages', () => {
		expect(pathFor('en', '')).toBe('/en');
		expect(pathFor('de', '')).toBe('/de');
		expect(pathFor('en', 'privacy')).toBe('/en/privacy');
		expect(pathFor('de', 'datenschutz')).toBe('/de/datenschutz');
	});
});
