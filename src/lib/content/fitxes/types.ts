/**
 * Contracte del contingut editorial de les fitxes de cim (fase 6).
 *
 * Un fitxer per cim a `src/lib/content/fitxes/{slug}.ts` que exporta `default` un `ContingutFitxa`.
 * - Res inventat: cada dada factual (desnivell, distància, temps, MIDE, punt de sortida…) porta
 *   la font a `fonts`; si no hi ha font fiable, el camp s'omet.
 * - Text redactat amb paraules pròpies a partir de les fonts (mai copiat).
 * - `estat` comença a `'esborrany'`; només una persona pot passar-lo a `'revisat'`
 *   (és la condició perquè la fitxa sigui indexable, docs/02).
 * - Text en línia: mateixa sintaxi que el contingut editorial (`[text](/intern)`, `[text](https://…)`,
 *   `**negreta**`), vegeu `src/lib/content/types.ts`.
 */
import type { DataISO, Mide } from '$lib/domain';
import type { AppLocale } from '$lib/i18n/routes';
import type { FontCitada, PreguntaFaq } from '../types';

export type EstatContingut = 'esborrany' | 'verificat' | 'revisat';

export interface RutaAcces {
	/** Identificador estable dins la fitxa (p. ex. `gosol`, `saldes-mirador`). */
	id: string;
	/** Nom de la ruta per idioma (p. ex. "Des del Collell de Gósol"). */
	nom: Record<AppLocale, string>;
	/** Punt de sortida: nom i coordenades (si hi ha font). */
	sortida: { nom: string; lat?: number; lon?: number };
	/** Valors de la ruta normal fins al cim (anada), si hi ha font. */
	desnivellPositiuM?: number;
	distanciaKm?: number;
	/** Temps d'anada en minuts (sense parades). */
	tempsMinuts?: number;
	/** Valoració MIDE oficial o publicada per una font fiable (mai estimada sense font). */
	mide?: Mide;
	/** Descripció breu del recorregut per idioma (2–4 frases). */
	descripcio: Record<AppLocale, string>;
	/** Fonts d'aquesta ruta (obligatori si hi ha cap dada numèrica o MIDE). */
	fonts: FontCitada[];
}

export interface RutaWikiloc {
	/** Id numèric de la ruta a Wikiloc (per al widget oficial d'incrustació). */
	id: number;
	/** Títol tal com surt a Wikiloc. */
	titol: string;
	/** URL pública de la ruta a Wikiloc. */
	url: string;
}

export interface ContingutFitxa {
	slug: string;
	/** Descripció del cim per idioma: paràgrafs (≥ 400 paraules en total per idioma a la fitxa). */
	descripcio: Record<AppLocale, string[]>;
	/** Rutes d'accés (la normal primer). */
	rutes: RutaAcces[];
	/** Consells pràctics per idioma (temporada, aigua, perills, aparcament…): llista curta. */
	consells?: Record<AppLocale, string[]>;
	/** Preguntes freqüents pròpies del cim per idioma (generen FAQPage si la fitxa és indexable). */
	faq?: Record<AppLocale, PreguntaFaq[]>;
	/** 2–3 rutes recomanades de Wikiloc triades a mà (widget oficial). */
	wikiloc?: RutaWikiloc[];
	/** Fonts generals del text. */
	fonts: FontCitada[];
	estat: EstatContingut;
	/** Data de l'última revisió/edició del contingut (serveix de `lastmod`). */
	actualitzat: DataISO;
}
