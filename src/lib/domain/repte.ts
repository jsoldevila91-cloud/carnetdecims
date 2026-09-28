/**
 * Reglas del reto 100 Cims de la FEEC como funciones puras.
 *
 * Referencia: `docs/03-modelo-datos.md` §3 y normativa FEEC
 * (https://www.feec.cat/activitats/100-cims/normativa-i-funcionament/,
 * circular 63/2019). La app **no valida** ascensiones: solo hace seguimiento;
 * la validación oficial la hace la FEEC a través de las entidades.
 *
 * Todas las fechas son fechas de calendario `YYYY-MM-DD` (ver `types.ts`). No se
 * usa `Date` salvo en `avuiLocal`, que convierte un instante a fecha local.
 */
import {
	METODES,
	type Ascensio,
	type Cataleg,
	type Cim,
	type DataISO,
	type Metode,
	type Nivell,
	type RestriccioAcces
} from './types';

// ---------------------------------------------------------------------------
// Constantes de la normativa
// ---------------------------------------------------------------------------

/** "L'inici de l'activitat és el dia 1 de juliol de 2006" (normativa FEEC). */
export const DATA_INICI_REPTE: DataISO = '2006-07-01';

/** Entrada en vigor de la normativa de esenciales (circular 63/2019). */
export const DATA_NORMATIVA_ESSENCIALS: DataISO = '2019-07-01';

/** Cimas (distintas) necesarias para completar el reto. */
export const OBJECTIU_REPTE = 100;

/** Reto infantil (7–14 años, vigente desde el 01/07/2026): 50 cimas cualesquiera. */
export const OBJECTIU_INFANTIL = 50;

/** Nivel máximo reconocido: 5×100 (500 cimas). */
export const NIVELL_MAXIM = 5;

/** "Es poden presentar un màxim de 100 cims per ser validats anualment". */
export const LIMIT_ANUAL_PER_DEFECTE = 100;

// ---------------------------------------------------------------------------
// Opciones para las interpretaciones ambiguas (§3.3)
// ---------------------------------------------------------------------------

/**
 * Interpretaciones configurables de las ambigüedades de la normativa
 * (`03-modelo-datos.md` §3.3). Conviene confirmarlas con 100cims@feec.cat.
 */
export interface OpcionsRepte {
	/**
	 * §3.3.1 — ¿Cuentan las repeticiones de una misma cima para 2×100…5×100?
	 * Por defecto `false`: "200… 500 dels cims del llistat" y 500 ≤ 522 apuntan a
	 * cimas distintas; las repeticiones solo son historial. Con `true`, cada
	 * ascensión válida suma para los niveles (el 100 siempre exige cimas distintas).
	 */
	comptarRepeticions: boolean;
	/**
	 * §3.3.3 — ¿El propio 01/07/2019 es normativa antigua?
	 * Por defecto `false`: normativa antigua = primera ascensión `< 2019-07-01`
	 * ("des del dia 1 de juliol" rige la nueva). Con `true`: `<= 2019-07-01`.
	 */
	diaTallEsNormativaAntiga: boolean;
	/**
	 * §3.3.4 — ¿Las no esenciales posteriores al corte cuentan retroactivamente
	 * para 2×100 una vez completado el 100?
	 * Por defecto `true` (lectura del CE Taradell): al completar el 100 cuentan
	 * todas las cimas distintas. Con `false` (lectura literal de "no es tindran en
	 * compte… fins que"): una no esencial posterior al corte solo cuenta si tiene
	 * una ascensión válida **estrictamente posterior** al día en que se completó
	 * el 100 (el orden dentro del mismo día no se conoce).
	 */
	noEssencialsRetroactives: boolean;
	/**
	 * §3.3.2 — Límite anual para el **aviso** de exceso (cimas nuevas por año
	 * natural de ascensión). Por defecto 100. Nunca bloquea el registro.
	 */
	limitAnual: number;
	/**
	 * §3.3.6 — Fecha mínima de las ascensiones que cuentan para el reto infantil.
	 * Por defecto `null`: cuentan todas las válidas (desde 2006-07-01). Para contar
	 * solo desde la entrada en vigor del reto infantil, usar `'2026-07-01'`.
	 */
	dataIniciInfantil: DataISO | null;
}

