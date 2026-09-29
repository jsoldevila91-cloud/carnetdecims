/**
 * Utilitats sobre el text en línia del contracte de contingut (`types.ts`): enllaços
 * `[text](destí)`, `**negreta**` i marcadors `[PENDENT: …]`.
 *
 * Font única de la sintaxi: l'analitzador de la UI (`$lib/ui/text-en-linia.ts`). `textPla` en
 * fa servir els segments, de manera que el text pla (JSON-LD, meta) diu exactament el mateix que
 * el que es pinta: un enllaç vàlid queda com la seva etiqueta i un de no vàlid, com a text cru.
 * Import relatiu i sense dependències: el pot fer servir `$lib/seo/jsonld.ts`.
 */
import { analitzarTextEnLinia, type SegmentSimple } from '../ui/text-en-linia.ts';

/**
 * Qualsevol cosa amb forma d'enllaç `[text](destí)`, sigui vàlid o no. És el mateix patró que
 * `ENLLAC_RE` de `text-en-linia.ts` (destí sense espais, admet un nivell de parèntesis); el test
 * `text.spec.ts` comprova que coincideixen.
 */
export const PATRO_ENLLAC = /\[([^[\]\n]+)\]\(((?:[^\s()]|\([^\s()]*\))+)\)/g;

const textDe = (s: SegmentSimple): string => s.text;

/** Text pla (JSON-LD, meta…): el que es veu a la pàgina, sense marques ni destins. */
export function textPla(text: string): string {
	return analitzarTextEnLinia(text)
		.map((s) => (s.tipus === 'negreta' ? s.fills.map(textDe).join('') : textDe(s)))
		.join('')
		.replace(/\s+/g, ' ')
		.trim();
}

/**
 * Destins de tots els enllaços d'un text, en ordre, **també els no vàlids** (que la UI pinta com
 * a text): els tests de contingut els fan servir per detectar destins mal escrits.
 */
export function destinsEnllacos(text: string): string[] {
	return [...text.matchAll(PATRO_ENLLAC)].map((m) => m[2]);
}
