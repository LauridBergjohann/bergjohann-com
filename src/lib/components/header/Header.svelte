<script lang="ts">
	import { Navigation } from '@page-sections/svelte';
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
	let navTick = $state(0);
	let searchPanel = $state<HTMLDivElement>();
	let searchButton = $state<HTMLButtonElement>();
	function closePanels() {
		searchPanel?.hidePopover();
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
		if (event.target instanceof Element && event.target.closest('.ps-navigation summary')) {
			searchPanel?.hidePopover();
		}
	}
	function onResize() {
		if (window.innerWidth >= 1024) searchPanel?.hidePopover();
	}
</script>

<svelte:window onkeydown={onKeydown} onclick={onClick} onresize={onResize} />
<header class="site-header">
	<Navigation
		items={menuItems}
		closeKey={currentPath}
		scrollBehavior="delayed"
		label={messages.navigation.main}
		menuLabel={messages.navigation.open}
		settingsLabel={messages.settings.title}
	>
		{#snippet brand()}<Logo {messages} />{/snippet}
		{#snippet menuIcon()}<Icon id="menu" size={24} />{/snippet}
		{#snippet tools()}
			<div class="desktop-search">
				<Searchbox variant="desktop" closeTick={navTick} {locale} {messages} />
			</div>
			<button
				bind:this={searchButton}
				type="button"
				class="site-header-button mobile-search-button"
				aria-label={messages.search.label}
				aria-controls="mobile-search"
				popovertarget="mobile-search"
			>
				<Icon id="search" size={18} />
			</button>
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
		bind:this={searchPanel}
		id="mobile-search"
		popover="auto"
		ontoggle={onSearchToggle}
		class="site-header-panel overflow-visible p-3 lg:hidden"
	>
		<Searchbox variant="mobile" closeTick={navTick} {locale} {messages} />
	</div>
</header>

<style>
	.desktop-search {
		display: none;
		width: clamp(14rem, 22vw, 22rem);
	}
	@media (min-width: 1024px) {
		.desktop-search {
			display: block;
		}
		.mobile-search-button {
			display: none;
		}
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
</style>
