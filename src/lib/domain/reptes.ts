/**
 * Motor de reptes i medalles (bloc R2). Funcions pures; no es desa res: el progrés i les medalles
 * es deriven sempre de les ascensions i del catàleg.
 *
 * **Un repte és una dada** (`Repte`): `{ id, slug: { ca, es }, condicio }`. Els textos visibles
 * (nom, descripció) són a `messages/*.json` amb la clau `repte_<id amb _>_nom` / `_descripcio`
 * (`clauMissatgeRepte`). La condició combina un **conjunt de cims** (`FiltreCims`) i una
 * **regla** (`RegleRepte`).
 *
 * **Què compta als reptes propis** (decisió R2; els reptes propis no segueixen la normativa FEEC):
 * - Les ascensions **esborrades** (`deletedAt`) no compten mai.
 * - Compten les ascensions amb data vàlida **no futura** (≤ avui), mètode admès (sense motor) i
 *   cim del catàleg, **també les anteriors al 01/07/2006** (que per al 100 Cims són "fora del
 *   repte"): un repte propi no té data d'inici si no la defineix (`condicio.desDe`).
 * - No s'aplica la regla d'essencials ni el límit de 100 cims l'any.
 * - Les repeticions d'un cim no sumen: totes les regles compten **cims diferents** (la data d'un
 *   cim és la de la seva primera ascensió que compta).
 * - Els reptes `cent-cims` i `infantil` **deleguen** a la lògica existent (`calcularEstatRepte`):
 *   donen exactament el mateix que el carnet i les estadístiques de R1.
 *
 * **Catàleg buit / conjunt buit:** `objectiu` 0 → mai `completat` (no hi ha medalles buides).
 *
 * **Estacions** (`les-4-estacions`): estacions **meteorològiques** per mesos sencers — primavera
 * = març-maig, estiu = juny-agost, tardor = setembre-novembre, hivern = desembre-febrer — i
 * l'"any" és l'**any natural**: l'hivern d'un any són gener, febrer i desembre d'aquell any (l'hivern
 * que creua l'any compta la part de desembre per a l'any que acaba i la de gener-febrer per al
 * nou). Vegeu docs/03-modelo-datos.md §3.6.
 */
import type { ProgresRepteResum } from './estadistiques';
import { MASSISSOS } from './massissos';
import {
	NIVELL_MAXIM,
	OBJECTIU_REPTE,
	OPCIONS_PER_DEFECTE,
	anyDe,
	calcularEstatRepte,
	esDataIsoValida,
	validarMetode,
	type EstatRepte,
	type OpcionsRepte
} from './repte';
import type { Ascensio, Cataleg, Cim, DataISO, Metode, Zona } from './types';

// ---------------------------------------------------------------------------
// Tipus
// ---------------------------------------------------------------------------

/** Filtre del conjunt de cims d'un repte. Tots els camps presents s'han de complir (AND). */
export interface FiltreCims {
	comarques?: readonly string[];
	zones?: readonly Zona[];
	/** Altitud mínima i màxima, inclusives (m). */
	altitudMin?: number;
	altitudMax?: number;
	essencial?: boolean;
	/** Llista fixa per id (`Cim.id`). */
	ids?: readonly number[];
	/** Llista fixa per slug (`Cim.slug`), p. ex. els massissos. */
	slugs?: readonly string[];
}

export type Estacio = 'primavera' | 'estiu' | 'tardor' | 'hivern';
export const ESTACIONS: readonly Estacio[] = Object.freeze([
	'primavera',
	'estiu',
	'tardor',
	'hivern'
]);

export type RegleRepte =
	/** `n` cims diferents del conjunt. */
	| { tipus: 'n-distintes'; n: number }
	/** Tots els cims del conjunt. */
	| { tipus: 'totes' }
	/** Un cim (almenys) a cada comarca que té cims dins el conjunt. */
	| { tipus: 'una-per-comarca' }
	/** Un cim a cada estació (meteorològica) d'un mateix any natural. */
	| { tipus: 'estacions-mateix-any' }
	/** `mesos` mesos de calendari consecutius amb almenys un cim **nou** (primera ascensió). */
	| { tipus: 'mesos-consecutius-cim-nou'; mesos: number }
	/** Repte 100 Cims (FEEC): delega al carnet (regla d'essencials, nivells 100…5×100). */
	| { tipus: 'cent-cims' }
	/** Repte infantil (FEEC): delega a `progresInfantil`. */
	| { tipus: 'infantil' };

