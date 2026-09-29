/**
 * Lògica pura de la UI de registre i progrés (bloc 4a): cerca de cims al selector, avisos no
 * bloquejants del formulari, marcador del carnet i agrupació de l'historial. Sense DOM ni Dexie.
 */
import {
	NIVELL_MAXIM,
	OBJECTIU_REPTE,
	anyDe,
	ascensionsEnRestriccio,
	esDataIsoValida,
	excesAnual,
	primeresAscensions,
	type Ascensio,
	type Cataleg,
	type CimCataleg,
	type DataISO,
	type EstatRepte,
	type Nivell
} from '$lib/domain';
import { normalitzar } from './filtre-cims';

// ---------------------------------------------------------------------------
// Cerca de cims (selector del formulari)
// ---------------------------------------------------------------------------

/** Màxim de resultats que es mostren al selector (la resta: "continua escrivint"). */
export const MAX_RESULTATS_CERCA = 30;

const collator = new Intl.Collator('ca');

/**
 * Cims que coincideixen amb la consulta (sense accents, apòstrofs ni majúscules; nom, àlies,
 * nom oficial, topònim o comarca). Ordre: primer els que el nom comença per la consulta, després
 * els que alguna paraula d'un nom hi comença, i la resta; dins de cada grup, alfabètic.
 * `textos` = text de cerca precalculat per id (`textCerca`).
 */
export function cercarCims(
	consulta: string,
	cims: readonly CimCataleg[],
	textos: ReadonlyMap<number, string>
): CimCataleg[] {
	const q = normalitzar(consulta);
	if (!q) return [];
	const paraules = q.split(' ');
	const puntuats: { cim: CimCataleg; punts: number }[] = [];
	for (const cim of cims) {
		const text = textos.get(cim.id) ?? '';
		if (!paraules.every((p) => text.includes(p))) continue;
		const nom = normalitzar(cim.nom);
		let punts = 2;
		if (nom.startsWith(q)) punts = 0;
		else if (` ${text}`.includes(` ${paraules[0]}`)) punts = 1;
		puntuats.push({ cim, punts });
	}
	return puntuats
		.sort((a, b) => a.punts - b.punts || collator.compare(a.cim.nom, b.cim.nom))
		.map((p) => p.cim);
}

// ---------------------------------------------------------------------------
// Avisos no bloquejants del formulari
// ---------------------------------------------------------------------------

export type AvisRegistre =
	| { tipus: 'restriccio'; incerta: boolean }
	| { tipus: 'repeticio'; dataAnterior: DataISO }
	| { tipus: 'limit-anual'; any: number; cimsNoves: number };

type AscensioAvis = Pick<Ascensio, 'id' | 'cimId' | 'data'> & { deletedAt?: string | null };

/**
 * Avisos per a l'ascensió que s'està escrivint (cap bloqueja el registre):
 * - `restriccio`: la data cau dins d'una restricció d'accés del cim (la FEEC no la valida).
 * - `repeticio`: ja hi ha una altra ascensió al mateix cim (no suma per al repte).
 * - `limit-anual`: amb aquesta, l'any natural passa de 100 cims nous.
 * `excloureId` = l'ascensió que s'edita (no compta com a repetició de si mateixa).
 */
export function avisosRegistre(
	nova: { cimId: number | null; data: string },
	existents: readonly AscensioAvis[],
	cataleg: Cataleg,
	opcions: { excloureId?: string; limitAnual?: number } = {}
): AvisRegistre[] {
	if (nova.cimId === null) return [];
	const dataValida = esDataIsoValida(nova.data);
	const altres = existents.filter((a) => !a.deletedAt && a.id !== opcions.excloureId);
	const avisos: AvisRegistre[] = [];

	if (dataValida) {
		const [restriccio] = ascensionsEnRestriccio([{ cimId: nova.cimId, data: nova.data }], cataleg);
		if (restriccio) avisos.push({ tipus: 'restriccio', incerta: restriccio.incerta });
	}

	const mateixCim = altres.filter((a) => a.cimId === nova.cimId).map((a) => a.data);
	if (mateixCim.length > 0) {
		avisos.push({ tipus: 'repeticio', dataAnterior: mateixCim.sort()[0] });
	}

	if (dataValida) {
		const llista = [...altres, { cimId: nova.cimId, data: nova.data }];
		// Només si aquesta és la primera ascensió del cim (una repetició no és un cim nou).
		if (primeresAscensions(llista).get(nova.cimId) === nova.data) {
			const any = anyDe(nova.data);
			const exces = excesAnual(
				llista,
				opcions.limitAnual !== undefined ? { limitAnual: opcions.limitAnual } : {}
			).find((e) => e.any === any);
			if (exces) avisos.push({ tipus: 'limit-anual', any, cimsNoves: exces.cimsNoves });
		}
	}
	return avisos;
}

