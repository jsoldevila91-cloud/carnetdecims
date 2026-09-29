/**
 * Nodes JSON-LD compartits (docs/02-arquitectura-seo.md §5). Les pàgines hi enllacen
 * amb `isPartOf: { '@id': WEBSITE_ID }`. Res no ha de suggerir vincle amb la FEEC.
 */
import type { CimCataleg, ComarcaCataleg } from '../domain/types.ts';
import type { LlistatId } from '../data/catalog/queries.ts';
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
