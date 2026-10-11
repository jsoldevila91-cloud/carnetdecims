import { describe, expect, it } from 'vitest';
import {
	COMPANYS_MAX,
	COMPANY_MAX_CARACTERS,
	MAX_SUGGERIMENTS_COMPANYS,
	clauCompany,
	companysUsats,
	mateixosCompanys,
	normalitzarCompany,
	normalitzarCompanys,
	suggerirCompanys,
	type AscensioAmbCompanys
} from './index';

describe('normalitzarCompany', () => {
	// Els caràcters invisibles s'escriuen per codi.
	const car = (...codis: number[]) => String.fromCodePoint(...codis);

	it('treu espais sobrers, salts de línia i caràcters de control', () => {
		expect(normalitzarCompany('  el   Pau  ')).toBe('el Pau');
		expect(normalitzarCompany('Colla\r\n del\tCE')).toBe('Colla del CE');
		// Caràcter nul, espai dur (U+00A0) i espai d'amplada zero (U+200B).
		expect(normalitzarCompany(`Ine${car(0)}sa${car(0x200b)}`)).toBe('Ine sa');
		expect(normalitzarCompany(`el${car(0xa0)}Pau${car(0x200b)}Vila`)).toBe('el Pau Vila');
		expect(normalitzarCompany(' \n ')).toBe('');
	});

	it('conserva els emojis compostos (connector d’amplada zero, U+200D)', () => {
		const familia = car(0x1f468, 0x200d, 0x1f469, 0x200d, 0x1f467);
		expect(normalitzarCompany(` ${familia} `)).toBe(familia);
	});

	it('passa a NFC (la mateixa lletra accentuada, un sol caràcter)', () => {
		// "e" + accent greu combinatori (U+0300).
		const descompost = `Ine${car(0x300)}s`;
		expect(descompost).toHaveLength(5);
		expect(normalitzarCompany(descompost)).toBe(`In${car(0xe8)}s`);
		expect(normalitzarCompany(descompost)).toHaveLength(4);
	});
});

describe('clauCompany', () => {
	it('no distingeix majúscules, accents, apòstrofs ni puntuació', () => {
		expect(clauCompany('Inesa')).toBe(clauCompany('  INÈSA '));
		expect(clauCompany('Joan P.')).toBe(clauCompany('joan p'));
		expect(clauCompany("l'Oriol")).toBe(clauCompany('L’oriol'));
		expect(clauCompany('Pau')).not.toBe(clauCompany('Pol'));
	});

	it('un nom sense lletres ni xifres (emoji) conserva una clau pròpia', () => {
		expect(clauCompany('🐕')).toBe('🐕');
		expect(clauCompany('🐕')).not.toBe(clauCompany('🐈'));
	});
});

describe('normalitzarCompanys', () => {
	it('absent → []; normalitza, treu buits i repetits conservant l’ordre i la primera grafia', () => {
		expect(normalitzarCompanys(undefined)).toEqual({ ok: true, companys: [] });
		expect(normalitzarCompanys(null)).toEqual({ ok: true, companys: [] });
		expect(normalitzarCompanys([])).toEqual({ ok: true, companys: [] });
		expect(
			normalitzarCompanys(['  Inesa ', '', 'el  Pau', 'INESA', '   ', 'Inèsa', 'Mar'])
		).toEqual({
			ok: true,
			companys: ['Inesa', 'el Pau', 'Mar']
		});
	});

	it('és idempotent', () => {
		const un = normalitzarCompanys([' Inesa', 'el Pau ', 'inesa']);
		expect(un.ok && normalitzarCompanys(un.companys)).toEqual(un);
	});

	it('format: ha de ser una llista de text', () => {
		for (const dolent of ['Inesa', 7, {}, ['a', 1], [null], [['a']]]) {
			expect(normalitzarCompanys(dolent)).toEqual({ ok: false, error: 'format' });
		}
	});

	it(`massa: més de ${COMPANYS_MAX} noms diferents (els repetits i els buits no compten)`, () => {
		const deu = Array.from({ length: COMPANYS_MAX }, (_, i) => `c${i}`);
		expect(normalitzarCompanys(deu)).toEqual({ ok: true, companys: deu });
		expect(normalitzarCompanys([...deu, 'C0', ''])).toEqual({ ok: true, companys: deu });
		expect(normalitzarCompanys([...deu, 'un més'])).toEqual({ ok: false, error: 'massa' });
	});

	it(`massa-llarg: més de ${COMPANY_MAX_CARACTERS} caràcters Unicode (després de normalitzar)`, () => {
		const just = 'x'.repeat(COMPANY_MAX_CARACTERS);
		expect(normalitzarCompanys([`  ${just}  `])).toEqual({ ok: true, companys: [just] });
		expect(normalitzarCompanys([just + 'x'])).toEqual({ ok: false, error: 'massa-llarg' });
		// Compta caràcters, no unitats UTF-16 (com `char_length` de Postgres).
		const emojis = '🏔'.repeat(COMPANY_MAX_CARACTERS);
		expect(emojis.length).toBe(COMPANY_MAX_CARACTERS * 2);
		expect(normalitzarCompanys([emojis])).toEqual({ ok: true, companys: [emojis] });
	});
});