/** Valores por defecto de las interpretaciones (ver cada campo de `OpcionsRepte`). */
export const OPCIONS_PER_DEFECTE: Readonly<OpcionsRepte> = Object.freeze({
	comptarRepeticions: false,
	diaTallEsNormativaAntiga: false,
	noEssencialsRetroactives: true,
	limitAnual: LIMIT_ANUAL_PER_DEFECTE,
	dataIniciInfantil: null
});

function resoldreOpcions(opcions: Partial<OpcionsRepte> = {}): OpcionsRepte {
	return { ...OPCIONS_PER_DEFECTE, ...opcions };
}

// ---------------------------------------------------------------------------
// Fechas
// ---------------------------------------------------------------------------

const RE_DATA_ISO = /^(\d{4})-(\d{2})-(\d{2})$/;

function esAnyTraspas(any: number): boolean {
	return (any % 4 === 0 && any % 100 !== 0) || any % 400 === 0;
}

function diesDelMes(any: number, mes: number): number {
	if (mes === 2) return esAnyTraspas(any) ? 29 : 28;
	return [4, 6, 9, 11].includes(mes) ? 30 : 31;
}

/**
 * ¿Es `valor` una fecha de calendario real en formato `YYYY-MM-DD`?
 * Rechaza fechas imposibles ('2023-02-30'), horas y formatos no canónicos.
 */
export function esDataIsoValida(valor: unknown): valor is DataISO {
	if (typeof valor !== 'string') return false;
	const m = RE_DATA_ISO.exec(valor);
	if (!m) return false;
	const any = Number(m[1]);
	const mes = Number(m[2]);
	const dia = Number(m[3]);
	if (any < 1 || mes < 1 || mes > 12 || dia < 1) return false;
	return dia <= diesDelMes(any, mes);
}

/** Año natural de una fecha `YYYY-MM-DD` válida. */
export function anyDe(data: DataISO): number {
	return Number(data.slice(0, 4));
}

/**
 * Fecha de calendario local (`YYYY-MM-DD`) de un instante en una zona horaria.
 * Por defecto `Europe/Madrid`, que es la referencia para "no futura" (§3.2).
 * Es la única función que usa `Date`; el resto recibe `avui` ya calculado.
 */
export function avuiLocal(ara: Date = new Date(), zonaHoraria = 'Europe/Madrid'): DataISO {
	if (Number.isNaN(ara.getTime())) throw new RangeError('Instant invàlid');
	const parts = new Intl.DateTimeFormat('en-US', {
		timeZone: zonaHoraria,
		year: 'numeric',
		month: '2-digit',
		day: '2-digit'
	}).formatToParts(ara);
	const valor = (tipus: string) => parts.find((p) => p.type === tipus)?.value ?? '';
	return `${valor('year').padStart(4, '0')}-${valor('month')}-${valor('day')}`;
}

export type ErrorData = 'format' | 'anterior-inici' | 'futura';
export type ResultatValidacioData = { ok: true } | { ok: false; error: ErrorData };

/**
 * Valida la fecha de una ascensión: `2006-07-01 ≤ data ≤ avui`.
 * - Inicio: "L'inici de l'activitat és el dia 1 de juliol de 2006".
 * - No futura: `avui` es la fecha local (Europe/Madrid) inyectada, ver `avuiLocal`.
 * @throws RangeError si `avui` no es una fecha válida (error de programación).
 */
export function validarData(data: unknown, avui: DataISO): ResultatValidacioData {
	if (!esDataIsoValida(avui)) throw new RangeError(`avui invàlid: ${String(avui)}`);
	if (!esDataIsoValida(data)) return { ok: false, error: 'format' };
	if (data < DATA_INICI_REPTE) return { ok: false, error: 'anterior-inici' };
	if (data > avui) return { ok: false, error: 'futura' };
	return { ok: true };
}

