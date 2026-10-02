/**
 * "Cims a prop" (bloc 4c): cims ordenats per distància a una posició, amb el rumb i l'estat de
 * l'usuari. Funcions pures (sense xarxa ni geolocalització: la posició la dona `platform/`).
 */
import { ascensionsValides, avuiLocal } from './repte';
import type { AscensioSimple } from './carnet';
import { distanciaKm, type Punt } from './geo';
import type { Cim, DataISO } from './types';

/** Estat d'un cim per a l'usuari: `fet` = amb alguna ascensió que compta per al repte. */
export type EstatCim = 'fet' | 'pendent';

/** Estat de cada cim (`cimId` → estat). Un cim absent del mapa es considera `pendent`. */
export type EstatsCims = ReadonlyMap<number, EstatCim>;

/**
 * Estat de tots els cims del catàleg a partir de les ascensions de l'usuari: `fet` si en té
 * alguna de vàlida (sense tombstone, data i mètode vàlids: `ascensionsValides`), si no `pendent`.
 */
export function estatCims(
	ascensions: readonly AscensioSimple[],
	cataleg: readonly Cim[],
	avui: DataISO = avuiLocal()
): Map<number, EstatCim> {
	const fets = new Set(ascensionsValides(ascensions, cataleg, avui).map((a) => a.cimId));
	return new Map(cataleg.map((c) => [c.id, fets.has(c.id) ? 'fet' : 'pendent']));
}

/** Estat d'un cim (absent = `pendent`). */
export function estatDe(estat: EstatsCims | undefined, cimId: number): EstatCim {
	return estat?.get(cimId) === 'fet' ? 'fet' : 'pendent';
}

/** Rosa dels vents de 8 punts (abreviatures iguals en català i castellà: O = oest/oeste). */
export const RUMBS = ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO'] as const;
export type Rumb = (typeof RUMBS)[number];

/** Azimut inicial (graus 0–360, 0 = nord, sentit horari) del camí de gran cercle de `a` a `b`. */
export function azimut(a: Punt, b: Punt): number {
	const rad = Math.PI / 180;
	const f1 = a.lat * rad;
	const f2 = b.lat * rad;
	const dl = (b.lon - a.lon) * rad;
	const y = Math.sin(dl) * Math.cos(f2);
	const x = Math.cos(f1) * Math.sin(f2) - Math.sin(f1) * Math.cos(f2) * Math.cos(dl);
	return (((Math.atan2(y, x) / rad) % 360) + 360) % 360;
}

/** Rumb de 8 punts d'un azimut (sectors de 45° centrats: N = [337,5°, 22,5°)). */
export function rumbDe(graus: number): Rumb {
	const g = ((graus % 360) + 360) % 360;
	return RUMBS[Math.round(g / 45) % 8];
}

export interface OpcionsAProp {
	/** Nombre màxim de resultats (per defecte 10; `Infinity` = tots). */
	n?: number;
	/** Distància màxima en km (inclosa; per defecte sense límit). */
	radiKm?: number;
	/** Només els cims pendents (per defecte `false`). */
	nomesPendents?: boolean;
}

export interface CimAProp<C extends Cim = Cim> {
	cim: C;
	/** Distància de gran cercle (Haversine), en km. */
	distanciaKm: number;
	/** Direcció des de la posició cap al cim. */
	rumb: Rumb;
	/** Azimut en graus (0 = nord), per si la UI vol dibuixar una fletxa. */
	azimut: number;
	estat: EstatCim;
}

export const N_A_PROP_PER_DEFECTE = 10;

function esPosicioValida(p: Punt): boolean {
	return (
		Number.isFinite(p.lat) &&
		Number.isFinite(p.lon) &&
		Math.abs(p.lat) <= 90 &&
		Math.abs(p.lon) <= 180
	);
}

/**
 * Cims més propers a `posicio`, ordenats per distància (empat: per id). Els cims sense
 * coordenades s'ignoren. Retorna el tipus de cim rebut (p. ex. `CimCataleg`).
 * @throws RangeError si la posició o les opcions no són vàlides.
 */
export function cimsAProp<C extends Cim>(
	posicio: Punt,
	cims: readonly C[],
	estat?: EstatsCims,
	opcions: OpcionsAProp = {}
): CimAProp<C>[] {
	if (!esPosicioValida(posicio))
		throw new RangeError(`Posició invàlida: ${posicio.lat}, ${posicio.lon}`);
	const n = opcions.n ?? N_A_PROP_PER_DEFECTE;
	if (!(n === Infinity || (Number.isInteger(n) && n >= 0))) throw new RangeError(`n invàlid: ${n}`);
	const radiKm = opcions.radiKm ?? Infinity;
	if (Number.isNaN(radiKm) || radiKm < 0) throw new RangeError(`radiKm invàlid: ${radiKm}`);

	const resultat: CimAProp<C>[] = [];
	for (const cim of cims) {
		if (cim.lat === null || cim.lon === null) continue;
		const e = estatDe(estat, cim.id);
		if (opcions.nomesPendents && e !== 'pendent') continue;
		const desti = { lat: cim.lat, lon: cim.lon };
		const d = distanciaKm(posicio, desti);
		if (d > radiKm) continue;
		const graus = azimut(posicio, desti);
		resultat.push({ cim, distanciaKm: d, rumb: rumbDe(graus), azimut: graus, estat: e });
	}
	resultat.sort((a, b) => a.distanciaKm - b.distanciaKm || a.cim.id - b.cim.id);
	return n === Infinity ? resultat : resultat.slice(0, n);
}
