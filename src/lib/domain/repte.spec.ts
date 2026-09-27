import { describe, it, expect } from 'vitest';
import {
	DATA_INICI_REPTE,
	DATA_NORMATIVA_ESSENCIALS,
	OPCIONS_PER_DEFECTE,
	anyDe,
	ascensionsValides,
	avuiLocal,
	calcularEstatRepte,
	cimsNovesPerAny,
	esDataIsoValida,
	essencialsPendents,
	excesAnual,
	nivell,
	primeresAscensions,
	progres100,
	progresInfantil,
	progresPerZona,
	restriccioActiva,
	restriccionsActives,
	validarData,
	validarMetode,
	type Ascensio,
	type AscensioMinima,
	type Cim,
	type DataISO,
	type RestriccioAcces
} from './index';

// ---------------------------------------------------------------------------
// Utilidades de test
// ---------------------------------------------------------------------------

const AVUI = '2026-09-27';

function cim(id: number, over: Partial<Cim> = {}): Cim {
	return {
		id,
		slug: `cim-${id}`,
		nom: `Cim ${id}`,
		nom_amb_article: `el Cim ${id}`,
		nom_amb_de: `del Cim ${id}`,
		altitud: 1000 + id,
		comarca: `comarca-${id % 5}`,
		zona: 'catalunya',
		essencial: false,
		lat: 42,
		lon: 1.5,
		restriccions: [],
		...over
	};
}

/** Catálogo real en tamaño: ids 1..150 esenciales, 151..522 no esenciales. */
const CATALEG: Cim[] = Array.from({ length: 522 }, (_, i) =>
	cim(i + 1, { essencial: i + 1 <= 150 })
);
const ESS = (n: number, desDe = 1) => Array.from({ length: n }, (_, i) => desDe + i);
const NO_ESS = (n: number, desDe = 151) => Array.from({ length: n }, (_, i) => desDe + i);

/** Suma días a una fecha de calendario (solo en tests; UTC para evitar horas). */
function sumarDies(data: DataISO, n: number): DataISO {
	const [y, m, d] = data.split('-').map(Number);
	return new Date(Date.UTC(y, m - 1, d + n)).toISOString().slice(0, 10);
}

/** Una ascensión por cima; la i-ésima en `inici + i*pas` días. */
function ascs(ids: number[], inici: DataISO, pas = 0): AscensioMinima[] {
	return ids.map((cimId, i) => ({ cimId, data: sumarDies(inici, i * pas) }));
}

function asc(cimId: number, data: DataISO, over: Partial<Ascensio> = {}): Ascensio {
	return {
		id: `id-${cimId}-${data}`,
		cimId,
		data,
		metode: 'a-peu',
		nota: null,
		createdAt: '2026-01-01T00:00:00.000Z',
		updatedAt: '2026-01-01T00:00:00.000Z',
		...over
	};
}

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

// ---------------------------------------------------------------------------
// Fechas
// ---------------------------------------------------------------------------

describe('esDataIsoValida', () => {
	it.each(['2006-07-01', '2024-02-29', '2000-02-29', '2023-12-31', '2023-04-30', '0001-01-01'])(
		'acepta %s',
		(d) => expect(esDataIsoValida(d)).toBe(true)
	);

	it.each([
		'2023-02-30',
		'2023-02-29',
		'1900-02-29',
		'2023-04-31',
		'2023-13-01',
		'2023-00-10',
		'2023-01-00',
		'2023-01-32',
		'2023-1-01',
		'23-01-01',
		'2023/01/01',
		'2023-01-01T10:00:00Z',
		' 2023-01-01',
		'0000-01-01',
		''
	])('rechaza %s', (d) => expect(esDataIsoValida(d)).toBe(false));

	it('rechaza valores que no son string', () => {
		expect(esDataIsoValida(null)).toBe(false);
		expect(esDataIsoValida(undefined)).toBe(false);
		expect(esDataIsoValida(20230101)).toBe(false);
		expect(esDataIsoValida(new Date('2023-01-01'))).toBe(false);
	});
});

describe('anyDe', () => {
	it('extrae el año natural', () => {
		expect(anyDe('2023-12-31')).toBe(2023);
		expect(anyDe('2024-01-01')).toBe(2024);
	});
});

