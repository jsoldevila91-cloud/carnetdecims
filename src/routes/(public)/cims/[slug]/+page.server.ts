import { cimPerSlug } from '$lib/data/catalog';
import { contingutFitxa, contingutFitxaLocal } from '$lib/content/fitxes';
import { fitxaIndexable } from '$lib/seo/indexabilitat';
import type { PageServerLoad } from './$types';

// Contingut editorial de la fitxa (fase 6). Es carrega al servidor (al prerender) perquè el text
// de totes les fitxes no vagi al JS del client: cada fitxa rep només el seu (`__data.json` i dades
// inline de l'HTML), i **només en l'idioma de la pàgina** (`contingutFitxaLocal`).
export const prerender = true;

export const load: PageServerLoad = ({ params, url }) => {
	const cim = cimPerSlug(params.slug);
	const complet = contingutFitxa(params.slug);
	// `url` és la URL pública (abans del `reroute`): `/ca/cims/…` o `/es/cimas/…`.
	const locale = url.pathname.startsWith('/es/') ? 'es' : 'ca';
	return {
		contingut: complet ? contingutFitxaLocal(complet, locale) : null,
		/** `noindex` si és `false`: catàleg i contingut han de ser `revisat` (docs/02 §4.1). */
		indexable: fitxaIndexable(cim?.estat_revisio, complet?.estat)
	};
};
