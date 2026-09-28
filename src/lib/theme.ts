import { writable } from 'svelte/store';

export type ThemePreference = 'light' | 'dark' | 'system';
const storageKey = 'bergjohann-theme';
let current: ThemePreference = 'system';

function readPreference(): ThemePreference {
	try {
		const value = localStorage.getItem(storageKey);
		return value === 'light' || value === 'dark' ? value : 'system';
	} catch {
		return 'system';
	}
}

function applyTheme() {
	document.documentElement.dataset.theme =
		current === 'dark' ||
		(current === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
			? 'dark'
			: 'light';
}

// Subscribed on mount only; both header and mobile controls share this preference.
export const themePreference = writable<ThemePreference>('system', (set) => {
	current = readPreference();
	set(current);
	applyTheme();
	const media = window.matchMedia('(prefers-color-scheme: dark)');
	const onSystemChange = () => {
		if (current === 'system') applyTheme();
	};
	const onStorage = (event: StorageEvent) => {
		if (event.key !== storageKey && event.key !== null) return;
		current = readPreference();
		set(current);
		applyTheme();
	};
	media.addEventListener('change', onSystemChange);
	window.addEventListener('storage', onStorage);
	return () => {
		media.removeEventListener('change', onSystemChange);
		window.removeEventListener('storage', onStorage);
	};
});

export function changeTheme(value: ThemePreference) {
	current = value;
	themePreference.set(value);
	applyTheme();
	try {
		if (value === 'system') localStorage.removeItem(storageKey);
		else localStorage.setItem(storageKey, value);
	} catch {
		// The selection still works for this session when storage is unavailable.
	}
}
