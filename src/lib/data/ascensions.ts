/**
 * Repositori d'ascensions local-first (bloc 4a). Vegeu `docs/03-modelo-datos.md` §2 i
 * `docs/05-frontend-arquitectura.md` §1 (registre optimista).
 *
 * - Tota escriptura va a IndexedDB i s'encua a `outbox` en la mateixa transacció (la sync de
 *   la fase 5 la buidarà). Mai no s'espera la xarxa.
 * - Els esborrats són làpides (`deletedAt`), per poder-los desfer i sincronitzar. La làpida
 *   conserva la nota i els companys només durant la finestra de desfer (`local/lapides.ts`);
 *   després es buida, també al núvol.
 * - Valida amb les regles del domini (`validarData`, `validarMetode`) i amb el catàleg.
 *   La app només fa seguiment: la validació oficial és de la FEEC.
 * - Diari de muntanya (bloc R1): cada ascensió pot portar una nota i els companys (noms en text
 *   lliure, `domain/diari.ts`). Són dades personals i de tercers: només al dispositiu i, amb
 *   sessió, al compte de l'usuari; mai en una URL ni en un registre.
 *
 * Sense imports del framework (usable a Capacitor). La UI hi accedeix amb `ascensionsVives()`.
 */
import { liveQuery } from 'dexie';
import {
	avuiLocal,
	clauDuplicat,
	contingutCanvia,
	esCodiMunicipi,
	esDataIsoValida,
	fusionarContingut,
	mateixosCompanys,
	normalitzarCompanys,
	ordreGuanyadora,
	validarData,
	validarMetode,
	type Ascensio,
	type ContingutFusionat,
	type DataISO,
	type Metode
} from '$lib/domain';
import { CATALEG_VERSIO, CIMS } from './catalog/cataleg';
import {
	indexedDbDisponible,
	obtenirBd,
	type CarnetDb,
	type EntradaOutbox,
	type EntradaPreferencia,
	type FilaAscensio,
	type Redireccio
} from './local/db';
import { novaEpoca } from './local/epoca';
import { FINESTRA_DESFER_MS, foraDeFinestra, purgarLapides, senseDiari } from './local/lapides';
import { filaResolta, redireccio, resoldreId } from './local/redireccions';
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
	/**
	 * Companys de l'ascensió (diari de muntanya): noms o àlies en text lliure. Es normalitzen en
	 * desar (espais, buits i repetits fora): vegeu `normalitzarCompanys`. Límits: `COMPANYS_MAX`
	 * noms de `COMPANY_MAX_CARACTERS` caràcters (`$lib/domain`).
	 */
	companys?: string[];
}

/** Llargada màxima de la nota (caràcters Unicode, com `char_length` de Postgres). */
export const NOTA_MAX = 500;

export type CampAscensio = 'cimId' | 'data' | 'metode' | 'nota' | 'companys';

/** Codis d'error estables (la UI els tradueix amb `messages/`). */
export const CODIS_ERROR_VALIDACIO = [
	'cimId:desconegut',
	'data:format',
	'data:anterior-inici',
	'data:futura',
	'metode:invalid',
	'nota:format',
	'nota:massa-llarga',
	'companys:format',
	'companys:massa',
	'companys:massa-llarg'
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
	const companys = normalitzarCompanys(o.companys);
	if (!companys.ok) errors.push(new ErrorValidacio(`companys:${companys.error}`));
	return errors;
}

/** Companys ja validats (`validarAscensio`), normalitzats. */
function companysNets(companys: unknown): string[] {
	const r = normalitzarCompanys(companys);
	return r.ok ? r.companys : [];
}

/**
 * Valida i normalitza; llança el primer `ErrorValidacio`. `companys` només surt al resultat si
 * l'entrada el porta (vegeu `FilaAscensio`: una fila sense la clau no es puja amb companys).
 */
function validarONormalitzar(input: NovaAscensio, avui: DataISO) {
	const [primer] = validarAscensio(input, avui);
	if (primer) throw primer;
	return {
		cimId: input.cimId,
		data: input.data,
		metode: input.metode,
		nota: notaNeta(input.nota),
		...(input.companys !== undefined ? { companys: companysNets(input.companys) } : {})
	};
}

