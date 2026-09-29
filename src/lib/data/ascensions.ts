/**
 * Repositori d'ascensions local-first (bloc 4a). Vegeu `docs/03-modelo-datos.md` §2 i
 * `docs/05-frontend-arquitectura.md` §1 (registre optimista).
 *
 * - Tota escriptura va a IndexedDB i s'encua a `outbox` en la mateixa transacció (la sync de
 *   la fase 5 la buidarà). Mai no s'espera la xarxa.
 * - Els esborrats són làpides (`deletedAt`), per poder-los desfer i sincronitzar.
 * - Valida amb les regles del domini (`validarData`, `validarMetode`) i amb el catàleg.
 *   La app només fa seguiment: la validació oficial és de la FEEC.
 *
 * Sense imports del framework (usable a Capacitor). La UI hi accedeix amb `ascensionsVives()`.
 */
import { liveQuery } from 'dexie';
import {
	avuiLocal,
	esDataIsoValida,
	validarData,
	validarMetode,
	type Ascensio,
	type DataISO,
	type Metode
} from '$lib/domain';
import { CATALEG_VERSIO, CIMS } from './catalog/cataleg';
import { indexedDbDisponible, obtenirBd, type CarnetDb, type FilaAscensio } from './local/db';
import { ara, instantEscriptura } from './local/rellotge';
import { esUuid, uuidv7 } from './local/uuid';

// ---------------------------------------------------------------------------
// Contracte
// ---------------------------------------------------------------------------

/** Dades que entra l'usuari en registrar una ascensió. */
export interface NovaAscensio {
	cimId: number;
	/** Data de calendari `YYYY-MM-DD`. */
	data: string;
	metode: Metode;
	nota?: string;
}

/** Llargada màxima de la nota (caràcters Unicode, com `char_length` de Postgres). */
export const NOTA_MAX = 500;

export type CampAscensio = 'cimId' | 'data' | 'metode' | 'nota';

/** Codis d'error estables (la UI els tradueix amb `messages/`). */
export const CODIS_ERROR_VALIDACIO = [
	'cimId:desconegut',
	'data:format',
	'data:anterior-inici',
	'data:futura',
	'metode:invalid',
	'nota:format',
	'nota:massa-llarga'
] as const;
export type CodiErrorValidacio = (typeof CODIS_ERROR_VALIDACIO)[number];

/** Error de validació d'un camp. `codi` = `{camp}:{motiu}`. */
export class ErrorValidacio extends Error {
	readonly camp: CampAscensio;
	readonly codi: CodiErrorValidacio;

	constructor(codi: CodiErrorValidacio) {
		super(`Ascensió no vàlida: ${codi}`);
		this.name = 'ErrorValidacio';
		this.codi = codi;
		this.camp = codi.slice(0, codi.indexOf(':')) as CampAscensio;
	}
}

/** L'ascensió no existeix (o està esborrada, per a `actualitzarAscensio`). */
export class ErrorAscensioNoTrobada extends Error {
	readonly codi = 'ascensio:no-trobada';
	readonly id: string;

	constructor(id: string) {
		super(`Ascensió no trobada: ${id}`);
		this.name = 'ErrorAscensioNoTrobada';
		this.id = id;
	}
}

export type CodiErrorImportacio =
	| 'importacio:json-invalid'
	| 'importacio:format'
	| 'importacio:versio'
	| 'importacio:massa-gran'
	| 'importacio:sense-valides';

/** El fitxer d'importació no es pot fer servir (no s'ha escrit res). */
export class ErrorImportacio extends Error {
	readonly codi: CodiErrorImportacio;

	constructor(codi: CodiErrorImportacio) {
		super(`Importació no vàlida: ${codi}`);
		this.name = 'ErrorImportacio';
		this.codi = codi;
	}
}

// ---------------------------------------------------------------------------
// Validació
// ---------------------------------------------------------------------------

let idsCataleg: ReadonlySet<number> | null = null;
function cimExisteix(id: unknown): boolean {
	idsCataleg ??= new Set(CIMS.map((c) => c.id));
	return typeof id === 'number' && Number.isInteger(id) && idsCataleg.has(id);
}

type ResultatNota = { ok: true; nota: string | null } | { ok: false; codi: CodiErrorValidacio };

/** Nota normalitzada: salts de línia LF, sense espais als extrems; buida o absent → `null`. */
function normalitzarNota(nota: unknown): ResultatNota {
	if (nota === undefined || nota === null) return { ok: true, nota: null };
	if (typeof nota !== 'string') return { ok: false, codi: 'nota:format' };
	const net = nota.replace(/\r\n?/g, '\n').trim();
	if (net === '') return { ok: true, nota: null };
	if (Array.from(net).length > NOTA_MAX) return { ok: false, codi: 'nota:massa-llarga' };
	return { ok: true, nota: net };
}

