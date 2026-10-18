import { describe, expect, it } from 'vitest';
import { COMPANYS_MAX } from './diari';
import {
	NOTA_MAX_FUSIO,
	SEPARADOR_NOTES,
	clauDuplicat,
	contingutCanvia,
	fusionarContingut,
	instantFusio,
	ordreGuanyadora,
	planificarDuplicats,
	sonDuplicats,
	type AscensioDuplicable
} from './duplicats';

const fila = (canvis: Partial<AscensioDuplicable> = {}): AscensioDuplicable => ({
	id: '01920000-0000-7000-8000-000000000001',
	cimId: 1,
	data: '2026-09-20',
	metode: 'a-peu',
	nota: null,
	companys: [],
	createdAt: '2026-09-20T10:00:00.000Z',
	updatedAt: '2026-09-20T10:00:00.000Z',
	deletedAt: null,
	...canvis
});

const ID_A = '01920000-0000-7000-8000-00000000000a';
const ID_B = '01920000-0000-7000-8000-00000000000b';
const ID_C = '01920000-0000-7000-8000-00000000000c';

describe('clau de duplicat', () => {
	it('cim, data i mètode; ni la nota, ni els companys, ni createdAt', () => {
		const a = fila({ id: ID_A, nota: 'x', companys: ['Inesa'] });
		const b = fila({ id: ID_B, nota: null, companys: [], createdAt: '2026-09-21T08:00:00.000Z' });
		expect(clauDuplicat(a)).toBe(clauDuplicat(b));
		expect(sonDuplicats(a, b)).toBe(true);
	});

	it('cim, data o mètode diferents no són duplicats', () => {
		const a = fila({ id: ID_A });
		expect(sonDuplicats(a, fila({ id: ID_B, cimId: 2 }))).toBe(false);
		expect(sonDuplicats(a, fila({ id: ID_B, data: '2026-09-21' }))).toBe(false);
		expect(sonDuplicats(a, fila({ id: ID_B, metode: 'esqui' }))).toBe(false);
	});

	it('les làpides i la mateixa fila no són duplicats', () => {
		const a = fila({ id: ID_A });
		expect(sonDuplicats(a, fila({ id: ID_B, deletedAt: '2026-09-22T00:00:00.000Z' }))).toBe(false);
		expect(sonDuplicats(a, a)).toBe(false);
	});
});

describe('guanyadora determinista', () => {
	it('createdAt més antic primer', () => {
		const vella = fila({ id: ID_B, createdAt: '2026-09-20T09:00:00.000Z' });
		const nova = fila({ id: ID_A, createdAt: '2026-09-20T10:00:00.000Z' });
		expect([nova, vella].sort(ordreGuanyadora).map((f) => f.id)).toEqual([ID_B, ID_A]);
	});

	it('createdAt idèntic: guanya l’id menor (sigui quin sigui l’ordre d’entrada)', () => {
		const a = fila({ id: ID_A });
		const b = fila({ id: ID_B });
		expect(planificarDuplicats([a, b])[0].guanyadora.id).toBe(ID_A);
		expect(planificarDuplicats([b, a])[0].guanyadora.id).toBe(ID_A);
	});

	it('el pla no depèn de l’ordre de les files (convergència entre dispositius)', () => {
		const files = [
			fila({ id: ID_C, createdAt: '2026-09-20T08:00:00.000Z', nota: 'c', companys: ['Pau'] }),
			fila({ id: ID_A, nota: 'a', companys: ['Inesa'] }),
			fila({ id: ID_B, nota: 'b', updatedAt: '2026-09-25T00:00:00.000Z' })
		];
		const p1 = planificarDuplicats(files);
		const p2 = planificarDuplicats([...files].reverse());
		expect(p2).toEqual(p1);
		expect(p1[0].guanyadora.id).toBe(ID_C);
		expect(p1[0].perdedores.map((f) => f.id)).toEqual([ID_A, ID_B]);
	});
});

