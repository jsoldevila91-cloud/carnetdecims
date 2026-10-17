/**
 * "El teu proper cim" (bloc R2, docs/08 §6): 3 cims **pendents** recomanats amb una puntuació
 * **explicable** (cada punt surt d'un `MotiuRecomanacio` que la UI pot mostrar). Funció pura.
 *
 * Puntuació (suma de motius; més alta = millor):
 * - **Distància** des del municipi d'origen (`origen`): `PUNTS.distanciaMax × (1 − km / km0)`,
 *   0 a partir de `DISTANCIA_ZERO_KM`. Sense origen no es calcula i `senseOrigen` és `true`.
 * - **Dificultat habitual**: la mediana de la dificultat orientativa (ruta normal) dels cims fets
 *   que en tenen (≥ `MIN_CIMS_DIFICULTAT_HABITUAL`). Mateix nivell +20, ±1 +8, més de +1 per sobre
 *   −12. Sense prou dades (o sense la dificultat del cim), no puntua.
 * - **Època** (mes d'`avui`, o de la sortida): de desembre a abril, cim ≥ 2.000 m → −25 (neu
 *   probable); novembre i maig, cim ≥ 2.500 m → −10. De juny a setembre, cim ≥ 2.000 m → +10
 *   (bona època); juliol i agost, cim < 800 m → −5 (calor). De desembre a febrer, cim < 1.200 m → +5.
 * - **Restriccions**: un cim amb una restricció activa (`estatRestriccions`) avui o en algun dia
 *   de `diesSortida` **queda fora** (la FEEC no valida les ascensions en període restringit);
 *   `exclosesPerRestriccio` diu quants.
 * - **Repte a punt**: si el cim faria avançar un repte no completat al qual falten ≤
 *   `FALTEN_REPTE_A_PUNT` i amb ≥ 50 % fet (`ResultatRepte.cimsQueSumen`), +15 (només el repte amb menys falten).
 * - **Meteo** (opcional, `ajustarAmbMeteo`): el frontend demana `/api/meteo` per a les candidates
 *   i pot reordenar: bon temps +10, variable 0, dolent −20.
 *
 * Desempat: puntuació, després menys distància (sense distància, al final), després `id`.
 */
import { distanciaKm, type Punt } from './geo';
import type { NivellDificultat } from './dificultat';
import { esDataIsoValida, estatRestriccions, validarMetode } from './repte';
import type { ResultatRepte } from './reptes';
import type { Ascensio, Cim, DataISO } from './types';

export const N_PROPER_CIM = 3;
export const DISTANCIA_ZERO_KM = 150;
export const MIN_CIMS_DIFICULTAT_HABITUAL = 3;
export const FALTEN_REPTE_A_PUNT = 3;
/** I amb almenys aquesta fracció feta (perquè "a punt" ho sigui de debò). */
export const FRACCIO_MIN_REPTE_A_PUNT = 0.5;
/** Nombre de candidates que convé passar per la meteo abans de quedar-se'n `N_PROPER_CIM`. */
export const N_CANDIDATES_METEO = 6;

export const PUNTS = Object.freeze({
	distanciaMax: 30,
	dificultatIgual: 20,
	dificultatPropera: 8,
	dificultatSuperior: -12,
	neuProbable: -25,
	neuPossible: -10,
	bonaEpoca: 10,
	calor: -5,
	hivernBaix: 5,
	repteAPunt: 15,
	meteoBona: 10,
	meteoDolenta: -20
});

export type ClauMotiu =
	| 'distancia'
	| 'dificultat-habitual'
	| 'dificultat-propera'
	| 'dificultat-superior'
	| 'neu-probable'
	| 'neu-possible'
	| 'bona-epoca'
	| 'calor'
	| 'hivern-baix'
	| 'repte-a-punt'
	| 'meteo-bona'
	| 'meteo-variable'
	| 'meteo-dolenta';

/**
 * Un motiu de la puntuació. Missatge a la UI: `proper_cim_motiu_<clau amb _>` amb els paràmetres
 * que hi hagi (`km`, `nivell`, `repteId`, `falten`).
 */
