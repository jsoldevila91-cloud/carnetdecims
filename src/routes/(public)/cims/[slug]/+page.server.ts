import { cimPerSlug } from '$lib/data/catalog';
import {
	contingutFitxa,
	contingutFitxaLocal,
	dificultatFitxa,
	dificultatsRutes
} from '$lib/content/fitxes';
import { fitxaIndexable } from '$lib/seo/indexabilitat';
import { resumDificultat } from '$lib/server/dificultats';
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
	// Dificultat orientativa (fase 6a-bis; no és el MIDE): la de la ruta normal per a la capçalera
	// i la de cada ruta per a la seva targeta (`id` de ruta → dificultat). Calculades aquí perquè
	// el càlcul no vagi al JS del client; només hi van els camps que pinta `DificultatBadge`.
	const normal = complet ? dificultatFitxa(complet) : null;
	const perRuta = complet ? dificultatsRutes(complet) : [];
	const dificultatRutes = Object.fromEntries(
		(complet?.rutes ?? []).flatMap((r, i) => {
			const d = perRuta[i];
			return d ? [[r.id, resumDificultat(d)]] : [];
		})
	);
	return {
		contingut: complet ? contingutFitxaLocal(complet, locale) : null,
		dificultat: normal ? resumDificultat(normal) : null,
		dificultatRutes,
		/** `noindex` si és `false`: catàleg i contingut han de ser `revisat` (docs/02 §4.1). */
		indexable: fitxaIndexable(cim?.estat_revisio, complet?.estat)
	};
};
