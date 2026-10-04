import { cimsDelLlistat } from '$lib/data/catalog';
import { mapaDificultats } from '$lib/server/dificultats';
import type { PageServerLoad } from './$types';

// Dificultat orientativa dels cims del llistat amb contingut (mapa lleuger; el contingut no va al
// client).
export const prerender = true;

export const load: PageServerLoad = () => ({
	dificultats: mapaDificultats(cimsDelLlistat('mes-alts').map((c) => c.slug))
});
