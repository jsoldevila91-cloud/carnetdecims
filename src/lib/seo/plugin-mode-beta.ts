import { existsSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { loadEnv, type Plugin } from 'vite';
import {
	NOM_VARIABLE_MODE_BETA,
	aplicarBlocBeta,
	resoldreModeBeta,
	valorModeBetaWrangler
} from './mode-beta-config.ts';

/**
 * Mode beta al build (docs/02 §7.1):
 * - defineix `__MODE_BETA__` (el llegeix `mode-beta.ts`) per a pàgines, hooks i sitemaps;
 * - al build, escriu (o neteja) el bloc `X-Robots-Tag` del `_headers` de l'arrel, que l'adapter
 *   copia a `.svelte-kit/cloudflare/_headers`: les pàgines prerenderitzades no passen pel Worker.
 */
export function pluginModeBeta(): Plugin {
	return {
		name: 'carnetdecims:mode-beta',
		config(_config, { mode, command }) {
			const arrel = process.cwd();
			const entorn = loadEnv(mode, arrel, 'PUBLIC_')[NOM_VARIABLE_MODE_BETA];
			const wranglerPath = resolve(arrel, 'wrangler.jsonc');
			const wrangler = existsSync(wranglerPath)
				? valorModeBetaWrangler(readFileSync(wranglerPath, 'utf8'))
				: undefined;
			const beta = resoldreModeBeta(entorn, wrangler);

			if (command === 'build') {
				const headersPath = resolve(arrel, '_headers');
				const actual = existsSync(headersPath) ? readFileSync(headersPath, 'utf8') : undefined;
				const nou = aplicarBlocBeta(actual, beta);
				if (nou === undefined) {
					if (actual !== undefined) rmSync(headersPath);
				} else if (nou !== actual) {
					writeFileSync(headersPath, nou);
				}
			}

			return { define: { __MODE_BETA__: JSON.stringify(beta) } };
		}
	};
}
