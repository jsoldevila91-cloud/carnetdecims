/**
 * El carnet de segells (bloc 4b) com a funcions pures sobre `repte.ts`.
 *
 * Referència: `docs/03-modelo-datos.md` §3. El carnet té 5 pàgines de 100 caselles
 * (100, 2×100 … 5×100). Cada **cim diferent** que compta per al repte ocupa una casella;
 * les repeticions no creen segell nou (§3.3.1: el carnet sempre compta cims diferents,
 * per això `comptarRepeticions` s'ignora aquí).
 *
 * Decisions (regla d'essencials, §3.1 i §3.3.4):
 * - **Pàgina I** = els 100 primers cims que compten per al 100 (`progres100`): cims amb la
 *   1a ascensió anterior al 01/07/2019 (siguin o no essencials) i essencials. Ordre
 *   cronològic de la 1a ascensió vàlida; empat per `createdAt` i després per `id`.
 * - Les **no essencials amb la 1a ascensió des del 01/07/2019** no compten mentre no es
 *   completi el 100 ("no es tindran en compte … fins que no s'hagin assolit 100 cims dels
 *   llistat d'essencials"). Surten a part a `enEspera` amb `comptaPerRepte: false` i una
 *   posició **provisional** (a partir de la casella 101, en ordre cronològic): és on
 *   aniran quan es completi el 100 amb la lectura retroactiva per defecte.
 * - Completat el 100, els cims restants que compten (essencials o antigues més enllà del
 *   100è i, per defecte, totes les no essencials: `noEssencialsRetroactives`) omplen les
 *   pàgines II–V en ordre cronològic. Amb `noEssencialsRetroactives: false`, una no
 *   essencial posterior al tall només compta amb una ascensió estrictament posterior al
 *   dia del 100; el segell porta aquesta ascensió (data i id), i si no n'hi ha, és a
 *   `enEspera`.
 * - `dataCompletada` de la pàgina k = data del nivell k de `nivell()`: la més tardana entre
 *   el dia del 100 i el dia en què els cims que compten van arribar a k × 100.
 * - Més de 500 cims: el carnet només té 500 caselles; la resta va a `fora` (ordre 501…),
 *   però compta igualment en el total (coherent amb `nivell.comptador`).
 * - Restriccions d'accés (§3.3.5): només avís; les ascensions en restricció segellen igual.
 *
 * Coherència: el nombre de segells que compten (pàgines + `fora` amb `comptaPerRepte`) és el
 * progrés de `calcularEstatRepte`: `progres100.comptador` fins al 100 i `nivell.comptador`
 * després (el mateix que mostra `marcadorRepte`).
 */
import {
	DATA_NORMATIVA_ESSENCIALS,
	NIVELL_MAXIM,
	OBJECTIU_REPTE,
	OPCIONS_PER_DEFECTE,
	anyDe,
	avuiLocal,
	calcularEstatRepte,
	cimsNovesPerAny,
	progresPerZona,
	type OpcionsRepte
} from './repte';
import { distanciaKm, type Punt } from './geo';
import type { Ascensio, Cataleg, Cim, DataISO, Nivell } from './types';

// ---------------------------------------------------------------------------
// Tipus
// ---------------------------------------------------------------------------

export type NumeroPagina = 1 | 2 | 3 | 4 | 5;

/** Caselles per pàgina i caselles totals del carnet (5×100). */
export const CASELLES_PER_PAGINA = OBJECTIU_REPTE;
export const CASELLES_CARNET = NIVELL_MAXIM * OBJECTIU_REPTE;

export interface Segell {
	cimId: number;
	/** Data de l'ascensió que segella (la 1a vàlida; vegeu `noEssencialsRetroactives`). */
	data: DataISO;
	ascensioId: string;
	/** Posició al carnet, 1..500 (a `enEspera`, provisional). */
	ordre: number;
	pagina: NumeroPagina;
	/** 1..100 dins de la pàgina. */
	casella: number;
	essencial: boolean;
	/** `false` només a `enEspera`: no essencial posterior al 01/07/2019 sense el 100 fet. */
	comptaPerRepte: boolean;
}

/** Segell que no cap al carnet (ordre > 500): no té casella. */
export type SegellFora = Omit<Segell, 'pagina' | 'casella'>;

