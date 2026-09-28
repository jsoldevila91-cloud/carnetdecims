import { paraglideVitePlugin } from '@inlang/paraglide-js';
import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';
import adapter from '@sveltejs/adapter-cloudflare';
import { sveltekit } from '@sveltejs/kit/vite';
import { buildUrlPatterns, cimEntries, prerenderEntries } from './src/lib/i18n/routes.ts';
import { sitemapEntries } from './src/lib/seo/sitemap.ts';

export default defineConfig({
	plugins: [
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},
			adapter: adapter(),
			prerender: {
				// Les rutes internes no porten idioma: es prerenderitzen les URL localitzades
				// (/ca, /es, /ca/cims, /es/cimas…) i el crawler segueix els enllaços.
				// Els sitemaps (/sitemap-index.xml i un per secció i idioma) no s'enllacen: s'hi afegeixen.
				// Les fitxes de cim (/ca/cims/{slug}, /es/cimas/{slug}) s'hi afegeixen totes explícitament.
				entries: [...prerenderEntries(), ...cimEntries(), ...sitemapEntries()]
			}
		}),

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
