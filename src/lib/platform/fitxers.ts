/**
 * Fitxers de l'usuari (implementació web): descarregar un text com a fitxer. A Capacitor
 * s'hi farà servir el full de compartir del sistema.
 */

/** Descarrega `contingut` com un fitxer `nom` (p. ex. la còpia JSON de les ascensions). */
export function descarregarText(nom: string, contingut: string, tipus = 'application/json'): void {
	const url = URL.createObjectURL(new Blob([contingut], { type: `${tipus};charset=utf-8` }));
	const a = document.createElement('a');
	a.href = url;
	a.download = nom;
	a.rel = 'noopener';
	a.click();
	// Alguns navegadors comencen la descàrrega de manera asíncrona.
	setTimeout(() => URL.revokeObjectURL(url), 10_000);
}
