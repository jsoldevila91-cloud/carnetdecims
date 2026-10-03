/**
 * Base de dades local (IndexedDB amb Dexie), bloc 4a. Vegeu `docs/03-modelo-datos.md` §2.
 *
 * Principi local-first: tota escriptura va primer aquí; la UI només llegeix d'aquí. La
 * sincronització (fase 5) llegirà la cua `outbox` i hi pujarà les files pendents.
 *
 * Sense imports del framework: el mateix codi ha de funcionar a la web i a Capacitor.
 */
import { Dexie, type EntityTable } from 'dexie';
import type { Ascensio, InstantISO } from '$lib/domain';
import { NOM_BD } from './existeix';

export { NOM_BD };

/**
 * Fila de `ascensions`: la mateixa forma que `Ascensio`, amb `deletedAt` sempre present
 * (`null` = viva). IndexedDB no indexa `null`, així que l'índex `deletedAt` només conté
 * les làpides (tombstones).
 */
export type FilaAscensio = Ascensio & { deletedAt: InstantISO | null };

/**
 * Entrada de la cua de sincronització. Una per ascensió (clau = `ascensioId`): diverses
 * edicions abans de sincronitzar es fusionen en una sola pujada, i el push enviarà l'estat
 * actual de la fila (LWW per `updatedAt`, làpida inclosa).
 */
export interface EntradaOutbox {
	ascensioId: string;
	/** Última vegada que s'ha encuat (instant ISO). */
	encuaAt: InstantISO;
	/** Intents de pujada fallits (el farà servir la sync de la fase 5). */
	intents: number;
}

/**
 * Esquemes versionats. **Mai no s'edita una versió publicada**: per canviar l'esquema, s'hi
 * afegeix una versió nova amb només les taules que canvien i, si cal, una funció `upgrade`
 * que migri les dades (Dexie les aplica en ordre en obrir la BD).
 *
 * Exemple per a la fase 5:
 *   { versio: 2, stores: { meta: 'clau' }, upgrade: async (tx) => { … } }
 */
export const ESQUEMES: readonly {
	versio: number;
	stores: Record<string, string | null>;
	upgrade?: (tx: import('dexie').Transaction) => Promise<void> | void;
}[] = [
	{
		versio: 1,
		stores: {
			// Clau primària `id` (UUIDv7 generat al client, no autoincremental).
			ascensions: 'id, cimId, data, updatedAt, deletedAt',
			outbox: 'ascensioId, encuaAt'
		}
	}
];

export class CarnetDb extends Dexie {
	ascensions!: EntityTable<FilaAscensio, 'id'>;
	outbox!: EntityTable<EntradaOutbox, 'ascensioId'>;

	constructor(nom = NOM_BD) {
		super(nom);
		for (const e of ESQUEMES) {
			const v = this.version(e.versio).stores(e.stores);
			if (e.upgrade) v.upgrade(e.upgrade);
		}
	}
}

let bd: CarnetDb | null = null;

/** Hi ha IndexedDB en aquest entorn? (No n'hi ha en SSR, prerender ni Workers.) */
export function indexedDbDisponible(): boolean {
	return typeof indexedDB !== 'undefined';
}

/** Instància única (s'obre de manera mandrosa en la primera operació). */
export function obtenirBd(): CarnetDb {
	bd ??= new CarnetDb();
	return bd;
}

/** Tanca i oblida la instància (tests i canvis de compte futurs). */
export function tancarBd(): void {
	bd?.close();
	bd = null;
}
