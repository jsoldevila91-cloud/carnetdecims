/**
 * Quan es pot fer una descàrrega en segon pla (precàrrega de fitxes): amb connexió, sense
 * "estalvi de dades" i, si el navegador ho diu (`navigator.connection`, només Chromium),
 * per wifi o cable i no en 2G. Sense `navigator.connection` (Safari, Firefox) no se sap el
 * tipus de xarxa: es permet, perquè la precàrrega és petita i l'usuari ja hi és.
 */
export type InfoConnexio = {
	saveData?: boolean;
	/** `wifi`, `cellular`, `ethernet`, `none`… (Chrome Android). */
	type?: string;
	/** `slow-2g`, `2g`, `3g`, `4g`. */
	effectiveType?: string;
};

const TIPUS_PERMESOS = new Set(['wifi', 'ethernet', 'wimax', 'other', 'unknown']);

export function connexioPermetPrecarrega(
	connexio: InfoConnexio | undefined | null,
	enLinia: boolean
): boolean {
	if (!enLinia) return false;
	if (!connexio) return true;
	if (connexio.saveData) return false;
	if (connexio.type !== undefined && !TIPUS_PERMESOS.has(connexio.type)) return false;
	if (connexio.effectiveType === 'slow-2g' || connexio.effectiveType === '2g') return false;
	return true;
}