// ---------------------------------------------------------------------------
// Marcador del carnet (n/100, pàgina i nivell)
// ---------------------------------------------------------------------------

export interface MarcadorRepte {
	/** Nivell assolit (0 = encara sense el primer 100). */
	nivell: Nivell;
	/** Cims que compten: per al 100 (nivell 0) o per als nivells (a partir de l'1). */
	comptador: number;
	/** Objectiu de la pàgina actual: 100, 200… 500. */
	objectiu: number;
	/** Pàgina del carnet que s'està omplint (1–5). */
	pagina: number;
	/** Segells dins de la pàgina actual (0–100), per a la regla. */
	dinsPagina: number;
	/** Segells que falten per tancar la pàgina (0 amb el 5×100). */
	falten: number;
}

/**
 * Marcador del carnet a partir de l'estat del repte. Fins al primer 100 compta la regla
 * d'essencials (`progres100`); després, els cims dels nivells (`nivell.comptador`).
 */
export function marcadorRepte(
	estat: Pick<EstatRepte<never>, 'progres100' | 'nivell'>
): MarcadorRepte {
	const n = estat.nivell.nivell;
	if (n === 0) {
		const comptador = estat.progres100.comptador;
		return {
			nivell: 0,
			comptador,
			objectiu: OBJECTIU_REPTE,
			pagina: 1,
			dinsPagina: Math.min(OBJECTIU_REPTE, comptador),
			falten: Math.max(0, OBJECTIU_REPTE - comptador)
		};
	}
	const comptador = estat.nivell.comptador;
	if (n >= NIVELL_MAXIM) {
		return {
			nivell: n,
			comptador,
			objectiu: NIVELL_MAXIM * OBJECTIU_REPTE,
			pagina: NIVELL_MAXIM,
			dinsPagina: OBJECTIU_REPTE,
			falten: 0
		};
	}
	const objectiu = (n + 1) * OBJECTIU_REPTE;
	return {
		nivell: n,
		comptador,
		objectiu,
		pagina: n + 1,
		dinsPagina: Math.max(0, Math.min(OBJECTIU_REPTE, comptador - n * OBJECTIU_REPTE)),
		falten: Math.max(0, objectiu - comptador)
	};
}

// ---------------------------------------------------------------------------
// Historial
// ---------------------------------------------------------------------------

/** Ascensions agrupades per any natural (desc); dins de cada any, l'ordre d'entrada. */
export function agruparPerAny<T extends Pick<Ascensio, 'data'>>(
	ascensions: readonly T[]
): { any: number; ascensions: T[] }[] {
	const grups = new Map<number, T[]>();
	for (const a of ascensions) {
		const any = anyDe(a.data);
		const grup = grups.get(any);
		if (grup) grup.push(a);
		else grups.set(any, [a]);
	}
	return [...grups]
		.sort((a, b) => b[0] - a[0])
		.map(([any, llista]) => ({ any, ascensions: llista }));
}

/**
 * Ids de les ascensions que són repeticions (no la primera del cim; a igual data, la creada
 * abans és la primera).
 */
export function idsRepeticions(
	ascensions: readonly Pick<Ascensio, 'id' | 'cimId' | 'data' | 'createdAt'>[]
): Set<string> {
	const primera = new Map<number, Pick<Ascensio, 'id' | 'data' | 'createdAt'>>();
	for (const a of ascensions) {
		const p = primera.get(a.cimId);
		if (!p || a.data < p.data || (a.data === p.data && a.createdAt < p.createdAt)) {
			primera.set(a.cimId, a);
		}
	}
	const primeresIds = new Set([...primera.values()].map((a) => a.id));
	return new Set(ascensions.filter((a) => !primeresIds.has(a.id)).map((a) => a.id));
}
