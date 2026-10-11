/**
 * Estadístiques personals (bloc R1) com a funcions pures sobre `repte.ts` i `carnet.ts`.
 * Tot es calcula al client a partir de les ascensions i del catàleg; no es desa res.
 *
 * **Què compta.** Totes les estadístiques parteixen de les ascensions **vàlides**
 * (`ascensionsValides`: sense làpida, data entre el 2006-07-01 i avui, mètode admès i cim del
 * catàleg). Les ascensions "fora del repte" (les que l'historial marca així: anteriors a l'inici,
 * futures…) **no compten enlloc**, igual que a `repte.ts` i `carnet.ts`; `totals.foraRepte` diu
 * quantes n'hi ha. En canvi, les no essencials posteriors al 01/07/2019 (que el carnet té "en
 * espera" fins al 100) **sí que compten**: les estadístiques són una vista de l'historial, com
 * `progresComarques`, i no apliquen la regla d'essencials. L'única excepció és el progrés del
 * repte 100 Cims (`percentatges.reptes`), que és el mateix que mostra el carnet.
 *
 * **Cims diferents o ascensions.** Cada dada ho indica:
 * - per **ascensions** (les repeticions sumen): `rankingCims[].ascensions`, `cimMesFet`,
 *   `totals.ascensions`, `totals.perMetode`, `altitudAcumuladaAscensions`, `perAny[].ascensions`,
 *   `primeraAscensio`, `ultimaAscensio` i la ratxa de mesos (`ratxa`);
 * - per **cims diferents**: `totals.cimsDiferents`, els percentatges (catàleg, essencials,
 *   comarques, reptes), `altitudAcumulada`, `cimMesAlt`, `cimMesLlunya`, `ultimCimNou`,
 *   `perAny[].cimsNous` i `millorAny` (cims nous = primera ascensió del cim, com `excesAnual`).
 *
 * **Desempats** (deterministes): vegeu cada funció.
 *
 * **Reptes.** A R1 només n'hi ha dos (`REPTE_CENT_CIMS` i `REPTE_INFANTIL`). El motor genèric de
 * reptes és de R2: `ProgresRepteResum` ja té la forma que retornarà (`id` de text, nivells), de
 * manera que R2 només hi haurà d'afegir entrades.
 */
import { progresComarques, type AscensioCarnet, type ProgresComarca } from './carnet';
import { distanciaKm, type Punt } from './geo';
import {
	NIVELL_MAXIM,
	OBJECTIU_REPTE,
	OPCIONS_PER_DEFECTE,
	anyDe,
	avuiLocal,
	calcularEstatRepte,
	esDataIsoValida,
	type EstatRepte,
	type OpcionsRepte
} from './repte';
import { METODES, type Cim, type DataISO, type Metode } from './types';

// ---------------------------------------------------------------------------
// Tipus
// ---------------------------------------------------------------------------

/** El que les estadístiques necessiten d'una ascensió (`Ascensio` ho compleix). */
export type AscensioEstadistica = AscensioCarnet;

/** Catàleg com a llista o mapa, conservant el tipus de cim rebut (p. ex. `CimCataleg`). */
export type CatalegDe<C extends Cim> = readonly C[] | ReadonlyMap<number, C>;

/** Mes de calendari `YYYY-MM`. */
export type MesISO = string;

export interface OpcionsEstadistiques extends Partial<OpcionsRepte> {
	/** Data d'avui (`YYYY-MM-DD`); per defecte `avuiLocal()`. */
	avui?: DataISO;
	/** Punt d'origen (el cap del municipi de l'usuari); sense, `cimMesLlunya` és `null`. */
	origen?: Punt | null;
}

/** Ascensions d'un cim. */
export interface RecompteCim<C extends Cim = Cim> {
	cim: C;
	/** Nombre d'ascensions vàlides al cim (les repeticions sumen; dues el mateix dia són dues). */
	ascensions: number;
	/** Data de la primera i de l'última ascensió vàlida. */
	primera: DataISO;
	ultima: DataISO;
}

export interface CimLlunya<C extends Cim = Cim> {
	cim: C;
	/** Distància de gran cercle (`distanciaKm`) de l'origen al cim, en km. */
	distanciaKm: number;
}

