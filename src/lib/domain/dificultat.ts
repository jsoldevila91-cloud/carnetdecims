/**
 * "Dificultat orientativa" de Carnet de Cims (fase 6a-bis; metodologia a docs i a la pàgina de
 * Metodologia). **No és el MIDE** ni cap valoració oficial: és una estimació pròpia, simple i
 * explicable, d'una ruta d'accés (anada) a partir de les dades amb font de la fitxa.
 *
 * Tres factors, cadascun de l'1 al 4 (Fàcil · Moderada · Exigent · Molt exigent):
 *
 * 1. **Esforç** (`esforc`): quilòmetres-esforç d'anada (km-esforç), la mesura clàssica de
 *    senderisme en què 100 m de pujada equivalen a 1 km pla:
 *    - amb desnivell i distància: `km-esforç = distància (km) + desnivell positiu (m) / 100`;
 *    - si no, amb el temps d'anada: `km-esforç = minuts / 15` (un excursionista mitjà fa
 *      ~4 km-esforç per hora);
 *    - si només hi ha el desnivell: `km-esforç = desnivell / 100 × 1,4` (suposa un pendent mitjà
 *      del 25 %, és a dir, 1 km de camí per cada 250 m de pujada).
 *    Llindars (`ESCALA_DIFICULTAT.esforc.llindarsKmEsforc`): ≤ 7 → 1, ≤ 15 → 2, ≤ 22 → 3, > 22 → 4.
 *    La distància sola no basta (no diu res de la pujada) i no es fa servir.
 * 2. **Tècnica** (`tecnica`): el pas més tècnic de la ruta segons les fonts (`tecnicitat`):
 *    camí sense dificultat → 1; terreny irregular o grimpada fàcil (I) → 2; grimpada (II o més) o
 *    cadenes → 3; via equipada obligatòria → 4.
 * 3. **Altitud** (`altitud`): l'alta muntanya afegeix fred, vent, neu tardana i canvis de temps:
 *    < 2.500 m → 1; 2.500–2.999 m → 2; ≥ 3.000 m → 3. Fa de **mínim**: sola no dona dificultat.
 *
 * **Nivell final = el factor més alt** (cap factor en compensa un altre: una ruta curta amb
 * grimpada continua sent exigent, i una de llarga per camí fàcil continua sent llarga).
 * Si no hi ha ni esforç ni tècnica, no es calcula (`null`). Si falta alguna dada (desnivell,
 * distància o tecnicitat), el resultat és `aproximada` i se'n llisten les que falten.
 */

/** Pas més tècnic d'una ruta segons les fonts (vegeu `RutaAcces.tecnicitat`). */
export type Tecnicitat =
	'cap' | 'terreny-irregular' | 'grimpada-facil' | 'grimpada' | 'via-equipada';

export type NivellDificultat = 1 | 2 | 3 | 4;
export type ClauDificultat = 'facil' | 'moderada' | 'exigent' | 'molt-exigent';

/** Dades que poden faltar per a un càlcul complet. */
export type DadaDificultat = 'desnivell' | 'distancia' | 'temps' | 'tecnicitat';

export interface EntradaDificultat {
	/** Desnivell positiu d'anada (m). */
	desnivellPositiuM?: number;
	/** Distància d'anada (km). */
	distanciaKm?: number;
	/** Temps d'anada sense parades (minuts). */
	tempsMinuts?: number;
	/** Altitud del cim (m), del catàleg. */
	altitudCim: number;
	tecnicitat?: Tecnicitat;
}

export interface DificultatOrientativa {
	nivell: NivellDificultat;
	clau: ClauDificultat;
	/** `true` si falta alguna dada (`dadesQueFalten` no és buit). */
	aproximada: boolean;
	/** Factors calculats (els que no s'han pogut calcular no hi són). */
	factors: { esforc?: NivellDificultat; tecnica?: NivellDificultat; altitud?: NivellDificultat };
	/** Km-esforç d'anada fets servir per al factor d'esforç (arrodonits a 0,1), si n'hi ha. */
	kmEsforc?: number;
	/** D'on surt l'esforç: desnivell + distància, temps o només desnivell. */
	baseEsforc?: 'desnivell-distancia' | 'temps' | 'desnivell';
	dadesQueFalten: DadaDificultat[];
}