// ---------------------------------------------------------------------------
// Utilitats internes
// ---------------------------------------------------------------------------

/** Ordre de l'historial: data desc, després `createdAt` desc (i `id` per estabilitat). */
function ordenar(
	a: Pick<Ascensio, 'id' | 'data' | 'createdAt'>,
	b: Pick<Ascensio, 'id' | 'data' | 'createdAt'>
): number {
	if (a.data !== b.data) return a.data < b.data ? 1 : -1;
	if (a.createdAt !== b.createdAt) return a.createdAt < b.createdAt ? 1 : -1;
	return a.id < b.id ? 1 : a.id > b.id ? -1 : 0;
}

/** Fila → `Ascensio` (còpia): les files sense `companys` (anteriors a R1) es llegeixen com a `[]`. */
export function ascensioDeFila(f: FilaAscensio): Ascensio {
	return { ...f, companys: f.companys ? [...f.companys] : [] };
}

/** Ascensions vives d'una llista de files, en l'ordre de l'historial. */
export function vivesDeFiles(files: readonly FilaAscensio[]): Ascensio[] {
	return files
		.filter((f) => !f.deletedAt)
		.sort(ordenar)
		.map(ascensioDeFila);
}

function vives(bd: CarnetDb): Promise<Ascensio[]> {
	return bd.ascensions.toArray().then(vivesDeFiles);
}

function encuar(bd: CarnetDb, ascensioId: string, encuaAt: string): Promise<unknown> {
	return bd.outbox.put({ ascensioId, encuaAt, intents: 0 });
}

const copia = ascensioDeFila;

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
		// Una ascensió nova sempre porta la clau (sense companys = `[]`).
		companys: net.companys ?? [],
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
 * Canvis d'una ascensió viva (`actualitzarAscensio`). Com `NovaAscensio`, però `companys: null`
 * vol dir "sense dades de companys": la fila es queda (o torna a quedar) **sense la clau**, com
 * les anteriors a R1. Només ho fa servir el "Desfés" d'una edició (`CanvisDesfer`).
 */
export type CanvisAscensio = Partial<Omit<NovaAscensio, 'companys'>> & {
	companys?: string[] | null;
};

/** Els canvis que tornen una ascensió exactament a l'estat d'abans d'una edició. */
export type CanvisDesfer = Required<Pick<NovaAscensio, 'cimId' | 'data' | 'metode' | 'nota'>> & {
	/** `null` si la fila no tenia la clau `companys` (anterior a R1, encara no baixada). */
	companys: string[] | null;
};

/** Escriu els canvis; retorna la fila desada i els canvis que la tornen a l'estat d'abans. */
async function aplicarCanvis(
	id: string,
	canvis: CanvisAscensio
): Promise<{ desada: Ascensio; desfer: CanvisDesfer }> {
	const bd = obtenirBd();
	return bd.transaction('rw', bd.ascensions, bd.outbox, bd.redireccions, async () => {
		// Un id reassignat o fusionat amb un duplicat (p. ex. la fitxa d'edició era oberta quan la
		// sync l'ha canviat) actua sobre la fila que el representa ara.
		const actual = await filaResolta(bd, id, true);
		if (!actual || actual.deletedAt) throw new ErrorAscensioNoTrobada(id);
		// Companys resultants: `undefined` = la fila es queda sense la clau.
		let companys: string[] | undefined;
		if (canvis.companys === null) companys = undefined;
		else if (canvis.companys === undefined) companys = actual.companys;
		else companys = canvis.companys;
		const combinat: NovaAscensio = {
			cimId: canvis.cimId !== undefined ? canvis.cimId : actual.cimId,
			data: canvis.data !== undefined ? canvis.data : actual.data,
			metode: canvis.metode !== undefined ? canvis.metode : actual.metode,
			nota: canvis.nota !== undefined ? (canvis.nota ?? '') : (actual.nota ?? undefined),
			companys
		};
		const net = validarONormalitzar(combinat, avuiLocal(ara()));
		const fila: FilaAscensio = {
			...actual,
			...net,
			updatedAt: instantEscriptura(actual.updatedAt)
		};
		// Una fila sense la clau (anterior a R1, potser amb companys al núvol que encara no han
		// baixat) que acaba sense companys continua sense la clau: el push no porta `companys` i
		// `sync_push` conserva els del núvol. Un formulari que no en mostra cap (n'envia `[]`)
		// no ha d'esborrar el que no ha vist. Amb `null`, la clau es treu.
		if (companys === undefined || (actual.companys === undefined && fila.companys?.length === 0))
			delete fila.companys;
		await bd.ascensions.put(fila);
		await encuar(bd, fila.id, fila.updatedAt);
		return {
			desada: copia(fila),
			desfer: {
				cimId: actual.cimId,
				data: actual.data,
				metode: actual.metode,
				nota: actual.nota ?? '',
				companys: actual.companys ? [...actual.companys] : null
			}
		};
	});
}

