import { site } from '$lib/site';
import { pathFor, type Locale } from '$lib/i18n/locale';
import type { Messages } from '$lib/i18n/messages';

type TextMessages = Omit<Messages, 'links' | 'brand' | 'settings'> & {
	settings: Omit<Messages['settings'], 'names'>;
};
const translations: Record<Locale, TextMessages> = {
	en: {
		error: {
			notFound: 'Page not found',
			failed: 'Something went wrong',
			backHome: 'Back to the homepage'
		},
		navigation: {
			main: 'Main navigation',
			mobile: 'Mobile navigation',
			submenu: 'submenu',
			open: 'Open navigation',
			close: 'Close navigation',
			openSubmenu: 'Open submenu',
			closeSubmenu: 'Close submenu',
			home: 'bergjohann.com – Home'
		},
		settings: {
			title: 'Settings',
			language: 'Language',
			appearance: 'Appearance',
			english: 'Switch to English',
			englishSelected: 'English is selected as the language',
			german: 'Switch to German',
			germanSelected: 'German is selected as the language'
		},
		theme: {
			light: 'Light',
			dark: 'Dark',
			useLight: 'Switch to light theme',
			useDark: 'Switch to dark theme',
			activeLight: 'The light theme is in use',
			activeDark: 'The dark theme is in use'
		},
		search: {
			label: 'Search',
			submit: 'Submit search',
			hint: 'Enter a keyword (e.g. UX) or search for a topic.',
			didYouMean: 'Did you mean:',
			noResults: 'No results',
			models: 'Models',
			pages: 'Pages',
			allModels: 'Show all model results →',
			allPages: 'Show all page results →',
			heading: 'Search',
			resultsFor: 'Results for',
			emptyQuery: 'Enter at least two characters to search the website.',
			error: 'Search is currently unavailable. Please try again.'
		},
		footer: {
			tagline: 'UX · Engineering · Model Worlds',
			navigation: 'Footer navigation',
			source: 'Source code on GitHub',
			linkedin: 'LinkedIn',
			imprint: 'Imprint',
			privacy: 'Privacy Policy'
		}
	},
	de: {
		error: {
			notFound: 'Seite nicht gefunden',
			failed: 'Etwas ist schiefgelaufen',
			backHome: 'Zur Startseite'
		},
		navigation: {
			main: 'Hauptnavigation',
			mobile: 'Mobile Navigation',
			submenu: 'Untermenü',
			open: 'Navigation öffnen',
			close: 'Navigation schließen',
			openSubmenu: 'Untermenü öffnen',
			closeSubmenu: 'Untermenü schließen',
			home: 'bergjohann.com – Startseite'
		},
		settings: {
			title: 'Einstellungen',
			language: 'Sprache',
			appearance: 'Darstellung',
			english: 'Zu Englisch wechseln',
			englishSelected: 'Englisch ist als Sprache ausgewählt',
			german: 'Zu Deutsch wechseln',
			germanSelected: 'Deutsch ist als Sprache ausgewählt'
		},
		theme: {
			light: 'Hell',
			dark: 'Dunkel',
			useLight: 'Zum hellen Design wechseln',
			useDark: 'Zum dunklen Design wechseln',
			activeLight: 'Es wird das helle Design verwendet',
			activeDark: 'Es wird das dunkle Design verwendet'
		},
		search: {
			label: 'Suche',
			submit: 'Suche absenden',
			hint: 'Gib ein Stichwort (z. B. UX) ein oder suche nach einem Thema.',
			didYouMean: 'Meintest du:',
			noResults: 'Keine Treffer',
			models: 'Modelle',
			pages: 'Seiten',
			allModels: 'Alle Modelltreffer anzeigen →',
			allPages: 'Alle Seitentreffer anzeigen →',
			heading: 'Suche',
			resultsFor: 'Ergebnisse für',
			emptyQuery: 'Gib mindestens zwei Zeichen ein, um die Website zu durchsuchen.',
			error: 'Die Suche ist gerade nicht verfügbar. Bitte versuche es erneut.'
		},
		footer: {
			tagline: 'UX · Softwareentwicklung · Modellwelten',
			navigation: 'Fußnavigation',
			source: 'Quellcode auf GitHub',
			linkedin: 'LinkedIn',
			imprint: 'Impressum',
			privacy: 'Datenschutz'
		}
	}
};

export function getMessages(locale: Locale): Messages {
	return {
		...translations[locale],
		settings: {
			...translations[locale].settings,
			names: { en: 'english', de: 'deutsch' }
		},
		brand: {
			name: site.name,
			logoLight: '/branding/logo-light.svg',
			logoDark: '/branding/logo-dark.svg'
		},
		links: {
			github: site.github,
			linkedin: site.linkedin,
			home: pathFor(locale, ''),
			search: pathFor(locale, locale === 'de' ? 'suche' : 'search'),
			imprint: pathFor(locale, locale === 'de' ? 'impressum' : 'imprint'),
			privacy: pathFor(locale, locale === 'de' ? 'datenschutz' : 'privacy')
		}
	};
}
