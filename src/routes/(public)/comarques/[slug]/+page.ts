import { error } from '@sveltejs/kit';
import { distanciaKm, type CimCataleg, type ComarcaCataleg } from '$lib/domain';
import { cimsPerComarca, comarcaPerSlug, comarquesAmbCims } from '$lib/data/catalog';
import type { PageLoad } from './$types';

// Pàgina estàtica (SSG). Les URL localitzades (/ca/comarques/…, /es/comarcas/…) s'afegeixen a
// `prerender.entries` a vite.config.ts amb `comarcaEntries()` (vegeu la fitxa de cim).
export const prerender = true;

/** Nombre de comarques properes enllaçades al peu de la pàgina. */
const N_PROPERES = 4;

type Punt = { lat: number; lon: number };
const punts = (cims: readonly CimCataleg[]): Punt[] =>
	cims.flatMap((c) => (c.lat !== null && c.lon !== null ? [{ lat: c.lat, lon: c.lon }] : []));

/**
 * Comarques properes: les `n` amb el cim més proper a algun cim d'aquesta comarca. No hi ha dades
 * de límits, per això no es diuen "veïnes": és una aproximació per proximitat dels cims.
 */
function comarquesProperes(comarca: ComarcaCataleg, cims: readonly CimCataleg[], n: number) {
	const meus = punts(cims);
	if (meus.length === 0) return [];
	return comarquesAmbCims()
		.filter((c) => c.slug !== comarca.slug)
		.map((c) => {
			const seus = punts(cimsPerComarca(c.slug));
			const km = Math.min(...seus.flatMap((a) => meus.map((b) => distanciaKm(a, b))));
			return { comarca: c, km };
		})
		.filter((p) => Number.isFinite(p.km))
		.sort((a, b) => a.km - b.km)
		.slice(0, n)
		.map((p) => p.comarca);
}

export const load: PageLoad = ({ params, data }) => {
	const comarca = comarcaPerSlug(params.slug);
	if (!comarca) error(404, 'Not found');
	const cims = cimsPerComarca(comarca.slug);
	if (cims.length === 0) error(404, 'Not found');

	// `dificultats` (mapa lleuger de dificultat orientativa): `+page.server.ts`.
	return { ...data, comarca, cims, properes: comarquesProperes(comarca, cims, N_PROPERES) };
};