/** Nota ja validada (`validarAscensio`). */
function notaNeta(nota: unknown): string | null {
	const r = normalitzarNota(nota);
	return r.ok ? r.nota : null;
}

/**
 * Valida una ascensió sense desar-la i retorna **tots** els errors (buit = vàlida), en
 * l'ordre dels camps. Útil per mostrar-los al formulari. `avui` per defecte: data local
 * (Europe/Madrid) del rellotge de la capa.
 */
export function validarAscensio(
	input: unknown,
	avui: DataISO = avuiLocal(ara())
): ErrorValidacio[] {
	const o = (typeof input === 'object' && input !== null ? input : {}) as Record<string, unknown>;
	const errors: ErrorValidacio[] = [];
	if (!cimExisteix(o.cimId)) errors.push(new ErrorValidacio('cimId:desconegut'));
	const d = validarData(o.data, avui);
	if (!d.ok) errors.push(new ErrorValidacio(`data:${d.error}`));
	if (!validarMetode(o.metode)) errors.push(new ErrorValidacio('metode:invalid'));
	const nota = normalitzarNota(o.nota);
	if (!nota.ok) errors.push(new ErrorValidacio(nota.codi));
	return errors;
}

/** Valida i normalitza; llança el primer `ErrorValidacio`. */
function validarONormalitzar(input: NovaAscensio, avui: DataISO) {
	const [primer] = validarAscensio(input, avui);
	if (primer) throw primer;
	return {
		cimId: input.cimId,
		data: input.data,
		metode: input.metode,
		nota: notaNeta(input.nota)
	};
}

// ---------------------------------------------------------------------------
// Utilitats internes
// ---------------------------------------------------------------------------

/** Ordre de l'historial: data desc, després `createdAt` desc (i `id` per estabilitat). */
function ordenar(a: Ascensio, b: Ascensio): number {
	if (a.data !== b.data) return a.data < b.data ? 1 : -1;
	if (a.createdAt !== b.createdAt) return a.createdAt < b.createdAt ? 1 : -1;
	return a.id < b.id ? 1 : a.id > b.id ? -1 : 0;
}

function vives(bd: CarnetDb): Promise<Ascensio[]> {
	return bd.ascensions.toArray().then((files) => files.filter((f) => !f.deletedAt).sort(ordenar));
}

function encuar(bd: CarnetDb, ascensioId: string, encuaAt: string): Promise<unknown> {
	return bd.outbox.put({ ascensioId, encuaAt, intents: 0 });
}

function copia(f: FilaAscensio): Ascensio {
	return { ...f };
}

// ---------------------------------------------------------------------------
// CRUD
// ---------------------------------------------------------------------------

/**
 * Registra una ascensió. Valida amb "avui" local (Europe/Madrid), genera un UUIDv7, la desa
 * a IndexedDB i l'encua per a la sync futura.
 * @throws ErrorValidacio
 */
export async function afegirAscensio(input: NovaAscensio): Promise<Ascensio> {
	const instant = ara();
	const net = validarONormalitzar(input, avuiLocal(instant));
	const ts = instant.toISOString();
	const fila: FilaAscensio = {
		id: uuidv7(instant.getTime()),
		...net,
		createdAt: ts,
		updatedAt: ts,
		deletedAt: null
	};
	const bd = obtenirBd();
	await bd.transaction('rw', bd.ascensions, bd.outbox, async () => {
		await bd.ascensions.add(fila);
		await encuar(bd, fila.id, ts);
	});
	return copia(fila);
}

/**
 * Modifica una ascensió viva. Valida el resultat complet. `nota: ''` esborra la nota;
 * `nota: undefined` (o absent) la deixa igual.
 * @throws ErrorValidacio, ErrorAscensioNoTrobada
 */
