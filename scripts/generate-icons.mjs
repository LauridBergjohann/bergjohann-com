// Deterministic raster exports of the existing SVG; no logo redesign or image service.
import { readFile, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';

const root = new URL('../static/', import.meta.url);
const svg = await readFile(new URL('branding/favicon.svg', root), 'utf8');
const jobs = [
	...[16, 32, 48].map((size) => ({ file: 'branding/favicon-' + size + '.png', size, scale: 0.94 })),
	{ file: 'branding/apple-touch-icon.png', size: 180, scale: 0.8, background: '#fbfdfc' },
	...[192, 512].flatMap((size) => [
		{ file: 'branding/icon-' + size + '.png', size, scale: 0.8 },
		// A square of side 56% fits inside the maskable safe circle (radius 40%).
		{ file: 'branding/icon-maskable-' + size + '.png', size, scale: 0.56, background: '#fbfdfc' }
	])
];
const browser = await chromium.launch({ headless: true });
try {
	const page = await browser.newPage();
	const renders = await page.evaluate(
		async ({ source, jobs }) => {
			const image = new Image();
			image.src = source;
			await image.decode();
			return jobs.map((job) => {
				const canvas = document.createElement('canvas');
				canvas.width = canvas.height = job.size;
				const ctx = canvas.getContext('2d');
				if (job.background) {
					ctx.fillStyle = job.background;
					ctx.fillRect(0, 0, job.size, job.size);
				}
				const factor = (job.size * job.scale) / Math.max(image.naturalWidth, image.naturalHeight);
				const width = image.naturalWidth * factor,
					height = image.naturalHeight * factor;
				ctx.drawImage(image, (job.size - width) / 2, (job.size - height) / 2, width, height);
				return {
					file: job.file,
					size: job.size,
					png: canvas.toDataURL('image/png').split(',')[1],
					rgba: job.size <= 48 ? Array.from(ctx.getImageData(0, 0, job.size, job.size).data) : null
				};
			});
		},
		{ source: 'data:image/svg+xml;base64,' + Buffer.from(svg).toString('base64'), jobs }
	);
	for (const render of renders)
		await writeFile(new URL(render.file, root), Buffer.from(render.png, 'base64'));

	// Use classic 32-bit DIB entries rather than PNG-in-ICO for older favicon readers.
	const icons = renders
		.filter((render) => render.rgba)
		.map(({ size, rgba }) => {
			const stride = Math.ceil(size / 32) * 4;
			const dib = Buffer.alloc(40 + size * size * 4 + stride * size);
			dib.writeUInt32LE(40, 0);
			dib.writeInt32LE(size, 4);
			dib.writeInt32LE(size * 2, 8);
			dib.writeUInt16LE(1, 12);
			dib.writeUInt16LE(32, 14);
			dib.writeUInt32LE(size * size * 4 + stride * size, 20);
			for (let y = 0; y < size; y++)
				for (let x = 0; x < size; x++) {
					const src = (y * size + x) * 4,
						dst = 40 + ((size - y - 1) * size + x) * 4;
					dib[dst] = rgba[src + 2];
					dib[dst + 1] = rgba[src + 1];
					dib[dst + 2] = rgba[src];
					dib[dst + 3] = rgba[src + 3];
					if (rgba[src + 3] === 0)
						dib[40 + size * size * 4 + (size - y - 1) * stride + Math.floor(x / 8)] |=
							0x80 >> (x % 8);
				}
			return { size, dib };
		});
	const directory = Buffer.alloc(6 + icons.length * 16);
	directory.writeUInt16LE(1, 2);
	directory.writeUInt16LE(icons.length, 4);
	let offset = directory.length;
	icons.forEach(({ size, dib }, index) => {
		const entry = 6 + index * 16;
		directory[entry] = directory[entry + 1] = size;
		directory.writeUInt16LE(1, entry + 4);
		directory.writeUInt16LE(32, entry + 6);
		directory.writeUInt32LE(dib.length, entry + 8);
		directory.writeUInt32LE(offset, entry + 12);
		offset += dib.length;
	});
	await writeFile(
		new URL('favicon.ico', root),
		Buffer.concat([directory, ...icons.map((icon) => icon.dib)])
	);
	console.log(
		'Generated ' + renders.length + ' PNG icons and favicon.ico from branding/favicon.svg.'
	);
} finally {
	await browser.close();
}
