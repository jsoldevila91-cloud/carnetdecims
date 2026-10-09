/**
 * Compte d'usuari (fase 5, beta privada): accés sense contrasenya per correu, sessió, supressió i
 * exportació del compte. Contracte per a la UI (`/ca/app/compte`, `/es/app/cuenta`).
 *
 * Accés: `entrarAmbEmail` envia un correu amb **un enllaç i un codi** (plantilla a
 * `docs/09-supabase-auth.md`):
 * - l'enllaç torna a `redirectTo` amb `?token_hash=…&type=email`; la pàgina crida
 *   `completarEntradaDesDeUrl()`. Funciona encara que s'obri en un altre navegador o dispositiu
 *   (no depèn del verificador PKCE desat);
 * - el codi (6–10 xifres) es pot escriure a la mateixa pantalla (`verificarCodi`): és el camí
 *   bo per a la PWA instal·lada a l'iPhone, on l'enllaç del correu s'obre a Safari i no a la PWA.
 *
 * La sessió es desa al dispositiu (`platform/supabase.ts`) i la sync (`sync.ts`) s'activa sola
 * mentre hi ha sessió. Aquest mòdul és de navegador: importa'l de manera diferida.
 */
import { esborrarTot, FORMAT_EXPORTACIO, VERSIO_EXPORTACIO, type StoreLectura } from './ascensions';
import { CATALEG_VERSIO, CIMS } from './catalog/cataleg';
import { ara } from './local/rellotge';
import {
	alliberarDadesLocals,
	classificarError,
	configurarSync,
	filaDesDeSql,
	remotSupabase,
	sincronitzarAra
} from './sync';
import {
	obtenirSupabase,
	sessioDesada,
	supabaseConfigurat,
	type ClientSupabase
} from '$lib/platform/supabase';

// ---------------------------------------------------------------------------
// Contracte
// ---------------------------------------------------------------------------

export interface UsuariSessio {
	id: string;
	email: string | null;
}

/** `usuari` només hi és (i sempre hi és) quan `estat === 'autenticat'`. */
export interface Sessio {
	estat: 'carregant' | 'anonim' | 'autenticat';
	usuari?: UsuariSessio;
}

export type CodiErrorCompte =
	| 'email:invalid'
	| 'codi:invalid' // codi o enllaç incorrecte o caducat
	| 'limit' // massa correus o intents seguits (cal esperar)
	| 'xarxa'
	| 'sessio' // cal tornar a entrar
	| 'no-configurat' // falten PUBLIC_SUPABASE_*
	| 'servidor';

/** Error d'una operació del compte. `codi` estable per traduir amb `messages/`. */
export class ErrorCompte extends Error {
	readonly codi: CodiErrorCompte;

	constructor(codi: CodiErrorCompte, missatge?: string) {
		super(missatge ? `Compte (${codi}): ${missatge}` : `Compte: ${codi}`);
		this.name = 'ErrorCompte';
		this.codi = codi;
	}
}

/** El compte (Supabase) està configurat en aquest build? Si no, la UI no l'ofereix. */
export const compteDisponible = supabaseConfigurat;

// ---------------------------------------------------------------------------
// Sessió observable
// ---------------------------------------------------------------------------

let sessioActual: Sessio = { estat: 'carregant' };
const subscriptors = new Set<(s: Sessio) => void>();

function publicar(s: Sessio): void {
	const abans = sessioActual;
	sessioActual = s;
	const canvia =
		abans.estat !== s.estat ||
		abans.usuari?.id !== s.usuari?.id ||
		abans.usuari?.email !== s.usuari?.email;
	if (canvia) for (const run of subscriptors) run(s);
}

/**
 * Sessió actual per a `$sessio` de Svelte: `carregant` fins que es llegeix la sessió desada,
 * després `anonim` o `autenticat`. Subscriure-s'hi inicialitza el compte (`iniciarCompte`).
 * En SSR emet `carregant` i no fa res més.
 */
export const sessio: StoreLectura<Sessio> = {
	subscribe(run) {
		run(sessioActual);
		subscriptors.add(run);
		iniciarCompte();
		return () => {
			subscriptors.delete(run);
		};
	}
};

