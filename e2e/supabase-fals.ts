/**
 * Servidor de Supabase fals per als E2E del compte (fase 5).
 *
 * La build dels E2E porta la URL i la clau publicable reals (de `.env` o de `wrangler.jsonc`).
 * **Cap petició ha d'arribar al Supabase real**: aquest mòdul intercepta tot `*.supabase.co` a
 * nivell de context (`context.route`) i respon amb un servidor en memòria que imita el contracte
 * que fa servir l'app:
 *
 * - Auth (GoTrue): `POST /auth/v1/otp`, `POST /auth/v1/verify` (codi o `token_hash`; `type`
 *   `email`/`signup`/`recovery`), `POST /auth/v1/logout`, `GET /auth/v1/user`,
 *   `POST /auth/v1/token?grant_type=refresh_token`.
 * - Correu + contrasenya (vegeu `comptes`): `POST /auth/v1/signup` (sense sessió, cal confirmar;
 *   si el correu ja existeix, usuari ofuscat amb `identities: []`), `POST /auth/v1/token?
 *   grant_type=password` (`invalid_credentials`, `email_not_confirmed`), `POST /auth/v1/resend`,
 *   `POST /auth/v1/recover`, `PUT /auth/v1/user` (`weak_password`, `same_password`).
 * - PostgREST: `rpc/sync_push` (LWW per `updated_at`, empat → servidor, id d'un altre usuari →
 *   rebutjat; una fila sense la clau `companys` conserva els companys desats, com la migració
 *   0005), `rpc/sync_origen` (municipi d'origen del compte, LWW), `rpc/esborrar_compte`,
 *   `GET ascensions` (filtre `server_updated_at=gte.`, ordre i límit) i `GET perfils`.
 *
 * Qualsevol altra petició a Supabase es respon 501 i queda a `noGestionades` (el test la pot
 * comprovar). Els tokens són JWT sense signar generats aquí: no són credencials.
 */
import type { BrowserContext, Page, Request, Route } from '@playwright/test';
import { NOM_BD } from './ascensions';

export const CODI_BO = '123456';
export const TOKEN_HASH_BO = 'hash-de-prova-bo';
/** `token_hash` bo de l'enllaç de restabliment (`type=recovery`): sessió de `emailEnllac`. */
export const TOKEN_HASH_RECUPERACIO = 'hash-de-prova-recuperacio';

/** Compte amb contrasenya del servidor fals (valors de prova, no credencials). */
export interface CompteFals {
	contrasenya: string;
	confirmat: boolean;
}
export const CLAU_SESSIO = 'carnetdecims-auth';

export interface FilaServidor {
	id: string;
	user_id: string;
	cim_id: number;
	data: string;
	metode: 'a_peu' | 'btt' | 'esqui' | 'raquetes';
	nota: string | null;
	companys: string[];
	created_at: string;
	updated_at: string;
	deleted_at: string | null;
	server_updated_at: string;
}

export interface FilaPushRebuda {
	id: string;
	cimId: number;
	data: string;
	metode: string;
	nota: string | null;
	/** Absent si el client no en sap res (client antic o fila anterior a R1). */
	companys?: string[];
	createdAt: string;
	updatedAt: string;
	deletedAt: string | null;
}

/** Municipi d'origen d'un compte (`perfils.origen_municipi` / `origen_updated_at`). */
export interface OrigenServidor {
	codi: string | null;
	updatedAt: string;
}

export interface PeticioRegistrada {
	metode: string;
	cami: string;
	query: string;
	cos: unknown;
	usuari: string | null;
}

/** Resposta d'error que imita GoTrue. */
export interface ErrorAuth {
	status: number;
	error_code: string;
	msg: string;
}

/** UUID estable per a un correu (els usuaris del servidor fals). */
export function idUsuari(email: string): string {
	let h = 0;
	for (const c of email) h = (h * 31 + c.charCodeAt(0)) >>> 0;
	const hex = h.toString(16).padStart(8, '0');
	return `${hex}-0000-4000-8000-${hex.padStart(12, '0')}`;
}

