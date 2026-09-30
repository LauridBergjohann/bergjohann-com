<script lang="ts">
	type AnchorAction = (node: HTMLAnchorElement, param?: any) => { destroy?: () => void } | void;

	const {
		href = '/',
		currentPath = '/',
		children,
		action,
		actionParam,
		...rest
	} = $props<{
		href?: string;
		currentPath?: string;
		children?: () => any;
		action?: AnchorAction;
		actionParam?: any;
		[key: string]: any;
	}>();

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
	{href}
	use:action={actionParam}
	{...rest}
	aria-current={active ? 'page' : undefined}
	data-active={active}
	data-navtab="true"
	data-tab-href={href}
	class="
		data-[active=true]:text-on-accent relative inline-flex h-[var(--header-height)]
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
		class:bg-wurm-50={active}
		class:bg-transparent={!active}
	></span>
</a>
