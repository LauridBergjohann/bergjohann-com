<script lang="ts">
  import { resolve } from '$app/paths';

  import { site } from '$lib/site';

  import Container from '$lib/components/ui/Container.svelte';
  import ThemeSwitch from '$lib/components/ui/ThemeSwitch.svelte';

import SiteLogo from '$lib/components/layout/SiteLogo.svelte';
  const navigation = [
    { label: 'Themen', id: 'themen' },
    { label: 'Projekte', id: 'projekte' },
    { label: 'Über mich', id: 'ueber-mich' }
  ];
</script>

<header
  class="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur-md"
>
  <Container
    class="flex flex-wrap items-center justify-between gap-x-5 gap-y-2 py-3 sm:py-4"
  >
    <SiteLogo />

    <nav
      aria-label="Hauptnavigation"
      class="order-3 flex w-full gap-6 text-sm sm:order-none sm:w-auto"
    >
      {#each navigation as item (item.id)}
        <a
          href={`${resolve('/')}#${item.id}`}
          class="inline-flex min-h-11 items-center text-muted hover:text-foreground"
        >
          {item.label}
        </a>
      {/each}
    </nav>

    <ThemeSwitch />
  </Container>
</header>