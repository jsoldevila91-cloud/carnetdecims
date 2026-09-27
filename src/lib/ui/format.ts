/** Formatadors de presentació compartits per la UI (sense dependències). */

const ROMAN_MONTHS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];

/** Altitud amb separador de milers amb punt, també per a 4 xifres: 2506 → "2.506". */
export function formatAltitude(metres: number): string {
	return Math.round(metres)
		.toString()
		.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

/** Data de segell: 2026-09-14 → "14 · IX · 2026". */
export function formatStampDate(date: Date): string {
	return `${date.getDate()} · ${ROMAN_MONTHS[date.getMonth()]} · ${date.getFullYear()}`;
}

/** Numeració romana de les pàgines del carnet (1–5). */
export function romanPage(n: number): string {
	return ['I', 'II', 'III', 'IV', 'V'][n - 1] ?? String(n);
}
