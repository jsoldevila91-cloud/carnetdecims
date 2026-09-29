/**
 * Contracte del contingut editorial (bloc 3c): pàgines de text (hub del repte, normativa,
 * metodologia, legals…) escrites com a dades tipades per idioma i pintades per un sol
 * component (`PaginaContingut`). Res d'HTML cru: els enllaços van amb sintaxi mínima.
 *
 * Text en línia (`text`, `items`, `resposta`): text pla amb enllaços `[text](destí)`.
 * - Destí intern: camí intern deslocalitzat que comença per `/` (`/cims/pedraforca-pollego-superior`,
 *   `/repte-100-cims/normativa`); el component el localitza amb `href()`.
 * - Destí extern: URL `https://…` (s'obre en pestanya nova amb `rel="external noopener"`).
 * - `**negreta**` permès. Cap altra marca.
 */
import type { DataISO } from '$lib/domain';
import type { AppLocale } from '$lib/i18n/routes';

export type Bloc =
	| { tipus: 'paragraf'; text: string }
	| { tipus: 'llista'; ordenada?: boolean; items: string[] }
	/** Requadre destacat (p. ex. avís de web no oficial o d'una norma important). */
	| { tipus: 'avis'; to: 'info' | 'alerta'; text: string };

export interface Seccio {
	/** Ancora estable (`#id`), en català i sense accents. */
	id: string;
	/** H2 de la secció. */
	titol: string;
	blocs: Bloc[];
}

export interface PreguntaFaq {
	pregunta: string;
	resposta: string;
}

export interface FontCitada {
	nom: string;
	url: string;
	/** Data de consulta. */
	consultat?: DataISO;
}

export interface PaginaContingut {
	/** `<title>` (≤ 60 caràcters). */
	title: string;
	/** Meta description (≤ 155 caràcters). */
	description: string;
	h1: string;
	/** Entradeta sota l'H1 (1–2 frases). */
	intro: string;
	seccions: Seccio[];
	/** Preguntes freqüents: es pinten al final i generen JSON-LD `FAQPage` si n'hi ha. */
	faq?: PreguntaFaq[];
	/** Fonts consultades per redactar la pàgina (es mostren al peu de la pàgina). */
	fonts?: FontCitada[];
	/** Data de l'última revisió del contingut (es mostra i serveix de `lastmod`). */
	actualitzat: DataISO;
	/** Per defecte indexable. */
	noindex?: boolean;
}

/** Una pàgina en tots dos idiomes. */
export type Contingut = Record<AppLocale, PaginaContingut>;

/**
 * Camins interns de les pàgines de contingut (clau → camí intern deslocalitzat).
 * Cada mòdul de `src/lib/content/` exporta un `Contingut` amb el nom indicat.
 */
export const PAGINES_CONTINGUT = {
	repte: '/repte-100-cims',
	normativa: '/repte-100-cims/normativa',
	comValidar: '/repte-100-cims/com-validar',
	repteInfantil: '/repte-100-cims/repte-infantil',
	metodologia: '/metodologia',
	sobreElProjecte: '/sobre-el-projecte',
	avisLegal: '/avis-legal',
	privacitat: '/privacitat'
} as const;

export type ClauPagina = keyof typeof PAGINES_CONTINGUT;