export async function actualitzarAscensio(
	id: string,
	canvis: Partial<NovaAscensio>
): Promise<Ascensio> {
	const bd = obtenirBd();
	return bd.transaction('rw', bd.ascensions, bd.outbox, async () => {
		const actual = await bd.ascensions.get(id);
		if (!actual || actual.deletedAt) throw new ErrorAscensioNoTrobada(id);
		const combinat: NovaAscensio = {
			cimId: canvis.cimId !== undefined ? canvis.cimId : actual.cimId,
			data: canvis.data !== undefined ? canvis.data : actual.data,
			metode: canvis.metode !== undefined ? canvis.metode : actual.metode,
			nota: canvis.nota !== undefined ? (canvis.nota ?? '') : (actual.nota ?? undefined)
		};
		const net = validarONormalitzar(combinat, avuiLocal(ara()));
		const fila: FilaAscensio = {
			...actual,
			...net,
			updatedAt: instantEscriptura(actual.updatedAt)
		};
		await bd.ascensions.put(fila);
		await encuar(bd, id, fila.updatedAt);
		return copia(fila);
	});
}

/**
 * Esborra una ascensió deixant-ne la làpida (`deletedAt`), per poder-la desfer
 * (`restaurarAscensio`) i sincronitzar. Idempotent si ja estava esborrada.
 * @throws ErrorAscensioNoTrobada si l'id no existeix.
 */
export async function esborrarAscensio(id: string): Promise<void> {
	const bd = obtenirBd();
	await bd.transaction('rw', bd.ascensions, bd.outbox, async () => {
		const actual = await bd.ascensions.get(id);
		if (!actual) throw new ErrorAscensioNoTrobada(id);
		if (actual.deletedAt) return;
		const ts = instantEscriptura(actual.updatedAt);
		await bd.ascensions.put({ ...actual, deletedAt: ts, updatedAt: ts });
		await encuar(bd, id, ts);
	});
}

/**
 * Desfà un esborrat (botó "Desfés"). Idempotent si ja estava viva.
 * @throws ErrorAscensioNoTrobada si l'id no existeix.
 */
export async function restaurarAscensio(id: string): Promise<Ascensio> {
	const bd = obtenirBd();
	return bd.transaction('rw', bd.ascensions, bd.outbox, async () => {
		const actual = await bd.ascensions.get(id);
		if (!actual) throw new ErrorAscensioNoTrobada(id);
		if (!actual.deletedAt) return copia(actual);
		const fila: FilaAscensio = {
			...actual,
			deletedAt: null,
			updatedAt: instantEscriptura(actual.updatedAt)
		};
		await bd.ascensions.put(fila);
		await encuar(bd, id, fila.updatedAt);
		return copia(fila);
	});
}

/** Ascensions vives (sense les esborrades), per data desc i després `createdAt` desc. */
export function llistarAscensions(): Promise<Ascensio[]> {
	return vives(obtenirBd());
}

// ---------------------------------------------------------------------------
// Store viu (compatible amb el contracte de store de Svelte, sense importar Svelte)
// ---------------------------------------------------------------------------

export interface StoreLectura<T> {
	subscribe(run: (valor: T) => void): () => void;
}

/** Última llista emesa: s'emet de seguida en subscriure's (evita un "buit" fals en navegar). */
let darreraLlista: Ascensio[] | null = null;

function storeViu<T>(inicial: () => T, mapar: (llista: Ascensio[]) => T): StoreLectura<T> {
	return {
		subscribe(run) {
			// El contracte de store demana un valor síncron.
			run(inicial());
			// SSR, prerender o Workers: no hi ha IndexedDB i no s'hi toca.
			if (!indexedDbDisponible()) return () => {};
			const sub = liveQuery(() => vives(obtenirBd())).subscribe({
				next: (llista) => {
					darreraLlista = llista;
					run(mapar(llista));
				},
				error: (e: unknown) => console.error('[ascensions] liveQuery', e)
			});
			return () => sub.unsubscribe();
		}
	};
}

/**
 * Llista viva de les ascensions (mateix ordre que `llistarAscensions`) per a `$store` de
 * Svelte. Emet de seguida l'última llista coneguda (o `[]`) i després cada canvi a IndexedDB.
 * En SSR/prerender emet `[]` i no toca IndexedDB.
 */
export function ascensionsVives(): StoreLectura<Ascensio[]> {
	return storeViu(
		() => darreraLlista ?? [],
		(l) => l
	);
}

/**
 * Com `ascensionsVives`, però diu si la primera lectura d'IndexedDB ja ha arribat, per
 * distingir "carregant" (skeleton) de "cap ascensió" (estat buit). En SSR, `carregat: false`.
 */
export function ascensionsVivesAmbEstat(): StoreLectura<{
	carregat: boolean;
	ascensions: Ascensio[];
}> {
	return storeViu(
		() => ({ carregat: darreraLlista !== null, ascensions: darreraLlista ?? [] }),
		(ascensions) => ({ carregat: true, ascensions })
	);
}

