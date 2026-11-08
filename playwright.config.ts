import { defineConfig } from '@playwright/test';

const port = process.env.BERGJOHANN_TEST_PORT ?? '4173';
export default defineConfig({
	workers: 2,
	use: { baseURL: `http://127.0.0.1:${port}`, viewport: { width: 1800, height: 1000 } },
	webServer: {
		command: `npm run build:preview && npm run preview -- --host 127.0.0.1 --port ${port} --strictPort`,
		url: `http://127.0.0.1:${port}`,
		timeout: 180000
	},
	testMatch: '**/*.e2e.{ts,js}'
});
