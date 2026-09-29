/**
 * Criteris d'indexació per contingut prim (docs/02-arquitectura-seo.md §4.2 i §6).
 *
 * Sense dependències de `$lib` ni del runtime: ho fan servir tant les pàgines (`noindex`) com
 * el sitemap (`sitemap.ts`, que importa `vite.config.ts`). Pàgina i sitemap han d'aplicar
 * sempre el mateix criteri.
 */

/**
 * Mínim de cims del catàleg perquè una pàgina de comarca sigui indexable. Per sota, la pàgina
 * és poc més que un enllaç a una o dues fitxes (que encara són `noindex`) amb text de
 * plantilla: es publica amb `noindex` (els enllaços se segueixen) i fora del sitemap.
 * Es revisa a la fase 6 (catàleg de 522 i introducció editorial de cada comarca).
 */
export const MIN_CIMS_COMARCA_INDEXABLE = 3;

/** La pàgina de comarca amb `nCims` cims és indexable (i va al sitemap). */
export function comarcaIndexable(nCims: number): boolean {
	return nCims >= MIN_CIMS_COMARCA_INDEXABLE;
}

/**
 * Pàgines prerenderitzades que encara són només un espai reservat: es publiquen amb `noindex`
 * i fora del sitemap fins que tinguin contingut real. `/mapa`: el mapa interactiu arriba a la
 * fase 4; avui la pàgina només remet a la llista (contingut prim i descripció no veraç).
 */
export const PAGINES_NOINDEX: ReadonlySet<string> = new Set(['/mapa']);