describe('avuiLocal (zona horaria Europe/Madrid)', () => {
	it('en invierno (UTC+1) las 23:30 UTC del 31/12 ya son 1 de enero', () => {
		expect(avuiLocal(new Date('2024-12-31T23:30:00Z'))).toBe('2025-01-01');
		expect(avuiLocal(new Date('2024-12-31T22:59:59Z'))).toBe('2024-12-31');
	});

	it('en verano (UTC+2) el cambio de día es a las 22:00 UTC', () => {
		expect(avuiLocal(new Date('2019-06-30T21:59:59Z'))).toBe('2019-06-30');
		expect(avuiLocal(new Date('2019-06-30T22:00:00Z'))).toBe('2019-07-01');
	});

	it('admite otra zona horaria', () => {
		expect(avuiLocal(new Date('2024-12-31T23:30:00Z'), 'UTC')).toBe('2024-12-31');
		expect(avuiLocal(new Date('2025-01-01T01:00:00Z'), 'America/New_York')).toBe('2024-12-31');
	});

	it('devuelve siempre una fecha ISO válida', () => {
		expect(esDataIsoValida(avuiLocal())).toBe(true);
	});

	it('lanza error con un instante inválido', () => {
		expect(() => avuiLocal(new Date('no-date'))).toThrow(RangeError);
	});
});

describe('validarData', () => {
	it('2006-06-30 es anterior al inicio; 2006-07-01 es válida', () => {
		expect(validarData('2006-06-30', AVUI)).toEqual({ ok: false, error: 'anterior-inici' });
		expect(validarData(DATA_INICI_REPTE, AVUI)).toEqual({ ok: true });
		expect(DATA_INICI_REPTE).toBe('2006-07-01');
	});

	it('hoy es válida; mañana es futura', () => {
		expect(validarData(AVUI, AVUI)).toEqual({ ok: true });
		expect(validarData('2026-09-28', AVUI)).toEqual({ ok: false, error: 'futura' });
		expect(validarData('2027-01-01', '2026-12-31')).toEqual({ ok: false, error: 'futura' });
		expect(validarData('2026-12-31', '2026-12-31')).toEqual({ ok: true });
	});

	it('fecha inexistente o mal formada → format', () => {
		expect(validarData('2023-02-30', AVUI)).toEqual({ ok: false, error: 'format' });
		expect(validarData('2023-2-3', AVUI)).toEqual({ ok: false, error: 'format' });
		expect(validarData('2023-02-03T00:00:00', AVUI)).toEqual({ ok: false, error: 'format' });
		expect(validarData(undefined, AVUI)).toEqual({ ok: false, error: 'format' });
	});

	it('el 29/02 de un año bisiesto es válido', () => {
		expect(validarData('2024-02-29', AVUI)).toEqual({ ok: true });
	});

	it('lanza error si avui no es una fecha válida', () => {
		expect(() => validarData('2020-01-01', '2026-02-30')).toThrow(RangeError);
		expect(() => validarData('2020-01-01', '')).toThrow(RangeError);
	});

	it('avui calculado en Madrid decide si una fecha es futura (cambio de año)', () => {
		const avui = avuiLocal(new Date('2025-12-31T23:30:00Z')); // 2026-01-01 en Madrid
		expect(validarData('2026-01-01', avui)).toEqual({ ok: true });
		const avuiUtc = avuiLocal(new Date('2025-12-31T23:30:00Z'), 'UTC');
		expect(validarData('2026-01-01', avuiUtc)).toEqual({ ok: false, error: 'futura' });
	});
});

describe('validarMetode', () => {
	it.each(['a-peu', 'btt', 'esqui', 'raquetes'])('acepta %s', (m) =>
		expect(validarMetode(m)).toBe(true)
	);
	it.each(['moto', 'cotxe', 'helicopter', 'A-PEU', '', null, undefined, 1])('rechaza %s', (m) =>
		expect(validarMetode(m)).toBe(false)
	);
});

// ---------------------------------------------------------------------------
// Ascensiones válidas y primeras ascensiones
// ---------------------------------------------------------------------------