/** Una ascensió concreta que marca una fita (primera, última…). */
export interface FitaAscensio<C extends Cim = Cim> {
	cim: C;
	data: DataISO;
	ascensioId: string;
}

export interface Proporcio {
	fets: number;
	total: number;
	/** `fets / total` en [0, 1] (0 si `total` és 0); el format (%) el decideix la UI. */
	fraccio: number;
}

export const REPTE_CENT_CIMS = 'cent-cims';
export const REPTE_INFANTIL = 'infantil';

/** Progrés d'un repte. A R2 el motor de reptes en retornarà més amb aquesta mateixa forma. */
export interface ProgresRepteResum {
	/** Identificador estable del repte (`REPTE_CENT_CIMS`, `REPTE_INFANTIL`; més a R2). */
	id: string;
	/** Cims que compten per a l'objectiu actual. */
	fets: number;
	/**
	 * Objectiu actual. 100 Cims: el de la pàgina del carnet que s'omple (100, 200 … 500), com
	 * `resumCarnet().objectiuActual`. Infantil: 50.
	 */
	objectiu: number;
	/** `min(1, fets / objectiu)`. */
	fraccio: number;
	/** Nivells assolits (100 Cims: 0–5; infantil: 0–1). */
	nivell: number;
	nivellMaxim: number;
	/** Data en què es va assolir cada nivell (buit si encara cap). */
	assoliments: { nivell: number; data: DataISO }[];
}

export interface Percentatges {
	/** Cims diferents fets sobre tot el catàleg. */
	cataleg: Proporcio;
	/** Essencials diferents fetes sobre les essencials del catàleg. */
	essencials: Proporcio;
	/** Progrés de cada comarca (`progresComarques`: mateix càlcul i mateix ordre). */
	comarques: ProgresComarca[];
	/** Comarques amb algun cim fet sobre les comarques amb cims al catàleg. */
	comarquesAmbCims: Proporcio;
	/** Comarques amb tots els cims del catàleg fets. */
	comarquesCompletes: number;
	/** Progrés dels reptes que existeixen (R1: 100 Cims i Repte infantil, en aquest ordre). */
	reptes: ProgresRepteResum[];
}

export interface ResumAny {
	any: number;
	/** Ascensions vàlides de l'any (amb repeticions). */
	ascensions: number;
	/** Cims nous de l'any: cims la **primera** ascensió dels quals és d'aquell any. */
	cimsNous: number;
}

export interface Ratxa {
	/** Mesos de calendari seguits amb alguna ascensió (0 = cap ratxa). */
	mesos: number;
	inici: MesISO | null;
	fi: MesISO | null;
}

export interface RatxaMesos {
	/**
	 * Ratxa viva: acaba el mes d'`avui` o, si aquest mes encara no hi ha cap ascensió, el mes
	 * anterior (el mes en curs no ha acabat, així que encara no l'ha trencada). Si tampoc n'hi ha
	 * el mes anterior, 0.
	 */
	actual: Ratxa;
	/** La ratxa més llarga de l'historial (empat: la més recent). */
	maxima: Ratxa;
	/** El mes d'`avui` ja té alguna ascensió. */
	mesActualFet: boolean;
}

export interface Totals {
	/** Ascensions vàlides (amb repeticions). */
	ascensions: number;
	/** Cims diferents amb alguna ascensió vàlida. */
	cimsDiferents: number;
	/** `ascensions - cimsDiferents`. */
	repeticions: number;
	/** Ascensions vives que no compten (fora del repte): no entren en cap estadística. */
	foraRepte: number;
	/** Ascensions vàlides per mètode. */
	perMetode: Record<Metode, number>;
}

