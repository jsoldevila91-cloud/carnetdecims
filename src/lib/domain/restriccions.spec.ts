import { describe, expect, it } from 'vitest';
import {
	esRestriccioPeriodica,
	esRestriccioPermanent,
	estatRestriccions,
	restriccioCaducada,
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
