import { expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Icon from './Icon.svelte';

it('updates the SVG when its icon or size changes', async () => {
	const screen = await render(Icon, { props: { id: 'sun', size: 18 } });
	expect(screen.container.querySelector('svg')).toHaveClass('feather-sun');
	await screen.rerender({ id: 'moon', size: 32 });
	const icon = screen.container.querySelector('svg');
	expect(icon).toHaveClass('feather-moon');
	expect(icon).toHaveAttribute('width', '32');
	expect(icon).toHaveAttribute('height', '32');
});
