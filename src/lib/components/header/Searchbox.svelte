<script lang="ts">
	import { goto } from '$app/navigation';
	import { tick } from 'svelte';

	import { shortcutLabel as getShortcutLabel } from '../helper/platform';
	import type { SearchHitBase, SearchResults, FlatItem } from './search/types';

	const { variant = 'desktop', closeTick = 0 } = $props<{
		variant?: 'desktop' | 'mobile';
		closeTick?: number;
	}>();

	const LIMIT = 5;

	let q = $state('');
	let open = $state(false);
	let results = $state<SearchResults | null>(null);

	// ctrl bewusst NICHT reaktiv
	let ctrl: AbortController | null = null;

	let activeIndex = $state(-1);
	let flat = $state<FlatItem[]>([]);

	let inputEl = $state<HTMLInputElement | null>(null);
	let rootEl = $state<HTMLElement | null>(null);

	// ✅ weiterhin derived (damit navigator nur im Browser gelesen wird)
	const shortcutLabel = $derived.by(() => getShortcutLabel());

	async function navigateToSearchPage() {
		closePopup();
		await goto(`/search?q=${encodeURIComponent(q)}`);
	}

	function getThumb(item: SearchHitBase) {
		return item.image ?? item.icon ?? '';
	}

	function openWithHint() {
		open = true;
		activeIndex = -1;

		if (!q.trim()) {
			results = { models: [], pages: [], didYouMean: [] };
		}
	}

	function closePopup() {
		open = false;
		activeIndex = -1;
	}

	// ✅ Navigation/closeTick: Popup schließen + Query leeren (altes Verhalten)
	$effect(() => {
		closeTick;

		closePopup();
		results = null;

		ctrl?.abort();
		ctrl = null;

		q = ''; // ✅ wieder wie vorher
	});

	// Blur -> next tick -> close if focus left the whole component
	async function onInputBlur() {
		await tick();
		const active = document.activeElement;

		if (!rootEl || !active) {
			closePopup();
			return;
		}
		if (!rootEl.contains(active)) closePopup();
	}

	// flatten + limit (nur echte Treffer)
	$effect(() => {
		const p = (results?.models ?? []).slice(0, LIMIT);
		const s = (results?.pages ?? []).slice(0, LIMIT);

		const out: FlatItem[] = [
			...p.map((x, i) => ({ ...x, group: 'models' as const, indexInGroup: i })),
			...s.map((x, i) => ({ ...x, group: 'pages' as const, indexInGroup: i }))
		];

		flat = out;
		if (activeIndex >= out.length) activeIndex = out.length - 1;
	});

	const modelsLimited = $derived.by(() => (results?.models ?? []).slice(0, LIMIT));
	const pagesLimited = $derived.by(() => (results?.pages ?? []).slice(0, LIMIT));

	const hasModels = $derived.by(() => modelsLimited.length > 0);
	const hasPages = $derived.by(() => pagesLimited.length > 0);
	const mixed = $derived.by(() => hasModels && hasPages);

	const hasMoreModels = $derived.by(() => (results?.models?.length ?? 0) > LIMIT);
	const hasMorePages = $derived.by(() => (results?.pages?.length ?? 0) > LIMIT);

	const didYouMean = $derived.by(() => results?.didYouMean ?? []);
	const hasDidYouMean = $derived.by(() => didYouMean.length > 0);

	async function onInput() {
		const term = q.trim();
		open = true;
		activeIndex = -1;

		if (term.length < 2) {
			results = { models: [], pages: [], didYouMean: [] };
			return;
		}

		ctrl?.abort();
		ctrl = new AbortController();

		try {
			const res = await fetch(`/api/search?q=${encodeURIComponent(term)}`, { signal: ctrl.signal });
			if (!res.ok) return;
			results = (await res.json()) as SearchResults;
		} catch {
			// abort ok
		}
	}

	function scrollActiveIntoView() {
		if (activeIndex < 0) return;
		const el = document.getElementById(`search-item-${variant}-${activeIndex}`);
		el?.scrollIntoView({ block: 'nearest' });
	}

	async function navigateTo(href: string) {
		closePopup();
		await goto(href);
	}

	async function navigateToSuggestion(s: string) {
		closePopup();
		await goto(`/search?q=${encodeURIComponent(s)}`);
	}

	function onKeydown(e: KeyboardEvent) {
		if (!open && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
			openWithHint();
			return;
		}

		if (e.key === 'Escape') {
			closePopup();
			inputEl?.blur();
			return;
		}

		if (!open) return;

		if (e.key === 'ArrowDown') {
			e.preventDefault();
			if (!flat.length) return;
			activeIndex = Math.min(activeIndex + 1, flat.length - 1);
			scrollActiveIntoView();
			return;
		}

		if (e.key === 'ArrowUp') {
			e.preventDefault();
			if (!flat.length) return;
			activeIndex = Math.max(activeIndex - 1, 0);
			scrollActiveIntoView();
			return;
		}

		if (e.key === 'Enter') {
			if (activeIndex >= 0 && flat[activeIndex]) {
				e.preventDefault();
				void navigateTo(flat[activeIndex].href);
			}
		}
	}

	function onItemMouseEnter(i: number) {
		activeIndex = i;
	}

	$effect(() => {
		const onGlobal = (e: KeyboardEvent) => {
			if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
				e.preventDefault();
				inputEl?.focus();
				openWithHint();
			}
		};
		window.addEventListener('keydown', onGlobal);
		return () => window.removeEventListener('keydown', onGlobal);
	});