export interface CondicioRepte {
	/** Conjunt de cims; sense filtre, tot el catàleg. */
	cims?: FiltreCims;
	regla: RegleRepte;
	/** Només compten les ascensions des d'aquesta data (inclosa). */
	desDe?: DataISO;
	/** Només compten aquests mètodes (per a futurs reptes com "Hivernal"). */
	metodes?: readonly Metode[];
}

export interface Repte {
	/** Identificador estable (no canvia mai; és la clau de les medalles i dels missatges). */
	id: string;
	/** Slug de la URL per idioma. */
	slug: { ca: string; es: string };
	condicio: CondicioRepte;
	/** Agrupació per a la UI (p. ex. `'massissos'`: un sub-repte per massís). */
	grup?: string;
	/** Repte destacat (el 100 Cims). */
	destacat?: boolean;
}

/** El que el motor necessita d'una ascensió (`Ascensio` ho compleix). */
export type AscensioRepte = Pick<Ascensio, 'cimId' | 'data' | 'metode'> & {
	deletedAt?: string | null;
};

/** Mes de calendari `YYYY-MM`. */
export type MesRepte = string;

/** Què falta, segons la regla. */
export type PendentsRepte =
	| { tipus: 'cims'; cimIds: number[] }
	| { tipus: 'comarques'; comarques: string[] }
	| {
			tipus: 'estacions';
			/** Any natural de referència (el millor; en empat, el més recent); `null` si cap. */
			any: number | null;
			/** Estacions que encara falten aquell any. */
			estacions: Estacio[];
	  }
	| {
			tipus: 'mesos';
			/** Ratxa viva (acaba aquest mes o el passat), en mesos; 0 si no n'hi ha. */
			ratxaActual: number;
			/** Primer i últim mes de la ratxa viva; `null` si no n'hi ha. */
			inici: MesRepte | null;
			fi: MesRepte | null;
			/** Aquest mes ja té un cim nou. */
			mesActualFet: boolean;
			/** Ratxa més llarga de tota la vida (mesos). */
			millorRatxa: number;
	  };

/**
 * Resultat d'avaluar un repte. Amplia `ProgresRepteResum` (R1): `fets` és el progrés (i `progres`
 * n'és un àlies), `nivell`/`assoliments` donen les medalles.
 */
export interface ResultatRepte extends ProgresRepteResum {
	/** Igual que `fets`. */
	progres: number;
	completat: boolean;
	/** Data en què es va completar (el nivell màxim); `null` si no. */
	dataCompletat: DataISO | null;
	pendents: PendentsRepte;
	/**
	 * Cims pendents que, pujats avui, farien avançar el repte (per a "El teu proper cim"). Buit
	 * si el repte està completat.
	 */
	cimsQueSumen: number[];
}

export interface OpcionsReptes extends Partial<OpcionsRepte> {
	/** Avui (`YYYY-MM-DD`): obligatori perquè les funcions siguin pures. */
	avui: DataISO;
}

/** Medalla obtinguda (derivada; no es desa). */
export interface Medalla {
	repteId: string;
	/** 1 per als reptes d'un sol nivell; 1–5 al 100 Cims (100 … 5×100). */
	nivell: number;
	data: DataISO;
}

// ---------------------------------------------------------------------------
// Identificadors i reptes inicials
// ---------------------------------------------------------------------------

/** Iguals que `REPTE_CENT_CIMS` i `REPTE_INFANTIL` d'`estadistiques.ts` (el test ho comprova). */
export const ID_REPTE_CENT_CIMS = 'cent-cims';
export const ID_REPTE_INFANTIL = 'infantil';
export const ID_REPTE_COMARQUES = 'totes-les-comarques';
export const ID_REPTE_ESTACIONS = 'les-4-estacions';
export const ID_REPTE_12_MESOS = '12-mesos-12-cims';
export const GRUP_MASSISSOS = 'massissos';
export const MESOS_REPTE_12_MESOS = 12;