describe('ascensionsValides', () => {
	it('lista vacía → lista vacía', () => {
		expect(ascensionsValides([], CATALEG, AVUI)).toEqual([]);
	});

	it('descarta tombstones, fechas fuera de rango o inválidas, métodos y cimas desconocidas', () => {
		const bones = [asc(1, '2006-07-01'), asc(2, AVUI, { metode: 'raquetes' })];
		const dolentes = [
			asc(3, '2006-06-30'),
			asc(4, '2026-09-28'),
			asc(5, '2023-02-30'),
			asc(6, '2020-01-01', { deletedAt: '2026-01-02T00:00:00.000Z' }),
			asc(7, '2020-01-01', { metode: 'moto' as never }),
			asc(9999, '2020-01-01')
		];
		expect(ascensionsValides([...dolentes, ...bones], CATALEG, AVUI)).toEqual(bones);
	});

	it('deletedAt null cuenta como no borrada', () => {
		const a = asc(1, '2020-01-01', { deletedAt: null });
		expect(ascensionsValides([a], CATALEG, AVUI)).toEqual([a]);
	});

	it('acepta el catálogo como Map', () => {
		const mapa = new Map(CATALEG.map((c) => [c.id, c]));
		expect(
			ascensionsValides([asc(1, '2020-01-01'), asc(600, '2020-01-01')], mapa, AVUI)
		).toHaveLength(1);
	});

	it('no aplica el límite anual (150 cimas el mismo año siguen siendo válidas)', () => {
		const lista = ESS(150).map((id) => asc(id, '2023-05-01'));
		expect(ascensionsValides(lista, CATALEG, AVUI)).toHaveLength(150);
	});
});

describe('primeresAscensions', () => {
	it('lista vacía → mapa vacío', () => {
		expect(primeresAscensions([]).size).toBe(0);
	});

	it('se queda con la ascensión más antigua de cada cima, sin importar el orden', () => {
		const p = primeresAscensions([
			{ cimId: 1, data: '2022-05-01' },
			{ cimId: 1, data: '2010-01-01' },
			{ cimId: 1, data: '2015-08-15' },
			{ cimId: 2, data: '2020-01-01' }
		]);
		expect(p).toEqual(
			new Map([
				[1, '2010-01-01'],
				[2, '2020-01-01']
			])
		);
	});
});

// ---------------------------------------------------------------------------
// Reto 100 y esenciales
// ---------------------------------------------------------------------------

describe('progres100', () => {
	it('lista vacía', () => {
		const p = progres100([], CATALEG);
		expect(p).toMatchObject({
			objectiu: 100,
			comptador: 0,
			completat: false,
			dataAssoliment: null,
			cimsNormativaAntiga: 0,
			essencialsAssolides: 0,
			totalEssencials: 150
		});
		expect(p.essencialsPendents).toHaveLength(150);
	});

	it('99 esenciales no completan; la 100ª completa en su fecha', () => {
		const lista = ascs(ESS(99), '2020-01-01', 1);
		expect(progres100(lista, CATALEG)).toMatchObject({ comptador: 99, completat: false });
		const amb100 = [...lista, { cimId: 100, data: '2023-06-15' }];
		expect(progres100(amb100, CATALEG)).toMatchObject({
			comptador: 100,
			completat: true,
			dataAssoliment: '2023-06-15',
			essencialsAssolides: 100
		});
	});

	it('100 no esenciales posteriores al 01/07/2019 no cuentan', () => {
		const p = progres100(ascs(NO_ESS(100), '2019-07-01'), CATALEG);
		expect(p.comptador).toBe(0);
		expect(p.completat).toBe(false);
	});

	it('100 no esenciales anteriores al 01/07/2019 completan el reto (normativa antigua)', () => {
		const p = progres100(ascs(NO_ESS(100), '2010-01-01', 10), CATALEG);
		expect(p).toMatchObject({ comptador: 100, completat: true, cimsNormativaAntiga: 100 });
		expect(p.dataAssoliment).toBe(sumarDies('2010-01-01', 990));
		expect(p.essencialsPendents).toHaveLength(150);
	});

	it('día de corte: 2019-06-30 cuenta como antigua y 2019-07-01 no (por defecto)', () => {
		expect(DATA_NORMATIVA_ESSENCIALS).toBe('2019-07-01');
		expect(progres100([{ cimId: 151, data: '2019-06-30' }], CATALEG).comptador).toBe(1);
		expect(progres100([{ cimId: 151, data: '2019-07-01' }], CATALEG).comptador).toBe(0);
	});

	it('opción diaTallEsNormativaAntiga: el 2019-07-01 pasa a ser normativa antigua', () => {
		const o = { diaTallEsNormativaAntiga: true };
		expect(progres100([{ cimId: 151, data: '2019-07-01' }], CATALEG, o).comptador).toBe(1);
		expect(progres100([{ cimId: 151, data: '2019-07-02' }], CATALEG, o).comptador).toBe(0);
	});

	it('mezcla: 60 no esenciales antiguas + 40 esenciales nuevas = 100', () => {
		const lista = [
			...ascs(NO_ESS(60), '2012-01-01', 1),
			...ascs(ESS(40), '2021-01-01', 1),
			...ascs(NO_ESS(50, 300), '2022-01-01') // no suman
		];
		const p = progres100(lista, CATALEG);
		expect(p).toMatchObject({
			comptador: 100,
			completat: true,
			cimsNormativaAntiga: 60,
			dataAssoliment: sumarDies('2021-01-01', 39)
		});
	});

	it('esencial subida antes de 2019 cuenta y deja de estar pendiente', () => {
		const p = progres100([{ cimId: 1, data: '2008-01-01' }], CATALEG);
		expect(p).toMatchObject({ comptador: 1, cimsNormativaAntiga: 1, essencialsAssolides: 1 });
		expect(p.essencialsPendents.map((c) => c.id)).not.toContain(1);
		expect(p.essencialsPendents).toHaveLength(149);
	});

	it('usa la primera ascensión: no esencial subida en 2018 y repetida en 2020 cuenta', () => {
		const p = progres100(
			[
				{ cimId: 200, data: '2020-05-01' },
				{ cimId: 200, data: '2018-05-01' }
			],
			CATALEG
		);
		expect(p.comptador).toBe(1);
	});

	it('repeticiones de la misma cima no suman', () => {
		const lista = Array.from({ length: 150 }, (_, i) => ({
			cimId: 1,
			data: sumarDies('2020-01-01', i)
		}));
		expect(progres100(lista, CATALEG)).toMatchObject({ comptador: 1, completat: false });
	});

	it('las 150 esenciales: comptador 150 y ninguna pendiente', () => {
		const p = progres100(ascs(ESS(150), '2020-01-01', 1), CATALEG);
		expect(p.comptador).toBe(150);
		expect(p.essencialsPendents).toEqual([]);
		expect(p.dataAssoliment).toBe(sumarDies('2020-01-01', 99));
	});

	it('varias cimas el mismo día: la fecha de completado es ese día', () => {
		const p = progres100(ascs(ESS(100), '2023-12-31'), CATALEG);
		expect(p.dataAssoliment).toBe('2023-12-31');
	});

	it('ignora cimas que no están en el catálogo', () => {
		expect(progres100([{ cimId: 9999, data: '2010-01-01' }], CATALEG).comptador).toBe(0);
	});

	it('acepta el catálogo como Map', () => {
		const mapa = new Map(CATALEG.map((c) => [c.id, c]));
		const p = progres100(ascs(ESS(100), '2020-01-01'), mapa);
		expect(p.completat).toBe(true);
		expect(p.essencialsPendents).toHaveLength(50);
	});
});

