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
 * Entrada amb Google (`entrarAmbGoogle`, desactivada per defecte: `PUBLIC_GOOGLE_AUTH`): Supabase
 * OAuth amb PKCE. Torna a `redirectTo` amb `?code=` (el client el bescanvia sol,
 * `detectSessionInUrl`) o amb `?error=…` (p. ex. `access_denied` si l'usuari cancel·la); la pàgina
 * crida igualment `completarEntradaDesDeUrl()`. El secret del client de Google només és al panell
 * de Supabase (`docs/12-google-oauth.md`).
 *
 * Entrada amb correu i contrasenya (desactivada per defecte: `PUBLIC_PASSWORD_AUTH`):
 * - `crearCompteAmbContrasenya` (Supabase `signUp`): amb "Confirm email" actiu no hi ha sessió
 *   fins que es confirma el correu (`'confirmar-correu'`). Si el correu ja té compte, Supabase no
 *   ho diu (usuari ofuscat sense identitats) i tampoc no envia correu: també
 *   `'confirmar-correu'`, per no revelar quins correus tenen compte;
 * - `entrarAmbContrasenya`, `reenviarConfirmacio`;
 * - restabliment: `demanarRestabliment` envia el correu; l'enllaç (plantilla "Reset password" amb
 *   `?token_hash=…&type=recovery`) torna a `redirectTo` i `completarEntradaDesDeUrl()` retorna
 *   `'recuperacio'`: hi ha sessió i la UI ha de demanar la contrasenya nova (`canviarContrasenya`).
 *   Amb la plantilla per defecte (PKCE `?code=`, mateix navegador) supabase-js emet
 *   `PASSWORD_RECOVERY`, que activa `modeRecuperacio` i també dona `'recuperacio'`;
 * - `canviarContrasenya`: crea o canvia la contrasenya de qualsevol sessió (també de qui va
 *   entrar amb l'enllaç o amb Google). No hi ha cap manera fiable de saber des del client si
 *   l'usuari ja en té (Supabase no ho exposa), així que la UI ofereix "crea o canvia".
 * Les regles de la contrasenya són a `domain/contrasenya.ts`.
 *
 * La sessió es desa al dispositiu (`platform/supabase.ts`) i la sync (`sync.ts`) s'activa sola
 * mentre hi ha sessió. Aquest mòdul és de navegador: importa'l de manera diferida.
 */
import {
	esborrarTot,
	FORMAT_EXPORTACIO,
	nomMunicipi,
	VERSIO_EXPORTACIO,
	type StoreLectura
} from './ascensions';
import { CATALEG_VERSIO, CIMS } from './catalog/cataleg';
import { ara } from './local/rellotge';
import {
	alliberarDadesLocals,
	classificarError,
	COLUMNES_PULL,
	configurarSync,
	filaDesDeSql,
	remotSupabase,
	sincronitzarAra
} from './sync';
import { validarContrasenya } from '$lib/domain/contrasenya';
import {
	contrasenyaAuthActiu,
	googleAuthActiu,
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
	| 'no-configurat' // falten PUBLIC_SUPABASE_* (o Google no està activat en aquest build)
	| 'cancelat' // l'usuari ha cancel·lat l'entrada amb Google (`?error=access_denied`)
	// Correu i contrasenya:
	| 'credencials' // correu o contrasenya incorrectes (no es diu quin dels dos)
	| 'correu-no-confirmat' // el compte existeix però encara no s'ha confirmat el correu
	| 'contrasenya:buida'
	| 'contrasenya:curta' // menys de CONTRASENYA_MIN caràcters (client o servidor)
	| 'contrasenya:llarga' // més de 72 bytes UTF-8 (límit de bcrypt)
	| 'contrasenya:igual-correu' // la contrasenya és el mateix correu
	| 'contrasenya:feble' // el servidor la rebutja per una altra regla del panell de Supabase
	| 'contrasenya:filtrada' // surt en filtracions conegudes (protecció de Supabase, pla Pro)
	| 'contrasenya:igual' // la nova és igual que l'actual
	| 'reautenticacio' // cal tornar a entrar (o verificar-se) abans de canviar la contrasenya
	| 'no-disponible' // el registre o el proveïdor de correu estan desactivats a Supabase
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

/**
 * L'entrada amb Google està activada en aquest build (`compteDisponible()` i
 * `PUBLIC_GOOGLE_AUTH`)? Si no, la UI no l'ofereix.
 */
export const googleDisponible: boolean = supabaseConfigurat() && googleAuthActiu;

/**
 * L'entrada amb correu i contrasenya està activada en aquest build (`compteDisponible()` i
 * `PUBLIC_PASSWORD_AUTH`)? Si no, la UI no l'ofereix.
 */
export const contrasenyaDisponible: boolean = supabaseConfigurat() && contrasenyaAuthActiu;

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

// Mode recuperació: s'ha entrat amb l'enllaç de restabliment i cal demanar la contrasenya nova.
let recuperacioActual = false;
const subscriptorsRecuperacio = new Set<(actiu: boolean) => void>();

function posarModeRecuperacio(actiu: boolean): void {
	if (recuperacioActual === actiu) return;
	recuperacioActual = actiu;
	for (const run of subscriptorsRecuperacio) run(actiu);
}

/**
 * `true` mentre la sessió ve d'un enllaç de restabliment de contrasenya (`type=recovery` o
 * l'esdeveniment `PASSWORD_RECOVERY` de supabase-js) i encara no s'ha desat la contrasenya nova.
 * La UI hi mostra el formulari "contrasenya nova". Torna a `false` amb `canviarContrasenya`,
 * `sortirModeRecuperacio` o en tancar la sessió. No es desa: si es recarrega la pàgina es perd,
 * però la sessió continua i la contrasenya es pot canviar des del compte.
 */
export const modeRecuperacio: StoreLectura<boolean> = {
	subscribe(run) {
		run(recuperacioActual);
		subscriptorsRecuperacio.add(run);
		return () => {
			subscriptorsRecuperacio.delete(run);
		};
	}
};

/** La UI descarta el formulari de contrasenya nova (la sessió continua). */
export function sortirModeRecuperacio(): void {
	posarModeRecuperacio(false);
}

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
		// Síncron i sense cridar supabase-js: `completarEntradaDesDeUrl` el consulta en acabar.
		if (event === 'PASSWORD_RECOVERY') posarModeRecuperacio(true);
		else if (event === 'SIGNED_OUT') posarModeRecuperacio(false);
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

/**
 * Tradueix un error de Supabase Auth a `ErrorCompte`. Primer es mira `error_code` (estable) i
 * només si no és conegut es recorre al text del missatge: p. ex. un 400 `email_address_invalid`
 * ("Email address … is invalid") és `email:invalid`, no `codi:invalid`. Exportat per als tests.
 */
export function errorAuth(
	error: {
		message?: string;
		status?: number;
		code?: string;
		name?: string;
		/** `AuthWeakPasswordError.reasons`: `length`, `characters`, `pwned`. */
		reasons?: readonly string[];
	} | null
): ErrorCompte {
	const codi = error?.code ?? '';
	const status = error?.status ?? 0;
	const missatge = error?.message ?? '';
	const es4xx = status >= 400 && status < 500;
	if (status === 429 || /rate_limit|over_.*limit/.test(codi))
		return new ErrorCompte('limit', missatge);
	// Contrasenya i sessió (abans de `validation_failed`, que també pot parlar de la contrasenya).
	switch (codi) {
		case 'invalid_credentials':
			return new ErrorCompte('credencials', missatge);
		case 'email_not_confirmed':
			return new ErrorCompte('correu-no-confirmat', missatge);
		case 'weak_password': {
			const motius = error?.reasons ?? [];
			if (motius.includes('pwned')) return new ErrorCompte('contrasenya:filtrada', missatge);
			if (motius.length === 1 && motius[0] === 'length') {
				return new ErrorCompte('contrasenya:curta', missatge);
			}
			return new ErrorCompte('contrasenya:feble', missatge);
		}
		case 'same_password':
			return new ErrorCompte('contrasenya:igual', missatge);
		case 'reauthentication_needed':
		case 'reauthentication_not_valid':
			return new ErrorCompte('reautenticacio', missatge);
		case 'signup_disabled':
		case 'email_provider_disabled':
			return new ErrorCompte('no-disponible', missatge);
		case 'session_not_found':
		case 'session_expired':
		case 'refresh_token_not_found':
		case 'refresh_token_already_used':
			return new ErrorCompte('sessio', missatge);
	}
	// `updateUser` sense sessió: supabase-js llança `AuthSessionMissingError` (400, sense codi).
	if (error?.name === 'AuthSessionMissingError') return new ErrorCompte('sessio', missatge);
	// GoTrue respon `validation_failed` tant per al correu com per a la contrasenya (p. ex.
	// "Password cannot be longer than 72 characters", "Signup requires a valid password").
	if (codi === 'validation_failed' && /password/i.test(missatge)) {
		if (/longer|too long/i.test(missatge)) return new ErrorCompte('contrasenya:llarga', missatge);
		return new ErrorCompte('contrasenya:feble', missatge);
	}
	if (codi === 'email_address_invalid' || codi === 'validation_failed') {
		return new ErrorCompte('email:invalid', missatge);
	}
	if (codi === 'otp_expired' || codi === 'otp_disabled') {
		if (es4xx) return new ErrorCompte('codi:invalid', missatge);
	}
	// Sense `error_code` conegut (versions antigues de GoTrue): pel text del missatge.
	if (es4xx && /invalid login credentials/i.test(missatge)) {
		return new ErrorCompte('credencials', missatge);
	}
	if (es4xx && /email not confirmed/i.test(missatge)) {
		return new ErrorCompte('correu-no-confirmat', missatge);
	}
	if (es4xx && /\bemail\b.*\binvalid\b/i.test(missatge)) {
		return new ErrorCompte('email:invalid', missatge);
	}
	if (es4xx && /expired|invalid/i.test(missatge)) return new ErrorCompte('codi:invalid', missatge);
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
 * Entra amb Google (Supabase OAuth, flux PKCE): el navegador surt cap a Google i torna a
 * `redirectTo` (URL absoluta de la llista permesa de Supabase, p. ex. `${origin}/ca/app/compte`),
 * on `completarEntradaDesDeUrl()` completa l'entrada o retorna l'error (`cancelat` si l'usuari
 * cancel·la a Google). La promesa es resol quan comença la redirecció.
 * @throws ErrorCompte (`no-configurat` si `googleDisponible` és fals; `xarxa`, `limit`, `servidor`)
 */
export async function entrarAmbGoogle(opcions: { redirectTo: string }): Promise<void> {
	if (!googleDisponible) throw new ErrorCompte('no-configurat', 'Google no activat');
	let res;
	try {
		res = await client().auth.signInWithOAuth({
			provider: 'google',
			options: { redirectTo: opcions.redirectTo }
		});
	} catch (e) {
		if (e instanceof ErrorCompte) throw e;
		throw new ErrorCompte('xarxa', String(e));
	}
	if (res.error) throw errorAuth(res.error);
}

// ---------------------------------------------------------------------------
// Correu i contrasenya
// ---------------------------------------------------------------------------

/** Client per a les operacions amb contrasenya: només si `contrasenyaDisponible`. */
function clientContrasenya(): ClientSupabase {
	if (!contrasenyaDisponible) throw new ErrorCompte('no-configurat', 'Contrasenya no activada');
	return client();
}

/** Correu normalitzat i validat (igual que `entrarAmbEmail`). */
function correuValid(email: string): string {
	const net = email.trim().toLowerCase();
	if (!RE_EMAIL.test(net) || net.length > 254) throw new ErrorCompte('email:invalid');
	return net;
}

/** Llança `contrasenya:<motiu>` si la contrasenya nova no compleix `validarContrasenya`. */
function exigirContrasenyaValida(contrasenya: string, email?: string | null): void {
	const v = validarContrasenya(contrasenya, email);
	if (!v.ok) throw new ErrorCompte(`contrasenya:${v.motiu}`);
}

/** Executa una crida a Supabase Auth: excepció → `xarxa`; `error` de la resposta → `errorAuth`. */
async function cridaAuth<T extends { error: Parameters<typeof errorAuth>[0] }>(
	crida: () => Promise<T>
): Promise<T> {
	let res: T;
	try {
		res = await crida();
	} catch (e) {
		if (e instanceof ErrorCompte) throw e;
		throw new ErrorCompte('xarxa', String(e));
	}
	if (res.error) throw errorAuth(res.error);
	return res;
}

/**
 * Crea un compte amb correu i contrasenya (Supabase `signUp`). Retorna:
 * - `'confirmar-correu'`: cal obrir l'enllaç del correu de confirmació (torna a `redirectTo`, on
 *   `completarEntradaDesDeUrl()` dona `'entrat'`). També quan el correu **ja té compte**: Supabase
 *   no envia cap correu ni ho diu, i aquí tampoc (la UI diu "si ja tens compte, entra o
 *   restableix la contrasenya");
 * - `'entrat'`: la confirmació del correu està desactivada al panell i ja hi ha sessió.
 * Valida el correu i la contrasenya (`validarContrasenya`, també que no sigui el correu) abans
 * de cridar Supabase.
 * @throws ErrorCompte (`no-configurat`, `email:invalid`, `contrasenya:*`, `no-disponible`, `limit`,
 *   `xarxa`, `servidor`)
 */
export async function crearCompteAmbContrasenya(
	email: string,
	contrasenya: string,
	opcions: { redirectTo: string }
): Promise<'entrat' | 'confirmar-correu'> {
	const c = clientContrasenya();
	const net = correuValid(email);
	exigirContrasenyaValida(contrasenya, net);
	const res = await cridaAuth(() =>
		c.auth.signUp({
			email: net,
			password: contrasenya,
			options: { emailRedirectTo: opcions.redirectTo }
		})
	);
	// Correu ja registrat: `user` ofuscat amb `identities: []` i sense sessió (no es distingeix).
	return res.data.session ? 'entrat' : 'confirmar-correu';
}

/**
 * Entra amb correu i contrasenya. No s'hi aplica la llargada mínima (només que no sigui buida):
 * el servidor és qui decideix si és correcta.
 * @throws ErrorCompte (`no-configurat`, `email:invalid`, `contrasenya:buida`, `credencials`,
 *   `correu-no-confirmat`, `limit`, `xarxa`, `servidor`)
 */
export async function entrarAmbContrasenya(
	email: string,
	contrasenya: string
): Promise<UsuariSessio> {
	const c = clientContrasenya();
	const net = correuValid(email);
	if (contrasenya.length === 0) throw new ErrorCompte('contrasenya:buida');
	const res = await cridaAuth(() =>
		c.auth.signInWithPassword({ email: net, password: contrasenya })
	);
	const usuari = usuariDe(res.data.user);
	if (!usuari) throw new ErrorCompte('servidor', 'sense usuari');
	return usuari;
}

/**
 * Torna a enviar el correu de confirmació del registre (si el compte existeix i no està
 * confirmat; si no, Supabase no envia res i tampoc no ho diu).
 * @throws ErrorCompte (`no-configurat`, `email:invalid`, `limit`, `xarxa`, `servidor`)
 */
export async function reenviarConfirmacio(
	email: string,
	opcions: { redirectTo: string }
): Promise<void> {
	const c = clientContrasenya();
	const net = correuValid(email);
	await cridaAuth(() =>
		c.auth.resend({ type: 'signup', email: net, options: { emailRedirectTo: opcions.redirectTo } })
	);
}

/**
 * Envia el correu per restablir la contrasenya. L'enllaç torna a `redirectTo` (URL absoluta de la
 * llista permesa) i `completarEntradaDesDeUrl()` retorna `'recuperacio'`. Si el correu no té
 * compte, Supabase respon igual (no es revela).
 * @throws ErrorCompte (`no-configurat`, `email:invalid`, `limit`, `xarxa`, `servidor`)
 */
export async function demanarRestabliment(
	email: string,
	opcions: { redirectTo: string }
): Promise<void> {
	const c = clientContrasenya();
	const net = correuValid(email);
	await cridaAuth(() => c.auth.resetPasswordForEmail(net, { redirectTo: opcions.redirectTo }));
}

/**
 * Crea o canvia la contrasenya de la sessió actual (també després de l'enllaç de restabliment, o
 * per a qui va entrar amb l'enllaç del correu o amb Google). Surt del mode recuperació.
 * @throws ErrorCompte (`no-configurat`, `sessio`, `contrasenya:*`, `reautenticacio`, `limit`,
 *   `xarxa`, `servidor`)
 */
export async function canviarContrasenya(nova: string): Promise<void> {
	const c = clientContrasenya();
	// La sessió real del client (la publicada a `sessio` va un torn per darrere després d'entrar).
	const actual = await cridaAuth(() => c.auth.getSession());
	const usuari = actual.data.session?.user;
	if (!usuari) throw new ErrorCompte('sessio');
	exigirContrasenyaValida(nova, usuari.email);
	await cridaAuth(() => c.auth.updateUser({ password: nova }));
	posarModeRecuperacio(false);
}

/**
 * Error d'autenticació que torna a la URL (`?error=…&error_code=…&error_description=…`, a la query
 * amb PKCE o al fragment amb el flux implícit). `null` si la URL no en porta cap.
 * - `error_code` de límit → `limit`;
 * - `error_code` d'enllaç o codi caducat o invàlid (p. ex. `otp_expired`, `flow_state_expired`)
 *   → `codi:invalid` (l'enllaç del correu caducat torna amb `error=access_denied` **i** aquest codi);
 * - `error=access_denied` sense cap altre `error_code` → `cancelat` (l'usuari ha cancel·lat a
 *   Google);
 * - altres que diguin `expired`, `invalid` o `denied` → `codi:invalid`; la resta, `servidor`.
 * Exportat per als tests.
 */
export function errorEntradaUrl(
	error: string | null,
	codi: string | null,
	descripcio: string | null = null
): ErrorCompte | null {
	if (!error && !codi) return null;
	const e = (error ?? '').trim().toLowerCase();
	const c = (codi ?? '').trim().toLowerCase();
	const detall = [codi, error, descripcio].filter(Boolean).join(': ');
	if (/rate_limit|over_.*limit/.test(c)) return new ErrorCompte('limit', detall);
	if (c && c !== 'access_denied' && /expired|invalid|not_found|bad_code/.test(c)) {
		return new ErrorCompte('codi:invalid', detall);
	}
	if (e === 'access_denied' && (!c || c === 'access_denied')) {
		return new ErrorCompte('cancelat', detall);
	}
	if (/expired|invalid|denied/.test(c || e)) return new ErrorCompte('codi:invalid', detall);
	return new ErrorCompte('servidor', detall);
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

/** Tipus de `verifyOtp` per a un `?token_hash=` segons el `type` de la URL. */
function tipusTokenHash(type: string | null): 'email' | 'magiclink' | 'signup' | 'recovery' {
	return type === 'magiclink' || type === 'signup' || type === 'recovery' ? type : 'email';
}

/** Deixa córrer els temporitzadors pendents (supabase-js emet els esdeveniments amb `setTimeout`). */
function tornSeguent(): Promise<void> {
	return new Promise((r) => setTimeout(r, 0));
}

/**
 * Crida-la en carregar `/app/compte`: si la URL ve de l'enllaç del correu, completa la sessió i
 * neteja els paràmetres de la URL (`history.replaceState`). Retorna:
 * - `'cap'` si la URL no porta res d'autenticació;
 * - `'entrat'` si s'ha iniciat la sessió (enllaç d'accés, confirmació del registre o Google);
 * - `'recuperacio'` si s'ha iniciat la sessió amb l'enllaç de restabliment de contrasenya
 *   (`?token_hash=…&type=recovery`, o `?code=` amb l'esdeveniment `PASSWORD_RECOVERY`) i la
 *   contrasenya està activada en aquest build: la UI ha de demanar la contrasenya nova
 *   (`modeRecuperacio` també és `true`). Amb la contrasenya desactivada retorna `'entrat'`;
 * - un `ErrorCompte` (no el llança) si l'enllaç és invàlid, caducat o ja s'ha fet servir.
 */
export async function completarEntradaDesDeUrl(
	url: URL = new URL(window.location.href)
): Promise<'cap' | 'entrat' | 'recuperacio' | ErrorCompte> {
	const q = url.searchParams;
	const hash = new URLSearchParams(url.hash.replace(/^#/, ''));
	const hiHaAuth = PARAMS_AUTH.some((p) => q.has(p) || hash.has(p)) || hash.has('access_token');
	if (!hiHaAuth) return 'cap';
	let resultat: 'entrat' | 'recuperacio' | ErrorCompte;
	const entrat = (): 'entrat' | 'recuperacio' =>
		recuperacioActual && contrasenyaDisponible ? 'recuperacio' : 'entrat';
	try {
		const c = client();
		const errorUrl = errorEntradaUrl(
			q.get('error') ?? hash.get('error'),
			q.get('error_code') ?? hash.get('error_code'),
			q.get('error_description') ?? hash.get('error_description')
		);
		const tokenHash = q.get('token_hash');
		if (errorUrl) {
			resultat = errorUrl;
		} else if (tokenHash) {
			const tipus = tipusTokenHash(q.get('type'));
			const { data, error } = await c.auth.verifyOtp({ token_hash: tokenHash, type: tipus });
			if (error) resultat = errorAuth(error);
			else if (!data.session) resultat = new ErrorCompte('servidor');
			else {
				// Recuperació sí o no segons l'enllaç (supabase-js també emet `PASSWORD_RECOVERY`).
				posarModeRecuperacio(tipus === 'recovery');
				resultat = entrat();
			}
		} else {
			// `?code=` (PKCE: enllaç del correu amb la plantilla per defecte o retorn de Google) o
			// `#access_token` (implícit): supabase-js ja els processa en inicialitzar-se
			// (`detectSessionInUrl`); aquí només s'espera el resultat. Si el verificador PKCE no és en
			// aquest navegador (p. ex. s'ha obert en un altre), no hi ha sessió: `codi:invalid`.
			// Amb l'enllaç de restabliment (verificador PKCE marcat com a recuperació), supabase-js
			// emet `PASSWORD_RECOVERY` en un `setTimeout` després de desar la sessió: s'espera un torn
			// perquè `modeRecuperacio` ja estigui al dia.
			const { data, error } = await c.auth.getSession();
			if (error) resultat = errorAuth(error);
			else if (!data.session) resultat = new ErrorCompte('codi:invalid');
			else {
				await tornSeguent();
				resultat = entrat();
			}
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
 * Tanca la sessió en aquest dispositiu. Les dades locals (ascensions i municipi d'origen) es
 * queden (marcades com a de l'usuari que surt: si hi entra un altre compte, se li preguntarà què
 * fer-ne) llevat de `esborrarDades: true`, que les esborra del dispositiu (no del núvol).
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
	posarModeRecuperacio(false);
	publicar({ estat: 'anonim' });
}

// ---------------------------------------------------------------------------
// RGPD: supressió i exportació
// ---------------------------------------------------------------------------

/**
 * Esborra el compte i totes les dades del núvol (RPC `esborrar_compte`, irreversible: ascensions
 * amb les notes i els companys, i el perfil amb el municipi d'origen) i tanca la sessió. Per
 * defecte també esborra les dades d'aquest dispositiu; amb `conservarDispositiu: true` s'hi queden
 * com a dades sense compte (també el municipi d'origen).
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
	posarModeRecuperacio(false);
	publicar({ estat: 'anonim' });
}

/**
 * Exportació de les dades del compte al núvol (RGPD, art. 15 i 20): JSON amb el mateix format
 * que `exportarDades` (versió 2, importable amb `importarDades`): les ascensions amb la nota i
 * els companys, `preferencies.origen` (municipi d'origen del compte), més `compte` (id, correu,
 * perfil) i les ascensions esborrades (`deletedAt`; la importació les ignora) **sense nota ni
 * companys** (minimització: encara que el núvol els conservi dins de la finestra de desfer o d'un
 * client antic, no surten de l'exportació). Cal xarxa i sessió.
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
			.select(COLUMNES_PULL)
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
	const perfil = await c
		.from('perfils')
		.select('alias, origen_municipi, origen_updated_at, created_at, updated_at')
		.maybeSingle();
	if (perfil.error) {
		const e = classificarError(perfil.error, perfil.status);
		throw new ErrorCompte(e.codi, perfil.error.message);
	}
	const origenCodi = perfil.data?.origen_municipi ?? null;
	const origenAt = perfil.data?.origen_updated_at ?? null;
	const origenNom = await nomMunicipi(origenCodi);
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
			preferencies: {
				origen:
					origenCodi && origenAt
						? { codi: origenCodi, nom: origenNom, updatedAt: new Date(origenAt).toISOString() }
						: null
			},
			total: vives.length,
			ascensions: files.map((f) => ({
				id: f.id,
				cimId: f.cimId,
				cimNom: noms.get(f.cimId),
				data: f.data,
				metode: f.metode,
				// Làpides: mai la nota ni els companys (dades de tercers d'una ascensió esborrada).
				nota: f.deletedAt ? null : f.nota,
				companys: f.deletedAt ? [] : (f.companys ?? []),
				createdAt: f.createdAt,
				updatedAt: f.updatedAt,
				...(f.deletedAt ? { deletedAt: f.deletedAt } : {})
			}))
		},
		null,
		2
	);
}
