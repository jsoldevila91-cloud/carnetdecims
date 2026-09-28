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