let iniciat = false;

function usuariDe(
	u: { id: string; email?: string | null } | null | undefined
): UsuariSessio | null {
	return u?.id ? { id: u.id, email: u.email ?? null } : null;
}

function aplicarSessio(client: ClientSupabase, usuari: UsuariSessio | null): void {
	if (usuari) {
		publicar({ estat: 'autenticat', usuari });
		configurarSync({ remot: remotSupabase(client), usuariId: usuari.id });
	} else {
		publicar({ estat: 'anonim' });
		configurarSync(null);
	}
}

/**
 * Inicialitza el client, llegeix la sessió desada i escolta els canvis (entrar, sortir,
 * renovació del token). Idempotent; només al navegador. La crida `sessio` en subscriure-s'hi.
 */
export function iniciarCompte(): void {
	if (iniciat || typeof window === 'undefined') return;
	iniciat = true;
	if (!supabaseConfigurat()) {
		publicar({ estat: 'anonim' });
		return;
	}
	const client = obtenirSupabase();
	client.auth.onAuthStateChange((event, session) => {
		// No es criden altres mètodes de supabase-js dins del callback (bloqueig intern):
		// la sync s'activa al torn següent.
		setTimeout(() => {
			let usuari = usuariDe(session?.user);
			// Offline amb el token caducat, supabase-js dona `null` però la sessió continua desada
			// (només l'esborra si el servidor la rebutja: SIGNED_OUT). Es manté l'usuari.
			if (!usuari && event !== 'SIGNED_OUT') usuari = sessioDesada();
			aplicarSessio(client, usuari);
		}, 0);
	});
}

// ---------------------------------------------------------------------------
// Entrar i sortir
// ---------------------------------------------------------------------------

const RE_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function errorAuth(
	error: { message?: string; status?: number; code?: string } | null
): ErrorCompte {
	const codi = error?.code ?? '';
	const status = error?.status ?? 0;
	const missatge = error?.message ?? '';
	if (status === 429 || /rate_limit|over_.*limit/.test(codi))
		return new ErrorCompte('limit', missatge);
	if (codi === 'otp_expired' || codi === 'otp_disabled' || /expired|invalid/i.test(missatge)) {
		if (status >= 400 && status < 500) return new ErrorCompte('codi:invalid', missatge);
	}
	if (codi === 'email_address_invalid' || codi === 'validation_failed') {
		return new ErrorCompte('email:invalid', missatge);
	}
	const sync = classificarError(error, status || undefined);
	if (sync.codi === 'xarxa') return new ErrorCompte('xarxa', missatge);
	return new ErrorCompte('servidor', missatge);
}

function client(): ClientSupabase {
	if (!supabaseConfigurat()) throw new ErrorCompte('no-configurat');
	iniciarCompte();
	return obtenirSupabase();
}

/**
 * Envia el correu d'accés (enllaç + codi). Crea el compte si no existeix. `redirectTo` ha de
 * ser una URL absoluta de la llista permesa de Supabase (p. ex. `${origin}/ca/app/compte`).
 * @throws ErrorCompte (`email:invalid`, `limit`, `xarxa`, `servidor`, `no-configurat`)
 */
export async function entrarAmbEmail(
	email: string,
	opcions: { redirectTo: string }
): Promise<void> {
	const net = email.trim().toLowerCase();
	if (!RE_EMAIL.test(net) || net.length > 254) throw new ErrorCompte('email:invalid');
	let res;
	try {
		res = await client().auth.signInWithOtp({
			email: net,
			options: { emailRedirectTo: opcions.redirectTo, shouldCreateUser: true }
		});
	} catch (e) {
		if (e instanceof ErrorCompte) throw e;
		throw new ErrorCompte('xarxa', String(e));
	}
	if (res.error) throw errorAuth(res.error);
}

/**
 * Completa l'accés amb el codi del correu (alternativa a l'enllaç).
 * @throws ErrorCompte (`codi:invalid`, `limit`, `xarxa`, `servidor`)
 */
