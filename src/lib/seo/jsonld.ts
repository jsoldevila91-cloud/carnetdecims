/**
 * Nodes JSON-LD compartits (docs/02-arquitectura-seo.md §5). Les pàgines hi enllacen
 * amb `isPartOf: { '@id': WEBSITE_ID }`. Res no ha de suggerir vincle amb la FEEC.
 */
import { LOCALES, SITE_ORIGIN, localizePath, type AppLocale } from '../i18n/routes.ts';

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
