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
 *    - Rebuig `id en ús` (l'id ja és d'un altre compte: dades fusionades o un JSON d'un altre
 *      compte): la fila rep un UUIDv7 nou (sense làpida per a l'id vell) i es torna a pujar en
 *      la mateixa passada.
 *    - Altres rebutjos: `intents + 1`; a partir de `MAX_INTENTS` l'entrada queda bloquejada (no
 *      compta com a pendent i l'estat mostra `error: 'servidor'`), sense perdre la fila local.
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
import {
	indexedDbDisponible,
	obtenirBd,
	type EntradaMeta,
	type EntradaOutbox,
	type FilaAscensio
} from './local/db';
import { novaEpoca } from './local/epoca';
import { ara } from './local/rellotge';
import { uuidv7 } from './local/uuid';

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

/** Usuari a qui pertanyen les dades del dispositiu (`null` = anònimes). */
export function propietariLocal(): Promise<string | null> {
	return llegirMeta('propietari');
}

/**
 * Les dades locals s'han esborrat (o han canviat de propietari) mentre la passada era en vol:
 * la passada s'atura sense escriure res més. No és un error per a l'usuari.
 */
export class SyncAvortada extends Error {
	constructor() {
		super('Sync avortada: les dades locals han canviat (esborrat)');
		this.name = 'SyncAvortada';
	}
}

/** `SyncAvortada`, també si Dexie l'embolcalla (`inner`) en avortar la transacció. */
export function esAvortada(e: unknown): boolean {
	const err = e as { name?: unknown; inner?: unknown } | null;
	return (
		e instanceof SyncAvortada || err?.name === 'SyncAvortada' || err?.inner instanceof SyncAvortada
	);
}

/**
 * Comprova, **dins d'una transacció que inclogui `meta`**, que l'època (`local/epoca.ts`) és la
 * mateixa que en començar la passada. Si no, llança `SyncAvortada` i la transacció no escriu res.
 */
async function comprovarEpoca(epoca: string | null): Promise<void> {
	const actual = (await obtenirBd().meta.get('epoca'))?.valor ?? null;
	if (actual !== epoca) throw new SyncAvortada();
}

// ---------------------------------------------------------------------------
// Motor
// ---------------------------------------------------------------------------

export type ResultatSync =
	| {
			estat: 'fet';
			pujades: number;
			/** Files rebutjades en aquesta passada (per motius que no siguin `id en ús`). */
			rebutjades: number;
			/** Files amb un id d'un altre compte que han rebut un id nou (i s'han tornat a pujar). */
			reassignades: number;
			baixades: number;
			/** Entrades de la cua bloquejades (`intents >= MAX_INTENTS`) en acabar la passada. */
			bloquejades: number;
	  }
	| { estat: 'conflicte' };

/**
 * Encua totes les files locals (vives i làpides) i assigna el propietari: migració local → núvol.
 * Idempotent: el servidor fa upsert per id, i el pull es fa complet (cursor a zero).
 */
async function adoptarDadesLocals(usuariId: string, epoca: string | null): Promise<void> {
	const bd = obtenirBd();
	const encuaAt = ara().toISOString();
	await bd.transaction('rw', bd.ascensions, bd.outbox, bd.meta, async () => {
		await comprovarEpoca(epoca);
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

/**
 * Motiu amb què `sync_push` (migració 0003) rebutja una fila l'id de la qual ja és d'un altre
 * usuari (invisible per la RLS). El client hi respon reassignant-li un id nou (`reassignarId`).
 */
export const MOTIU_ID_EN_US = 'id en ús';

/**
 * Rebutjos seguits (per motius que no siguin `id en ús`) a partir dels quals una entrada de la
 * cua es considera **bloquejada**: deixa de comptar com a pendent i la sync publica
 * `error: 'servidor'` (en lloc de "N canvis pendents" per sempre). La fila local no es toca i
 * l'entrada es continua enviant a cada sync (si el servidor l'accepta, surt de la cua); una
 * edició local la torna a encuar amb `intents: 0`.
 */
export const MAX_INTENTS = 5;

/** Rondes màximes de push per passada (la 2a i següents només pugen les files reassignades). */
const MAX_RONDES_PUSH = 3;

const esIdEnUs = (motiu: unknown): boolean =>
	typeof motiu === 'string' && motiu.trim().toLowerCase() === MOTIU_ID_EN_US;

/**
 * La fila `idVell` té un id que al núvol és d'un altre compte (p. ex. dades fusionades d'un altre
 * compte o un JSON exportat per un altre compte). Es reemplaça localment per una còpia idèntica
 * amb un UUIDv7 nou, i la cua passa a l'id nou. L'id vell s'esborra **sense làpida** (no és
 * d'aquest compte: al núvol no s'hi ha de pujar res amb aquell id).
 *
 * Idempotència: l'id nou queda desat abans de pujar-lo; si la resposta del push es perd, el
 * reintent puja el mateix id nou i el servidor el tracta com un upsert (no es duplica).
 * @returns l'id nou, o `null` si la fila ja no existeix (entrada òrfena: surt de la cua).
 */
async function reassignarId(idVell: string, epoca: string | null): Promise<string | null> {
	const bd = obtenirBd();
	return bd.transaction('rw', bd.ascensions, bd.outbox, bd.meta, async () => {
		await comprovarEpoca(epoca);
		const fila = await bd.ascensions.get(idVell);
		await bd.outbox.delete(idVell);
		if (!fila) return null;
		const instant = Date.parse(fila.createdAt);
		const idNou = uuidv7(Number.isNaN(instant) ? ara().getTime() : instant);
		await bd.ascensions.delete(idVell);
		await bd.ascensions.add({ ...fila, id: idNou });
		await bd.outbox.put({ ascensioId: idNou, encuaAt: ara().toISOString(), intents: 0 });
		return idNou;
	});
}

interface ResultatPujada {
	pujades: number;
	rebutjades: number;
	reassignades: number;
}

/** Puja una llista d'entrades de la cua (en blocs). Retorna també els ids nous reassignats. */
async function pujarEntrades(
	remot: Remot,
	cua: EntradaOutbox[],
	epoca: string | null
): Promise<ResultatPujada & { idsNous: string[] }> {
	const bd = obtenirBd();
	let pujades = 0;
	let rebutjades = 0;
	const idsNous: string[] = [];
	for (let i = 0; i < cua.length; i += BLOC_PUSH) {
		const bloc = cua.slice(i, i + BLOC_PUSH);
		const files = await bd.ascensions.bulkGet(bloc.map((e) => e.ascensioId));
		// Entrades sense fila (orfes) no s'envien i surten de la cua com les acceptades.
		const enviar = files.filter((f): f is FilaAscensio => !!f).map(filaPush);
		const res = enviar.length ? await remot.push(enviar) : { acceptades: 0, rebutjades: [] };
		const enviats = new Set(enviar.map((f) => f.id));
		const idEnUs = new Set<string>();
		const altres = new Map<string, string>();
		for (const r of res.rebutjades) {
			if (!enviats.has(r.id)) continue; // defensa: només ids d'aquest bloc
			if (esIdEnUs(r.motiu)) idEnUs.add(r.id);
			else altres.set(r.id, String(r.motiu));
		}
		if (altres.size) console.warn('[sync] files rebutjades pel servidor', [...altres]);
		await bd.transaction('rw', bd.outbox, bd.meta, async () => {
			await comprovarEpoca(epoca);
			for (const e of bloc) {
				if (idEnUs.has(e.ascensioId)) continue; // es resol a sota (canvi d'id)
				const actual = await bd.outbox.get(e.ascensioId);
				// S'ha tornat a encuar mentre es pujava: la versió nova surt a la sync següent.
				if (!actual || actual.encuaAt !== e.encuaAt) continue;
				if (altres.has(e.ascensioId)) {
					await bd.outbox.put({ ...actual, intents: actual.intents + 1 });
				} else {
					await bd.outbox.delete(e.ascensioId);
				}
			}
		});
		// L'id és d'un altre compte: cap versió d'aquesta fila no hi entrarà mai amb aquest id
		// (encara que s'hagi editat mentre es pujava), així que es reassigna sempre.
		for (const id of idEnUs) {
			const nou = await reassignarId(id, epoca);
			if (nou) idsNous.push(nou);
		}
		pujades += enviar.length - idEnUs.size - altres.size;
		rebutjades += altres.size;
	}
	return { pujades, rebutjades, reassignades: idsNous.length, idsNous };
}

async function pujar(remot: Remot, epoca: string | null): Promise<ResultatPujada> {
	const bd = obtenirBd();
	// Instantània de la cua: el que s'encui durant la sync anirà a la següent (excepte les files
	// reassignades, que es tornen a pujar en aquesta mateixa passada).
	let cua = await bd.outbox.orderBy('encuaAt').toArray();
	const total: ResultatPujada = { pujades: 0, rebutjades: 0, reassignades: 0 };
	for (let ronda = 0; ronda < MAX_RONDES_PUSH && cua.length; ronda++) {
		const r = await pujarEntrades(remot, cua, epoca);
		total.pujades += r.pujades;
		total.rebutjades += r.rebutjades;
		total.reassignades += r.reassignades;
		if (!r.idsNous.length) break;
		const reintent = await bd.outbox.bulkGet(r.idsNous);
		cua = reintent.filter((e): e is EntradaOutbox => !!e);
	}
	return total;
}

/** Entrades de la cua que el servidor ha rebutjat `MAX_INTENTS` vegades o més. */
function bloquejada(e: EntradaOutbox): boolean {
	return e.intents >= MAX_INTENTS;
}

function comptarBloquejades(): Promise<number> {
	return obtenirBd().outbox.filter(bloquejada).count();
}

/** Entrades pendents de pujar que no estan bloquejades (el que la UI mostra com a pendent). */
function comptarPendents(): Promise<number> {
	return obtenirBd()
		.outbox.filter((e) => !bloquejada(e))
		.count();
}

/**
 * Aplica una pàgina de files remotes amb LWW i avança el cursor del pull, tot en una transacció
 * (si l'època ha canviat, no s'escriu ni una cosa ni l'altra). Retorna quantes files han canviat.
 */
async function aplicarRemotes(remotes: FilaRemota[], epoca: string | null): Promise<number> {
	const bd = obtenirBd();
	return bd.transaction('rw', bd.ascensions, bd.outbox, bd.meta, async () => {
		await comprovarEpoca(epoca);
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
		const darrer = remotes[remotes.length - 1].serverUpdatedAt;
		const cursor = (await bd.meta.get('cursorPull'))?.valor ?? null;
		if (!cursor || darrer > cursor) await bd.meta.put({ clau: 'cursorPull', valor: darrer });
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

async function baixar(remot: Remot, epoca: string | null): Promise<number> {
	const cursor = await llegirMeta('cursorPull');
	let desDe = cursor ? new Date(Date.parse(cursor) - SOLAPAMENT_PULL_MS).toISOString() : null;
	let baixades = 0;
	let anterior: string | null = null;
	for (let p = 0; p < MAX_PAGINES_PULL; p++) {
		const pagina = await remot.pull(desDe, PAGINA_PULL);
		if (!pagina.length) break;
		baixades += await aplicarRemotes(pagina, epoca);
		const darrer = pagina[pagina.length - 1].serverUpdatedAt;
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
 * o el servidor (el que s'hagi aplicat fins aleshores queda aplicat; tornar-la a fer és segur), i
 * `SyncAvortada` si mentrestant s'han esborrat les dades locals (`meta.epoca` ha canviat): en
 * aquest cas no s'escriu res més (ni files, ni cua, ni cursor, ni `ultimaSync`).
 */
export async function sincronitzar(remot: Remot, usuariId: string): Promise<ResultatSync> {
	const bd = obtenirBd();
	// L'època i el propietari es llegeixen junts: tot el que la passada escrigui després es
	// comprova contra aquesta època.
	const [entradaEpoca, entradaPropietari] = await bd.meta.bulkGet(['epoca', 'propietari']);
	const epoca = entradaEpoca?.valor ?? null;
	const propietari = entradaPropietari?.valor ?? null;
	if (propietari && propietari !== usuariId) return { estat: 'conflicte' };
	if (!propietari) await adoptarDadesLocals(usuariId, epoca);
	const { pujades, rebutjades, reassignades } = await pujar(remot, epoca);
	const baixades = await baixar(remot, epoca);
	await bd.transaction('rw', bd.meta, async () => {
		await comprovarEpoca(epoca);
		await bd.meta.put({ clau: 'ultimaSync', valor: ara().toISOString() });
	});
	const bloquejades = await comptarBloquejades();
	return { estat: 'fet', pujades, rebutjades, reassignades, baixades, bloquejades };
}

// ---------------------------------------------------------------------------
// Estat observable i orquestració en segon pla
// ---------------------------------------------------------------------------

export interface EstatSync {
	/**
	 * Canvis locals pendents de pujar (entrades de la cua), sense les bloquejades: les que el
	 * servidor ha rebutjat `MAX_INTENTS` vegades es reporten com a `error: 'servidor'`.
	 */
	pendents: number;
	/** Instant ISO de l'última sync completa (d'aquest dispositiu), o `null`. */
	ultimaSync: string | null;
	/** Hi ha una sync en curs. */
	sincronitzant: boolean;
	/**
	 * Últim error (desapareix en la sync següent que acaba bé). `servidor` també indica que hi ha
	 * canvis bloquejats (rebutjats `MAX_INTENTS` vegades); es manté mentre n'hi hagi.
	 */
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
	const sub = liveQuery(comptarPendents).subscribe({
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
			if (r.bloquejades) {
				console.warn(`[sync] ${r.bloquejades} canvis rebutjats repetidament pel servidor`);
			}
			publicar({
				conflicte: undefined,
				// Canvis que el servidor rebutja sempre: error visible (no "pendents" per sempre).
				// Les files locals no es toquen.
				error: r.bloquejades ? 'servidor' : undefined,
				ultimaSync: ara().toISOString()
			});
		}
	} catch (e) {
		// Dades esborrades durant la passada: res a publicar (ni error ni `ultimaSync`).
		if (esAvortada(e)) return;
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
 * - `fusionar`: les dades locals passen al compte actual i es pugen (les que ja eren al núvol de
 *   l'altre compte, rebutjades com a `id en ús`, hi entren amb un id nou);
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
			{ clau: 'cursorPull', valor: null },
			novaEpoca()
		]);
	} else {
		await bd.transaction('rw', bd.ascensions, bd.outbox, bd.meta, async () => {
			await bd.ascensions.clear();
			await bd.outbox.clear();
			await bd.meta.clear();
			await bd.meta.put(novaEpoca());
		});
	}
	publicar({ conflicte: undefined });
	await sincronitzarAra();
}

/**
 * Les dades locals deixen de ser de ningú (p. ex. després d'esborrar el compte i conservar-les).
 * Renova l'època: una passada en vol del compte anterior no hi escriu res més.
 */
export async function alliberarDadesLocals(): Promise<void> {
	await obtenirBd().meta.bulkPut([
		{ clau: 'propietari', valor: null },
		{ clau: 'cursorPull', valor: null },
		novaEpoca()
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
