/**
 * Textos de la pàgina de comarca (docs/02-arquitectura-seo.md §4.2), generats amb dades:
 * title, meta description, H1 i introducció. Funcions pures.
 */
import type { CimCataleg, ComarcaCataleg } from '$lib/domain';
import { m } from '$lib/paraglide/messages';
import { formatAltitude } from '$lib/ui/format';
import {
	MAX_DESCRIPTION,
	ambAltitud,
	ambMajuscula,
	nomAmbArticle,
	nomAmbDe,
	nomAmbEn,
	primerQueHiCapi
} from './fitxa-cim';

type Locale = 'ca' | 'es';

/** "el Pedraforca (2.506 m)" · "el Tormo (523 m)" (es). */
const cimAmbAltitud = (cim: CimCataleg, locale: Locale) =>
	ambAltitud(nomAmbArticle(cim.nom_amb_article, locale), formatAltitude(cim.altitud));

/**
 * @param cims cims de la comarca, de més alt a més baix (`cimsPerComarca`); almenys un.
 */
export function seoComarca(comarca: ComarcaCataleg, cims: readonly CimCataleg[], locale: Locale) {
	const opts = { locale };
	const comarcaDe = nomAmbDe(comarca.nom_amb_article, locale);
	const lloc = ambMajuscula(nomAmbEn(comarca.nom_amb_article, locale));
	const count = cims.length;
	const essencials = cims.filter((c) => c.essencial).length;
	const totsEssencials = essencials === count;
	const [mesAlt] = cims;
	const mesBaix = cims[cims.length - 1];

	// Amb només essencials (el catàleg actual), el recompte és el d'essencials i així es diu:
	// "6 cims del repte" seria fals (la llista completa del repte en té més).
	const titols =
		count === 1
			? [
					(totsEssencials ? m.comarca_meta_title_one_essential : m.comarca_meta_title_one)(
						{ comarca_de: comarcaDe },
						opts
					)
				]
			: totsEssencials
				? [
						m.comarca_meta_title_essentials({ comarca_de: comarcaDe, count }, opts),
						m.comarca_meta_title_essentials_short({ comarca_de: comarcaDe, count }, opts)
					]
				: [m.comarca_meta_title({ comarca_de: comarcaDe, count }, opts)];
	const title = primerQueHiCapi([
		...titols,
		m.comarca_meta_title_short({ comarca_de: comarcaDe }, opts),
		m.comarca_meta_title_min({ comarca_de: comarcaDe }, opts)
	]);

	let description: string;
	if (count === 1) {
		description = (
			totsEssencials ? m.comarca_meta_description_one_essential : m.comarca_meta_description_one
		)({ cim: ambAltitud(mesAlt.nom, formatAltitude(mesAlt.altitud)), comarca_de: comarcaDe }, opts);
	} else {
		const base = (
			totsEssencials ? m.comarca_meta_description_essentials : m.comarca_meta_description_mixed
		)({ count, comarca_de: comarcaDe }, opts);
		const top = m.comarca_meta_description_top(
			{ cim: ambAltitud(mesAlt.nom, formatAltitude(mesAlt.altitud)) },
			opts
		);
		const opcions = [`${base} ${top}`];
		if (totsEssencials) {
			const curta = m.comarca_meta_description_essentials_short(
				{ count, comarca_de: comarcaDe },
				opts
			);
			opcions.push(`${curta} ${top}`);
		}
		description = primerQueHiCapi([...opcions, base], MAX_DESCRIPTION);
	}

	const h1 = m.comarca_title({ comarca_de: comarcaDe }, opts);

	const intro: string[] = [];
	if (count === 1) {
		intro.push(
			(totsEssencials ? m.comarca_intro_one_essential : m.comarca_intro_one)(
				{ lloc, cim: cimAmbAltitud(mesAlt, locale) },
				opts
			)
		);
	} else {
		intro.push(
			(totsEssencials ? m.comarca_intro_essentials : m.comarca_intro_mixed)({ lloc, count }, opts),
			m.comarca_intro_range(
				{ alt: cimAmbAltitud(mesAlt, locale), baix: cimAmbAltitud(mesBaix, locale) },
				opts
			)
		);
	}
	intro.push(m.comarca_intro_links({}, opts));

	const mapAlt = m.comarca_map_alt({ comarca_de: comarcaDe }, opts);

	return { title, description, h1, intro, mapAlt, comarcaDe, essencials };
}
