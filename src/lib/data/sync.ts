/**
 * Sincronització local ⇄ núvol (fase 5). Vegeu `docs/03-modelo-datos.md` §2 i
 * `supabase/migrations/0002_dades_usuari.sql`.
 *
 * Offline-first: la UI només llegeix i escriu a IndexedDB; aquest mòdul puja la cua `outbox` i
 * baixa els canvis del servidor en segon pla. Sense xarxa no passa res: la cua espera.
 *
 * Cicle (`sincronitzar`):
 * 1. **Propietat de les dades del dispositiu** (`meta.propietari`):
 *    - cap (dades anònimes o dispositiu nou) → s'**adopten**: totes les files locals (làpides
 *      incloses) s'encuen i el pull es fa complet. És la migració local → núvol, idempotent per id;
 *    - un altre usuari → **conflicte**: no es fusiona res fins que l'usuari decideixi
 *      (`resoldreConflicteCompte`).
 * 2. **Push** de la cua amb `rpc('sync_push')` en blocs de 200. El servidor aplica LWW per
 *    `updatedAt` (empat → es queda el servidor). Una entrada només surt de la cua si no ha
 *    canviat mentre es pujava (`encuaAt` igual) i el servidor no l'ha rebutjada.
 * 3. **Pull** incremental per `server_updated_at` (solapament de 5 s; aplicar-lo és idempotent).
 *    Regla LWW local: guanya la remota si `updatedAt` remot ≥ local (empat → servidor); si la
 *    local tenia un canvi pendent que perd, el pendent es descarta (el servidor no l'acceptaria).
 *
 * Sense imports del framework (usable a Capacitor). El client de Supabase s'injecta (`Remot`),
 * així el motor es prova amb un servidor fals en memòria.
 */
import { liveQuery } from 'dexie';
import type { Metode } from '$lib/domain';
import type { ClientSupabase } from '$lib/platform/supabase';
import type { FilaAscensioSql, Json, MetodeSql } from '$lib/platform/supabase-tipus';
import type { StoreLectura } from './ascensions';
import { indexedDbDisponible, obtenirBd, type EntradaMeta, type FilaAscensio } from './local/db';
import { ara } from './local/rellotge';

// ---------------------------------------------------------------------------
// Contracte amb el servidor
// ---------------------------------------------------------------------------

/** Fila tal com la puja el client a `sync_push` (camps en camelCase, mètode amb guió). */
export interface FilaPush {
	id: string;
	cimId: number;
	data: string;
	metode: Metode;
	nota: string | null;
	createdAt: string;
	updatedAt: string;
	deletedAt: string | null;
}

/** Fila baixada, ja convertida al format local, amb el cursor del servidor. */
export interface FilaRemota {
	fila: FilaAscensio;
	/** `server_updated_at` tal com el retorna el servidor (es compara com a text). */
	serverUpdatedAt: string;
}

export interface ResultatPush {
	acceptades: number;
	rebutjades: { id: string; motiu: string }[];
}

/** Accés al servidor que fa servir el motor (implementació real: `remotSupabase`). */
export interface Remot {
	push(files: FilaPush[]): Promise<ResultatPush>;
	/** Files amb `server_updated_at >= desDe` (o totes si `null`), ordenades, com a màxim `limit`. */
	pull(desDe: string | null, limit: number): Promise<FilaRemota[]>;
}

export type CodiErrorSync = 'xarxa' | 'sessio' | 'servidor';

/** Error de la sync. `xarxa` i `sessio` es resolen sols (es reintenta en tornar la xarxa/sessió). */
export class ErrorSync extends Error {
	readonly codi: CodiErrorSync;

	constructor(codi: CodiErrorSync, missatge?: string) {
		super(missatge ? `Sync (${codi}): ${missatge}` : `Sync: ${codi}`);
		this.name = 'ErrorSync';
		this.codi = codi;
	}
}

/** Mida de bloc del push (el servidor n'admet fins a 500). */
export const BLOC_PUSH = 200;
/** Files per pàgina del pull. */
export const PAGINA_PULL = 1000;
/** Solapament del cursor del pull (transaccions que confirmen fora d'ordre). */
export const SOLAPAMENT_PULL_MS = 5_000;

// ---------------------------------------------------------------------------
// Conversions local ⇄ SQL
// ---------------------------------------------------------------------------

const deMetodeSql = (m: MetodeSql): Metode => m.replace('_', '-') as Metode;
/** Instant de Postgres (`…+00:00`, microsegons) → ISO local (`…Z`, mil·lisegons). */
const iso = (t: string): string => new Date(t).toISOString();

