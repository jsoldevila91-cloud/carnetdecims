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
	/** Entrar amb Google està configurat en aquest build (`PUBLIC_GOOGLE_AUTH`)? */
	googleDisponible(): boolean;
	/** Redirigeix a Google; en tornar, l'entrada es completa com la de l'enllaç del correu. */
	entrarAmbGoogle(opcions: { redirectTo: string }): Promise<void>;
	verificarCodi(email: string, codi: string): Promise<unknown>;
	/** Entrar amb correu i contrasenya està activat en aquest build (`PUBLIC_PASSWORD_AUTH`)? */
	contrasenyaDisponible(): boolean;
	/**
	 * Registre amb contrasenya. `'confirmar-correu'` també si el correu ja té compte (no es
	 * revela): la UI diu "si ja tens compte, entra o restableix la contrasenya".
	 */
	crearCompteAmbContrasenya(
		email: string,
		contrasenya: string,
		opcions: { redirectTo: string }
	): Promise<'entrat' | 'confirmar-correu'>;
	entrarAmbContrasenya(email: string, contrasenya: string): Promise<unknown>;
	reenviarConfirmacio(email: string, opcions: { redirectTo: string }): Promise<void>;
	/** Correu per restablir la contrasenya; en tornar, `completarEntradaDesDeUrl` dona `'recuperacio'`. */
	demanarRestabliment(email: string, opcions: { redirectTo: string }): Promise<void>;
	/** Crea o canvia la contrasenya de la sessió actual (surt del mode recuperació). */
	canviarContrasenya(nova: string): Promise<void>;
	/** `true` després d'entrar amb l'enllaç de restabliment: cal demanar la contrasenya nova. */
	modeRecuperacio: StoreUi<boolean>;
	/** Descarta el formulari de contrasenya nova (la sessió continua). */
	sortirModeRecuperacio(): void;
	completarEntradaDesDeUrl(): Promise<'cap' | 'entrat' | 'recuperacio' | ErrorAmbCodi>;
	sortir(): Promise<void>;
	esborrarCompte(opcions: { conservarDispositiu?: boolean }): Promise<void>;
	exportarDadesCompte(): Promise<string>;
	/** Còpia de les dades d'aquest dispositiu (inclou els canvis que no s'han pogut pujar). */
	exportarDadesLocals(): Promise<string>;
	sincronitzarAra(): Promise<void>;
	resoldreConflicteCompte(accio: 'fusionar' | 'descartar-locals'): Promise<void>;
}

/** Codi d'error d'una operació del compte (o `null` si l'error no en porta). */
export function codiError(error: unknown): string | null {
	return error && typeof error === 'object' && 'codi' in error && typeof error.codi === 'string'
		? error.codi
		: null;
}
