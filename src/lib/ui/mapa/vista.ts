/**
 * Càlculs purs del mapa interactiu (bloc 4c), sense DOM ni MapLibre: es poden provar a Node.
 */

/** Radi de l'esfera de Web Mercator (EPSG:3857), en metres. */
const R_MERCATOR = 6378137;

/** Web Mercator (EPSG:3857, metres) → WGS84 `[lon, lat]`. Inversa d'`aWebMercator`. */
export function deWebMercator(x: number, y: number): [number, number] {
	const lon = (x / R_MERCATOR) * (180 / Math.PI);
	const lat = (2 * Math.atan(Math.exp(y / R_MERCATOR)) - Math.PI / 2) * (180 / Math.PI);
	return [lon, lat];
}

/**
 * BBOX EPSG:3857 `[minX, minY, maxX, maxY]` (la de la imatge estàtica) → límits WGS84
 * `[[oest, sud], [est, nord]]` per a `fitBounds`: el mapa interactiu s'obre exactament sobre la
 * mateixa extensió que la imatge que substitueix.
 */
export function limitsDeBbox(
	bbox: readonly [number, number, number, number]
): [[number, number], [number, number]] {
	const [minX, minY, maxX, maxY] = bbox;
	return [deWebMercator(minX, minY), deWebMercator(maxX, maxY)];
}

/** Zoom en obrir un cim concret (`/mapa?cim=…`): per sobre del `clusterMaxZoom` (11). */
export const ZOOM_CIM = 12.5;
/** Zoom en centrar-se en la posició de l'usuari. */
export const ZOOM_JO = 11;

/** Diàmetre (px CSS) del cercle d'un clúster segons quants cims agrupa. */
export function midaCluster(n: number): number {
	if (n < 10) return 34;
	if (n < 50) return 40;
	return 46;
}

/**
 * Nom de la imatge d'un clúster: el número i l'anell fet/pendent depenen de tots dos valors, i
 * la imatge es dibuixa sota demanda (`styleimagemissing`). Format: `cl:{n}:{fets}`.
 */
export function idCluster(n: number, fets: number): string {
	return `cl:${n}:${fets}`;
}

/** Inversa d'`idCluster` (`null` si no és el nom d'un clúster). */
export function llegirIdCluster(id: string): { n: number; fets: number } | null {
	const m = /^cl:(\d+):(\d+)$/.exec(id);
	if (!m) return null;
	const n = Number(m[1]);
	const fets = Math.min(Number(m[2]), n);
	return n > 0 ? { n, fets } : null;
}
