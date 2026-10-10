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

/**
 * H1 de la fitxa al mòbil: el CSS fixa la mida perquè hi càpiguen `capacitatLiniaEm` em per línia
 * (vegeu el `clamp()` del h1 a `cims/[slug]/+page.svelte`: 100cqi / (paraula · 1,04),
 * 100cqi / (línies · 1,06) i 11cqi). Mentre 11cqi no arriba al sostre de la mida (amplada de la
 * capçalera < 436 px), la capacitat en em no depèn de l'amplada de la pantalla.
 */
export const H1_MARGE_PARAULA = 1.04;
export const H1_MARGE_LINIES = 1.06;
export const H1_CQI = 11;

/** Sostre de la mida del H1 (`--fs-3xl`), en rem. */
export const H1_SOSTRE_REM = 3;

/**
 * Trams d'amplada de la capçalera (inici de cada tram, en rem) amb salts explícits propis. Al
 * tram 0 (mòbil, < 27,3125rem = 437 px) 11cqi encara no arriba al sostre i la capacitat en em és
 * fixa (`100 / H1_CQI`). Des de 27,3125rem la mida queda al sostre (3rem) i la capacitat creix
 * amb l'amplada (amplada / 3rem): cada tram calcula els salts amb la capacitat del seu inici
 * (la més petita del tram), de manera que les línies hi caben a tot el tram.
 *
 * Han de coincidir amb les `@container` del h1 a `cims/[slug]/+page.svelte` (`.tram-N`).
 * Passos d'1 em de capacitat (48 px): la capçalera fa ~400–750 px de tauleta a escriptori.
 */
export const H1_TRAMS_REM = [0, 27.3125, 30, 33, 36, 39, 42, 45, 48] as const;

/** Capacitat mínima d'una línia (em) a l'inici del tram `i`, abans dels mínims de paraula i línies. */
export function capacitatTramEm(i: number): number {
	const inici = H1_TRAMS_REM[i] ?? 0;
	return Math.max(100 / H1_CQI, inici / H1_SOSTRE_REM);
}

/**
 * Capacitat d'una línia del H1 (em): al mòbil (per defecte) o a l'inici d'un tram
 * (`capacitatMinEm`, vegeu `capacitatTramEm`).
 */
export function capacitatLiniaEm(
	paraulaEm: number,
	liniesEm: number,
	capacitatMinEm: number = 100 / H1_CQI
): number {
	return Math.max(paraulaEm * H1_MARGE_PARAULA, liniesEm * H1_MARGE_LINIES, capacitatMinEm);
}

/**
 * Salts de línia explícits del H1, perquè el nombre de línies sigui el mateix amb la font de
 * reserva i amb Archivo (si el text cau just al límit, cada font el parteix diferent i la
 * capçalera canvia d'alçada en arribar la woff2: CLS).
 *
 * Retorna els índexs dels elements (paraules del `text` i, al final, el `sufix`) davant dels
 * quals comença una línia nova, amb el salt voraç a una amplada amb un 5 % de marge sota la
 * capacitat (mai per sota del mínim que ja garanteix `liniesEm` ni de la paraula més llarga).
 * Per defecte, la capacitat del mòbil; `capacitatMinEm` la d'un tram més ample.
 */
export function saltsTitolEm(
	text: string,
	sufix: { text: string; escala: number },
	paraulaEm: number,
	liniesEm: number,
	capacitatMinEm: number = 100 / H1_CQI
): number[] {
	const items = paraules(text).map(ampleParaula);
	const ps = paraules(sufix.text);
	if (ps.length) {
		items.push(
			sufix.escala * (ps.reduce((suma, p) => suma + ampleParaula(p), 0) + ESPAI * (ps.length - 1))
		);
	}
	const ample = Math.max(
		paraulaEm,
		liniesEm,
		capacitatLiniaEm(paraulaEm, liniesEm, capacitatMinEm) / 1.05
	);
	const salts: number[] = [];
	let actual = items[0] ?? 0;
	for (let i = 1; i < items.length; i++) {
		if (actual + ESPAI + items[i] <= ample) actual += ESPAI + items[i];
		else {
			salts.push(i);
			actual = items[i];
		}
	}
	return salts;
}

/**
 * Salts del H1 per a tots els trams d'amplada (`H1_TRAMS_REM`): per a cada índex d'element on
 * algun tram fa un salt, la llista de trams que l'hi fan. La plantilla hi posa un sol `<br>` amb
 * una classe per tram, i el CSS amaga els que no són del tram actiu.
 */
export function saltsTitolPerTram(
	text: string,
	sufix: { text: string; escala: number },
	paraulaEm: number,
	liniesEm: number
): Map<number, number[]> {
	const perIndex = new Map<number, number[]>();
	H1_TRAMS_REM.forEach((_, tram) => {
		for (const i of saltsTitolEm(text, sufix, paraulaEm, liniesEm, capacitatTramEm(tram))) {
			const trams = perIndex.get(i) ?? [];
			trams.push(tram);
			perIndex.set(i, trams);
		}
	});
	return perIndex;
}
