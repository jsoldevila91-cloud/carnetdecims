/**
 * Novetats de cada versió publicada (bloc R2). La llista i els textos ca/es són a
 * `novetats-llista.ts` (sense dependències de l'entorn); aquí s'hi apliquen els flags del build:
 * una entrada amb `nomesSi` només surt si el seu flag és actiu (p. ex. l'entrada amb contrasenya,
 * `PUBLIC_PASSWORD_AUTH`).
 *
 * Com es mostren (`ui/Novetats.svelte`): el navegador desa a `localStorage`
 * (`CLAU_NOVETATS`) l'`id` de l'última novetat vista. En carregar el web (també després que el
 * service worker activi una versió nova), si hi ha entrades més noves que la vista, s'obre un
 * full amb aquestes. Qui no té res desat i no havia fet servir mai el web (usuari nou) no la
 * veu: només es marca com a vista l'última.
 */
import { contrasenyaAuthActiu } from '$lib/platform/flags';
import { TOTES_LES_NOVETATS, novetatsActives, type Novetat } from './novetats-llista.ts';

export type { FlagNovetat, Novetat } from './novetats-llista.ts';
export { TOTES_LES_NOVETATS, novetatsActives } from './novetats-llista.ts';

export const CLAU_NOVETATS = 'carnetdecims:novetat-vista';

/** Novetats d'aquest build (de la més nova a la més antiga), amb els flags ja aplicats. */
export const NOVETATS: readonly Novetat[] = Object.freeze(
	novetatsActives(TOTES_LES_NOVETATS, { contrasenya: contrasenyaAuthActiu })
);
/**
 * Novetats que cal mostrar.
 * - `vista`: id desat (o `null` si no n'hi ha).
 * - `usuariExistent`: sense id desat, si hi ha indicis que ja havia fet servir el web abans
 *   d'existir les novetats (altres preferències desades). Un usuari nou no en veu cap.
 * Si l'id desat ja no existeix (entrada retirada), no es mostra res.
 */
export function novetatsPerMostrar(
	vista: string | null,
	usuariExistent: boolean,
	novetats: readonly Novetat[] = NOVETATS
): Novetat[] {
	if (vista === null) return usuariExistent ? novetats.slice(0, 1) : [];
	const i = novetats.findIndex((n) => n.id === vista);
	return i <= 0 ? [] : novetats.slice(0, i);
}

/** Id de la novetat més recent (el que es desa en tancar el full), o `null` si no n'hi ha. */
export function darreraNovetat(novetats: readonly Novetat[] = NOVETATS): string | null {
	return novetats[0]?.id ?? null;
}
