/**
 * Identificadors (`id`) que pinta la plantilla `PaginaContingut.svelte`.
 *
 * Els de la plantilla porten el prefix `pc-` perquè no xoquin mai amb les àncores de secció
 * del contingut (`Seccio.id`, p. ex. `fonts` a la metodologia), que no poden començar per `pc-`.
 */
import type { PaginaContingut } from '../content/types.ts';

export const PREFIX_PLANTILLA = 'pc-';

export const ID_FAQ = 'pc-faq';
export const ID_FAQ_TITOL = 'pc-faq-titol';
export const ID_FONTS = 'pc-fonts';
export const ID_FONTS_TITOL = 'pc-fonts-titol';

/** Id de l'H2 d'una secció (per a `aria-labelledby`). */
export const idTitolSeccio = (id: string) => `pc-titol-${id}`;

/** Tots els `id` que la plantilla genera per a una pàgina, en ordre de document. */
export function idsPagina(pagina: PaginaContingut): string[] {
	const faq = pagina.faq?.length ?? 0;
	const fonts = pagina.fonts?.length ?? 0;
	return [
		...pagina.seccions.flatMap((s) => [s.id, idTitolSeccio(s.id)]),
		...(faq ? [ID_FAQ, ID_FAQ_TITOL] : []),
		...(fonts ? [ID_FONTS, ID_FONTS_TITOL] : [])
	];
}