function b64url(s: string): string {
	return Buffer.from(s)
		.toString('base64')
		.replace(/=+$/, '')
		.replace(/\+/g, '-')
		.replace(/\//g, '_');
}

/** JWT sense signar (només per al servidor fals). */
function jwtFals(sub: string, email: string, exp: number): string {
	return [
		b64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' })),
		b64url(
			JSON.stringify({
				sub,
				email,
				exp,
				aud: 'authenticated',
				role: 'authenticated',
				iat: exp - 3600
			})
		),
		'firma-falsa-e2e'
	].join('.');
}

export function usuariFals(email: string) {
	return {
		id: idUsuari(email),
		aud: 'authenticated',
		role: 'authenticated',
		email,
		email_confirmed_at: '2026-01-01T00:00:00Z',
		app_metadata: { provider: 'email', providers: ['email'] },
		user_metadata: {},
		identities: [],
		created_at: '2026-01-01T00:00:00Z',
		updated_at: '2026-01-01T00:00:00Z'
	};
}

/** Sessió tal com la desa supabase-js a `localStorage` (i com la retorna `/verify`). */
export function sessioFalsa(email: string) {
	const exp = Math.floor(Date.now() / 1000) + 3600 * 24;
	const user = usuariFals(email);
	return {
		access_token: jwtFals(user.id, email, exp),
		token_type: 'bearer',
		expires_in: 3600 * 24,
		expires_at: exp,
		refresh_token: `refresc-${user.id}`,
		user
	};
}

function usuariDelToken(req: Request): string | null {
	const auth = req.headers()['authorization'] ?? '';
	const m = /^Bearer\s+([^.]+)\.([^.]+)\./.exec(auth);
	if (!m) return null;
	try {
		const p = JSON.parse(Buffer.from(m[2], 'base64').toString('utf8')) as { sub?: string };
		return p.sub ?? null;
	} catch {
		return null;
	}
}

/** Instant de Postgres (`…T…[.ffffff](Z|+00:00)`) en microsegons, per comparar formats diferents. */
export function micros(t: string): number {
	const m = /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})(?:\.(\d+))?(Z|[+-]\d{2}:?\d{2})?$/.exec(
		t.replace(' ', 'T')
	);
	if (!m) return Number.NaN;
	const base = Date.parse(m[1] + (m[3] ?? 'Z'));
	const frac = Number((m[2] ?? '').padEnd(6, '0').slice(0, 6));
	return base * 1000 + frac;
}

const pg = (iso: string) => new Date(iso).toISOString().replace('Z', '+00:00');

export class SupabaseFals {
	files = new Map<string, FilaServidor>();
	/** Municipi d'origen per id d'usuari (vegeu `origenDe` i `sembrarOrigen`). */
	origens = new Map<string, OrigenServidor>();
	peticions: PeticioRegistrada[] = [];
	noGestionades: string[] = [];
	/** Correus que han demanat l'enllaç (`/otp`). */
	otps: string[] = [];
	/** Error que tornarà el pròxim `/otp` (i els següents mentre no es buidi). */
	errorOtp: ErrorAuth | null = null;
	/** Simula xarxa caiguda: totes les peticions a Supabase s'avorten. */
	senseXarxa = false;
	/** Quants `sync_push` s'apliquen però es responen 500 (resposta perduda). */
	perdreRespostesPush = 0;
	/** El `sync_push` respon sempre aquest status (p. ex. 500) sense aplicar res. */
	errorPush: number | null = null;
	/**
	 * Status que passa a `errorPush` just després de perdre una resposta (`perdreRespostesPush`):
	 * reté els reintents automàtics de la app perquè el test controli quan es reintenta.
	 */
	errorPushDespresDePerdua: number | null = null;
	/** `esborrar_compte` respon aquest status sense esborrar res. */
	errorEsborrar: number | null = null;
	/** Ids que `sync_push` rebutja sempre amb aquest motiu (p. ex. per forçar "canvis bloquejats"). */
	rebutjarIds = new Map<string, string>();
	private rellotge = Date.parse('2026-10-01T08:00:00Z') * 1000;

	private seguentInstant(): string {
		this.rellotge += 1234; // µs
		const ms = Math.floor(this.rellotge / 1000);
		const us = String(this.rellotge % 1_000_000).padStart(6, '0');
		return new Date(ms).toISOString().replace(/\.\d{3}Z$/, `.${us}+00:00`);
	}

	/** Afegeix files "ja al núvol" d'un usuari (format local, com `completar`). */
	sembrar(
		email: string,
		files: {
			id: string;
			cimId: number;
			data: string;
			metode?: string;
			nota?: string | null;
			companys?: string[];
			createdAt: string;
			updatedAt: string;
			deletedAt?: string | null;
		}[]
	) {
		for (const f of files) {
			this.files.set(f.id, {
				id: f.id,
				user_id: idUsuari(email),
				cim_id: f.cimId,
				data: f.data,
				metode: (f.metode ?? 'a-peu').replace('-', '_') as FilaServidor['metode'],
				nota: f.nota ?? null,
				companys: f.companys ?? [],
				created_at: pg(f.createdAt),
				updated_at: pg(f.updatedAt),
				deleted_at: f.deletedAt ? pg(f.deletedAt) : null,
				server_updated_at: this.seguentInstant()
			});
		}
	}

