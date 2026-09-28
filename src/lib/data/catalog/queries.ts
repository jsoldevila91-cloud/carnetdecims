/**
 * Consultes síncrones sobre el catàleg estàtic per a la fitxa de cim i la resta de pàgines
 * prerenderitzades. Índexs construïts un sol cop en carregar el mòdul.
 */
import { distanciaKm, type CimCataleg, type ComarcaCataleg } from '$lib/domain';
import { CIMS, COMARQUES } from './cataleg';

const CIMS_PER_SLUG: ReadonlyMap<string, CimCataleg> = new Map(CIMS.map((c) => [c.slug, c]));
const COMARQUES_PER_SLUG: ReadonlyMap<string, ComarcaCataleg> = new Map(
	COMARQUES.map((c) => [c.slug, c])
);

/** Slugs de totes les fitxes de cim (ordre del catàleg). */
export const SLUGS_CIMS: readonly string[] = Object.freeze(CIMS.map((c) => c.slug));

export function cimPerSlug(slug: string): CimCataleg | undefined {
	return CIMS_PER_SLUG.get(slug);
}

export function comarcaPerSlug(slug: string): ComarcaCataleg | undefined {
	return COMARQUES_PER_SLUG.get(slug);
}

/**
 * Els `n` cims més propers (Haversine), sense el mateix cim, del més proper al més llunyà
 * (empat: ordre del catàleg). Els cims sense coordenades no hi entren; si `cim` no en té,
 * retorna `[]`.
 */
export function cimsPropers(cim: CimCataleg, n = 6): { cim: CimCataleg; distanciaKm: number }[] {
	if (cim.lat === null || cim.lon === null || n <= 0) return [];
	const origen = { lat: cim.lat, lon: cim.lon };
	return CIMS.filter((c) => c.id !== cim.id && c.lat !== null && c.lon !== null)
		.map((c) => ({ cim: c, distanciaKm: distanciaKm(origen, { lat: c.lat!, lon: c.lon! }) }))
		.sort((a, b) => a.distanciaKm - b.distanciaKm || a.cim.id - b.cim.id)
		.slice(0, n);
}

/**
 * Fins a `n` cims de la mateixa comarca, sense el mateix cim, de més alt a més baix
 * (empat: ordre del catàleg).
 */
export function cimsMateixaComarca(cim: CimCataleg, n = 3): CimCataleg[] {
	if (n <= 0) return [];
	return CIMS.filter((c) => c.comarca === cim.comarca && c.id !== cim.id)
		.sort((a, b) => b.altitud - a.altitud || a.id - b.id)
		.slice(0, n);
}
