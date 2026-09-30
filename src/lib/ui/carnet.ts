/**
 * Presentació del carnet de segells (bloc 4b): inicials i data curta dels segells petits,
 * inclinació estable de cada segell. Funcions pures (sense DOM).
 */

const ROMAN_MONTHS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];

/** Articles, preposicions i contraccions que no donen inicial ("Tossal de la Truita" → "TT"). */
const PARAULES_BUIDES = new Set([
	'de',
	'del',
	'dels',
	'des',
	'la',
	'les',
	'el',
	'els',
	'lo',
	'los',
	'l',
	'd',
	'i',
	'y',
	'sa',
	'es',
	'en',
	'na',
	'a'
]);

/**
 * Inicials d'un cim per al segell petit de la casella (2–3 lletres, majúscules):
 * "Pedraforca" → "PE", "Puig de la Canal Baridana" → "PCB", "L'Elefant" → "EL".
 * Sense parèntesis ("La Tossa (Tivissa)" → "TO").
 */
export function inicialsCim(nom: string): string {
	const net = nom
		.replace(/\([^)]*\)/g, ' ')
		.normalize('NFD')
		.replace(/[̀-ͯ]/g, '');
	const paraules = net
		.split(/[\s'’\-·.]+/)
		.map((p) => p.replace(/[^\p{L}\p{N}]/gu, ''))
		.filter(Boolean);
	const plenes = paraules.filter((p) => !PARAULES_BUIDES.has(p.toLowerCase()));
	const base = plenes.length > 0 ? plenes : paraules;
	if (base.length === 0) return '?';
	if (base.length === 1) return base[0].slice(0, 2).toUpperCase();
	return base
		.slice(0, 3)
		.map((p) => p[0])
		.join('')
		.toUpperCase();
}

/**
 * Data curta de la casella (numèrica perquè hi càpiga a 320 px): 2025-06-12 → "12.6.25".
 * El nom accessible de la casella porta la data llarga.
 */
export function dataSegellCurta(iso: string): string {
	const [a, mes, dia] = iso.slice(0, 10).split('-').map(Number);
	if (!a || !mes || !dia) return iso;
	return `${dia}.${mes}.${String(a % 100).padStart(2, '0')}`;
}

/** Data del segell gran a partir d'una data ISO: 2025-06-12 → "12 · VI · 2025". */
export function dataSegellLlarga(iso: string): string {
	const [a, mes, dia] = iso.slice(0, 10).split('-').map(Number);
	if (!a || !mes || !dia) return iso;
	return `${dia} · ${ROMAN_MONTHS[mes - 1] ?? mes} · ${a}`;
}

/**
 * Inclinació del segell (graus, −7..7) estable per a cada casella: el carnet sembla segellat a mà
 * però no canvia entre renderitzats.
 */
export function inclinacioSegell(llavor: number): number {
	const x = Math.sin(llavor * 12.9898) * 43758.5453;
	return Math.round((x - Math.floor(x)) * 14 - 7);
}

/** Números de les caselles d'una pàgina (1..100). */
export const CASELLES_PAGINA: readonly number[] = Object.freeze(
	Array.from({ length: 100 }, (_, i) => i + 1)
);