describe('essencialsPendents', () => {
	it('lista vacía → las 150 en orden de catálogo', () => {
		const p = essencialsPendents([], CATALEG);
		expect(p).toHaveLength(150);
		expect(p[0].id).toBe(1);
		expect(p[149].id).toBe(150);
	});

	it('excluye las subidas en cualquier fecha y no mira las no esenciales', () => {
		const p = essencialsPendents(
			[
				{ cimId: 1, data: '2007-01-01' },
				{ cimId: 2, data: '2024-01-01' },
				{ cimId: 300, data: '2024-01-01' }
			],
			CATALEG
		);
		expect(p).toHaveLength(148);
		expect(p.every((c) => c.essencial)).toBe(true);
	});
});

// ---------------------------------------------------------------------------
// Niveles
// ---------------------------------------------------------------------------

describe('nivell', () => {
	it('lista vacía → nivel 0, faltan 100', () => {
		expect(nivell([], CATALEG)).toEqual({
			nivell: 0,
			comptador: 0,
			seguentObjectiu: 100,
			falten: 100,
			assoliments: []
		});
	});

	it('300 no esenciales posteriores a 2019 sin el 100 → nivel 0', () => {
		const n = nivell(ascs(NO_ESS(300), '2020-01-01', 1), CATALEG);
		expect(n.nivell).toBe(0);
		expect(n.comptador).toBe(300);
		expect(n.falten).toBe(100); // faltan 100 que cuenten para el 100
	});

	it('99 esenciales + 200 no esenciales → nivel 0, falta 1', () => {
		const n = nivell([...ascs(ESS(99), '2020-01-01'), ...ascs(NO_ESS(200), '2020-01-01')], CATALEG);
		expect(n).toMatchObject({ nivell: 0, falten: 1 });
	});

	it('100 esenciales → nivel 1, siguiente 200', () => {
		const n = nivell(ascs(ESS(100), '2020-01-01', 1), CATALEG);
		expect(n).toMatchObject({ nivell: 1, comptador: 100, seguentObjectiu: 200, falten: 100 });
		expect(n.assoliments).toEqual([{ nivell: 1, data: sumarDies('2020-01-01', 99) }]);
	});

	it('100 esenciales + 99 no esenciales → nivel 1; +1 → nivel 2', () => {
		const base = [...ascs(ESS(100), '2020-01-01'), ...ascs(NO_ESS(99), '2021-01-01')];
		expect(nivell(base, CATALEG)).toMatchObject({ nivell: 1, comptador: 199, falten: 1 });
		const mes = [...base, { cimId: 400, data: '2022-03-03' }];
		const n = nivell(mes, CATALEG);
		expect(n).toMatchObject({ nivell: 2, comptador: 200, seguentObjectiu: 300, falten: 100 });
		expect(n.assoliments[1]).toEqual({ nivell: 2, data: '2022-03-03' });
	});

	it('por defecto las no esenciales anteriores a completar el 100 cuentan (retroactivas)', () => {
		// 100 no esenciales en 2020 y luego 100 esenciales en 2022.
		const lista = [...ascs(NO_ESS(100), '2020-01-01'), ...ascs(ESS(100), '2022-01-01', 1)];
		const completat = sumarDies('2022-01-01', 99);
		const n = nivell(lista, CATALEG);
		expect(n).toMatchObject({ nivell: 2, comptador: 200 });
		// Los dos sellos se consiguen el mismo día en que se completa el 100.
		expect(n.assoliments).toEqual([
			{ nivell: 1, data: completat },
			{ nivell: 2, data: completat }
		]);
	});

	it('opción noEssencialsRetroactives=false: solo cuentan las no esenciales posteriores al 100', () => {
		const o = { noEssencialsRetroactives: false };
		const completat = sumarDies('2022-01-01', 99);
		const abans = [...ascs(NO_ESS(100), '2020-01-01'), ...ascs(ESS(100), '2022-01-01', 1)];
		expect(nivell(abans, CATALEG, o)).toMatchObject({ nivell: 1, comptador: 100 });

		// El mismo día de completar no cuenta (orden desconocido); el día siguiente sí.
		const mateixDia = [...abans, { cimId: 400, data: completat }];
		expect(nivell(mateixDia, CATALEG, o).comptador).toBe(100);

		// Repetir después del 100 una no esencial subida antes sí la hace contar.
		const repeticions = [...abans, ...ascs(NO_ESS(100), sumarDies(completat, 1))];
		const n = nivell(repeticions, CATALEG, o);
		expect(n).toMatchObject({ nivell: 2, comptador: 200 });
		expect(n.assoliments[1].data).toBe(sumarDies(completat, 1));
	});

	it('noEssencialsRetroactives=false no afecta a las no esenciales antiguas', () => {
		// 60 antiguas + 30 no esenciales nuevas (antes del 100) + 40 esenciales → 100 en 2021.
		const lista = [
			...ascs(NO_ESS(60), '2012-01-01'),
			...ascs(NO_ESS(30, 300), '2020-01-01'),
			...ascs(ESS(40), '2021-01-01')
		];
		expect(nivell(lista, CATALEG, { noEssencialsRetroactives: false })).toMatchObject({
			nivell: 1,
			comptador: 100
		});
		expect(nivell(lista, CATALEG)).toMatchObject({ nivell: 1, comptador: 130 });
	});

	it('completado con normativa antigua: las no esenciales posteriores cuentan en ambas lecturas', () => {
		const lista = [...ascs(NO_ESS(150), '2010-01-01'), ...ascs(NO_ESS(50, 400), '2021-01-01')];
		expect(nivell(lista, CATALEG, { noEssencialsRetroactives: false })).toMatchObject({
			nivell: 2,
			comptador: 200
		});
		expect(nivell(lista, CATALEG)).toMatchObject({ nivell: 2, comptador: 200 });
	});

	it('100 esenciales repetidas dos veces → nivel 1 (cimas distintas por defecto)', () => {
		const lista = [...ascs(ESS(100), '2020-01-01'), ...ascs(ESS(100), '2021-01-01')];
		expect(nivell(lista, CATALEG)).toMatchObject({ nivell: 1, comptador: 100 });
	});

	it('opción comptarRepeticions: las repeticiones suman para 2×100', () => {
		const lista = [...ascs(ESS(100), '2020-01-01'), ...ascs(ESS(100), '2021-01-01')];
		const n = nivell(lista, CATALEG, { comptarRepeticions: true });
		expect(n).toMatchObject({ nivell: 2, comptador: 200 });
		expect(n.assoliments[1].data).toBe('2021-01-01');
		// El 100 sigue exigiendo cimas distintas.
		const repetides = ascs(Array(200).fill(1), '2020-01-01', 1);
		expect(nivell(repetides, CATALEG, { comptarRepeticions: true }).nivell).toBe(0);
	});

	it('500 cimas distintas → 5×100; 522 → sigue en 5, sin siguiente objetivo', () => {
		const cinc = nivell(
			[...ascs(ESS(150), '2020-01-01', 1), ...ascs(NO_ESS(350), '2021-01-01', 1)],
			CATALEG
		);
		expect(cinc).toMatchObject({ nivell: 5, comptador: 500, seguentObjectiu: null, falten: null });
		expect(cinc.assoliments.map((a) => a.nivell)).toEqual([1, 2, 3, 4, 5]);
		expect(cinc.assoliments[4].data).toBe(sumarDies('2021-01-01', 349));

		const totes = nivell(
			ascs(
				CATALEG.map((c) => c.id),
				'2021-01-01'
			),
			CATALEG
		);
		expect(totes).toMatchObject({ nivell: 5, comptador: 522, seguentObjectiu: null });
	});

	it('499 cimas distintas → 4×100, falta 1', () => {
		const n = nivell(
			[...ascs(ESS(150), '2020-01-01'), ...ascs(NO_ESS(349), '2021-01-01')],
			CATALEG
		);
		expect(n).toMatchObject({ nivell: 4, falten: 1, seguentObjectiu: 500 });
	});

	it('las fechas de los sellos son crecientes', () => {
		const n = nivell(
			ascs(
				CATALEG.map((c) => c.id),
				'2019-07-01',
				3
			),
			CATALEG
		);
		const dates = n.assoliments.map((a) => a.data);
		expect(dates).toEqual([...dates].sort());
	});
});

