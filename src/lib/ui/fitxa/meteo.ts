/**
 * Presentació de la previsió meteorològica de la fitxa (fase 6a), sense DOM: es pot provar a Node.
 * El codi del temps és el codi WMO que fa servir Open-Meteo (`weather_code`).
 */

export type CategoriaTemps =
	'sere' | 'poc-nuvol' | 'nuvol' | 'boira' | 'plugim' | 'pluja' | 'neu' | 'tempesta' | 'desconegut';

/** Codi WMO → categoria d'icona i text. Els codis desconeguts no s'inventen: `desconegut`. */
export function categoriaTemps(codi: number | null | undefined): CategoriaTemps {
	if (codi === null || codi === undefined || !Number.isFinite(codi)) return 'desconegut';
	if (codi === 0) return 'sere';
	if (codi === 1 || codi === 2) return 'poc-nuvol';
	if (codi === 3) return 'nuvol';
	if (codi === 45 || codi === 48) return 'boira';
	if (codi >= 51 && codi <= 57) return 'plugim';
	if ((codi >= 61 && codi <= 67) || (codi >= 80 && codi <= 82)) return 'pluja';
	if ((codi >= 71 && codi <= 77) || codi === 85 || codi === 86) return 'neu';
	if (codi >= 95 && codi <= 99) return 'tempesta';
	return 'desconegut';
}

const unitat = (locale: string, unit: string, decimals = 0) =>
	new Intl.NumberFormat(locale, {
		style: 'unit',
		unit,
		unitDisplay: 'short',
		maximumFractionDigits: decimals
	});

/** 12.4 → "12 °C" (sense "-0"). */
export function formatTemperatura(graus: number, locale: string): string {
	const arrodonit = Math.round(graus);
	return unitat(locale, 'celsius').format(arrodonit === 0 ? 0 : arrodonit);
}

/** Velocitat del vent en km/h: 23.6 → "24 km/h". */
export function formatVent(kmh: number, locale: string): string {
	return unitat(locale, 'kilometer-per-hour').format(Math.round(kmh));
}

/** Precipitació en mm, amb un decimal com a màxim: 2.35 → "2,4 mm", 0 → "0 mm". */
export function formatPrecipitacio(mm: number, locale: string): string {
	return unitat(locale, 'millimeter', 1).format(Math.max(0, mm));
}

/** Probabilitat (0–100) → "40 %" / "40 %" segons l'idioma. */
export function formatProbabilitat(percent: number, locale: string): string {
	return new Intl.NumberFormat(locale, { style: 'percent', maximumFractionDigits: 0 }).format(
		Math.min(100, Math.max(0, percent)) / 100
	);
}

/** Dia relatiu a avui (`0` avui, `1` demà, altres `null`) a partir de dates ISO. */
export function diesDesDe(avui: string, data: string): number {
	const a = Date.parse(`${avui.slice(0, 10)}T00:00:00Z`);
	const b = Date.parse(`${data.slice(0, 10)}T00:00:00Z`);
	return Math.round((b - a) / 86_400_000);
}

/** Edat de la previsió en minuts (`null` si la data no és vàlida). */
export function edatMinuts(actualitzat: string, ara: Date): number | null {
	const t = Date.parse(actualitzat);
	if (Number.isNaN(t)) return null;
	return Math.max(0, Math.round((ara.getTime() - t) / 60_000));
}

/** Edat relativa: "fa 5 minuts", "fa 2 hores", "fa 1 dia" / "hace 2 horas"… */
export function formatEdat(minuts: number, locale: string): string {
	const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
	if (minuts < 60) return rtf.format(-Math.max(1, minuts), 'minute');
	if (minuts < 48 * 60) return rtf.format(-Math.round(minuts / 60), 'hour');
	return rtf.format(-Math.round(minuts / 1440), 'day');
}

/**
 * Una previsió és antiga si té més de 6 h: el servidor la renova cada 3 h, i el service worker en
 * pot servir una de fins a 3 dies sense connexió.
 */
export const EDAT_ANTIGA_MIN = 6 * 60;
