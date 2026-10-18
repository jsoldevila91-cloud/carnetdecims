/**
 * Proveïdor de previsió meteorològica intercanviable (docs/01-stack.md §4).
 *
 * Avui: Open-Meteo (`open-meteo.ts`). Si algun dia el web té publicitat o subscripcions (ús
 * comercial), es pot canviar per MET Norway (CC BY 4.0, ús comercial gratuït, User-Agent
 * identificatiu obligatori) implementant aquesta interfície: el contracte públic
 * (`PrevisioMeteo`, `$lib/platform/meteo.ts`) no canvia.
 */
import type { DiaMeteo, FontMeteo } from '$lib/platform/meteo';

export interface PuntMeteo {
	lat: number;
	lon: number;
	/** Altitud del cim (m): el proveïdor hi ajusta la temperatura (no la del model, que és més baixa). */
	altitud: number;
}

export interface ProveidorMeteo {
	/** Atribució que la UI ha de mostrar (CC BY 4.0). */
	readonly font: FontMeteo;
	/**
	 * Previsió diària de `dies` dies a partir d'avui (zona Europe/Madrid).
	 * Llança `ErrorProveidor` si la resposta no arriba, no és 200 o no té el format esperat.
	 */
	previsio(punt: PuntMeteo, dies: number, signal?: AbortSignal): Promise<DiaMeteo[]>;
}

export class ErrorProveidor extends Error {
	constructor(missatge: string) {
		super(missatge);
		this.name = 'ErrorProveidor';
	}
}

/** Identificació nostra davant dels proveïdors (MET Norway l'exigeix; Open-Meteo l'agraeix). */
export const USER_AGENT = 'CarnetDeCims/1.0 (+https://carnetdecims.cat; hola@carnetdecims.cat)';

/** Temps actual en brut d'un punt (el servei el compacta a `TempsActual`). */
export interface ActualPunt {
	/** Codi de temps WMO. */
	codi: number;
	/** Temperatura a l'altitud del punt (°C). */
	temperatura: number;
	esDia: boolean;
	/** Hora local de validesa, `AAAA-MM-DDTHH:MM`. */
	hora: string;
}

/** Proveïdor del temps actual de molts punts alhora (`/api/meteo/ara`). */
export interface ProveidorMeteoActual {
	readonly font: FontMeteo;
	/**
	 * Temps actual de cada punt, en el mateix ordre; `null` per als punts sense dades completes.
	 * Llança `ErrorProveidor` si la resposta no arriba, no és 200 o no té el format esperat.
	 */
	actual(punts: readonly PuntMeteo[], signal?: AbortSignal): Promise<(ActualPunt | null)[]>;
}
