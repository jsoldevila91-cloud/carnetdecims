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
import { purgarLapides } from './lapides';

export { NOM_BD };

/**
 * Fila de `ascensions`: la mateixa forma que `Ascensio`, amb `deletedAt` sempre present
 * (`null` = viva). IndexedDB no indexa `null`, així que l'índex `deletedAt` només conté
 * les làpides (tombstones).
 *
 * `companys` (bloc R1) és **opcional a la fila**: una fila sense la clau és una fila que aquest
 * dispositiu no ha desat mai amb companys (creada per una versió anterior de l'app, o baixada
 * abans de R1). Es llegeix com a `[]`, però **no es puja**: `sync_push` conserva els companys
 * que hi hagi al núvol quan la fila arriba sense la clau (igual que amb el client antic). La clau
 * apareix quan l'usuari desa els companys o quan la fila baixa del núvol.
 *
 * Làpides: conserven la nota i els companys només durant la finestra de desfer; després queden
 * amb `nota: null` i `companys: []` (vegeu `lapides.ts`).
 */
export type FilaAscensio = Omit<Ascensio, 'companys' | 'deletedAt'> & {
	companys?: string[];
	deletedAt: InstantISO | null;
};

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
 * Metadades locals de la sync (versió 2 de l'esquema, fase 5). Claus conegudes:
 * - `propietari`: id de l'usuari a qui pertanyen les dades del dispositiu (`null`/absent = anònim);
 * - `cursorPull`: `server_updated_at` (text tal com el retorna el servidor) de l'última fila baixada;
 * - `ultimaSync`: instant ISO de l'última sync completa;
 * - `epoca`: es renova a cada esborrat local de dades o de propietat (`novaEpoca`). Una passada
 *   de sync que la veu canviada avorta sense escriure res (vegeu `sync.ts`).
 */
export interface EntradaMeta {
	clau: 'propietari' | 'cursorPull' | 'ultimaSync' | 'epoca';
	valor: string | null;
}

/**
 * Preferències de l'usuari (versió 3 de l'esquema, bloc R1). Local sense sessió; amb sessió, se
 * sincronitzen amb el compte (`public.perfils`) amb LWW per `updatedAt`. Claus conegudes:
 * - `origen`: codi del municipi d'origen (`Municipi.codi`), o `null` si l'usuari l'ha tret.
 */
export interface EntradaPreferencia {
	clau: 'origen';
	valor: string | null;
	/** Instant (rellotge del client) de l'últim canvi: el que compara la regla LWW. */
	updatedAt: InstantISO;
	/** `1` = canvi local que encara no s'ha pujat al compte (sense sessió, s'hi queda). */
	pendent: 0 | 1;
}

/**
 * Redirecció d'un id d'ascensió que ha deixat d'existir (versió 4 de l'esquema) cap a la fila que
 * la representa ara:
 * - `id-en-us`: la sync li ha donat un id nou perquè l'id era d'un altre compte (`reassignarId`);
 * - `duplicat`: era un duplicat d'una altra ascensió i ha passat a làpida (`domain/duplicats.ts`).
 * Serveix perquè una edició, un esborrat o un "Desfés" oberts amb l'id vell actuïn sobre la fila
 * nova, i perquè reimportar un fitxer amb l'id vell no la dupliqui. Només conté ids (cap dada
 * personal); s'esborra amb la resta de dades locals.
 */
export interface Redireccio {
	idVell: string;
	idNou: string;
	motiu: 'id-en-us' | 'duplicat';
	/** Instant (rellotge del client) en què s'ha creat. */
	creatAt: InstantISO;
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
	},
	{
		// Fase 5 (sync): metadades (propietari de les dades, cursor del pull, última sync).
		versio: 2,
		stores: { meta: 'clau' }
	},
	{
		// Bloc R1: preferències (municipi d'origen). Les ascensions no canvien d'esquema: `companys`
		// no s'indexa i les files antigues es llegeixen sense la clau (vegeu `FilaAscensio`).
		// El cursor del pull es posa a zero perquè la sync següent ho torni a baixar tot: així
		// arriben els companys que un altre dispositiu ja hagi desat en files que aquest dispositiu
		// va baixar amb la versió anterior (que no demanava la columna).
		versio: 3,
		stores: { preferencies: 'clau' },
		upgrade: async (tx) => {
			await tx.table('meta').where('clau').equals('cursorPull').modify({ valor: null });
		}
	},
	{
		// Deduplicació (entre dispositius i importació): ids vells → ids nous (`Redireccio`).
		versio: 4,
		stores: { redireccions: 'idVell' }
	}
];

export class CarnetDb extends Dexie {
	ascensions!: EntityTable<FilaAscensio, 'id'>;
	outbox!: EntityTable<EntradaOutbox, 'ascensioId'>;
	meta!: EntityTable<EntradaMeta, 'clau'>;
	preferencies!: EntityTable<EntradaPreferencia, 'clau'>;
	redireccions!: EntityTable<Redireccio, 'idVell'>;

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

/**
 * Instància única (s'obre de manera mandrosa en la primera operació). En cada obertura, abans
 * que la UI hi llegeixi, es buiden les làpides que ja no es poden desfer (`lapides.ts`). Si la
 * purga falla, la BD s'obre igualment (es tornarà a provar a la sync o en la propera obertura).
 */
export function obtenirBd(): CarnetDb {
	if (!bd) {
		const nova = new CarnetDb();
		nova.on(
			'ready',
			(vip) =>
				purgarLapides(vip as CarnetDb).catch((e: unknown) =>
					console.warn('[bd] no s’han pogut buidar les làpides', e)
				),
			true
		);
		bd = nova;
	}
	return bd;
}

/** Tanca i oblida la instància (tests i canvis de compte futurs). */
export function tancarBd(): void {
	bd?.close();
	bd = null;
}