/** Método admitido: a pie, BTT, esquí o raquetas (sin vehículos a motor). */
export function validarMetode(metode: unknown): metode is Metode {
	return typeof metode === 'string' && (METODES as readonly string[]).includes(metode);
}

// ---------------------------------------------------------------------------
// Ascensiones válidas y cimas distintas
// ---------------------------------------------------------------------------

/** Datos mínimos de una ascensión que usan los cálculos de progreso. */
export type AscensioMinima = Pick<Ascensio, 'cimId' | 'data'>;

function aMapa(cataleg: Cataleg): ReadonlyMap<number, Cim> {
	if (cataleg instanceof Map) return cataleg;
	return new Map((cataleg as readonly Cim[]).map((c) => [c.id, c]));
}

function llistaCims(cataleg: Cataleg): readonly Cim[] {
	return cataleg instanceof Map ? [...cataleg.values()] : (cataleg as readonly Cim[]);
}

/**
 * Filtra las ascensiones que cuentan (§3.2): sin tombstone (`deletedAt`), fecha
 * válida (`validarData`), método admitido y cima existente en el catálogo.
 * El límite anual **no** filtra: es solo un aviso (`excesAnual`).
 */
export function ascensionsValides<
	T extends Pick<Ascensio, 'cimId' | 'data' | 'metode'> & { deletedAt?: string | null }
>(ascensions: readonly T[], cataleg: Cataleg, avui: DataISO): T[] {
	const cims = aMapa(cataleg);
	return ascensions.filter(
		(a) =>
			!a.deletedAt && validarData(a.data, avui).ok && validarMetode(a.metode) && cims.has(a.cimId)
	);
}

/**
 * Por cada cima, la fecha de su primera ascensión (la más antigua).
 * Se permiten varias ascensiones a la misma cima (historial); las reglas usan la
 * primera. Recibe ascensiones ya filtradas con `ascensionsValides`.
 */
export function primeresAscensions(ascensions: readonly AscensioMinima[]): Map<number, DataISO> {
	const primeres = new Map<number, DataISO>();
	for (const a of ascensions) {
		const actual = primeres.get(a.cimId);
		if (actual === undefined || a.data < actual) primeres.set(a.cimId, a.data);
	}
	return primeres;
}

/** Fecha en que una lista de fechas alcanza `n` elementos (orden cronológico). */
function dataEnArribarA(dates: readonly DataISO[], n: number): DataISO | null {
	if (n <= 0 || dates.length < n) return null;
	return [...dates].sort()[n - 1];
}

function esNormativaAntiga(data: DataISO, o: OpcionsRepte): boolean {
	return o.diaTallEsNormativaAntiga
		? data <= DATA_NORMATIVA_ESSENCIALS
		: data < DATA_NORMATIVA_ESSENCIALS;
}

// ---------------------------------------------------------------------------
// Reto 100 (primer nivel) con la regla de esenciales
// ---------------------------------------------------------------------------

export interface Progres100 {
	objectiu: number;
	/** Cimas distintas que cuentan para el 100 (puede superar 100). */
	comptador: number;
	completat: boolean;
	/** Día en que se llegó a 100 cimas que cuentan; `null` si no se ha completado. */
	dataAssoliment: DataISO | null;
	/** De `comptador`, cuántas cuentan por normativa antigua (1ª ascensión antes del corte). */
	cimsNormativaAntiga: number;
	/** Esenciales distintas con alguna ascensión válida (cualquier fecha). */
	essencialsAssolides: number;
	totalEssencials: number;
	/** Esenciales sin ninguna ascensión, en el orden del catálogo. */
	essencialsPendents: Cim[];
}

/**
 * Progreso hacia el 100 (§3.1 y §3.2):
 * - Cimas con primera ascensión anterior al 01/07/2019: cuentan todas, sean o no
 *   esenciales (circular 63/2019: los conseguidos antes siguen siendo válidos).
 * - Desde el 01/07/2019: solo cuentan las **esenciales** ("s'han d'assolir un
 *   centenar de cims del llistat de 150 que es qualifiquen com 'essencials'").
 * - Solo cimas distintas; las repeticiones no suman.
 */
