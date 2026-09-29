/**
 * Càrrega diferida del formulari de registre (i de Dexie) per al full del layout: no pesa a les
 * pàgines públiques. Es precarrega en segon pla quan la pàgina està en línia i ociosa, perquè el
 * full també s'obri si després es perd la cobertura (el service worker arriba al bloc 4d).
 */
/** Marge després de la primera interacció abans de precarregar (ms). */
export const RETARD_PRECARREGA = 3000;

type ModulRegistre = typeof import('./RegisterPanel.svelte');

let promesa: Promise<ModulRegistre> | null = null;

/** Import del formulari. Si falla (p. ex. sense connexió), es pot tornar a intentar. */
export function carregarRegistre(): Promise<ModulRegistre> {
	promesa ??= import('./RegisterPanel.svelte').catch((error: unknown) => {
		promesa = null;
		throw error;
	});
	return promesa;
}

/**
 * Precàrrega en segon pla uns segons després de la primera interacció (no competeix amb la
 * càrrega inicial ni amb la resposta a aquesta interacció), quan el navegador està ociós i en
 * línia. Sense `requestIdleCallback` (Safari), només el retard. Retorna la funció de neteja.
 */
export function precarregarRegistreQuanOcios(): () => void {
	if (typeof window === 'undefined') return () => {};
	const esdeveniments = ['pointerdown', 'keydown', 'scroll', 'touchstart'] as const;
	let cancel: (() => void) | null = null;

	const precarrega = () => {
		treu();
		if (!navigator.onLine) {
			// Sense connexió: es torna a provar quan torni.
			window.addEventListener('online', precarrega, { once: true });
			return;
		}
		const fes = () => void carregarRegistre().catch(() => {});
		const espera = setTimeout(() => {
			if ('requestIdleCallback' in window) {
				const id = window.requestIdleCallback(fes, { timeout: 5000 });
				cancel = () => window.cancelIdleCallback(id);
			} else fes();
		}, RETARD_PRECARREGA);
		cancel = () => clearTimeout(espera);
	};
	const treu = () => {
		for (const e of esdeveniments) window.removeEventListener(e, precarrega);
	};

	for (const e of esdeveniments) {
		window.addEventListener(e, precarrega, { once: true, passive: true });
	}
	return () => {
		treu();
		window.removeEventListener('online', precarrega);
		cancel?.();
	};
}