export interface PaginaCarnet {
	numero: NumeroPagina;
	/** Segells de la pàgina, per casella (1..100). */
	segells: Segell[];
	completa: boolean;
	dataCompletada: DataISO | null;
}

export interface Carnet {
	/** Sempre les 5 pàgines (les buides amb `segells: []`). */
	pagines: PaginaCarnet[];
	/** Pàgina on anirà el pròxim segell (5 si el carnet és ple). */
	paginaActual: NumeroPagina;
	/** Extra: no essencials que encara no compten (`comptaPerRepte: false`), en ordre. */
	enEspera: Segell[];
	/** Extra: segells més enllà de la casella 500 (normalment buit). */
	fora: SegellFora[];
}

/** `OpcionsRepte` + `avui` (per defecte `avuiLocal()`), per descartar dates futures. */
export interface OpcionsCarnet extends Partial<OpcionsRepte> {
	avui?: DataISO;
}

/** El que el carnet necessita d'una ascensió (`Ascensio` ho compleix). */
export type AscensioCarnet = Pick<Ascensio, 'id' | 'cimId' | 'data' | 'metode' | 'createdAt'> & {
	deletedAt?: string | null;
};

/** Per als càlculs sense ordre de segell (comarques, pendents). */
export type AscensioSimple = Pick<Ascensio, 'cimId' | 'data' | 'metode'> & {
	deletedAt?: string | null;
};

// ---------------------------------------------------------------------------
// Càlcul intern
// ---------------------------------------------------------------------------

interface Candidat {
	cim: Cim;
	asc: AscensioCarnet;
}

function compara(a: AscensioCarnet, b: AscensioCarnet): number {
	if (a.data !== b.data) return a.data < b.data ? -1 : 1;
	if (a.createdAt !== b.createdAt) return a.createdAt < b.createdAt ? -1 : 1;
	return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
}

const perAscensio = (a: Candidat, b: Candidat) => compara(a.asc, b.asc);

function aMapa(cataleg: Cataleg): ReadonlyMap<number, Cim> {
	if (cataleg instanceof Map) return cataleg;
	return new Map((cataleg as readonly Cim[]).map((c) => [c.id, c]));
}

function llistaCims<C extends Cim>(cataleg: readonly C[] | ReadonlyMap<number, C>): readonly C[] {
	return cataleg instanceof Map ? [...cataleg.values()] : (cataleg as readonly C[]);
}

interface SegellIntern {
	segell: Segell | SegellFora;
	asc: AscensioCarnet;
}

function crearSegell(c: Candidat, ordre: number, comptaPerRepte: boolean): SegellIntern {
	const base: SegellFora = {
		cimId: c.cim.id,
		data: c.asc.data,
		ascensioId: c.asc.id,
		ordre,
		essencial: c.cim.essencial,
		comptaPerRepte
	};
	const segell: Segell | SegellFora =
		ordre <= CASELLES_CARNET
			? {
					...base,
					pagina: Math.ceil(ordre / CASELLES_PER_PAGINA) as NumeroPagina,
					casella: ((ordre - 1) % CASELLES_PER_PAGINA) + 1
				}
			: base;
	return { segell, asc: c.asc };
}

function teCasella(s: Segell | SegellFora): s is Segell {
	return 'pagina' in s;
}

