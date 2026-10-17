/**
 * Exportació per a la validació oficial (bloc R3): la llista de les ascensions d'un any que la
 * persona pot passar al full de la FEEC, amb avisos. Funcions pures sobre `repte.ts`.
 *
 * Referència: `docs/03-modelo-datos.md` §3.1, §3.3 i §3.7. La app **no valida** res ni presenta
 * res a la FEEC: és una ajuda per omplir el full. No hi ha nom, DNI ni llicència: el full els
 * omple la persona a mà i no es desen enlloc.
 *
 * Semàntica (decisions documentades a §3.7):
 * - **Files** = ascensions que compten (`ascensionsValides`: vives, data 2006-07-01..avui, mètode
 *   sense motor, cim del catàleg) de l'any natural `any` (i des de `desDe`, si n'hi ha).
 * - **Excloses** = ascensions de l'any que no compten mai, amb el motiu (`MotiuExclusio`). Les de
 *   data amb format invàlid no tenen any i no surten enlloc.
 * - Avisos d'una fila (es poden acumular):
 *   - `restriccio`: el dia de l'ascensió hi havia una restricció d'accés activa al cim
 *     (`ascensionsEnRestriccio`; la FEEC no valida les ascensions dins del període, §3.3.5).
 *   - `restriccio-incerta`: en lloc de `restriccio` (mai tots dos) quan totes les restriccions
 *     actives aquell dia són permanents i sense dates (`AvisRestriccio.incerta`, p. ex. obres sense
 *     inici conegut): no se sap si l'ascensió hi cau dins; la UI ho ha de dir com a dubte.
 *   - `repetit`: el cim ja tenia una ascensió vàlida anterior (qualsevol any, també el mateix);
 *     ordre: data, `createdAt`, id. No és un cim nou.
 *   - `mes-de-100`: és el cim nou número 101 o posterior de l'any natural (`limitAnual`, §3.3.2).
 *     El recompte és de tot l'any, encara que `desDe` amagui les primeres files.
 *   - `en-espera`: cim no essencial amb la 1a ascensió des del 01/07/2019 que encara no compta
 *     perquè el 100 no està completat (§3.1, mateixa regla que `Carnet.enEspera`).
 *   - `fora-del-repte`: **no s'emet mai en una fila** (les ascensions fora del repte són a
 *     `excloses` amb el motiu `fora-del-repte`). Es manté al tipus per estabilitat del contracte.
 */
import {
	DATA_INICI_REPTE,
	DATA_NORMATIVA_ESSENCIALS,
	OPCIONS_PER_DEFECTE,
	anyDe,
	ascensionsEnRestriccio,
	ascensionsValides,
	avuiLocal,
	esDataIsoValida,
	progres100,
	validarData,
	validarMetode,
	type OpcionsRepte
} from './repte';
import type { Ascensio, Cataleg, Cim, ComarcaCataleg, DataISO, Metode } from './types';

// ---------------------------------------------------------------------------
// Tipus
// ---------------------------------------------------------------------------

export type AvisValidacio =
	'restriccio' | 'restriccio-incerta' | 'repetit' | 'mes-de-100' | 'en-espera' | 'fora-del-repte';

/** Ordre canònic dels avisos dins d'una fila (i del CSV). */
export const AVISOS_VALIDACIO: readonly AvisValidacio[] = [
	'restriccio',
	'restriccio-incerta',
	'repetit',
	'mes-de-100',
	'en-espera',
	'fora-del-repte'
];

/**
 * Per què una ascensió de l'any no surt al full:
 * - `esborrada`: té tombstone (`deletedAt`).
 * - `metode`: mètode no admès (vehicle a motor o valor desconegut).
 * - `fora-del-repte`: anterior al 01/07/2006.
 * - `futura`: posterior a `avui`.
 * - `cim-desconegut`: el cim no és al catàleg.
 * Si n'hi ha més d'un, el primer d'aquest ordre.
 */
export type MotiuExclusio = 'esborrada' | 'metode' | 'fora-del-repte' | 'futura' | 'cim-desconegut';

export interface FilaValidacio {
	/** Correlatiu 1..n dins de l'exportació. */
	num: number;
	ascensioId: string;
	cimId: number;
	data: DataISO;
	metode: Metode;
	/** En l'ordre d'`AVISOS_VALIDACIO`. */
	avisos: AvisValidacio[];
}

export interface ExclosaValidacio {
	ascensioId: string;
	cimId: number;
	data: DataISO;
	motiu: MotiuExclusio;
}

export interface ExportValidacio {
	any: number;
	files: FilaValidacio[];
	excloses: ExclosaValidacio[];
	/** Cims nous (1a ascensió vàlida de la vida) de **tot** l'any natural, encara que hi hagi `desDe`. */
	totalNous: number;
	/** `totalNous > limitAnual` (100 per defecte). Només és un avís. */
	superaMaxim: boolean;
}

