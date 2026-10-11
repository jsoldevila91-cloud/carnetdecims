/**
 * Municipis d'origen (bloc R1): tipus, codis i cerca. Funcions pures; les dades són a
 * `$lib/data/municipis` (generades per `npm run municipis:build` a partir de l'ICGC) i es
 * carreguen en diferit.
 *
 * El municipi d'origen és una dada personal opcional: només el municipi (mai l'adreça), per
 * calcular distàncies municipi → cim. El punt de referència és el **cap de municipi** de l'ICGC.
 *
 * Fora de Catalunya (el catàleg té cims a Andorra i a la Catalunya Nord): el conjunt porta les
 * 7 parròquies d'Andorra (`ad:…`) i 26 poblacions de referència de la Catalunya Nord (`cn:…`),
 * amb `comarca` = la zona. Qui visqui en un altre lloc tria la població més propera o no en
 * tria cap (l'origen és opcional). Vegeu `scripts/municipis/build.ts`.
 */
import { normalitzar } from './filtres-cims';
import type { Punt } from './geo';
import { ZONES, type Zona } from './types';

/** Municipi (o població de referència fora de Catalunya). `lat`/`lon` = cap de municipi. */
export interface Municipi extends Punt {
	/** Codi estable: `CODIMUNI` de l'ICGC (6 xifres) o `ad:{slug}` / `cn:{slug}`. */
	codi: string;
	/** Nom oficial amb la grafia de l'ICGC ("l'Hospitalet de Llobregat", "la Vall de Boí"). */
	nom: string;
	/** Nom de la comarca ("Baix Llobregat") o de la zona ("Andorra", "Catalunya Nord"). */
	comarca: string;
	/** Slug de la comarca (el mateix que `Cim.comarca` quan la comarca té cims al catàleg). */
	comarcaSlug: string;
	zona: Zona;
	/** Nom del cap de municipi si no coincideix amb el del municipi ("Barruera"); si no, `null`. */
	cap: string | null;
}

/** Format compacte del JSON generat (`src/lib/data/municipis/municipis.json`). */
export interface DadesMunicipis {
	font: string;
	comarques: readonly (readonly [slug: string, nom: string, zona: string])[];
	municipis: readonly (
		| readonly [codi: string, nom: string, comarca: number, lat: number, lon: number]
		| readonly [codi: string, nom: string, comarca: number, lat: number, lon: number, cap: string]
	)[];
}

/** Codi de municipi vàlid (format; que existeixi es comprova contra el conjunt de dades). */
export const RE_CODI_MUNICIPI = /^(?:\d{6}|(?:ad|cn):[a-z0-9]+(?:-[a-z0-9]+)*)$/;
/** Llargada màxima d'un codi (la mateixa que accepta el servidor). */
export const CODI_MUNICIPI_MAX = 40;

export function esCodiMunicipi(valor: unknown): valor is string {
	return (
		typeof valor === 'string' && valor.length <= CODI_MUNICIPI_MAX && RE_CODI_MUNICIPI.test(valor)
	);
}

/**
 * Converteix el JSON compacte en la llista de municipis.
 * @throws RangeError si alguna entrada no és coherent (el JSON es genera, no s'edita a mà).
 */
export function desempaquetarMunicipis(dades: DadesMunicipis): Municipi[] {
	return dades.municipis.map((t) => {
		const [codi, nom, idx, lat, lon, cap] = t;
		const comarca = dades.comarques[idx];
		if (!comarca || !(ZONES as readonly string[]).includes(comarca[2])) {
			throw new RangeError(`Municipi ${codi}: comarca desconeguda (${idx})`);
		}
		return {
			codi,
			nom,
			comarca: comarca[1],
			comarcaSlug: comarca[0],
			zona: comarca[2] as Zona,
			lat,
			lon,
			cap: cap ?? null
		};
	});
}