export interface Estadistiques<C extends Cim = Cim> {
	totals: Totals;
	/** Tots els cims fets, del més repetit al menys (vegeu `rankingCims`). */
	rankingCims: RecompteCim<C>[];
	/** "El cim que més has fet": el primer del rànquing si té 2 ascensions o més; si no, `null`. */
	cimMesFet: RecompteCim<C> | null;
	/** "El cim més llunyà" des de l'origen; `null` sense origen o sense cims amb coordenades. */
	cimMesLlunya: CimLlunya<C> | null;
	percentatges: Percentatges;
	/** Suma de les altituds (m) dels cims **diferents** fets. No és desnivell. */
	altitudAcumulada: number;
	/** Suma de les altituds (m) de totes les ascensions (cada repetició torna a sumar). */
	altitudAcumuladaAscensions: number;
	/** El cim més alt fet, amb la seva primera ascensió. */
	cimMesAlt: FitaAscensio<C> | null;
	/** Primera i última ascensió de l'historial (l'última pot ser una repetició). */
	primeraAscensio: FitaAscensio<C> | null;
	ultimaAscensio: FitaAscensio<C> | null;
	/** L'últim cim nou: la primera ascensió més recent d'un cim (l'últim segell de l'historial). */
	ultimCimNou: FitaAscensio<C> | null;
	/** Resum de cada any amb ascensions, del més antic al més nou. */
	perAny: ResumAny[];
	/** L'any amb més cims nous (vegeu `millorAny`). */
	millorAny: ResumAny | null;
	ratxa: RatxaMesos;
}

// ---------------------------------------------------------------------------
// Utilitats internes
// ---------------------------------------------------------------------------

function aMapa<C extends Cim>(cataleg: CatalegDe<C>): ReadonlyMap<number, C> {
	if (cataleg instanceof Map) return cataleg;
	return new Map((cataleg as readonly C[]).map((c) => [c.id, c]));
}

/** Ordre cronològic d'ascensions: data, després `createdAt` i `id` (com el carnet). */
function compara(a: AscensioEstadistica, b: AscensioEstadistica): number {
	if (a.data !== b.data) return a.data < b.data ? -1 : 1;
	if (a.createdAt !== b.createdAt) return a.createdAt < b.createdAt ? -1 : 1;
	return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
}

function proporcio(fets: number, total: number): Proporcio {
	return { fets, total, fraccio: total > 0 ? fets / total : 0 };
}

function avuiDe(opcions: { avui?: DataISO }): DataISO {
	const avui = opcions.avui ?? avuiLocal();
	if (!esDataIsoValida(avui)) throw new RangeError(`avui invàlid: ${String(avui)}`);
	return avui;
}

function valides<T extends AscensioEstadistica, C extends Cim>(
	ascensions: readonly T[],
	cataleg: CatalegDe<C>,
	avui: DataISO
): T[] {
	return calcularEstatRepte(ascensions, cataleg, avui).valides;
}

/** Índex de mes (anys × 12 + mes − 1) d'una data o d'un mes ISO. */
const indexMes = (data: string): number =>
	Number(data.slice(0, 4)) * 12 + Number(data.slice(5, 7)) - 1;

const mesIso = (index: number): MesISO =>
	`${String(Math.floor(index / 12)).padStart(4, '0')}-${String((index % 12) + 1).padStart(2, '0')}`;

// ---------------------------------------------------------------------------
// Rànquing de cims i "el cim que més has fet"
// ---------------------------------------------------------------------------

/** Rànquing a partir d'ascensions ja vàlides. */
function rankingDeValides<C extends Cim>(
	ascensions: readonly AscensioEstadistica[],
	cims: ReadonlyMap<number, C>
): RecompteCim<C>[] {
	const perCim = new Map<number, RecompteCim<C>>();
	for (const a of ascensions) {
		const cim = cims.get(a.cimId);
		if (!cim) continue;
		const r = perCim.get(a.cimId);
		if (!r) perCim.set(a.cimId, { cim, ascensions: 1, primera: a.data, ultima: a.data });
		else {
			r.ascensions++;
			if (a.data < r.primera) r.primera = a.data;
			if (a.data > r.ultima) r.ultima = a.data;
		}
	}
	return [...perCim.values()].sort(
		(a, b) =>
			b.ascensions - a.ascensions ||
			(a.ultima < b.ultima ? 1 : a.ultima > b.ultima ? -1 : 0) ||
			(a.primera < b.primera ? -1 : a.primera > b.primera ? 1 : 0) ||
			a.cim.id - b.cim.id
	);
}

