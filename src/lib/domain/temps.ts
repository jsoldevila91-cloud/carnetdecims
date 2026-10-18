/**
 * Categoria d'icona del temps a partir del codi WMO (R5.2: icona petita del temps actual a les
 * llistes de cims). Funció pura: el servidor la fa servir per compactar la resposta de
 * `/api/meteo/ara` i el client la pot reutilitzar amb els codis de la previsió diària.
 *
 * Codis WMO 4677 tal com els publica Open-Meteo (https://open-meteo.com/en/docs, "WMO Weather
 * interpretation codes"):
 * - 0 serè, 1 majorment serè → `sol`
 * - 2 parcialment ennuvolat → `poc-nuvol`
 * - 3 cobert → `nuvol`
 * - 45, 48 boira (48: amb gebre) → `boira`
 * - 51–57 plugim (56–57 gelant), 61–67 pluja (66–67 gelant), 80–82 xàfecs → `pluja`
 * - 71–77 neu (77 grans de neu), 85–86 xàfecs de neu → `neu`
 * - 95 tempesta, 96 i 99 tempesta amb calamarsa → `tempesta`
 *
 * Qualsevol altre valor (codi no documentat, decimal, negatiu, `NaN`) → `null`: la UI no hi
 * posa icona en lloc d'inventar-ne una.
 *
 * El dia o la nit no canvien la categoria: `sol` de nit la UI el pot pintar com a lluna amb el
 * camp `esDia` de la resposta.
 */

export const CATEGORIES_TEMPS = [
	'sol',
	'poc-nuvol',
	'nuvol',
	'boira',
	'pluja',
	'neu',
	'tempesta'
] as const;

export type CategoriaTemps = (typeof CATEGORIES_TEMPS)[number];

const PER_CODI: ReadonlyMap<number, CategoriaTemps> = new Map<number, CategoriaTemps>([
	[0, 'sol'],
	[1, 'sol'],
	[2, 'poc-nuvol'],
	[3, 'nuvol'],
	[45, 'boira'],
	[48, 'boira'],
	...[51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].map(
		(c) => [c, 'pluja'] as [number, CategoriaTemps]
	),
	...[71, 73, 75, 77, 85, 86].map((c) => [c, 'neu'] as [number, CategoriaTemps]),
	...[95, 96, 99].map((c) => [c, 'tempesta'] as [number, CategoriaTemps])
]);

/** Categoria d'icona d'un codi de temps WMO, o `null` si el codi no és cap dels documentats. */
export function categoriaTemps(codi: number): CategoriaTemps | null {
	if (!Number.isInteger(codi)) return null;
	return PER_CODI.get(codi) ?? null;
}

export function esCategoriaTemps(v: unknown): v is CategoriaTemps {
	return typeof v === 'string' && (CATEGORIES_TEMPS as readonly string[]).includes(v);
}
