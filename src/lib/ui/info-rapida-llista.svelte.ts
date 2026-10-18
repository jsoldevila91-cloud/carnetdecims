/**
 * Càrrega de la informació ràpida de les llistes de cims (R5.2), només al client:
 * - temps d'ara de tots els cims amb una sola petició (`obtenirMeteoAra`, no llança mai: sense
 *   xarxa, `null` i no hi ha icones);
 * - restriccions vigents avui (`restriccionsVigents`, amb la data local del dispositiu: les
 *   pàgines són prerenderitzades i no poden saber quin dia és).
 * Cridar `carregar()` des d'`onMount` (mai al prerender).
 */
import { avuiLocal, restriccionsVigents, type CimCataleg, type DataISO } from '$lib/domain';
import { obtenirMeteoAra, type MeteoAra } from '$lib/platform/meteo';
import type { AccesAra, InfoRapidaCim } from './info-rapida';

export class InfoRapidaLlista {
	meteo = $state.raw<MeteoAra | null>(null);
	acces = $state.raw<ReadonlyMap<number, AccesAra> | null>(null);
	avui = $state<DataISO | null>(null);

	#cims: readonly CimCataleg[];

	constructor(cims: readonly CimCataleg[]) {
		this.#cims = cims;
	}

	/** Restriccions (síncron) i temps (asíncron). Retorna una funció per cancel·lar. */
	carregar(): () => void {
		const avui = avuiLocal();
		this.avui = avui;
		try {
			this.acces = restriccionsVigents(this.#cims, avui);
		} catch (e) {
			console.warn('[restriccions]', e);
		}
		const ctrl = new AbortController();
		void obtenirMeteoAra({ signal: ctrl.signal }).then((meteo) => {
			if (!ctrl.signal.aborted) this.meteo = meteo;
		});
		return () => ctrl.abort();
	}

	/** Informació d'un cim (per a `LlistaCims` / `FilaEssencial`). */
	per = (cim: CimCataleg): InfoRapidaCim | null => {
		const t = this.meteo?.cims[cim.slug];
		const a = this.acces?.get(cim.id);
		if (!t && !a) return null;
		return {
			temps: t ? { categoria: t.categoria, temperatura: t.temperatura, esDia: t.esDia } : null,
			acces: a ? { tipus: a.tipus, fins: a.fins, incerta: a.incerta } : null,
			hora: this.meteo?.hora ?? null,
			avui: this.avui
		};
	};
}
