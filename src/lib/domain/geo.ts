/**
 * Geometria pura sobre coordenades WGS84 (sense dependències).
 */

/** Radi mitjà de la Terra (IUGG), en km. */
export const RADI_TERRA_KM = 6371.0088;

export interface Punt {
	lat: number;
	lon: number;
}

/**
 * Distància de gran cercle (Haversine) entre dos punts WGS84, en km.
 * Error < 0,5 % respecte de l'el·lipsoide: suficient per ordenar cims propers.
 */
export function distanciaKm(a: Punt, b: Punt): number {
	const rad = Math.PI / 180;
	const dLat = (b.lat - a.lat) * rad;
	const dLon = (b.lon - a.lon) * rad;
	const h =
		Math.sin(dLat / 2) ** 2 +
		Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dLon / 2) ** 2;
	return 2 * RADI_TERRA_KM * Math.asin(Math.min(1, Math.sqrt(h)));
}

/** Caixa [oest, sud, est, nord] en graus WGS84. */
export type Bbox = readonly [oest: number, sud: number, est: number, nord: number];

/**
 * Caixa que conté tots els punts amb un marge de `margeKm` a cada costat (el marge en longitud
 * es corregeix per la latitud més allunyada de l'equador). `null` si no hi ha cap punt.
 */
export function bboxPunts(punts: Iterable<Punt>, margeKm = 0): Bbox | null {
	let oest = Infinity;
	let sud = Infinity;
	let est = -Infinity;
	let nord = -Infinity;
	for (const p of punts) {
		oest = Math.min(oest, p.lon);
		est = Math.max(est, p.lon);
		sud = Math.min(sud, p.lat);
		nord = Math.max(nord, p.lat);
	}
	if (oest === Infinity) return null;
	const kmPerGrau = (Math.PI / 180) * RADI_TERRA_KM;
	const dLat = margeKm / kmPerGrau;
	const latMax = Math.min(89, Math.max(Math.abs(sud), Math.abs(nord)) + dLat);
	const dLon = margeKm / (kmPerGrau * Math.cos((latMax * Math.PI) / 180));
	return [oest - dLon, sud - dLat, est + dLon, nord + dLat];
}
