/**
 * Client de Supabase (fase 5: comptes i sync). Només al navegador.
 *
 * - URL i clau **publicable** des de `$env/static/public` (`.env` en local, `vars` de
 *   `wrangler.jsonc` al build de producció). Són públiques per disseny: la seguretat és la RLS.
 * - Sessió persistent a `localStorage` (clau pròpia `CLAU_SESSIO`), renovació automàtica del
 *   token i flux PKCE. Compatible amb la PWA i offline: sense xarxa, la sessió desada es conserva
 *   i es renova quan torna la connexió (vegeu `sessioDesada`).
 * - `detectSessionInUrl`: si l'enllaç del correu torna amb `?code=` (plantilla per defecte de
 *   Supabase i mateix navegador), el client el bescanvia sol en inicialitzar-se. La plantilla
 *   pròpia (`docs/09-supabase-auth.md`) torna amb `?token_hash=`, que gestiona `compte.ts`.
 */
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_PUBLISHABLE_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';
import type { Database } from './supabase-tipus';

export type ClientSupabase = SupabaseClient<Database>;

/** Clau de `localStorage` on supabase-js desa la sessió. */
export const CLAU_SESSIO = 'carnetdecims-auth';

/** Hi ha URL i clau? (Si falten, la app funciona igual, només en local.) */
export function supabaseConfigurat(): boolean {
	return Boolean(PUBLIC_SUPABASE_URL && PUBLIC_SUPABASE_PUBLISHABLE_KEY);
}

/** `localStorage` si es pot fer servir (Safari privat, cookies bloquejades…); si no, memòria. */
function emmagatzematge(): Pick<Storage, 'getItem' | 'setItem' | 'removeItem'> {
	try {
		const prova = '__carnetdecims_prova__';
		localStorage.setItem(prova, '1');
		localStorage.removeItem(prova);
		return localStorage;
	} catch {
		const mem = new Map<string, string>();
		return {
			getItem: (k) => mem.get(k) ?? null,
			setItem: (k, v) => void mem.set(k, v),
			removeItem: (k) => void mem.delete(k)
		};
	}
}

let client: ClientSupabase | null = null;

/**
 * Client únic. Llança si no és al navegador o si falta la configuració (la UI ha de comprovar
 * `supabaseConfigurat()` abans d'oferir el compte).
 */
export function obtenirSupabase(): ClientSupabase {
	if (typeof window === 'undefined') throw new Error('Supabase només al navegador');
	if (!supabaseConfigurat()) throw new Error('Supabase no configurat (PUBLIC_SUPABASE_*)');
	client ??= createClient<Database>(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY, {
		auth: {
			flowType: 'pkce',
			persistSession: true,
			autoRefreshToken: true,
			detectSessionInUrl: true,
			storageKey: CLAU_SESSIO,
			storage: emmagatzematge()
		}
	});
	return client;
}

/**
 * Usuari de la sessió desada, sense xarxa ni validar el token. Serveix per no mostrar "sense
 * compte" quan s'obre la PWA offline amb el token caducat (supabase-js no el pot renovar fins
 * que torni la xarxa, però la sessió continua desada).
 */
export function sessioDesada(): { id: string; email: string | null } | null {
	try {
		const brut = localStorage.getItem(CLAU_SESSIO);
		if (!brut) return null;
		const s = JSON.parse(brut) as { user?: { id?: unknown; email?: unknown } };
		const id = s?.user?.id;
		if (typeof id !== 'string' || !id) return null;
		return { id, email: typeof s.user?.email === 'string' ? s.user.email : null };
	} catch {
		return null;
	}
}