// ---------------------------------------------------------------------------
// Límite anual
// ---------------------------------------------------------------------------

describe('excesAnual', () => {
	it('lista vacía → sin avisos', () => {
		expect(excesAnual([])).toEqual([]);
		expect(cimsNovesPerAny([]).size).toBe(0);
	});

	it('100 cimas nuevas en un año → sin aviso; 101 → aviso con exceso 1', () => {
		expect(excesAnual(ascs(ESS(100), '2023-01-01', 3))).toEqual([]);
		expect(excesAnual(ascs(ESS(101), '2023-01-01', 3))).toEqual([
			{ any: 2023, cimsNoves: 101, exces: 1 }
		]);
	});

	it('cambio de año: 100 el 31/12 y 100 el 01/01 → sin aviso', () => {
		const lista = [...ascs(ESS(100), '2023-12-31'), ...ascs(NO_ESS(100), '2024-01-01')];
		expect(excesAnual(lista)).toEqual([]);
		expect(cimsNovesPerAny(lista)).toEqual(
			new Map([
				[2023, 100],
				[2024, 100]
			])
		);
	});

	it('101 el 31/12 → aviso solo para ese año', () => {
		const lista = [...ascs(ESS(101), '2023-12-31'), ...ascs(NO_ESS(10), '2024-01-01')];
		expect(excesAnual(lista)).toEqual([{ any: 2023, cimsNoves: 101, exces: 1 }]);
	});

	it('las repeticiones no son cimas nuevas (ni en el mismo año ni en otro)', () => {
		const lista = [
			...ascs(ESS(100), '2022-06-01'),
			...ascs(ESS(100), '2023-06-01'), // repetidas en 2023
			...ascs(ESS(50, 101), '2023-06-02'),
			...ascs(ESS(50, 101), '2023-07-02') // repetidas en el mismo año
		];
		expect(cimsNovesPerAny(lista)).toEqual(
			new Map([
				[2022, 100],
				[2023, 50]
			])
		);
		expect(excesAnual(lista)).toEqual([]);
	});

	it('ordena por año y admite un límite configurable', () => {
		const lista = [...ascs(ESS(20), '2024-03-01'), ...ascs(NO_ESS(15), '2010-03-01')];
		expect(excesAnual(lista, { limitAnual: 10 })).toEqual([
			{ any: 2010, cimsNoves: 15, exces: 5 },
			{ any: 2024, cimsNoves: 20, exces: 10 }
		]);
		expect(OPCIONS_PER_DEFECTE.limitAnual).toBe(100);
	});
});

