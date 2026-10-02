/**
 * Nodes JSON-LD compartits (docs/02-arquitectura-seo.md §5). Les pàgines hi enllacen
 * amb `isPartOf: { '@id': WEBSITE_ID }`. Res no ha de suggerir vincle amb la FEEC.
 */
import type { CimCataleg, ComarcaCataleg } from '../domain/types.ts';
import type { LlistatId } from '../data/catalog/queries.ts';
import { PAGINES_CONTINGUT, type PaginaContingut } from '../content/types.ts';
import { textPla } from '../content/text.ts';
import {
	COMARQUES_PATH,
	LLISTAT_PATHS,
	LOCALES,
	SITE_ORIGIN,
	localizeCimPath,
	localizeComarcaPath,
	localizePath,
	type AppLocale
} from '../i18n/routes.ts';

export const WEBSITE_ID = `${SITE_ORIGIN}/#website`;
export const ORG_ID = `${SITE_ORIGIN}/#org`;

const BRAND = 'Carnet de Cims';

/** Portada: `WebSite` + `Organization` + la `WebPage` de l'idioma actual. */
export function homeGraph(opts: {
	locale: AppLocale;
	title: string;
	description: string;
	orgDescription: string;
}) {
	const pageUrl = SITE_ORIGIN + localizePath('/', opts.locale);
	return {
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'WebSite',
				'@id': WEBSITE_ID,
				url: SITE_ORIGIN + localizePath('/', 'ca'),
				name: BRAND,
				alternateName: 'carnetdecims.cat',
				inLanguage: [...LOCALES],
				publisher: { '@id': ORG_ID }
			},
			{
				'@type': 'Organization',
				'@id': ORG_ID,
				name: BRAND,
				url: SITE_ORIGIN,
				description: opts.orgDescription
				// Pendent: `logo` (PNG ≥ 112×112) i `sameAs` quan hi hagi logo ràster i xarxes.
			},
			{
				'@type': 'WebPage',
				'@id': pageUrl,
				url: pageUrl,
				name: opts.title,
				description: opts.description,
				inLanguage: opts.locale,
				isPartOf: { '@id': WEBSITE_ID },
				about: { '@id': ORG_ID }
			}
		]
	};
}

/**
 * Lloc de la comarca per a JSON-LD. Les comarques catalanes són `AdministrativeArea`; Andorra és
 * un `Country`; la Catalunya Nord és una regió històrica sense entitat administrativa pròpia
 * (`Place`). Porta la `url` localitzada de la pàgina de comarca i un `@id` estable
 * (`{url}#comarca`) que comparteixen la fitxa de cim (`containedInPlace`) i la pàgina de comarca
 * (`about`).
 */
export function comarcaPlace(comarca: ComarcaCataleg, locale: AppLocale) {
	const url = SITE_ORIGIN + localizeComarcaPath(comarca.slug, locale);
	const type =
		comarca.zona === 'andorra'
			? 'Country'
			: comarca.zona === 'catalunya-nord'
				? 'Place'
				: 'AdministrativeArea';
	return { '@type': type, '@id': `${url}#comarca`, name: comarca.nom, url };
}

type Crumb = { name: string; item?: string };

function breadcrumbList(id: string, crumbs: readonly Crumb[]) {
	return {
		'@type': 'BreadcrumbList',
		'@id': id,
		itemListElement: crumbs.map((c, i) => ({
			'@type': 'ListItem',
			position: i + 1,
			name: c.name,
			...(c.item !== undefined && { item: c.item })
		}))
	};
}

/** `ItemList` de fitxes de cim (URL absoluta localitzada + nom visible), en l'ordre donat. */
function itemListCims(cims: readonly Pick<CimCataleg, 'slug' | 'nom'>[], locale: AppLocale) {
	return {
		'@type': 'ItemList',
		numberOfItems: cims.length,
		itemListElement: cims.map((c, i) => ({
			'@type': 'ListItem',
			position: i + 1,
			url: SITE_ORIGIN + localizeCimPath(c.slug, locale),
			name: c.nom
		}))
	};
}

/** `CollectionPage` + `BreadcrumbList` comuns a comarques i llistats. */
function collectionGraph(opts: {
	pageUrl: string;
	locale: AppLocale;
	title: string;
	description: string;
	about?: Record<string, unknown>;
	mainEntity: Record<string, unknown>;
	crumbs: readonly Crumb[];
}) {
	const breadcrumbId = `${opts.pageUrl}#breadcrumb`;
	return {
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'CollectionPage',
				'@id': opts.pageUrl,
				url: opts.pageUrl,
				name: opts.title,
				description: opts.description,
				inLanguage: opts.locale,
				isPartOf: { '@id': WEBSITE_ID },
				...(opts.about && { about: opts.about }),
				mainEntity: opts.mainEntity,
				breadcrumb: { '@id': breadcrumbId }
			},
			breadcrumbList(breadcrumbId, opts.crumbs)
		]
	};
}

