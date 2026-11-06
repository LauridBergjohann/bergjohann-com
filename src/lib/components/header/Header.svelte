<script lang="ts">
	import { Navigation, MainMenu } from '@page-sections/svelte';
	import type { MenuItem } from '@page-sections/core';
	import { afterNavigate } from '$app/navigation';
	import { tick } from 'svelte';
	import type { NavigationEntry } from '$lib/api/navigation-api';
	import type { Locale } from '$lib/i18n/locale';
	import type { Messages } from '$lib/i18n/messages';
	import Icon from '$lib/components/ui/Icon.svelte';
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
	const menuItems = $derived(markCurrent(navigation));
	function markCurrent(items: MenuItem[]): MenuItem[] {
		return items.map((item) => ({
			...item,
			current: item.href === currentPath,
			children: item.children ? markCurrent(item.children) : undefined
		}));
	}
	let header = $state<HTMLElement>();
	let mobileOpen = $state(false);
	let navTick = $state(0);
	let mobilePanel = $state<HTMLDivElement>();
	let searchPanel = $state<HTMLDivElement>();
	let searchButton = $state<HTMLButtonElement>();
	function closePanels() {
		mobilePanel?.hidePopover();
		searchPanel?.hidePopover();
		header
			?.querySelectorAll('details[open]')
			.forEach((el) => ((el as HTMLDetailsElement).open = false));
	}
	afterNavigate(() => {
		closePanels();
		navTick += 1;
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
	function onClick(event: MouseEvent) {
		if (event.target instanceof Element && event.target.closest('.settings > summary')) {
			mobilePanel?.hidePopover();
			searchPanel?.hidePopover();
		}
	}
	function onResize() {
		if (window.innerWidth >= 1024) searchPanel?.hidePopover();
		if (window.innerWidth >= 1280) mobilePanel?.hidePopover();
	}
</script>

<svelte:window onkeydown={onKeydown} onclick={onClick} onresize={onResize} />

<!-- Website behavior: the package navigation remains sticky for the first 112px. -->
<div class="header-scroll-range">
	<div class="header-sticky">
		<header bind:this={header} class="site-header">
			<Navigation label={messages.navigation.main} settingsLabel={messages.settings.title}>
				{#snippet brand()}
					<div class="flex items-center gap-1 sm:gap-3">
						<button
							type="button"
							class="site-header-button xl:hidden"
							aria-label={mobileOpen ? messages.navigation.close : messages.navigation.open}
							aria-controls="mobile-menu-panel"
							popovertarget="mobile-menu-panel"
						>
							<Icon id="menu" size={28} />
						</button>
						<Logo {messages} />
					</div>
				{/snippet}
				{#snippet menu()}
					<div class="flex min-w-0 items-center justify-end gap-4">
						<div class="site-desktop-menu hidden min-w-0 flex-1 xl:block">
							<MainMenu items={menuItems} />
						</div>
						<div class="hidden w-[22rem] min-w-0 shrink lg:block">
							<Searchbox variant="desktop" closeTick={navTick} {locale} {messages} />
						</div>
						<button
							bind:this={searchButton}
							type="button"
							class="site-header-button lg:hidden"
							aria-label={messages.search.label}
							aria-controls="mobile-search"
							popovertarget="mobile-search"
						>
							<Icon id="search" size={18} />
						</button>
					</div>
				{/snippet}
				{#snippet left()}
					<div data-header-language>
						<p class="preference-heading">{messages.settings.language}</p>
						<LanguageSwitch labelled="responsive" {locale} {messages} {slugs} />
					</div>
				{/snippet}
				{#snippet right()}
					<div data-header-appearance>
						<p class="preference-heading">{messages.settings.appearance}</p>
						<ThemeSwitch labelled="responsive" {messages} />
					</div>
				{/snippet}
				{#snippet settingsIcon()}<Icon id="settings" size={18} />{/snippet}
			</Navigation>
			<div
				bind:this={mobilePanel}
				id="mobile-menu-panel"
				popover="auto"
				ontoggle={(event) => (mobileOpen = event.newState === 'open')}
				class="site-header-panel site-mobile-menu xl:hidden"
			>
				<nav aria-label={messages.navigation.mobile}><MainMenu items={menuItems} /></nav>
			</div>
			<div
				bind:this={searchPanel}
				id="mobile-search"
				popover="auto"
				ontoggle={onSearchToggle}
				class="site-header-panel overflow-visible p-3 lg:hidden"
			>
				<Searchbox variant="mobile" closeTick={navTick} {locale} {messages} />
			</div>
		</header>
	</div>
</div>

<style>
	.header-scroll-range {
		position: absolute;
		inset-inline: 0;
		top: 0;
		height: calc(var(--header-height) + 112px);
		z-index: 40;
		pointer-events: none;
	}
	.header-sticky {
		position: sticky;
		top: 0;
		height: var(--header-height);
		pointer-events: auto;
	}
	.site-header-panel {
		position: absolute;
		position-anchor: --site-header;
		inset: auto 0;
		top: anchor(bottom);
		margin: 0;
		width: 100%;
		max-width: none;
		border: 0;
		border-top: 1px solid var(--border);
		color: var(--foreground);
		background: var(--header-background);
		box-shadow: 0 12px 32px #0002;
	}
	.site-mobile-menu {
		max-height: calc(100dvh - var(--header-height));
		overflow-y: auto;
		padding: 1rem;
	}
</style>
