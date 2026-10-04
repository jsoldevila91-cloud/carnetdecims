import { cimsDelLlistat } from '$lib/data/catalog';
import { rutesNormalsAmbDificultat } from '$lib/content/fitxes';
import { llistatIndexable } from '$lib/seo/indexabilitat';
import { mapaDificultats } from '$lib/server/dificultats';
import type { PageServerLoad } from './$types';

// Llistat de dificultat (fase 6a-bis): depèn del contingut editorial de les fitxes, que només es
// llegeix al servidor (prerender). Al client hi arriben només els slugs i el mapa lleuger de
// dificultat; les dades dels cims surten del catàleg.
export const prerender = true;

export const load: PageServerLoad = () => {
	const slugs = cimsDelLlistat('cims-facils', { rutesNormals: rutesNormalsAmbDificultat() }).map(
		(c) => c.slug
	);
	return {
		slugs,
		dificultats: mapaDificultats(slugs),
		/** Amb menys de 3 cims, contingut prim: `noindex` i fora del sitemap (docs/02 §4.2). */
		indexable: llistatIndexable(slugs.length)
	};
};
