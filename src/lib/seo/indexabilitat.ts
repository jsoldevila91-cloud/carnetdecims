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
 * Mínim de cims perquè un llistat de dificultat (`/cims-facils`, `/cims-amb-nens`) sigui
 * indexable. Aquests llistats només inclouen cims amb contingut editorial (fase 6): amb 0–2 cims
 * la pàgina és contingut prim i es publica amb `noindex` (els enllaços se segueixen) i fora del
 * sitemap, fins que n'hi hagi prou. Mateix llindar que les comarques (docs/02 §4.2).
 */
export const MIN_CIMS_LLISTAT_INDEXABLE = 3;

/** El llistat de dificultat amb `nCims` cims és indexable (i va al sitemap). */
export function llistatIndexable(nCims: number): boolean {
	return nCims >= MIN_CIMS_LLISTAT_INDEXABLE;
}

/**
 * Pàgines prerenderitzades que encara són només un espai reservat: es publiquen amb `noindex`
 * i fora del sitemap fins que tinguin contingut real.
 * Avui no n'hi ha cap: `/mapa` hi va ser des del bloc 3c fins al 4c, quan va passar a ser el mapa
 * interactiu real (imatge estàtica + text sense JS) i, per tant, indexable (docs/02 §4.3).
 */
export const PAGINES_NOINDEX: ReadonlySet<string> = new Set<string>();

/**
 * Fitxa de cim indexable (fase 6, docs/02 §4.1): calen **les dues** revisions humanes.
 * - `estatCataleg` (`estat_revisio` de `cims.json`): dades del catàleg (nom, altitud, coordenades,
 *   comarca) comprovades.
 * - `estatContingut` (`estat` de `src/lib/content/fitxes/{slug}.ts`): text editorial revisat
 *   (≥ 400 paraules, rutes amb fonts). Sense fitxer de contingut, la fitxa és només plantilla.
 * Cap de les dues mana sola: totes dues han de ser `'revisat'`. Ho fan servir la pàgina (`noindex`)
 * i el sitemap, sempre amb aquest mateix criteri.
 */
export function fitxaIndexable(
	estatCataleg: string | undefined,
	estatContingut: string | undefined
): boolean {
	return estatCataleg === 'revisat' && estatContingut === 'revisat';
}
