import { cimPerSlug } from '$lib/data/catalog';
import { contingutFitxa } from '$lib/content/fitxes';
import { fitxaIndexable } from '$lib/seo/indexabilitat';
import type { PageServerLoad } from './$types';

// Contingut editorial de la fitxa (fase 6). Es carrega al servidor (al prerender) perquè el text
// de totes les fitxes no vagi al JS del client: cada fitxa rep només el seu (`__data.json`).
export const prerender = true;

export const load: PageServerLoad = ({ params }) => {
	const cim = cimPerSlug(params.slug);
	const contingut = contingutFitxa(params.slug) ?? null;
	return {
		contingut,
		/** `noindex` si és `false`: catàleg i contingut han de ser `revisat` (docs/02 §4.1). */
		indexable: fitxaIndexable(cim?.estat_revisio, contingut?.estat)
	};
};
