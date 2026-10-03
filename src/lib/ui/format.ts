/** Formatadors de presentació compartits per la UI (sense dependències). */

const ROMAN_MONTHS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];

/** Altitud amb separador de milers amb punt, també per a 4 xifres: 2506 → "2.506". */
export function formatAltitude(metres: number): string {
	return Math.round(metres)
		.toString()
		.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

/** Coordenada en graus decimals amb la coma de l'idioma: 42.66695 → "42,66695". */
export function formatCoordinate(graus: number, locale: string, decimals = 5): string {
	return new Intl.NumberFormat(locale, {
		minimumFractionDigits: decimals,
		maximumFractionDigits: decimals,
		useGrouping: false
	}).format(Math.abs(graus));
}

/** Distància en km amb un decimal com a màxim: 3.24 → "3,2", 12.04 → "12". */
export function formatKm(km: number, locale: string): string {
	return new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(km);
}

/** Data de segell: 2026-09-14 → "14 · IX · 2026". */
export function formatStampDate(date: Date): string {
	return `${date.getDate()} · ${ROMAN_MONTHS[date.getMonth()]} · ${date.getFullYear()}`;
}

/** Numeració romana de les pàgines del carnet (1–5). */
export function romanPage(n: number): string {
	return ['I', 'II', 'III', 'IV', 'V'][n - 1] ?? String(n);
}

/**
 * Data ISO (`AAAA-MM-DD`) en format llarg de l'idioma: "29 de setembre de 2026" /
 * "29 de septiembre de 2026". Es calcula en UTC perquè el dia no canviï segons la zona horària.
 */
export function formatDataLlarga(iso: string, locale: string): string {
	const data = new Date(`${iso.slice(0, 10)}T00:00:00Z`);
	if (Number.isNaN(data.getTime())) return iso;
	return new Intl.DateTimeFormat(locale, {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
		timeZone: 'UTC'
	}).format(data);
}

/**
 * Durada en minuts en format curt: 195 → "3 h 15 min", 180 → "3 h", 45 → "45 min".
 * Igual en català i castellà (símbols d'unitat).
 */
export function formatDurada(minuts: number): string {
	const total = Math.max(0, Math.round(minuts));
	const h = Math.floor(total / 60);
	const min = total % 60;
	if (h === 0) return `${min} min`;
	return min === 0 ? `${h} h` : `${h} h ${min} min`;
}
