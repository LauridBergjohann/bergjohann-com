import { defineConfig } from '@playwright/test';

export default defineConfig({
	testDir: './tests',
	testMatch: ['i18n.e2e.ts', 'preferences.e2e.ts'],
	fullyParallel: true,
	workers: 2,
	use: {
		baseURL: 'http://localhost:5173',
		browserName: 'chromium',
		viewport: { width: 1800, height: 1000 }
	},
	webServer: {
		command: 'npm run dev -- --host localhost --port 5173 --strictPort',
		url: 'http://localhost:5173',
		reuseExistingServer: !process.env.CI
	}
});
