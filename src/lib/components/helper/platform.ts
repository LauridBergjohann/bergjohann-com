export function isMacPlatform(): boolean {
	if (typeof navigator === 'undefined') return false;
	return /Mac|iPhone|iPad|iPod/i.test(navigator.platform);
}

export function shortcutLabel(): string {
	return isMacPlatform() ? '⌘ + K' : 'Ctrl + K';
}
