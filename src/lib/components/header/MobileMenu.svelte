<script lang="ts">
	import type { NavigationEntry } from '$lib/api/navigation-api';

	const { navigation, currentPath, open, closeTick } = $props<{
		navigation: NavigationEntry[];
		currentPath: string;
		open: boolean;
		closeTick: number;
	}>();

	let expanded = $state<Record<string, boolean>>({});
	const normalize = (path: string) => path.replace(/\/+$/, '') || '/';
	const current = $derived(normalize(currentPath));
	function isActive(href: string) {
		const target = normalize(href);
		return current === target || (target !== '/' && current.startsWith(target + '/'));
	}

	$effect(() => {
		closeTick; // dependency
		expanded = {};
	});

	function toggle(href: string) {
		expanded[href] = !expanded[href];
	}
</script>

{#if open}
	<div
		id="mobile-menu"
		class="max-h-[calc(100dvh-var(--header-height)-1px)] overflow-y-auto border-t border-border bg-header/95 xl:hidden"
	>
		<div class="mx-auto max-w-7xl space-y-3 px-4 py-3">
			<nav class="text-base" aria-label="Mobile Navigation">
				<ul role="list" class="space-y-1">
					{#each navigation as item (item.href)}
						<li>
							<div
								class={`flex items-center justify-between gap-2 rounded border-l-[3px] ${isActive(item.href) ? 'border-accent bg-selection font-medium' : 'border-transparent hover:bg-surface-hover'}`}
							>
								<a
									href={item.href}
									aria-current={current === normalize(item.href)
										? 'page'
										: isActive(item.href)
											? 'location'
											: undefined}
									class="flex-1 rounded px-2 py-2 text-foreground-soft hover:text-foreground focus:ring-2 focus:ring-accent focus:outline-none"
								>
									{item.label}
								</a>

								{#if item.children?.length}
									<button
										type="button"
										class="inline-flex h-10 w-10 items-center justify-center rounded text-foreground-soft
                           hover:text-foreground focus:ring-2 focus:ring-accent focus:outline-none"
										aria-label={expanded[item.href] ? 'Untermenü schließen' : 'Untermenü öffnen'}
										aria-expanded={!!expanded[item.href]}
										aria-controls={'mobile-submenu-' + item.href.replaceAll('/', '_')}
										onclick={() => toggle(item.href)}
									>
										<!-- chevron -->
										<svg
											class={'h-5 w-5 transition-transform ' +
												(expanded[item.href] ? 'rotate-180' : '')}
											viewBox="0 0 20 20"
											fill="currentColor"
											aria-hidden="true"
										>
											<path
												fill-rule="evenodd"
												d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.94l3.71-3.71a.75.75 0 1 1 1.06 1.06l-4.24 4.24a.75.75 0 0 1-1.06 0L5.21 8.29a.75.75 0 0 1 .02-1.08z"
												clip-rule="evenodd"
											/>
										</svg>
									</button>
								{/if}
							</div>

							{#if item.children?.length}
								<div
									id={'mobile-submenu-' + item.href.replaceAll('/', '_')}
									hidden={!expanded[item.href]}
									class="py-1 pl-6"
								>
									<ul role="list" class="space-y-1">
										{#each item.children as child (child.href)}
											<li>
												<a
													href={child.href}
													aria-current={current === normalize(child.href)
														? 'page'
														: isActive(child.href)
															? 'location'
															: undefined}
													class={`flex items-center gap-2 rounded border-l-[3px] px-2 py-2 text-foreground-soft hover:text-foreground focus:ring-2 focus:ring-accent focus:outline-none ${isActive(child.href) ? 'border-accent bg-selection font-medium' : 'border-transparent hover:bg-surface-hover'}`}
												>
													{#if child.icon}
														<img
															src={child.icon}
															alt=""
															aria-hidden="true"
															class="h-5 w-5 shrink-0"
														/>
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
				</ul>
			</nav>
		</div>
	</div>
{/if}
