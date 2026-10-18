import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { loadEnv, type Plugin } from 'vite';

/**
 * Variables públiques de Supabase al build (`$env/static/public`).
 *
 * SvelteKit les llegeix de `.env` o de l'entorn del procés. El `.env` no es versiona, així que
 * en un build sense `.env` (CI, Cloudflare) s'agafen de `vars` de `wrangler.jsonc`, que és la
 * font versionada (són públiques: URL del projecte i clau publicable). Ordre: entorn/`.env` >
 * `wrangler.jsonc`. Aquest plugin ha d'anar **abans** de `sveltekit()` a `vite.config.ts`.
 */
export const VARS_SUPABASE = ['PUBLIC_SUPABASE_URL', 'PUBLIC_SUPABASE_PUBLISHABLE_KEY'] as const;

/**
 * Altres variables públiques del compte que es resolen igual (entorn/`.env` > `wrangler.jsonc` >
 * buit). `PUBLIC_GOOGLE_AUTH`: entrada amb Google (`"true"` per activar-la; buit o qualsevol altre
 * valor = desactivada). El secret del client de Google només va al panell de Supabase.
 * `PUBLIC_PASSWORD_AUTH`: entrada amb correu i contrasenya (mateix criteri, desactivada per defecte).
 */
export const VARS_COMPTE = ['PUBLIC_GOOGLE_AUTH', 'PUBLIC_PASSWORD_AUTH'] as const;

/** Valor string d'una clau de primer nivell dins de `vars` (sense parsejar el JSONC sencer). */
export function valorVarWrangler(jsonc: string, nom: string): string | undefined {
	const m = new RegExp(`"${nom}"\\s*:\\s*"([^"]*)"`).exec(jsonc);
	return m?.[1] || undefined;
}

export function pluginEnvSupabase(): Plugin {
	return {
		name: 'carnetdecims:env-supabase',
		// `order: 'pre'` i abans de `sveltekit()` a l'array: el `config` de SvelteKit també és 'pre'
		// i és on llegeix l'entorn (`get_env`).
		config: {
			order: 'pre',
			handler(_config, { mode }) {
				const arrel = process.cwd();
				const entorn = loadEnv(mode, arrel, 'PUBLIC_');
				const ruta = resolve(arrel, 'wrangler.jsonc');
				const jsonc = existsSync(ruta) ? readFileSync(ruta, 'utf8') : '';
				for (const nom of [...VARS_SUPABASE, ...VARS_COMPTE]) {
					if (entorn[nom]) continue;
					// Sense valor enlloc: string buit (client "no configurat"; el build no peta).
					// (`process.env` com a registre genèric: els tipus de `wrangler types` poden ser literals.)
					(process.env as Record<string, string | undefined>)[nom] =
						valorVarWrangler(jsonc, nom) ?? '';
				}
			}
		}
	};
}