describe('fusió del contingut', () => {
	it('notes diferents: s’uneixen en l’ordre de la guanyadora', () => {
		const c = fusionarContingut([fila({ nota: 'primera' }), fila({ id: ID_B, nota: 'segona' })]);
		expect(c.nota).toBe(`primera${SEPARADOR_NOTES}segona`);
	});

	it('nota buida o nul·la no compta; una sola nota es queda tal qual', () => {
		expect(fusionarContingut([fila({ nota: null }), fila({ id: ID_B, nota: 'n' })]).nota).toBe('n');
		expect(fusionarContingut([fila({ nota: '' }), fila({ id: ID_B, nota: null })]).nota).toBeNull();
	});

	it('notes iguals o contingudes en una altra no es repeteixen (idempotent)', () => {
		expect(fusionarContingut([fila({ nota: 'n' }), fila({ id: ID_B, nota: 'n' })]).nota).toBe('n');
		const fusionada = `a${SEPARADOR_NOTES}b`;
		expect(fusionarContingut([fila({ nota: fusionada }), fila({ id: ID_B, nota: 'b' })]).nota).toBe(
			fusionada
		);
		expect(fusionarContingut([fila({ nota: 'b' }), fila({ id: ID_B, nota: fusionada })]).nota).toBe(
			fusionada
		);
	});

	it('si la unió passa del límit, es queda la nota no buida de l’updatedAt més recent', () => {
		const llarga = 'x'.repeat(NOTA_MAX_FUSIO - 1);
		const c = fusionarContingut([
			fila({ nota: llarga, updatedAt: '2026-09-20T10:00:00.000Z' }),
			fila({ id: ID_B, nota: 'recent', updatedAt: '2026-09-21T10:00:00.000Z' }),
			fila({ id: ID_C, nota: null, updatedAt: '2026-09-22T10:00:00.000Z' })
		]);
		expect(c.nota).toBe('recent');
		expect(
			fusionarContingut([fila({ nota: 'abc' }), fila({ id: ID_B, nota: 'def' })], { notaMax: 5 })
				.nota
		).toBe('abc');
	});

	it('companys: unió sense repetits (clau sense accents ni majúscules), primer la guanyadora', () => {
		const c = fusionarContingut([
			fila({ companys: ['Inesa', 'Pau'] }),
			fila({ id: ID_B, companys: ['INÈSA', 'Marta'] })
		]);
		expect(c.companys).toEqual(['Inesa', 'Pau', 'Marta']);
	});

	it(`companys: com a màxim ${COMPANYS_MAX}`, () => {
		const noms = (p: string) => Array.from({ length: 8 }, (_, i) => `${p}${i}`);
		const c = fusionarContingut([
			fila({ companys: noms('a') }),
			fila({ id: ID_B, companys: noms('b') })
		]);
		expect(c.companys).toHaveLength(COMPANYS_MAX);
		expect(c.companys?.slice(0, 8)).toEqual(noms('a'));
	});

	it('sense la clau companys a cap fila, el resultat tampoc no la porta', () => {
		const sense = { ...fila(), companys: undefined };
		expect(fusionarContingut([sense, { ...sense, id: ID_B }]).companys).toBeUndefined();
		expect(fusionarContingut([sense, fila({ id: ID_B, companys: ['Pau'] })]).companys).toEqual([
			'Pau'
		]);
	});

	it('contingutCanvia compara la nota, la presència de la clau i els companys', () => {
		const f = fila({ nota: 'n', companys: ['Pau'] });
		expect(contingutCanvia(f, { nota: 'n', companys: ['Pau'] })).toBe(false);
		expect(contingutCanvia(f, { nota: 'm', companys: ['Pau'] })).toBe(true);
		expect(contingutCanvia(f, { nota: 'n', companys: ['Pau', 'Inesa'] })).toBe(true);
		expect(contingutCanvia({ ...f, companys: undefined }, { nota: 'n', companys: [] })).toBe(true);
	});
});

describe('planificarDuplicats', () => {
	it('sense duplicats, cap pla', () => {
		expect(planificarDuplicats([fila({ id: ID_A }), fila({ id: ID_B, cimId: 2 })])).toEqual([]);
	});

	it('ignora les làpides i les files repetides (mateix id)', () => {
		const a = fila({ id: ID_A });
		expect(
			planificarDuplicats([a, a, fila({ id: ID_B, deletedAt: '2026-09-21T00:00:00.000Z' })])
		).toEqual([]);
	});

	it('pla complet: guanyadora, perdedores, contingut i instant (max updatedAt + 1 ms)', () => {
		const a = fila({ id: ID_A, nota: 'a', updatedAt: '2026-09-20T10:00:00.000Z' });
		const b = fila({ id: ID_B, companys: ['Pau'], updatedAt: '2026-09-23T10:00:00.000Z' });
		const [pla] = planificarDuplicats([b, a]);
		expect(pla.guanyadora).toBe(a);
		expect(pla.perdedores).toEqual([b]);
		expect(pla.contingut).toEqual({ nota: 'a', companys: ['Pau'] });
		expect(pla.canviaGuanyadora).toBe(true);
		expect(pla.instant).toBe('2026-09-23T10:00:00.001Z');
	});

	it('si la guanyadora ja té tot el contingut, no cal reescriure-la', () => {
		const a = fila({ id: ID_A, nota: 'n', companys: ['Pau'] });
		const b = fila({ id: ID_B, nota: 'n' });
		expect(planificarDuplicats([a, b])[0].canviaGuanyadora).toBe(false);
	});

	it('aplicar el pla i tornar a planificar no fa res (estable, sense bucles)', () => {
		const a = fila({ id: ID_A, nota: 'a' });
		const b = fila({ id: ID_B, nota: 'b', companys: ['Pau'] });
		const [pla] = planificarDuplicats([a, b]);
		const guanyadora = { ...a, ...pla.contingut, updatedAt: pla.instant };
		const lapida = { ...b, deletedAt: pla.instant, updatedAt: pla.instant };
		expect(planificarDuplicats([guanyadora, lapida])).toEqual([]);
		// I si una altra fila igual hi torna a aparèixer, la fusió no duplica text ni companys.
		const [pla2] = planificarDuplicats([guanyadora, { ...b, id: ID_C }]);
		expect(pla2.canviaGuanyadora).toBe(false);
	});

	it('diversos grups: un pla per grup, ordenats per id de la guanyadora', () => {
		const plans = planificarDuplicats([
			fila({ id: ID_C, cimId: 2 }),
			fila({ id: ID_B }),
			fila({ id: ID_A, cimId: 2 }),
			fila({ id: '01920000-0000-7000-8000-00000000000d' })
		]);
		expect(plans.map((p) => p.guanyadora.id)).toEqual([ID_A, ID_B]);
	});

	it('`preferida` passa al davant (importació: es queda l’id local)', () => {
		const local = fila({ id: ID_B, createdAt: '2026-09-21T00:00:00.000Z' });
		const fitxer = fila({ id: ID_A, createdAt: '2026-09-20T00:00:00.000Z' });
		const [pla] = planificarDuplicats([fitxer, local], { preferida: (f) => f.id === ID_B });
		expect(pla.guanyadora.id).toBe(ID_B);
	});

	it('instantFusio: updatedAt més gran + 1 ms', () => {
		expect(
			instantFusio([
				{ updatedAt: '2026-09-20T10:00:00.999Z' },
				{ updatedAt: '2026-09-19T10:00:00.000Z' }
			])
		).toBe('2026-09-20T10:00:01.000Z');
	});
});