export function progres100(
	ascensions: readonly AscensioMinima[],
	cataleg: Cataleg,
	opcions: Partial<OpcionsRepte> = {}
): Progres100 {
	const o = resoldreOpcions(opcions);
	const cims = aMapa(cataleg);
	const primeres = primeresAscensions(ascensions);

	const datesQueCompten: DataISO[] = [];
	let antigues = 0;
	let essencialsAssolides = 0;
	for (const [cimId, data] of primeres) {
		const cim = cims.get(cimId);
		if (!cim) continue;
		if (cim.essencial) essencialsAssolides++;
		if (esNormativaAntiga(data, o)) {
			antigues++;
			datesQueCompten.push(data);
		} else if (cim.essencial) {
			datesQueCompten.push(data);
		}
	}

	const totes = llistaCims(cataleg);
	const essencialsPendents = totes.filter((c) => c.essencial && !primeres.has(c.id));
	const dataAssoliment = dataEnArribarA(datesQueCompten, OBJECTIU_REPTE);

	return {
		objectiu: OBJECTIU_REPTE,
		comptador: datesQueCompten.length,
		completat: dataAssoliment !== null,
		dataAssoliment,
		cimsNormativaAntiga: antigues,
		essencialsAssolides,
		totalEssencials: totes.filter((c) => c.essencial).length,
		essencialsPendents
	};
}

/** Esenciales que aún no tienen ninguna ascensión válida (orden del catálogo). */
export function essencialsPendents(ascensions: readonly AscensioMinima[], cataleg: Cataleg): Cim[] {
	const fetes = new Set(ascensions.map((a) => a.cimId));
	return llistaCims(cataleg).filter((c) => c.essencial && !fetes.has(c.id));
}

// ---------------------------------------------------------------------------
// Niveles 100 … 5×100
// ---------------------------------------------------------------------------

export interface ResultatNivell {
	nivell: Nivell;
	/** Unidades que cuentan para los niveles (cimas distintas, o ascensiones si `comptarRepeticions`). */
	comptador: number;
	/** Objetivo del siguiente nivel (200, 300…); `null` en 5×100. */
	seguentObjectiu: number | null;
	/** Cuántas faltan para el siguiente nivel; `null` en 5×100. */
	falten: number | null;
	/** Fecha en que se alcanzó cada nivel (el sello del carnet), solo los alcanzados. */
	assoliments: { nivell: Exclude<Nivell, 0>; data: DataISO }[];
}

/**
 * Nivel de reconocimiento (§3.1: "200, 300, 400 o 500 dels cims del llistat"):
 * - 0 mientras no se haya completado el 100 con la regla de esenciales
 *   (las no esenciales "no es tindran en compte … fins que no s'hagin assolit 100
 *   cims dels llistat d'essencials").
 * - Después, `min(5, floor(comptador / 100))`, contando por defecto **todas** las
 *   cimas distintas (§3.3.1 y §3.3.4, configurables en `OpcionsRepte`).
 * - La fecha de cada nivel es la más tardía entre el día en que se completó el 100
 *   y el día en que las unidades llegaron a `n × 100`.
 */
