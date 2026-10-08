import type { Messages } from '$lib/i18n/messages';
/** Minimal API message fixture used by theme integration tests. */
export const themeMessages = {
	settings: { appearance: 'Appearance' },
	theme: {
		light: 'Light',
		dark: 'Dark',
		useLight: 'Use light theme',
		useDark: 'Use dark theme'
	}
} as Messages;
