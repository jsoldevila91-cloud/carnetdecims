import { describe, expect, it } from 'vitest';
import {
	CLAU_ENLLAC,
	confirmacioValida,
	dataSync,
	desaEnllacEnviat,
	emailValid,
	estatNuvol,
	estatPrimerAcces,
	llegeixEnllacEnviat,
	missatgePrimerAcces,
	oblidaEnllacEnviat,
	segonsPerReenviar,
	tempsRelatiu
} from './nuvol';

const autenticat = { estat: 'autenticat', usuari: { id: 'u1', email: 'a@b.cat' } } as const;

function memoria() {
	const dades = new Map<string, string>();
	return {
		getItem: (k: string) => dades.get(k) ?? null,
		setItem: (k: string, v: string) => void dades.set(k, v),
		removeItem: (k: string) => void dades.delete(k),
		dades
	};
}

describe('estatNuvol', () => {
	it('carregant i anònim no depenen de la sincronització', () => {
		expect(estatNuvol({ estat: 'carregant' }, { pendents: 3 })).toEqual({ tipus: 'carregant' });
		expect(estatNuvol({ estat: 'anonim' }, { pendents: 3, error: 'x' })).toEqual({
			tipus: 'local'
		});
	});

	it("l'error mana sobre els pendents (amb connexió)", () => {
		expect(estatNuvol(autenticat, { pendents: 2, error: new Error('x') })).toEqual({
			tipus: 'error'
		});
	});

	it("el conflicte d'un altre compte mana sobre tot", () => {
		expect(estatNuvol(autenticat, { pendents: 2, error: 'x', conflicte: 'altre-compte' })).toEqual({
			tipus: 'conflicte'
		});
	});

	it('sense connexió, els pendents no es mostren com a error', () => {
		expect(estatNuvol(autenticat, { pendents: 2, error: 'x' }, false)).toEqual({
			tipus: 'pendents',
			pendents: 2,
			offline: true
		});
	});

	it('tot desat amb data, o encara cap sincronització', () => {
		const d = '2026-10-09T10:00:00Z';
		expect(estatNuvol(autenticat, { pendents: 0, ultimaSync: d })).toEqual({
			tipus: 'ok',
			ultimaSync: new Date(d)
		});
		expect(estatNuvol(autenticat, { pendents: 0, ultimaSync: null })).toEqual({ tipus: 'mai' });
	});
});

describe('dataSync', () => {
	it('accepta Date, ISO i mil·lisegons; descarta valors no vàlids', () => {
		const ms = Date.UTC(2026, 9, 9);
		expect(dataSync(new Date(ms))?.getTime()).toBe(ms);
		expect(dataSync(new Date(ms).toISOString())?.getTime()).toBe(ms);
		expect(dataSync(ms)?.getTime()).toBe(ms);
		expect(dataSync('no')).toBeNull();
		expect(dataSync(undefined)).toBeNull();
	});
});

describe('tempsRelatiu', () => {
	const ara = new Date('2026-10-09T12:00:00Z');
	const fa = (s: number) => new Date(ara.getTime() - s * 1000);

	it('per sota del minut retorna null ("ara mateix")', () => {
		expect(tempsRelatiu(fa(30), ara, 'ca')).toBeNull();
	});

	it('minuts, hores i dies en format curt', () => {
		expect(tempsRelatiu(fa(120), ara, 'ca')).toMatch(/2 min/);
		expect(tempsRelatiu(fa(120), ara, 'es')).toMatch(/2 min/);
		expect(tempsRelatiu(fa(3 * 3600), ara, 'ca')).toMatch(/3 h/);
		expect(tempsRelatiu(fa(26 * 3600), ara, 'ca')).toBe('ahir');
		expect(tempsRelatiu(fa(26 * 3600), ara, 'es')).toBe('ayer');
	});
});

describe('emailValid i confirmacioValida', () => {
	it('valida correus habituals', () => {
		expect(emailValid('nom@exemple.cat')).toBe(true);
		expect(emailValid('  nom.cognom+x@exemple.co.uk ')).toBe(true);
		expect(emailValid('nom@exemple')).toBe(false);
		expect(emailValid('nom exemple@a.cat')).toBe(false);
		expect(emailValid('')).toBe(false);
	});

	it('accepta el correu o la paraula, sense majúscules ni espais', () => {
		expect(confirmacioValida(' esborrar ', 'a@b.cat', 'ESBORRAR')).toBe(true);
		expect(confirmacioValida('A@B.CAT', 'a@b.cat', 'ESBORRAR')).toBe(true);
		expect(confirmacioValida('esborra', 'a@b.cat', 'ESBORRAR')).toBe(false);
		expect(confirmacioValida('', 'a@b.cat', 'ESBORRAR')).toBe(false);
		expect(confirmacioValida('', '', '')).toBe(false);
		expect(confirmacioValida('x@y.cat', null, 'BORRAR')).toBe(false);
	});
});

describe('marca "enllaç enviat"', () => {
	it('desa, llegeix i oblida', () => {
		const m = memoria();
		desaEnllacEnviat('a@b.cat', 1000, m);
		expect(llegeixEnllacEnviat(m)).toEqual({ email: 'a@b.cat', t: 1000 });
		oblidaEnllacEnviat(m);
		expect(llegeixEnllacEnviat(m)).toBeNull();
	});

	it('ignora valors corruptes i magatzem inexistent', () => {
		const m = memoria();
		m.setItem(CLAU_ENLLAC, '{no json');
		expect(llegeixEnllacEnviat(m)).toBeNull();
		m.setItem(CLAU_ENLLAC, JSON.stringify({ email: 1 }));
		expect(llegeixEnllacEnviat(m)).toBeNull();
		expect(llegeixEnllacEnviat(null)).toBeNull();
	});

	it('compte enrere de 60 s per reenviar', () => {
		expect(segonsPerReenviar(0, 0)).toBe(60);
		expect(segonsPerReenviar(0, 59_500)).toBe(1);
		expect(segonsPerReenviar(0, 60_000)).toBe(0);
		expect(segonsPerReenviar(0, 999_999)).toBe(0);
	});
});

describe('estatPrimerAcces', () => {
	const t = Date.UTC(2026, 9, 9, 10);

	it('desant fins a una sincronització completa posterior a l’entrada', () => {
		expect(estatPrimerAcces(t, { pendents: 4 })).toBe('desant');
		expect(estatPrimerAcces(t, { pendents: 0, ultimaSync: new Date(t - 1000) })).toBe('desant');
		expect(estatPrimerAcces(t, { pendents: 2, ultimaSync: new Date(t + 1000) })).toBe('desant');
		expect(
			estatPrimerAcces(t, { pendents: 0, ultimaSync: new Date(t + 1000), sincronitzant: true })
		).toBe('desant');
		expect(estatPrimerAcces(t, { pendents: 0, ultimaSync: new Date(t + 1000) })).toBe('fet');
	});

	it('error si la sincronització falla; conflicte a part', () => {
		expect(estatPrimerAcces(t, { pendents: 4, error: 'xarxa' })).toBe('error');
		expect(estatPrimerAcces(t, { pendents: 4, error: 'x', conflicte: 'altre-compte' })).toBe(
			'conflicte'
		);
	});
});

describe('missatgePrimerAcces', () => {
	it('desades, recuperades o compte buit', () => {
		expect(missatgePrimerAcces(12, 12)).toEqual({ tipus: 'desades', n: 12 });
		expect(missatgePrimerAcces(0, 30)).toEqual({ tipus: 'recuperades', n: 30 });
		expect(missatgePrimerAcces(0, 0)).toEqual({ tipus: 'buit' });
	});
});