export interface MotiuRecomanacio {
	clau: ClauMotiu;
	punts: number;
	/** `distancia`: km arrodonits. */
	km?: number;
	/** `dificultat-*`: nivell del cim (1–4). */
	nivell?: NivellDificultat;
	/** `repte-a-punt`: repte i cims que hi falten. */
	repteId?: string;
	falten?: number;
}

export interface RecomanacioCim<C extends Cim = Cim> {
	cim: C;
	puntuacio: number;
	/** De més a menys pes (valor absolut dels punts). */
	motius: MotiuRecomanacio[];
	distanciaKm: number | null;
}

/** El mínim d'un dia de previsió (`DiaMeteo` de `$lib/platform/meteo` ho compleix). */
export interface DiaMeteoMinim {
	data: DataISO;
	precipitacio: number;
	probPrecipitacio: number | null;
	ratxaMax: number;
	/** Codi WMO. */
	codi: number;
}

export type EstatMeteo = 'bona' | 'variable' | 'dolenta';

export interface EntradaProperCim<C extends Cim = Cim> {
	ascensions: readonly (Pick<Ascensio, 'cimId' | 'data' | 'metode'> & {
		deletedAt?: string | null;
	})[];
	cataleg: readonly C[] | ReadonlyMap<number, C>;
	avui: DataISO;
	/** Punt del municipi d'origen (preferències, R1). */
	origen?: Punt | null;
	/** Dificultat orientativa de la ruta normal de cada cim (de les fitxes); opcional. */
	dificultats?: ReadonlyMap<number, NivellDificultat>;
	/** Reptes avaluats (`avaluarReptes`) per al bonus "repte a punt"; opcional. */
	reptes?: readonly ResultatRepte[];
	/** Dies de la sortida (p. ex. el cap de setmana): restriccions i època; per defecte, `avui`. */
	diesSortida?: readonly DataISO[];
	/** Quantes recomanacions (per defecte `N_PROPER_CIM`). */
	n?: number;
}

export interface ResultatProperCim<C extends Cim = Cim> {
	recomanacions: RecomanacioCim<C>[];
	/** No hi ha origen: no s'ha fet servir la distància (la UI ho indica i convida a posar-lo). */
	senseOrigen: boolean;
	/** Mediana de dificultat dels cims fets; `null` si no hi ha prou dades. */
	dificultatHabitual: NivellDificultat | null;
	/** Cims pendents descartats per restricció activa. */
	exclosesPerRestriccio: number;
	/** Cims pendents considerats (abans de restriccions). */
	pendents: number;
}

function llista<C extends Cim>(c: readonly C[] | ReadonlyMap<number, C>): readonly C[] {
	return c instanceof Map ? [...c.values()] : (c as readonly C[]);
}

/** Mediana (baixa) de nivells; `null` si n'hi ha menys de `MIN_CIMS_DIFICULTAT_HABITUAL`. */
export function dificultatHabitual(nivells: readonly NivellDificultat[]): NivellDificultat | null {
	if (nivells.length < MIN_CIMS_DIFICULTAT_HABITUAL) return null;
	const o = [...nivells].sort((a, b) => a - b);
	return o[Math.floor((o.length - 1) / 2)];
}

/** Motius d'època per a un cim en un mes (1–12). */
export function motiusEpoca(altitud: number, mes: number): MotiuRecomanacio[] {
	const m: MotiuRecomanacio[] = [];
	const hivern = mes === 12 || mes <= 2;
	if ((hivern || mes === 3 || mes === 4) && altitud >= 2000) {
		m.push({ clau: 'neu-probable', punts: PUNTS.neuProbable });
	} else if ((mes === 11 || mes === 5) && altitud >= 2500) {
		m.push({ clau: 'neu-possible', punts: PUNTS.neuPossible });
	}
	if (mes >= 6 && mes <= 9 && altitud >= 2000)
		m.push({ clau: 'bona-epoca', punts: PUNTS.bonaEpoca });
	if ((mes === 7 || mes === 8) && altitud < 800) m.push({ clau: 'calor', punts: PUNTS.calor });
	if (hivern && altitud < 1200) m.push({ clau: 'hivern-baix', punts: PUNTS.hivernBaix });
	return m;
}

