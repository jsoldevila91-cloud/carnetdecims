import { cimsPerComarca } from '$lib/data/catalog';
import { mapaDificultats } from '$lib/server/dificultats';
import type { PageServerLoad } from './$types';

// Dificultat orientativa dels cims de la comarca amb contingut (mapa lleuger; el contingut no va
// al client). La resta de dades (i el 404) són al `+page.ts`.
export const prerender = true;

export const load: PageServerLoad = ({ params }) => ({
	dificultats: mapaDificultats(cimsPerComarca(params.slug).map((c) => c.slug))
});
