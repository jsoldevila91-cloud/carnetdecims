/**
 * Índex del contingut editorial (bloc 3c): les 8 pàgines de `PAGINES_CONTINGUT`.
 *
 * Aquest mòdul l'importa `$lib/seo/sitemap.ts` (i, per tant, `vite.config.ts`): els mòduls de
 * contingut només poden importar valors amb camins relatius (`./pendents.ts`); `import type`
 * des de `$lib` sí que és vàlid, perquè desapareix en compilar.
 */
import { avisLegal } from './avis-legal.ts';
import { comValidar } from './com-validar.ts';
import { metodologia } from './metodologia.ts';
import { normativa } from './normativa.ts';
import { privacitat } from './privacitat.ts';
import { repte } from './repte.ts';
import { repteInfantil } from './repte-infantil.ts';
import { sobreElProjecte } from './sobre-el-projecte.ts';
import { PAGINES_CONTINGUT, type ClauPagina, type Contingut } from './types.ts';

export * from './types.ts';

export const CONTINGUTS: Readonly<Record<ClauPagina, Contingut>> = {
	repte,
	normativa,
	comValidar,
	repteInfantil,
	metodologia,
	sobreElProjecte,
	avisLegal,
	privacitat
};

/** Camí intern de cada pàgina de contingut. */
export type CamiContingut = (typeof PAGINES_CONTINGUT)[ClauPagina];

const CLAU_PER_CAMI: ReadonlyMap<string, ClauPagina> = new Map(
	(Object.keys(PAGINES_CONTINGUT) as ClauPagina[]).map((clau) => [PAGINES_CONTINGUT[clau], clau])
);

/** Clau de la pàgina de contingut d'un camí intern (deslocalitzat), o `undefined`. */
export function clauPerCami(pathIntern: string): ClauPagina | undefined {
	return CLAU_PER_CAMI.get(normalitza(pathIntern));
}

/**
 * Contingut (ca + es) d'un camí intern deslocalitzat (`/repte-100-cims/normativa`), o
 * `undefined` si no és una pàgina de contingut. Tolera la barra final.
 */
export function contingutPerCami(pathIntern: string): Contingut | undefined {
	const clau = clauPerCami(pathIntern);
	return clau && CONTINGUTS[clau];
}

function normalitza(path: string): string {
	return path.length > 1 ? path.replace(/\/+$/, '') : path;
}