// ---------------------------------------------------------------------------
// Reto infantil
// ---------------------------------------------------------------------------

describe('progresInfantil', () => {
	it('lista vacía', () => {
		expect(progresInfantil([], CATALEG)).toEqual({
			objectiu: 50,
			comptador: 0,
			completat: false,
			dataAssoliment: null
		});
	});

	it('50 cimas cualesquiera (no esenciales, recientes, mismo año) completan', () => {
		expect(progresInfantil(ascs(NO_ESS(49), '2026-07-01'), CATALEG).completat).toBe(false);
		const p = progresInfantil(ascs(NO_ESS(50), '2026-07-01', 1), CATALEG);
		expect(p).toMatchObject({ comptador: 50, completat: true });
		expect(p.dataAssoliment).toBe(sumarDies('2026-07-01', 49));
	});

	it('solo cimas distintas', () => {
		expect(progresInfantil(ascs(Array(60).fill(200), '2020-01-01', 1), CATALEG).comptador).toBe(1);
	});

	it('opción dataIniciInfantil: excluye ascensiones anteriores', () => {
		const lista = [...ascs(NO_ESS(30), '2025-01-01'), ...ascs(NO_ESS(30, 300), '2026-07-01')];
		expect(progresInfantil(lista, CATALEG).comptador).toBe(60);
		expect(progresInfantil(lista, CATALEG, { dataIniciInfantil: '2026-07-01' }).comptador).toBe(30);
		// Una cima repetida después de la fecha de inicio sí cuenta.
		const rep = [...lista, { cimId: 151, data: '2026-08-01' }];
		expect(progresInfantil(rep, CATALEG, { dataIniciInfantil: '2026-07-01' }).comptador).toBe(31);
	});
});

