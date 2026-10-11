/**
 * Diari de muntanya (bloc R1): companys d'una ascensió. Funcions pures.
 *
 * Els companys són noms o àlies en **text lliure** (no són usuaris ni contactes): "Inesa",
 * "el Pau", "colla del CE". Són dades de terceres persones: es desen amb l'ascensió, només al
 * dispositiu i, amb sessió, al compte de l'usuari; no surten enlloc més (ni URL ni registres).
 *
 * Límits: fins a `COMPANYS_MAX` (10) noms de fins a `COMPANY_MAX_CARACTERS` (40) caràcters
 * Unicode cadascun (com `char_length` de Postgres; el servidor n'admet 20 de 80, com fa amb la
 * nota, per poder ampliar el límit del client sense migració).
 */
import { normalitzar } from './filtres-cims';
import type { Ascensio } from './types';

/** Nombre màxim de companys per ascensió. */
export const COMPANYS_MAX = 10;
/** Llargada màxima del nom d'un company (caràcters Unicode). */
export const COMPANY_MAX_CARACTERS = 40;

export type ErrorCompanys = 'format' | 'massa' | 'massa-llarg';

export type ResultatCompanys =
	{ ok: true; companys: string[] } | { ok: false; error: ErrorCompanys };

/**
 * Espais en blanc (salts de línia, tabuladors, espai dur…), caràcters de control i l'espai
 * d'amplada zero (U+200B). Els connectors d'amplada zero (U+200C/U+200D) es conserven: formen
 * part d'alguns emojis i d'algunes escriptures.
 */
const ESPAIS = new RegExp('[\\s\\p{Cc}' + String.fromCharCode(0x200b) + ']+', 'gu');

/**
 * Nom d'un company normalitzat: forma Unicode NFC, qualsevol espai en blanc (salts de línia i
 * tabuladors inclosos) i caràcters de control convertits en un sol espai, sense espais als extrems.
 */
export function normalitzarCompany(nom: string): string {
	return nom.normalize('NFC').replace(ESPAIS, ' ').trim();
}

/**
 * Clau per reconèixer el mateix company escrit diferent: sense majúscules, accents, apòstrofs ni
 * puntuació ("Inesa" = "inesa" = "INÈSA"; "Joan P." = "joan p"). Si el nom no té cap lletra ni
 * xifra (p. ex. un emoji), la clau és el nom en minúscules.
 */
export function clauCompany(nom: string): string {
	const net = normalitzarCompany(nom);
	return normalitzar(net) || net.toLocaleLowerCase('ca');
}

/**
 * Valida i normalitza la llista de companys d'una ascensió:
 * - `undefined`/`null` → `[]`; qualsevol altra cosa que no sigui una llista de text → `format`;
 * - cada nom es normalitza (`normalitzarCompany`); els buits es descarten;
 * - els repetits (`clauCompany`) es descarten: es queda el primer, amb la seva grafia;
 * - un nom de més de `COMPANY_MAX_CARACTERS` caràcters → `massa-llarg`;
 * - més de `COMPANYS_MAX` noms (després de treure buits i repetits) → `massa`.
 * Es conserva l'ordre d'entrada.
 */
export function normalitzarCompanys(valor: unknown): ResultatCompanys {
	if (valor === undefined || valor === null) return { ok: true, companys: [] };
	if (!Array.isArray(valor)) return { ok: false, error: 'format' };
	const companys: string[] = [];
	const claus = new Set<string>();
	for (const v of valor) {
		if (typeof v !== 'string') return { ok: false, error: 'format' };
		const nom = normalitzarCompany(v);
		if (nom === '') continue;
		if (Array.from(nom).length > COMPANY_MAX_CARACTERS) return { ok: false, error: 'massa-llarg' };
		const clau = clauCompany(nom);
		if (claus.has(clau)) continue;
		claus.add(clau);
		companys.push(nom);
	}
	if (companys.length > COMPANYS_MAX) return { ok: false, error: 'massa' };
	return { ok: true, companys };
}

/** Dues llistes de companys ja normalitzades són iguals (mateixos noms en el mateix ordre)? */
export function mateixosCompanys(
	a: readonly string[] | null | undefined,
	b: readonly string[] | null | undefined
): boolean {
	const x = a ?? [];
	const y = b ?? [];
	return x.length === y.length && x.every((nom, i) => nom === y[i]);
}

