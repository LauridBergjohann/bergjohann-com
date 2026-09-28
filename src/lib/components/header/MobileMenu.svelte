<script lang="ts">
	import type { NavigationEntry } from '$lib/api/navigation-api';
	import Searchbox from './Searchbox.svelte';
	import ThemeSwitch from '../ui/ThemeSwitch.svelte';

	const { navigation, open, closeTick } = $props<{
		navigation: NavigationEntry[];
		open: boolean;
		closeTick: number;
	}>();

	let expanded = $state<Record<string, boolean>>({});

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
		class="max-h-[calc(100dvh-6rem)] overflow-y-auto rounded-b-2xl border-t border-border bg-background/95 md:max-h-[calc(100dvh-7rem)] xl:hidden"
	>
		<div class="mx-auto max-w-7xl space-y-3 px-4 py-3">
			<Searchbox variant="mobile" {closeTick} />

			<nav class="text-base" aria-label="Mobile Navigation">
				<ul role="list" class="space-y-1">
					{#each navigation as item (item.href)}
						<li>
							<div class="flex items-center justify-between gap-2 rounded hover:bg-surface-hover">
								<a
									href={item.href}
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
													class="flex items-center gap-2 rounded px-2 py-2 text-foreground-soft
                               hover:text-foreground focus:ring-2 focus:ring-accent focus:outline-none"
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
			<div class="space-y-3 border-t border-border pt-4 pb-2">
				<p class="text-xs font-semibold tracking-wider text-muted uppercase">Appearance</p>
				<ThemeSwitch labelled />
			</div>
		</div>
	</div>
{/if}
