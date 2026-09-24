<script lang="ts">
  import { asset, resolve } from '$app/paths';
</script>

<a
  href={resolve('/')}
  aria-label="bergjohann.com – Startseite"
  class="brand"
>
  <img
    src={asset('/branding/logo-light.png')}
    alt=""
    width="2172"
    height="724"
    class="logo logo-light"
  />

  <img
    src={asset('/branding/logo-dark.png')}
    alt=""
    width="2172"
    height="724"
    class="logo logo-dark"
  />
</a>

<style>
  .brand {
    display: block;
    flex-shrink: 0;
    width: clamp(160px, 24vw, 240px);
    max-width: 100%;
  }

  .logo {
    width: 100%;
    height: auto;
  }

  /* Standard: Logo für den hellen Hintergrund. */
  .logo-light {
    display: block;
  }

  .logo-dark {
    display: none;
  }

  /* Das vorhandene ThemeSwitch setzt data-theme auf <html>. */
  :global(html[data-theme='dark']) .logo-light {
    display: none;
  }

  :global(html[data-theme='dark']) .logo-dark {
    display: block;
  }

  /* Fallback, solange kein data-theme gesetzt ist, auch ohne JavaScript. */
  @media (prefers-color-scheme: dark) {
    :global(html:not([data-theme])) .logo-light {
      display: none;
    }

    :global(html:not([data-theme])) .logo-dark {
      display: block;
    }
  }
</style>