/** Municipi amb aquest codi, o `null` (codi desconegut, p. ex. d'una versió futura del conjunt). */
export function municipiPerCodi<M extends Pick<Municipi, 'codi'>>(
	municipis: readonly M[],
	codi: string | null | undefined
): M | null {
	if (!codi) return null;
	return municipis.find((m) => m.codi === codi) ?? null;
}

const RE_ARTICLE = /^(?:(?:el|la|els|les|lo|es|eth|era)\s+|l['’])/i;

/** Nom sense l'article inicial: "l'Hospitalet de Llobregat" → "Hospitalet de Llobregat". */
export function senseArticleInicial(nom: string): string {
	return nom.replace(RE_ARTICLE, '');
}

export const MAX_RESULTATS_MUNICIPIS = 20;

export interface OpcionsCercaMunicipis {
	/** Nombre màxim de resultats (per defecte `MAX_RESULTATS_MUNICIPIS`). */
	limit?: number;
}

interface IndexMunicipi {
	/** Nom normalitzat, amb article i sense ("lhospitalet de llobregat", "hospitalet de llobregat"). */
	nom: string;
	nucli: string;
	/** Nom del cap normalitzat (si n'hi ha de diferent). */
	cap: string;
}

const indexos = new WeakMap<object, IndexMunicipi>();

function indexDe(m: Pick<Municipi, 'nom' | 'cap'>): IndexMunicipi {
	let i = indexos.get(m);
	if (!i) {
		i = {
			nom: normalitzar(m.nom),
			nucli: normalitzar(senseArticleInicial(m.nom)),
			cap: m.cap ? normalitzar(senseArticleInicial(m.cap)) : ''
		};
		indexos.set(m, i);
	}
	return i;
}

const collator = new Intl.Collator('ca');

/**
 * Municipis que coincideixen amb la consulta, sense distingir accents, majúscules, apòstrofs ni
 * guions (la mateixa normalització que el cercador de `/cims`: `normalitzar`). Totes les paraules
 * de la consulta han de ser al nom del municipi o al del seu cap ("barruera" troba la Vall de
 * Boí). Ordre:
 * 0. el nom (amb article o sense) és exactament la consulta;
 * 1. el nom (amb article o sense) comença per la consulta ("hosp" → l'Hospitalet…);
 * 2. cada paraula de la consulta és el començament d'una paraula del nom ("vall boi");
 * 3. la consulta és dins del nom;
 * 4. només coincideix el nom del cap.
 * Dins de cada grup, alfabètic (català) pel nom sense article i, per estabilitat, pel codi.
 * Consulta buida → `[]`.
 */
export function cercarMunicipis<M extends Pick<Municipi, 'codi' | 'nom' | 'cap'>>(
	consulta: string,
	municipis: readonly M[],
	opcions: OpcionsCercaMunicipis = {}
): M[] {
	const limit = opcions.limit ?? MAX_RESULTATS_MUNICIPIS;
	const q = normalitzar(consulta);
	if (!q || limit <= 0) return [];
	const paraules = q.split(' ');
	const trobats: { m: M; grup: number; nucli: string }[] = [];
	for (const m of municipis) {
		const i = indexDe(m);
		const alNom = paraules.every((p) => i.nom.includes(p) || i.nucli.includes(p));
		let grup: number;
		if (alNom) {
			if (i.nom === q || i.nucli === q) grup = 0;
			else if (i.nom.startsWith(q) || i.nucli.startsWith(q)) grup = 1;
			else {
				const mots = i.nucli.split(' ');
				grup = paraules.every((p) => mots.some((w) => w.startsWith(p))) ? 2 : 3;
			}
		} else if (i.cap && paraules.every((p) => i.cap.includes(p))) {
			grup = 4;
		} else continue;
		trobats.push({ m, grup, nucli: i.nucli });
	}
	trobats.sort(
		(a, b) =>
			a.grup - b.grup ||
			collator.compare(a.nucli, b.nucli) ||
			(a.m.codi < b.m.codi ? -1 : a.m.codi > b.m.codi ? 1 : 0)
	);
	return trobats.slice(0, limit).map((t) => t.m);
}
