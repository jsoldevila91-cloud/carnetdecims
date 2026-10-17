/**
 * Carnet compartit per enllaç (bloc R3): el carnet de segells serialitzat en bytes compactes
 * per posar-lo, comprimit i en base64url, dins del fragment d'un enllaç de només lectura
 * (`/ca/carnet#c=…`). Sense servidor: el fragment no s'envia mai al servidor.
 *
 * Referència: `docs/03-modelo-datos.md` §3.7 i `docs/08-ideas-producte.md` §4.
 *
 * Què s'hi posa: **només** un segell per cim (cim + data), el nom opcional (≤ 40 caràcters) i
 * res més: ni notes, ni companys, ni mètode, ni ids d'ascensió, ni dates de creació.
 *
 * Format binari v1 (abans de comprimir; tots els enters són varint LEB128 sense signe, ≤ 3 bytes):
 *
 * ```
 * [0]      versió = 1
 * varint   L = bytes UTF-8 del nom (0 = sense nom; ≤ 160)
 * L bytes  nom (UTF-8)
 * varint   N = entrades (≤ 2.000)
 * N ×      varint Δdies, varint cimId
 * ```
 *
 * Les entrades van en ordre de data (estable: dins d'un mateix dia, l'ordre de qui comparteix).
 * `Δdies` és la diferència en dies respecte de l'entrada anterior; la primera és respecte del
 * 01/07/2006 (`DATA_INICI_REPTE`), de manera que no es pot codificar cap data anterior.
 *
 * Clau del cim: `Cim.id` (1..n). És la mateixa clau que fan servir les ascensions desades (Dexie i
 * Supabase): l'assigna `scripts/catalog/build.ts` per l'ordre de la llista i és estable perquè la
 * llista només creix pel final (ho fixa `src/lib/data/catalog/ids-estables.spec.ts`).
 */
import { paginesCarnet, type AscensioCarnet, type OpcionsCarnet } from './carnet';
import { DATA_INICI_REPTE, esDataIsoValida } from './repte';
import type { Cataleg, Cim, DataISO } from './types';

// ---------------------------------------------------------------------------
// Constants i tipus
// ---------------------------------------------------------------------------

export const VERSIO_CARNET_COMPARTIT = 1;
/** Màxim d'entrades d'un carnet compartit (522 cims; marge per a catàlegs futurs). */
export const MAX_ENTRADES_COMPARTIDES = 2000;
/** Màxim de caràcters (punts de codi) del nom. */
export const MAX_NOM_COMPARTIT = 40;
/** Màxim de bytes UTF-8 del nom (40 × 4). */
export const MAX_BYTES_NOM = MAX_NOM_COMPARTIT * 4;
/** Màxim de bytes del format binari (capçalera + nom + 2.000 × 6). Límit de la descompressió. */
export const MAX_BYTES_CARNET = 1 + 2 + MAX_BYTES_NOM + 2 + MAX_ENTRADES_COMPARTIDES * 6;

/** Límit dels varints (3 bytes = 21 bits): cimId i dies. */
const MAX_VARINT = 2 ** 21 - 1;

export interface AscensioCompartida {
	cimId: number;
	data: DataISO;
}

export interface EntradaCarnetCompartit {
	nom?: string;
	ascensions: readonly AscensioCompartida[];
}

export interface CarnetCompartit {
	/** Nom sanejat (sense controls, ≤ 40 caràcters). Text pla: mai s'ha d'interpretar com a HTML. */
	nom?: string;
	/** Entrades vàlides, en l'ordre de l'enllaç (data i, dins del dia, l'ordre de qui comparteix). */
	ascensions: AscensioCompartida[];
	/** Entrades descartades: cim que no és al catàleg o data futura respecte d'`avui`. */
	descartades: number;
}

/**
 * - `buit`: no hi ha carnet al fragment.
 * - `base64`: el text no és base64url vàlid.
 * - `compressio`: no es pot descomprimir (dades corruptes o supera la mida màxima).
 * - `versio`: versió de format desconeguda (enllaç d'una versió futura de l'app).
 * - `format`: estructura binària invàlida (truncada, bytes de més, nom no UTF-8…).
 * - `massa-gran`: més entrades o més text del permès.
 */
export type CodiErrorCarnet = 'buit' | 'base64' | 'compressio' | 'versio' | 'format' | 'massa-gran';