export function filaPush(f: FilaAscensio): FilaPush {
	return {
		id: f.id,
		cimId: f.cimId,
		data: f.data,
		metode: f.metode,
		nota: f.nota,
		createdAt: f.createdAt,
		updatedAt: f.updatedAt,
		deletedAt: f.deletedAt
	};
}

/** Fila de `public.ascensions` (sense `user_id`) → format local. El mètode passa de `a_peu` a `a-peu`. */
export function filaDesDeSql(r: Omit<FilaAscensioSql, 'user_id'>): FilaRemota {
	return {
		fila: {
			id: r.id,
			cimId: r.cim_id,
			data: r.data,
			metode: deMetodeSql(r.metode),
			nota: r.nota,
			createdAt: iso(r.created_at),
			updatedAt: iso(r.updated_at),
			deletedAt: r.deleted_at ? iso(r.deleted_at) : null
		},
		serverUpdatedAt: r.server_updated_at
	};
}

/** Classifica un error de supabase-js (PostgREST) o de `fetch`. */
export function classificarError(error: unknown, status?: number): ErrorSync {
	const e = (error ?? {}) as { message?: unknown; code?: unknown; status?: unknown };
	const missatge = typeof e.message === 'string' ? e.message : String(error);
	const codi = typeof e.code === 'string' ? e.code : '';
	const st = typeof status === 'number' ? status : typeof e.status === 'number' ? e.status : 0;
	if (st === 401 || st === 403 || codi === 'PGRST301' || codi === 'PGRST303' || codi === '42501') {
		return new ErrorSync('sessio', missatge);
	}
	if (
		!st ||
		/fetch|network|xarxa|offline|load failed|timeout/i.test(missatge) ||
		error instanceof TypeError
	) {
		return new ErrorSync('xarxa', missatge);
	}
	return new ErrorSync('servidor', missatge);
}

const COLUMNES_PULL =
	'id, cim_id, data, metode, nota, created_at, updated_at, deleted_at, server_updated_at';

/** `Remot` sobre el client de Supabase (RLS: només les files de l'usuari de la sessió). */
export function remotSupabase(client: ClientSupabase): Remot {
	return {
		async push(files) {
			let res;
			try {
				res = await client.rpc('sync_push', { files: files as unknown as Json });
			} catch (e) {
				throw classificarError(e);
			}
			if (res.error) throw classificarError(res.error, res.status);
			const d = (res.data ?? {}) as Partial<ResultatPush>;
			return {
				acceptades: typeof d.acceptades === 'number' ? d.acceptades : 0,
				rebutjades: Array.isArray(d.rebutjades) ? d.rebutjades : []
			};
		},
		async pull(desDe, limit) {
			let q = client.from('ascensions').select(COLUMNES_PULL);
			if (desDe) q = q.gte('server_updated_at', desDe);
			let res;
			try {
				res = await q
					.order('server_updated_at', { ascending: true })
					.order('id', { ascending: true })
					.limit(limit);
			} catch (e) {
				throw classificarError(e);
			}
			if (res.error) throw classificarError(res.error, res.status);
			return (res.data ?? []).map(filaDesDeSql);
		}
	};
}

// ---------------------------------------------------------------------------
// Metadades locals
// ---------------------------------------------------------------------------

async function llegirMeta(clau: EntradaMeta['clau']): Promise<string | null> {
	return (await obtenirBd().meta.get(clau))?.valor ?? null;
}

function escriureMeta(clau: EntradaMeta['clau'], valor: string | null): Promise<unknown> {
	return obtenirBd().meta.put({ clau, valor });
}

/** Usuari a qui pertanyen les dades del dispositiu (`null` = anònimes). */
export function propietariLocal(): Promise<string | null> {
	return llegirMeta('propietari');
}

// ---------------------------------------------------------------------------
// Motor
// ---------------------------------------------------------------------------

export type ResultatSync =
	{ estat: 'fet'; pujades: number; rebutjades: number; baixades: number } | { estat: 'conflicte' };

/**
 * Encua totes les files locals (vives i làpides) i assigna el propietari: migració local → núvol.
 * Idempotent: el servidor fa upsert per id, i el pull es fa complet (cursor a zero).
 */
async function adoptarDadesLocals(usuariId: string): Promise<void> {
	const bd = obtenirBd();
	const encuaAt = ara().toISOString();
	await bd.transaction('rw', bd.ascensions, bd.outbox, bd.meta, async () => {
		const [ids, jaEncuats] = await Promise.all([
			bd.ascensions.toCollection().primaryKeys(),
			bd.outbox.toCollection().primaryKeys()
		]);
		const encuats = new Set(jaEncuats);
		await bd.outbox.bulkPut(
			ids
				.filter((id) => !encuats.has(id))
				.map((ascensioId) => ({ ascensioId, encuaAt, intents: 0 }))
		);
		await bd.meta.bulkPut([
			{ clau: 'propietari', valor: usuariId },
			{ clau: 'cursorPull', valor: null }
		]);
	});
}