/**
 * Noms del breadcrumb de la fitxa. Format actual (docs/02 §4.1 i §5):
 * Inici › Comarques › {comarca} › {cim}. El format antic `{ inici, cims }` (Inici › Cims › {cim})
 * es manté només perquè la ruta de la fitxa compili mentre s'actualitza; està obsolet.
 */
export type CimBreadcrumbNames =
	| { inici: string; comarques: string }
	/** @deprecated Useu `{ inici, comarques }` (breadcrumb per comarca, docs/02 §5). */
	| { inici: string; cims: string };

/**
 * Fitxa de cim (docs/02-arquitectura-seo.md §5): `Mountain` + `WebPage` + `BreadcrumbList`
 * (Inici › Comarques › {comarca} › {nom}). La comarca va com a `containedInPlace` amb la `url`
 * de la seva pàgina (`comarcaPlace`). No s'hi afirma cap vincle amb la FEEC: el nom oficial de la
 * llista només surt com a `alternateName`, i "essencial" és una `PropertyValue` descriptiva
 * (`essencialLabel`, p. ex. "Cim essencial del repte 100 Cims"), mai un segell oficial.
 */
export function cimGraph(opts: {
	cim: CimCataleg;
	comarca: ComarcaCataleg;
	locale: AppLocale;
	title: string;
	description: string;
	breadcrumbNames: CimBreadcrumbNames;
	essencialLabel: string;
}) {
	const { cim, comarca, locale } = opts;
	const pageUrl = SITE_ORIGIN + localizeCimPath(cim.slug, locale);
	const mountainId = `${pageUrl}#cim`;
	const breadcrumbId = `${pageUrl}#breadcrumb`;
	const lloc = comarcaPlace(comarca, locale);

	const alternateName = [...new Set([...cim.alies, cim.nom_oficial])].filter(
		(n) => n.trim() !== '' && n !== cim.nom
	);

	const mountain: Record<string, unknown> = {
		'@type': 'Mountain',
		'@id': mountainId,
		name: cim.nom,
		...(alternateName.length > 0 && { alternateName }),
		...(cim.lat !== null &&
			cim.lon !== null && {
				geo: {
					'@type': 'GeoCoordinates',
					latitude: cim.lat,
					longitude: cim.lon,
					elevation: cim.altitud
				}
			}),
		containedInPlace: lloc,
		...(cim.essencial && {
			additionalProperty: [{ '@type': 'PropertyValue', name: opts.essencialLabel, value: true }]
		})
	};

	const names = opts.breadcrumbNames;
	const inici: Crumb = { name: names.inici, item: SITE_ORIGIN + localizePath('/', locale) };
	const crumbs: Crumb[] =
		'comarques' in names
			? [
					inici,
					{ name: names.comarques, item: SITE_ORIGIN + localizePath(COMARQUES_PATH, locale) },
					{ name: comarca.nom, item: lloc.url },
					{ name: cim.nom }
				]
			: [
					inici,
					{ name: names.cims, item: SITE_ORIGIN + localizePath('/cims', locale) },
					{ name: cim.nom }
				];

	return {
		'@context': 'https://schema.org',
		'@graph': [
			mountain,
			{
				'@type': 'WebPage',
				'@id': pageUrl,
				url: pageUrl,
				name: opts.title,
				description: opts.description,
				inLanguage: locale,
				isPartOf: { '@id': WEBSITE_ID },
				about: { '@id': mountainId },
				breadcrumb: { '@id': breadcrumbId }
			},
			breadcrumbList(breadcrumbId, crumbs)
		]
	};
}

/**
 * Pàgina de comarca (docs/02 §5): `CollectionPage` (sobre la comarca, `comarcaPlace`) amb un
 * `ItemList` de les fitxes de cim en l'ordre de la pàgina + `BreadcrumbList`
 * Inici › Comarques › {comarca}.
 */
export function comarcaGraph(opts: {
	comarca: ComarcaCataleg;
	cims: readonly Pick<CimCataleg, 'slug' | 'nom'>[];
	locale: AppLocale;
	title: string;
	description: string;
	breadcrumbNames: { inici: string; comarques: string };
}) {
	const { comarca, locale } = opts;
	const lloc = comarcaPlace(comarca, locale);
	return collectionGraph({
		pageUrl: lloc.url,
		locale,
		title: opts.title,
		description: opts.description,
		about: lloc,
		mainEntity: itemListCims(opts.cims, locale),
		crumbs: [
			{ name: opts.breadcrumbNames.inici, item: SITE_ORIGIN + localizePath('/', locale) },
			{
				name: opts.breadcrumbNames.comarques,
				item: SITE_ORIGIN + localizePath(COMARQUES_PATH, locale)
			},
			{ name: comarca.nom }
		]
	});
}