/**
 * Comptador d'ascensions per cim i rànquing personal (compta **ascensions** vàlides).
 * Ordre: més ascensions primer; empat, el que s'ha fet més recentment (data de l'última
 * ascensió); després, el que es va fer abans per primera vegada; finalment, per `id` del cim.
 */
export function rankingCims<C extends Cim>(
	ascensions: readonly AscensioEstadistica[],
	cataleg: CatalegDe<C>,
	opcions: { avui?: DataISO } = {}
): RecompteCim<C>[] {
	return rankingDeValides(valides(ascensions, cataleg, avuiDe(opcions)), aMapa(cataleg));
}

/** Ascensions mínimes perquè un cim sigui "el que més has fet" (amb 1, no n'hi ha cap). */
export const MIN_ASCENSIONS_CIM_MES_FET = 2;

/**
 * "El cim que més has fet": el primer del rànquing (`rankingCims`, amb els seus desempats) si
 * s'hi ha pujat almenys `MIN_ASCENSIONS_CIM_MES_FET` vegades. Si tots els cims s'han fet un sol
 * cop, no n'hi ha cap que s'hagi fet "més": `null`.
 */
export function cimMesFet<C extends Cim>(
	ranking: readonly RecompteCim<C>[]
): RecompteCim<C> | null {
	const primer = ranking[0];
	return primer && primer.ascensions >= MIN_ASCENSIONS_CIM_MES_FET ? primer : null;
}

// ---------------------------------------------------------------------------
// "El cim més llunyà"
// ---------------------------------------------------------------------------

function esPunt(p: Punt | null | undefined): p is Punt {
	return (
		!!p &&
		Number.isFinite(p.lat) &&
		Number.isFinite(p.lon) &&
		Math.abs(p.lat) <= 90 &&
		Math.abs(p.lon) <= 180
	);
}

/**
 * El cim fet més lluny de l'origen (distància de gran cercle del municipi al cim, `distanciaKm`;
 * no és distància per carretera). Compta **cims diferents** amb alguna ascensió vàlida i amb
 * coordenades. Empat de distància: el més alt i després per `id`. Sense origen (o amb un origen
 * invàlid) o sense cap cim fet → `null`.
 */
export function cimMesLlunya<C extends Cim>(
	cimsFets: Iterable<C>,
	origen: Punt | null | undefined
): CimLlunya<C> | null {
	if (!esPunt(origen)) return null;
	let millor: CimLlunya<C> | null = null;
	for (const cim of cimsFets) {
		if (cim.lat === null || cim.lon === null) continue;
		const d = distanciaKm(origen, { lat: cim.lat, lon: cim.lon });
		if (
			millor === null ||
			d > millor.distanciaKm ||
			(d === millor.distanciaKm &&
				(cim.altitud > millor.cim.altitud ||
					(cim.altitud === millor.cim.altitud && cim.id < millor.cim.id)))
		) {
			millor = { cim, distanciaKm: d };
		}
	}
	return millor;
}

// ---------------------------------------------------------------------------
// Anys i ratxa de mesos
// ---------------------------------------------------------------------------

/** Resum per any a partir d'ascensions ja vàlides, del més antic al més nou. */
function resumDeValides(ascensions: readonly AscensioEstadistica[]): ResumAny[] {
	const perAny = new Map<number, ResumAny>();
	const de = (any: number): ResumAny => {
		let r = perAny.get(any);
		if (!r) perAny.set(any, (r = { any, ascensions: 0, cimsNous: 0 }));
		return r;
	};
	const primeres = new Map<number, DataISO>();
	for (const a of ascensions) {
		de(anyDe(a.data)).ascensions++;
		const p = primeres.get(a.cimId);
		if (p === undefined || a.data < p) primeres.set(a.cimId, a.data);
	}
	for (const data of primeres.values()) de(anyDe(data)).cimsNous++;
	return [...perAny.values()].sort((a, b) => a.any - b.any);
}

/**
 * "El millor any": el que té més **cims nous** (primeres ascensions; el mateix recompte que
 * l'avís del límit anual, `cimsNovesPerAny`). Empat: el que té més ascensions i, després, el més
 * recent. Sense ascensions → `null`.
 */