export interface ErrorCarnetCompartit {
	error: CodiErrorCarnet;
}

export function esErrorCarnet(
	r: CarnetCompartit | ErrorCarnetCompartit
): r is ErrorCarnetCompartit {
	return 'error' in r;
}

// ---------------------------------------------------------------------------
// Dates ↔ dies
// ---------------------------------------------------------------------------

const MS_DIA = 86_400_000;
const msUtc = (d: DataISO) => Date.UTC(+d.slice(0, 4), +d.slice(5, 7) - 1, +d.slice(8, 10));
const EPOCA = msUtc(DATA_INICI_REPTE);

/** Dies des del 01/07/2006 (0 = aquell dia). */
function diesDesDeInici(data: DataISO): number {
	return Math.round((msUtc(data) - EPOCA) / MS_DIA);
}

function dataDeDies(dies: number): DataISO {
	return new Date(EPOCA + dies * MS_DIA).toISOString().slice(0, 10);
}

// ---------------------------------------------------------------------------
// Nom
// ---------------------------------------------------------------------------

// Salts i tabuladors (també els separadors Unicode de línia i paràgraf) → espai; després es treuen
// els controls (Cc) i el format invisible (Cf: bidi, zero-width, BOM…), excepte el ZWJ dels
// emojis compostos.
const RE_SALTS = /[\t\n\r\v\f\p{Zl}\p{Zp}]/gu;
const ZWJ = String.fromCodePoint(0x200d);
const RE_INVISIBLES = new RegExp(String.raw`(?!${ZWJ})[\p{Cc}\p{Cf}]`, 'gu');

/**
 * Nom apte per mostrar: sense caràcters de control ni de format invisibles, espais col·lapsats,
 * retallat i com a molt 40 caràcters. `undefined` si queda buit o no és un text.
 */
export function sanejaNom(nom: unknown): string | undefined {
	if (typeof nom !== 'string') return undefined;
	const net = nom.replace(RE_SALTS, ' ').replace(RE_INVISIBLES, '').replace(/\s+/gu, ' ').trim();
	const tallat = Array.from(net).slice(0, MAX_NOM_COMPARTIT).join('').trim();
	return tallat === '' ? undefined : tallat;
}

// ---------------------------------------------------------------------------
// Codificació
// ---------------------------------------------------------------------------

function escriuVarint(sortida: number[], n: number): void {
	while (n >= 0x80) {
		sortida.push((n & 0x7f) | 0x80);
		n >>>= 7;
	}
	sortida.push(n);
}

/**
 * Serialitza un carnet en el format binari v1 (sense comprimir). Elimina les entrades
 * duplicades (mateix cim i data) i ordena per data mantenint l'ordre d'entrada dins del dia.
 * El nom se saneja (`sanejaNom`).
 * @throws RangeError si una entrada té una data invàlida o anterior al 01/07/2006, un `cimId`
 *   que no és un enter positiu, o si hi ha més de 2.000 entrades (error de programació: feu
 *   servir `entradaCompartir`).
 */
export function codificaCarnet(entrada: EntradaCarnetCompartit): Uint8Array {
	const vistes = new Set<string>();
	const entrades: { cimId: number; dies: number }[] = [];
	for (const a of entrada.ascensions) {
		if (!Number.isSafeInteger(a.cimId) || a.cimId < 1 || a.cimId > MAX_VARINT) {
			throw new RangeError(`cimId invàlid: ${String(a.cimId)}`);
		}
		if (!esDataIsoValida(a.data) || a.data < DATA_INICI_REPTE) {
			throw new RangeError(`data invàlida: ${String(a.data)}`);
		}
		const clau = `${a.cimId}|${a.data}`;
		if (vistes.has(clau)) continue;
		vistes.add(clau);
		entrades.push({ cimId: a.cimId, dies: diesDesDeInici(a.data) });
	}
	if (entrades.length > MAX_ENTRADES_COMPARTIDES) {
		throw new RangeError(`Massa entrades: ${entrades.length}`);
	}
	entrades.sort((a, b) => a.dies - b.dies); // estable (ES2019)

	const nom = sanejaNom(entrada.nom);
	const bytesNom = nom === undefined ? new Uint8Array(0) : new TextEncoder().encode(nom);

	const sortida: number[] = [VERSIO_CARNET_COMPARTIT];
	escriuVarint(sortida, bytesNom.length);
	for (const b of bytesNom) sortida.push(b);
	escriuVarint(sortida, entrades.length);
	let anterior = 0;
	for (const e of entrades) {
		escriuVarint(sortida, e.dies - anterior);
		escriuVarint(sortida, e.cimId);
		anterior = e.dies;
	}
	return Uint8Array.from(sortida);
}

