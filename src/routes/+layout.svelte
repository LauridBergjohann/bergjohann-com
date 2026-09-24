<script lang="ts">
  import '../app.css';

  import type { LayoutProps } from './$types';

  import SiteHeader from '$lib/components/layout/SiteHeader.svelte';
  import SiteFooter from '$lib/components/layout/SiteFooter.svelte';

  let { children }: LayoutProps = $props();
</script>

<a
  href="#main-content"
  class="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-3 focus:text-on-primary"
>
  Zum Inhalt springen
</a>

<div class="flex min-h-dvh flex-col">
  <SiteHeader />

  <main id="main-content" tabindex="-1" class="flex-1">
    {@render children()}
  </main>

  <SiteFooter />
</div>