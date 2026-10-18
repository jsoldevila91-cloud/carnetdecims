/**
 * Textos dels errors de l'entrada amb correu + contrasenya (codis estables d'`ErrorCompte`) i a
 * quin camp s'associen (`aria-describedby` + `aria-invalid`).
 */
import { CONTRASENYA_MIN, type MotiuContrasenya } from '$lib/domain/contrasenya';
import { m } from '$lib/paraglide/messages';
import { codiError } from './api';

/** Camp on es mostra l'error: el correu, la contrasenya, tots dos (credencials) o cap. */
export type CampError = 'email' | 'contrasenya' | 'tots' | 'formulari';

export interface ErrorContrasenya {
	text: string;
	camp: CampError;
	/** Codi original (p. ex. per oferir "reenvia la confirmació" amb `correu-no-confirmat`). */
	codi: string | null;
}

const MIN = String(CONTRASENYA_MIN);

/** Text del motiu de `validarContrasenya` (validació al client abans d'enviar). */
export function textMotiuContrasenya(motiu: MotiuContrasenya): string {
	switch (motiu) {
		case 'buida':
			return m.cloud_password_error_empty();
		case 'curta':
			return m.cloud_password_error_short({ min: MIN });
		case 'llarga':
			return m.cloud_password_error_long();
		case 'igual-correu':
			return m.cloud_password_error_same_email();
	}
}

/** Tradueix qualsevol error d'una operació amb contrasenya. */
export function errorContrasenya(error: unknown): ErrorContrasenya {
	const codi = codiError(error);
	const e = (text: string, camp: CampError): ErrorContrasenya => ({ text, camp, codi });
	switch (codi) {
		case 'email:invalid':
			return e(m.cloud_email_invalid(), 'email');
		case 'credencials':
			return e(m.cloud_password_error_credentials(), 'tots');
		case 'correu-no-confirmat':
			return e(m.cloud_password_unconfirmed(), 'formulari');
		case 'contrasenya:buida':
			return e(textMotiuContrasenya('buida'), 'contrasenya');
		case 'contrasenya:curta':
			return e(textMotiuContrasenya('curta'), 'contrasenya');
		case 'contrasenya:llarga':
			return e(textMotiuContrasenya('llarga'), 'contrasenya');
		case 'contrasenya:igual-correu':
			return e(textMotiuContrasenya('igual-correu'), 'contrasenya');
		case 'contrasenya:feble':
			return e(m.cloud_password_error_weak(), 'contrasenya');
		case 'contrasenya:filtrada':
			return e(m.cloud_password_error_leaked(), 'contrasenya');
		case 'contrasenya:igual':
			return e(m.cloud_password_error_same(), 'contrasenya');
		case 'reautenticacio':
			return e(m.cloud_password_error_reauth(), 'formulari');
		case 'sessio':
			return e(m.cloud_password_error_session(), 'formulari');
		case 'no-disponible':
		case 'no-configurat':
			return e(m.cloud_password_error_unavailable(), 'formulari');
		case 'limit':
			return e(m.cloud_password_error_limit(), 'formulari');
		case 'xarxa':
			return e(m.cloud_error_network(), 'formulari');
		default:
			return e(m.cloud_password_error_generic(), 'formulari');
	}
}
