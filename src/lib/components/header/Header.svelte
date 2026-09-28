<script lang="ts">
	import Icon from '$lib/components/ui/Icon.svelte';
	import DesktopMenu from './DesktopMenu.svelte';
	import MobileMenu from './MobileMenu.svelte';
	import type { NavigationEntry } from '$lib/api/navigation-api';
	import { afterNavigate } from '$app/navigation';
	import Searchbox from './Searchbox.svelte';
	import Logo from './Logo.svelte';
	import ThemeSwitch from '../ui/ThemeSwitch.svelte';

	const { currentPath, navigation } = $props<{
		currentPath: string;
		navigation: NavigationEntry[];
	}>();

	let mobileOpen = $state(false);
	let navTick = $state(0);

	let navDropdownOpen = $state(false);
	function setNavDropdownOpen(v: boolean) {
		navDropdownOpen = v;
	}

	afterNavigate(() => {
		mobileOpen = false;
		navTick += 1;
		navDropdownOpen = false;
	});
</script>

<header
	class="fixed inset-x-2 top-[var(--header-top)] z-40 mx-auto max-w-7xl rounded-2xl border border-border/60 bg-background/80 shadow-lg backdrop-blur-xl md:inset-x-6"
>
	<div
		class="flex h-[var(--header-height)] w-full items-center gap-2 px-2 sm:gap-4 sm:px-4 md:px-6"
	>
		<div class="flex min-w-0 items-center gap-1 sm:gap-3">
			<button
				type="button"
				class="block rounded p-2 text-foreground-soft hover:text-foreground
					focus:ring-2 focus:ring-accent focus:outline-none xl:hidden"
				onclick={() => (mobileOpen = !mobileOpen)}
				aria-label={mobileOpen ? 'Menü schließen' : 'Menü öffnen'}
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
			onDropdownOpenChange={setNavDropdownOpen}
		/>

		<div
			class="relative z-50 ml-auto flex min-w-0 shrink-0 items-center justify-end gap-1 sm:gap-2 lg:w-[20rem] xl:w-[24rem]"
		>
			<div class="hidden min-w-0 flex-1 lg:block">
				<Searchbox variant="desktop" closeTick={navTick} />
			</div>

			<button
				type="button"
				class="inline-flex h-10 w-10 items-center justify-center rounded
					text-foreground-soft hover:text-foreground
					focus:ring-2 focus:ring-accent focus:outline-none lg:hidden"
				aria-label="Suche öffnen"
				aria-expanded={mobileOpen}
				aria-controls="mobile-menu"
				onclick={() => (mobileOpen = true)}
			>
				<Icon id="search" />
			</button>

			<div class="hidden sm:block"><ThemeSwitch /></div>
		</div>
	</div>
	<MobileMenu {navigation} open={mobileOpen} closeTick={navTick} />
</header>

<!-- Blur nur wenn Dropdown offen -->
<div
	class={'pointer-events-none fixed inset-x-0 top-[calc(var(--header-top)+var(--header-height)+2px)] bottom-0 z-30 ' +
		'backdrop-blur-[3px] transition-opacity duration-200 ' +
		(navDropdownOpen ? 'opacity-100' : 'opacity-0')}
	aria-hidden="true"
></div>
