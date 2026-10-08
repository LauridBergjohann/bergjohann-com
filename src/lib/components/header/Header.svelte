<script lang="ts">
	import Icon from '$lib/components/ui/Icon.svelte';
	import DesktopMenu from './DesktopMenu.svelte';
	import MobileMenu from './MobileMenu.svelte';
	import type { NavigationEntry } from '$lib/api/navigation-api';
	import type { Locale } from '$lib/i18n/locale';
	import type { Messages } from '$lib/i18n/messages';
	import { afterNavigate } from '$app/navigation';
	import { tick } from 'svelte';
	import Searchbox from './Searchbox.svelte';
	import Logo from './Logo.svelte';
	import ThemeSwitch from '../ui/ThemeSwitch.svelte';
	import LanguageSwitch from '../ui/LanguageSwitch.svelte';

	const { currentPath, navigation, locale, messages, slugs } = $props<{
		currentPath: string;
		navigation: NavigationEntry[];
		locale: Locale;
		messages: Messages;
		slugs: Record<Locale, string>;
	}>();
	let mobileOpen = $state(false);
	let navTick = $state(0);
	let navDropdownOpen = $state(false);
	let mobilePanel = $state<HTMLDivElement>();
	let searchPanel = $state<HTMLDivElement>();
	let settingsPanel = $state<HTMLDivElement>();
	let searchButton = $state<HTMLButtonElement>();

	function closePanels() {
		mobilePanel?.hidePopover();
		searchPanel?.hidePopover();
		settingsPanel?.hidePopover();
	}
	afterNavigate(() => {
		closePanels();
		navTick += 1;
		navDropdownOpen = false;
	});
	async function onSearchToggle(event: ToggleEvent) {
		if (event.newState === 'open') {
			await tick();
			searchPanel?.querySelector('input')?.focus();
		}
	}
	function onKeydown(event: KeyboardEvent) {
		if (
			(event.ctrlKey || event.metaKey) &&
			event.key.toLowerCase() === 'k' &&
			searchButton?.getClientRects().length
		) {
			event.preventDefault();
			searchPanel?.showPopover();
		}
	}
	function onResize() {
		if (window.innerWidth >= 1024) searchPanel?.hidePopover();
		if (window.innerWidth >= 1280) mobilePanel?.hidePopover();
		if (window.innerWidth >= 1536) settingsPanel?.hidePopover();
	}
</script>

<svelte:window onkeydown={onKeydown} onresize={onResize} />

<header
	class="fixed inset-x-0 top-[var(--header-top)] z-40 mx-auto border-b border-border/60 bg-header/95 shadow-md backdrop-blur-xl 2xl:max-w-[var(--content-narrow-width)] 2xl:rounded-2xl 2xl:border 2xl:shadow-lg"