// ---------------------------------------------------------------------------
// Exportació, importació i esborrat total (RGPD local)
// ---------------------------------------------------------------------------

export const FORMAT_EXPORTACIO = 'carnetdecims.ascensions';
export const VERSIO_EXPORTACIO = 1;
/** Límits defensius de la importació. */
export const IMPORTACIO_MAX_BYTES = 10 * 1024 * 1024;
export const IMPORTACIO_MAX_ASCENSIONS = 20_000;

export interface AscensioExportada {
	id: string;
	cimId: number;
	/** Només informatiu (no s'importa): nom del cim al catàleg. */
	cimNom?: string;
	data: DataISO;
	metode: Metode;
	nota: string | null;
	createdAt: string;
	updatedAt: string;
}

export interface Exportacio {
	format: typeof FORMAT_EXPORTACIO;
	versio: number;
	app: 'carnetdecims.cat';
	exportatAt: string;
	catalegVersio: string;
	avis: string;
	total: number;
	ascensions: AscensioExportada[];
}

/**
 * Còpia de seguretat / portabilitat (RGPD): JSON versionat amb metadades i les ascensions
 * vives (les làpides no hi surten).
 */
export async function exportarDades(): Promise<string> {
	const llista = await vives(obtenirBd());
	const noms = new Map(CIMS.map((c) => [c.id, c.nom]));
	const exp: Exportacio = {
		format: FORMAT_EXPORTACIO,
		versio: VERSIO_EXPORTACIO,
		app: 'carnetdecims.cat',
		exportatAt: ara().toISOString(),
		catalegVersio: CATALEG_VERSIO,
		avis: 'Còpia personal de Carnet de Cims (web no oficial). No és el registre oficial del repte 100 Cims: la validació la fa la FEEC a través de les entitats.',
		total: llista.length,
		ascensions: llista.map((a) => ({
			id: a.id,
			cimId: a.cimId,
			cimNom: noms.get(a.cimId),
			data: a.data,
			metode: a.metode,
			nota: a.nota,
			createdAt: a.createdAt,
			updatedAt: a.updatedAt
		}))
	};
	return JSON.stringify(exp, null, 2);
}

const RE_INSTANT = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,3})?Z$/;

function instantValid(v: unknown, maxim: number): v is string {
	if (typeof v !== 'string' || !RE_INSTANT.test(v)) return false;
	const t = Date.parse(v);
	return !Number.isNaN(t) && esDataIsoValida(v.slice(0, 10)) && t <= maxim;
}

/** Converteix una entrada del fitxer en fila viva vàlida, o `null` si s'ha d'ignorar. */
function filaImportada(v: unknown, avui: DataISO, maxInstant: number): FilaAscensio | null {
	if (typeof v !== 'object' || v === null || Array.isArray(v)) return null;
	const o = v as Record<string, unknown>;
	const id = typeof o.id === 'string' ? o.id.toLowerCase() : null;
	if (!esUuid(id)) return null;
	if (o.deletedAt !== undefined && o.deletedAt !== null) return null;
	if (validarAscensio(o, avui).length > 0) return null;
	// Marge d'1 minut per rellotges lleugerament avançats; més enllà, s'ignora.
	if (!instantValid(o.createdAt, maxInstant) || !instantValid(o.updatedAt, maxInstant)) return null;
	const createdAt = new Date(o.createdAt).toISOString();
	const updatedAt = new Date(o.updatedAt).toISOString();
	if (updatedAt < createdAt) return null;
	return {
		id,
		cimId: o.cimId as number,
		data: o.data as DataISO,
		metode: o.metode as Metode,
		nota: notaNeta(o.nota),
		createdAt,
		updatedAt,
		deletedAt: null
	};
}

function mateixContingut(a: FilaAscensio, b: FilaAscensio): boolean {
	return (
		a.cimId === b.cimId &&
		a.data === b.data &&
		a.metode === b.metode &&
		a.nota === b.nota &&
		!a.deletedAt === !b.deletedAt
	);
}

export interface ResultatImportacio {
	afegides: number;
	actualitzades: number;
	ignorades: number;
}

/**
 * Importa un fitxer d'`exportarDades`. Cada entrada es valida amb les mateixes regles que el
 * registre (les no vàlides, les làpides i els ids repetits compten com a `ignorades`).
 * - `fusionar`: afegeix les noves; si l'id ja existeix, guanya la de `updatedAt` més recent
 *   (LWW, com la sync). Reimportar el mateix fitxer no canvia res (idempotent).
 * - `substituir`: el dispositiu queda amb exactament les ascensions del fitxer. Les locals que
 *   no hi són queden com a làpides (per a la sync futura); les que hi són amb un altre
 *   contingut es sobreescriuen. Reimportar-lo no canvia res.
 * Tot passa en una transacció: o s'aplica sencer o no s'aplica.
 * @throws ErrorImportacio si el fitxer no és vàlid (no s'escriu res).
 */