export function nivell(
	ascensions: readonly AscensioMinima[],
	cataleg: Cataleg,
	opcions: Partial<OpcionsRepte> = {}
): ResultatNivell {
	const o = resoldreOpcions(opcions);
	const cims = aMapa(cataleg);
	const p100 = progres100(ascensions, cataleg, o);
	const completat = p100.dataAssoliment;

	// Una ascensión suma para los niveles si su cima cuenta (antigua o esencial) o,
	// para no esenciales posteriores al corte, según `noEssencialsRetroactives`.
	const primeres = primeresAscensions(ascensions);
	const compta = (a: AscensioMinima): boolean => {
		const cim = cims.get(a.cimId);
		const primera = primeres.get(a.cimId);
		if (!cim || primera === undefined) return false;
		if (cim.essencial || esNormativaAntiga(primera, o)) return true;
		if (o.noEssencialsRetroactives) return true;
		return completat !== null && a.data > completat;
	};

	let dates: DataISO[];
	if (o.comptarRepeticions) {
		dates = ascensions.filter(compta).map((a) => a.data);
	} else {
		// Una unidad por cima: la fecha de su primera ascensión que cuenta.
		const perCim = new Map<number, DataISO>();
		for (const a of ascensions) {
			if (!compta(a)) continue;
			const actual = perCim.get(a.cimId);
			if (actual === undefined || a.data < actual) perCim.set(a.cimId, a.data);
		}
		dates = [...perCim.values()];
	}
	dates.sort();
	const comptador = dates.length;

	let n = 0;
	const assoliments: ResultatNivell['assoliments'] = [];
	if (completat !== null) {
		n = Math.max(1, Math.min(NIVELL_MAXIM, Math.floor(comptador / OBJECTIU_REPTE)));
		for (let k = 1; k <= n; k++) {
			const dataK = dates[k * OBJECTIU_REPTE - 1];
			assoliments.push({
				nivell: k as Exclude<Nivell, 0>,
				data: dataK !== undefined && dataK > completat ? dataK : completat
			});
		}
	}

	const seguentObjectiu = n < NIVELL_MAXIM ? (n + 1) * OBJECTIU_REPTE : null;
	return {
		nivell: n as Nivell,
		comptador,
		seguentObjectiu,
		falten:
			seguentObjectiu === null
				? null
				: n === 0
					? Math.max(0, OBJECTIU_REPTE - p100.comptador)
					: Math.max(0, seguentObjectiu - comptador),
		assoliments
	};
}

// ---------------------------------------------------------------------------
// Límite anual (aviso)
// ---------------------------------------------------------------------------

export interface ExcesAnual {
	any: number;
	/** Cimas cuya primera ascensión cae en ese año natural. */
	cimsNoves: number;
	/** `cimsNoves - limitAnual` (> 0). */
	exces: number;
}

/** Cimas nuevas (primera ascensión) por año natural, ordenado por año. */
export function cimsNovesPerAny(ascensions: readonly AscensioMinima[]): Map<number, number> {
	const perAny = new Map<number, number>();
	for (const data of primeresAscensions(ascensions).values()) {
		const any = anyDe(data);
		perAny.set(any, (perAny.get(any) ?? 0) + 1);
	}
	return new Map([...perAny].sort((a, b) => a[0] - b[0]));
}

/**
 * Años con más cimas nuevas que el límite anual (§3.1: "un màxim de 100 cims per
 * ser validats anualment"). Es un **aviso informativo**: la normativa limita las
 * cimas presentadas por año y la app no presenta nada (§3.3.2); no bloquea.
 */
export function excesAnual(
	ascensions: readonly AscensioMinima[],
	opcions: Partial<OpcionsRepte> = {}
): ExcesAnual[] {
	const { limitAnual } = resoldreOpcions(opcions);
	const resultat: ExcesAnual[] = [];
	for (const [any, cimsNoves] of cimsNovesPerAny(ascensions)) {
		if (cimsNoves > limitAnual) resultat.push({ any, cimsNoves, exces: cimsNoves - limitAnual });
	}
	return resultat;
}

// ---------------------------------------------------------------------------
// Reto infantil
// ---------------------------------------------------------------------------

export interface ProgresInfantil {
	objectiu: number;
	comptador: number;
	completat: boolean;
	dataAssoliment: DataISO | null;
}

/**
 * Reto infantil (vigente desde el 01/07/2026): 50 cimas distintas cualesquiera de
 * la lista, sin distinción de esenciales ni límite anual. La edad (7–14 años) no
 * se modela en el MVP (§1.2 y §3.3.6).
 */