/**
 * Índex de comarques (`/comarques`): `CollectionPage` + `ItemList` de les pàgines de comarca
 * (en l'ordre donat, p. ex. `comarquesAmbCims()`) + `BreadcrumbList` Inici › Comarques.
 */
export function comarquesGraph(opts: {
	comarques: readonly ComarcaCataleg[];
	locale: AppLocale;
	title: string;
	description: string;
	breadcrumbNames: { inici: string; comarques: string };
}) {
	const { locale } = opts;
	return collectionGraph({
		pageUrl: SITE_ORIGIN + localizePath(COMARQUES_PATH, locale),
		locale,
		title: opts.title,
		description: opts.description,
		mainEntity: {
			'@type': 'ItemList',
			numberOfItems: opts.comarques.length,
			itemListElement: opts.comarques.map((c, i) => ({
				'@type': 'ListItem',
				position: i + 1,
				url: SITE_ORIGIN + localizeComarcaPath(c.slug, locale),
				name: c.nom
			}))
		},
		crumbs: [
			{ name: opts.breadcrumbNames.inici, item: SITE_ORIGIN + localizePath('/', locale) },
			{ name: opts.breadcrumbNames.comarques }
		]
	});
}

/** Camí intern de cada llistat curat (el mateix que `LLISTATS[id].path`; ho comprova el test). */
export const LLISTAT_PATH: Readonly<Record<LlistatId, (typeof LLISTAT_PATHS)[number]>> = {
	essencials: '/cims-essencials',
	tresmils: '/tresmils',
	'mes-alts': '/cims-mes-alts'
};

/**
 * Llistat curat (`/cims-essencials`, `/tresmils`, `/cims-mes-alts`): `CollectionPage` + `ItemList`
 * de les fitxes (ordre de `cimsDelLlistat`) + `BreadcrumbList` Inici › {llistat}.
 * Els llistats pengen de l'arrel (docs/02 §3.3); `breadcrumbNames.llistat` és el nom curt del
 * llistat al breadcrumb (per defecte, `title`).
 */
export function llistatGraph(opts: {
	id: LlistatId;
	cims: readonly Pick<CimCataleg, 'slug' | 'nom'>[];
	locale: AppLocale;
	title: string;
	description: string;
	breadcrumbNames: { inici: string; llistat?: string };
}) {
	const { locale } = opts;
	const path = Object.hasOwn(LLISTAT_PATH, opts.id) ? LLISTAT_PATH[opts.id] : undefined;
	if (!path) throw new RangeError(`Llistat desconegut: ${opts.id}`);
	return collectionGraph({
		pageUrl: SITE_ORIGIN + localizePath(path, locale),
		locale,
		title: opts.title,
		description: opts.description,
		mainEntity: itemListCims(opts.cims, locale),
		crumbs: [
			{ name: opts.breadcrumbNames.inici, item: SITE_ORIGIN + localizePath('/', locale) },
			{ name: opts.breadcrumbNames.llistat ?? opts.title }
		]
	});
}

/**
 * Llista completa de cims (`/cims`): `CollectionPage` + `ItemList` de les fitxes en l'ordre de la
 * pàgina (agrupades per comarca) + `BreadcrumbList` Inici › {llista}. Els filtres del client no
 * hi compten: l'HTML i el JSON-LD sempre porten la llista sencera.
 */
export function cimsGraph(opts: {
	cims: readonly Pick<CimCataleg, 'slug' | 'nom'>[];
	locale: AppLocale;
	title: string;
	description: string;
	breadcrumbNames: { inici: string; cims: string };
}) {
	const { locale } = opts;
	return collectionGraph({
		pageUrl: SITE_ORIGIN + localizePath('/cims', locale),
		locale,
		title: opts.title,
		description: opts.description,
		mainEntity: itemListCims(opts.cims, locale),
		crumbs: [
			{ name: opts.breadcrumbNames.inici, item: SITE_ORIGIN + localizePath('/', locale) },
			{ name: opts.breadcrumbNames.cims }
		]
	});
}

/**
 * Mapa dels cims (`/mapa`, bloc 4c): `WebPage` amb un `Map` com a `mainEntity`. Sense `ItemList`
 * (la llista sencera de fitxes ja la porta `/cims`; aquí seria duplicada) ni `BreadcrumbList`
 * (la pàgina no mostra breadcrumb: és una secció de primer nivell de la navegació). Els filtres i
 * el cim obert (`?zona=…`, `?cim=…`) no hi compten: el canonical és sempre la URL sense query.
 */
