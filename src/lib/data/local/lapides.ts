/**
 * Minimització de dades a les làpides (bloc R1). Vegeu `docs/03-modelo-datos.md` §2.
 *
 * Una ascensió esborrada queda com a làpida (`deletedAt`) perquè "Desfés" la pugui tornar sencera
 * i perquè l'esborrat se sincronitzi. Però la nota i els companys (dades personals i de tercers)
 * només calen mentre l'esborrat es pot desfer. Regla:
 *
 * - **Finestra de desfer** (`FINESTRA_DESFER_MS`, 10 min des de `deletedAt`): la làpida conserva
 *   la nota i els companys. El toast de "Desfés" dura 8 s (es pausa amb el ratolí a sobre o el
 *   focus a dins, WCAG 2.2.1) i desapareix en recarregar la pàgina: la finestra en té de sobres.
 * - **Fora de la finestra**: la làpida es **buida** (`nota: null`, `companys: []`) amb
 *   `updatedAt` = el de la làpida + 1 ms i s'encua, perquè la regla LWW de `sync_push`
 *   (migració 0005) la porti també buida al núvol (amb la clau `companys` present, el servidor
 *   els substitueix per `{}`). L'increment és d'1 ms i no "ara": buidar no és un canvi de
 *   l'usuari, només ha de guanyar la versió que buida, mai un canvi real posterior (p. ex. una
 *   restauració feta des d'un altre dispositiu). Dos dispositius que buiden la mateixa làpida
 *   produeixen exactament la mateixa fila.
 *
 * La purga (`purgarLapides`) és idempotent: una làpida ja buida no es torna a escriure. S'executa
 * en obrir la BD (`obtenirBd`), al començament de cada passada de sync, en baixar del núvol una
 * làpida amb dades (`sync.ts`, p. ex. d'un dispositiu amb el client antic) i amb un temporitzador
 * després d'esborrar (`ascensions.ts`). Només depèn de tipus de `db.ts` (sense cicles).
 */
import type { CarnetDb, EntradaOutbox, FilaAscensio } from './db';
import { ara } from './rellotge';

/** Temps (des de `deletedAt`) durant el qual una làpida conserva la nota i els companys. */
export const FINESTRA_DESFER_MS = 10 * 60_000;

/** La làpida ja no es pot desfer des de la UI (`deletedAt` fa `FINESTRA_DESFER_MS` o més). */
export function foraDeFinestra(fila: Pick<FilaAscensio, 'deletedAt'>, instant = ara()): boolean {
	if (!fila.deletedAt) return false;
	const t = Date.parse(fila.deletedAt);
	return !Number.isNaN(t) && instant.getTime() - t >= FINESTRA_DESFER_MS;
}

/**
 * La fila pot portar dades del diari: nota, companys o **sense la clau `companys`** (el núvol en
 * podria tenir d'un altre dispositiu; per buidar-los cal pujar la clau amb `[]`).
 */
export function teDiari(fila: Pick<FilaAscensio, 'nota' | 'companys'>): boolean {
	return fila.nota !== null || fila.companys === undefined || fila.companys.length > 0;
}

/** Còpia de la fila sense nota ni companys (amb la clau `companys` present). */
export function senseDiari<T extends Pick<FilaAscensio, 'nota' | 'companys'>>(fila: T): T {
	return { ...fila, nota: null, companys: [] };
}

/** Làpida fora de la finestra que encara té dades del diari: s'ha de buidar. */
export function lapidaPerBuidar(fila: FilaAscensio, instant = ara()): boolean {
	return !!fila.deletedAt && foraDeFinestra(fila, instant) && teDiari(fila);
}

/**
 * Versió buidada d'una làpida: `updatedAt` + 1 ms (guanya la LWW només sobre la versió que buida;
 * vegeu la capçalera). Determinista: no depèn del rellotge.
 */
export function lapidaBuidada(fila: FilaAscensio): FilaAscensio {
	const t = Date.parse(fila.updatedAt);
	const updatedAt = Number.isNaN(t) ? fila.updatedAt : new Date(t + 1).toISOString();
	return { ...senseDiari(fila), updatedAt };
}

/**
 * Buida (i encua) totes les làpides fora de la finestra que encara tenen nota o companys. Una
 * sola transacció; només llegeix les làpides prou velles (índex `deletedAt`, que només conté
 * làpides). `comprovar` s'executa dins de la transacció abans d'escriure (la sync hi comprova
 * l'època). Retorna quantes files ha buidat (0 si no n'hi havia cap: no escriu res).
 */
export async function purgarLapides(
	bd: CarnetDb,
	comprovar?: () => Promise<void>
): Promise<number> {
	const instant = ara();
	const llindar = new Date(instant.getTime() - FINESTRA_DESFER_MS).toISOString();
	return bd.transaction('rw', bd.ascensions, bd.outbox, bd.meta, async () => {
		await comprovar?.();
		const files = await bd.ascensions
			.where('deletedAt')
			.belowOrEqual(llindar)
			.filter((f) => lapidaPerBuidar(f, instant))
			.toArray();
		if (!files.length) return 0;
		const buidades = files.map(lapidaBuidada);
		const cua: EntradaOutbox[] = buidades.map((f) => ({
			ascensioId: f.id,
			encuaAt: f.updatedAt,
			intents: 0
		}));
		await bd.ascensions.bulkPut(buidades);
		await bd.outbox.bulkPut(cua);
		return buidades.length;
	});
}
