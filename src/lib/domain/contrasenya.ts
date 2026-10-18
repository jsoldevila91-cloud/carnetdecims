/**
 * Validació de la contrasenya del compte (entrada amb correu + contrasenya). Funció pura: la capa
 * de dades (`data/compte.ts`) la crida abans d'anar a Supabase, i la UI la pot fer servir per
 * avisar mentre s'escriu.
 *
 * Criteri (NIST SP 800-63B, §5.1.1.2):
 * - llargada mínima `CONTRASENYA_MIN` caràcters (punts de codi Unicode, no unitats UTF-16: una
 *   emoji compta com un caràcter);
 * - màxim `CONTRASENYA_MAX_BYTES` **bytes UTF-8**: és el límit de bcrypt que aplica Supabase
 *   (GoTrue rebutja les més llargues). Amb accents o emojis hi caben menys de 72 caràcters;
 * - **sense regles de composició** (majúscules, xifres, símbols…) i sense retallar espais: la
 *   contrasenya es valida i s'envia tal com s'ha escrit;
 * - no pot ser igual que el correu del compte (comparació sense majúscules ni espais als extrems).
 *
 * No es comprova contra llistes de contrasenyes filtrades des del client (cap servei extern): si
 * s'activa la protecció de Supabase (pla Pro), el servidor respon `weak_password` amb el motiu
 * `pwned` i `data/compte.ts` el tradueix a `contrasenya:filtrada`.
 */

/** Llargada mínima, en caràcters. (Cal que el panell de Supabase no en demani més.) */
export const CONTRASENYA_MIN = 10;

/** Llargada màxima, en bytes UTF-8 (límit de bcrypt a Supabase). */
export const CONTRASENYA_MAX_BYTES = 72;

export type MotiuContrasenya = 'buida' | 'curta' | 'llarga' | 'igual-correu';

export type ValidacioContrasenya = { ok: true } | { ok: false; motiu: MotiuContrasenya };

/** Bytes UTF-8 d'un text (el que compta bcrypt). */
export function bytesUtf8(text: string): number {
	return new TextEncoder().encode(text).length;
}

/**
 * Valida una contrasenya nova. `email` (opcional): el correu del compte, per rebutjar que la
 * contrasenya sigui el mateix correu. Ordre dels motius: `buida`, `curta`, `llarga`,
 * `igual-correu`.
 */
export function validarContrasenya(
	contrasenya: string,
	email?: string | null
): ValidacioContrasenya {
	if (contrasenya.length === 0) return { ok: false, motiu: 'buida' };
	if (Array.from(contrasenya).length < CONTRASENYA_MIN) return { ok: false, motiu: 'curta' };
	if (bytesUtf8(contrasenya) > CONTRASENYA_MAX_BYTES) return { ok: false, motiu: 'llarga' };
	const correu = email?.trim().toLowerCase();
	if (correu && contrasenya.trim().toLowerCase() === correu) {
		return { ok: false, motiu: 'igual-correu' };
	}
	return { ok: true };
}