export function mapaGraph(opts: {
	locale: AppLocale;
	title: string;
	description: string;
	/** Nom visible del mapa (l'`h1`). */
	mapName: string;
}) {
	const pageUrl = SITE_ORIGIN + localizePath('/mapa', opts.locale);
	const mapId = `${pageUrl}#mapa`;
	return {
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'WebPage',
				'@id': pageUrl,
				url: pageUrl,
				name: opts.title,
				description: opts.description,
				inLanguage: opts.locale,
				isPartOf: { '@id': WEBSITE_ID },
				mainEntity: { '@id': mapId }
			},
			{
				'@type': 'Map',
				'@id': mapId,
				name: opts.mapName,
				url: pageUrl,
				inLanguage: opts.locale,
				isPartOf: { '@id': pageUrl },
				publisher: { '@id': ORG_ID }
			}
		]
	};
}

/** Camí intern del hub del repte: les subpàgines (`/repte-100-cims/…`) hi pengen al breadcrumb. */
const REPTE_PATH = PAGINES_CONTINGUT.repte;

/** Noms del breadcrumb d'una pàgina de contingut. */
export type PaginaBreadcrumbNames = {
	inici: string;
	/** Nom curt del hub del repte. Obligatori a les subpàgines (`/repte-100-cims/…`). */
	repte?: string;
	/** Nom curt de la pàgina (per defecte, l'`h1`). */
	pagina?: string;
};

/**
 * Pàgina de contingut editorial (`PAGINES_CONTINGUT`): `WebPage` (`AboutPage` per a
 * `/sobre-el-projecte`) amb `dateModified` = `actualitzat` + `BreadcrumbList`
 * (Inici › {pàgina}, o Inici › {repte} › {pàgina} a les subpàgines del hub) i, si la pàgina té
 * preguntes freqüents, un `FAQPage` amb les preguntes i respostes en text pla.
 * @throws RangeError si `path` no és una pàgina de contingut, o si és una subpàgina del hub i
 *   falta `breadcrumbNames.repte`.
 */
export function paginaGraph(opts: {
	pagina: PaginaContingut;
	locale: AppLocale;
	/** Camí intern deslocalitzat (`/repte-100-cims/normativa`). */
	path: string;
	breadcrumbNames: PaginaBreadcrumbNames;
}) {
	const { pagina, locale, path, breadcrumbNames: names } = opts;
	if (!(Object.values(PAGINES_CONTINGUT) as string[]).includes(path)) {
		throw new RangeError(`Pàgina de contingut desconeguda: ${path}`);
	}
	const esSubpaginaRepte = path.startsWith(`${REPTE_PATH}/`);
	if (esSubpaginaRepte && !names.repte) {
		throw new RangeError(`Falta breadcrumbNames.repte per a ${path}`);
	}

	const pageUrl = SITE_ORIGIN + localizePath(path, locale);
	const breadcrumbId = `${pageUrl}#breadcrumb`;
	const faqId = `${pageUrl}#faq`;
	const faq = pagina.faq ?? [];
	const esAbout = path === PAGINES_CONTINGUT.sobreElProjecte;

	const crumbs: Crumb[] = [
		{ name: names.inici, item: SITE_ORIGIN + localizePath('/', locale) },
		...(esSubpaginaRepte
			? [{ name: names.repte!, item: SITE_ORIGIN + localizePath(REPTE_PATH, locale) }]
			: []),
		{ name: names.pagina ?? pagina.h1 }
	];

	const webPage: Record<string, unknown> = {
		'@type': esAbout ? 'AboutPage' : 'WebPage',
		'@id': pageUrl,
		url: pageUrl,
		name: pagina.title,
		description: pagina.description,
		inLanguage: locale,
		isPartOf: { '@id': WEBSITE_ID },
		...(esAbout && { about: { '@id': ORG_ID } }),
		// Textos editorials: qui els publica (el projecte, no la FEEC) i quan es van revisar.
		publisher: { '@id': ORG_ID },
		dateModified: pagina.actualitzat,
		breadcrumb: { '@id': breadcrumbId },
		...(faq.length > 0 && { hasPart: { '@id': faqId } })
	};

	return {
		'@context': 'https://schema.org',
		'@graph': [
			webPage,
			breadcrumbList(breadcrumbId, crumbs),
			...(faq.length > 0
				? [
						{
							'@type': 'FAQPage',
							'@id': faqId,
							url: pageUrl,
							inLanguage: locale,
							isPartOf: { '@id': pageUrl },
							mainEntity: faq.map((q) => ({
								'@type': 'Question',
								name: textPla(q.pregunta),
								acceptedAnswer: { '@type': 'Answer', text: textPla(q.resposta) }
							}))
						}
					]
				: [])
		]
	};
}
