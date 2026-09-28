/**
 * Nodes JSON-LD compartits (docs/02-arquitectura-seo.md §5). Les pàgines hi enllacen
 * amb `isPartOf: { '@id': WEBSITE_ID }`. Res no ha de suggerir vincle amb la FEEC.
 */
import type { CimCataleg, ComarcaCataleg } from '../domain/types.ts';
import {
	LOCALES,
	SITE_ORIGIN,
	localizeCimPath,
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
 * Fitxa de cim (docs/02-arquitectura-seo.md §5): `Mountain` + `WebPage` + `BreadcrumbList`
 * (Inici › Cims › {nom}). La comarca va com a `AdministrativeArea` sense `url` fins que hi hagi
 * la pàgina de comarca (bloc 3b). No s'hi afirma cap vincle amb la FEEC: el nom oficial de la
 * llista només surt com a `alternateName`, i "essencial" és una `PropertyValue` descriptiva
 * (`essencialLabel`, p. ex. "Cim essencial del repte 100 Cims"), mai un segell oficial.
 */
export function cimGraph(opts: {
	cim: CimCataleg;
	comarca: ComarcaCataleg;
	locale: AppLocale;
	title: string;
	description: string;
	breadcrumbNames: { inici: string; cims: string };
	essencialLabel: string;
}) {
	const { cim, comarca, locale } = opts;
	const pageUrl = SITE_ORIGIN + localizeCimPath(cim.slug, locale);
	const mountainId = `${pageUrl}#cim`;
	const breadcrumbId = `${pageUrl}#breadcrumb`;

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
		containedInPlace: { '@type': 'AdministrativeArea', name: comarca.nom },
		...(cim.essencial && {
			additionalProperty: [{ '@type': 'PropertyValue', name: opts.essencialLabel, value: true }]
		})
	};

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
			{
				'@type': 'BreadcrumbList',
				'@id': breadcrumbId,
				itemListElement: [
					{
						'@type': 'ListItem',
						position: 1,
						name: opts.breadcrumbNames.inici,
						item: SITE_ORIGIN + localizePath('/', locale)
					},
					{
						'@type': 'ListItem',
						position: 2,
						name: opts.breadcrumbNames.cims,
						item: SITE_ORIGIN + localizePath('/cims', locale)
					},
					{ '@type': 'ListItem', position: 3, name: cim.nom }
				]
			}
		]
	};
}