export function millorAny(perAny: readonly ResumAny[]): ResumAny | null {
	let millor: ResumAny | null = null;
	for (const r of perAny) {
		if (
			millor === null ||
			r.cimsNous > millor.cimsNous ||
			(r.cimsNous === millor.cimsNous &&
				(r.ascensions > millor.ascensions ||
					(r.ascensions === millor.ascensions && r.any > millor.any)))
		) {
			millor = r;
		}
	}
	return millor;
}

const SENSE_RATXA: Ratxa = Object.freeze({ mesos: 0, inici: null, fi: null });

/**
 * Ratxa de mesos de calendari seguits amb alguna ascensió, a partir de les dates d'ascensions ja
 * vàlides (compta **ascensions**: una repetició també manté la ratxa). Vegeu `RatxaMesos`.
 * @throws RangeError si `avui` no és una data vàlida.
 */
export function ratxaMesos(dates: Iterable<DataISO>, avui: DataISO): RatxaMesos {
	if (!esDataIsoValida(avui)) throw new RangeError(`avui invàlid: ${String(avui)}`);
	const mesos = new Set<number>();
	for (const d of dates) mesos.add(indexMes(d));
	const mesAvui = indexMes(avui);
	const mesActualFet = mesos.has(mesAvui);

	let maxima: Ratxa = SENSE_RATXA;
	const ordenats = [...mesos].sort((a, b) => a - b);
	let inici = 0;
	for (let i = 0; i < ordenats.length; i++) {
		if (i > 0 && ordenats[i] !== ordenats[i - 1] + 1) inici = i;
		const llargada = i - inici + 1;
		// `>=`: en cas d'empat es queda la més recent.
		if (llargada >= maxima.mesos) {
			maxima = { mesos: llargada, inici: mesIso(ordenats[inici]), fi: mesIso(ordenats[i]) };
		}
	}

	let actual: Ratxa = SENSE_RATXA;
	const fi = mesActualFet ? mesAvui : mesos.has(mesAvui - 1) ? mesAvui - 1 : null;
	if (fi !== null) {
		let primer = fi;
		while (mesos.has(primer - 1)) primer--;
		actual = { mesos: fi - primer + 1, inici: mesIso(primer), fi: mesIso(fi) };
	}
	return { actual, maxima, mesActualFet };
}

// ---------------------------------------------------------------------------
// Percentatges
// ---------------------------------------------------------------------------

/** Progrés dels reptes de R1 a partir de l'estat del repte (calculat amb cims diferents). */
function progresReptes(estat: EstatRepte<AscensioEstadistica>): ProgresRepteResum[] {
	// 100 Cims: el mateix marcador que el carnet (`resumCarnet`): fins al 100 compten els cims amb
	// la regla d'essencials; després, els que compten per als nivells.
	const n = estat.nivell.nivell;
	const fets = n === 0 ? estat.progres100.comptador : estat.nivell.comptador;
	const objectiu = Math.min(NIVELL_MAXIM, n + 1) * OBJECTIU_REPTE;
	const inf = estat.infantil;
	return [
		{
			id: REPTE_CENT_CIMS,
			fets,
			objectiu,
			fraccio: Math.min(1, fets / objectiu),
			nivell: n,
			nivellMaxim: NIVELL_MAXIM,
			assoliments: estat.nivell.assoliments.map((a) => ({ nivell: a.nivell, data: a.data }))
		},
		{
			id: REPTE_INFANTIL,
			fets: inf.comptador,
			objectiu: inf.objectiu,
			fraccio: Math.min(1, inf.comptador / inf.objectiu),
			nivell: inf.completat ? 1 : 0,
			nivellMaxim: 1,
			assoliments: inf.dataAssoliment ? [{ nivell: 1, data: inf.dataAssoliment }] : []
		}
	];
}

// ---------------------------------------------------------------------------
// Tot plegat
// ---------------------------------------------------------------------------

/**
 * Totes les estadístiques personals a partir de les ascensions en brut (es filtren amb
 * `ascensionsValides`) i del catàleg. Vegeu la capçalera del fitxer per saber què compta cada
 * dada. `opcions.origen` és el punt del municipi d'origen (un `Municipi` ja ho és).
 *
 * El progrés del repte infantil no filtra per edat (l'app no demana la data de naixement) i,
 * per defecte, només compta les ascensions des del 2026-07-01 (`OpcionsRepte.dataIniciInfantil`).
 */
