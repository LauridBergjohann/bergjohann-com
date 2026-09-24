<script lang="ts">
  import type { Snippet } from 'svelte';

  import Container from './Container.svelte';

  type Props = {
    id: string;
    title: string;
    eyebrow?: string;
    description?: string;
    children: Snippet;
  };

  let {
    id,
    title,
    eyebrow,
    description,
    children
  }: Props = $props();
</script>

<section
  {id}
  aria-labelledby={`${id}-title`}
  class="border-t border-border py-16 sm:py-20"
>
  <Container>
    <header class="mb-9 max-w-2xl">
      {#if eyebrow}
        <p
          class="mb-3 font-mono text-xs font-semibold uppercase tracking-widest text-link"
        >
          {eyebrow}
        </p>
      {/if}

      <h2
        id={`${id}-title`}
        class="text-3xl font-bold tracking-tight sm:text-4xl"
      >
        {title}
      </h2>

      {#if description}
        <p class="mt-4 leading-7 text-muted">
          {description}
        </p>
      {/if}
    </header>

    {@render children()}
  </Container>
</section>