/**
 * Escala i llindars de la dificultat orientativa. La pàgina de Metodologia ha de mostrar
 * aquests mateixos números (no copiar-los a mà).
 */
export const ESCALA_DIFICULTAT = Object.freeze({
	nivells: Object.freeze([
		{ nivell: 1, clau: 'facil' },
		{ nivell: 2, clau: 'moderada' },
		{ nivell: 3, clau: 'exigent' },
		{ nivell: 4, clau: 'molt-exigent' }
	] as const),
	esforc: Object.freeze({
		/** Metres de desnivell positiu que equivalen a 1 km pla. */
		metresPerKmEsforc: 100,
		/** Minuts per km-esforç (un excursionista mitjà: ~4 km-esforç/h). */
		minutsPerKmEsforc: 15,
		/** Factor per estimar els km-esforç només amb el desnivell (pendent mitjà del 25 %). */
		factorNomesDesnivell: 1.4,
		/** Límits superiors (inclosos) dels nivells 1, 2 i 3 en km-esforç d'anada; per sobre, 4. */
		llindarsKmEsforc: Object.freeze([7, 15, 22] as const)
	}),
	tecnica: Object.freeze({
		cap: 1,
		'terreny-irregular': 2,
		'grimpada-facil': 2,
		grimpada: 3,
		'via-equipada': 4
	} as const satisfies Record<Tecnicitat, NivellDificultat>),
	altitud: Object.freeze({
		/** Altitud (m) a partir de la qual el factor d'altitud és 2 i 3, respectivament. */
		llindarsM: Object.freeze([2500, 3000] as const)
	})
});

const CLAUS: Readonly<Record<NivellDificultat, ClauDificultat>> = {
	1: 'facil',
	2: 'moderada',
	3: 'exigent',
	4: 'molt-exigent'
};

/** Clau d'un nivell (per als textos de la interfície). */
export function clauDificultat(nivell: NivellDificultat): ClauDificultat {
	return CLAUS[nivell];
}

const esPositiu = (n: number | undefined): n is number =>
	typeof n === 'number' && Number.isFinite(n) && n > 0;
const esNoNegatiu = (n: number | undefined): n is number =>
	typeof n === 'number' && Number.isFinite(n) && n >= 0;

/** Nivell d'esforç (1–4) per a uns km-esforç d'anada. */
export function nivellEsforc(kmEsforc: number): NivellDificultat {
	const [l1, l2, l3] = ESCALA_DIFICULTAT.esforc.llindarsKmEsforc;
	if (kmEsforc <= l1) return 1;
	if (kmEsforc <= l2) return 2;
	if (kmEsforc <= l3) return 3;
	return 4;
}

/** Nivell d'altitud (1–3) per a l'altitud del cim, o `undefined` si l'altitud no és vàlida. */
export function nivellAltitud(altitudM: number): NivellDificultat | undefined {
	if (!Number.isFinite(altitudM) || altitudM <= 0) return undefined;
	const [a2, a3] = ESCALA_DIFICULTAT.altitud.llindarsM;
	if (altitudM >= a3) return 3;
	if (altitudM >= a2) return 2;
	return 1;
}

const esTecnicitat = (t: unknown): t is Tecnicitat =>
	typeof t === 'string' && Object.hasOwn(ESCALA_DIFICULTAT.tecnica, t);

/**
 * Dificultat orientativa d'una ruta (anada). Retorna `null` si no hi ha prou dades per a l'esforç
 * ni per a la tècnica (l'altitud sola no basta). Valors no finits o negatius es tracten com a
 * absents (desnivell 0 és vàlid; distància i temps han de ser > 0).
 */