/** Id del sub-repte d'un massís. */
export function idRepteMassis(massisId: string): string {
	return `massis-${massisId}`;
}

/**
 * Clau del missatge (Paraglide) d'un repte: `repte_<id>_nom` / `repte_<id>_descripcio`, amb els
 * guions de l'id canviats per `_` (p. ex. `repte_massis_sant_llorenc_del_munt_nom`).
 */
export function clauMissatgeRepte(id: string, camp: 'nom' | 'descripcio'): string {
	return `repte_${id.replace(/-/g, '_')}_${camp}`;
}

const SLUGS_MASSISSOS: Readonly<Record<string, { ca: string; es: string }>> = {
	montseny: { ca: 'montseny', es: 'montseny' },
	montserrat: { ca: 'montserrat', es: 'montserrat' },
	'sant-llorenc-del-munt': { ca: 'sant-llorenc-del-munt', es: 'sant-llorenc-del-munt' },
	ports: { ca: 'els-ports', es: 'els-ports' },
	'cadi-moixero': { ca: 'cadi-moixero', es: 'cadi-moixero' },
	prades: { ca: 'muntanyes-de-prades', es: 'montanas-de-prades' },
	montsec: { ca: 'montsec', es: 'montsec' }
};

/** Reptes inicials (decisió de l'usuari, R2), en l'ordre de la UI. */
export const REPTES: readonly Repte[] = Object.freeze([
	{
		id: ID_REPTE_CENT_CIMS,
		slug: { ca: '100-cims', es: '100-cims' },
		condicio: { regla: { tipus: 'cent-cims' } },
		destacat: true
	},
	{
		id: ID_REPTE_INFANTIL,
		slug: { ca: 'repte-infantil', es: 'reto-infantil' },
		condicio: { regla: { tipus: 'infantil' } }
	},
	{
		id: ID_REPTE_COMARQUES,
		slug: { ca: 'totes-les-comarques', es: 'todas-las-comarcas' },
		condicio: { regla: { tipus: 'una-per-comarca' } }
	},
	{
		id: ID_REPTE_ESTACIONS,
		slug: { ca: 'les-4-estacions', es: 'las-4-estaciones' },
		condicio: { regla: { tipus: 'estacions-mateix-any' } }
	},
	{
		id: ID_REPTE_12_MESOS,
		slug: { ca: '12-mesos-12-cims', es: '12-meses-12-cimas' },
		condicio: { regla: { tipus: 'mesos-consecutius-cim-nou', mesos: MESOS_REPTE_12_MESOS } }
	},
	...MASSISSOS.map((m): Repte => ({
		id: idRepteMassis(m.id),
		slug: {
			ca: `massis-${SLUGS_MASSISSOS[m.id]?.ca ?? m.id}`,
			es: `macizo-${SLUGS_MASSISSOS[m.id]?.es ?? m.id}`
		},
		condicio: { cims: { slugs: m.cims }, regla: { tipus: 'totes' } },
		grup: GRUP_MASSISSOS
	}))
] satisfies Repte[]);

export function repteDeId(id: string, reptes: readonly Repte[] = REPTES): Repte | undefined {
	return reptes.find((r) => r.id === id);
}

export function repteDeSlug(
	slug: string,
	idioma: 'ca' | 'es',
	reptes: readonly Repte[] = REPTES
): Repte | undefined {
	return reptes.find((r) => r.slug[idioma] === slug);
}

// ---------------------------------------------------------------------------
// Utilitats
// ---------------------------------------------------------------------------

function llista(cataleg: Cataleg): readonly Cim[] {
	return cataleg instanceof Map ? [...cataleg.values()] : (cataleg as readonly Cim[]);
}

