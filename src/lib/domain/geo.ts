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
