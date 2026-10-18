import { describe, expect, it } from 'vitest';
import { bytesUtf8, CONTRASENYA_MAX_BYTES, CONTRASENYA_MIN, validarContrasenya } from './index';

describe('validarContrasenya', () => {
	it('límits: mínim 10 caràcters i màxim 72 bytes', () => {
		expect(CONTRASENYA_MIN).toBe(10);
		expect(CONTRASENYA_MAX_BYTES).toBe(72);
	});

	it('buida', () => {
		expect(validarContrasenya('')).toEqual({ ok: false, motiu: 'buida' });
	});

	it('curta: menys de 10 caràcters', () => {
		expect(validarContrasenya('a')).toEqual({ ok: false, motiu: 'curta' });
		expect(validarContrasenya('123456789')).toEqual({ ok: false, motiu: 'curta' });
		expect(validarContrasenya('1234567890')).toEqual({ ok: true });
	});

	it('compta caràcters (punts de codi), no unitats UTF-16', () => {
		// 9 emojis = 18 unitats UTF-16 però 9 caràcters: curta.
		expect(validarContrasenya('🏔'.repeat(9))).toEqual({ ok: false, motiu: 'curta' });
		expect(validarContrasenya('🏔'.repeat(10))).toEqual({ ok: true });
	});

	it('llarga: més de 72 bytes UTF-8 (no caràcters)', () => {
		expect(validarContrasenya('a'.repeat(72))).toEqual({ ok: true });
		expect(validarContrasenya('a'.repeat(73))).toEqual({ ok: false, motiu: 'llarga' });
		// "à" són 2 bytes: 36 caben (72 bytes), 37 no (74 bytes) encara que siguin 37 caràcters.
		expect(bytesUtf8('à')).toBe(2);
		expect(validarContrasenya('à'.repeat(36))).toEqual({ ok: true });
		expect(validarContrasenya('à'.repeat(37))).toEqual({ ok: false, motiu: 'llarga' });
		// Emoji de 4 bytes: 18 caben, 19 no.
		expect(validarContrasenya('🏔'.repeat(18))).toEqual({ ok: true });
		expect(validarContrasenya('🏔'.repeat(19))).toEqual({ ok: false, motiu: 'llarga' });
	});

	it('sense regles de composició ni retall d’espais', () => {
		expect(validarContrasenya('totes minuscules')).toEqual({ ok: true });
		expect(validarContrasenya('          ')).toEqual({ ok: true });
		// Els espais compten: "  abc  " (7) és curta, no s'amplia ni es retalla.
		expect(validarContrasenya('  abcdef  ')).toEqual({ ok: true });
		expect(validarContrasenya('  abcde  ')).toEqual({ ok: false, motiu: 'curta' });
	});

	it('igual-correu: no pot ser el correu del compte (sense majúscules ni espais)', () => {
		expect(validarContrasenya('nom@exemple.cat', 'nom@exemple.cat')).toEqual({
			ok: false,
			motiu: 'igual-correu'
		});
		expect(validarContrasenya('NOM@Exemple.cat ', ' nom@exemple.cat')).toEqual({
			ok: false,
			motiu: 'igual-correu'
		});
		expect(validarContrasenya('nom@exemple.cat1', 'nom@exemple.cat')).toEqual({ ok: true });
		expect(validarContrasenya('nom@exemple.cat', null)).toEqual({ ok: true });
		expect(validarContrasenya('nom@exemple.cat', '')).toEqual({ ok: true });
	});
});
