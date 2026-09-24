<script lang="ts">
  import { site } from '$lib/site';

  import Hero from '$lib/components/home/Hero.svelte';
  import Section from '$lib/components/ui/Section.svelte';

  const topics = [
    {
      number: '01',
      title: 'User Experience & Interfaces',
      text:
        'Wie werden digitale Produkte verständlich und angenehm bedienbar? Gedanken über Interaktionen, Gestaltung und die Details dazwischen.'
    },
    {
      number: '02',
      title: 'Softwarearchitektur',
      text:
        'Strukturen, die nicht nur auf dem Papier funktionieren. Über Frontends, Plattformen und nachvollziehbare technische Entscheidungen.'
    },
    {
      number: '03',
      title: 'Modellbau & kleine Welten',
      text:
        'Schiffe, Hubschrauber, Flugzeuge, Trucks und eine niederländische Stadt in H0. Projekte, Reparaturen und neue Ideen aus der Werkstatt.'
    }
  ];

  const projects = [
    {
      category: 'WEB / THREE.JS',
      title: 'Produkte räumlich erleben',
      text:
        'Experimente mit interaktiven 3D-Produktdarstellungen und Interfaces, die digitale Objekte greifbarer machen.'
    },
    {
      category: 'MODELLBAU / H0',
      title: 'Zeewijk',
      text:
        'Eine fiktive niederländische Stadt, die Stück für Stück wächst. Mit Architektur, kleinen Geschichten und viel Liebe zum Detail.'
    }
  ];
</script>

<svelte:head>
  <title>{site.title}</title>
  <meta name="description" content={site.description} />
</svelte:head>

<Hero />

<Section
  id="themen"
  eyebrow="01 / Themen"
  title="Was mich beschäftigt."
  description="Zwischen Bildschirm und Werkbank gibt es mehr Gemeinsamkeiten, als man zunächst denkt."
>
  <div class="grid gap-5 md:grid-cols-3">
    {#each topics as topic (topic.number)}
      <article class="rounded-xl border border-border bg-surface p-6">
        <p class="mb-8 font-mono text-xs text-link">
          {topic.number}
        </p>

        <h3 class="text-xl font-semibold tracking-tight">
          {topic.title}
        </h3>

        <p class="mt-3 text-sm leading-7 text-muted">
          {topic.text}
        </p>
      </article>
    {/each}
  </div>
</Section>

<Section
  id="projekte"
  eyebrow="02 / Projekte"
  title="Auf meiner Werkbank."
  description="Ein erster Einblick in meine Projekte. Ausführliche Berichte entstehen nach und nach."
>
  <div class="grid gap-5 md:grid-cols-2">
    {#each projects as project (project.title)}
      <article
        class="rounded-xl border border-border bg-surface p-6 sm:p-8"
      >
        <p class="font-mono text-xs tracking-wider text-link">
          {project.category}
        </p>

        <h3 class="mt-5 text-2xl font-semibold tracking-tight">
          {project.title}
        </h3>

        <p class="mt-3 leading-7 text-muted">
          {project.text}
        </p>

        <p class="mt-6 border-t border-border pt-4 text-sm text-muted">
          Projekteinblick · Ausführlicher Bericht folgt
        </p>
      </article>
    {/each}
  </div>
</Section>

<Section
  id="ueber-mich"
  eyebrow="03 / Über mich"
  title="Hallo, ich bin Laurid."
>
  <div class="grid gap-8 md:grid-cols-[1.4fr_1fr] md:gap-16">
    <div class="space-y-4 leading-8 text-muted">
      <p>
        Ich beschäftige mich gerne mit der Frage, wie Dinge aufgebaut sind –
        und wie sie sich besser gestalten lassen. Das gilt für ein Interface
        genauso wie für eine Softwarearchitektur oder ein selbst gebautes Modell.
      </p>

      <p>
        Diese Seite soll kein Hochglanzportfolio sein, sondern ein persönlicher
        Ort für Ideen, Erfahrungen und den Austausch mit anderen. Ein Blog
        und ein Projekttagebuch dürfen daraus mit der Zeit wachsen.
      </p>
    </div>

    <div class="rounded-xl border border-border bg-surface p-6">
      <p class="text-lg font-semibold">
        Neugierig bleiben. Dinge bauen.
      </p>

      <p class="mt-3 text-sm leading-7 text-muted">
        Den Anfang macht diese Website: selbst entwickelt mit SvelteKit,
        TypeScript und Tailwind CSS.
      </p>

      <a
        href={site.github}
        class="mt-5 inline-block text-sm text-link underline underline-offset-4"
      >
        Zum Website-Repository
        <span aria-hidden="true">→</span>
      </a>
    </div>
  </div>
</Section>