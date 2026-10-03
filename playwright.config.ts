import { defineConfig, devices } from '@playwright/test';

/**
 * E2E contra la build de producció servida per `wrangler dev` (el mateix runtime que
 * Cloudflare Workers: redirecció 301 de `/`, capçaleres X-Robots-Tag, pàgines
 * prerenderitzades i SPA de /app).
 *
 * A Windows, `vite build` falla amb EPERM si `.svelte-kit/cloudflare` ja existeix
 * (l'adapter no el pot esborrar dins el build), per això es neteja abans amb Node.
 * En local es reaprofita un servidor ja obert al port 4173 (`npm run build && npm run preview`).
 */
const PORT = 4173;

export default defineConfig({
	testDir: 'e2e',
	testMatch: '**/*.e2e.{ts,js}',
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 2 : undefined,
	reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : [['list']],
	timeout: 30_000,
	expect: { timeout: 5_000 },
	use: {
		baseURL: `http://localhost:${PORT}`,
		locale: 'ca-ES',
		timezoneId: 'Europe/Madrid',
		trace: 'retain-on-failure',
		// Des del bloc 4d hi ha service worker a producció. Bloquejat per defecte: si el SW controla
		// la pàgina, les peticions que ell fa (estils i tessel·les del mapa, imatges) no passen per
		// `page.route` i els mocks deixen de ser deterministes. El SW es prova a `e2e/pwa.e2e.ts`
		// (i a la prova de privadesa) amb `test.use({ serviceWorkers: 'allow' })`.
		serviceWorkers: 'block',
		screenshot: 'only-on-failure'
	},
	projects: [
		{ name: 'mobile-chrome', use: { ...devices['Pixel 7'] } },
		{
			name: 'mobile-safari',
			use: { ...devices['iPhone SE (3rd gen)'] },
			// WebKit és el més lent sota càrrega (3 projectes en paral·lel): axe a /cims (150 cims)
			// i els índexs de seccions de contingut hi fan 25–43 s. 60 s continua detectant penjades.
			timeout: 60_000
		},
		{
			name: 'desktop-chrome',
			use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 } }
		}
	],
	webServer: {
		command:
			"node -e \"require('fs').rmSync('.svelte-kit/cloudflare',{recursive:true,force:true})\" && npm run build && npm run preview",
		url: `http://localhost:${PORT}/ca`,
		reuseExistingServer: !process.env.CI,
		timeout: 240_000,
		stdout: 'ignore',
		stderr: 'pipe'
	}
});
