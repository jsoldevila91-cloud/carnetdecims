/**
 * Textos derivats per al SEO de la fitxa de cim (docs/02-arquitectura-seo.md §4.1).
 * Funcions pures: la pàgina hi passa els missatges ja traduïts.
 */
import { ambA, separarArticle } from '$lib/domain';

/**
 * Nom amb la preposició "a" a partir de `nom_amb_article`, per a "Com pujar al Pedraforca".
 * - ca: contraccions normatives ("al Pedraforca", "a la Pica d'Estats", "als Bessons").
 * - es: el topònim conserva l'article català; només es contrau `el`/`lo` → "al".
 */
export function nomAmbA(nomAmbArticle: string, locale: 'ca' | 'es'): string {
	const { article, nom } = separarArticle(nomAmbArticle);
	if (locale === 'ca') return ambA(nom, article);
	return article === 'el' || article === 'lo' ? `al ${nom}` : `a ${nomAmbArticle}`;
}

/** Límit del `<title>` (docs/02 §4.1). */
export const MAX_TITLE = 60;

/** Primer títol que hi cap; si cap no hi cap, l'últim (el més curt). */
export function primerQueHiCapi(opcions: readonly string[], max = MAX_TITLE): string {
	return opcions.find((t) => t.length <= max) ?? opcions[opcions.length - 1];
}