/** Cims del catàleg que compleixen el filtre (ordre del catàleg). */
export function cimsDelFiltre<C extends Cim>(
	filtre: FiltreCims | undefined,
	cataleg: readonly C[] | ReadonlyMap<number, C>
): C[] {
	const cims = llista(cataleg) as readonly C[];
	if (!filtre) return [...cims];
	const ids = filtre.ids ? new Set(filtre.ids) : null;
	const slugs = filtre.slugs ? new Set(filtre.slugs) : null;
	const comarques = filtre.comarques ? new Set(filtre.comarques) : null;
	const zones = filtre.zones ? new Set<string>(filtre.zones) : null;
	return cims.filter(
		(c) =>
			(!ids || ids.has(c.id)) &&
			(!slugs || slugs.has(c.slug)) &&
			(!comarques || comarques.has(c.comarca)) &&
			(!zones || zones.has(c.zona)) &&
			(filtre.altitudMin === undefined || c.altitud >= filtre.altitudMin) &&
			(filtre.altitudMax === undefined || c.altitud <= filtre.altitudMax) &&
			(filtre.essencial === undefined || c.essencial === filtre.essencial)
	);
}

/**
 * Ascensions que compten per a un repte propi (vegeu la capçalera): sense làpida, data vàlida
 * ≤ avui (i ≥ `desDe`), mètode admès (i dins `metodes`) i cim del conjunt.
 */
export function ascensionsDelRepte<T extends AscensioRepte>(
	ascensions: readonly T[],
	condicio: CondicioRepte,
	idsConjunt: ReadonlySet<number>,
	avui: DataISO
): T[] {
	const metodes = condicio.metodes ? new Set<string>(condicio.metodes) : null;
	return ascensions.filter(
		(a) =>
			!a.deletedAt &&
			esDataIsoValida(a.data) &&
			a.data <= avui &&
			(condicio.desDe === undefined || a.data >= condicio.desDe) &&
			validarMetode(a.metode) &&
			(!metodes || metodes.has(a.metode)) &&
			idsConjunt.has(a.cimId)
	);
}

/** Primera data que compta de cada cim. */
function primeres(ascensions: readonly AscensioRepte[]): Map<number, DataISO> {
	const m = new Map<number, DataISO>();
	for (const a of ascensions) {
		const d = m.get(a.cimId);
		if (d === undefined || a.data < d) m.set(a.cimId, a.data);
	}
	return m;
}

/** Estació meteorològica d'una data. */
export function estacioDe(data: DataISO): Estacio {
	const mes = Number(data.slice(5, 7));
	if (mes >= 3 && mes <= 5) return 'primavera';
	if (mes >= 6 && mes <= 8) return 'estiu';
	if (mes >= 9 && mes <= 11) return 'tardor';
	return 'hivern';
}

/** Índex de mes absolut (any × 12 + mes - 1). */
function indexMes(data: DataISO): number {
	return anyDe(data) * 12 + Number(data.slice(5, 7)) - 1;
}

function mesIso(index: number): MesRepte {
	const any = Math.floor(index / 12);
	return `${String(any).padStart(4, '0')}-${String((index % 12) + 1).padStart(2, '0')}`;
}

function resultat(
	id: string,
	fets: number,
	objectiu: number,
	dataCompletat: DataISO | null,
	pendents: PendentsRepte,
	cimsQueSumen: number[]
): ResultatRepte {
	const completat = objectiu > 0 && dataCompletat !== null;
	return {
		id,
		fets,
		progres: fets,
		objectiu,
		fraccio: objectiu > 0 ? Math.min(1, fets / objectiu) : 0,
		nivell: completat ? 1 : 0,
		nivellMaxim: 1,
		assoliments: completat ? [{ nivell: 1, data: dataCompletat }] : [],
		completat,
		dataCompletat: completat ? dataCompletat : null,
		pendents,
		cimsQueSumen: completat ? [] : cimsQueSumen
	};
}

// ---------------------------------------------------------------------------
// 100 Cims i infantil (delegats a la lògica de R1)
// ---------------------------------------------------------------------------

