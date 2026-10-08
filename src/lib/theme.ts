import { writable } from 'svelte/store';

export type ThemePreference = 'light' | 'dark';
type ThemeChoice = { theme: ThemePreference; changedAt: number; source: string };
const storageKey = 'bergjohann-theme';
let choice: ThemeChoice | null = null;
let channel: BroadcastChannel | null = null;
let source = '';

function isChoice(value: unknown): value is ThemeChoice {
	if (!value || typeof value !== 'object') return false;
	const candidate = value as Partial<ThemeChoice>;
	return (
		(candidate.theme === 'light' || candidate.theme === 'dark') &&
		typeof candidate.changedAt === 'number' &&
		Number.isFinite(candidate.changedAt) &&
		candidate.changedAt > 0 &&
		typeof candidate.source === 'string' &&
		candidate.source.length > 0
	);
}

function readChoice(): ThemeChoice | null {
	try {
		const value: unknown = JSON.parse(sessionStorage.getItem(storageKey) ?? 'null');
		return isChoice(value) ? value : null;
	} catch {
		return null;
	}
}

function persistChoice(value: ThemeChoice) {
	try {
		sessionStorage.setItem(storageKey, JSON.stringify(value));
	} catch {
		/* The controls and live tab synchronization also work without storage. */
	}
}

function renderTheme(theme: ThemePreference) {
	document.documentElement.dataset.theme = theme;
	themePreference.set(theme);
}

/** Latest explicit choice wins, including when multiple tabs answer a joining tab. */
function receiveChoice(value: unknown) {
	if (!isChoice(value)) return;
	if (
		choice &&
		(value.changedAt < choice.changedAt ||
			(value.changedAt === choice.changedAt && value.source <= choice.source))
	)
		return;
	choice = value;
	persistChoice(value);
	renderTheme(value.theme);
}

// Header and settings share this store. Cross-document synchronization is ephemeral;
// no theme selection is written to localStorage or sent to a server.
export const themePreference = writable<ThemePreference>('light', () => {
	choice = readChoice();
	source = globalThis.crypto?.randomUUID?.() ?? Date.now() + '-' + Math.random();
	// Discard the former persistent setting without adopting it as a session choice.
	try {
		localStorage.removeItem(storageKey);
	} catch {
		/* Storage is optional. */
	}
	const media = window.matchMedia('(prefers-color-scheme: dark)');
	const refresh = () => renderTheme(choice?.theme ?? (media.matches ? 'dark' : 'light'));
	const synchronize = () => {
		refresh();
		channel?.postMessage({ type: 'request', choice });
	};
	try {
		channel = new BroadcastChannel(storageKey);
		channel.onmessage = (event: MessageEvent<unknown>) => {
			if (!event.data || typeof event.data !== 'object') return;
			const message = event.data as { type?: unknown; choice?: unknown };
			if (message.type !== 'request' && message.type !== 'choice') return;
			receiveChoice(message.choice);
			if (message.type === 'request' && choice) channel?.postMessage({ type: 'choice', choice });
		};
	} catch {
		channel = null;
	}
	media.addEventListener('change', refresh);
	window.addEventListener('pageshow', synchronize);
	synchronize();
	return () => {
		media.removeEventListener('change', refresh);
		window.removeEventListener('pageshow', synchronize);
		channel?.close();
		channel = null;
	};
});

export function changeTheme(theme: ThemePreference) {
	choice = { theme, changedAt: Math.max(Date.now(), (choice?.changedAt ?? 0) + 1), source };
	persistChoice(choice);
	renderTheme(theme);
	channel?.postMessage({ type: 'choice', choice });
}
