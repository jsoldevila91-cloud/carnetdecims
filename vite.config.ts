import { paraglideVitePlugin } from '@inlang/paraglide-js';
import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';
import adapter from '@sveltejs/adapter-cloudflare';
import { sveltekit } from '@sveltejs/kit/vite';
import {
	buildUrlPatterns,
	cimEntries,
	comarcaEntries,
	LOCALES,
	prerenderEntries
} from './src/lib/i18n/routes.ts';
import { SITEMAP_INDEX_PATH } from './src/lib/seo/sitemap.ts';
import { pluginSwDiferits } from './src/lib/platform/sw/plugin-vite.ts';
import { pluginModeBeta } from './src/lib/seo/plugin-mode-beta.ts';
import { pluginEnvSupabase } from './src/lib/platform/plugin-env-supabase.ts';

export default defineConfig({
	plugins: [
		// Beta privada (`PUBLIC_MODE_BETA`, per defecte `true`): tot el lloc noindex (docs/02 §7.1).
		pluginModeBeta(),

		// URL i clau publicable de Supabase: `.env` o, si no n'hi ha, `vars` de `wrangler.jsonc`.
		// Abans de `sveltekit()`, que llegeix l'entorn per a `$env/static/public`.
		pluginEnvSupabase(),

		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},
			adapter: adapter(),
			// El service worker (`src/service-worker.ts`) el registra `platform/pwa.ts` (no en dev,
			// actualització controlada per l'usuari), no SvelteKit.
			serviceWorker: { register: false },
			// Camins absoluts (`/_app/...`): el SW serveix el shell de `/app` i la pàgina offline des
			// de qualsevol URL, i amb camins relatius (`../_app`) es trencarien en una altra profunditat.
			paths: { relative: false },
			// CSS petit inline a l'HTML (sense peticions que bloquegin el render): baixa FCP i LCP al
			// mòbil. 20 kB deixa fora el CSS de MapLibre (~83 kB), que només fa servir /mapa.
			inlineStyleThreshold: 20_000,
			prerender: {
				// Les rutes internes no porten idioma: es prerenderitzen les URL localitzades
				// (/ca, /es, /ca/cims, /es/cimas…) i el crawler segueix els enllaços.
				// Els sitemaps no s'enllacen: s'hi afegeix l'índex; els de secció (un per secció i idioma)
				// els genera l'`entries` de la ruta `sitemap-[name].xml` (la config no pot calcular-los:
				// el contingut de les fitxes es carrega amb `import.meta.glob`; vegeu `seo/sitemap.ts`).
				// Les fitxes de cim (/ca/cims/{slug}, /es/cimas/{slug}) i les pàgines de comarca amb cims
				// (/ca/comarques/{slug}, /es/comarcas/{slug}) s'hi afegeixen totes explícitament.
				// Els manifests de la PWA (un per idioma) s'enllacen des de app.html amb un marcador.
				entries: [
					...prerenderEntries(),
					...cimEntries(),
					...comarcaEntries(),
					SITEMAP_INDEX_PATH,
					...LOCALES.map((l) => `/manifest-${l}.webmanifest` as const),
					// Pàgina offline que serveix el service worker (noindex, fora del sitemap).
					...LOCALES.map((l) => `/${l}/offline` as const)
				]
			}
		}),

		// Fitxers que el service worker no precarrega (MapLibre i el seu worker): `platform/sw/diferits.ts`.
		pluginSwDiferits(),

		paraglideVitePlugin({
			project: './project.inlang',
			outdir: './src/lib/paraglide',
			emitTsDeclarations: true,
			// La URL és la font de veritat: /ca/... i /es/... (sense detecció del navegador).
			strategy: ['url', 'baseLocale'],
			urlPatterns: buildUrlPatterns()
		})
	],
	// Port propi per no compartir origen (ni service workers) amb altres projectes a :5173
	server: { port: 5190, strictPort: true },
	test: {
		expect: { requireAssertions: true },
		projects: [
			{
				extends: './vite.config.ts',
				test: {
					name: 'client',
					browser: {
						enabled: true,
						provider: playwright(),
						instances: [{ browser: 'chromium', headless: true }]
					},
					include: ['src/**/*.svelte.{test,spec}.{js,ts}'],
					exclude: ['src/lib/server/**']
				}
			},

			{
				extends: './vite.config.ts',
				test: {
					name: 'server',
					environment: 'node',
					include: ['src/**/*.{test,spec}.{js,ts}'],
					exclude: ['src/**/*.svelte.{test,spec}.{js,ts}']
				}
			}
		]
	}
});
