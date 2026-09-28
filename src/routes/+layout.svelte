<script lang="ts">
  import '../app.css';

  import Header from '$lib/components/header/Header.svelte';
	import type { NavigationEntry } from './+layout';
	import Footer from '$lib/components/footer/Footer.svelte';

  

  const { children, data } = $props<{
		data: { currentPath: string; navigation: NavigationEntry[] };
	}>();
</script>

<Header currentPath={data.currentPath} navigation={data.navigation} />
 {@render children()}
<Footer />