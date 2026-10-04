import { mapaDificultats } from '$lib/server/dificultats';
import type { PageServerLoad } from './$types';

// Dificultat orientativa dels cims amb contingut (mapa lleuger; el contingut no va al client).
export const prerender = true;

export const load: PageServerLoad = () => ({ dificultats: mapaDificultats() });
