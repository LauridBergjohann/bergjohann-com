<script lang="ts">
	// @ts-expect-error feather-icons does not provide TypeScript declarations
	import feather from 'feather-icons';

	type Props = {
		id: string;
		size?: number;
	};

	let { id, size = 24 }: Props = $props();

	const icon = $derived(
		feather.icons[id].toSvg({
			width: size,
			height: size
		})
	);
</script>

<!-- eslint-disable-next-line svelte/no-at-html-tags -->
<div>{@html icon}</div>
