<script lang="ts">
  import type { Snippet } from 'svelte';

  type Props = {
    children: Snippet;
    class?: string;
  };

  let {
    children,
    class: className = ''
  }: Props = $props();
</script>

<div class={`mx-auto w-full max-w-6xl px-5 sm:px-8 ${className}`}>
  {@render children()}
</div>