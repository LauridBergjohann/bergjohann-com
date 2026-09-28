<!-- desktop-menu.svelte -->
<script lang="ts">
	import { onMount, tick } from "svelte";
	import Navigationlink from "./Navigationlink.svelte";
	import type { NavigationEntry } from "$lib/api/navigation-api";

	const {
		currentPath,
		navigation,
		closeTick,
		onDropdownOpenChange
	} = $props<{
		currentPath: string;
		navigation: NavigationEntry[];
		closeTick: number;
		onDropdownOpenChange?: (open: boolean) => void;
	}>();

	// ---------------- Submenu open/close ----------------
	let openHref = $state<string | null>(null);

	const CLOSE_DELAY = 300;
	let closeTimer: number | null = null;

	function clearTimer() {
		if (closeTimer !== null) {
			clearTimeout(closeTimer);
			closeTimer = null;
		}
	}

	function openMenu(href: string) {
		clearTimer();
		openHref = href;
	}

	function scheduleClose() {
		clearTimer();
		closeTimer = window.setTimeout(() => {
			openHref = null;
		}, CLOSE_DELAY);
	}

	$effect(() => {
		closeTick;
		openHref = null;
	});

	$effect(() => {
		onDropdownOpenChange?.(openHref !== null);
	});

	// ---------------- Indicator (wandernder Strich) ----------------
	let indicatorAnimate = $state(false);
	let indicatorPrimed = $state(false);

	let tabsInner = $state<HTMLUListElement | null>(null);

	let indicatorLeft = $state(0);
	let indicatorWidth = $state(0);
	const INDICATOR_WIDTH = 40;

	// Sobald true: SSR Underlines ausblenden (sonst Doppel-Strich)
	let indicatorReady = $state(false);

	const normalize = (p: string) => {
		if (!p) return "/";
		return p !== "/" && p.endsWith("/") ? p.slice(0, -1) : p;
	};

	const current = $derived(normalize(currentPath));

	// aktives Top-Level anhand currentPath bestimmen (SSR + JS identisch)
	const activeTopHref = $derived.by(() => {
		const cur = current;

		let best: string | null = null;
		let bestLen = -1;

		for (const item of navigation) {
			const href = normalize(item.href);
			const isMatch = cur === href || cur.startsWith(href + (href === "/" ? "" : "/"));

			if (isMatch && href.length > bestLen) {
				best = item.href;
				bestLen = href.length;
			}
		}

		return best;
	});

	function resetIndicator() {
		indicatorReady = false;
		indicatorAnimate = false;
		indicatorPrimed = false;
		indicatorLeft = 0;
		indicatorWidth = 0;
	}

	function updateIndicator() {
		// ✅ Wenn keine aktive Hauptnav existiert: Indicator komplett aus
		if (!tabsInner || !activeTopHref) {
			resetIndicator();
			return;
		}

		const el = tabsInner.querySelector<HTMLElement>(
			`[data-tab-href="${CSS.escape(activeTopHref)}"]`
		);

		if (!el) {
			resetIndicator();
			return;
		}

		const containerRect = tabsInner.getBoundingClientRect();
		const elRect = el.getBoundingClientRect();

		const width = Math.min(INDICATOR_WIDTH, elRect.width);
		const left = elRect.left - containerRect.left + (elRect.width - width) / 2;

		// initial ohne Animation setzen (kein “run” beim Laden)
		if (!indicatorPrimed) {
			indicatorAnimate = false;
			indicatorWidth = width;
			indicatorLeft = left;
			indicatorReady = true;
			indicatorPrimed = true;

			requestAnimationFrame(() => {
				indicatorAnimate = true;
			});
			return;
		}

		indicatorReady = true;
		indicatorWidth = width;
		indicatorLeft = left;
	}

	$effect(() => {
		activeTopHref;
		tick().then(() => updateIndicator());
	});

	onMount(() => {
		tick().then(() => updateIndicator());

		const onResize = () => updateIndicator();
		window.addEventListener("resize", onResize);

		return () => window.removeEventListener("resize", onResize);
	});
</script>

<nav
	class="hidden flex-1 justify-center text-base lg:text-lg xl:flex"
	aria-label="Mainnavigation"
	data-indicator-ready={indicatorReady ? "true" : "false"}
>
	<ul bind:this={tabsInner} class="relative flex items-stretch" role="list">
		{#each navigation as item (item.href)}
			<li
				class="relative"
				onmouseenter={() => item.children && openMenu(item.href)}
				onmouseleave={scheduleClose}
				onfocusin={() => item.children && openMenu(item.href)}
				onfocusout={scheduleClose}
			>
				<Navigationlink
					href={item.href}
					{currentPath}
					data-tab-href={item.href}
					aria-haspopup={item.children ? "menu" : undefined}
					aria-expanded={openHref === item.href}
				>
					{item.label}
				</Navigationlink>

				{#if item.children}
					<div
						role="menu"
						tabindex="-1"
						aria-label={`${item.label} Untermenü`}
						data-open={openHref === item.href}
						class="
							pointer-events-none absolute top-full left-1/2 z-50
							w-max -translate-x-1/2 -translate-y-2 rounded-lg border
							border-border bg-background px-6 py-5 opacity-0 shadow-xl
							transition duration-150 ease-out
							data-[open=true]:pointer-events-auto
							data-[open=true]:translate-y-0
							data-[open=true]:opacity-100
						"
					>
						<ul class="grid grid-cols-2 gap-x-8 gap-y-4">
							{#each item.children as child (child.href)}
								<li>
									<a
										href={child.href}
										role="menuitem"
										class="
											flex items-center gap-4
											rounded-md px-3 py-3
											text-lg font-medium text-foreground
											hover:bg-surface-hover 
											focus:ring-2 focus:ring-accent focus:outline-none
										"
									>
										{#if child.icon}
											<img src={child.icon} alt="" aria-hidden="true" class="h-8 w-8 shrink-0" />
										{/if}
										<span>{child.label}</span>
									</a>
								</li>
							{/each}
						</ul>
					</div>
				{/if}
			</li>
		{/each}

		<!-- ✅ nur rendern, wenn wirklich ein aktiver Hauptnav-Link existiert -->
		{#if indicatorReady}
			<div
				class={
					"pointer-events-none absolute bottom-2 h-[3px] rounded-full bg-accent " +
					(indicatorAnimate ? "transition-[left,width] duration-200 ease-out" : "")
				}
				style={`width:${indicatorWidth}px; left:${indicatorLeft}px`}
				aria-hidden="true"
			></div>
		{/if}
	</ul>
</nav>

<style>
	/* Sobald der JS-Indicator ready ist: SSR Underlines ausblenden, sonst Doppelstrich */
	nav[data-indicator-ready='true'] :global(.nav-underline) {
		opacity: 0;
	}

	:global(.nav-underline) {
		transition: opacity 120ms ease-out;
	}
</style>
