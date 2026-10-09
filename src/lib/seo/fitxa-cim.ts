/**
 * Textos derivats per al SEO de la fitxa de cim (docs/02-arquitectura-seo.md §4.1).
 * Funcions pures (els missatges de Paraglide també ho són).
 *
 * Castellà: el topònim conserva l'article català ("a la Pica d'Estats", "de les Garrigues"),
 * excepte l'apòstrof, que no existeix en castellà: els masculins singulars (`el`, `lo` i `l'`
 * davant de masculí) es contrauen o es tradueixen ("al Pedraforca", "del Berguedà",
 * "del Alt Empordà", "en el Berguedà") i `l'` davant de femení passa a `la`
 * ("de la Alta Ribagorça", "en la Anoia").
 */
import { ambA, ambDe, separarArticle, type CimCataleg, type ComarcaCataleg } from '$lib/domain';
import { m } from '$lib/paraglide/messages';
import { formatAltitude, formatDurada, formatKm } from '$lib/ui/format';
// Només el tipus: l'índex de fitxes (`import.meta.glob`) no ha d'entrar al JS del client.
import type { ContingutFitxaLocal, RutaAccesLocal } from '$lib/content/fitxes/local';

type Locale = 'ca' | 'es';

/**
 * Article masculí singular, que en castellà passa a `el`: `el`, `lo` i `l'` davant d'un
 * masculí ("l'Alt Empordà", "l'Urgell", "l'Elefant"). Amb `l'`, el gènere es dedueix de la
 * primera paraula: acabada en -a és femenina ("l'Alta Ribagorça", "l'Anoia").
 */
function esMasculi(article: string, nom: string): boolean {
	if (article === 'el' || article === 'lo') return true;
	return article === "l'" && !/a$/i.test(nom.split(/\s/)[0]);
}

/**
 * Nom amb article en castellà per als casos no masculins: `l'` femení → `la` ("la Alta
 * Ribagorça", "la Anoia"); la resta es conserva ("la Cerdanya", "les Garrigues", "Osona").
 */
function nomAmbArticleFemEs(nomAmbArticle: string, article: string, nom: string): string {
	return article === "l'" ? `la ${nom}` : nomAmbArticle;
}

/** "Com pujar al Pedraforca" · "Cómo subir a la Pica d'Estats". */
export function nomAmbA(nomAmbArticle: string, locale: Locale): string {
	const { article, nom } = separarArticle(nomAmbArticle);
	if (locale === 'ca') return ambA(nom, article);
	return esMasculi(article, nom)
		? `al ${nom}`
		: `a ${nomAmbArticleFemEs(nomAmbArticle, article, nom)}`;
}

/**
 * "del Berguedà", "d'Osona", "de l'Alt Empordà" (ca) · "del Berguedà", "de Osona",
 * "de la Cerdanya", "del Alt Empordà", "de la Alta Ribagorça" (es).
 */
export function nomAmbDe(nomAmbArticle: string, locale: Locale): string {
	const { article, nom } = separarArticle(nomAmbArticle);
	if (locale === 'ca') return ambDe(nom, article);
	return esMasculi(article, nom)
		? `del ${nom}`
		: `de ${nomAmbArticleFemEs(nomAmbArticle, article, nom)}`;
}

/** Lloc: "al Berguedà", "a Andorra" (ca) · "en el Berguedà", "en Andorra" (es). */
export function nomAmbEn(nomAmbArticle: string, locale: Locale): string {
	if (locale === 'ca') return nomAmbA(nomAmbArticle, 'ca');
	const { article, nom } = separarArticle(nomAmbArticle);
	return esMasculi(article, nom)
		? `en el ${nom}`
		: `en ${nomAmbArticleFemEs(nomAmbArticle, article, nom)}`;
}

/**
 * Nom amb article per a una frase: igual en català; en castellà, el masculí singular passa
 * a `el` ("lo Tormo" → "el Tormo", "l'Alt Empordà" → "el Alt Empordà") i `l'` femení, a `la`.
 */
export function nomAmbArticle(nomAmbArticle: string, locale: Locale): string {
	if (locale === 'ca') return nomAmbArticle;
	const { article, nom } = separarArticle(nomAmbArticle);
	return esMasculi(article, nom) ? `el ${nom}` : nomAmbArticleFemEs(nomAmbArticle, article, nom);
}

/** Primera lletra en majúscula ("al Berguedà" → "Al Berguedà"). */
export function ambMajuscula(text: string): string {
	return text.charAt(0).toLocaleUpperCase() + text.slice(1);
}

/**
 * Afegeix l'altitud entre parèntesis. Si el nom ja acaba amb un parèntesi, s'hi fusiona
 * per no encadenar-ne dos: "la Tossa (Tivissa)" → "la Tossa (Tivissa, 718 m)".
 */
export function ambAltitud(text: string, alt: string): string {
	return text.endsWith(')') ? `${text.slice(0, -1)}, ${alt} m)` : `${text} (${alt} m)`;
}

/** Límit del `<title>` (docs/02 §4.1). */
export const MAX_TITLE = 60;
/** Límit de la meta description (docs/02 §4.1). */
export const MAX_DESCRIPTION = 155;

/** Primer text que hi cap; si cap no hi cap, l'últim (el més curt). */
export function primerQueHiCapi(opcions: readonly string[], max = MAX_TITLE): string {
	return opcions.find((t) => t.length <= max) ?? opcions[opcions.length - 1];
}

/** Primera lletra en minúscula ("Des de Gósol…" → "des de Gósol…"). */
function ambMinuscula(text: string): string {
	return text.charAt(0).toLocaleLowerCase() + text.slice(1);
}

