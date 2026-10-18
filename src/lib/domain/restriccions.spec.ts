import { describe, expect, it } from 'vitest';
import {
	esRestriccioPeriodica,
	esRestriccioPermanent,
	estatRestriccions,
	restriccioCaducada,
	restriccioVigent,
	restriccionsVigents,
	teRestriccioActiva,
	type RestriccioAcces
} from './index';

function restriccio(over: Partial<RestriccioAcces> = {}): RestriccioAcces {
	return {
		tipus: 'fauna',
		periodeIniciMmdd: null,
		periodeFiMmdd: null,
		dataInici: null,
		dataFi: null,
		fontUrl: 'https://www.feec.cat/activitats/100-cims/cims-amb-restriccions-dacces/',
		...over
	};
}

const fauna = restriccio({ periodeIniciMmdd: '01-15', periodeFiMmdd: '06-15' });
const obres = restriccio({ tipus: 'obres' });
const obresAntigues = restriccio({ tipus: 'obres', dataInici: '2020-01-01', dataFi: '2020-12-31' });
const obresFutures = restriccio({ tipus: 'obres', dataInici: '2027-03-01', dataFi: '2027-05-31' });
const retirada = restriccio({ tipus: 'militar', vigent: false });

describe('tipus de restricció', () => {
	it('periòdica, permanent, caducada', () => {
		expect(esRestriccioPeriodica(fauna)).toBe(true);
		expect(esRestriccioPermanent(fauna)).toBe(false);
		expect(esRestriccioPeriodica(obres)).toBe(false);
		expect(esRestriccioPermanent(obres)).toBe(true);
		expect(esRestriccioPermanent(obresAntigues)).toBe(false);
		expect(esRestriccioPermanent(retirada)).toBe(false);
		// Un periode mal format no es considera periòdic
		expect(
			esRestriccioPeriodica(restriccio({ periodeIniciMmdd: '13-01', periodeFiMmdd: '02-01' }))
		).toBe(false);

		expect(restriccioCaducada(obresAntigues, '2026-09-28')).toBe(true);
		expect(restriccioCaducada(obresAntigues, '2020-12-31')).toBe(false);
		expect(restriccioCaducada(retirada, '2026-09-28')).toBe(true);
		expect(restriccioCaducada(fauna, '2026-09-28')).toBe(false);
	});
});

describe('estatRestriccions (avís "restricció vigent avui")', () => {
	const cim = { restriccions: [fauna, obres, obresAntigues, obresFutures, retirada] };

	it('dins la temporada de fauna: fauna i obres actives', () => {
		const e = estatRestriccions(cim, '2026-03-01');
		expect(e.actives).toEqual([fauna, obres]);
		expect(e.inactives).toEqual([obresFutures]);
		expect(e.teRestriccions).toBe(true);
		expect(teRestriccioActiva(cim, '2026-03-01')).toBe(true);
	});

	it('fora de temporada: la periòdica passa a inactiva; les caducades no surten', () => {
		const e = estatRestriccions(cim, '2026-09-28');
		expect(e.actives).toEqual([obres]);
		expect(e.inactives).toEqual([fauna, obresFutures]);
	});

	it('límits inclusius i rang futur', () => {
		expect(estatRestriccions({ restriccions: [fauna] }, '2026-06-15').actives).toEqual([fauna]);
		expect(estatRestriccions({ restriccions: [fauna] }, '2026-06-16').inactives).toEqual([fauna]);
		expect(estatRestriccions({ restriccions: [obresFutures] }, '2027-03-01').actives).toEqual([
			obresFutures
		]);
	});

	it('sense restriccions o només caducades', () => {
		expect(estatRestriccions({ restriccions: [] }, '2026-09-28')).toEqual({
			actives: [],
			inactives: [],
			teRestriccions: false
		});
		const nomesCaducades = { restriccions: [obresAntigues, retirada] };
		expect(estatRestriccions(nomesCaducades, '2026-09-28').teRestriccions).toBe(false);
		expect(teRestriccioActiva(nomesCaducades, '2026-09-28')).toBe(false);
	});

	it('data invàlida → RangeError', () => {
		expect(() => estatRestriccions(cim, '2026-02-30')).toThrow(RangeError);
	});
});

