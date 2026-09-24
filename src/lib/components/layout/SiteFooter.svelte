<script lang="ts">
  import { site } from '$lib/site';

  import Container from '$lib/components/ui/Container.svelte';
</script>

<footer class="border-t border-border py-9">
  <Container
    class="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"
  >
    <div>
      <p class="text-xl font-bold tracking-tight">
        {site.name}
      </p>

      <p class="mt-1 text-sm text-muted">
        UX · Engineering · Model Worlds
      </p>
    </div>

    <a
      href={site.github}
      class="text-sm text-link underline underline-offset-4"
    >
      Quellcode auf GitHub
    </a>
  </Container>
</footer>