// ---------------------------------------------------------------------------
// Descodificació
// ---------------------------------------------------------------------------

class ErrorFormat extends Error {}

function lector(bytes: Uint8Array) {
	let pos = 0;
	return {
		get pos() {
			return pos;
		},
		resta: () => bytes.length - pos,
		byte(): number {
			if (pos >= bytes.length) throw new ErrorFormat();
			return bytes[pos++];
		},
		/** Varint de com a molt 3 bytes, en forma canònica (sense zeros de farciment). */
		varint(): number {
			let n = 0;
			for (let i = 0; i < 3; i++) {
				const b = this.byte();
				n |= (b & 0x7f) << (7 * i);
				if ((b & 0x80) === 0) {
					if (i > 0 && b === 0) throw new ErrorFormat();
					return n;
				}
			}
			throw new ErrorFormat();
		},
		tros(n: number): Uint8Array {
			if (pos + n > bytes.length) throw new ErrorFormat();
			const t = bytes.subarray(pos, pos + n);
			pos += n;
			return t;
		}
	};
}

/**
 * Llegeix el format binari v1 amb validació estricta. No llança mai: qualsevol entrada
 * malformada retorna un `ErrorCarnetCompartit`.
 * - Estructura: versió, mides, varints canònics, nom UTF-8 vàlid, sense bytes de més.
 * - Entrades d'un cim que no és al `cataleg` o amb data posterior a `avui`: es descarten i es
 *   compten a `descartades` (no invaliden l'enllaç).
 * - Entrades duplicades (mateix cim i data): se'n queda una, sense comptar-la com a descartada.
 * - El nom se saneja amb `sanejaNom`.
 * @throws RangeError només si `avui` no és una data vàlida (error de programació).
 */
export function descodificaCarnet(
	bytes: Uint8Array,
	cataleg: Cataleg,
	avui: DataISO
): CarnetCompartit | ErrorCarnetCompartit {
	if (!esDataIsoValida(avui)) throw new RangeError(`avui invàlid: ${String(avui)}`);
	if (bytes.length === 0) return { error: 'buit' };
	if (bytes.length > MAX_BYTES_CARNET) return { error: 'massa-gran' };
	if (bytes[0] !== VERSIO_CARNET_COMPARTIT) return { error: 'versio' };

	const ids: ReadonlySet<number> =
		cataleg instanceof Map
			? new Set(cataleg.keys())
			: new Set((cataleg as readonly Cim[]).map((c) => c.id));
	const diesAvui = diesDesDeInici(avui);

	try {
		const r = lector(bytes);
		r.byte();
		const midaNom = r.varint();
		if (midaNom > MAX_BYTES_NOM) return { error: 'massa-gran' };
		let nom: string | undefined;
		if (midaNom > 0) {
			try {
				nom = sanejaNom(new TextDecoder('utf-8', { fatal: true }).decode(r.tros(midaNom)));
			} catch (e) {
				if (e instanceof ErrorFormat) throw e;
				return { error: 'format' };
			}
		}
		const n = r.varint();
		if (n > MAX_ENTRADES_COMPARTIDES) return { error: 'massa-gran' };
		// Cada entrada ocupa com a mínim 2 bytes: rebutja abans de reservar res.
		if (r.resta() < n * 2) return { error: 'format' };

		const ascensions: AscensioCompartida[] = [];
		const vistes = new Set<string>();
		let descartades = 0;
		let dies = 0;
		for (let i = 0; i < n; i++) {
			dies += r.varint();
			const cimId = r.varint();
			if (!ids.has(cimId) || dies > diesAvui) {
				descartades++;
				continue;
			}
			const data = dataDeDies(dies);
			const clau = `${cimId}|${data}`;
			if (vistes.has(clau)) continue;
			vistes.add(clau);
			ascensions.push({ cimId, data });
		}
		if (r.resta() !== 0) return { error: 'format' };
		return nom === undefined ? { ascensions, descartades } : { nom, ascensions, descartades };
	} catch (e) {
		if (e instanceof ErrorFormat) return { error: 'format' };
		throw e;
	}
}

