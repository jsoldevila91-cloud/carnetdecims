/**
 * Estat de connexió (implementació web). Els components el llegeixen d'aquí i
 * no toquen `navigator` directament; a Capacitor es podrà substituir pel
 * plugin `@capacitor/network` sense canviar la UI.
 */
class NetworkStatus {
	online = $state(true);
	#started = false;

	/** Comença a escoltar els canvis. Retorna la funció per aturar-ho. */
	start(): () => void {
		if (typeof window === 'undefined' || this.#started) return () => {};
		this.#started = true;
		this.online = navigator.onLine;
		const update = () => (this.online = navigator.onLine);
		window.addEventListener('online', update);
		window.addEventListener('offline', update);
		return () => {
			this.#started = false;
			window.removeEventListener('online', update);
			window.removeEventListener('offline', update);
		};
	}
}

export const network = new NetworkStatus();
