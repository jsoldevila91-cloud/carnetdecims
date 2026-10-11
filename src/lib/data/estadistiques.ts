/**
 * Estadístiques personals vives (bloc R1): les ascensions del dispositiu + el municipi d'origen,
 * calculades amb `calcularEstadistiques` (`$lib/domain`). Res no es desa ni surt del dispositiu.
 * També els suggeriments de companys per al formulari del diari.
 */
import { liveQuery } from 'dexie';
import {
	avuiLocal,
	calcularEstadistiques,
	companysUsats,
	type CimCataleg,
	type CompanyUsat,
	type Estadistiques,
	type Municipi,
	type OpcionsSuggeriments
} from '$lib/domain';
import { vivesDeFiles, type StoreLectura } from './ascensions';
import { CIMS } from './catalog/cataleg';
import { indexedDbDisponible, obtenirBd } from './local/db';
import { ara } from './local/rellotge';
import { resoldreMunicipi } from './origen';

export interface EstatEstadistiques {
	/** La primera lectura d'IndexedDB ja ha arribat (si no: skeleton, no "sense dades"). */
	carregat: boolean;
	/** Municipi d'origen fet servir per a `cimMesLlunya`, o `null` si no n'hi ha. */
	origen: Municipi | null;
	estadistiques: Estadistiques<CimCataleg>;
}

async function llegir() {
	const bd = obtenirBd();
	const [files, pref] = await Promise.all([bd.ascensions.toArray(), bd.preferencies.get('origen')]);
	return { ascensions: vivesDeFiles(files), codi: pref?.valor ?? null };
}

function calcular(
	ascensions: Parameters<typeof calcularEstadistiques>[0],
	origen: Municipi | null
): Estadistiques<CimCataleg> {
	return calcularEstadistiques(ascensions, CIMS, { avui: avuiLocal(ara()), origen });
}

/** Estadístiques d'ara mateix (una sola lectura). */
export async function estadistiquesActuals(): Promise<EstatEstadistiques> {
	const { ascensions, codi } = await llegir();
	const origen = await resoldreMunicipi(codi);
	return { carregat: true, origen, estadistiques: calcular(ascensions, origen) };
}

let darrer: EstatEstadistiques | null = null;

/**
 * Estadístiques vives per a `$estadistiques` de Svelte: es recalculen quan canvien les ascensions
 * (també per la sync) o el municipi d'origen. Emet de seguida l'últim resultat conegut (o les
 * estadístiques buides amb `carregat: false`). El conjunt de municipis només es carrega si hi ha
 * un origen desat. En SSR/prerender emet les buides i no toca IndexedDB.
 */
export function estadistiques(): StoreLectura<EstatEstadistiques> {
	return {
		subscribe(run) {
			run(darrer ?? { carregat: false, origen: null, estadistiques: calcular([], null) });
			if (!indexedDbDisponible()) return () => {};
			let viu = true;
			let torn = 0;
			const sub = liveQuery(llegir).subscribe({
				next: ({ ascensions, codi }) => {
					const meu = ++torn;
					void resoldreMunicipi(codi).then((origen) => {
						// Un canvi posterior ja ha arribat: aquest resultat és vell.
						if (!viu || meu !== torn) return;
						darrer = { carregat: true, origen, estadistiques: calcular(ascensions, origen) };
						run(darrer);
					});
				},
				error: (e: unknown) => console.error('[estadistiques] liveQuery', e)
			});
			return () => {
				viu = false;
				sub.unsubscribe();
			};
		}
	};
}

/**
 * Companys ja usats a les ascensions del dispositiu (per a l'autocompletat i per a "amb qui has
 * pujat més"): vegeu `companysUsats` (`$lib/domain`) per a l'ordre i les opcions. Si la UI ja té
 * la llista d'ascensions (`ascensionsVives()`), pot cridar `suggerirCompanys` directament.
 */
export async function companysDelDiari(opcions: OpcionsSuggeriments = {}): Promise<CompanyUsat[]> {
	return companysUsats((await llegir()).ascensions, opcions);
}

/** Només per a tests: oblida l'últim resultat emès. */
export function _reiniciarEstadistiquesPerTests(): void {
	darrer = null;
}