function ordenarMotius(m: MotiuRecomanacio[]): MotiuRecomanacio[] {
	return m.sort((a, b) => Math.abs(b.punts) - Math.abs(a.punts));
}

function compara<C extends Cim>(a: RecomanacioCim<C>, b: RecomanacioCim<C>): number {
	if (a.puntuacio !== b.puntuacio) return b.puntuacio - a.puntuacio;
	const da = a.distanciaKm ?? Number.POSITIVE_INFINITY;
	const db = b.distanciaKm ?? Number.POSITIVE_INFINITY;
	if (da !== db) return da - db;
	return a.cim.id - b.cim.id;
}

/**
 * Totes les candidates pendents puntuades i ordenades (sense tallar). `properCim` en dona les
 * `n` primeres; el frontend pot passar-ne `N_CANDIDATES_METEO` per la meteo.
 */
export function puntuarPendents<C extends Cim>(
	e: EntradaProperCim<C>
): Omit<ResultatProperCim<C>, 'recomanacions'> & { candidates: RecomanacioCim<C>[] } {
	if (!esDataIsoValida(e.avui)) throw new RangeError(`avui invàlid: ${String(e.avui)}`);
	const dies = e.diesSortida && e.diesSortida.length > 0 ? e.diesSortida : [e.avui];
	for (const d of dies) if (!esDataIsoValida(d)) throw new RangeError(`dia invàlid: ${d}`);
	const cims = llista(e.cataleg);
	const ids = new Set(cims.map((c) => c.id));
	const fets = new Set(
		e.ascensions
			.filter(
				(a) =>
					!a.deletedAt &&
					esDataIsoValida(a.data) &&
					a.data <= e.avui &&
					validarMetode(a.metode) &&
					ids.has(a.cimId)
			)
			.map((a) => a.cimId)
	);

	const nivellsFets: NivellDificultat[] = [];
	for (const id of fets) {
		const n = e.dificultats?.get(id);
		if (n !== undefined) nivellsFets.push(n);
	}
	const habitual = dificultatHabitual(nivellsFets);
	const origen = e.origen ?? null;
	const mes = Number(dies[0].slice(5, 7));

	// Repte a punt: per a cada cim, el repte no completat amb menys falten.
	const aPunt = new Map<number, { repteId: string; falten: number }>();
	for (const r of e.reptes ?? []) {
		if (r.completat) continue;
		const falten = r.objectiu - r.fets;
		if (falten <= 0 || falten > FALTEN_REPTE_A_PUNT || r.fraccio < FRACCIO_MIN_REPTE_A_PUNT)
			continue;
		for (const id of r.cimsQueSumen) {
			const actual = aPunt.get(id);
			if (!actual || falten < actual.falten) aPunt.set(id, { repteId: r.id, falten });
		}
	}

	const pendents = cims.filter((c) => !fets.has(c.id));
	let excloses = 0;
	const candidates: RecomanacioCim<C>[] = [];
	for (const cim of pendents) {
		if (dies.some((d) => estatRestriccions(cim, d).actives.length > 0)) {
			excloses++;
			continue;
		}
		const motius: MotiuRecomanacio[] = [];
		let km: number | null = null;
		if (origen && cim.lat !== null && cim.lon !== null) {
			km = distanciaKm(origen, { lat: cim.lat, lon: cim.lon });
			const p = Math.round(PUNTS.distanciaMax * Math.max(0, 1 - km / DISTANCIA_ZERO_KM));
			motius.push({ clau: 'distancia', punts: p, km: Math.round(km) });
		}
		const nivell = e.dificultats?.get(cim.id);
		if (habitual !== null && nivell !== undefined) {
			const dif = nivell - habitual;
			if (dif === 0)
				motius.push({ clau: 'dificultat-habitual', punts: PUNTS.dificultatIgual, nivell });
			else if (Math.abs(dif) === 1)
				motius.push({ clau: 'dificultat-propera', punts: PUNTS.dificultatPropera, nivell });
			else if (dif > 1)
				motius.push({ clau: 'dificultat-superior', punts: PUNTS.dificultatSuperior, nivell });
		}
		motius.push(...motiusEpoca(cim.altitud, mes));
		const r = aPunt.get(cim.id);
		if (r) motius.push({ clau: 'repte-a-punt', punts: PUNTS.repteAPunt, ...r });
		candidates.push({
			cim,
			puntuacio: motius.reduce((s, m) => s + m.punts, 0),
			motius: ordenarMotius(motius),
			distanciaKm: km
		});
	}
	candidates.sort(compara);
	return {
		candidates,
		senseOrigen: origen === null,
		dificultatHabitual: habitual,
		exclosesPerRestriccio: excloses,
		pendents: pendents.length
	};
}

