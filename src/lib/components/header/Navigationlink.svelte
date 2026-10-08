<script lang="ts">
	import { resolve } from '$app/paths';
	import type { PathnameWithSearchOrHash } from '$app/types';
	import type { Snippet } from 'svelte';
	import type { HTMLAnchorAttributes } from 'svelte/elements';
	type AnchorAction = (node: HTMLAnchorElement, param?: unknown) => { destroy?: () => void } | void;

	const {
		href = '/',
		currentPath = '/',
		children,
		action,
		actionParam,
		...rest
	} = $props<
		Omit<HTMLAnchorAttributes, 'href' | 'children'> & {
			href?: string;
			currentPath?: string;
			children?: Snippet;
			action?: AnchorAction;
			actionParam?: unknown;
			'data-tab-href'?: string;
		}
	>();

	const normalize = (p: string) => {
		if (!p) return '/';
		return p !== '/' && p.endsWith('/') ? p.slice(0, -1) : p;
	};

	const current = $derived(normalize(currentPath));
	const target = $derived(normalize(href));

	// aktiv wenn exakt oder prefix-match (für Unterseiten)
	const active = $derived(
		current === target || current.startsWith(target + (target === '/' ? '' : '/'))
	);
</script>

<a
	href={resolve(href as PathnameWithSearchOrHash)}
	use:action={actionParam}
	{...rest}
	aria-current={active ? 'page' : undefined}
	data-active={active}
	data-navtab="true"
	data-tab-href={href}
	class="
		relative inline-flex h-[var(--header-height)]
		items-center
		px-4 text-lg
		text-foreground-soft hover:bg-background-alt
		hover:text-foreground focus:ring-2 focus:ring-accent

		focus:outline-none
		data-[active=true]:bg-selection
		data-[active=true]:font-medium
	"
>
	{@render children?.()}

	<!-- SSR/No-JS Fallback underline:
	     wird per CSS im DesktopMenu ausgeblendet, sobald der Indicator ready ist -->
	<span
		aria-hidden="true"
		class="nav-underline pointer-events-none absolute bottom-2 left-1/2 h-[3px] w-10 -translate-x-1/2 rounded-full"
		class:bg-accent={active}
		class:bg-transparent={!active}
	></span>
</a>
