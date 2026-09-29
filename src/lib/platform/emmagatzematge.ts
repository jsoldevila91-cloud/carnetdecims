/**
 * Emmagatzematge persistent (implementació web). Demana al navegador que no esborri
 * IndexedDB quan li falti espai (`navigator.storage.persist`). A Capacitor les dades ja són
 * persistents i n'hi haurà prou de retornar `true`.
 */

/**
 * Demana emmagatzematge persistent. Retorna `true` si ja ho era o si el navegador ho
 * concedeix; `false` si no hi ha l'API (SSR, navegadors antics), si es denega o si falla.
 * No llança mai.
 */
export async function demanarPersistencia(): Promise<boolean> {
	try {
		const storage = typeof navigator === 'undefined' ? undefined : navigator.storage;
		if (!storage || typeof storage.persist !== 'function') return false;
		if (typeof storage.persisted === 'function' && (await storage.persisted())) return true;
		return (await storage.persist()) === true;
	} catch {
		return false;
	}
}