/**
 * Resum del 100 Cims a partir de l'estat del carnet: el mateix marcador que `resumCarnet` (fins
 * al 100, regla d'essencials;  després, cims per als nivells). `completat` i `dataCompletat` en arribar al 100
 * (decisió de l'usuari); les medalles surten per nivell (I–V) i `cimsQueSumen` no es buida fins al 5×100.
 */
export function resultatCentCims(
	estat: EstatRepte<AscensioRepte>,
	cataleg: Cataleg
): ResultatRepte {
	const n = estat.nivell.nivell;
	const fets = n === 0 ? estat.progres100.comptador : estat.nivell.comptador;
	const objectiu = Math.min(NIVELL_MAXIM, n + 1) * OBJECTIU_REPTE;
	const assoliments = estat.nivell.assoliments.map((a) => ({ nivell: a.nivell, data: a.data }));
	const completat = n >= 1;
	const fetes = estat.primeres;
	const cimIds =
		n === 0
			? estat.progres100.essencialsPendents.map((c) => c.id)
			: llista(cataleg)
					.filter((c) => !fetes.has(c.id))
					.map((c) => c.id);
	return {
		id: ID_REPTE_CENT_CIMS,
		fets,
		progres: fets,
		objectiu,
		fraccio: Math.min(1, fets / objectiu),
		nivell: n,
		nivellMaxim: NIVELL_MAXIM,
		assoliments,
		completat,
		dataCompletat: completat ? assoliments[0].data : null,
		pendents: { tipus: 'cims', cimIds },
		cimsQueSumen: n === NIVELL_MAXIM ? [] : cimIds
	};
}

/** Resum del Repte infantil a partir de l'estat del carnet (sense filtre d'edat, com R1). */
export function resultatInfantil(
	estat: EstatRepte<AscensioRepte>,
	cataleg: Cataleg,
	opcions: Partial<OpcionsRepte> = {}
): ResultatRepte {
	const inf = estat.infantil;
	const inici = { ...OPCIONS_PER_DEFECTE, ...opcions }.dataIniciInfantil;
	const fetes = new Set(
		estat.valides.filter((a) => inici === null || a.data >= inici).map((a) => a.cimId)
	);
	const cimIds = llista(cataleg)
		.filter((c) => !fetes.has(c.id))
		.map((c) => c.id);
	return resultat(
		ID_REPTE_INFANTIL,
		inf.comptador,
		inf.objectiu,
		inf.dataAssoliment,
		{ tipus: 'cims', cimIds },
		cimIds
	);
}

// ---------------------------------------------------------------------------
// Regles pròpies
// ---------------------------------------------------------------------------

function avaluarDistintes(
	id: string,
	objectiu: number,
	conjunt: readonly Cim[],
	prim: Map<number, DataISO>
): ResultatRepte {
	const dates = [...prim.values()].sort();
	const data = objectiu > 0 && dates.length >= objectiu ? dates[objectiu - 1] : null;
	const cimIds = conjunt.filter((c) => !prim.has(c.id)).map((c) => c.id);
	return resultat(id, dates.length, objectiu, data, { tipus: 'cims', cimIds }, cimIds);
}

function avaluarComarques(
	id: string,
	conjunt: readonly Cim[],
	prim: Map<number, DataISO>
): ResultatRepte {
	const comarques: string[] = [];
	const primeraComarca = new Map<string, DataISO>();
	for (const c of conjunt) {
		if (!comarques.includes(c.comarca)) comarques.push(c.comarca);
		const d = prim.get(c.id);
		if (d === undefined) continue;
		const actual = primeraComarca.get(c.comarca);
		if (actual === undefined || d < actual) primeraComarca.set(c.comarca, d);
	}
	const objectiu = comarques.length;
	const dates = [...primeraComarca.values()].sort();
	const data = objectiu > 0 && dates.length === objectiu ? dates[objectiu - 1] : null;
	const pendentsC = comarques.filter((c) => !primeraComarca.has(c));
	const queden = new Set(pendentsC);
	const cimIds = conjunt.filter((c) => queden.has(c.comarca)).map((c) => c.id);
	return resultat(
		id,
		dates.length,
		objectiu,
		data,
		{ tipus: 'comarques', comarques: pendentsC },
		cimIds
	);
}

