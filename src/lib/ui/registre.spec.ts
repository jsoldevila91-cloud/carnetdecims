import { describe, expect, it } from 'vitest';
import { CIMS, comarcaPerSlug } from '$lib/data/catalog';
import { calcularEstatRepte, type Ascensio } from '$lib/domain';
import { textCerca } from './filtre-cims';
import {
	agruparPerAny,
	avisosRegistre,
	cercarCims,
	idsRepeticions,
	marcadorRepte
} from './registre';

const textos = new Map(CIMS.map((c) => [c.id, textCerca(c, comarcaPerSlug(c.comarca)?.nom)]));
const id = (slug: string) => CIMS.find((c) => c.slug === slug)!.id;

let seq = 0;
function asc(slug: string | number, data: string, extra: Partial<Ascensio> = {}): Ascensio {
	seq++;
	return {
		id: `id-${seq}`,
		cimId: typeof slug === 'number' ? slug : id(slug),
		data,
		metode: 'a-peu',
		nota: null,
		createdAt: `2026-01-01T00:00:${String(seq % 60).padStart(2, '0')}.000Z`,
		updatedAt: '2026-01-01T00:00:00.000Z',
		...extra
	};
}

describe('cercarCims', () => {
	it('sense consulta no retorna res', () => {
		expect(cercarCims('  ', CIMS, textos)).toEqual([]);
	});

	it('troba per àlies i sense accents', () => {
		const r = cercarCims('pollego', CIMS, textos);
		expect(r.map((c) => c.slug)).toContain('pedraforca-pollego-superior');
	});

	it("ignora apòstrofs: 'pica destats' troba la Pica d'Estats", () => {
		expect(cercarCims('pica destats', CIMS, textos)[0].slug).toBe('pica-d-estats');
		expect(cercarCims('Pica d’Estats', CIMS, textos)[0].slug).toBe('pica-d-estats');
	});

	it('primer els que el nom comença per la consulta', () => {
		const r = cercarCims('pedra', CIMS, textos);
		expect(r[0].slug).toBe('pedraforca-pollego-superior');
	});

	it('troba per comarca', () => {
		const r = cercarCims('bergueda', CIMS, textos);
		expect(r.length).toBeGreaterThan(1);
		expect(r.every((c) => c.comarca === 'bergueda')).toBe(true);
	});
});

describe('avisosRegistre', () => {
	it('sense cim, cap avís', () => {
		expect(avisosRegistre({ cimId: null, data: '2026-01-01' }, [], CIMS)).toEqual([]);
	});

	it('restricció periòdica de fauna (La Picossa, 15/1–15/6)', () => {
		const dins = avisosRegistre({ cimId: id('la-picossa'), data: '2025-03-01' }, [], CIMS);
		expect(dins).toEqual([{ tipus: 'restriccio', incerta: false }]);
		const fora = avisosRegistre({ cimId: id('la-picossa'), data: '2025-09-01' }, [], CIMS);
		expect(fora).toEqual([]);
	});

	it('restricció permanent sense dates: avís incert', () => {
		const r = avisosRegistre(
			{ cimId: id('sant-salvador-de-les-espases'), data: '2025-03-01' },
			[],
			CIMS
		);
		expect(r).toEqual([{ tipus: 'restriccio', incerta: true }]);
	});

	it('repetició: ja hi ha una ascensió al mateix cim (la més antiga)', () => {
		const existents = [asc('puigmal', '2024-08-01'), asc('puigmal', '2020-07-10')];
		const r = avisosRegistre({ cimId: id('puigmal'), data: '2026-01-01' }, existents, CIMS);
		expect(r).toEqual([{ tipus: 'repeticio', dataAnterior: '2020-07-10' }]);
	});

	it("en editar, l'ascensió mateixa no és una repetició", () => {
		const a = asc('puigmal', '2024-08-01');
		expect(
			avisosRegistre({ cimId: a.cimId, data: a.data }, [a], CIMS, { excloureId: a.id })
		).toEqual([]);
	});

	it('les esborrades no compten', () => {
		const a = asc('puigmal', '2024-08-01', { deletedAt: '2026-01-01T00:00:00.000Z' });
		expect(avisosRegistre({ cimId: a.cimId, data: '2025-01-01' }, [a], CIMS)).toEqual([]);
	});

	it("límit anual: passa de N cims nous l'any de la data", () => {
		const existents = [asc('puigmal', '2025-02-01'), asc('pica-d-estats', '2025-03-01')];
		const r = avisosRegistre({ cimId: id('canigo'), data: '2025-05-01' }, existents, CIMS, {
			limitAnual: 2
		});
		expect(r).toEqual([{ tipus: 'limit-anual', any: 2025, cimsNoves: 3 }]);
		// Un altre any: no
		expect(
			avisosRegistre({ cimId: id('canigo'), data: '2026-05-01' }, existents, CIMS, {
				limitAnual: 2
			})
		).toEqual([]);
	});

	it('límit anual: una repetició no és un cim nou', () => {
		const existents = [asc('puigmal', '2025-02-01'), asc('pica-d-estats', '2025-03-01')];
		const r = avisosRegistre({ cimId: id('puigmal'), data: '2025-05-01' }, existents, CIMS, {
			limitAnual: 1
		});
		expect(r.map((a) => a.tipus)).toEqual(['repeticio']);
	});

	it('data invàlida: només es pot avisar de la repetició', () => {
		const existents = [asc('puigmal', '2025-02-01')];
		const r = avisosRegistre({ cimId: id('puigmal'), data: '' }, existents, CIMS);
		expect(r.map((a) => a.tipus)).toEqual(['repeticio']);
	});
});

describe('marcadorRepte', () => {
	const avui = '2026-09-29';

	it('carnet buit: 0/100, pàgina I, nivell 0', () => {
		expect(marcadorRepte(calcularEstatRepte([], CIMS, avui))).toEqual({
			nivell: 0,
			comptador: 0,
			objectiu: 100,
			pagina: 1,
			dinsPagina: 0,
			falten: 100
		});
	});

	it('les repeticions no sumen', () => {
		const llista = [
			asc('puigmal', '2025-02-01'),
			asc('puigmal', '2025-03-01'),
			asc('canigo', '2025-04-01')
		];
		const m = marcadorRepte(calcularEstatRepte(llista, CIMS, avui));
		expect(m.comptador).toBe(2);
		expect(m.falten).toBe(98);
	});

	it('amb el 100 completat passa a la pàgina II (objectiu 200)', () => {
		const llista = CIMS.slice(0, 120).map((c) => asc(c.id, '2024-06-01'));
		const m = marcadorRepte(calcularEstatRepte(llista, CIMS, avui));
		expect(m).toMatchObject({
			nivell: 1,
			comptador: 120,
			objectiu: 200,
			pagina: 2,
			dinsPagina: 20
		});
	});
});

describe('historial', () => {
	it('agrupa per any en ordre descendent', () => {
		const llista = [
			asc('puigmal', '2026-02-01'),
			asc('canigo', '2024-01-01'),
			asc('pica-d-estats', '2026-01-01')
		];
		const grups = agruparPerAny(llista);
		expect(grups.map((g) => g.any)).toEqual([2026, 2024]);
		expect(grups[0].ascensions).toHaveLength(2);
	});

	it('marca com a repetició tot el que no és la primera ascensió del cim', () => {
		const primera = asc('puigmal', '2020-01-01');
		const segona = asc('puigmal', '2024-01-01');
		const altre = asc('canigo', '2024-01-01');
		expect(idsRepeticions([segona, altre, primera])).toEqual(new Set([segona.id]));
	});
});