async function pujar(remot: Remot): Promise<{ pujades: number; rebutjades: number }> {
	const bd = obtenirBd();
	// Instantània de la cua: el que s'encui durant la sync anirà a la següent.
	const cua = await bd.outbox.orderBy('encuaAt').toArray();
	let pujades = 0;
	let rebutjades = 0;
	for (let i = 0; i < cua.length; i += BLOC_PUSH) {
		const bloc = cua.slice(i, i + BLOC_PUSH);
		const files = await bd.ascensions.bulkGet(bloc.map((e) => e.ascensioId));
		// Entrades sense fila (orfes) no s'envien i surten de la cua com les acceptades.
		const enviar = files.filter((f): f is FilaAscensio => !!f).map(filaPush);
		const res = enviar.length ? await remot.push(enviar) : { acceptades: 0, rebutjades: [] };
		const rebutjadesBloc = new Set(res.rebutjades.map((r) => r.id));
		if (res.rebutjades.length) console.warn('[sync] files rebutjades pel servidor', res.rebutjades);
		await bd.transaction('rw', bd.outbox, async () => {
			for (const e of bloc) {
				const actual = await bd.outbox.get(e.ascensioId);
				// S'ha tornat a encuar mentre es pujava: la versió nova surt a la sync següent.
				if (!actual || actual.encuaAt !== e.encuaAt) continue;
				if (rebutjadesBloc.has(e.ascensioId)) {
					await bd.outbox.put({ ...actual, intents: actual.intents + 1 });
				} else {
					await bd.outbox.delete(e.ascensioId);
				}
			}
		});
		pujades += enviar.length - rebutjadesBloc.size;
		rebutjades += rebutjadesBloc.size;
	}
	return { pujades, rebutjades };
}

/** Aplica un bloc de files remotes amb LWW. Retorna quantes han canviat la BD local. */
async function aplicarRemotes(remotes: FilaRemota[]): Promise<number> {
	const bd = obtenirBd();
	return bd.transaction('rw', bd.ascensions, bd.outbox, async () => {
		const ids = remotes.map((r) => r.fila.id);
		const [locals, pendents] = await Promise.all([
			bd.ascensions.bulkGet(ids),
			bd.outbox.bulkGet(ids)
		]);
		const escriure: FilaAscensio[] = [];
		const descartar: string[] = [];
		remotes.forEach(({ fila }, i) => {
			const local = locals[i];
			if (!local) {
				escriure.push(fila);
				return;
			}
			if (fila.updatedAt < local.updatedAt) return; // la local és més nova: la pujarà el push
			if (pendents[i]) descartar.push(fila.id); // el pendent perd (o empata): el servidor no l'acceptaria
			if (!mateixaFila(local, fila)) escriure.push(fila);
		});
		if (escriure.length) await bd.ascensions.bulkPut(escriure);
		if (descartar.length) await bd.outbox.bulkDelete(descartar);
		return escriure.length;
	});
}

function mateixaFila(a: FilaAscensio, b: FilaAscensio): boolean {
	return (
		a.cimId === b.cimId &&
		a.data === b.data &&
		a.metode === b.metode &&
		a.nota === b.nota &&
		a.createdAt === b.createdAt &&
		a.updatedAt === b.updatedAt &&
		a.deletedAt === b.deletedAt
	);
}

/** Màxim de pàgines per pull (defensa contra bucles si el servidor es comportés malament). */
const MAX_PAGINES_PULL = 1_000;

async function baixar(remot: Remot): Promise<number> {
	const cursor = await llegirMeta('cursorPull');
	let desDe = cursor ? new Date(Date.parse(cursor) - SOLAPAMENT_PULL_MS).toISOString() : null;
	let baixades = 0;
	let anterior: string | null = null;
	for (let p = 0; p < MAX_PAGINES_PULL; p++) {
		const pagina = await remot.pull(desDe, PAGINA_PULL);
		if (!pagina.length) break;
		baixades += await aplicarRemotes(pagina);
		const darrer = pagina[pagina.length - 1].serverUpdatedAt;
		const actual = await llegirMeta('cursorPull');
		if (!actual || darrer > actual) await escriureMeta('cursorPull', darrer);
		// Pàgina següent: `>=` l'últim instant (pot repetir files; aplicar-les és idempotent).
		// Si l'últim instant no avança (pàgina plena amb el mateix instant), es para.
		if (pagina.length < PAGINA_PULL || darrer === anterior) break;
		anterior = darrer;
		desDe = darrer;
	}
	return baixades;
}