// ---------------------------------------------------------------------------
// Base64url (RFC 4648 §5, sense farciment)
// ---------------------------------------------------------------------------

const ALFABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
const VALOR = new Map([...ALFABET].map((c, i) => [c, i]));

export function aBase64Url(bytes: Uint8Array): string {
	let s = '';
	for (let i = 0; i < bytes.length; i += 3) {
		const b0 = bytes[i];
		const b1 = i + 1 < bytes.length ? bytes[i + 1] : 0;
		const b2 = i + 2 < bytes.length ? bytes[i + 2] : 0;
		s += ALFABET[b0 >> 2] + ALFABET[((b0 & 3) << 4) | (b1 >> 4)];
		if (i + 1 < bytes.length) s += ALFABET[((b1 & 15) << 2) | (b2 >> 6)];
		if (i + 2 < bytes.length) s += ALFABET[b2 & 63];
	}
	return s;
}

/**
 * Base64url estricte: només l'alfabet URL-safe, sense farciment `=` ni espais, longitud vàlida i
 * forma canònica (bits sobrants a zero). `null` si no és vàlid.
 */
export function deBase64Url(s: string): Uint8Array | null {
	if (typeof s !== 'string' || s.length % 4 === 1 || !/^[A-Za-z0-9_-]*$/.test(s)) return null;
	const sortida = new Uint8Array(Math.floor((s.length * 3) / 4));
	let j = 0;
	for (let i = 0; i < s.length; i += 4) {
		const c0 = VALOR.get(s[i])!;
		const c1 = VALOR.get(s[i + 1])!;
		const c2 = i + 2 < s.length ? VALOR.get(s[i + 2])! : -1;
		const c3 = i + 3 < s.length ? VALOR.get(s[i + 3])! : -1;
		sortida[j++] = (c0 << 2) | (c1 >> 4);
		if (c2 < 0) {
			if ((c1 & 15) !== 0) return null;
			break;
		}
		sortida[j++] = ((c1 & 15) << 4) | (c2 >> 2);
		if (c3 < 0) {
			if ((c2 & 3) !== 0) return null;
			break;
		}
		sortida[j++] = ((c2 & 3) << 6) | c3;
	}
	return sortida;
}

// ---------------------------------------------------------------------------
// Ponts amb el carnet
// ---------------------------------------------------------------------------

/**
 * Entrada per compartir a partir de les ascensions de l'usuari: un segell per cim, tal com el
 * mostra el carnet (`paginesCarnet`: pàgines, `enEspera` i `fora`), sense res més. Ordre: data i,
 * dins del dia, l'ordre del carnet. Les esborrades, futures, motoritzades, anteriors al
 * 01/07/2006 o de cims fora del catàleg no hi surten.
 */
export function entradaCompartir(
	ascensions: readonly AscensioCarnet[],
	cataleg: Cataleg,
	opcions: OpcionsCarnet & { nom?: string } = {}
): EntradaCarnetCompartit {
	const { nom, ...opcionsCarnet } = opcions;
	const carnet = paginesCarnet(ascensions, cataleg, opcionsCarnet);
	const segells = [...carnet.pagines.flatMap((p) => p.segells), ...carnet.fora, ...carnet.enEspera]
		.sort((a, b) => (a.data !== b.data ? (a.data < b.data ? -1 : 1) : a.ordre - b.ordre))
		.map((s) => ({ cimId: s.cimId, data: s.data }));
	const nomNet = sanejaNom(nom);
	return nomNet === undefined ? { ascensions: segells } : { nom: nomNet, ascensions: segells };
}

/**
 * Converteix un carnet compartit en ascensions sintètiques per a `paginesCarnet`/`resumCarnet`
 * (només lectura). Ids `c0001`, `c0002`… en l'ordre de l'enllaç (manté el desempat del dia),
 * mètode `a-peu` i `createdAt` buit (no hi són a l'enllaç i no afecten el càlcul).
 */
export function ascensionsDeCarnetCompartit(carnet: CarnetCompartit): AscensioCarnet[] {
	return carnet.ascensions.map((a, i) => ({
		id: `c${String(i + 1).padStart(4, '0')}`,
		cimId: a.cimId,
		data: a.data,
		metode: 'a-peu',
		createdAt: ''
	}));
}
