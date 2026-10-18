import { defineConfig, devices } from '@playwright/test';

/**
 * E2E de l'entrada amb Google (`PUBLIC_GOOGLE_AUTH=true`). El flag es fixa en temps de build, i
 * la build de producció dels E2E normals el porta a `false`; aquí es fa servir `vite dev` (port
 * propi) per no tocar `.svelte-kit/cloudflare`. Només executa `e2e/*.google.ts`.
 *
 *   npx playwright test -c e2e/playwright.google.config.ts --project=desktop-chrome
 */
const PORT = 5192;

export default defineConfig({
	testDir: '.',
	testMatch: '**/*.google.ts',
	fullyParallel: true,
	reporter: [['list']],
	timeout: 60_000,
	expect: { timeout: 8_000 },
	use: {
		baseURL: `http://localhost:${PORT}`,
		locale: 'ca-ES',
		timezoneId: 'Europe/Madrid',
		serviceWorkers: 'block',
		trace: 'retain-on-failure'
	},
	projects: [
		{ name: 'mobile-chrome', use: { ...devices['Pixel 7'] } },
		{ name: 'mobile-safari', use: { ...devices['iPhone SE (3rd gen)'] } },
		{
			name: 'desktop-chrome',
			use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 } }
		}
	],
	webServer: {
		cwd: '..',
		command: `npx vite dev --port ${PORT} --strictPort`,
		url: `http://localhost:${PORT}/ca`,
		env: { PUBLIC_GOOGLE_AUTH: 'true', PUBLIC_MODE_BETA: 'false' },
		reuseExistingServer: false,
		timeout: 120_000
	}
});