	/** Posa el municipi d'origen "ja al núvol" d'un usuari. */
	sembrarOrigen(email: string, codi: string | null, updatedAt: string) {
		this.origens.set(idUsuari(email), { codi, updatedAt: new Date(updatedAt).toISOString() });
	}

	/** Municipi d'origen desat al compte, o `null`. */
	origenDe(email: string): OrigenServidor | null {
		return this.origens.get(idUsuari(email)) ?? null;
	}

	filesDe(email: string): FilaServidor[] {
		const uid = idUsuari(email);
		return [...this.files.values()].filter((f) => f.user_id === uid);
	}

	/** Cossos dels `sync_push` rebuts (llista de files de cada crida). */
	get pushos(): FilaPushRebuda[][] {
		return this.peticions
			.filter((p) => p.cami === '/rest/v1/rpc/sync_push')
			.map((p) => (p.cos as { files: FilaPushRebuda[] }).files);
	}

	crides(cami: string): PeticioRegistrada[] {
		return this.peticions.filter((p) => p.cami === cami);
	}

	async installar(context: BrowserContext) {
		await context.route(/^https:\/\/[a-z0-9-]+\.supabase\.co\//, (route) => this.gestionar(route));
	}

	private cors(req: Request): Record<string, string> {
		return {
			'access-control-allow-origin': '*',
			'access-control-allow-methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
			'access-control-allow-headers':
				req.headers()['access-control-request-headers'] ??
				'authorization, apikey, content-type, x-client-info, accept-profile, content-profile, prefer, x-supabase-api-version',
			'access-control-expose-headers': 'content-range, x-supabase-api-version'
		};
	}

	private json(route: Route, status: number, cos: unknown) {
		return route.fulfill({
			status,
			headers: { ...this.cors(route.request()), 'content-type': 'application/json' },
			body: cos === undefined ? '' : JSON.stringify(cos)
		});
	}

	private async gestionar(route: Route) {
		const req = route.request();
		const url = new URL(req.url());
		if (req.method() === 'OPTIONS') {
			return route.fulfill({ status: 204, headers: this.cors(req) });
		}
		if (this.senseXarxa) return route.abort('internetdisconnected');
		let cos: unknown;
		try {
			cos = req.postData() ? JSON.parse(req.postData()!) : null;
		} catch {
			cos = req.postData();
		}
		const usuari = usuariDelToken(req);
		this.peticions.push({
			metode: req.method(),
			cami: url.pathname,
			query: url.search,
			cos,
			usuari
		});
		const cami = url.pathname;

		// ── Auth ──
		if (cami === '/auth/v1/otp' && req.method() === 'POST') {
			const email = (cos as { email?: string })?.email ?? '';
			this.otps.push(email);
			if (this.errorOtp) {
				const e = this.errorOtp;
				return this.json(route, e.status, { code: e.status, error_code: e.error_code, msg: e.msg });
			}
			return this.json(route, 200, {});
		}
		if (cami === '/auth/v1/verify' && req.method() === 'POST') {
			const b = (cos ?? {}) as {
				email?: string;
				token?: string;
				token_hash?: string;
				type?: string;
			};
			let email: string | null = null;
			if (b.type === 'recovery') {
				if (b.token_hash === TOKEN_HASH_RECUPERACIO) email = this.emailEnllac;
			} else if (b.token_hash === TOKEN_HASH_BO) email = this.emailEnllac;
			else if (b.token === CODI_BO && b.email) email = b.email;
			if (!email) {
				return this.json(route, 403, {
					code: 403,
					error_code: 'otp_expired',
					msg: 'Token has expired or is invalid'
				});
			}
			// Obrir l'enllaç (o el codi) del correu confirma el compte amb contrasenya pendent.
			const compte = this.comptes.get(email);
			if (compte) compte.confirmat = true;
			this.correus.add(email);
			return this.json(route, 200, sessioFalsa(email));
		}
		if (cami === '/auth/v1/signup' && req.method() === 'POST') {
			const b = (cos ?? {}) as { email?: string; password?: string };
			const email = b.email ?? '';
			this.signups.push(email);
			const ara = '2026-10-01T08:00:00Z';
			if (this.comptes.has(email)) {
				// GoTrue amb "Confirm email": usuari ofuscat, sense identitats ni correu enviat.
				return this.json(route, 200, {
					...usuariFals(email),
					id: '00000000-0000-4000-8000-000000000000',
					email_confirmed_at: null,
					identities: [],
					created_at: ara,
					updated_at: ara
				});
			}
			this.comptes.set(email, { contrasenya: b.password ?? '', confirmat: false });
			this.correusEnviats.push({ tipus: 'signup', email });
			return this.json(route, 200, {
				...usuariFals(email),
				email_confirmed_at: null,
				confirmation_sent_at: ara,
				identities: [{ id: idUsuari(email), provider: 'email', identity_data: { email } }]
			});
		}
		if (cami === '/auth/v1/resend' && req.method() === 'POST') {
			const b = (cos ?? {}) as { email?: string; type?: string };
			const compte = this.comptes.get(b.email ?? '');
			if (compte && !compte.confirmat) {
				this.correusEnviats.push({ tipus: 'resend', email: b.email! });
			}
			return this.json(route, 200, {});
		}
		if (cami === '/auth/v1/recover' && req.method() === 'POST') {
			const b = (cos ?? {}) as { email?: string };
			// Resposta idèntica tant si el correu té compte com si no (no es revela).
			if (this.comptes.has(b.email ?? '')) {
				this.correusEnviats.push({ tipus: 'recover', email: b.email! });
			}
			return this.json(route, 200, {});
		}
		if (cami === '/auth/v1/user' && req.method() === 'PUT') {
			const email = [...this.correus].find((e) => idUsuari(e) === usuari);
			if (!email) {
				return this.json(route, 401, { code: 401, error_code: 'bad_jwt', msg: 'invalid JWT' });
			}
			const b = (cos ?? {}) as { password?: string };
			if (typeof b.password === 'string') {
				if (this.errorCanviContrasenya) {
					const e = this.errorCanviContrasenya;
					return this.json(route, e.status, {
						code: e.status,
						error_code: e.error_code,
						msg: e.msg,
						...(e.error_code === 'weak_password'
							? { weak_password: { reasons: this.motiusFeble } }
							: {})
					});
				}
				if (b.password.length < 6) {
					return this.json(route, 422, {
						code: 422,
						error_code: 'weak_password',
						msg: 'Password should be at least 6 characters.',
						weak_password: { reasons: ['length'] }
					});
				}
				const actual = this.comptes.get(email);
				if (actual && actual.contrasenya === b.password) {
					return this.json(route, 422, {
						code: 422,
						error_code: 'same_password',
						msg: 'New password should be different from the old password.'
					});
				}
				this.comptes.set(email, { contrasenya: b.password, confirmat: true });
			}
			return this.json(route, 200, usuariFals(email));
		}
		if (cami === '/auth/v1/logout') {
			return route.fulfill({ status: 204, headers: this.cors(req) });
		}
		if (cami === '/auth/v1/user' && req.method() === 'GET') {
			const s = [...this.correus].find((e) => idUsuari(e) === usuari);
			return s
				? this.json(route, 200, usuariFals(s))
				: this.json(route, 401, { code: 401, error_code: 'bad_jwt', msg: 'invalid JWT' });
		}
		if (cami === '/auth/v1/token' && url.searchParams.get('grant_type') === 'password') {
			const b = (cos ?? {}) as { email?: string; password?: string };
			const email = b.email ?? '';
			const compte = this.comptes.get(email);
			if (!compte || compte.contrasenya !== b.password) {
				return this.json(route, 400, {
					code: 400,
					error_code: 'invalid_credentials',
					msg: 'Invalid login credentials'
				});
			}
			if (!compte.confirmat) {
				return this.json(route, 400, {
					code: 400,
					error_code: 'email_not_confirmed',
					msg: 'Email not confirmed'
				});
			}
			this.correus.add(email);
			return this.json(route, 200, sessioFalsa(email));
		}
		if (cami === '/auth/v1/token') {
			const b = (cos ?? {}) as { refresh_token?: string };
			const id = b.refresh_token?.replace(/^refresc-/, '');
			const email = [...this.correus].find((e) => idUsuari(e) === id);
			return email
				? this.json(route, 200, sessioFalsa(email))
				: this.json(route, 400, {
						code: 400,
						error_code: 'refresh_token_not_found',
						msg: 'Invalid Refresh Token'
					});
		}

		// ── PostgREST ──
		if (!usuari && cami.startsWith('/rest/v1/')) {
			return this.json(route, 401, { code: '42501', message: 'no autenticat' });
		}
		if (cami === '/rest/v1/rpc/sync_push' && req.method() === 'POST') {
			if (this.errorPush) return this.json(route, this.errorPush, { message: 'error intern' });
			const res = this.syncPush(usuari!, (cos as { files: FilaPushRebuda[] }).files);
			if (this.perdreRespostesPush > 0) {
				this.perdreRespostesPush--;
				if (this.errorPushDespresDePerdua) {
					this.errorPush = this.errorPushDespresDePerdua;
					this.errorPushDespresDePerdua = null;
				}
				return this.json(route, 500, { message: 'resposta perduda (simulada)' });
			}
			return this.json(route, 200, res);
		}
		if (cami === '/rest/v1/rpc/esborrar_compte' && req.method() === 'POST') {
			if (this.errorEsborrar)
				return this.json(route, this.errorEsborrar, { message: 'error intern' });
			for (const [id, f] of this.files) if (f.user_id === usuari) this.files.delete(id);
			this.origens.delete(usuari!);
			this.esborrats.add(usuari!);
			return route.fulfill({ status: 204, headers: this.cors(req) });
		}
		if (cami === '/rest/v1/ascensions' && req.method() === 'GET') {
			const gte = url.searchParams.get('server_updated_at');
			const desDe = gte?.startsWith('gte.') ? micros(gte.slice(4)) : null;
			const limit = Number(url.searchParams.get('limit') ?? 1000);
			const files = [...this.files.values()]
				.filter((f) => f.user_id === usuari)
				.filter((f) => desDe === null || micros(f.server_updated_at) >= desDe)
				.sort(
					(a, b) =>
						micros(a.server_updated_at) - micros(b.server_updated_at) || a.id.localeCompare(b.id)
				)
				.slice(0, limit)
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				.map(({ user_id, ...resta }) => resta);
			return this.json(route, 200, files);
		}
		if (cami === '/rest/v1/rpc/sync_origen' && req.method() === 'POST') {
			// Com la RPC de la migració 0005: LWW estricte i retorna el que queda al compte.
			const canvi = (cos as { canvi?: OrigenServidor } | null)?.canvi;
			const actual = this.origens.get(usuari!);
			if (canvi && (!actual || Date.parse(canvi.updatedAt) > Date.parse(actual.updatedAt))) {
				this.origens.set(usuari!, {
					codi: canvi.codi ?? null,
					updatedAt: new Date(canvi.updatedAt).toISOString()
				});
			}
			const o = this.origens.get(usuari!);
			return this.json(route, 200, o ? { codi: o.codi, updatedAt: pg(o.updatedAt) } : null);
		}
		if (cami === '/rest/v1/perfils' && req.method() === 'GET') {
			const o = this.origens.get(usuari!);
			return this.json(
				route,
				200,
				o
					? [
							{
								alias: null,
								origen_municipi: o.codi,
								origen_updated_at: pg(o.updatedAt),
								created_at: '2026-10-01T08:00:00+00:00',
								updated_at: pg(o.updatedAt)
							}
						]
					: []
			);
		}

		this.noGestionades.push(`${req.method()} ${cami}${url.search}`);
		return this.json(route, 501, { message: 'no implementat al servidor fals' });
	}

	/** Correus coneguts (per resoldre `/user` i `/token`). */
	correus = new Set<string>();
	/** Usuaris esborrats amb `esborrar_compte`. */
	esborrats = new Set<string>();
	/** Correu de l'usuari que obre l'enllaç `token_hash` bo (també el de restabliment). */
	emailEnllac = 'inesa@exemple.cat';
	/** Comptes amb contrasenya per correu (vegeu `crearCompte`). */
	comptes = new Map<string, CompteFals>();
	/** Correus de registre (`/signup`) rebuts, en ordre. */
	signups: string[] = [];
	/** Correus que el servidor "enviaria" (registre, reenviament i restabliment). */
	correusEnviats: { tipus: 'signup' | 'resend' | 'recover'; email: string }[] = [];
	/** Error que tornarà el `PUT /user` amb contrasenya (mentre no es buidi). */
	errorCanviContrasenya: ErrorAuth | null = null;
	/** Motius de `weak_password` quan `errorCanviContrasenya.error_code === 'weak_password'`. */
	motiusFeble: string[] = ['characters'];

	/** Afegeix un compte amb contrasenya (confirmat per defecte). */
	crearCompte(email: string, contrasenya: string, opcions: { confirmat?: boolean } = {}) {
		this.comptes.set(email, { contrasenya, confirmat: opcions.confirmat ?? true });
	}

	private syncPush(uid: string, files: FilaPushRebuda[]) {
		let acceptades = 0;
		const rebutjades: { id: string; motiu: string }[] = [];
		for (const f of files) {
			if (f.data < '2006-07-01' || !(f.cimId >= 1 && f.cimId <= 32767)) {
				rebutjades.push({ id: f.id, motiu: 'data fora de rang' });
				continue;
			}
			const motiuForcat = this.rebutjarIds.get(f.id);
			if (motiuForcat) {
				rebutjades.push({ id: f.id, motiu: motiuForcat });
				continue;
			}
			const actual = this.files.get(f.id);
			if (actual && actual.user_id !== uid) {
				rebutjades.push({ id: f.id, motiu: 'id en ús' });
				continue;
			}
			const nota = f.nota?.trim() ? f.nota.trim() : null;
			if (!actual || Date.parse(f.updatedAt) > Date.parse(actual.updated_at)) {
				this.files.set(f.id, {
					id: f.id,
					user_id: uid,
					cim_id: f.cimId,
					data: f.data,
					metode: f.metode.replace('-', '_') as FilaServidor['metode'],
					nota,
					// Sense la clau, es conserven els companys desats (fila nova: cap).
					companys: Array.isArray(f.companys) ? f.companys : (actual?.companys ?? []),
					created_at: actual?.created_at ?? pg(f.createdAt),
					updated_at: pg(f.updatedAt),
					deleted_at: f.deletedAt ? pg(f.deletedAt) : null,
					server_updated_at: this.seguentInstant()
				});
			}
			acceptades++;
		}
		return { acceptades, rebutjades };
	}
}

/** Crea el servidor fals i l'instal·la al context del test. */
export async function supabaseFals(context: BrowserContext, correus: string[] = []) {
	const s = new SupabaseFals();
	for (const c of correus) s.correus.add(c);
	s.correus.add(s.emailEnllac);
	await s.installar(context);
	return s;
}

// ---------------------------------------------------------------------------
// Estat local (IndexedDB i localStorage)
// ---------------------------------------------------------------------------

/** Desa una sessió a `localStorage` com ho fa supabase-js (la pàgina ha d'estar a l'origen). */
export async function desarSessio(page: Page, email: string) {
	await page.evaluate(({ clau, valor }) => localStorage.setItem(clau, JSON.stringify(valor)), {
		clau: CLAU_SESSIO,
		valor: sessioFalsa(email)
	});
}

/** Escriu metadades de la sync (`propietari`, `cursorPull`, `ultimaSync`). */
export async function escriureMeta(page: Page, entrades: Record<string, string | null>) {
	await page.evaluate(
		({ nom, entrades }) =>
			new Promise<void>((resolve, reject) => {
				const req = indexedDB.open(nom);
				req.onerror = () => reject(req.error);
				req.onsuccess = () => {
					const bd = req.result;
					const tx = bd.transaction('meta', 'readwrite');
					for (const [clau, valor] of Object.entries(entrades))
						tx.objectStore('meta').put({ clau, valor });
					tx.oncomplete = () => {
						bd.close();
						resolve();
					};
					tx.onerror = () => reject(tx.error);
				};
			}),
		{ nom: NOM_BD, entrades }
	);
}

/** Llegeix una taula sencera de l'IndexedDB de l'app. */
export function llegirTaula<T = Record<string, unknown>>(
	page: Page,
	taula: 'ascensions' | 'outbox' | 'meta' | 'preferencies'
): Promise<T[]> {
	return page.evaluate(
		({ nom, taula }) =>
			new Promise<T[]>((resolve, reject) => {
				const req = indexedDB.open(nom);
				req.onerror = () => reject(req.error);
				req.onsuccess = () => {
					const bd = req.result;
					if (!bd.objectStoreNames.contains(taula)) {
						bd.close();
						return resolve([]);
					}
					const all = bd.transaction(taula).objectStore(taula).getAll();
					all.onsuccess = () => {
						bd.close();
						resolve(all.result as T[]);
					};
					all.onerror = () => reject(all.error);
				};
			}),
		{ nom: NOM_BD, taula }
	);
}