/**
 * Una passada completa de sync per a `usuariId`. Llança `ErrorSync` si falla la xarxa, la sessió
 * o el servidor (el que s'hagi aplicat fins aleshores queda aplicat; tornar-la a fer és segur).
 */
export async function sincronitzar(remot: Remot, usuariId: string): Promise<ResultatSync> {
	const propietari = await llegirMeta('propietari');
	if (propietari && propietari !== usuariId) return { estat: 'conflicte' };
	if (!propietari) await adoptarDadesLocals(usuariId);
	const { pujades, rebutjades } = await pujar(remot);
	const baixades = await baixar(remot);
	await escriureMeta('ultimaSync', ara().toISOString());
	return { estat: 'fet', pujades, rebutjades, baixades };
}

// ---------------------------------------------------------------------------
// Estat observable i orquestració en segon pla
// ---------------------------------------------------------------------------

export interface EstatSync {
	/** Canvis locals pendents de pujar (entrades de la cua). */
	pendents: number;
	/** Instant ISO de l'última sync completa (d'aquest dispositiu), o `null`. */
	ultimaSync: string | null;
	/** Hi ha una sync en curs. */
	sincronitzant: boolean;
	/** Últim error (desapareix en la sync següent que acaba bé). */
	error?: CodiErrorSync;
	/**
	 * El dispositiu té dades d'un altre compte: no se sincronitza fins que l'usuari triï
	 * (`resoldreConflicteCompte`).
	 */
	conflicte?: 'altre-compte';
	/** Hi ha sessió i la sync és activa. */
	actiu: boolean;
}

let estat: EstatSync = { pendents: 0, ultimaSync: null, sincronitzant: false, actiu: false };
const subscriptors = new Set<(e: EstatSync) => void>();
let aturarComptador: (() => void) | null = null;

function publicar(canvis: Partial<EstatSync>): void {
	estat = { ...estat, ...canvis };
	for (const s of subscriptors) s(estat);
}

function engegarComptador(): void {
	if (aturarComptador || !indexedDbDisponible()) return;
	void llegirMeta('ultimaSync').then(
		(ultimaSync) => publicar({ ultimaSync }),
		() => {}
	);
	const sub = liveQuery(() => obtenirBd().outbox.count()).subscribe({
		next: (pendents) => {
			const augmenta = pendents > estat.pendents;
			publicar({ pendents });
			// Escriptura local nova: pujada amb debounce (si hi ha sessió).
			if (augmenta) programar(RETARD_DESPRES_ESCRIPTURA_MS);
		},
		error: (e: unknown) => console.error('[sync] liveQuery outbox', e)
	});
	aturarComptador = () => sub.unsubscribe();
}

/**
 * Estat de la sync per a `$estatSync` de Svelte. En SSR emet l'estat inicial i no toca IndexedDB.
 */
export const estatSync: StoreLectura<EstatSync> = {
	subscribe(run) {
		run(estat);
		subscriptors.add(run);
		engegarComptador();
		return () => {
			subscriptors.delete(run);
		};
	}
};

/** Context actiu (sessió iniciada) o `null`. */
let context: { remot: Remot; usuariId: string } | null = null;
let enCurs: Promise<void> | null = null;
let repetir = false;
let temporitzador: ReturnType<typeof setTimeout> | null = null;
let interval: ReturnType<typeof setInterval> | null = null;
let netejarEscoltadors: (() => void) | null = null;

/** Retard de la pujada després d'una escriptura local (agrupa edicions seguides). */
export const RETARD_DESPRES_ESCRIPTURA_MS = 2_000;
/** Pull periòdic mentre la app és visible. */
export const INTERVAL_SYNC_MS = 5 * 60_000;

function programar(retard: number): void {
	if (!context) return;
	if (temporitzador) clearTimeout(temporitzador);
	temporitzador = setTimeout(() => {
		temporitzador = null;
		void sincronitzarAra();
	}, retard);
}

async function ambBloqueig<T>(fn: () => Promise<T>): Promise<T> {
	// Una sola sync alhora entre pestanyes (si el navegador ho permet).
	const locks = typeof navigator !== 'undefined' ? navigator.locks : undefined;
	if (locks?.request) return locks.request('carnetdecims-sync', fn) as Promise<T>;
	return fn();
}

