/**
 * Comprovacions de la BD local **sense obrir-la** (obrir-la amb Dexie la crea buida). Mòdul sense
 * Dexie: el poden importar les pàgines públiques (p. ex. `/mapa`) sense carregar el chunk de dades.
 */

/** Nom de la base de dades IndexedDB (un per origen). `db.ts` el reexporta. */
export const NOM_BD = 'carnetdecims';

/** Esdeveniment de `window` quan s'hi desa una ascensió (la BD ja existeix). */
export const EVENT_ASCENSIONS = 'carnetdecims:ascensions';

/**
 * Hi ha la BD local? Fa servir `indexedDB.databases()`, que no crea res. Si el navegador no
 * ho permet saber, retorna `true` (millor llegir-la, i potser crear-la buida, que amagar dades).
 */
export async function bdLocalExisteix(nom = NOM_BD): Promise<boolean> {
	try {
		if (typeof indexedDB === 'undefined') return false;
		if (typeof indexedDB.databases !== 'function') return true;
		const bds = await indexedDB.databases();
		return bds.some((b) => b.name === nom);
	} catch {
		return true;
	}
}