export async function importarDades(
	json: string,
	mode: 'fusionar' | 'substituir'
): Promise<ResultatImportacio> {
	if (mode !== 'fusionar' && mode !== 'substituir') throw new TypeError(`mode invàlid: ${mode}`);
	if (typeof json !== 'string') throw new ErrorImportacio('importacio:json-invalid');
	if (json.length > IMPORTACIO_MAX_BYTES) throw new ErrorImportacio('importacio:massa-gran');
	let dades: unknown;
	try {
		dades = JSON.parse(json);
	} catch {
		throw new ErrorImportacio('importacio:json-invalid');
	}
	if (typeof dades !== 'object' || dades === null) throw new ErrorImportacio('importacio:format');
	const d = dades as Record<string, unknown>;
	if (d.format !== FORMAT_EXPORTACIO || !Array.isArray(d.ascensions)) {
		throw new ErrorImportacio('importacio:format');
	}
	if (typeof d.versio !== 'number' || !Number.isInteger(d.versio) || d.versio < 1) {
		throw new ErrorImportacio('importacio:format');
	}
	if (d.versio > VERSIO_EXPORTACIO) throw new ErrorImportacio('importacio:versio');
	const entrades = d.ascensions as unknown[];
	if (entrades.length > IMPORTACIO_MAX_ASCENSIONS)
		throw new ErrorImportacio('importacio:massa-gran');

	const instant = ara();
	const avui = avuiLocal(instant);
	const maxInstant = instant.getTime() + 60_000;
	let ignorades = 0;
	// Deduplicació dins del fitxer: per id, es queda la de `updatedAt` més recent.
	const perId = new Map<string, FilaAscensio>();
	for (const e of entrades) {
		const fila = filaImportada(e, avui, maxInstant);
		if (!fila) {
			ignorades++;
			continue;
		}
		const previa = perId.get(fila.id);
		if (previa) ignorades++;
		if (!previa || fila.updatedAt > previa.updatedAt) perId.set(fila.id, fila);
	}
	if (entrades.length > 0 && perId.size === 0)
		throw new ErrorImportacio('importacio:sense-valides');

	const bd = obtenirBd();
	return bd.transaction('rw', bd.ascensions, bd.outbox, async () => {
		let afegides = 0;
		let actualitzades = 0;
		for (const fila of perId.values()) {
			const local = await bd.ascensions.get(fila.id);
			if (!local) {
				await bd.ascensions.add(fila);
				await encuar(bd, fila.id, instant.toISOString());
				afegides++;
			} else if (mode === 'fusionar') {
				if (fila.updatedAt > local.updatedAt) {
					await bd.ascensions.put(fila);
					await encuar(bd, fila.id, instant.toISOString());
					actualitzades++;
				} else ignorades++;
			} else if (mateixContingut(local, fila)) {
				ignorades++;
			} else {
				// Substituir: guanya el fitxer; `updatedAt` nou perquè guanyi també a la sync.
				const nova = { ...fila, updatedAt: instantEscriptura(local.updatedAt) };
				await bd.ascensions.put(nova);
				await encuar(bd, fila.id, nova.updatedAt);
				actualitzades++;
			}
		}
		if (mode === 'substituir') {
			const sobrants = await bd.ascensions
				.filter((f) => !f.deletedAt && !perId.has(f.id))
				.toArray();
			for (const f of sobrants) {
				const ts = instantEscriptura(f.updatedAt);
				await bd.ascensions.put({ ...f, deletedAt: ts, updatedAt: ts });
				await encuar(bd, f.id, ts);
			}
		}
		return { afegides, actualitzades, ignorades };
	});
}

/**
 * Esborra del dispositiu totes les ascensions (també les làpides) i la cua de sync (RGPD).
 * Irreversible. Els stores vius emeten `[]`.
 */
export async function esborrarTot(): Promise<void> {
	const bd = obtenirBd();
	await bd.transaction('rw', bd.ascensions, bd.outbox, async () => {
		await bd.ascensions.clear();
		await bd.outbox.clear();
	});
}

/** Entrades pendents de sincronitzar (per a la sync de la fase 5 i els tests). */
export function pendentsDeSincronitzar() {
	return obtenirBd().outbox.orderBy('encuaAt').toArray();
}