export function progresInfantil(
	ascensions: readonly AscensioMinima[],
	cataleg: Cataleg,
	opcions: Partial<OpcionsRepte> = {}
): ProgresInfantil {
	const { dataIniciInfantil } = resoldreOpcions(opcions);
	const cims = aMapa(cataleg);
	const filtrades = ascensions.filter(
		(a) => cims.has(a.cimId) && (dataIniciInfantil === null || a.data >= dataIniciInfantil)
	);
	const dates = [...primeresAscensions(filtrades).values()];
	const dataAssoliment = dataEnArribarA(dates, OBJECTIU_INFANTIL);
	return {
		objectiu: OBJECTIU_INFANTIL,
		comptador: dates.length,
		completat: dataAssoliment !== null,
		dataAssoliment
	};
}

// ---------------------------------------------------------------------------
// Progreso por comarca
// ---------------------------------------------------------------------------

export interface ProgresZona {
	comarca: string;
	total: number;
	fetes: number;
	totalEssencials: number;
	essencialsFetes: number;
	/** `fetes / total` en [0, 1]; el formato (%) lo decide la UI. */
	fraccio: number;
	completa: boolean;
}

/**
 * Progreso por comarca (§3.2): cimas distintas con alguna ascensión válida sobre
 * el total de la comarca, en el orden de aparición en el catálogo. No aplica la
 * regla de esenciales: es una vista del historial (base del logro
 * `comarca_completa:{zona}`).
 */
export function progresPerZona(
	ascensions: readonly AscensioMinima[],
	cataleg: Cataleg
): ProgresZona[] {
	const fetes = new Set(ascensions.map((a) => a.cimId));
	const perComarca = new Map<string, ProgresZona>();
	for (const cim of llistaCims(cataleg)) {
		let z = perComarca.get(cim.comarca);
		if (!z) {
			z = {
				comarca: cim.comarca,
				total: 0,
				fetes: 0,
				totalEssencials: 0,
				essencialsFetes: 0,
				fraccio: 0,
				completa: false
			};
			perComarca.set(cim.comarca, z);
		}
		const feta = fetes.has(cim.id);
		z.total++;
		if (feta) z.fetes++;
		if (cim.essencial) {
			z.totalEssencials++;
			if (feta) z.essencialsFetes++;
		}
	}
	for (const z of perComarca.values()) {
		z.fraccio = z.total === 0 ? 0 : z.fetes / z.total;
		z.completa = z.total > 0 && z.fetes === z.total;
	}
	return [...perComarca.values()];
}

// ---------------------------------------------------------------------------
// Restricciones de acceso (aviso)
// ---------------------------------------------------------------------------