export function dificultatOrientativa(r: EntradaDificultat): DificultatOrientativa | null {
	const { metresPerKmEsforc, minutsPerKmEsforc, factorNomesDesnivell } = ESCALA_DIFICULTAT.esforc;
	const desnivell = esNoNegatiu(r.desnivellPositiuM) ? r.desnivellPositiuM : undefined;
	const distancia = esPositiu(r.distanciaKm) ? r.distanciaKm : undefined;
	const temps = esPositiu(r.tempsMinuts) ? r.tempsMinuts : undefined;
	const tecnicitat = esTecnicitat(r.tecnicitat) ? r.tecnicitat : undefined;

	let kmEsforc: number | undefined;
	let baseEsforc: DificultatOrientativa['baseEsforc'];
	if (desnivell !== undefined && distancia !== undefined) {
		kmEsforc = distancia + desnivell / metresPerKmEsforc;
		baseEsforc = 'desnivell-distancia';
	} else if (temps !== undefined) {
		kmEsforc = temps / minutsPerKmEsforc;
		baseEsforc = 'temps';
	} else if (desnivell !== undefined && desnivell > 0) {
		kmEsforc = (desnivell / metresPerKmEsforc) * factorNomesDesnivell;
		baseEsforc = 'desnivell';
	}

	const esforc = kmEsforc === undefined ? undefined : nivellEsforc(kmEsforc);
	const tecnica = tecnicitat === undefined ? undefined : ESCALA_DIFICULTAT.tecnica[tecnicitat];
	if (esforc === undefined && tecnica === undefined) return null;
	const altitud = nivellAltitud(r.altitudCim);

	const dadesQueFalten: DadaDificultat[] = [];
	if (desnivell === undefined) dadesQueFalten.push('desnivell');
	if (distancia === undefined) dadesQueFalten.push('distancia');
	// El temps només és necessari si no hi ha desnivell + distància (n'és l'alternativa).
	if (baseEsforc !== 'desnivell-distancia' && temps === undefined) dadesQueFalten.push('temps');
	if (tecnicitat === undefined) dadesQueFalten.push('tecnicitat');

	const nivell = Math.max(esforc ?? 1, tecnica ?? 1, altitud ?? 1) as NivellDificultat;
	const factors: DificultatOrientativa['factors'] = {};
	if (esforc !== undefined) factors.esforc = esforc;
	if (tecnica !== undefined) factors.tecnica = tecnica;
	if (altitud !== undefined) factors.altitud = altitud;

	const resultat: DificultatOrientativa = {
		nivell,
		clau: CLAUS[nivell],
		aproximada: dadesQueFalten.length > 0,
		factors,
		dadesQueFalten
	};
	if (kmEsforc !== undefined) {
		resultat.kmEsforc = Math.round(kmEsforc * 10) / 10;
		resultat.baseEsforc = baseEsforc;
	}
	return resultat;
}

/** Dificultat d'una ruta d'un cim amb les dades d'on surt. */
export interface RutaAmbDificultat {
	/** `id` de la ruta a la fitxa (`RutaAcces.id`), si se sap. */
	id?: string;
	ruta: EntradaDificultat;
	dificultat: DificultatOrientativa | null;
}

/** Llistats basats en la dificultat orientativa (només cims amb contingut). */
export type LlistatDificultatId = 'cims-facils' | 'cims-amb-nens';

/**
 * Criteris dels llistats de dificultat (la Metodologia els mostra d'aquí).
 * - `cims-facils`: la **ruta normal** és de nivell 1 (Fàcil), amb l'esforç calculat i la
 *   tecnicitat amb font.
 * - `cims-amb-nens` (llista per a famílies: cap dada es dona per bona si falta): **alguna ruta**
 *   de la fitxa (la més fàcil que compleixi; la normal primer en cas d'empat) amb nivell ≤ 2,
 *   tecnicitat **amb font** `cap` o `terreny-irregular` (sense grimpades), desnivell positiu
 *   d'anada **amb font** ≤ 600 m i temps d'anada **amb font** ≤ 2 h 30 min. Si a la ruta li falta
 *   el desnivell, el temps o la tecnicitat, no compta.
 */