>
	<div class="flex h-[var(--header-height)] w-full items-center gap-2 px-[11px] sm:gap-4">
		<div class="flex min-w-0 items-center gap-1 sm:gap-3">
			<button
				type="button"
				class="shrink-0 rounded-lg p-2 text-foreground-soft hover:text-foreground focus-visible:ring-2 focus-visible:ring-link focus-visible:outline-none xl:hidden"
				aria-label={mobileOpen ? messages.navigation.close : messages.navigation.open}
				aria-controls="mobile-menu-panel"
				popovertarget="mobile-menu-panel"
			>
				<Icon id="menu" size={28} />
			</button>
			<Logo {messages} />
		</div>
		<DesktopMenu
			{currentPath}
			{navigation}
			{messages}
			closeTick={navTick}
			onDropdownOpenChange={(open) => (navDropdownOpen = open)}
		/>
		<div
			class="relative z-50 ml-auto flex min-w-0 shrink-0 items-center justify-end gap-1 sm:gap-2 lg:w-[22rem] xl:w-[24rem]"
		>
			<div class="hidden min-w-0 flex-1 lg:block">
				<Searchbox variant="desktop" closeTick={navTick} {locale} {messages} />
			</div>
			<button
				bind:this={searchButton}
				type="button"
				class="inline-flex h-10 w-10 items-center justify-center rounded-lg text-foreground-soft hover:bg-surface-hover hover:text-foreground focus-visible:ring-2 focus-visible:ring-link focus-visible:outline-none lg:hidden"
				aria-label={messages.search.label}
				aria-controls="mobile-search"
				popovertarget="mobile-search"
			>
				<Icon id="search" size={18} />
			</button>
			<button
				type="button"
				class="inline-flex h-10 w-10 items-center justify-center rounded-lg text-foreground-soft hover:bg-surface-hover hover:text-foreground focus-visible:ring-2 focus-visible:ring-link focus-visible:outline-none 2xl:hidden"
				aria-label={messages.settings.title}
				aria-controls="appearance-settings"
				aria-haspopup="dialog"
				popovertarget="appearance-settings"
			>
				<Icon id="settings" size={18} />
			</button>
		</div>
	</div>
	<div
		bind:this={mobilePanel}
		id="mobile-menu-panel"
		popover="auto"
		ontoggle={(event) => (mobileOpen = event.newState === 'open')}
		class="fixed inset-x-0 top-[calc(var(--header-top)+var(--header-height))] bottom-auto m-0 w-full max-w-none border-0 bg-transparent p-0 text-foreground shadow-lg xl:hidden"
	>
		<MobileMenu {navigation} {currentPath} {messages} closeTick={navTick} />
	</div>
	<div
		bind:this={searchPanel}
		id="mobile-search"
		popover="auto"
		ontoggle={onSearchToggle}
		class="fixed inset-x-0 top-[calc(var(--header-top)+var(--header-height))] bottom-auto m-0 w-full max-w-none overflow-visible border-0 border-t border-border bg-header p-3 text-foreground shadow-lg lg:hidden"
	>
		<Searchbox variant="mobile" closeTick={navTick} {locale} {messages} />
	</div>
	<div
		bind:this={settingsPanel}
		id="appearance-settings"
		popover="auto"
		role="dialog"
		aria-label={messages.settings.title}
		class="fixed inset-auto top-[calc(var(--header-top)+var(--header-height)+0.5rem)] right-2 m-0 max-w-[calc(100vw-1rem)] space-y-4 rounded-2xl border border-border-strong bg-surface-raised p-4 text-foreground shadow-lg sm:right-4 2xl:hidden"
	>
		<div class="space-y-2">
			<p class="text-sm font-semibold">{messages.settings.language}</p>
			<LanguageSwitch {locale} {messages} {slugs} />
		</div>
		<div class="space-y-2">
			<p class="text-sm font-semibold">{messages.settings.appearance}</p>
			<ThemeSwitch labelled {messages} />
		</div>
	</div>
</header>

<div
	class="fixed top-[var(--header-top)] left-6 z-40 hidden h-[calc(var(--header-height)+2px)] items-center 2xl:flex"
	data-header-language
>
	<div class="rounded-lg bg-header/95 shadow-md backdrop-blur-xl">
		<LanguageSwitch {locale} {messages} {slugs} />
	</div>
</div>
<div
	class="fixed top-[var(--header-top)] right-6 z-40 hidden h-[calc(var(--header-height)+2px)] items-center 2xl:flex"
	data-header-appearance
>
	<div class="rounded-lg bg-header/95 shadow-md backdrop-blur-xl"><ThemeSwitch {messages} /></div>
</div>

<div
	class={'pointer-events-none fixed inset-x-0 top-[calc(var(--header-top)+var(--header-height)+2px)] bottom-0 z-30 backdrop-blur-[3px] transition-opacity duration-200 ' +
		(navDropdownOpen ? 'opacity-100' : 'opacity-0')}
	aria-hidden="true"
></div>
