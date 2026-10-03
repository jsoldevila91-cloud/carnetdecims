/**
 * Proveïdor Open-Meteo (https://open-meteo.com/en/docs), API gratuïta per a ús no comercial.
 *
 * Condicions verificades el 2026-10-03 (https://open-meteo.com/en/terms,
 * https://open-meteo.com/en/licence): ús no comercial (web sense publicitat ni subscripcions,
 * com aquest), < 10.000 crides/dia, 5.000/h, 600/min; dades CC BY 4.0 amb atribució i enllaç a
 * la llicència. Amb la cache de 3 h per cim (cada cim és una clau; 150–522 cims) en fem com a
 * màxim ~8 per cim i dia per centre de dades de Cloudflare.
 *
 * - `elevation` = altitud del cim: Open-Meteo fa el *downscaling* estadístic de la temperatura a
 *   aquesta cota (per defecte faria servir un MDT de 90 m, que als cims dona cotes més baixes).
 * - Variables diàries + `freezing_level_height` horària (no n'hi ha de diària), que es redueix a
 *   la cota més baixa de cada dia.
 * - `models` per defecte (`best_match`: AROME/ICON-D2 a curt termini a la zona).
 */
import type { DiaMeteo, FontMeteo } from '$lib/platform/meteo';
import { ErrorProveidor, USER_AGENT, type ProveidorMeteo, type PuntMeteo } from './proveidor';

export const API_OPEN_METEO = 'https://api.open-meteo.com/v1/forecast';

export const FONT_OPEN_METEO: FontMeteo = {
	nom: 'Open-Meteo',
	url: 'https://open-meteo.com/',
	llicencia: 'CC BY 4.0',
	llicenciaUrl: 'https://creativecommons.org/licenses/by/4.0/'
};

export const ZONA_HORARIA = 'Europe/Madrid';

const DIARIES = [
	'temperature_2m_max',
	'temperature_2m_min',
	'wind_speed_10m_max',
	'wind_gusts_10m_max',
	'precipitation_sum',
	'precipitation_probability_max',
	'weather_code',
	'cloud_cover_mean'
] as const;

/** URL de la petició (sense cap dada del visitant: només el punt del cim). */
export function urlOpenMeteo(punt: PuntMeteo, dies: number): string {
	const p = new URLSearchParams({
		latitude: punt.lat.toFixed(4),
		longitude: punt.lon.toFixed(4),
		elevation: String(Math.round(punt.altitud)),
		daily: DIARIES.join(','),
		hourly: 'freezing_level_height',
		timezone: ZONA_HORARIA,
		forecast_days: String(dies),
		wind_speed_unit: 'kmh',
		temperature_unit: 'celsius',
		precipitation_unit: 'mm'
	});
	return `${API_OPEN_METEO}?${p}`;
}

type Serie = readonly (number | null)[];

type RespostaOpenMeteo = {
	daily?: Partial<Record<(typeof DIARIES)[number], Serie>> & { time?: readonly string[] };
	hourly?: { time?: readonly string[]; freezing_level_height?: Serie };
};

const num = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);
const d1 = (v: number) => Math.round(v * 10) / 10;

/**
 * Converteix la resposta d'Open-Meteo al format propi. Un dia sense temperatura, vent,
 * precipitació o codi de temps es descarta (no s'inventa res); els camps opcionals que falten
 * s'ometen. Llança `ErrorProveidor` si no en queda cap.
 */
export function parsejarOpenMeteo(json: unknown, dies: number): DiaMeteo[] {
	const r = json as RespostaOpenMeteo | null;
	const d = r?.daily;
	const temps = d?.time;
	if (!d || !Array.isArray(temps)) throw new ErrorProveidor('Open-Meteo: resposta sense `daily`');

	// Cota de 0 °C més baixa de cada dia (sèrie horària en hora local: `AAAA-MM-DDTHH:MM`).
	const iso0 = new Map<string, number>();
	const hores = r?.hourly?.time ?? [];
	const nivell = r?.hourly?.freezing_level_height ?? [];
	hores.forEach((h, i) => {
		const v = nivell[i];
		if (typeof h !== 'string' || !num(v)) return;
		const dia = h.slice(0, 10);
		iso0.set(dia, Math.min(iso0.get(dia) ?? Infinity, v));
	});

	const resultat: DiaMeteo[] = [];
	temps.slice(0, dies).forEach((data, i) => {
		const tMax = d.temperature_2m_max?.[i];
		const tMin = d.temperature_2m_min?.[i];
		const vent = d.wind_speed_10m_max?.[i];
		const ratxa = d.wind_gusts_10m_max?.[i];
		const precip = d.precipitation_sum?.[i];
		const codi = d.weather_code?.[i];
		if (!/^\d{4}-\d{2}-\d{2}$/.test(data)) return;
		if (![tMax, tMin, vent, ratxa, precip, codi].every(num)) return;
		const prob = d.precipitation_probability_max?.[i];
		const nuvols = d.cloud_cover_mean?.[i];
		const zero = iso0.get(data);
		resultat.push({
			data,
			tMax: d1(tMax as number),
			tMin: d1(tMin as number),
			ventMax: Math.round(vent as number),
			ratxaMax: Math.round(ratxa as number),
			precipitacio: d1(precip as number),
			probPrecipitacio: num(prob) ? Math.round(prob) : null,
			codi: Math.round(codi as number),
			...(zero !== undefined && Number.isFinite(zero) && { iso0: Math.round(zero / 10) * 10 }),
			...(num(nuvols) && { nuvolositat: Math.round(nuvols) })
		});
	});
	if (resultat.length === 0) throw new ErrorProveidor('Open-Meteo: cap dia complet');
	return resultat;
}

/** Temps màxim d'espera de la resposta d'Open-Meteo. */
export const TIMEOUT_MS = 8000;

export function crearOpenMeteo(f: typeof fetch = fetch): ProveidorMeteo {
	return {
		font: FONT_OPEN_METEO,
		async previsio(punt, dies, signal) {
			const timeout = AbortSignal.timeout(TIMEOUT_MS);
			let res: Response;
			try {
				res = await f(urlOpenMeteo(punt, dies), {
					headers: { accept: 'application/json', 'user-agent': USER_AGENT },
					signal: signal ? AbortSignal.any([signal, timeout]) : timeout
				});
			} catch (e) {
				throw new ErrorProveidor(`Open-Meteo: sense resposta (${(e as Error)?.name ?? 'error'})`);
			}
			if (res.status !== 200) throw new ErrorProveidor(`Open-Meteo: HTTP ${res.status}`);
			let json: unknown;
			try {
				json = await res.json();
			} catch {
				throw new ErrorProveidor('Open-Meteo: JSON no vàlid');
			}
			return parsejarOpenMeteo(json, dies);
		}
	};
}