// ---------------------------------------------------------------------------
// Progreso por comarca
// ---------------------------------------------------------------------------

describe('progresPerZona', () => {
	const petit: Cim[] = [
		cim(1, { comarca: 'bergueda', essencial: true }),
		cim(2, { comarca: 'bergueda' }),
		cim(3, { comarca: 'cerdanya', essencial: true }),
		cim(4, { comarca: 'andorra', zona: 'andorra' }),
		cim(5, { comarca: 'bergueda' })
	];

	it('lista vacía → totales con 0 hechas, en orden de catálogo', () => {
		expect(progresPerZona([], petit)).toEqual([
			{
				comarca: 'bergueda',
				total: 3,
				fetes: 0,
				totalEssencials: 1,
				essencialsFetes: 0,
				fraccio: 0,
				completa: false
			},
			{
				comarca: 'cerdanya',
				total: 1,
				fetes: 0,
				totalEssencials: 1,
				essencialsFetes: 0,
				fraccio: 0,
				completa: false
			},
			{
				comarca: 'andorra',
				total: 1,
				fetes: 0,
				totalEssencials: 0,
				essencialsFetes: 0,
				fraccio: 0,
				completa: false
			}
		]);
	});

	it('cuenta cimas distintas, esenciales y comarcas completas', () => {
		const r = progresPerZona(
			[
				{ cimId: 1, data: '2020-01-01' },
				{ cimId: 1, data: '2021-01-01' },
				{ cimId: 2, data: '2022-01-01' },
				{ cimId: 3, data: '2010-01-01' },
				{ cimId: 9999, data: '2010-01-01' }
			],
			petit
		);
		const perId = Object.fromEntries(r.map((z) => [z.comarca, z]));
		expect(perId.bergueda).toMatchObject({ fetes: 2, essencialsFetes: 1, completa: false });
		expect(perId.bergueda.fraccio).toBeCloseTo(2 / 3);
		expect(perId.cerdanya).toMatchObject({ fetes: 1, fraccio: 1, completa: true });
		expect(perId.andorra).toMatchObject({ fetes: 0, fraccio: 0 });
	});

	it('catálogo completo: suma de totales = 522', () => {
		const r = progresPerZona([], CATALEG);
		expect(r.reduce((s, z) => s + z.total, 0)).toBe(522);
		expect(r.reduce((s, z) => s + z.totalEssencials, 0)).toBe(150);
	});
});

// ---------------------------------------------------------------------------
// Restricciones
// ---------------------------------------------------------------------------

