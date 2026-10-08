<script lang="ts">
	import { onMount } from 'svelte';
	import Icon from './Icon.svelte';
	import { themePreference, changeTheme, type ThemePreference } from '$lib/theme';
	import type { Messages } from '$lib/i18n/messages';
	let { labelled = false, messages }: { labelled?: boolean; messages: Messages } = $props();
	let preference = $state<ThemePreference>('system');
	let ready = $state(false);
	let dismissed = $state(false);
	const options = $derived([
		{
			value: 'light',
			label: messages.theme.light,
			description: messages.theme.useLight,
			icon: 'sun'
		},
		{
			value: 'dark',
			label: messages.theme.dark,
			description: messages.theme.useDark,
			icon: 'moon'
		},
		{
			value: 'system',
			label: messages.theme.system,
			description: messages.theme.useSystem,
			icon: 'monitor'
		}
	] as const);
	onMount(() => {
		const unsubscribe = themePreference.subscribe((value) => (preference = value));
		ready = true;
		return unsubscribe;
	});
</script>

<div
	role="group"
	aria-label={messages.settings.appearance}
	class="inline-flex h-[42px] shrink-0 items-center divide-x divide-border-strong/70 rounded-lg border border-border-strong"
>
	{#each options as option, index (option.value)}
		<div class="group relative">
			<button
				type="button"
				aria-label={option.description}
				aria-pressed={preference === option.value}
				disabled={!ready}
				onclick={() => changeTheme(option.value)}
				onmouseenter={() => (dismissed = false)}
				onfocus={() => (dismissed = false)}
				onkeydown={(event) => {
					if (event.key === 'Escape') dismissed = true;
				}}
				class={`inline-flex h-10 items-center justify-center gap-2 ${index === 0 ? 'rounded-l-[7px]' : index === options.length - 1 ? 'rounded-r-[7px]' : ''} text-sm transition-colors focus-visible:ring-2 focus-visible:ring-link focus-visible:outline-none disabled:opacity-50 ${labelled ? 'px-2' : 'w-10'} ${preference === option.value ? 'bg-selection text-foreground-soft' : 'text-foreground-soft hover:bg-background-alt hover:text-foreground'}`}
			>
				<span aria-hidden="true"><Icon id={option.icon} size={18} /></span>
				{#if labelled}<span>{option.label}</span>{/if}
			</button>
			{#if !labelled && !dismissed}
				<span
					aria-hidden="true"
					class="pointer-events-none absolute top-full right-0 z-50 pt-2 opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:pointer-events-auto group-hover:opacity-100"
				>
					<span
						class="block rounded-lg border border-border bg-surface-raised px-3 py-2 text-xs whitespace-nowrap text-foreground shadow-md"
						>{option.description}</span
					>
				</span>
			{/if}
		</div>
	{/each}
</div>
