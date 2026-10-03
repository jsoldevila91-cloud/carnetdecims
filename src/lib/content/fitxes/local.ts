/**
 * Contingut d'una fitxa projectat a **un sol idioma**: el que rep la pàgina (`+page.server.ts`).
 *
 * La fitxa és SSG i el `load` del servidor se serialitza a l'HTML (dades inline) i a
 * `__data.json`: amb el `ContingutFitxa` sencer, `/ca/cims/{slug}` arrossegaria també tot el text
 * en castellà (i a l'inrevés). Aquí els textos per idioma (descripció, nom i descripció de les
 * rutes, consells, FAQ) queden només en `locale`; les fonts i les dades numèriques es mantenen.
 * Sense dependències de `$lib` (l'importa `index.ts`, que arriba a `vite.config.ts`).
 */
import type { AppLocale } from '../../i18n/routes.ts';
import type { PreguntaFaq } from '../types.ts';
import type { ContingutFitxa, RutaAcces } from './types.ts';

export interface RutaAccesLocal extends Omit<RutaAcces, 'nom' | 'descripcio'> {
	nom: string;
	descripcio: string;
}

export interface ContingutFitxaLocal extends Omit<
	ContingutFitxa,
	'descripcio' | 'rutes' | 'consells' | 'faq'
> {
	/** Idioma dels textos. */
	locale: AppLocale;
	/** Paràgrafs de la descripció. */
	descripcio: string[];
	rutes: RutaAccesLocal[];
	/** Buit si la fitxa no en té. */
	consells: string[];
	/** Buit si la fitxa no en té. */
	faq: PreguntaFaq[];
}

/** Projecta el contingut (ca + es) a l'idioma de la pàgina. */
export function contingutFitxaLocal(c: ContingutFitxa, locale: AppLocale): ContingutFitxaLocal {
	const { descripcio, rutes, consells, faq, ...comu } = c;
	return {
		...comu,
		locale,
		descripcio: descripcio[locale] ?? [],
		rutes: rutes.map(({ nom, descripcio: desc, ...dades }) => ({
			...dades,
			nom: nom[locale] ?? '',
			descripcio: desc[locale] ?? ''
		})),
		consells: consells?.[locale] ?? [],
		faq: faq?.[locale] ?? []
	};
}