export async function verificarCodi(email: string, codi: string): Promise<UsuariSessio> {
	const token = codi.replace(/\s+/g, '');
	if (!/^\d{6,10}$/.test(token)) throw new ErrorCompte('codi:invalid');
	let res;
	try {
		res = await client().auth.verifyOtp({
			email: email.trim().toLowerCase(),
			token,
			type: 'email'
		});
	} catch (e) {
		if (e instanceof ErrorCompte) throw e;
		throw new ErrorCompte('xarxa', String(e));
	}
	if (res.error) throw errorAuth(res.error);
	const usuari = usuariDe(res.data.user);
	if (!usuari) throw new ErrorCompte('servidor', 'sense usuari');
	return usuari;
}

const PARAMS_AUTH = ['token_hash', 'type', 'code', 'error', 'error_code', 'error_description'];

/**
 * Crida-la en carregar `/app/compte`: si la URL ve de l'enllaç del correu, completa la sessió i
 * neteja els paràmetres de la URL (`history.replaceState`). Retorna:
 * - `'cap'` si la URL no porta res d'autenticació;
 * - `'entrat'` si s'ha iniciat la sessió;
 * - un `ErrorCompte` (no el llança) si l'enllaç és invàlid, caducat o ja s'ha fet servir.
 */
export async function completarEntradaDesDeUrl(
	url: URL = new URL(window.location.href)
): Promise<'cap' | 'entrat' | ErrorCompte> {
	const q = url.searchParams;
	const hash = new URLSearchParams(url.hash.replace(/^#/, ''));
	const hiHaAuth = PARAMS_AUTH.some((p) => q.has(p) || hash.has(p)) || hash.has('access_token');
	if (!hiHaAuth) return 'cap';
	let resultat: 'entrat' | ErrorCompte;
	try {
		const c = client();
		const errorUrl =
			q.get('error_code') ?? hash.get('error_code') ?? q.get('error') ?? hash.get('error');
		const tokenHash = q.get('token_hash');
		if (errorUrl) {
			resultat = new ErrorCompte(
				/expired|invalid|denied/i.test(errorUrl) ? 'codi:invalid' : 'servidor',
				errorUrl
			);
		} else if (tokenHash) {
			const tipus = q.get('type') === 'magiclink' ? 'magiclink' : 'email';
			const { data, error } = await c.auth.verifyOtp({ token_hash: tokenHash, type: tipus });
			resultat = error ? errorAuth(error) : data.session ? 'entrat' : new ErrorCompte('servidor');
		} else {
			// `?code=` (PKCE) o `#access_token` (implícit): supabase-js ja els processa en
			// inicialitzar-se (`detectSessionInUrl`); aquí només s'espera el resultat.
			const { data, error } = await c.auth.getSession();
			resultat = error
				? errorAuth(error)
				: data.session
					? 'entrat'
					: new ErrorCompte('codi:invalid');
		}
	} catch (e) {
		resultat = e instanceof ErrorCompte ? e : new ErrorCompte('xarxa', String(e));
	}
	// Treu els paràmetres d'autenticació de la URL (i de l'historial).
	if (typeof history !== 'undefined') {
		const neta = new URL(url);
		for (const p of PARAMS_AUTH) neta.searchParams.delete(p);
		neta.hash = '';
		history.replaceState(history.state, '', neta.pathname + neta.search);
	}
	return resultat;
}

/**
 * Tanca la sessió en aquest dispositiu. Les dades locals es queden (marcades com a de l'usuari
 * que surt: si hi entra un altre compte, se li preguntarà què fer-ne) llevat de
 * `esborrarDades: true`, que les esborra del dispositiu (no del núvol).
 */
export async function sortir(opcions: { esborrarDades?: boolean } = {}): Promise<void> {
	configurarSync(null);
	if (supabaseConfigurat()) {
		// `local`: no cal xarxa; el refresh token d'aquest dispositiu queda invalidat al servidor
		// quan n'hi ha (supabase-js ho intenta i, si no pot, esborra igualment la sessió local).
		await client()
			.auth.signOut({ scope: 'local' })
			.catch(() => {});
	}
	if (opcions.esborrarDades) await esborrarTot();
	publicar({ estat: 'anonim' });
}

// ---------------------------------------------------------------------------
// RGPD: supressió i exportació
// ---------------------------------------------------------------------------

/**
 * Esborra el compte i totes les dades del núvol (RPC `esborrar_compte`, irreversible) i tanca la
 * sessió. Per defecte també esborra les dades d'aquest dispositiu; amb
 * `conservarDispositiu: true` s'hi queden com a dades sense compte.
 * Cal xarxa i sessió vàlida.
 * @throws ErrorCompte (`sessio`, `xarxa`, `servidor`)
 */
export async function esborrarCompte(
	opcions: { conservarDispositiu?: boolean } = {}
): Promise<void> {
	const c = client();
	if (sessioActual.estat !== 'autenticat') throw new ErrorCompte('sessio');
	let res;
	try {
		res = await c.rpc('esborrar_compte');
	} catch (e) {
		throw new ErrorCompte('xarxa', String(e));
	}
	if (res.error) {
		const e = classificarError(res.error, res.status);
		throw new ErrorCompte(e.codi, res.error.message);
	}
	configurarSync(null);
	// L'usuari ja no existeix: només cal oblidar la sessió local.
	await c.auth.signOut({ scope: 'local' }).catch(() => {});
	if (opcions.conservarDispositiu) await alliberarDadesLocals();
	else await esborrarTot();
	publicar({ estat: 'anonim' });
}

/**
 * Exportació de les dades del compte al núvol (RGPD, art. 15 i 20): JSON amb el mateix format
 * que `exportarDades` (importable amb `importarDades`), més `compte` (id, correu, perfil) i les
 * ascensions esborrades (`deletedAt`; la importació les ignora). Cal xarxa i sessió.
 * @throws ErrorCompte (`sessio`, `xarxa`, `servidor`)
 */
export async function exportarDadesCompte(): Promise<string> {
	const c = client();
	const usuari = sessioActual.usuari;
	if (sessioActual.estat !== 'autenticat' || !usuari) throw new ErrorCompte('sessio');
	// Primer es puja el que hi hagi pendent, perquè l'exportació sigui completa.
	await sincronitzarAra();
	const files: ReturnType<typeof filaDesDeSql>['fila'][] = [];
	const PAGINA = 1000;
	for (let desde = 0; ; desde += PAGINA) {
		const res = await c
			.from('ascensions')
			.select(
				'id, cim_id, data, metode, nota, created_at, updated_at, deleted_at, server_updated_at'
			)
			.order('data', { ascending: false })
			.order('id', { ascending: true })
			.range(desde, desde + PAGINA - 1);
		if (res.error) {
			const e = classificarError(res.error, res.status);
			throw new ErrorCompte(e.codi, res.error.message);
		}
		files.push(...res.data.map((r) => filaDesDeSql(r).fila));
		if (res.data.length < PAGINA) break;
	}
	const perfil = await c.from('perfils').select('alias, created_at, updated_at').maybeSingle();
	const noms = new Map(CIMS.map((cim) => [cim.id, cim.nom]));
	const vives = files.filter((f) => !f.deletedAt);
	return JSON.stringify(
		{
			format: FORMAT_EXPORTACIO,
			versio: VERSIO_EXPORTACIO,
			app: 'carnetdecims.cat',
			exportatAt: ara().toISOString(),
			catalegVersio: CATALEG_VERSIO,
			avis: 'Còpia de les dades del teu compte de Carnet de Cims (web no oficial). No és el registre oficial del repte 100 Cims: la validació la fa la FEEC a través de les entitats.',
			compte: {
				id: usuari.id,
				email: usuari.email,
				perfil: perfil.data ?? null
			},
			total: vives.length,
			ascensions: files.map((f) => ({
				id: f.id,
				cimId: f.cimId,
				cimNom: noms.get(f.cimId),
				data: f.data,
				metode: f.metode,
				nota: f.nota,
				createdAt: f.createdAt,
				updatedAt: f.updatedAt,
				...(f.deletedAt ? { deletedAt: f.deletedAt } : {})
			}))
		},
		null,
		2
	);
}