/**
 * Modifica una ascensió viva. Valida el resultat complet. `nota: ''` esborra la nota;
 * `nota: undefined` (o absent) la deixa igual. `companys: []` treu els companys;
 * `companys: undefined` (o absent) els deixa igual; `companys: null` treu la clau.
 * Excepció: una fila **sense la clau** `companys` (anterior a R1) que queda sense companys
 * (`[]`) continua sense la clau, perquè la sync no esborri els que tingui al núvol.
 * Un id reassignat (`id en ús`) o fusionat amb un duplicat actua sobre la fila que el representa
 * ara (`local/redireccions.ts`); la fila retornada porta l'id nou.
 * @throws ErrorValidacio, ErrorAscensioNoTrobada
 */
export async function actualitzarAscensio(id: string, canvis: CanvisAscensio): Promise<Ascensio> {
	return (await aplicarCanvis(id, canvis)).desada;
}

/**
 * Com `actualitzarAscensio`, però també retorna els canvis que la tornen exactament a l'estat
 * d'abans (`desfer`, llegit a la mateixa transacció), per al "Desfés" de la UI: si la fila no
 * tenia la clau `companys`, `desfer.companys` és `null` i desfer la torna a deixar sense.
 * @throws ErrorValidacio, ErrorAscensioNoTrobada
 */
export async function actualitzarAscensioAmbDesfer(
	id: string,
	canvis: CanvisAscensio
): Promise<{ desada: Ascensio; desfer: CanvisDesfer }> {
	return aplicarCanvis(id, canvis);
}

let temporitzadorPurga: ReturnType<typeof setTimeout> | null = null;

/**
 * Programa una purga de làpides (`purgarLapides`) per quan s'acabi la finestra de desfer de
 * l'esborrat que s'acaba de fer (un sol temporitzador: si se'n programa un altre, el substitueix
 * i la purga d'aquell també buida les anteriors). Així la làpida es buida encara que la app
 * quedi oberta sense sessió; si es tanca abans, ho fa la propera obertura de la BD.
 */
function programarPurga(): void {
	if (typeof setTimeout === 'undefined' || !indexedDbDisponible()) return;
	if (temporitzadorPurga) clearTimeout(temporitzadorPurga);
	const t = setTimeout(() => {
		temporitzadorPurga = null;
		purgarLapides(obtenirBd()).catch(() => {
			// Es tornarà a provar en obrir la BD o a la sync.
		});
	}, FINESTRA_DESFER_MS + 1_000);
	// A Node (tests) no ha de mantenir viu el procés.
	(t as { unref?: () => void }).unref?.();
	temporitzadorPurga = t;
}

/**
 * Esborra una ascensió deixant-ne la làpida (`deletedAt`), per poder-la desfer
 * (`restaurarAscensio`) i sincronitzar. Idempotent si ja estava esborrada. La làpida conserva la
 * nota i els companys durant la finestra de desfer (`FINESTRA_DESFER_MS`); després es buida.
 * @throws ErrorAscensioNoTrobada si l'id no existeix.
 */
export async function esborrarAscensio(id: string): Promise<void> {
	const bd = obtenirBd();
	const esborrada = await bd.transaction(
		'rw',
		bd.ascensions,
		bd.outbox,
		bd.redireccions,
		async () => {
			// Id reassignat, o duplicat fusionat (làpida amb redirecció): s'esborra la fila que el
			// representa ara.
			const actual = await filaResolta(bd, id, true);
			if (!actual) throw new ErrorAscensioNoTrobada(id);
			if (actual.deletedAt) return false;
			const ts = instantEscriptura(actual.updatedAt);
			await bd.ascensions.put({ ...actual, deletedAt: ts, updatedAt: ts });
			await encuar(bd, actual.id, ts);
			return true;
		}
	);
	if (esborrada) programarPurga();
}