describe('restriccioVigent (avís a les llistes)', () => {
	const roc = restriccio({ periodeIniciMmdd: '12-01', periodeFiMmdd: '06-01' });

	it('sense restriccions, o cap d’activa → null', () => {
		expect(restriccioVigent({ restriccions: [] }, '2026-03-01')).toBeNull();
		expect(restriccioVigent({ restriccions: [fauna] }, '2026-09-28')).toBeNull();
		expect(restriccioVigent({ restriccions: [obresAntigues, retirada] }, '2026-03-01')).toBeNull();
		expect(restriccioVigent({ restriccions: [obresFutures] }, '2027-02-28')).toBeNull();
	});

	it('periode anual: fins al final del periode en curs (límits inclusius)', () => {
		expect(restriccioVigent({ restriccions: [fauna] }, '2026-01-15')).toEqual({
			tipus: 'fauna',
			fins: '2026-06-15',
			incerta: false,
			restriccions: [fauna]
		});
		expect(restriccioVigent({ restriccions: [fauna] }, '2026-06-15')?.fins).toBe('2026-06-15');
		expect(restriccioVigent({ restriccions: [fauna] }, '2026-01-14')).toBeNull();
	});

	it('periode que creua el canvi d’any (Roc Roi): al desembre acaba l’any següent', () => {
		expect(restriccioVigent({ restriccions: [roc] }, '2026-12-01')?.fins).toBe('2027-06-01');
		expect(restriccioVigent({ restriccions: [roc] }, '2027-03-10')?.fins).toBe('2027-06-01');
		expect(restriccioVigent({ restriccions: [roc] }, '2027-06-02')).toBeNull();
	});

	it('final 02-29 en un any no de traspàs → 28 de febrer', () => {
		const r = restriccio({ periodeIniciMmdd: '02-01', periodeFiMmdd: '02-29' });
		expect(restriccioVigent({ restriccions: [r] }, '2027-02-10')?.fins).toBe('2027-02-28');
		expect(restriccioVigent({ restriccions: [r] }, '2028-02-10')?.fins).toBe('2028-02-29');
	});

	it('rang de dates: fins a dataFi; periode amb dataFi abans del final → dataFi', () => {
		expect(restriccioVigent({ restriccions: [obresFutures] }, '2027-04-01')).toMatchObject({
			tipus: 'obres',
			fins: '2027-05-31',
			incerta: false
		});
		const ambFi = restriccio({
			periodeIniciMmdd: '01-15',
			periodeFiMmdd: '06-15',
			dataFi: '2026-03-31'
		});
		expect(restriccioVigent({ restriccions: [ambFi] }, '2026-02-01')?.fins).toBe('2026-03-31');
		const obertaDreta = restriccio({ tipus: 'propietat', dataInici: '2026-01-01' });
		expect(restriccioVigent({ restriccions: [obertaDreta] }, '2026-05-01')).toMatchObject({
			fins: null,
			// Té data d'inici coneguda: no és la restricció incerta sense dates.
			incerta: false
		});
	});

	it('permanent sense dates (Sant Salvador de les Espases): fins null i incerta', () => {
		expect(restriccioVigent({ restriccions: [obres] }, '2026-10-18')).toEqual({
			tipus: 'obres',
			fins: null,
			incerta: true,
			restriccions: [obres]
		});
	});

	it('diverses actives: la que dura més mana; incerta només si totes són permanents', () => {
		const v = restriccioVigent({ restriccions: [fauna, obres] }, '2026-03-01');
		expect(v).toEqual({
			tipus: 'obres',
			fins: null,
			incerta: false,
			restriccions: [fauna, obres]
		});
		const curta = restriccio({ tipus: 'altres', dataInici: '2026-02-01', dataFi: '2026-03-15' });
		expect(restriccioVigent({ restriccions: [curta, fauna] }, '2026-03-01')).toMatchObject({
			tipus: 'fauna',
			fins: '2026-06-15'
		});
	});

	it('data invàlida → RangeError', () => {
		expect(() => restriccioVigent({ restriccions: [] }, '2026-13-01')).toThrow(RangeError);
		expect(() => restriccionsVigents([], 'avui')).toThrow(RangeError);
	});

	it('restriccionsVigents: només els cims amb una restricció activa, per id', () => {
		const cims = [
			{ id: 1, restriccions: [] },
			{ id: 2, restriccions: [fauna] },
			{ id: 3, restriccions: [obres] }
		];
		const estiu = restriccionsVigents(cims, '2026-08-01');
		expect([...estiu.keys()]).toEqual([3]);
		const hivern = restriccionsVigents(cims, '2026-02-01');
		expect([...hivern.keys()]).toEqual([2, 3]);
		expect(hivern.get(2)?.fins).toBe('2026-06-15');
	});
});
