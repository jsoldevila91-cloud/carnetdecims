/**
 * Informació ràpida d'un cim a les llistes (bloc R5.2): el temps d'ara (icona, temperatura) i
 * l'avís si l'accés és restringit avui. Les dades vénen de `obtenirMeteoAra()`
 * (`$lib/platform/meteo`) i de `restriccionsVigents()` (`$lib/domain`), sempre al client
 * (`info-rapida.svelte.ts`). Sense dades, no es mostra res però l'espai queda reservat.
 */
import type { CimCataleg, DataISO, TipusRestriccio } from '$lib/domain';
import type { CategoriaTemps } from '$lib/domain/temps';
import { m } from '$lib/paraglide/messages';

export interface TempsActualCim {
	categoria: CategoriaTemps;
	/** Temperatura actual a l'altitud del cim (°C). */
	temperatura: number | null;
	/** De nit, `sol` es pinta com a lluna ("Serè"). */
	esDia: boolean;
}

/** Restricció vigent avui (subconjunt de `RestriccioVigent`). */
export interface AccesAra {
	tipus: TipusRestriccio;
	/** Darrer dia restringit, si se sap. */
	fins: DataISO | null;
	/** Restricció permanent sense dates: és un dubte ("comprova-ho a la FEEC"), mai "tancat". */
	incerta: boolean;
}

export interface InfoRapidaCim {
	temps?: TempsActualCim | null;
	acces?: AccesAra | null;
	/** Hora local de validesa del temps, `AAAA-MM-DDTHH:MM` (per a l'etiqueta). */
	hora?: string | null;
	/** Data local d'avui (per dir l'any de "fins al…" només si cal). */
	avui?: DataISO | null;
}

/** Funció que dona la informació ràpida d'un cim (o res si encara no n'hi ha). */
export type InfoRapidaPerCim = (cim: CimCataleg) => InfoRapidaCim | null | undefined;

const TIPUS: Record<TipusRestriccio, () => string> = {
	fauna: m.restriction_fauna,
	obres: m.restriction_obres,
	propietat: m.restriction_propietat,
	militar: m.restriction_militar,
	altres: m.restriction_altres
};

const CONDICIO: Record<CategoriaTemps, () => string> = {
	sol: m.quick_weather_sol,
	'poc-nuvol': m.quick_weather_poc_nuvol,
	nuvol: m.quick_weather_nuvol,
	boira: m.quick_weather_boira,
	pluja: m.quick_weather_pluja,
	neu: m.quick_weather_neu,
	tempesta: m.quick_weather_tempesta
};

/** "Assolellat", o "Serè" si és `sol` de nit. */
export function textCondicio(t: Pick<TempsActualCim, 'categoria' | 'esDia'>): string {
	return t.categoria === 'sol' && !t.esDia ? m.quick_weather_sol_nit() : CONDICIO[t.categoria]();
}

/** "2026-10-18T10:15" → "10:15" (o la cadena tal qual si no té hora). */
export function horaCurta(hora: string): string {
	const r = /T(\d{2}:\d{2})/.exec(hora);
	return r ? r[1] : hora;
}

/** "15 de juliol" (amb l'any si no és el de `avui`). */
export function formatFins(fins: DataISO, avui: DataISO | null, locale: string): string {
	const d = new Date(`${fins}T00:00:00Z`);
	const ambAny = !avui || fins.slice(0, 4) !== avui.slice(0, 4);
	return new Intl.DateTimeFormat(locale, {
		day: 'numeric',
		month: 'long',
		...(ambAny ? { year: 'numeric' } : {}),
		timeZone: 'UTC'
	}).format(d);
}

/**
 * Text de l'avís d'accés: "Accés restringit fins al dia 15 de juliol · Protecció de la fauna",
 * "Accés restringit (sense data de fi) · Zona militar" o, si és incerta,
 * "Possible restricció (obres): comprova-ho a la FEEC".
 */
export function textAcces(a: AccesAra, avui: DataISO | null, locale: string): string {
	const tipus = TIPUS[a.tipus]();
	if (a.incerta) return m.quick_access_uncertain({ tipus: tipus.toLocaleLowerCase(locale) });
	if (a.fins) return m.quick_access_until({ data: formatFins(a.fins, avui, locale), tipus });
	return m.quick_access_open({ tipus });
}