/**
 * Desfà un esborrat (botó "Desfés"). Idempotent si ja estava viva.
 * - Dins de la finestra de desfer (`FINESTRA_DESFER_MS` des de `deletedAt`): torna l'ascensió
 *   sencera, amb la nota i els companys.
 * - Fora de la finestra (p. ex. un toast pausat més de 10 min): la torna **sense nota ni
 *   companys**, tant si la purga ja ha passat com si no (el resultat no depèn de quan s'hagi
 *   executat la purga).
 * @throws ErrorAscensioNoTrobada si l'id no existeix.
 */
export async function restaurarAscensio(id: string): Promise<Ascensio> {
	const bd = obtenirBd();
	return bd.transaction('rw', bd.ascensions, bd.outbox, bd.redireccions, async () => {
		// Només se segueix la redirecció si l'id ja no existeix (p. ex. reassignat mentre el toast
		// de "Desfés" era obert); una làpida existent és la que l'usuari vol desfer.
		const actual = await filaResolta(bd, id, false);
		if (!actual) throw new ErrorAscensioNoTrobada(id);
		if (!actual.deletedAt) return copia(actual);
		const fila: FilaAscensio = {
			...(foraDeFinestra(actual) ? senseDiari(actual) : actual),
			deletedAt: null,
			updatedAt: instantEscriptura(actual.updatedAt)
		};
		await bd.ascensions.put(fila);
		await encuar(bd, fila.id, fila.updatedAt);
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
/**
 * Versió del format d'exportació. La importació accepta totes les versions fins a aquesta.
 * - 1: ascensions (cim, data, mètode, nota).
 * - 2 (bloc R1): `companys` a cada ascensió i `preferencies.origen` (municipi d'origen).
 */
export const VERSIO_EXPORTACIO = 2;
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
	/** Des de la versió 2. Absent (fitxers de la versió 1) = el fitxer no en diu res. */
	companys?: string[];
	createdAt: string;
	updatedAt: string;
}

/** Municipi d'origen dins d'una exportació (versió 2). */
export interface OrigenExportat {
	/** `Municipi.codi`, o `null` si l'usuari el va treure. */
	codi: string | null;
	/** Només informatiu (no s'importa): nom del municipi. */
	nom?: string;
	updatedAt: string;
}

export interface Exportacio {
	format: typeof FORMAT_EXPORTACIO;
	versio: number;
	app: 'carnetdecims.cat';
	exportatAt: string;
	catalegVersio: string;
	avis: string;
	/** Des de la versió 2. `origen: null` = sense municipi d'origen. */
	preferencies?: { origen: OrigenExportat | null };
	total: number;
	ascensions: AscensioExportada[];
}

/** Nom del municipi per a l'exportació (informatiu). Si el conjunt no es pot carregar, res. */
export async function nomMunicipi(codi: string | null): Promise<string | undefined> {
	if (!codi) return undefined;
	try {
		const { carregarMunicipis } = await import('./municipis');
		return (await carregarMunicipis()).find((m) => m.codi === codi)?.nom;
	} catch {
		return undefined;
	}
}

/**
 * Còpia de seguretat / portabilitat (RGPD): JSON versionat amb metadades, el municipi d'origen
 * i les ascensions vives amb la nota i els companys. Les làpides no hi surten (ni, per tant, la
 * nota i els companys que encara conservin dins de la finestra de desfer).
 */
export async function exportarDades(): Promise<string> {
	const bd = obtenirBd();
	const [llista, pref] = await Promise.all([vives(bd), bd.preferencies.get('origen')]);
	const nomOrigen = await nomMunicipi(pref?.valor ?? null);
	const noms = new Map(CIMS.map((c) => [c.id, c.nom]));
	const exp: Exportacio = {
		format: FORMAT_EXPORTACIO,
		versio: VERSIO_EXPORTACIO,
		app: 'carnetdecims.cat',
		exportatAt: ara().toISOString(),
		catalegVersio: CATALEG_VERSIO,
		avis: 'Còpia personal de Carnet de Cims (web no oficial). No és el registre oficial del repte 100 Cims: la validació la fa la FEEC a través de les entitats.',
		preferencies: {
			origen: pref?.valor ? { codi: pref.valor, nom: nomOrigen, updatedAt: pref.updatedAt } : null
		},
		total: llista.length,
		ascensions: llista.map((a) => ({
			id: a.id,
			cimId: a.cimId,
			cimNom: noms.get(a.cimId),
			data: a.data,
			metode: a.metode,
			nota: a.nota,
			companys: a.companys,
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

/**
 * Converteix una entrada del fitxer en fila viva vàlida, o `null` si s'ha d'ignorar. `companys`
 * només surt a la fila si l'entrada el porta (els fitxers de la versió 1 no en diuen res).
 */
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
		...(o.companys !== undefined ? { companys: companysNets(o.companys) } : {}),
		createdAt,
		updatedAt,
		deletedAt: null
	};
}

/** `fitxer` sense `companys` (versió 1) no en diu res: no compta com a diferència. */
function mateixContingut(local: FilaAscensio, fitxer: FilaAscensio): boolean {
	return (
		local.cimId === fitxer.cimId &&
		local.data === fitxer.data &&
		local.metode === fitxer.metode &&
		local.nota === fitxer.nota &&
		(fitxer.companys === undefined || mateixosCompanys(local.companys, fitxer.companys)) &&
		!local.deletedAt === !fitxer.deletedAt
	);
}

/** Si el fitxer no porta `companys` (versió 1), es conserven els de la fila local. */
function ambCompanysLocals(fitxer: FilaAscensio, local: FilaAscensio): FilaAscensio {
	if (fitxer.companys !== undefined || local.companys === undefined) return fitxer;
	return { ...fitxer, companys: local.companys };
}

/**
 * Municipi d'origen d'un fitxer (versió 2): `undefined` si el fitxer no en porta (versió 1) o
 * no és vàlid; `null` si diu explícitament que no n'hi ha.
 */
function origenImportat(
	preferencies: unknown,
	maxInstant: number
): { codi: string; updatedAt: string } | null | undefined {
	if (typeof preferencies !== 'object' || preferencies === null) return undefined;
	const o = (preferencies as Record<string, unknown>).origen;
	if (o === null) return null;
	if (typeof o !== 'object' || o === undefined) return undefined;
	const { codi, updatedAt } = o as Record<string, unknown>;
	if (codi === null) return null;
	if (!esCodiMunicipi(codi) || !instantValid(updatedAt, maxInstant)) return undefined;
	return { codi, updatedAt: new Date(updatedAt).toISOString() };
}

/**
 * Preferència a escriure en importar, o `null` si no cal tocar-la.
 * - `fusionar`: guanya la més recent (LWW per `updatedAt`, com la sync); un fitxer sense origen
 *   no esborra el local.
 * - `substituir`: el dispositiu queda amb l'origen del fitxer (també si diu que no n'hi ha), amb
 *   un `updatedAt` nou perquè guanyi també a la sync.
 */
function origenAEscriure(
	fitxer: { codi: string; updatedAt: string } | null | undefined,
	local: EntradaPreferencia | undefined,
	mode: 'fusionar' | 'substituir'
): EntradaPreferencia | null {
	if (fitxer === undefined) return null;
	if (mode === 'fusionar') {
		if (fitxer === null || (local && fitxer.updatedAt <= local.updatedAt)) return null;
		return { clau: 'origen', valor: fitxer.codi, updatedAt: fitxer.updatedAt, pendent: 1 };
	}
	const valor = fitxer?.codi ?? null;
	if ((local?.valor ?? null) === valor) return null;
	return { clau: 'origen', valor, updatedAt: instantEscriptura(local?.updatedAt), pendent: 1 };
}

/** Fila amb el contingut fusionat (`domain/duplicats.ts`) i un `updatedAt` nou. */
function ambContingut(
	fila: FilaAscensio,
	contingut: ContingutFusionat,
	updatedAt: string
): FilaAscensio {
	const nova: FilaAscensio = { ...fila, nota: contingut.nota, updatedAt };
	if (contingut.companys === undefined) delete nova.companys;
	else nova.companys = contingut.companys;
	return nova;
}

/** Entrada del fitxer ja preparada per escriure (`prepararFitxer`). */
interface FilaPreparada {
	fila: FilaAscensio;
	/**
	 * L'id és el d'una ascensió local **viva** amb la mateixa clau de duplicat (el fitxer la porta
	 * amb un altre id): es fusiona amb la local en lloc de crear una fila nova.
	 */
	perClau: boolean;
}

/**
 * Prepara les entrades vàlides del fitxer (ja deduplicades per id) abans d'escriure-les:
 * 1. Un id que el dispositiu ja va reassignar (`id en ús`) o fusionar (duplicat) passa a l'id
 *    nou (`local/redireccions.ts`): reimportar el JSON d'un altre compte no torna a crear l'id vell.
 *    Si dues entrades acaben amb el mateix id, es queda la de `updatedAt` més recent.
 * 2. Les entrades que són la mateixa ascensió (`clauDuplicat`: cim, data i mètode) es fusionen en
 *    una de sola (`fusionarContingut`): primer les que ja existeixen en local pel seu id (vives
 *    abans que làpides) i després l'ordre determinista (`ordreGuanyadora`); `updatedAt`, el més
 *    recent del grup. Les altres compten com a ignorades.
 * 3. Si el grup no té cap id local però hi ha una ascensió local viva amb la mateixa clau (que el
 *    fitxer no porta pel seu id), l'entrada pren l'id i el `createdAt` d'aquella local (`perClau`).
 * `fusionades`: ids locals vius del fitxer que s'han fusionat dins d'una altra entrada → id que es
 * queda (amb `substituir` passen a làpida amb una redirecció).
 */
function prepararFitxer(
	files: readonly FilaAscensio[],
	perIdLocal: ReadonlyMap<string, FilaAscensio>,
	redireccions: ReadonlyMap<string, string>
): { files: FilaPreparada[]; fusionades: Map<string, string>; ignorades: number } {
	let ignorades = 0;
	const perId = new Map<string, FilaAscensio>();
	for (const f of files) {
		const id = resoldreId(redireccions, f.id);
		const fila = id === f.id ? f : { ...f, id };
		const previa = perId.get(id);
		if (previa) ignorades++;
		if (!previa || fila.updatedAt > previa.updatedAt) perId.set(id, fila);
	}
	const grups = new Map<string, FilaAscensio[]>();
	for (const f of perId.values()) {
		const clau = clauDuplicat(f);
		const grup = grups.get(clau);
		if (grup) grup.push(f);
		else grups.set(clau, [f]);
	}
	// Ascensions locals vives que el fitxer no porta pel seu id, per clau de duplicat.
	const localsPerClau = new Map<string, FilaAscensio[]>();
	for (const l of perIdLocal.values()) {
		if (l.deletedAt || perId.has(l.id)) continue;
		const clau = clauDuplicat(l);
		const llista = localsPerClau.get(clau);
		if (llista) llista.push(l);
		else localsPerClau.set(clau, [l]);
	}
	const rang = (f: FilaAscensio): number => {
		const local = perIdLocal.get(f.id);
		return local ? (local.deletedAt ? 1 : 0) : 2;
	};
	const preparades: FilaPreparada[] = [];
	const fusionades = new Map<string, string>();
	for (const [clau, grup] of grups) {
		const ordenat =
			grup.length > 1 ? [...grup].sort((a, b) => rang(a) - rang(b) || ordreGuanyadora(a, b)) : grup;
		const [base, ...resta] = ordenat;
		ignorades += resta.length;
		let fila = base;
		if (resta.length) {
			const contingut = fusionarContingut(ordenat, { notaMax: NOTA_MAX });
			let updatedAt = base.updatedAt;
			for (const f of resta) if (f.updatedAt > updatedAt) updatedAt = f.updatedAt;
			fila = ambContingut(base, contingut, updatedAt);
		}
		let perClau = false;
		if (!perIdLocal.has(fila.id)) {
			const local = localsPerClau.get(clau)?.sort(ordreGuanyadora)[0];
			if (local) {
				fila = { ...fila, id: local.id, createdAt: local.createdAt };
				perClau = true;
			}
		}
		for (const f of resta) {
			if (perIdLocal.get(f.id)?.deletedAt === null) fusionades.set(f.id, fila.id);
		}
		preparades.push({ fila, perClau });
	}
	return { files: preparades, fusionades, ignorades };
}

export interface ResultatImportacio {
	afegides: number;
	actualitzades: number;
	ignorades: number;
	/** `true` si la importació ha canviat el municipi d'origen del dispositiu (versió 2). */
	origenImportat?: true;
}

/** Progrés de l'escriptura d'una importació (files escrites / files a escriure). */
export interface ProgresImportacio {
	fetes: number;
	total: number;
}

export interface OpcionsImportacio {
	/**
	 * Es crida en acabar de validar (`fetes: 0`) i després de cada bloc escrit, fins a
	 * `fetes === total`. Síncron; si llança, s'ignora (no avorta la importació).
	 */
	onProgres?: (p: ProgresImportacio) => void;
}

/** Files per bloc de `bulkPut` (una sola transacció; els blocs només serveixen per al progrés). */
const BLOC_IMPORTACIO = 200;

/**
 * Importa un fitxer d'`exportarDades` (versió 1 o 2 del format). Cada entrada es valida amb les
 * mateixes regles que el registre (les no vàlides, les làpides i els ids repetits compten com a
 * `ignorades`). Els fitxers de la versió 1 no porten companys ni municipi d'origen: no toquen
 * els que hi hagi al dispositiu. Amb la versió 2, el municipi d'origen també s'importa
 * (`fusionar`: guanya el més recent; `substituir`: guanya el fitxer).
 * - `fusionar`: afegeix les noves; si l'id ja existeix, guanya la de `updatedAt` més recent
 *   (LWW, com la sync). Reimportar el mateix fitxer no canvia res (idempotent).
 * - `substituir`: el dispositiu queda amb exactament les ascensions del fitxer. Les locals que
 *   no hi són queden com a làpides (per a la sync), ja buides de nota i companys (aquest
 *   esborrat no es pot desfer); les que hi són amb un altre contingut es sobreescriuen.
 *   Reimportar-lo no canvia res.
 * Tot passa en una transacció amb una lectura (`getAll`) i escriptures en bloc (`bulkPut`): o
 * s'aplica sencer o no s'aplica. Només s'escriuen les files que canvien (ascensió + outbox).
 * @throws ErrorImportacio si el fitxer no és vàlid (no s'escriu res).
 */
export async function importarDades(
	json: string,
	mode: 'fusionar' | 'substituir',
	opcions: OpcionsImportacio = {}
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

	const avisar = (p: ProgresImportacio) => {
		try {
			opcions.onProgres?.(p);
		} catch {
			// El progrés és només informatiu.
		}
	};

	const origenFitxer = origenImportat(d.preferencies, maxInstant);

	const bd = obtenirBd();
	const encuaAt = instant.toISOString();
	const taules = [bd.ascensions, bd.outbox, bd.preferencies, bd.redireccions];
	return bd.transaction('rw', taules, async () => {
		let afegides = 0;
		let actualitzades = 0;
		// Una sola lectura per taula (`getAll`) en lloc d'un `get` per id: a WebKit cada petició
		// IndexedDB té un cost fix alt, fins i tot dins d'una transacció (mesurat al bloc 4a).
		const [totes, redireccions] = await Promise.all([
			bd.ascensions.toArray(),
			bd.redireccions.toArray()
		]);
		const perIdLocal = new Map(totes.map((f) => [f.id, f]));
		const preparat = prepararFitxer(
			[...perId.values()],
			perIdLocal,
			new Map(redireccions.map((r) => [r.idVell, r.idNou]))
		);
		ignorades += preparat.ignorades;
		const escriure: FilaAscensio[] = [];
		const cua: EntradaOutbox[] = [];
		const posar = (fila: FilaAscensio, ts: string) => {
			escriure.push(fila);
			cua.push({ ascensioId: fila.id, encuaAt: ts, intents: 0 });
		};
		for (const { fila, perClau } of preparat.files) {
			const local = perIdLocal.get(fila.id);
			if (!local) {
				posar(fila, encuaAt);
				afegides++;
			} else if (perClau && mode === 'fusionar') {
				// La mateixa ascensió amb un altre id (d'un altre dispositiu o compte): es fusiona amb
				// la local, que conserva el seu id (cap id d'un altre compte no arriba al núvol).
				const contingut = fusionarContingut([local, fila], { notaMax: NOTA_MAX });
				if (contingutCanvia(local, contingut)) {
					const nova = ambContingut(local, contingut, instantEscriptura(local.updatedAt));
					posar(nova, nova.updatedAt);
					actualitzades++;
				} else ignorades++;
			} else if (mode === 'fusionar') {
				if (fila.updatedAt > local.updatedAt) {
					posar(ambCompanysLocals(fila, local), encuaAt);
					actualitzades++;
				} else ignorades++;
			} else if (mateixContingut(local, fila)) {
				ignorades++;
			} else {
				// Substituir: guanya el fitxer; `updatedAt` nou perquè guanyi també a la sync.
				const nova = {
					...ambCompanysLocals(fila, local),
					updatedAt: instantEscriptura(local.updatedAt)
				};
				posar(nova, nova.updatedAt);
				actualitzades++;
			}
		}
		const noves: Redireccio[] = [];
		if (mode === 'substituir') {
			const delFitxer = new Set(preparat.files.map((p) => p.fila.id));
			for (const f of totes) {
				if (f.deletedAt || delFitxer.has(f.id)) continue;
				const ts = instantEscriptura(f.updatedAt);
				// No hi ha "Desfés": la làpida neix buida (minimització, vegeu `local/lapides.ts`).
				posar({ ...senseDiari(f), deletedAt: ts, updatedAt: ts }, ts);
				// Duplicat d'una altra entrada del fitxer: l'id vell apunta a la que es queda.
				const idNou = preparat.fusionades.get(f.id);
				if (idNou) noves.push(redireccio(f.id, idNou, 'duplicat'));
			}
		}
		if (noves.length) await bd.redireccions.bulkPut(noves);
		const total = escriure.length;
		avisar({ fetes: 0, total });
		for (let i = 0; i < total; i += BLOC_IMPORTACIO) {
			await bd.ascensions.bulkPut(escriure.slice(i, i + BLOC_IMPORTACIO));
			await bd.outbox.bulkPut(cua.slice(i, i + BLOC_IMPORTACIO));
			avisar({ fetes: Math.min(total, i + BLOC_IMPORTACIO), total });
		}
		const origen = origenAEscriure(origenFitxer, await bd.preferencies.get('origen'), mode);
		if (origen) await bd.preferencies.put(origen);
		return { afegides, actualitzades, ignorades, ...(origen ? { origenImportat: true } : {}) };
	});
}

/**
 * Esborra del dispositiu totes les ascensions (també les làpides), la cua de sync, les
 * metadades de la sync (propietari i cursor), les redireccions d'ids i les preferències (municipi
 * d'origen) (RGPD).
 * Irreversible **en aquest dispositiu**: amb compte, el núvol no es toca i la sync següent hi
 * tornarà a baixar les dades i el municipi d'origen (per esborrar-los del núvol,
 * `esborrarCompte`). Els stores vius emeten `[]` i l'origen queda buit.
 * Una passada de sync en curs no hi pot tornar a escriure (renova `meta.epoca`): no reapareix cap
 * fila ni cursor; amb el cursor esborrat, la sync següent ho baixa tot de nou.
 */
export async function esborrarTot(): Promise<void> {
	const bd = obtenirBd();
	const taules = [bd.ascensions, bd.outbox, bd.meta, bd.preferencies, bd.redireccions];
	await bd.transaction('rw', taules, async () => {
		await bd.ascensions.clear();
		await bd.outbox.clear();
		await bd.meta.clear();
		await bd.preferencies.clear();
		await bd.redireccions.clear();
		// Invalida qualsevol passada de sync en vol: no hi tornarà a escriure (vegeu `sync.ts`).
		await bd.meta.put(novaEpoca());
	});
}

/** Entrades pendents de sincronitzar (per a la sync de la fase 5 i els tests). */
export function pendentsDeSincronitzar() {
	return obtenirBd().outbox.orderBy('encuaAt').toArray();
}
