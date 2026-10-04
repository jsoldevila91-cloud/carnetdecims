import { cimsDelLlistat } from '$lib/data/catalog';
import { contingutFitxa, rutesAmbDificultat, rutesAmbDificultatPerCim } from '$lib/content/fitxes';
import { rutaAmbNens } from '$lib/domain';
import { llistatIndexable } from '$lib/seo/indexabilitat';
import { mapaDificultats, resumDificultat } from '$lib/server/dificultats';
import type { PageServerLoad } from './$types';

// Llistat de dificultat (fase 6a-bis): depèn del contingut editorial de les fitxes, que només es
// llegeix al servidor (prerender). Al client hi arriben només els slugs, el mapa lleuger de
// dificultat i el nom de la ruta per anar-hi amb nens; les dades dels cims surten del catàleg.
export const prerender = true;

export const load: PageServerLoad = ({ url }) => {
	// `url` és la URL pública (abans del `reroute`): `/ca/…` o `/es/…`.
	const locale = url.pathname.startsWith('/es/') ? 'es' : 'ca';
	const slugs = cimsDelLlistat('cims-amb-nens', { rutes: rutesAmbDificultatPerCim() }).map(
		(c) => c.slug
	);
	/**
	 * Ruta per anar-hi amb nens de cada cim (la més fàcil que compleix els criteris; pot no ser la
	 * normal), amb la seva dificultat: per dir "des de …" a la llista. `dificultats` continua sent
	 * la de la ruta normal (la de la fitxa).
	 */
	const rutesAmbNens = Object.fromEntries(
		slugs.flatMap((slug) => {
			const c = contingutFitxa(slug);
			const triada = c && rutaAmbNens(rutesAmbDificultat(c));
			const r = triada && c.rutes.find((x) => x.id === triada.id);
			if (!c || !triada?.dificultat || !r) return [];
			return [
				[
					slug,
					{
						id: r.id,
						nom: r.nom[locale],
						normal: r.id === c.rutes[0]?.id,
						dificultat: resumDificultat(triada.dificultat)
					}
				]
			];
		})
	);
	return {
		slugs,
		dificultats: mapaDificultats(slugs),
		rutesAmbNens,
		/** Amb menys de 3 cims, contingut prim: `noindex` i fora del sitemap (docs/02 §4.2). */
		indexable: llistatIndexable(slugs.length)
	};
};
