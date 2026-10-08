import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import type { ContentPage } from '$lib/api/content';
import { locales, pathFor } from '$lib/i18n/locale';
import { findPageBySlug, getPage, getPages } from './content';

function visit(
	value: unknown,
	check: (value: unknown, path: string[]) => void,
	path: string[] = []
) {
	check(value, path);
	if (value && typeof value === 'object') {
		for (const [key, child] of Object.entries(value)) visit(child, check, [...path, key]);
	}
}

function structure(value: unknown): unknown {
	if (Array.isArray(value)) return value.map(structure);
	if (value && typeof value === 'object') {
		return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, structure(child)]));
	}
	return typeof value;
}

function media(page: ContentPage): string[] {
	const paths: string[] = [];
	visit(page, (value) => {
		if (typeof value === 'string' && value.startsWith('/images/')) paths.push(value);
	});
	return paths;
}

describe('localized page content', () => {
	it('resolves each translated slug to the same page identity', () => {
		const expectedIds = [
			'home',
			'blog',
			'projects',
			'workbench',
			'about',
			'privacy',
			'imprint',
			'sections'
		];
		for (const locale of locales) {
			const pages = getPages(locale);
			expect(pages.map((page) => page.id)).toEqual(expectedIds);
			expect(new Set(pages.map((page) => page.slug)).size).toBe(pages.length);
			for (const page of pages) {
				expect(getPage(locale, page.slug)?.id).toBe(page.id);
				expect(findPageBySlug(page.slug)?.id).toBe(page.id);
				expect(page.locale).toBe(locale);
				expect(page.slugs[locale]).toBe(page.slug);
			}
		}
		expect(getPage('de', 'privacy')).toBeUndefined();
		expect(getPage('en', 'datenschutz')).toBeUndefined();
		expect(findPageBySlug('missing-page')).toBeUndefined();
	});

	it('returns translated text while exposing only slugs for the other language', () => {
		expect(getPage('de', 'datenschutz')?.hero.headline).toBe('Datenschutzerklärung');
		expect(getPage('en', 'privacy')?.hero.headline).toBe('Privacy Policy');
		for (const locale of locales) {
			for (const page of getPages(locale)) {
				visit(page, (value, path) => {
					if (value && typeof value === 'object' && 'en' in value && 'de' in value) {
						expect(path).toEqual(['slugs']);
					}
					if (typeof value === 'string') expect(value).not.toContain('\uFFFD');
				});
			}
		}
	});

	it('keeps page structures and all light/dark media identical between languages', () => {
		for (const english of getPages('en')) {
			const german = getPage('de', english.slugs.de)!;
			expect(structure(english)).toEqual(structure(german));
			expect(english.sections.map(({ id, type }) => ({ id, type }))).toEqual(
				german.sections.map(({ id, type }) => ({ id, type }))
			);
			expect(media(english)).toEqual(media(german));
			for (const path of media(english)) {
				expect(existsSync(resolve('static', path.slice(1))), path).toBe(true);
			}
		}
	});

	it('links only to existing pages in the active language or valid external destinations', () => {
		for (const locale of locales) {
			const validPaths = new Set(getPages(locale).map((page) => pathFor(locale, page.slug)));
			for (const page of getPages(locale)) {
				visit(page, (value, path) => {
					if (path.at(-1) !== 'href' || typeof value !== 'string') return;
					if (value.startsWith('/')) expect(validPaths.has(value), value).toBe(true);
					else expect(new URL(value).protocol).toMatch(/^(https:|mailto:)$/);
				});
			}
		}
		expect(getPage('de', '')?.actions?.[0].href).toBe('/de/projekte');
		expect(getPage('en', '')?.actions?.[0].href).toBe('/en/projects');
	});
});