const RE_MMDD = /^(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

/**
 * ¿Está activa la restricción en la fecha dada? (§3.2). Solo sirve para mostrar
 * un **aviso**: no se sabe si la FEEC invalida esas ascensiones (§3.3.5).
 * - Periodo anual `MM-DD`..`MM-DD`, ambos inclusive; si inicio > fin, cruza el
 *   cambio de año (p. ej. Roc Roi, `12-01`..`06-01`).
 * - Rango de fechas `dataInici`..`dataFi`, inclusive (`null` = abierto).
 * - Si hay ambos, deben cumplirse los dos. Sin ninguno = permanente.
 * - `vigent === false` = nunca activa.
 */
export function restriccioActiva(r: RestriccioAcces, data: DataISO): boolean {
	if (r.vigent === false || !esDataIsoValida(data)) return false;
	if (r.dataInici !== null && data < r.dataInici) return false;
	if (r.dataFi !== null && data > r.dataFi) return false;
	const inici = r.periodeIniciMmdd;
	const fi = r.periodeFiMmdd;
	if (inici !== null && fi !== null && RE_MMDD.test(inici) && RE_MMDD.test(fi)) {
		const mmdd = data.slice(5);
		return inici <= fi ? mmdd >= inici && mmdd <= fi : mmdd >= inici || mmdd <= fi;
	}
	return true;
}

/** Restricciones de una cima activas en una fecha. */
export function restriccionsActives(
	cim: Pick<Cim, 'restriccions'>,
	data: DataISO
): RestriccioAcces[] {
	return cim.restriccions.filter((r) => restriccioActiva(r, data));
}

/** Periode anual recurrent (`MM-DD`..`MM-DD`), p. ej. fauna del 15/01 al 15/06. */
export function esRestriccioPeriodica(r: RestriccioAcces): boolean {
	return (
		r.periodeIniciMmdd !== null &&
		r.periodeFiMmdd !== null &&
		RE_MMDD.test(r.periodeIniciMmdd) &&
		RE_MMDD.test(r.periodeFiMmdd)
	);
}

/** Vigent sense periode ni rang de dates: s'aplica sempre (obres sense data, zona militar…). */
export function esRestriccioPermanent(r: RestriccioAcces): boolean {
	return (
		r.vigent !== false && !esRestriccioPeriodica(r) && r.dataInici === null && r.dataFi === null
	);
}

/** Ja no es tornarà a aplicar a partir de `data`: `vigent === false` o `dataFi` anterior. */
export function restriccioCaducada(r: RestriccioAcces, data: DataISO): boolean {
	return r.vigent === false || (r.dataFi !== null && data > r.dataFi);
}

export interface EstatRestriccions {
	/** Actives en la data: la fitxa mostra "restricció vigent avui". */
	actives: RestriccioAcces[];
	/**
	 * Encara aplicables però no actives en la data: periode anual fora de temporada o rang que
	 * encara no ha començat. La fitxa les mostra com a informació ("del 15/01 al 15/06").
	 */
	inactives: RestriccioAcces[];
	/** Hi ha alguna restricció no caducada (activa o no): la fitxa mostra la secció. */
	teRestriccions: boolean;
}

/**
 * Classifica les restriccions d'un cim en una data (per a l'avís de la fitxa). Les
 * caducades (`restriccioCaducada`) no hi surten. Com `restriccioActiva`, és només un avís.
 * La data ha de ser la d'avui en local (`avuiLocal()`): en una pàgina prerenderitzada s'ha de
 * calcular al client, no al build.
 * @throws RangeError si `data` no és una data vàlida (error de programació).
 */
export function estatRestriccions(
	cim: Pick<Cim, 'restriccions'>,
	data: DataISO
): EstatRestriccions {
	if (!esDataIsoValida(data)) throw new RangeError(`data invàlida: ${String(data)}`);
	const actives: RestriccioAcces[] = [];
	const inactives: RestriccioAcces[] = [];
	for (const r of cim.restriccions) {
		if (restriccioCaducada(r, data)) continue;
		(restriccioActiva(r, data) ? actives : inactives).push(r);
	}
	return { actives, inactives, teRestriccions: actives.length + inactives.length > 0 };
}

/** Té alguna restricció activa en la data? */
export function teRestriccioActiva(cim: Pick<Cim, 'restriccions'>, data: DataISO): boolean {
	return cim.restriccions.some((r) => restriccioActiva(r, data));
}

// ---------------------------------------------------------------------------
// Resumen completo
// ---------------------------------------------------------------------------

export interface EstatRepte<T> {
	valides: T[];
	primeres: Map<number, DataISO>;
	progres100: Progres100;
	nivell: ResultatNivell;
	excesAnual: ExcesAnual[];
	infantil: ProgresInfantil;
	perZona: ProgresZona[];
}

/**
 * Calcula todo el estado del reto a partir de las ascensiones en bruto
 * (filtra primero con `ascensionsValides`). Pensado para la UI de progreso.
 */
export function calcularEstatRepte<
	T extends Pick<Ascensio, 'cimId' | 'data' | 'metode'> & { deletedAt?: string | null }
>(
	ascensions: readonly T[],
	cataleg: Cataleg,
	avui: DataISO,
	opcions: Partial<OpcionsRepte> = {}
): EstatRepte<T> {
	const mapa = aMapa(cataleg);
	const valides = ascensionsValides(ascensions, mapa, avui);
	return {
		valides,
		primeres: primeresAscensions(valides),
		progres100: progres100(valides, cataleg, opcions),
		nivell: nivell(valides, cataleg, opcions),
		excesAnual: excesAnual(valides, opcions),
		infantil: progresInfantil(valides, mapa, opcions),
		perZona: progresPerZona(valides, cataleg)
	};
}