/** El que cal d'una ascensió per suggerir companys (`Ascensio` ho compleix). */
export type AscensioAmbCompanys = Pick<Ascensio, 'data'> & {
	companys?: readonly string[] | null;
	createdAt?: string;
	deletedAt?: string | null;
};

export interface CompanyUsat {
	/** Nom amb la grafia de l'ascensió més recent on surt. */
	nom: string;
	/** Nombre d'ascensions vives on surt. */
	vegades: number;
	/** Data (de calendari) de l'ascensió més recent on surt. */
	ultimaData: string;
}

export interface OpcionsSuggeriments {
	/** Text que l'usuari està escrivint: filtra pels noms que hi coincideixen. */
	text?: string;
	/** Noms ja posats a l'ascensió que s'edita: no es tornen a suggerir. */
	exclou?: readonly string[];
	/** Nombre màxim de suggeriments (per defecte `MAX_SUGGERIMENTS_COMPANYS`). */
	limit?: number;
}

export const MAX_SUGGERIMENTS_COMPANYS = 8;

/**
 * Companys ja usats, per a l'autocompletat del formulari i per a "amb qui has pujat més".
 * Compten totes les ascensions **vives** (sense làpida), també les que queden "fora del repte":
 * és memòria personal, no progrés del repte. Un company compta un cop per ascensió.
 *
 * Ordre: més ascensions primer; empat, l'usat més recentment (data de l'ascensió i, el mateix dia,
 * `createdAt`); després alfabètic (català). Amb `text`, només els noms on cada paraula del text és
 * el començament d'una paraula del nom (sense accents ni majúscules), i passen al davant els que
 * comencen pel text.
 */
export function companysUsats(
	ascensions: readonly AscensioAmbCompanys[],
	opcions: OpcionsSuggeriments = {}
): CompanyUsat[] {
	interface Acumulat extends CompanyUsat {
		clau: string;
		ordre: string;
	}
	const perClau = new Map<string, Acumulat>();
	for (const a of ascensions) {
		if (a.deletedAt || !a.companys?.length) continue;
		const ordre = `${a.data}|${a.createdAt ?? ''}`;
		const vistos = new Set<string>();
		for (const brut of a.companys) {
			if (typeof brut !== 'string') continue;
			const nom = normalitzarCompany(brut);
			const clau = clauCompany(nom);
			if (!nom || vistos.has(clau)) continue;
			vistos.add(clau);
			const actual = perClau.get(clau);
			if (!actual) {
				perClau.set(clau, { clau, nom, vegades: 1, ultimaData: a.data, ordre });
			} else {
				actual.vegades++;
				if (ordre > actual.ordre) {
					actual.ordre = ordre;
					actual.ultimaData = a.data;
					actual.nom = nom;
				}
			}
		}
	}

	const exclosos = new Set((opcions.exclou ?? []).map(clauCompany));
	const q = normalitzar(opcions.text ?? '');
	const paraules = q ? q.split(' ') : [];
	const collator = new Intl.Collator('ca');
	const candidats: (Acumulat & { comenca: boolean })[] = [];
	for (const c of perClau.values()) {
		if (exclosos.has(c.clau)) continue;
		const mots = c.clau.split(' ');
		if (!paraules.every((p) => mots.some((w) => w.startsWith(p)))) continue;
		candidats.push({ ...c, comenca: q !== '' && c.clau.startsWith(q) });
	}
	candidats.sort(
		(a, b) =>
			Number(b.comenca) - Number(a.comenca) ||
			b.vegades - a.vegades ||
			(a.ordre < b.ordre ? 1 : a.ordre > b.ordre ? -1 : 0) ||
			collator.compare(a.nom, b.nom)
	);
	const limit = opcions.limit ?? MAX_SUGGERIMENTS_COMPANYS;
	return candidats
		.slice(0, Math.max(0, limit))
		.map(({ nom, vegades, ultimaData }) => ({ nom, vegades, ultimaData }));
}

/** Només els noms de `companysUsats` (per al `datalist` o el combobox del formulari). */
export function suggerirCompanys(
	ascensions: readonly AscensioAmbCompanys[],
	opcions: OpcionsSuggeriments = {}
): string[] {
	return companysUsats(ascensions, opcions).map((c) => c.nom);
}