/** El que l'exportació necessita d'una ascensió (`Ascensio` ho compleix). */
export type AscensioValidacio = Pick<Ascensio, 'id' | 'cimId' | 'data' | 'metode' | 'createdAt'> & {
	deletedAt?: string | null;
};

export interface OpcionsValidacio extends Partial<OpcionsRepte> {
	/** Només les ascensions d'aquesta data en endavant (inclusiu) surten a files i excloses. */
	desDe?: DataISO;
	/** Per descartar les futures. Per defecte `avuiLocal()` (Europe/Madrid). */
	avui?: DataISO;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function aMapa(cataleg: Cataleg): ReadonlyMap<number, Cim> {
	if (cataleg instanceof Map) return cataleg;
	return new Map((cataleg as readonly Cim[]).map((c) => [c.id, c]));
}

function compara(a: AscensioValidacio, b: AscensioValidacio): number {
	if (a.data !== b.data) return a.data < b.data ? -1 : 1;
	if (a.createdAt !== b.createdAt) return a.createdAt < b.createdAt ? -1 : 1;
	return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
}

function motiuExclusio(
	a: AscensioValidacio,
	cims: ReadonlyMap<number, Cim>,
	avui: DataISO
): MotiuExclusio | null {
	if (a.deletedAt) return 'esborrada';
	if (!validarMetode(a.metode)) return 'metode';
	const v = validarData(a.data, avui);
	if (!v.ok) return v.error === 'futura' ? 'futura' : 'fora-del-repte';
	if (!cims.has(a.cimId)) return 'cim-desconegut';
	return null;
}

// ---------------------------------------------------------------------------
// API
// ---------------------------------------------------------------------------

/**
 * Llista per al full de validació d'un any natural (vegeu la semàntica a la capçalera).
 * Ordre: data, `createdAt`, id; `num` correlatiu 1..n.
 * @throws RangeError si `avui` o `desDe` no són dates vàlides, o `any` no és un enter.
 */
export function exportValidacio(
	ascensions: readonly AscensioValidacio[],
	cataleg: Cataleg,
	any: number,
	opcions: OpcionsValidacio = {}
): ExportValidacio {
	if (!Number.isInteger(any)) throw new RangeError(`any invàlid: ${String(any)}`);
	const { desDe, avui: avuiOpcio, ...resta } = opcions;
	const avui = avuiOpcio ?? avuiLocal();
	if (!esDataIsoValida(avui)) throw new RangeError(`avui invàlid: ${String(avui)}`);
	if (desDe !== undefined && !esDataIsoValida(desDe)) {
		throw new RangeError(`desDe invàlid: ${String(desDe)}`);
	}
	const o: OpcionsRepte = { ...OPCIONS_PER_DEFECTE, ...resta };
	const cims = aMapa(cataleg);

	// Historial complet (tots els anys) en ordre: per a `repetit`, `en-espera` i el recompte anual.
	const valides = ascensionsValides(ascensions, cims, avui).sort(compara);
	const completat = progres100(valides, cims, o).dataAssoliment;
	const enRestriccio = new Map(
		ascensionsEnRestriccio(valides, cims).map((r) => [r.ascensio, r.incerta])
	);

	const primera = new Map<number, AscensioValidacio>();
	for (const a of valides) if (!primera.has(a.cimId)) primera.set(a.cimId, a);

	const dinsAny = (a: AscensioValidacio) =>
		esDataIsoValida(a.data) && anyDe(a.data) === any && (desDe === undefined || a.data >= desDe);

	const files: FilaValidacio[] = [];
	let nousAny = 0;
	for (const a of valides) {
		if (anyDe(a.data) !== any) continue;
		const cim = cims.get(a.cimId)!;
		const primeraCim = primera.get(a.cimId)!;
		const repetit = primeraCim !== a;
		if (!repetit) nousAny++;
		if (!dinsAny(a)) continue;

		const antiga = o.diaTallEsNormativaAntiga
			? primeraCim.data <= DATA_NORMATIVA_ESSENCIALS
			: primeraCim.data < DATA_NORMATIVA_ESSENCIALS;
		const enEspera =
			!cim.essencial &&
			!antiga &&
			(completat === null || (!o.noEssencialsRetroactives && a.data <= completat));

		const avisos: AvisValidacio[] = [];
		const incerta = enRestriccio.get(a);
		if (incerta !== undefined) avisos.push(incerta ? 'restriccio-incerta' : 'restriccio');
		if (repetit) avisos.push('repetit');
		if (!repetit && nousAny > o.limitAnual) avisos.push('mes-de-100');
		if (enEspera) avisos.push('en-espera');

		files.push({
			num: files.length + 1,
			ascensioId: a.id,
			cimId: a.cimId,
			data: a.data,
			metode: a.metode,
			avisos
		});
	}

	const excloses: ExclosaValidacio[] = [];
	for (const a of [...ascensions].sort(compara)) {
		if (!dinsAny(a)) continue;
		const motiu = motiuExclusio(a, cims, avui);
		if (motiu !== null) excloses.push({ ascensioId: a.id, cimId: a.cimId, data: a.data, motiu });
	}

	return { any, files, excloses, totalNous: nousAny, superaMaxim: nousAny > o.limitAnual };
}

/**
 * Anys naturals (descendent, sense repetits) amb alguna ascensió viva amb data vàlida des del
 * 01/07/2006, per al selector d'any. Amb `avui`, també descarta les futures.
 */
export function anysAmbAscensions(
	ascensions: readonly Pick<AscensioValidacio, 'data' | 'deletedAt'>[],
	avui?: DataISO
): number[] {
	const anys = new Set<number>();
	for (const a of ascensions) {
		if (a.deletedAt || !esDataIsoValida(a.data) || a.data < DATA_INICI_REPTE) continue;
		if (avui !== undefined && a.data > avui) continue;
		anys.add(anyDe(a.data));
	}
	return [...anys].sort((a, b) => b - a);
}

/** Dies naturals entre dues dates ISO vàlides (`b - a`). */
function diesEntre(a: DataISO, b: DataISO): number {
	const ms = (d: DataISO) => Date.UTC(+d.slice(0, 4), +d.slice(5, 7) - 1, +d.slice(8, 10));
	return Math.round((ms(b) - ms(a)) / 86_400_000);
}

/**
 * Termini per presentar les ascensions de l'any en curs: el 31/12 (§3.1: "abans del 31 de
 * desembre"; vegeu l'ambigüitat a §3.7). `dies` = dies naturals que falten (0 el mateix 31/12).
 * @throws RangeError si `avui` no és una data vàlida.
 */
export function terminiValidacio(avui: DataISO): { any: number; dataLimit: DataISO; dies: number } {
	if (!esDataIsoValida(avui)) throw new RangeError(`avui invàlid: ${String(avui)}`);
	const any = anyDe(avui);
	const dataLimit = `${avui.slice(0, 4)}-12-31`;
	return { any, dataLimit, dies: diesEntre(avui, dataLimit) };
}

// ---------------------------------------------------------------------------
// CSV
// ---------------------------------------------------------------------------

export interface TextosCsvValidacio {
	/** 7 columnes: núm., data, cim, altitud, comarca, mètode, avisos. */
	capcalera: string[];
	avis: Record<AvisValidacio, string>;
	metode: Record<Metode, string>;
}

/** Marca d'ordre de bytes UTF-8: Excel la necessita per llegir bé els accents. */
export const BOM_UTF8 = String.fromCharCode(0xfeff);

const RE_FORMULA = /^[=+\-@\t\r]/;
const RE_CAL_COMETES = /[";\r\n]/;

/**
 * Un camp CSV segur: neutralitza la injecció de fórmules (prefix `'` si comença per
 * `= + - @` tabulador o CR) i aplica l'escapament RFC 4180 (cometes dobles).
 */
export function campCsv(valor: string | number): string {
	let s = String(valor);
	if (RE_FORMULA.test(s)) s = `'${s}`;
	return RE_CAL_COMETES.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

/** `YYYY-MM-DD` → `dd/mm/aaaa`. */
export function dataFull(data: DataISO): string {
	return `${data.slice(8, 10)}/${data.slice(5, 7)}/${data.slice(0, 4)}`;
}

/**
 * CSV del full de validació: RFC 4180 amb separador `;` (Excel en català/castellà), BOM UTF-8,
 * salts CRLF (també al final) i protecció contra injecció de fórmules. Columnes: núm., data
 * (dd/mm/aaaa), cim (`nom`), altitud, comarca (nom), mètode, avisos (separats per ", ").
 * Tots els textos d'idioma els passa qui crida (`textos`); `comarques` dona el nom de cada slug
 * (si no hi és, surt l'slug). Només inclou les `files`, no les excloses.
 */
export function csvValidacio(
	exp: ExportValidacio,
	cataleg: Cataleg,
	textos: TextosCsvValidacio,
	comarques: readonly Pick<ComarcaCataleg, 'slug' | 'nom'>[]
): string {
	const cims = aMapa(cataleg);
	const nomsComarca = new Map(comarques.map((c) => [c.slug, c.nom]));
	const linies: string[] = [textos.capcalera.map(campCsv).join(';')];
	for (const f of exp.files) {
		const cim = cims.get(f.cimId);
		linies.push(
			[
				f.num,
				dataFull(f.data),
				cim?.nom ?? String(f.cimId),
				cim?.altitud ?? '',
				cim ? (nomsComarca.get(cim.comarca) ?? cim.comarca) : '',
				textos.metode[f.metode] ?? f.metode,
				f.avisos.map((a) => textos.avis[a]).join(', ')
			]
				.map(campCsv)
				.join(';')
		);
	}
	return `${BOM_UTF8}${linies.join('\r\n')}\r\n`;
}