function avaluarEstacions(
	id: string,
	conjunt: readonly Cim[],
	valides: readonly AscensioRepte[],
	avui: DataISO
): ResultatRepte {
	// Per any natural: primera data de cada estació (qualsevol ascensió compta, no cal cim nou).
	const perAny = new Map<number, Map<Estacio, DataISO>>();
	for (const a of valides) {
		const any = anyDe(a.data);
		let m = perAny.get(any);
		if (!m) perAny.set(any, (m = new Map()));
		const e = estacioDe(a.data);
		const d = m.get(e);
		if (d === undefined || a.data < d) m.set(e, a.data);
	}
	let dataCompletat: DataISO | null = null;
	let millorAny: number | null = null;
	let millor = 0;
	for (const [any, m] of perAny) {
		if (m.size === ESTACIONS.length) {
			const d = [...m.values()].sort()[ESTACIONS.length - 1];
			if (dataCompletat === null || d < dataCompletat) dataCompletat = d;
		}
		if (m.size > millor || (m.size === millor && millorAny !== null && any > millorAny)) {
			millor = m.size;
			millorAny = any;
		}
	}
	const fetes = millorAny === null ? new Map<Estacio, DataISO>() : perAny.get(millorAny)!;
	const falten = ESTACIONS.filter((e) => !fetes.has(e));
	// Suma avui si l'estació d'avui encara falta aquest any.
	const anyAvui = perAny.get(anyDe(avui));
	const suma = !anyAvui?.has(estacioDe(avui));
	return resultat(
		id,
		millor,
		conjunt.length > 0 ? ESTACIONS.length : 0,
		dataCompletat,
		{ tipus: 'estacions', any: millorAny, estacions: falten },
		suma ? conjunt.map((c) => c.id) : []
	);
}

function avaluarMesos(
	id: string,
	objectiu: number,
	conjunt: readonly Cim[],
	prim: Map<number, DataISO>,
	avui: DataISO
): ResultatRepte {
	// Cim nou = primera ascensió del cim (que compta): cada cim només dona un mes.
	const primeraDelMes = new Map<number, DataISO>();
	for (const d of prim.values()) {
		const i = indexMes(d);
		const actual = primeraDelMes.get(i);
		if (actual === undefined || d < actual) primeraDelMes.set(i, d);
	}
	const mesos = [...primeraDelMes.keys()].sort((a, b) => a - b);
	let dataCompletat: DataISO | null = null;
	let millorRatxa = 0;
	let inici = 0;
	for (let k = 0; k < mesos.length; k++) {
		if (k > 0 && mesos[k] !== mesos[k - 1] + 1) inici = k;
		const llarg = k - inici + 1;
		millorRatxa = Math.max(millorRatxa, llarg);
		if (objectiu > 0 && llarg === objectiu && dataCompletat === null) {
			dataCompletat = primeraDelMes.get(mesos[k])!;
		}
	}
	const mesAvui = indexMes(avui);
	const mesActualFet = primeraDelMes.has(mesAvui);
	const fi = mesActualFet ? mesAvui : primeraDelMes.has(mesAvui - 1) ? mesAvui - 1 : null;
	let ratxa = 0;
	let primer: number | null = null;
	if (fi !== null) {
		primer = fi;
		while (primeraDelMes.has(primer - 1)) primer--;
		ratxa = fi - primer + 1;
	}
	const pendents: PendentsRepte = {
		tipus: 'mesos',
		ratxaActual: ratxa,
		inici: primer === null ? null : mesIso(primer),
		fi: fi === null ? null : mesIso(fi),
		mesActualFet,
		millorRatxa
	};
	const cimIds = mesActualFet ? [] : conjunt.filter((c) => !prim.has(c.id)).map((c) => c.id);
	const progres = dataCompletat !== null ? objectiu : Math.min(ratxa, objectiu);
	return resultat(id, progres, conjunt.length > 0 ? objectiu : 0, dataCompletat, pendents, cimIds);
}

// ---------------------------------------------------------------------------
// API
// ---------------------------------------------------------------------------

