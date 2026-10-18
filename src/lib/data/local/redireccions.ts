/**
 * Redireccions d'ids d'ascensió (versió 4 de l'esquema, `Redireccio` a `db.ts`): un id que ha
 * deixat d'existir (reassignat per `id en ús` o perdedor d'una deduplicació) apunta a la fila que
 * la representa ara. Només depèn de tipus de `db.ts` (sense cicles).
 */
import type { CarnetDb, FilaAscensio, Redireccio } from './db';
import { ara } from './rellotge';

/** Salts màxims en seguir una cadena de redireccions (defensa contra cicles). */
export const MAX_SALTS_REDIRECCIO = 8;

export function redireccio(idVell: string, idNou: string, motiu: Redireccio['motiu']): Redireccio {
	return { idVell, idNou, motiu, creatAt: ara().toISOString() };
}

/** Segueix la cadena de redireccions d'un id (en memòria). Sense redirecció, el mateix id. */
export function resoldreId(redireccions: ReadonlyMap<string, string>, id: string): string {
	let actual = id;
	const vistos = new Set([id]);
	for (let i = 0; i < MAX_SALTS_REDIRECCIO; i++) {
		const seguent = redireccions.get(actual);
		if (!seguent || vistos.has(seguent)) break;
		vistos.add(seguent);
		actual = seguent;
	}
	return actual;
}

/**
 * Fila d'un id, seguint les redireccions si la fila ja no hi és o, amb `seguirLapides`, si és una
 * làpida amb redirecció (un duplicat fusionat). S'ha de cridar dins d'una transacció que inclogui
 * `ascensions` i `redireccions`. Retorna `undefined` si no hi ha cap fila.
 */
export async function filaResolta(
	bd: CarnetDb,
	id: string,
	seguirLapides: boolean
): Promise<FilaAscensio | undefined> {
	let fila = await bd.ascensions.get(id);
	let actual = id;
	const vistos = new Set([id]);
	for (let i = 0; i < MAX_SALTS_REDIRECCIO; i++) {
		if (fila && !(seguirLapides && fila.deletedAt)) break;
		const r = await bd.redireccions.get(actual);
		if (!r || vistos.has(r.idNou)) break;
		vistos.add(r.idNou);
		actual = r.idNou;
		const seguent = await bd.ascensions.get(actual);
		// Si la cadena porta a un id que no existeix, es continua (pot tenir una altra redirecció);
		// la fila trobada fins ara es conserva.
		if (seguent) fila = seguent;
	}
	return fila;
}