export const CRITERIS_LLISTATS_DIFICULTAT = Object.freeze({
	'cims-facils': Object.freeze({ nivellMax: 1 as NivellDificultat }),
	'cims-amb-nens': Object.freeze({
		nivellMax: 2 as NivellDificultat,
		tecnicitats: Object.freeze(['cap', 'terreny-irregular'] as const satisfies Tecnicitat[]),
		desnivellMaxM: 600,
		tempsMaxMinuts: 150,
		/** Dades de la ruta que han de tenir font (si en falta alguna, la ruta no compta). */
		dadesObligatories: Object.freeze([
			'desnivell',
			'temps',
			'tecnicitat'
		] as const satisfies DadaDificultat[]),
		/** Es pot fer servir qualsevol ruta de la fitxa (la més fàcil que compleixi). */
		qualsevolRuta: true
	})
});

/** Hi ha prou dades per posar la ruta en un llistat de dificultat (esforç i tecnicitat). */
function prouDades(r: RutaAmbDificultat | undefined): r is RutaAmbDificultat & {
	dificultat: DificultatOrientativa;
} {
	const d = r?.dificultat;
	return !!d && d.factors.esforc !== undefined && d.factors.tecnica !== undefined;
}

/** La ruta (normal) entra al llistat `cims-facils`. */
export function esRutaFacil(r: RutaAmbDificultat | undefined): boolean {
	return (
		prouDades(r) && r.dificultat.nivell <= CRITERIS_LLISTATS_DIFICULTAT['cims-facils'].nivellMax
	);
}

/**
 * La ruta és apta per al llistat `cims-amb-nens`: desnivell, temps i tecnicitat amb font i dins
 * dels límits, i nivell ≤ 2.
 */
export function esRutaAmbNens(r: RutaAmbDificultat | undefined): boolean {
	if (!prouDades(r)) return false;
	const c = CRITERIS_LLISTATS_DIFICULTAT['cims-amb-nens'];
	const { desnivellPositiuM: desnivell, tempsMinuts: temps, tecnicitat } = r.ruta;
	if (r.dificultat.nivell > c.nivellMax) return false;
	if (!(c.tecnicitats as readonly string[]).includes(tecnicitat ?? '')) return false;
	if (!esNoNegatiu(desnivell) || desnivell > c.desnivellMaxM) return false;
	if (!esPositiu(temps) || temps > c.tempsMaxMinuts) return false;
	return true;
}

/**
 * Ruta per anar-hi amb nens: la més fàcil de les que compleixen `esRutaAmbNens` (menys nivell,
 * després menys km-esforç, després menys temps; en cas d'empat, la que surt abans a la fitxa,
 * és a dir, la normal). `undefined` si cap no compleix.
 */
export function rutaAmbNens(
	rutes: readonly (RutaAmbDificultat | undefined)[]
): RutaAmbDificultat | undefined {
	let millor: RutaAmbDificultat | undefined;
	for (const r of rutes) {
		if (!esRutaAmbNens(r)) continue;
		if (!millor || mesFacil(r!, millor)) millor = r;
	}
	return millor;
}

/** `a` és estrictament més fàcil que `b` (les dues aptes, amb dificultat i temps). */
function mesFacil(a: RutaAmbDificultat, b: RutaAmbDificultat): boolean {
	const da = a.dificultat!;
	const db = b.dificultat!;
	if (da.nivell !== db.nivell) return da.nivell < db.nivell;
	const ka = da.kmEsforc ?? Number.POSITIVE_INFINITY;
	const kb = db.kmEsforc ?? Number.POSITIVE_INFINITY;
	if (ka !== kb) return ka < kb;
	return a.ruta.tempsMinuts! < b.ruta.tempsMinuts!;
}

/**
 * Predicat de cada llistat de dificultat sobre **totes les rutes** d'una fitxa (la normal
 * primer). El comparteixen `LLISTATS` i el sitemap.
 */
export const FILTRES_LLISTATS_DIFICULTAT: Readonly<
	Record<LlistatDificultatId, (rutes: readonly RutaAmbDificultat[]) => boolean>
> = Object.freeze({
	'cims-facils': (rutes) => esRutaFacil(rutes[0]),
	'cims-amb-nens': (rutes) => rutaAmbNens(rutes) !== undefined
});