function calcular(ascensions: readonly AscensioCarnet[], cataleg: Cataleg, opcions: OpcionsCarnet) {
	const { avui: avuiOpcio, ...resta } = opcions;
	const avui = avuiOpcio ?? avuiLocal();
	// §3.3.1: el carnet sempre compta cims diferents.
	const o: OpcionsRepte = { ...OPCIONS_PER_DEFECTE, ...resta, comptarRepeticions: false };
	const estat = calcularEstatRepte(ascensions, cataleg, avui, o);
	const cims = aMapa(cataleg);

	// Ascensions vàlides de cada cim.
	const perCim = new Map<number, AscensioCarnet[]>();
	for (const a of estat.valides) {
		const llista = perCim.get(a.cimId);
		if (llista) llista.push(a);
		else perCim.set(a.cimId, [a]);
	}

	const completat = estat.progres100.dataAssoliment;
	const per100: Candidat[] = [];
	const noEssencials: Candidat[] = [];
	const espera: Candidat[] = [];
	for (const [cimId, llista] of perCim) {
		const cim = cims.get(cimId)!;
		llista.sort(compara);
		const primera = llista[0];
		const antiga = o.diaTallEsNormativaAntiga
			? primera.data <= DATA_NORMATIVA_ESSENCIALS
			: primera.data < DATA_NORMATIVA_ESSENCIALS;
		if (cim.essencial || antiga) {
			per100.push({ cim, asc: primera });
		} else if (completat === null) {
			espera.push({ cim, asc: primera });
		} else if (o.noEssencialsRetroactives) {
			noEssencials.push({ cim, asc: primera });
		} else {
			const posterior = llista.find((a) => a.data > completat);
			if (posterior) noEssencials.push({ cim, asc: posterior });
			else espera.push({ cim, asc: primera });
		}
	}
	per100.sort(perAscensio);
	espera.sort(perAscensio);
	const despres100 = [...per100.slice(OBJECTIU_REPTE), ...noEssencials].sort(perAscensio);
	const ordenats = [...per100.slice(0, OBJECTIU_REPTE), ...despres100];

	const compten = ordenats.map((c, i) => crearSegell(c, i + 1, true));
	const inici = Math.max(OBJECTIU_REPTE, compten.length);
	const esperen = espera.map((c, i) => crearSegell(c, inici + i + 1, false));

	// Data de cada nivell (la mateixa regla que `nivell().assoliments`).
	const dates = ordenats.map((c) => c.asc.data).sort();
	const dataNivell = (k: number): DataISO | null => {
		const d = dates[k * OBJECTIU_REPTE - 1];
		if (completat === null || d === undefined) return null;
		return d > completat ? d : completat;
	};

	return { avui, o, estat, compten, esperen, dataNivell };
}

// ---------------------------------------------------------------------------
// API
// ---------------------------------------------------------------------------

/**
 * Pàgines del carnet amb els segells (vegeu les decisions a la capçalera del fitxer).
 * Filtra les ascensions amb `ascensionsValides` (tombstones, dates futures o anteriors al
 * 2006-07-01, mètode, cim inexistent).
 */
export function paginesCarnet(
	ascensions: readonly AscensioCarnet[],
	cataleg: Cataleg,
	opcions: OpcionsCarnet = {}
): Carnet {
	const { compten, esperen, dataNivell } = calcular(ascensions, cataleg, opcions);
	const segells = compten.map((s) => s.segell);
	const pagines: PaginaCarnet[] = [];
	for (let k = 1; k <= NIVELL_MAXIM; k++) {
		const dePagina = segells.filter((s): s is Segell => teCasella(s) && s.pagina === k);
		const completa = dePagina.length === CASELLES_PER_PAGINA;
		pagines.push({
			numero: k as NumeroPagina,
			segells: dePagina,
			completa,
			dataCompletada: completa ? dataNivell(k) : null
		});
	}
	const espera = esperen.map((s) => s.segell);
	return {
		pagines,
		paginaActual: Math.min(
			NIVELL_MAXIM,
			Math.floor(segells.length / CASELLES_PER_PAGINA) + 1
		) as NumeroPagina,
		enEspera: espera.filter(teCasella),
		fora: [...segells, ...espera].filter((s) => !teCasella(s))
	};
}

export interface ResumCarnet {
	/** Segells que compten (= progrés: `progres100.comptador` o `nivell.comptador`). */
	total: number;
	/** 100, 200 … 500 (500 també amb el 5×100 fet). */
	objectiuActual: number;
	nivell: Nivell;
	/** Essencials amb alguna ascensió vàlida / essencials del catàleg (150). */
	essencials: { fetes: number; total: number };
	/**
	 * Cims nous (1a ascensió) a l'any natural d'`avui` i el límit de l'avís (§3.3.2: només
	 * informatiu, no bloqueja). `any` és un camp extra.
	 */
	anyActual: { any: number; cimsNous: number; limit: number; excedit: boolean };
	/** Segell amb casella de l'ascensió més recent (data, `createdAt`, id). */
	ultimSegell: Segell | null;
}

