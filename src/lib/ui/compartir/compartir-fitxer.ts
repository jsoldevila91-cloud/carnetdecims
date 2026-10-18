/**
 * Compartir una imatge generada al client (carnet R3, ascensió R5): el full de compartir del
 * sistema (`navigator.share` amb fitxer) si el navegador ho permet; si no, descàrrega.
 */

/** El navegador pot compartir fitxers PNG amb el full del sistema. */
export function potCompartirFitxers(nom = 'carnetdecims.png'): boolean {
	if (typeof navigator === 'undefined' || typeof navigator.canShare !== 'function') return false;
	try {
		const prova = new File([new Blob([''], { type: 'image/png' })], nom, { type: 'image/png' });
		return navigator.canShare({ files: [prova] });
	} catch {
		return false;
	}
}

/** Descarrega un blob (o una URL d'objecte ja creada) amb el nom de fitxer indicat. */
export function descarregar(origen: Blob | string, nom: string): void {
	const url = typeof origen === 'string' ? origen : URL.createObjectURL(origen);
	const a = document.createElement('a');
	a.href = url;
	a.download = nom;
	a.rel = 'noopener';
	a.click();
	if (typeof origen !== 'string') setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

/**
 * Resultat de `compartirImatge`:
 * - `compartit`: el full del sistema s'ha obert i l'usuari ha triat on enviar-la;
 * - `cancellat`: l'usuari ha tancat el full (no és cap error);
 * - `sense-gest`: el navegador demana un toc nou (s'ha perdut el gest de l'usuari mentre es
 *   generava la imatge); la imatge ja és a punt i un segon toc la comparteix;
 * - `descarregat`: no es pot compartir el fitxer i s'ha descarregat.
 */
export type ResultatCompartir = 'compartit' | 'cancellat' | 'sense-gest' | 'descarregat';

export async function compartirImatge(
	blob: Blob,
	nom: string,
	titol: string
): Promise<ResultatCompartir> {
	if (!potCompartirFitxers(nom)) {
		descarregar(blob, nom);
		return 'descarregat';
	}
	const fitxer = new File([blob], nom, { type: 'image/png' });
	try {
		await navigator.share({ files: [fitxer], title: titol });
		return 'compartit';
	} catch (e) {
		const motiu = (e as DOMException)?.name;
		if (motiu === 'AbortError') return 'cancellat';
		if (motiu === 'NotAllowedError') return 'sense-gest';
		descarregar(blob, nom);
		return 'descarregat';
	}
}
