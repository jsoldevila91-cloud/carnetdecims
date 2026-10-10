/**
 * Època de les dades locals (`meta.epoca`). Tot esborrat local (esborrar les dades, esborrar el
 * compte, sortir esborrant, deixar les dades sense propietari) n'escriu una de nova **dins de la
 * mateixa transacció** que esborra. La sync llegeix l'època en començar una passada i la torna a
 * comprovar dins de cada transacció on escriu: si ha canviat, avorta sense escriure res. Així una
 * passada en vol (p. ex. un pull lent) no pot tornar a inserir files ni reescriure el cursor
 * després d'un esborrat, tampoc des d'una altra pestanya (l'època és a IndexedDB, no en memòria).
 */
import type { EntradaMeta } from './db';
import { uuidv7 } from './uuid';

export function novaEpoca(): EntradaMeta {
	return { clau: 'epoca', valor: uuidv7() };
}
