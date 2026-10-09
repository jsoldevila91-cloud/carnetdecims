/**
 * Contracte que fan servir els components del compte. Per defecte és el real
 * (`$lib/data/compte` + `$lib/data/sync`, vegeu `api-real.ts`); els tests i les proves visuals
 * hi poden passar un doble sense tocar la capa de dades.
 */
import type { SessioUi, SyncUi } from './nuvol';

export interface StoreUi<T> {
	subscribe(run: (valor: T) => void): () => void;
}

/** Error del compte amb codi estable (`ErrorCompte` de `$lib/data/compte`). */
export interface ErrorAmbCodi {
	codi: string;
}

export interface ApiCompte {
	sessio: StoreUi<SessioUi>;
	estatSync: StoreUi<SyncUi>;
	compteDisponible(): boolean;
	entrarAmbEmail(email: string, opcions: { redirectTo: string }): Promise<void>;
	verificarCodi(email: string, codi: string): Promise<unknown>;
	completarEntradaDesDeUrl(): Promise<'cap' | 'entrat' | ErrorAmbCodi>;
	sortir(): Promise<void>;
	esborrarCompte(opcions: { conservarDispositiu?: boolean }): Promise<void>;
	exportarDadesCompte(): Promise<string>;
	sincronitzarAra(): Promise<void>;
	resoldreConflicteCompte(accio: 'fusionar' | 'descartar-locals'): Promise<void>;
}

/** Codi d'error d'una operació del compte (o `null` si l'error no en porta). */
export function codiError(error: unknown): string | null {
	return error && typeof error === 'object' && 'codi' in error && typeof error.codi === 'string'
		? error.codi
		: null;
}
