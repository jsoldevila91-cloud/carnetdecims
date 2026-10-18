import { defineConfig, devices } from '@playwright/test';

/**
 * E2E de l'entrada amb correu i contrasenya (`PUBLIC_PASSWORD_AUTH=true`). Com la de Google
 * (`playwright.google.config.ts`): el flag es fixa en temps de build i la build de producció dels
 * E2E normals el porta a `false`, així que aquí es fa servir `vite dev` en un port propi. També hi
 * va `PUBLIC_GOOGLE_AUTH=true` per comprovar l'ordre Google → contrasenya → enllaç.
 * Només executa `e2e/*.contrasenya.ts`. Supabase és el fals (`supabase-fals.ts`): cap correu ni
 * compte real.
 *
 *   npx playwright test -c e2e/playwright.contrasenya.config.ts
 */
const PORT = 5193;

export default defineConfig({
	testDir: '.',
	testMatch: '**/*.contrasenya.ts',
	fullyParallel: true,
	// `vite dev` compila els mòduls en la primera petició: amb 6 workers a la vegada, la primera
	// tanda de tests pot passar dels 15 s de `waitForHydration` (servidor en fred). Un reintent ho
	// cobreix; un test que falli dues vegades és un error real (surt com a "flaky" si passa al 2n).
	retries: 1,
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
		env: { PUBLIC_PASSWORD_AUTH: 'true', PUBLIC_GOOGLE_AUTH: 'true', PUBLIC_MODE_BETA: 'false' },
		reuseExistingServer: false,
		timeout: 120_000
	}
});