async function passada(): Promise<void> {
	const ctx = context;
	if (!ctx) return;
	publicar({ sincronitzant: true });
	try {
		const r = await ambBloqueig(() => sincronitzar(ctx.remot, ctx.usuariId));
		if (context !== ctx) return; // la sessió ha canviat mentrestant
		if (r.estat === 'conflicte') {
			publicar({ conflicte: 'altre-compte', error: undefined });
		} else {
			publicar({ conflicte: undefined, error: undefined, ultimaSync: ara().toISOString() });
		}
	} catch (e) {
		const err = e instanceof ErrorSync ? e : classificarError(e);
		if (err.codi === 'servidor') console.error('[sync]', e);
		if (context === ctx) publicar({ error: err.codi });
	} finally {
		publicar({ sincronitzant: false });
	}
}

/**
 * Sincronitza ara (botó "Sincronitza" i usos interns). Si ja n'hi ha una en curs, en fa una altra
 * en acabar. Sense sessió no fa res. No llança mai: els errors van a `estatSync.error`.
 */
export function sincronitzarAra(): Promise<void> {
	if (!context) return Promise.resolve();
	if (enCurs) {
		repetir = true;
		return enCurs;
	}
	enCurs = (async () => {
		do {
			repetir = false;
			await passada();
		} while (repetir && context);
	})().finally(() => {
		enCurs = null;
	});
	return enCurs;
}

function escoltarEntorn(): () => void {
	if (typeof window === 'undefined') return () => {};
	const enLinia = () => programar(0);
	const visibilitat = () => {
		if (document.visibilityState === 'visible') programar(0);
	};
	window.addEventListener('online', enLinia);
	document.addEventListener('visibilitychange', visibilitat);
	interval = setInterval(() => {
		if (document.visibilityState === 'visible') void sincronitzarAra();
	}, INTERVAL_SYNC_MS);
	return () => {
		window.removeEventListener('online', enLinia);
		document.removeEventListener('visibilitychange', visibilitat);
		if (interval) clearInterval(interval);
		interval = null;
	};
}

/**
 * Activa la sync per a un usuari (en iniciar sessió o en obrir la app amb sessió) o la desactiva
 * (`null`). Activar-la fa una sync de seguida i després: en tornar la xarxa, en tornar a la app,
 * cada 5 minuts i 2 s després de cada escriptura local. Ho crida `compte.ts`.
 */
export function configurarSync(nou: { remot: Remot; usuariId: string } | null): void {
	// Mateix usuari (p. ex. renovació del token): es conserva el context actual i no es fa res.
	if (context && nou && context.usuariId === nou.usuariId) return;
	context = nou;
	if (!nou) {
		if (temporitzador) clearTimeout(temporitzador);
		temporitzador = null;
		netejarEscoltadors?.();
		netejarEscoltadors = null;
		publicar({ actiu: false, error: undefined, conflicte: undefined });
		return;
	}
	publicar({ actiu: true });
	engegarComptador();
	netejarEscoltadors ??= escoltarEntorn();
	void sincronitzarAra();
}

/**
 * Resol el conflicte "dades d'un altre compte al dispositiu":
 * - `fusionar`: les dades locals passen al compte actual i es pugen;
 * - `descartar-locals`: s'esborren del dispositiu (no del núvol de l'altre compte) i es baixen
 *   les del compte actual.
 */
export async function resoldreConflicteCompte(
	accio: 'fusionar' | 'descartar-locals'
): Promise<void> {
	const bd = obtenirBd();
	if (accio === 'fusionar') {
		await bd.meta.bulkPut([
			{ clau: 'propietari', valor: null },
			{ clau: 'cursorPull', valor: null }
		]);
	} else {
		await bd.transaction('rw', bd.ascensions, bd.outbox, bd.meta, async () => {
			await bd.ascensions.clear();
			await bd.outbox.clear();
			await bd.meta.clear();
		});
	}
	publicar({ conflicte: undefined });
	await sincronitzarAra();
}

/** Les dades locals deixen de ser de ningú (p. ex. després d'esborrar el compte i conservar-les). */
export async function alliberarDadesLocals(): Promise<void> {
	await obtenirBd().meta.bulkPut([
		{ clau: 'propietari', valor: null },
		{ clau: 'cursorPull', valor: null }
	]);
}

/** Només per a tests: torna l'orquestració a l'estat inicial. */
export function _reiniciarSyncPerTests(): void {
	configurarSync(null);
	aturarComptador?.();
	aturarComptador = null;
	subscriptors.clear();
	enCurs = null;
	repetir = false;
	estat = { pendents: 0, ultimaSync: null, sincronitzant: false, actiu: false };
}
