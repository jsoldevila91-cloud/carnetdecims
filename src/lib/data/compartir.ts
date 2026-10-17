/**
 * Enllaç de només lectura del carnet, sense servidor (bloc R3): `https://…/ca/carnet#c=…`.
 *
 * El carnet va dins del **fragment** (`#…`), que el navegador no envia mai al servidor ni surt als
 * registres d'accés. Cadena: `codificaCarnet` (format binari v1, `$lib/domain/carnet-compartit`)
 * → `comprimeix` (`deflate-raw`, `$lib/platform/compressio`) → base64url.
 *
 * No depèn de Dexie: la pàgina pública `/ca/carnet` el pot importar sense arrossegar la base de
 * dades local (per això no es reexporta a `$lib/data`).
 */
import {
	MAX_BYTES_CARNET,
	aBase64Url,
	codificaCarnet,
	deBase64Url,
	descodificaCarnet,
	type CarnetCompartit,
	type EntradaCarnetCompartit,
	type ErrorCarnetCompartit
} from '$lib/domain/carnet-compartit';
import type { Cataleg, DataISO } from '$lib/domain/types';
import { comprimeix, descomprimeix } from '$lib/platform/compressio';

/** Clau del paràmetre dins del fragment (`#c=…`). */
export const PARAMETRE_CARNET = 'c';

/** Camí públic del carnet compartit per idioma (el mateix segment en ca i es). */
export const CAMI_CARNET_COMPARTIT: Readonly<Record<'ca' | 'es', string>> = {
	ca: '/ca/carnet',
	es: '/es/carnet'
};

/** Màxim de caràcters del valor del fragment: el format més gran possible, sense comprimir. */
export const MAX_CARACTERS_FRAGMENT = Math.ceil(((MAX_BYTES_CARNET + 1) * 4) / 3) + 8;

/** Valor del fragment (sense `#c=`) per a un carnet. */
export async function fragmentCarnet(entrada: EntradaCarnetCompartit): Promise<string> {
	return aBase64Url(await comprimeix(codificaCarnet(entrada)));
}

/**
 * Enllaç complet de només lectura: `${origen}/${lang}/carnet#c=…`. `origen` sense camí
 * (p. ex. `https://carnetdecims.cat` o `location.origin`); la barra final s'ignora.
 * `entrada`: feu servir `entradaCompartir` (un segell per cim, sense dades privades).
 * @throws RangeError si l'entrada és invàlida (vegeu `codificaCarnet`).
 */
export async function enllacCarnet(
	origen: string,
	lang: 'ca' | 'es',
	entrada: EntradaCarnetCompartit
): Promise<string> {
	const base = origen.replace(/\/+$/, '');
	return `${base}${CAMI_CARNET_COMPARTIT[lang]}#${PARAMETRE_CARNET}=${await fragmentCarnet(entrada)}`;
}

/**
 * Llegeix el carnet d'un fragment. Accepta `#c=…`, `c=…` o un URL sencer (es pren el que hi ha
 * després del primer `#`). No llança mai per una entrada malformada.
 * @throws RangeError només si `avui` no és una data vàlida (error de programació).
 */
export async function llegeixEnllac(
	fragment: string,
	cataleg: Cataleg,
	avui: DataISO
): Promise<CarnetCompartit | ErrorCarnetCompartit> {
	if (typeof fragment !== 'string') return { error: 'buit' };
	const coixinet = fragment.indexOf('#');
	const text = coixinet >= 0 ? fragment.slice(coixinet + 1) : fragment;
	if (text.length > MAX_CARACTERS_FRAGMENT * 2) return { error: 'massa-gran' };
	const valor = new URLSearchParams(text).get(PARAMETRE_CARNET);
	if (!valor) return { error: 'buit' };
	if (valor.length > MAX_CARACTERS_FRAGMENT) return { error: 'massa-gran' };
	const comprimit = deBase64Url(valor);
	if (comprimit === null) return { error: 'base64' };
	const bytes = await descomprimeix(comprimit, MAX_BYTES_CARNET);
	if (bytes === null) return { error: 'compressio' };
	return descodificaCarnet(bytes, cataleg, avui);
}
