<script lang="ts">
	import type { PathnameWithSearchOrHash } from '$app/types';
	import { resolve } from '$app/paths';
	import type { NavigationEntry } from '$lib/api/navigation-api';
	import type { Messages } from '$lib/i18n/messages';
	const { navigation, currentPath, messages, closeTick } = $props<{
		navigation: NavigationEntry[];
		currentPath: string;
		messages: Messages;
		closeTick: number;
	}>();
	let root = $state<HTMLDivElement>();
	const normalize = (path: string) => path.replace(/\/+$/, '') || '/';
	const current = $derived(normalize(currentPath));
	function isActive(href: string) {
		const target = normalize(href);
		return current === target || (target !== '/' && current.startsWith(target + '/'));
	}
	$effect(() => {
		void closeTick;
		root?.querySelectorAll('details').forEach((details) => (details.open = false));
	});
</script>

<div
	bind:this={root}
	id="mobile-menu"
	class="max-h-[calc(100dvh-var(--header-height)-1px)] overflow-y-auto border-t border-border bg-header/95"
>
	<div class="mx-auto max-w-7xl space-y-3 px-4 py-3">
		<nav class="text-base" aria-label={messages.navigation.mobile}>
			<ul role="list" class="space-y-1">
				{#each navigation as item (item.href)}
					<li>
						<a
							href={resolve(item.href as PathnameWithSearchOrHash)}
							aria-current={current === normalize(item.href)
								? 'page'
								: isActive(item.href)
									? 'location'
									: undefined}
							class={'block rounded border-l-[3px] px-2 py-2 text-foreground-soft hover:text-foreground focus:ring-2 focus:ring-accent focus:outline-none ' +
								(isActive(item.href)
									? 'border-accent bg-selection font-medium'
									: 'border-transparent hover:bg-surface-hover')}
						>
							{item.label}
						</a>
						{#if item.children?.length}
							<details class="py-1 pl-6">
								<summary
									class="cursor-pointer rounded py-2 text-sm text-foreground-soft focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
									>{item.label} – {messages.navigation.submenu}</summary
								>
								<ul role="list" class="space-y-1">
									{#each item.children as child (child.href)}
										<li>
											<a
												href={resolve(child.href as PathnameWithSearchOrHash)}
												aria-current={current === normalize(child.href)
													? 'page'
													: isActive(child.href)
														? 'location'
														: undefined}
												class={'flex items-center gap-2 rounded border-l-[3px] px-2 py-2 text-foreground-soft hover:text-foreground focus:ring-2 focus:ring-accent focus:outline-none ' +
													(isActive(child.href)
														? 'border-accent bg-selection font-medium'
														: 'border-transparent hover:bg-surface-hover')}
											>
												{#if child.icon}<img
														src={child.icon}
														alt=""
														aria-hidden="true"
														class="h-5 w-5 shrink-0"
													/>{/if}
												<span>{child.label}</span>
											</a>
										</li>
									{/each}
								</ul>
							</details>
						{/if}
					</li>
				{/each}
			</ul>
		</nav>
	</div>
</div>
