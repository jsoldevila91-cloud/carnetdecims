/**
 * Municipi d'origen de l'usuari (bloc R1): preferència opcional per calcular "el cim més llunyà"
 * i, a R2, "El teu proper cim". Només el municipi, mai l'adreça.
 *
 * - **Sense sessió** viu només al dispositiu (taula `preferencies` d'IndexedDB).
 * - **Amb sessió** se sincronitza amb el compte (`public.perfils`, RPC `sync_origen`) amb la
 *   mateixa regla que les ascensions: guanya el canvi més recent (`updatedAt` del client; empat →
 *   servidor). La sync la fa `sync.ts`; desar-lo aquí només el marca com a pendent.
 * - És una dada personal: no va mai a cap URL ni a cap registre.
 *
 * Què passa amb l'origen en cada cas:
 * - `esborrarTot()` i `sortir({ esborrarDades: true })`: s'esborra del dispositiu (no del compte).
 * - `sortir()`: es queda al dispositiu, com les ascensions.
 * - `esborrarCompte()`: s'esborra del núvol amb el perfil; al dispositiu s'esborra també, o es
 *   conserva (pendent de pujar a un compte futur) amb `conservarDispositiu: true`.
 * - Dades d'un altre compte al dispositiu (`resoldreConflicteCompte`): `descartar-locals`
 *   l'esborra i baixa el del compte actual; `fusionar` el puja com un canvi local més (LWW).
 * - Importar un JSON: vegeu `importarDades`.
 */
import { liveQuery } from 'dexie';
import { esCodiMunicipi, municipiPerCodi, type Municipi } from '$lib/domain';
import type { StoreLectura } from './ascensions';
import { indexedDbDisponible, obtenirBd } from './local/db';
import { instantEscriptura } from './local/rellotge';
import { carregarMunicipis } from './municipis';

export type CodiErrorOrigen = 'origen:desconegut';

/** El codi no és de cap municipi del conjunt (no s'ha desat res). */
export class ErrorOrigen extends Error {
	readonly codi: CodiErrorOrigen = 'origen:desconegut';

	constructor() {
		// El codi rebut no es posa al missatge: és una dada personal (no ha d'anar a cap registre).
		super('Municipi d’origen desconegut');
		this.name = 'ErrorOrigen';
	}
}

/** Codi del municipi d'origen desat al dispositiu, o `null` si no n'hi ha. */
export async function llegirOrigen(): Promise<string | null> {
	return (await obtenirBd().preferencies.get('origen'))?.valor ?? null;
}

/** Municipi d'origen desat (carrega el conjunt de municipis si cal), o `null`. */
export async function llegirMunicipiOrigen(): Promise<Municipi | null> {
	const codi = await llegirOrigen();
	return codi ? municipiPerCodi(await carregarMunicipis(), codi) : null;
}

/**
 * Desa el municipi d'origen (`Municipi.codi`) o el treu (`null`). Desar el mateix valor no canvia
 * res. Amb sessió, la sync el puja al cap d'un moment; sense sessió, es queda al dispositiu.
 * @throws ErrorOrigen si el codi no és de cap municipi del conjunt.
 */
export async function desarOrigen(codi: string | null): Promise<void> {
	if (codi !== null) {
		if (!esCodiMunicipi(codi) || !municipiPerCodi(await carregarMunicipis(), codi)) {
			throw new ErrorOrigen();
		}
	}
	const bd = obtenirBd();
	await bd.transaction('rw', bd.preferencies, async () => {
		const actual = await bd.preferencies.get('origen');
		if ((actual?.valor ?? null) === codi) return;
		await bd.preferencies.put({
			clau: 'origen',
			valor: codi,
			updatedAt: instantEscriptura(actual?.updatedAt),
			pendent: 1
		});
	});
}

/** Treu el municipi d'origen (equival a `desarOrigen(null)`). */
export function esborrarOrigen(): Promise<void> {
	return desarOrigen(null);
}

export interface EstatOrigen {
	/** La primera lectura d'IndexedDB (i, si cal, la càrrega dels municipis) ja ha arribat. */
	carregat: boolean;
	/** Codi desat, o `null` si no n'hi ha. */
	codi: string | null;
	/**
	 * Municipi del codi desat. `null` si no n'hi ha o si el codi no és al conjunt de municipis
	 * (`codi !== null && municipi === null`: cal tornar-lo a triar) o si el conjunt no s'ha pogut
	 * carregar (sense connexió i sense caché).
	 */
	municipi: Municipi | null;
}

let darrer: EstatOrigen | null = null;

/** Resol el municipi d'un codi sense llançar (si el conjunt no es pot carregar, `null`). */
export async function resoldreMunicipi(codi: string | null): Promise<Municipi | null> {
	if (!codi) return null;
	try {
		return municipiPerCodi(await carregarMunicipis(), codi);
	} catch {
		return null;
	}
}

/**
 * Municipi d'origen viu per a `$origen` de Svelte. Emet de seguida l'últim estat conegut (o
 * `carregat: false`) i després cada canvi (de l'usuari o de la sync). El conjunt de municipis
 * només es carrega si hi ha un origen desat. En SSR/prerender no toca IndexedDB.
 */
export function origen(): StoreLectura<EstatOrigen> {
	return {
		subscribe(run) {
			run(darrer ?? { carregat: false, codi: null, municipi: null });
			if (!indexedDbDisponible()) return () => {};
			let viu = true;
			let torn = 0;
			const sub = liveQuery(() => llegirOrigen()).subscribe({
				next: (codi) => {
					const meu = ++torn;
					void resoldreMunicipi(codi).then((municipi) => {
						// Un canvi posterior ja ha arribat: aquest resultat és vell.
						if (!viu || meu !== torn) return;
						darrer = { carregat: true, codi, municipi };
						run(darrer);
					});
				},
				error: (e: unknown) => console.error('[origen] liveQuery', e)
			});
			return () => {
				viu = false;
				sub.unsubscribe();
			};
		}
	};
}

/** Només per a tests: oblida l'últim estat emès. */
export function _reiniciarOrigenPerTests(): void {
	darrer = null;
}