describe('mateixosCompanys', () => {
	it('compara noms i ordre; absent = buit', () => {
		expect(mateixosCompanys(['a', 'b'], ['a', 'b'])).toBe(true);
		expect(mateixosCompanys(['a', 'b'], ['b', 'a'])).toBe(false);
		expect(mateixosCompanys(['a'], ['a', 'b'])).toBe(false);
		expect(mateixosCompanys(undefined, [])).toBe(true);
		expect(mateixosCompanys(null, undefined)).toBe(true);
	});
});

describe('companysUsats i suggerirCompanys', () => {
	const a = (
		data: string,
		companys: string[] | undefined,
		extra: Partial<AscensioAmbCompanys> = {}
	): AscensioAmbCompanys => ({ data, companys, createdAt: `${data}T10:00:00.000Z`, ...extra });

	const historial = [
		a('2024-05-01', ['Inesa', 'Pau']),
		a('2024-06-01', ['inesa', 'Mar']),
		a('2025-01-01', ['INÈSA']),
		a('2025-02-01', ['Pau', 'Pol Vila']),
		a('2025-03-01', undefined), // fila anterior a R1
		a('2025-04-01', []),
		a('2025-05-01', ['Esborrat'], { deletedAt: '2025-05-02T00:00:00.000Z' })
	];

	it('compta un cop per ascensió, amb la grafia més recent, de més a menys freqüent', () => {
		expect(companysUsats(historial)).toEqual([
			{ nom: 'INÈSA', vegades: 3, ultimaData: '2025-01-01' },
			{ nom: 'Pau', vegades: 2, ultimaData: '2025-02-01' },
			{ nom: 'Pol Vila', vegades: 1, ultimaData: '2025-02-01' },
			{ nom: 'Mar', vegades: 1, ultimaData: '2024-06-01' }
		]);
	});

	it('no surten els de les ascensions esborrades ni es repeteix dins d’una ascensió', () => {
		expect(suggerirCompanys(historial)).not.toContain('Esborrat');
		expect(companysUsats([a('2025-01-01', ['Pau', 'pau', ' PAU '])])).toEqual([
			{ nom: 'Pau', vegades: 1, ultimaData: '2025-01-01' }
		]);
	});

	it('empat de freqüència: el més recent (data i, el mateix dia, createdAt); després alfabètic', () => {
		const empat = [
			a('2025-01-01', ['Zoe'], { createdAt: '2025-01-01T08:00:00.000Z' }),
			a('2025-01-01', ['Àlex'], { createdAt: '2025-01-01T09:00:00.000Z' }),
			a('2024-01-01', ['Bet', 'Ada'])
		];
		expect(suggerirCompanys(empat)).toEqual(['Àlex', 'Zoe', 'Ada', 'Bet']);
	});

	it('`text` filtra per començament de paraula, sense accents ni majúscules', () => {
		expect(suggerirCompanys(historial, { text: 'p' })).toEqual(['Pau', 'Pol Vila']);
		expect(suggerirCompanys(historial, { text: 'vi' })).toEqual(['Pol Vila']);
		expect(suggerirCompanys(historial, { text: 'ine' })).toEqual(['INÈSA']);
		expect(suggerirCompanys(historial, { text: 'au' })).toEqual([]);
		expect(suggerirCompanys(historial, { text: '   ' })).toHaveLength(4);
	});

	it('amb `text`, primer els que comencen pel text encara que siguin menys freqüents', () => {
		const h = [
			a('2025-01-01', ['Joan Mas']),
			a('2025-01-02', ['Joan Mas']),
			a('2025-01-03', ['Maria'])
		];
		expect(suggerirCompanys(h, { text: 'ma' })).toEqual(['Maria', 'Joan Mas']);
	});

	it('`exclou` treu els que ja són a l’ascensió i `limit` retalla', () => {
		expect(suggerirCompanys(historial, { exclou: ['inesa', 'MAR'] })).toEqual(['Pau', 'Pol Vila']);
		expect(suggerirCompanys(historial, { limit: 2 })).toEqual(['INÈSA', 'Pau']);
		expect(suggerirCompanys(historial, { limit: 0 })).toEqual([]);
		const molts = [
			a(
				'2025-01-01',
				Array.from({ length: 10 }, (_, i) => `c${i}`)
			),
			a(
				'2025-01-02',
				Array.from({ length: 10 }, (_, i) => `d${i}`)
			)
		];
		expect(suggerirCompanys(molts)).toHaveLength(MAX_SUGGERIMENTS_COMPANYS);
	});

	it('sense ascensions o sense companys → []', () => {
		expect(companysUsats([])).toEqual([]);
		expect(companysUsats([a('2025-01-01', undefined), a('2025-01-02', [])])).toEqual([]);
	});
});
