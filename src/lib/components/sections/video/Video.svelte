<!--
@component

Displays a video section with optional text.

Supports YouTube and HTML5 video sources. The video is shown on the left by default and can be positioned on the right via `section.videoSide`.

```svelte
<Video section={section} />
```
-->

<script lang="ts">
  import type { VideoSection } from "../interface";
  import Section from "../base/Section.svelte";

  /**
   * Props accepted by the video section component.
   */
  type Props = {
    /**
     * Section configuration containing the video source, optional text content,
     * layout settings, and shared section properties.
     */
    section: VideoSection;
  };

  const { section }: Props = $props();

  /**
   * Indicates whether the video is displayed on the left side of the text.
   *
   * The video is positioned on the left by default and moves to the right
   * when `section.videoSide` is explicitly set to `"right"`.
   */
  let videoLeft = $derived(section.videoSide !== "right");
</script>

<Section {section}>
  <div
    class="
      mx-auto flex w-full max-w-7xl flex-col gap-10
      md:items-center
    "
    class:md:flex-row={videoLeft}
    class:md:flex-row-reverse={!videoLeft}
  >
    <!-- Video content -->
    <div
      class="
        md:flex-[1.7]
        aspect-video w-full overflow-hidden rounded bg-background shadow-lg
        ring-1 ring-slate-900/10
      "
    >
      {#if section.video.provider === "youtube"}
        <iframe
          class="h-full w-full"
          src={section.video.src}
          title={section.headline}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
      {:else}
        <video
          class="h-full w-full"
          controls
          poster={section.video.poster}
        >
          <source src={section.video.src} />
          Your browser does not support the video element.
        </video>
      {/if}
    </div>

    <!-- Optional text content -->
    {#if section.headline || section.description}
      <div class="md:flex-1 flex flex-col gap-4">
        {#if section.headline}
          <h3 class="text-2xl md:text-3xl font-semibold text-wurm-100">
            {section.headline}
          </h3>
        {/if}

        {#if section.description}
          <p class="text-base md:text-lg leading-relaxed whitespace-pre-line">
            {section.description}
          </p>
        {/if}
      </div>
    {/if}
  </div>
</Section>