export function calcularEstadistiques<C extends Cim>(
	ascensions: readonly AscensioEstadistica[],
	cataleg: CatalegDe<C>,
	opcions: OpcionsEstadistiques = {}
): Estadistiques<C> {
	const { avui: avuiOpcio, origen, ...resta } = opcions;
	const avui = avuiDe({ avui: avuiOpcio });
	const cims = aMapa(cataleg);
	// Com el carnet: el progrés del repte sempre compta cims diferents (§3.3.1).
	const o: OpcionsRepte = { ...OPCIONS_PER_DEFECTE, ...resta, comptarRepeticions: false };
	const estat = calcularEstatRepte(ascensions, cataleg, avui, o);
	const bones = [...estat.valides].sort(compara);

	const ranking = rankingDeValides(bones, cims);
	const cimsFets = ranking.map((r) => r.cim);

	const perMetode = Object.fromEntries(METODES.map((m) => [m, 0])) as Record<Metode, number>;
	let altitudAscensions = 0;
	/** Primera ascensió de cada cim (les `bones` van en ordre cronològic). */
	const primeraDe = new Map<number, AscensioEstadistica>();
	for (const a of bones) {
		perMetode[a.metode]++;
		altitudAscensions += cims.get(a.cimId)!.altitud;
		if (!primeraDe.has(a.cimId)) primeraDe.set(a.cimId, a);
	}

	const fita = (a: AscensioEstadistica | undefined): FitaAscensio<C> | null =>
		a ? { cim: cims.get(a.cimId)!, data: a.data, ascensioId: a.id } : null;

	let mesAlt: C | null = null;
	for (const cim of cimsFets) {
		if (mesAlt === null) mesAlt = cim;
		else if (cim.altitud !== mesAlt.altitud) mesAlt = cim.altitud > mesAlt.altitud ? cim : mesAlt;
		else {
			// Empat d'altitud: el que es va fer abans; després, per id.
			const c = compara(primeraDe.get(cim.id)!, primeraDe.get(mesAlt.id)!);
			if (c < 0 || (c === 0 && cim.id < mesAlt.id)) mesAlt = cim;
		}
	}

	let ultimNou: AscensioEstadistica | undefined;
	for (const a of primeraDe.values()) {
		if (!ultimNou || compara(a, ultimNou) > 0) ultimNou = a;
	}

	const totsElsCims = [...cims.values()];
	const comarques = progresComarques(ascensions, cataleg, { avui });
	const perAny = resumDeValides(bones);
	const vives = ascensions.filter((a) => !a.deletedAt).length;

	return {
		totals: {
			ascensions: bones.length,
			cimsDiferents: cimsFets.length,
			repeticions: bones.length - cimsFets.length,
			foraRepte: vives - bones.length,
			perMetode
		},
		rankingCims: ranking,
		cimMesFet: cimMesFet(ranking),
		cimMesLlunya: cimMesLlunya(cimsFets, origen),
		percentatges: {
			cataleg: proporcio(cimsFets.length, totsElsCims.length),
			essencials: proporcio(estat.progres100.essencialsAssolides, estat.progres100.totalEssencials),
			comarques,
			comarquesAmbCims: proporcio(comarques.filter((c) => c.fets > 0).length, comarques.length),
			comarquesCompletes: comarques.filter((c) => c.total > 0 && c.fets === c.total).length,
			reptes: progresReptes(estat)
		},
		altitudAcumulada: cimsFets.reduce((s, c) => s + c.altitud, 0),
		altitudAcumuladaAscensions: altitudAscensions,
		cimMesAlt: mesAlt ? fita(primeraDe.get(mesAlt.id)) : null,
		primeraAscensio: fita(bones[0]),
		ultimaAscensio: fita(bones[bones.length - 1]),
		ultimCimNou: fita(ultimNou),
		perAny,
		millorAny: millorAny(perAny),
		ratxa: ratxaMesos(
			bones.map((a) => a.data),
			avui
		)
	};
}