/**
 * Avalua un repte. `ascensions` en brut (esborrades incloses: es descarten). `estat` permet
 * reutilitzar el càlcul del carnet entre reptes (`avaluarReptes` ho fa).
 */
export function avaluarRepte(
	repte: Repte,
	ascensions: readonly AscensioRepte[],
	cataleg: Cataleg,
	opcions: OpcionsReptes,
	estat?: EstatRepte<AscensioRepte>
): ResultatRepte {
	const { avui, ...resta } = opcions;
	if (!esDataIsoValida(avui)) throw new RangeError(`avui invàlid: ${String(avui)}`);
	const regla = repte.condicio.regla;
	if (regla.tipus === 'cent-cims' || regla.tipus === 'infantil') {
		const o: OpcionsRepte = { ...OPCIONS_PER_DEFECTE, ...resta, comptarRepeticions: false };
		const e = estat ?? calcularEstatRepte(ascensions, cataleg, avui, o);
		const r =
			regla.tipus === 'cent-cims' ? resultatCentCims(e, cataleg) : resultatInfantil(e, cataleg, o);
		return { ...r, id: repte.id };
	}

	const conjunt = cimsDelFiltre(repte.condicio.cims, cataleg);
	const ids = new Set(conjunt.map((c) => c.id));
	const valides = ascensionsDelRepte(ascensions, repte.condicio, ids, avui);
	const prim = primeres(valides);

	switch (regla.tipus) {
		case 'n-distintes':
			return avaluarDistintes(repte.id, Math.max(0, Math.floor(regla.n)), conjunt, prim);
		case 'totes':
			return avaluarDistintes(repte.id, conjunt.length, conjunt, prim);
		case 'una-per-comarca':
			return avaluarComarques(repte.id, conjunt, prim);
		case 'estacions-mateix-any':
			return avaluarEstacions(repte.id, conjunt, valides, avui);
		case 'mesos-consecutius-cim-nou':
			return avaluarMesos(repte.id, Math.max(0, Math.floor(regla.mesos)), conjunt, prim, avui);
	}
}

/** Avalua diversos reptes (per defecte, `REPTES`) calculant l'estat del carnet una sola vegada. */
export function avaluarReptes(
	ascensions: readonly AscensioRepte[],
	cataleg: Cataleg,
	opcions: OpcionsReptes,
	reptes: readonly Repte[] = REPTES
): ResultatRepte[] {
	const { avui, ...resta } = opcions;
	if (!esDataIsoValida(avui)) throw new RangeError(`avui invàlid: ${String(avui)}`);
	let estat: EstatRepte<AscensioRepte> | undefined;
	return reptes.map((r) => {
		const t = r.condicio.regla.tipus;
		if ((t === 'cent-cims' || t === 'infantil') && !estat) {
			estat = calcularEstatRepte(ascensions, cataleg, avui, {
				...OPCIONS_PER_DEFECTE,
				...resta,
				comptarRepeticions: false
			});
		}
		return avaluarRepte(r, ascensions, cataleg, opcions, estat);
	});
}

/** Medalles d'uns resultats ja calculats (una per nivell assolit), en ordre cronològic. */
export function medallesDeResultats(resultats: readonly ResultatRepte[]): Medalla[] {
	const m: Medalla[] = [];
	for (const r of resultats) {
		for (const a of r.assoliments) m.push({ repteId: r.id, nivell: a.nivell, data: a.data });
	}
	return m.sort((a, b) =>
		a.data !== b.data
			? a.data < b.data
				? -1
				: 1
			: a.repteId !== b.repteId
				? a.repteId < b.repteId
					? -1
					: 1
				: a.nivell - b.nivell
	);
}

/** Medalles obtingudes amb la data (derivades de les ascensions; no es desa res). */
export function medalles(
	ascensions: readonly AscensioRepte[],
	cataleg: Cataleg,
	opcions: OpcionsReptes,
	reptes: readonly Repte[] = REPTES
): Medalla[] {
	return medallesDeResultats(avaluarReptes(ascensions, cataleg, opcions, reptes));
}
