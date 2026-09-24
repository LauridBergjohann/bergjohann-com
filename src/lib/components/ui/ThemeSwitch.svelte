<script lang="ts">
  import { onMount } from 'svelte';

  type ThemePreference = 'system' | 'light' | 'dark';

  const storageKey = 'bergjohann-theme';

  let preference = $state<ThemePreference>('system');
  let ready = $state(false);

  function readPreference(): ThemePreference {
    try {
      const stored = localStorage.getItem(storageKey);

      return stored === 'light' || stored === 'dark'
        ? stored
        : 'system';
    } catch {
      return 'system';
    }
  }

  function applyTheme() {
    const dark =
      preference === 'dark' ||
      (
        preference === 'system' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches
      );

    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  }

  function changeTheme(value: string) {
    if (
      value !== 'system' &&
      value !== 'light' &&
      value !== 'dark'
    ) {
      return;
    }

    preference = value;
    applyTheme();

    try {
      if (value === 'system') {
        localStorage.removeItem(storageKey);
      } else {
        localStorage.setItem(storageKey, value);
      }
    } catch {
      // Ohne Speicher bleibt die Auswahl für die aktuelle Sitzung wirksam.
    }
  }

  onMount(() => {
    preference = readPreference();
    applyTheme();
    ready = true;

    const media = window.matchMedia('(prefers-color-scheme: dark)');

    const onSystemChange = () => {
      if (preference === 'system') {
        applyTheme();
      }
    };

    media.addEventListener('change', onSystemChange);

    return () => {
      media.removeEventListener('change', onSystemChange);
    };
  });
</script>

<label class="inline-flex items-center gap-2 text-sm">
  <span class="sr-only">Farbschema</span>

  <select
    class="min-h-11 rounded-lg border border-control-border bg-surface px-3 text-foreground disabled:opacity-60"
    value={preference}
    disabled={!ready}
    onchange={(event) => changeTheme(event.currentTarget.value)}
  >
    <option value="system">System</option>
    <option value="light">Hell</option>
    <option value="dark">Dunkel</option>
  </select>
</label>