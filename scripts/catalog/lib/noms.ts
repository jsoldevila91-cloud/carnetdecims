/**
 * Normalització i comparació de noms de cims entre fonts (ICGC, IGN, OSM, Wikidata).
 */
import { senseAccents } from '../../../src/lib/domain/toponims.ts';

const ARTICLES = /^(el|la|l|els|les|lo|los|es|sa|le|eth|era|er)\s+/;
const GENERICS =
	/^(pic|pica|puig|tuc|tossal|tossa|turo|serrat|roc|roca|cim|mont|muntanya|pico|sommet|cap|punta|tuca|pui|pal|puigs|grand|gran|tour|torre|castell)\s+(de\s+la\s+|de\s+les\s+|de\s+l\s+|dels\s+|del\s+|des\s+|deth\s+|dera\s+|du\s+|de\s+|d\s+)?/;
const FUNCIONALS = new Set([
	'de',
	'del',
	'dels',
	'd',
	'la',
	'les',
	'el',
	'els',
	'l',
	'lo',
	'los',
	'des',
	'deth',
	'dera',
	'du'
]);

/** Nom sense preposicions ni articles ("Torreta del Montsià" ≈ "Torreta de Montsià"). */
export function clau(s: string): string {
	return norm(s)
		.split(' ')
		.filter((w) => !FUNCIONALS.has(w))
		.join(' ');
}

/** Minúscules, sense accents, parèntesis ni puntuació, sense article inicial. */
export function norm(s: string): string {
	let t = senseAccents(s)
		.toLowerCase()
		.replace(/\([^)]*\)/g, ' ')
		.replace(/[’'`\-.,]/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();
	t = t.replace(ARTICLES, '');
	return t;
}

/** Nucli del topònim: sense el genèric inicial ("Tuc de Maubèrme" → "mauberme"). */
export function nucli(s: string): string {
	const n = norm(s);
	const sense = n.replace(GENERICS, '').replace(ARTICLES, '');
	return sense || n;
}

/**
 * Puntuació de coincidència entre un terme de cerca i un nom candidat:
 * 1 = igual, 0.95 = igual llevat de preposicions/articles, 0.85 = mateix nucli,
 * 0.6 = el candidat conté el terme com a paraules senceres.
 */
export function puntuacioNom(terme: string, candidat: string): number {
	const a = norm(terme);
	const b = norm(candidat);
	if (!a || !b) return 0;
	if (a === b) return 1;
	if (clau(terme) === clau(candidat)) return 0.95;
	const na = nucli(terme);
	const nb = nucli(candidat);
	if (na && na === nb) return 0.85;
	const conte = (x: string, y: string) => ` ${x} `.includes(` ${y} `);
	if (a.length >= 4 && conte(b, a)) return 0.6;
	return 0;
}

/** Millor puntuació d'un candidat (amb diversos noms) contra diversos termes. */
export function millorPuntuacio(termes: string[], noms: string[]): number {
	let m = 0;
	for (const t of termes) for (const n of noms) m = Math.max(m, puntuacioNom(t, n));
	return m;
}

/**
 * Termes de cerca d'un cim: el nom del PDF sense parèntesis, el contingut del parèntesi,
 * les dues parts de "X o Y" i els termes `cerca` explícits.
 */
export function termesDeCerca(nom: string, cerca: string[] = []): string[] {
	const termes = new Set<string>(cerca);
	const sensePar = nom.replace(/\s*\([^)]*\)/, '').trim();
	termes.add(sensePar);
	// El parèntesi pot ser un àlies ("Bony de la Pica") o un qualificador ("Tivissa",
	// "Pedraforca"): només s'usa si no hi ha termes explícits.
	const par = /\(([^)]+)\)/.exec(nom)?.[1];
	if (par && !cerca.length) termes.add(par);
	for (const part of sensePar.split(/ o /)) termes.add(part.trim());
	return [...termes];
}
