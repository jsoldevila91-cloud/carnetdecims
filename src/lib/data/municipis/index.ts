/**
 * Municipis d'origen (bloc R1). Conjunt generat per `npm run municipis:build`
 * (`scripts/municipis/build.ts`) a partir de l'ICGC; **no editeu el JSON a mà**.
 *
 * Es carrega **en diferit**: el JSON (980 entrades, uns 18 kB comprimit) és un fitxer estàtic del
 * propi web (`_app/immutable/assets/municipis.[hash].json`, `?url` de Vite) que només es demana
 * amb `fetch` quan s'obre el selector de municipi o quan hi ha un origen desat. La cerca es fa
 * en memòria, sense xarxa. Aquest mòdul no importa Dexie ni el framework.
 *
 * Per què `fetch` i no `import()`: Chromium desa a la memòria de mòduls un `import()` fallit
 * (p. ex. sense connexió) i el reintent el torna a rebutjar sense demanar-lo fins que es
 * recarrega la pàgina. Un `fetch` fallit no es desa enlloc: "Torna-ho a provar" funciona.
 *
 * Service worker: el fitxer és a `$service-worker.build` (amb hash), per tant va al precache de
 * la versió com fins ara el chunk: el selector funciona sense connexió des de la instal·lació.
 * Sense SW (primera visita, dev), la caché HTTP del navegador el conserva (immutable).
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
import URL_MUNICIPIS from './municipis.json?url';

/** Text d'atribució de la font (per a la metodologia i el peu del selector). */
export const FONT_MUNICIPIS = 'Institut Cartogràfic i Geològic de Catalunya (ICGC), CC BY 4.0';

/** Versió del conjunt de municipis (canvia quan es regenera amb canvis). */
export const MUNICIPIS_VERSIO = '2026-10';

let promesa: Promise<readonly Municipi[]> | null = null;

/** Baixa i llegeix el JSON compacte (`DadesMunicipis`). */
async function llegirDades(): Promise<DadesMunicipis> {
	if (import.meta.env.SSR) {
		// Node (tests, SSR): no hi ha cap origen a què fer `fetch`; s'importa el JSON. Vite treu
		// aquesta branca del build del client (no hi queda cap chunk de municipis).
		return (await import('./municipis.json')).default as unknown as DadesMunicipis;
	}
	const res = await fetch(URL_MUNICIPIS, { credentials: 'same-origin' });
	if (!res.ok) throw new Error(`Municipis: HTTP ${res.status}`);
	return (await res.json()) as DadesMunicipis;
}

/**
 * Tots els municipis (Catalunya + parròquies d'Andorra + poblacions de la Catalunya Nord). La
 * primera crida baixa el fitxer; les següents reutilitzen el resultat. Si la baixada falla (sense
 * connexió i sense caché), la promesa es rebutja i la crida següent ho torna a provar de debò.
 */
export function carregarMunicipis(): Promise<readonly Municipi[]> {
	if (!promesa) {
		const p = llegirDades().then((d) => Object.freeze(desempaquetarMunicipis(d)));
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
