/**
 * Recompte de paraules del contingut propi d'una fitxa (criteri de contingut prim, docs/02 §4.1).
 * Sense dependències de `$lib` (l'importa `index.ts`, que arriba a `vite.config.ts`).
 */
import type { AppLocale } from '../../i18n/routes.ts';
import { textPla } from '../text.ts';
import type { ContingutFitxa } from './types.ts';

/** Paraules d'un text en línia (sense marques ni destins d'enllaç). */
export function comptarParaules(text: string): number {
	return textPla(text)
		.split(/\s+/)
		.filter((p) => /[\p{L}\p{N}]/u.test(p)).length;
}

/**
 * Paraules del contingut propi de la fitxa en un idioma: descripció + rutes (nom i descripció) +
 * consells + FAQ (preguntes i respostes). No compta el text de plantilla de la pàgina.
 */
export function paraulesFitxa(c: ContingutFitxa, locale: AppLocale): number {
	const textos = [
		...(c.descripcio[locale] ?? []),
		...c.rutes.flatMap((r) => [r.nom[locale] ?? '', r.descripcio[locale] ?? '']),
		...(c.consells?.[locale] ?? []),
		...(c.faq?.[locale] ?? []).flatMap((f) => [f.pregunta, f.resposta])
	];
	return textos.reduce((n, t) => n + comptarParaules(t), 0);
}
