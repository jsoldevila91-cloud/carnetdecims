import { cimsDelLlistat } from '$lib/data/catalog';
import { contingutFitxa, rutesAmbDificultat, rutesAmbDificultatPerCim } from '$lib/content/fitxes';
import { rutaAmbNens } from '$lib/domain';
import { m } from '$lib/paraglide/messages';
import { llistatIndexable } from '$lib/seo/indexabilitat';
import { nomRutaCurt } from '$lib/seo/fitxa-cim';
import { mapaDificultats, resumDificultat } from '$lib/server/dificultats';
import { formatAltitude, formatDurada } from '$lib/ui/format';
import type { PageServerLoad } from './$types';

// Llistat de dificultat (fase 6a-bis): depèn del contingut editorial de les fitxes, que només es
// llegeix al servidor (prerender). Al client hi arriben només els slugs, el mapa lleuger de
// dificultat i el nom de la ruta per anar-hi amb nens; les dades dels cims surten del catàleg.
export const prerender = true;

/** Número i unitat sempre junts ("300 m", "1 h 30 min"): el salt, si cal, entre les parts. */
const NBSP = String.fromCharCode(0xa0);
const ambEspaisFixos = (text: string) => text.replace(/(\d) /g, `$1${NBSP}`);

export const load: PageServerLoad = ({ url }) => {
	// `url` és la URL pública (abans del `reroute`): `/ca/…` o `/es/…`.
	const locale: 'ca' | 'es' = url.pathname.startsWith('/es/') ? 'es' : 'ca';
	const slugs = cimsDelLlistat('cims-amb-nens', { rutes: rutesAmbDificultatPerCim() }).map(
		(c) => c.slug
	);
	/**
	 * Ruta per anar-hi amb nens de cada cim (la més fàcil que compleix els criteris; pot no ser la
	 * normal), amb la seva dificultat: per dir "des de …" a la llista (`nomCurt`, sense el tram
	 * "per …") i, si tenen font, el desnivell i el temps d'anada (`desnivell` i `temps`, ja com a
	 * text de l'idioma: al client no hi van els camps de la ruta). `dificultats` continua sent la
	 * de la ruta normal (la de la fitxa).
	 */
	const rutesAmbNens = Object.fromEntries(
		slugs.flatMap((slug) => {
			const c = contingutFitxa(slug);
			const triada = c && rutaAmbNens(rutesAmbDificultat(c));
			const r = triada && c.rutes.find((x) => x.id === triada.id);
			if (!c || !triada?.dificultat || !r) return [];
			const opts = { locale };
			return [
				[
					slug,
					{
						id: r.id,
						nom: r.nom[locale],
						nomCurt: nomRutaCurt(r.nom[locale]),
						desnivell:
							r.desnivellPositiuM === undefined
								? null
								: ambEspaisFixos(
										m.kids_route_elevation({ metres: formatAltitude(r.desnivellPositiuM) }, opts)
									),
						temps:
							r.tempsMinuts === undefined
								? null
								: ambEspaisFixos(m.kids_route_time({ temps: formatDurada(r.tempsMinuts) }, opts)),
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
