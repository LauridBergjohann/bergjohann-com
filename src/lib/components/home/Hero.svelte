<script lang="ts">
  import Container from '$lib/components/ui/Container.svelte';

  // Als String: Die geschweiften Klammern sind kein Svelte-Markup.
  const example = `const werkstatt = {
  digital: ["UX", "UI", "Architektur"],
  tools: ["Svelte", "three.js"],
  analog: ["Modellbau", "Zeewijk"],
  status: "in Arbeit"
};`;
</script>

<section
  aria-labelledby="welcome-title"
  class="py-16 sm:py-24 lg:py-28"
>
  <Container
    class="grid items-center gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-16"
  >
    <div>
      <p
        class="mb-6 flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-muted"
      >
        <span
          class="h-px w-8 bg-accent"
          aria-hidden="true"
        ></span>

        Die persönliche Werkstatt
      </p>

      <h1
        id="welcome-title"
        class="text-5xl leading-[1.06] font-bold tracking-tight sm:text-6xl"
      >
        Digitale Ideen.<br />
        <span class="text-link">Echte Modelle.</span>
      </h1>

      <p class="mt-7 max-w-xl text-lg leading-8 text-muted">
        Ich bin Laurid. Mich interessieren gute Interfaces, durchdachte
        Softwarearchitekturen und alles, was im Modell fährt oder fliegt.
        Hier entsteht ein Ort zum Bauen, Ausprobieren und Teilen.
      </p>

      <div class="mt-8 flex flex-wrap gap-3">
        <a
          href="#projekte"
          class="inline-flex min-h-12 items-center gap-3 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-on-primary hover:bg-primary-hover"
        >
          Projekte entdecken
          <span aria-hidden="true">→</span>
        </a>

        <a
          href="#ueber-mich"
          class="inline-flex min-h-12 items-center rounded-lg border border-control-border px-5 py-3 text-sm font-semibold hover:bg-surface"
        >
          Über mich
        </a>
      </div>
    </div>

    <aside
      aria-label="Ein Blick in meine Werkstatt"
      class="min-w-0 rounded-2xl border border-border bg-surface p-5 sm:p-7"
    >
      <div class="mb-6 flex items-center justify-between gap-3">
        <p class="font-mono text-xs uppercase tracking-widest text-muted">
          werkstatt.ts
        </p>

        <span
          class="rounded-md bg-primary/10 px-2.5 py-1 font-mono text-xs text-link"
        >
          Work in progress
        </span>
      </div>

      <pre
        class="overflow-x-auto rounded-xl border border-border bg-surface-raised p-4 text-xs leading-7 sm:text-sm"
      ><code>{example}</code></pre>

      <div
        class="mt-6 grid grid-cols-3 gap-3 border-t border-border pt-5 text-xs text-muted"
      >
        <span>01 / Entwerfen</span>
        <span>02 / Bauen</span>
        <span>03 / Teilen</span>
      </div>
    </aside>
  </Container>
</section>