/** Els `n` (per defecte 3) cims pendents recomanats. Catàleg buit o tot fet → llista buida. */
export function properCim<C extends Cim>(e: EntradaProperCim<C>): ResultatProperCim<C> {
	const { candidates, ...resta } = puntuarPendents(e);
	return { ...resta, recomanacions: candidates.slice(0, Math.max(0, e.n ?? N_PROPER_CIM)) };
}

/**
 * Estat del temps d'una previsió per als dies de la sortida (el pitjor dia compta):
 * dolenta = tempesta (WMO ≥ 95), neu (71–77, 85–86), pluja ≥ 5 mm o ratxa ≥ 70 km/h;
 * variable = pluja ≥ 1 mm, probabilitat ≥ 50 % o ratxa ≥ 50 km/h; si no, bona.
 * Sense cap dia de la sortida a la previsió → `null`.
 */
export function estatMeteo(
	dies: readonly DiaMeteoMinim[],
	sortida: readonly DataISO[]
): EstatMeteo | null {
	const triats = dies.filter((d) => sortida.includes(d.data));
	if (triats.length === 0) return null;
	let pitjor: EstatMeteo = 'bona';
	for (const d of triats) {
		const neu = (d.codi >= 71 && d.codi <= 77) || d.codi === 85 || d.codi === 86;
		if (d.codi >= 95 || neu || d.precipitacio >= 5 || d.ratxaMax >= 70) return 'dolenta';
		if (d.precipitacio >= 1 || (d.probPrecipitacio ?? 0) >= 50 || d.ratxaMax >= 50)
			pitjor = 'variable';
	}
	return pitjor;
}

/**
 * Reordena recomanacions amb la meteo (el frontend la demana per a les candidates): afegeix el
 * motiu `meteo-*`, recalcula la puntuació i reordena. Les que no tenen previsió queden igual.
 * Retorna les `n` primeres (per defecte totes).
 */
export function ajustarAmbMeteo<C extends Cim>(
	recomanacions: readonly RecomanacioCim<C>[],
	meteo: ReadonlyMap<number, readonly DiaMeteoMinim[]>,
	sortida: readonly DataISO[],
	n?: number
): RecomanacioCim<C>[] {
	const punts: Record<EstatMeteo, number> = {
		bona: PUNTS.meteoBona,
		variable: 0,
		dolenta: PUNTS.meteoDolenta
	};
	const ajustades = recomanacions.map((r) => {
		const previsio = meteo.get(r.cim.id);
		const estat = previsio ? estatMeteo(previsio, sortida) : null;
		if (estat === null) return r;
		const motius = r.motius.filter((m) => !m.clau.startsWith('meteo-'));
		motius.push({ clau: `meteo-${estat}` as ClauMotiu, punts: punts[estat] });
		return {
			...r,
			motius: ordenarMotius(motius),
			puntuacio: motius.reduce((s, m) => s + m.punts, 0)
		};
	});
	ajustades.sort(compara);
	return n === undefined ? ajustades : ajustades.slice(0, Math.max(0, n));
}