/**
 * Dades de la ruta normal per a la description (màxim dues, amb font a la fitxa): desnivell i
 * temps d'anada; la distància només si no hi ha desnivell. "1.100 m de desnivell i 3 h 30 min
 * d'anada" · "10,2 km y 5 h 15 min de ida". Buit si la ruta no té cap dada.
 */
function dadesRuta(ruta: RutaAccesLocal, locale: Locale): string {
	const opts = { locale };
	const parts: string[] = [];
	if (ruta.desnivellPositiuM !== undefined) {
		parts.push(
			m.cim_meta_route_elevation({ metres: formatAltitude(ruta.desnivellPositiuM) }, opts)
		);
	} else if (ruta.distanciaKm !== undefined) {
		parts.push(m.cim_meta_route_distance({ km: formatKm(ruta.distanciaKm, locale) }, opts));
	}
	if (ruta.tempsMinuts !== undefined) {
		parts.push(m.cim_meta_route_time({ temps: formatDurada(ruta.tempsMinuts) }, opts));
	}
	return new Intl.ListFormat(locale, { type: 'conjunction' }).format(parts);
}

/**
 * Nom de la ruta sense el tram "per …" / "por …" ni el que va després d'una coma:
 * "Circular desde el santuario de Montferri por la Torre del Moro" → "Circular desde el
 * santuario de Montferri". Igual que el nom si no hi ha res a escurçar.
 */
export function nomRutaCurt(nom: string): string {
	const tall = /\s+(?:per|pel|pels|por)\s|,\s/.exec(nom);
	return tall && tall.index > 0 ? nom.slice(0, tall.index).trim() : nom;
}

/**
 * Frases de la ruta normal (la primera de `rutes`) per a la description, de la més completa a
 * la més curta: amb nom i dades, només amb el nom, amb el nom curt (`nomRutaCurt`) i dades,
 * només amb el nom curt i només amb les dades. Les fitxes sense xifres amb font (cap desnivell,
 * distància ni temps d'anada) depenen del nom curt quan el nom sencer no hi cap.
 */
function frasesRutaNormal(ruta: RutaAccesLocal | undefined, locale: Locale): string[] {
	if (!ruta) return [];
	const opts = { locale };
	const nom = ambMinuscula(ruta.nom.trim());
	const curt = nomRutaCurt(nom);
	const dades = dadesRuta(ruta, locale);
	const noms = curt === nom ? [nom] : [nom, curt];
	return dades
		? [
				...noms.flatMap((n) => [
					m.cim_meta_route_data({ ruta: n, dades }, opts),
					m.cim_meta_route({ ruta: n }, opts)
				]),
				m.cim_meta_route_data_only({ dades }, opts)
			]
		: noms.map((n) => m.cim_meta_route({ ruta: n }, opts));
}

/**
 * Title, meta description i textos de lloc de la fitxa, en l'idioma indicat.
 * - Title: "Com pujar al Pedraforca (2.506 m) · Berguedà" (≤ 60; sense comarca si no hi cap).
 *   No depèn del contingut: ja respon la consulta principal ("com pujar al [cim]") i el punt de
 *   sortida no hi cabria de manera fiable.
 * - Description: nom, altitud, comarca i si és essencial (única per cim), amb la cua més
 *   llarga que hi càpiga (≤ 155). Amb contingut editorial (fase 6), la cua és la ruta normal
 *   (punt de sortida, desnivell i temps d'anada, només dades amb font) i, si hi cap, el que
 *   ofereix la fitxa; si la ruta no hi cap de cap manera, la cua genèrica.
 */
export function seoFitxaCim(
	cim: CimCataleg,
	comarca: ComarcaCataleg,
	locale: Locale,
	/** Contingut ja projectat a `locale` (`contingutFitxaLocal`). */
	contingut?: Pick<ContingutFitxaLocal, 'rutes'> | null
) {
	const opts = { locale };
	const alt = formatAltitude(cim.altitud);
	const comarcaA = nomAmbEn(comarca.nom_amb_article, locale);
	const comarcaDe = nomAmbDe(comarca.nom_amb_article, locale);

	const nomAAlt = ambAltitud(nomAmbA(cim.nom_amb_article, locale), alt);
	const title = primerQueHiCapi([
		m.cim_meta_title({ nom_a_alt: nomAAlt, comarca: comarca.nom }, opts),
		m.cim_meta_title_short({ nom_a_alt: nomAAlt }, opts)
	]);

	const intro = (cim.essencial ? m.cim_meta_description : m.cim_meta_description_other)(
		{ nom_alt: ambAltitud(cim.nom, alt), comarca_a: comarcaA },
		opts
	);
	const cuaContingut = m.cim_meta_description_tail_content({}, opts);
	const cuesRuta = frasesRutaNormal(contingut?.rutes[0], locale).flatMap((frase) => [
		`${frase} ${cuaContingut}`,
		frase
	]);
	const description = primerQueHiCapi(
		[
			...cuesRuta,
			m.cim_meta_description_tail_long({}, opts),
			m.cim_meta_description_tail({}, opts),
			m.cim_meta_description_tail_short({}, opts)
		].map((cua) => `${intro} ${cua}`),
		MAX_DESCRIPTION
	);

	const mapAlt = m.cim_map_alt(
		{ nom_de_alt: ambAltitud(nomAmbDe(cim.nom_amb_article, locale), alt), comarca_a: comarcaA },
		opts
	);

	return { title, description, mapAlt, comarcaDe };
}
