import type { Messages } from '$lib/i18n/messages';
/** Minimal API message fixture used by theme integration tests. */
export const themeMessages = {
	settings: { appearance: 'Appearance' },
	theme: {
		light: 'Light',
		dark: 'Dark',
		useLight: 'Switch to light theme',
		useDark: 'Switch to dark theme',
		activeLight: 'The light theme is in use',
		activeDark: 'The dark theme is in use'
	}
} as Messages;
