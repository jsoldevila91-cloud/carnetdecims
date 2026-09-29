/**
 * Amplada estimada (en em) de la paraula més llarga d'un titular en Archivo ample
 * (`.x-wide`: majúscules, `font-stretch: 125%`, negreta 900, `letter-spacing: -0.01em`).
 * Serveix perquè el H1 de la fitxa triï una mida que faci cabre la paraula sencera, sense
 * partir-la ni desbordar a 320 px ("CASTELLSAPERA", "MONTCORBISON", "COMABONA").
 *
 * Amplades mesurades al navegador (Chrome, Archivo Variable) i arrodonides a l'alça.
 */
const AMPLADES: Readonly<Record<string, number>> = {
	A: 0.94,
	B: 0.92,
	C: 0.93,
	D: 0.92,
	E: 0.85,
	F: 0.8,
	G: 1,
	H: 1,
	I: 0.39,
	J: 0.75,
	K: 0.98,
	L: 0.78,
	M: 1.17,
	N: 1,
	O: 1,
	P: 0.86,
	Q: 1,
	R: 0.93,
	S: 0.87,
	T: 0.87,
	U: 0.98,
	V: 0.93,
	W: 1.22,
	X: 0.95,
	Y: 0.96,
	Z: 0.87,
	À: 0.94,
	È: 0.85,
	É: 0.85,
	Í: 0.39,
	Ï: 0.39,
	Ò: 1,
	Ó: 1,
	Ú: 0.98,
	Ü: 0.98,
	Ç: 0.93,
	"'": 0.31,
	'’': 0.31,
	'·': 0.41,
	'-': 0.41,
	'(': 0.5,
	')': 0.5
};

/** Lletres desconegudes (xifres, altres alfabets): amplada prudent. */
const PER_DEFECTE = 1;

/** Espai entre paraules (em). */
const ESPAI = 0.3;

const ampleParaula = (p: string) =>
	[...p].reduce((suma, lletra) => suma + (AMPLADES[lletra] ?? PER_DEFECTE), 0);

const paraules = (text: string) => text.trim().toLocaleUpperCase('ca').split(/\s+/).filter(Boolean);

/** Amplada (em) de la paraula més llarga: la mida del titular ha de fer-la cabre sencera. */
export function ampleParaulaMesLlargaEm(text: string): number {
	return Math.max(1, ...paraules(text).map(ampleParaula));
}

/** Amplada (em) del text sencer en una sola línia, espais inclosos. */
export function ampleTextEm(text: string): number {
	const ps = paraules(text);
	return Math.max(1, ps.reduce((suma, p) => suma + ampleParaula(p), 0) + ESPAI * (ps.length - 1));
}

/**
 * Amplada mínima de línia (em) perquè el titular hi càpiga en `linies` línies amb el salt de
 * línia per paraules del navegador (voraç). Opcionalment, un sufix que no es parteix
 * (`white-space: nowrap`) i va a una mida relativa `escala` (p. ex. "(3.143 m)" a 0,5em):
 * el H1 de la fitxa "{nom} ({alt} m)" (docs/02 §4.1).
 *
 * A diferència de `ampleTextEm / linies`, té en compte que les paraules no es parteixen:
 * "Sant Salvador de les Espases" no cap en 3 línies d'un terç de l'amplada total.
 */
export function ampleLiniesEm(
	text: string,
	linies: number,
	sufix?: { text: string; escala: number }
): number {
	const items = paraules(text).map(ampleParaula);
	if (sufix && sufix.text.trim()) {
		const ps = paraules(sufix.text);
		items.push(
			sufix.escala * (ps.reduce((suma, p) => suma + ampleParaula(p), 0) + ESPAI * (ps.length - 1))
		);
	}
	if (items.length === 0) return 1;

	const liniesAmb = (ample: number) => {
		let n = 1;
		let actual = items[0];
		for (const w of items.slice(1)) {
			if (actual + ESPAI + w <= ample) actual += ESPAI + w;
			else {
				n++;
				actual = w;
			}
		}
		return n;
	};

	let lo = Math.max(...items);
	let hi = items.reduce((s, w) => s + w, 0) + ESPAI * (items.length - 1);
	if (liniesAmb(lo) <= linies) return Math.max(1, lo);
	for (let i = 0; i < 40; i++) {
		const mig = (lo + hi) / 2;
		if (liniesAmb(mig) <= linies) hi = mig;
		else lo = mig;
	}
	return Math.max(1, hi);
}
