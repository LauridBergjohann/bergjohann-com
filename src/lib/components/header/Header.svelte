<script lang="ts">
	import Icon from '$lib/components/ui/Icon.svelte';
	import DesktopMenu from './DesktopMenu.svelte';
	import MobileMenu from './MobileMenu.svelte';
	import type { NavigationEntry } from '$lib/api/navigation-api';
	import { afterNavigate } from '$app/navigation';
	import { tick } from 'svelte';
	import Searchbox from './Searchbox.svelte';
	import Logo from './Logo.svelte';
	import ThemeSwitch from '../ui/ThemeSwitch.svelte';

	const { currentPath, navigation } = $props<{
		currentPath: string;
		navigation: NavigationEntry[];
	}>();
	let mobileOpen = $state(false);
	let searchOpen = $state(false);
	let navTick = $state(0);
	let navDropdownOpen = $state(false);
	let settingsOpen = $state(false);
	let settingsPanel = $state<HTMLDivElement>();
	let searchButton = $state<HTMLButtonElement>();
	let searchPanel = $state<HTMLDivElement>();
	let headerElement = $state<HTMLElement>();

	function onPointerDown(event: PointerEvent) {
		if (!mobileOpen && !searchOpen) return;
		if (headerElement && event.composedPath().includes(headerElement)) return;
		mobileOpen = false;
		searchOpen = false;
	}

	function closePanels() {
		mobileOpen = false;
		searchOpen = false;
		settingsPanel?.hidePopover();
	}
	afterNavigate(() => {
		closePanels();
		navTick += 1;
		navDropdownOpen = false;
	});

	async function toggleSearch() {
		searchOpen = !searchOpen;
		mobileOpen = false;
		settingsPanel?.hidePopover();
		if (searchOpen) {
			await tick();
			searchPanel?.querySelector('input')?.focus();
		}
	}
	function onKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' && searchOpen) {
			searchOpen = false;
			searchButton?.focus();
		}
		if (
			(event.ctrlKey || event.metaKey) &&
			event.key.toLowerCase() === 'k' &&
			searchButton?.getClientRects().length
		) {
			event.preventDefault();
			if (!searchOpen) void toggleSearch();
		}
	}
	function onResize() {
		if (window.innerWidth >= 1024) searchOpen = false;
		if (window.innerWidth >= 1280) mobileOpen = false;
		if (window.innerWidth >= 1536) settingsPanel?.hidePopover();
	}
</script>

<svelte:window onkeydown={onKeydown} onresize={onResize} onpointerdown={onPointerDown} />

<header
	bind:this={headerElement}
	class="fixed inset-x-0 top-[var(--header-top)] z-40 mx-auto border-b border-border/60 bg-header/95 shadow-md backdrop-blur-xl 2xl:max-w-[var(--content-narrow-width)] 2xl:rounded-2xl 2xl:border 2xl:shadow-lg"
>
	<div class="flex h-[var(--header-height)] w-full items-center gap-2 px-[11px] sm:gap-4">
		<div class="flex min-w-0 items-center gap-1 sm:gap-3">
			<button
				type="button"
				class="shrink-0 rounded-lg p-2 text-foreground-soft hover:text-foreground focus-visible:ring-2 focus-visible:ring-link focus-visible:outline-none xl:hidden"
				onclick={() => {
					mobileOpen = !mobileOpen;
					searchOpen = false;
					settingsPanel?.hidePopover();
				}}
				aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'}
				aria-expanded={mobileOpen}
				aria-controls="mobile-menu"
			>
				<Icon id="menu" size={28} />
			</button>
			<Logo />
		</div>
		<DesktopMenu
			{currentPath}
			{navigation}
			closeTick={navTick}
			onDropdownOpenChange={(open) => (navDropdownOpen = open)}
		/>
		<div
			class="relative z-50 ml-auto flex min-w-0 shrink-0 items-center justify-end gap-1 sm:gap-2 lg:w-[22rem] xl:w-[24rem]"
		>
			<div class="hidden min-w-0 flex-1 lg:block">
				<Searchbox variant="desktop" closeTick={navTick} />
			</div>
			<button
				bind:this={searchButton}
				type="button"
				class="inline-flex h-10 w-10 items-center justify-center rounded-lg text-foreground-soft hover:bg-surface-hover hover:text-foreground focus-visible:ring-2 focus-visible:ring-link focus-visible:outline-none lg:hidden"
				aria-label="Open search"
				aria-expanded={searchOpen}
				aria-controls="mobile-search"
				onclick={toggleSearch}
			>
				<Icon id="search" size={18} />
			</button>
			<button
				type="button"
				class="inline-flex h-10 w-10 items-center justify-center rounded-lg text-foreground-soft hover:bg-surface-hover hover:text-foreground focus-visible:ring-2 focus-visible:ring-link focus-visible:outline-none 2xl:hidden"
				aria-label="Appearance settings"
				aria-expanded={settingsOpen}
				aria-controls="appearance-settings"
				aria-haspopup="dialog"
				popovertarget="appearance-settings"
				onclick={() => {
					mobileOpen = false;
					searchOpen = false;
				}}
			>
				<Icon id="settings" size={18} />
			</button>
		</div>
	</div>
	<MobileMenu {navigation} {currentPath} open={mobileOpen} closeTick={navTick} />
	{#if searchOpen}
		<div
			bind:this={searchPanel}
			id="mobile-search"
			class="border-t border-border bg-header p-3 lg:hidden"
		>
			<Searchbox variant="mobile" closeTick={navTick} />
		</div>
	{/if}
	<div
		bind:this={settingsPanel}
		id="appearance-settings"
		popover="auto"
		role="dialog"
		aria-label="Appearance settings"
		ontoggle={(event) => (settingsOpen = event.newState === 'open')}
		class="fixed inset-auto top-[calc(var(--header-top)+var(--header-height)+0.5rem)] right-2 m-0 max-w-[calc(100vw-1rem)] space-y-3 rounded-2xl border border-border-strong bg-surface-raised p-4 text-foreground shadow-lg sm:right-4 2xl:hidden"
	>
		<p class="text-sm font-semibold">Appearance</p>
		<ThemeSwitch labelled />
	</div>
</header>

<div
	class="fixed top-[var(--header-top)] right-6 z-40 hidden h-[calc(var(--header-height)+2px)] items-center 2xl:flex"
	data-header-appearance
>
	<div class="rounded-lg bg-header/95 shadow-md backdrop-blur-xl"><ThemeSwitch /></div>
</div>

<div
	class={`pointer-events-none fixed inset-x-0 top-[calc(var(--header-top)+var(--header-height)+2px)] bottom-0 z-30 backdrop-blur-[3px] transition-opacity duration-200 ${navDropdownOpen ? 'opacity-100' : 'opacity-0'}`}
	aria-hidden="true"
></div>