/** Resum per a la capçalera del carnet. */
export function resumCarnet(
	ascensions: readonly AscensioCarnet[],
	cataleg: Cataleg,
	opcions: OpcionsCarnet = {}
): ResumCarnet {
	const { avui, o, estat, compten } = calcular(ascensions, cataleg, opcions);
	const n = estat.nivell.nivell;
	const any = anyDe(avui);
	const cimsNous = cimsNovesPerAny(estat.valides).get(any) ?? 0;

	let ultim: SegellIntern | null = null;
	for (const s of compten) {
		if (teCasella(s.segell) && (ultim === null || compara(s.asc, ultim.asc) > 0)) ultim = s;
	}

	return {
		total: compten.length,
		objectiuActual: Math.min(NIVELL_MAXIM, n + 1) * OBJECTIU_REPTE,
		nivell: n,
		essencials: {
			fetes: estat.progres100.essencialsAssolides,
			total: estat.progres100.totalEssencials
		},
		anyActual: { any, cimsNous, limit: o.limitAnual, excedit: cimsNous > o.limitAnual },
		ultimSegell: ultim !== null && teCasella(ultim.segell) ? ultim.segell : null
	};
}

export interface ProgresComarca {
	/** Slug de la comarca (`Cim.comarca`). */
	comarca: string;
	fets: number;
	total: number;
	essencialsFets: number;
	essencialsTotal: number;
}

/**
 * Progrés per comarca sobre el catàleg actual (historial: cims diferents amb alguna
 * ascensió vàlida, sense la regla d'essencials, com `progresPerZona`). Ordre: més progrés
 * relatiu (`fets / total`) primer; empat per més cims fets; després alfabètic per slug
 * (`localeCompare` en català). Les comarques sense cap cim fet queden al final en ordre
 * alfabètic.
 */
export function progresComarques(
	ascensions: readonly AscensioSimple[],
	cataleg: Cataleg,
	opcions: { avui?: DataISO } = {}
): ProgresComarca[] {
	const avui = opcions.avui ?? avuiLocal();
	const valides = calcularEstatRepte(ascensions, cataleg, avui).valides;
	return progresPerZona(valides, cataleg)
		.sort(
			(a, b) =>
				b.fraccio - a.fraccio || b.fetes - a.fetes || a.comarca.localeCompare(b.comarca, 'ca')
		)
		.map((z) => ({
			comarca: z.comarca,
			fets: z.fetes,
			total: z.total,
			essencialsFets: z.essencialsFetes,
			essencialsTotal: z.totalEssencials
		}));
}

/**
 * Essencials sense cap ascensió vàlida. Amb `des` (posició WGS84), ordenades per distància
 * (`distanciaKm`) i les que no tenen coordenades al final; sense posició, per comarca
 * (slug, alfabètic), altitud descendent i id. Retorna el tipus de cim del catàleg rebut
 * (p. ex. `CimCataleg`).
 */
export function essencialsPendentsOrdenades<C extends Cim>(
	ascensions: readonly AscensioSimple[],
	cataleg: readonly C[] | ReadonlyMap<number, C>,
	opcions: { des?: Punt | null; avui?: DataISO } = {}
): C[] {
	const avui = opcions.avui ?? avuiLocal();
	const valides = calcularEstatRepte(ascensions, cataleg, avui).valides;
	const fetes = new Set(valides.map((a) => a.cimId));
	const pendents = llistaCims(cataleg).filter((c) => c.essencial && !fetes.has(c.id));
	const perComarca = (a: C, b: C) =>
		a.comarca.localeCompare(b.comarca, 'ca') || b.altitud - a.altitud || a.id - b.id;
	const des = opcions.des;
	if (!des) return [...pendents].sort(perComarca);
	const distancia = new Map(
		pendents.map((c) => [
			c.id,
			c.lat === null || c.lon === null ? Infinity : distanciaKm(des, { lat: c.lat, lon: c.lon })
		])
	);
	return [...pendents].sort((a, b) => {
		const da = distancia.get(a.id)!;
		const db = distancia.get(b.id)!;
		if (da !== db) return da < db ? -1 : 1;
		return perComarca(a, b);
	});
}