</script>

<div bind:this={rootEl} class="relative min-w-0">
	<form method="GET" action="/search" role="search" class="relative">
		<label class="sr-only" for={'q-' + variant}>Suche</label>

		<input
			bind:this={inputEl}
			id={'q-' + variant}
			name="q"
			placeholder="Suche"
			class="h-[3.125rem] w-full rounded-xl border border-border-strong bg-surface/70 pr-12 pl-4 text-sm text-foreground transition-colors placeholder:text-muted hover:border-control-border focus:border-link focus:ring-2 focus:ring-link/20 focus:outline-none sm:pr-24"
			bind:value={q}
			autocomplete="off"
			onfocus={openWithHint}
			onblur={() => void onInputBlur()}
			oninput={onInput}
			onkeydown={onKeydown}
			aria-expanded={open}
			aria-controls={'search-results-' + variant}
			aria-activedescendant={activeIndex >= 0 ? `search-item-${variant}-${activeIndex}` : undefined}
		/>

		<div
			class="pointer-events-none absolute inset-y-0 right-12 hidden items-center sm:flex"
			aria-hidden="true"
		>
			<span
				class="rounded-md border border-border bg-background/80 px-2 py-1 text-[11px] font-medium text-muted"
			>
				{shortcutLabel}
			</span>
		</div>

		<button
			type="submit"
			class="absolute top-1/2 right-1 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface-hover hover:text-foreground focus-visible:ring-2 focus-visible:ring-link focus-visible:outline-none"
			aria-label="Suche absenden"
		>
			<svg
				viewBox="0 0 24 24"
				class="h-[18px] w-[18px]"
				aria-hidden="true"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
			>
				<circle cx="11" cy="11" r="7" />
				<path d="M20 20l-3.5-3.5" />
			</svg>
		</button>
	</form>

	{#if open}
		<div
			id={'search-results-' + variant}
			class="absolute top-full right-0 left-0 z-50 mt-2 max-h-80 overflow-auto rounded-xl border border-border-strong bg-surface-raised text-foreground shadow-lg"
			role="listbox"
		>
			{#if q.trim().length < 2}
				<div class="px-3 py-3 text-sm text-muted">
					Tip: Enter a <span class="font-medium">Keyword</span> (e.g.,
					<span class="font-mono">UX</span>) or search for terms.
				</div>
			{:else if !hasModels && !hasPages}
				{#if hasDidYouMean}
					<div class="px-3 py-3 text-sm text-foreground-soft">
						<span class="font-medium">Meinten Sie:</span>
						<div class="mt-2 flex flex-wrap gap-2">
							{#each didYouMean as s (s)}
								<button
									type="button"
									class="rounded-full border border-border bg-surface px-3 py-1 text-sm
                           text-foreground-soft hover:bg-surface-hover focus:ring-2 focus:ring-link focus:outline-none"
									onpointerdown={(e) => {
										e.preventDefault();
										void navigateToSuggestion(s);
									}}
								>
									{s}
								</button>
							{/each}
						</div>
					</div>
				{:else}
					<div class="px-3 py-3 text-sm text-muted">Keine Treffer</div>
				{/if}
			{:else}
				{#if hasModels}
					{#if mixed}
						<div class="px-3 py-2 text-xs font-semibold text-muted">Produkte</div>
					{/if}

					<ul class="pb-2">
						{#each modelsLimited as r, i (r.href)}
							<li>
								<a
									id={`search-item-${variant}-${i}`}
									role="option"
									aria-selected={activeIndex === i}
									class={'flex items-center gap-3 px-3 py-2 text-sm hover:bg-surface ' +
										(activeIndex === i ? 'bg-surface-hover' : '')}
									href={r.href}
									onmouseenter={() => onItemMouseEnter(i)}
									onpointerdown={(e) => {
										e.preventDefault();
										void navigateTo(r.href);
									}}
								>
									{#if getThumb(r)}
										<img
											src={getThumb(r)}
											alt=""
											aria-hidden="true"
											class="h-8 w-8 shrink-0 rounded border border-border object-cover"
										/>
									{:else}
										<div class="h-8 w-8 shrink-0 rounded border border-border bg-surface"></div>
									{/if}
									<span class="min-w-0 truncate">{r.label}</span>
								</a>
							</li>
						{/each}

						{#if hasMoreModels}
							<li class="px-3 pt-1">
								<a
									class="text-sm text-link hover:underline"
									href={'/search?q=' + encodeURIComponent(q)}
									onpointerdown={(e) => {
										e.preventDefault();
										void navigateToSearchPage();
									}}
								>
									Alle Produkttreffer anzeigen →
								</a>
							</li>
						{/if}
					</ul>
				{/if}

				{#if mixed}
					<div class="mx-3 border-t border-border"></div>
				{/if}

				{#if hasPages}
					{#if mixed}
						<div class="px-3 py-2 text-xs font-semibold text-muted">Seiten</div>
					{/if}

					<ul class="pb-3">
						{#each pagesLimited as r, j (r.href)}
							{@const base = modelsLimited.length}
							{@const idx = base + j}
							<li>
								<a
									id={`search-item-${variant}-${idx}`}
									role="option"
									aria-selected={activeIndex === idx}
									class={'flex items-center gap-3 px-3 py-2 text-sm hover:bg-surface ' +
										(activeIndex === idx ? 'bg-surface-hover' : '')}
									href={r.href}
									onmouseenter={() => onItemMouseEnter(idx)}
									onpointerdown={(e) => {
										e.preventDefault();
										void navigateTo(r.href);
									}}
								>
									{#if getThumb(r)}
										<img
											src={getThumb(r)}
											alt=""
											aria-hidden="true"
											class="h-8 w-8 shrink-0 rounded border border-border object-cover"
										/>
									{:else}
										<div class="h-8 w-8 shrink-0 rounded border border-border bg-surface"></div>
									{/if}
									<span class="min-w-0 truncate">{r.label}</span>
								</a>
							</li>
						{/each}

						{#if hasMorePages}
							<li class="px-3 pt-1">
								<a
									class="text-sm text-link hover:underline"
									href={'/search?q=' + encodeURIComponent(q)}
									onpointerdown={(e) => {
										e.preventDefault();
										void navigateToSearchPage();
									}}
								>
									Alle Seitentreffer anzeigen →
								</a>
							</li>
						{/if}
					</ul>
				{/if}
			{/if}
		</div>
	{/if}
</div>