describe('restriccioActiva', () => {
	it('periodo anual sin cruzar el año (La Picossa: 01-15..06-15), inclusivo', () => {
		const r = restriccio({ periodeIniciMmdd: '01-15', periodeFiMmdd: '06-15' });
		expect(restriccioActiva(r, '2024-01-14')).toBe(false);
		expect(restriccioActiva(r, '2024-01-15')).toBe(true);
		expect(restriccioActiva(r, '2024-06-15')).toBe(true);
		expect(restriccioActiva(r, '2024-06-16')).toBe(false);
	});

	it('periodo que cruza el cambio de año (Roc Roi: 12-01..06-01)', () => {
		const r = restriccio({ periodeIniciMmdd: '12-01', periodeFiMmdd: '06-01' });
		expect(restriccioActiva(r, '2024-11-30')).toBe(false);
		expect(restriccioActiva(r, '2024-12-01')).toBe(true);
		expect(restriccioActiva(r, '2024-12-31')).toBe(true);
		expect(restriccioActiva(r, '2025-01-01')).toBe(true);
		expect(restriccioActiva(r, '2025-06-01')).toBe(true);
		expect(restriccioActiva(r, '2025-06-02')).toBe(false);
	});

	it('rango puntual de fechas (obras), con extremos abiertos', () => {
		const r = restriccio({ tipus: 'obres', dataInici: '2025-03-01', dataFi: '2025-10-31' });
		expect(restriccioActiva(r, '2025-02-28')).toBe(false);
		expect(restriccioActiva(r, '2025-03-01')).toBe(true);
		expect(restriccioActiva(r, '2025-10-31')).toBe(true);
		expect(restriccioActiva(r, '2025-11-01')).toBe(false);
		expect(restriccioActiva(restriccio({ dataInici: '2025-03-01' }), '2030-01-01')).toBe(true);
		expect(restriccioActiva(restriccio({ dataFi: '2025-03-01' }), '2025-03-02')).toBe(false);
	});

	it('periodo y rango a la vez: deben cumplirse ambos', () => {
		const r = restriccio({
			periodeIniciMmdd: '01-15',
			periodeFiMmdd: '06-15',
			dataInici: '2025-01-01',
			dataFi: null
		});
		expect(restriccioActiva(r, '2024-02-01')).toBe(false);
		expect(restriccioActiva(r, '2025-02-01')).toBe(true);
	});

	it('permanente, no vigente y fecha inválida', () => {
		expect(restriccioActiva(restriccio({ tipus: 'militar' }), '2024-05-05')).toBe(true);
		expect(restriccioActiva(restriccio({ vigent: false }), '2024-05-05')).toBe(false);
		expect(restriccioActiva(restriccio(), '2023-02-30')).toBe(false);
	});

	it('restriccionsActives filtra las de una cima', () => {
		const c = cim(1, {
			restriccions: [
				restriccio({ periodeIniciMmdd: '01-15', periodeFiMmdd: '06-15' }),
				restriccio({ tipus: 'obres', dataInici: '2020-01-01', dataFi: '2020-12-31' })
			]
		});
		expect(restriccionsActives(c, '2024-03-01')).toHaveLength(1);
		expect(restriccionsActives(c, '2020-03-01')).toHaveLength(2);
		expect(restriccionsActives(c, '2024-09-01')).toEqual([]);
	});
});

// ---------------------------------------------------------------------------
// Resumen completo
// ---------------------------------------------------------------------------

describe('calcularEstatRepte', () => {
	it('lista vacía', () => {
		const e = calcularEstatRepte([], CATALEG, AVUI);
		expect(e.valides).toEqual([]);
		expect(e.progres100.completat).toBe(false);
		expect(e.nivell.nivell).toBe(0);
		expect(e.excesAnual).toEqual([]);
		expect(e.infantil.comptador).toBe(0);
		expect(e.perZona).toHaveLength(5);
	});

	it('filtra futuras, borradas e inválidas antes de calcular', () => {
		const bones = ESS(100).map((id) => asc(id, sumarDies('2020-01-01', id)));
		const dolentes = [
			asc(101, '2026-09-28'),
			asc(102, '2023-02-30'),
			asc(103, '2006-06-30'),
			asc(104, '2021-01-01', { deletedAt: '2026-01-01T00:00:00.000Z' })
		];
		const e = calcularEstatRepte([...dolentes, ...bones], CATALEG, AVUI);
		expect(e.valides).toHaveLength(100);
		expect(e.progres100).toMatchObject({ comptador: 100, completat: true });
		expect(e.nivell.nivell).toBe(1);
		expect(e.infantil.completat).toBe(true);
		expect(e.primeres.size).toBe(100);
	});

	it('propaga las opciones', () => {
		const lista = [
			...ESS(100).map((id) => asc(id, '2020-01-01')),
			...ESS(100).map((id) => asc(id, '2021-01-01', { id: `rep-${id}` }))
		];
		expect(calcularEstatRepte(lista, CATALEG, AVUI).nivell.nivell).toBe(1);
		expect(
			calcularEstatRepte(lista, CATALEG, AVUI, { comptarRepeticions: true }).nivell.nivell
		).toBe(2);
	});
});
