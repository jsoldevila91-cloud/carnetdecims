/**
 * Municipis d'origen (bloc R1). Conjunt generat per `npm run municipis:build`
 * (`scripts/municipis/build.ts`) a partir de l'ICGC; **no editeu el JSON a mà**.
 *
 * Es carrega **en diferit**: el JSON (980 entrades, uns 18 kB comprimit) va en un chunk a part
 * que només es demana quan s'obre el selector de municipi o quan hi ha un origen desat. Aquest
 * mòdul no importa Dexie ni el framework.
 *
 * Atribució (CC BY 4.0): `FONT_MUNICIPIS`.
 */
import {
	cercarMunicipis,
	desempaquetarMunicipis,
	municipiPerCodi,
	type DadesMunicipis,
	type Municipi,
	type OpcionsCercaMunicipis
} from '$lib/domain';

/** Text d'atribució de la font (per a la metodologia i el peu del selector). */
export const FONT_MUNICIPIS = 'Institut Cartogràfic i Geològic de Catalunya (ICGC), CC BY 4.0';

/** Versió del conjunt de municipis (canvia quan es regenera amb canvis). */
export const MUNICIPIS_VERSIO = '2026-10';

let promesa: Promise<readonly Municipi[]> | null = null;

/**
 * Tots els municipis (Catalunya + parròquies d'Andorra + poblacions de la Catalunya Nord). La
 * primera crida baixa el chunk; les següents reutilitzen el resultat. Si la baixada falla (sense
 * connexió i sense caché), la promesa es rebutja i la crida següent ho torna a provar.
 */
export function carregarMunicipis(): Promise<readonly Municipi[]> {
	if (!promesa) {
		const p = import('./municipis.json').then((m) =>
			Object.freeze(desempaquetarMunicipis(m.default as unknown as DadesMunicipis))
		);
		promesa = p;
		p.catch(() => {
			if (promesa === p) promesa = null;
		});
	}
	return promesa;
}

/**
 * Cerca de municipis per al selector (sense accents, majúscules, apòstrofs ni guions; també pel
 * nom del cap). Vegeu l'ordre a `cercarMunicipis` (`$lib/domain`). Consulta buida → `[]`.
 */
export async function cercarMunicipi(
	consulta: string,
	opcions: OpcionsCercaMunicipis = {}
): Promise<Municipi[]> {
	return cercarMunicipis(consulta, await carregarMunicipis(), opcions);
}

/** Municipi d'un codi, o `null` si no existeix al conjunt. */
export async function municipiDeCodi(codi: string | null | undefined): Promise<Municipi | null> {
	if (!codi) return null;
	return municipiPerCodi(await carregarMunicipis(), codi);
}
