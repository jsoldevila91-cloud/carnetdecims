import { describe, expect, it } from 'vitest';
import {
	CRITERIS_LLISTATS_DIFICULTAT,
	ESCALA_DIFICULTAT,
	FILTRES_LLISTATS_DIFICULTAT,
	clauDificultat,
	dificultatOrientativa,
	esRutaAmbNens,
	esRutaFacil,
	nivellAltitud,
	nivellEsforc,
	rutaAmbNens,
	type EntradaDificultat,
	type RutaAmbDificultat,
	type Tecnicitat
} from './dificultat';

const ambDificultat = (ruta: EntradaDificultat, id?: string): RutaAmbDificultat => ({
	...(id !== undefined && { id }),
	ruta,
	dificultat: dificultatOrientativa(ruta)
});

describe('ESCALA_DIFICULTAT', () => {
	it('4 nivells amb claus i llindars creixents', () => {
		expect(ESCALA_DIFICULTAT.nivells.map((n) => n.clau)).toEqual([
			'facil',
			'moderada',
			'exigent',
			'molt-exigent'
		]);
		expect(ESCALA_DIFICULTAT.esforc.llindarsKmEsforc).toEqual([7, 15, 22]);
		expect(ESCALA_DIFICULTAT.altitud.llindarsM).toEqual([2500, 3000]);
		expect(ESCALA_DIFICULTAT.tecnica).toEqual({
			cap: 1,
			'terreny-irregular': 2,
			'grimpada-facil': 2,
			grimpada: 3,
			'via-equipada': 4
		});
		for (const n of ESCALA_DIFICULTAT.nivells) expect(clauDificultat(n.nivell)).toBe(n.clau);
	});

	it('és immutable', () => {
		expect(Object.isFrozen(ESCALA_DIFICULTAT)).toBe(true);
		expect(Object.isFrozen(ESCALA_DIFICULTAT.esforc.llindarsKmEsforc)).toBe(true);
		expect(Object.isFrozen(ESCALA_DIFICULTAT.tecnica)).toBe(true);
	});
});

describe('nivellEsforc i nivellAltitud (límits inclosos)', () => {
	it.each([
		[0, 1],
		[7, 1],
		[7.01, 2],
		[15, 2],
		[15.01, 3],
		[22, 3],
		[22.01, 4],
		[60, 4]
	])('%s km-esforç → %s', (km, nivell) => expect(nivellEsforc(km)).toBe(nivell));

	it.each([
		[1056, 1],
		[2499, 1],
		[2500, 2],
		[2999, 2],
		[3000, 3],
		[3143, 3]
	])('%s m → %s', (alt, nivell) => expect(nivellAltitud(alt)).toBe(nivell));

	it('altitud no vàlida → undefined', () => {
		for (const a of [0, -5, Number.NaN, Number.POSITIVE_INFINITY])
			expect(nivellAltitud(a)).toBeUndefined();
	});
});

describe('dificultatOrientativa: esforç', () => {
	it('desnivell + distància: km-esforç = km + m/100 (prioritat sobre el temps)', () => {
		const d = dificultatOrientativa({
			desnivellPositiuM: 555,
			distanciaKm: 3.6,
			tempsMinuts: 75,
			altitudCim: 1697,
			tecnicitat: 'cap'
		})!;
		expect(d.kmEsforc).toBe(9.2);
		expect(d.baseEsforc).toBe('desnivell-distancia');
		expect(d.factors).toEqual({ esforc: 2, tecnica: 1, altitud: 1 });
		expect(d).toMatchObject({ nivell: 2, clau: 'moderada', aproximada: false, dadesQueFalten: [] });
	});

	it('el temps no cal si hi ha desnivell + distància', () => {
		const d = dificultatOrientativa({
			desnivellPositiuM: 300,
			distanciaKm: 2,
			altitudCim: 900,
			tecnicitat: 'cap'
		})!;
		expect(d.aproximada).toBe(false);
		expect(d.dadesQueFalten).toEqual([]);
		expect(d.kmEsforc).toBe(5);
	});

	it('només temps: km-esforç = minuts / 15', () => {
		const d = dificultatOrientativa({ tempsMinuts: 240, altitudCim: 1500, tecnicitat: 'cap' })!;
		expect(d.kmEsforc).toBe(16);
		expect(d.baseEsforc).toBe('temps');
		expect(d.factors.esforc).toBe(3);
		expect(d.aproximada).toBe(true);
		expect(d.dadesQueFalten).toEqual(['desnivell', 'distancia']);
	});

	it('desnivell + temps sense distància: mana el temps', () => {
		const d = dificultatOrientativa({
			desnivellPositiuM: 1096,
			tempsMinuts: 240,
			altitudCim: 2784
		})!;
		expect(d.baseEsforc).toBe('temps');
		expect(d.dadesQueFalten).toEqual(['distancia', 'tecnicitat']);
	});

	it('només desnivell: km-esforç = m/100 × 1,4', () => {
		const d = dificultatOrientativa({ desnivellPositiuM: 500, altitudCim: 1000 })!;
		expect(d.kmEsforc).toBe(7);
		expect(d.baseEsforc).toBe('desnivell');
		expect(d.factors).toEqual({ esforc: 1, altitud: 1 });
		expect(d.dadesQueFalten).toEqual(['distancia', 'temps', 'tecnicitat']);
	});

	it('la distància sola no basta per a l’esforç', () => {
		expect(dificultatOrientativa({ distanciaKm: 10, altitudCim: 1500 })).toBeNull();
		const d = dificultatOrientativa({ distanciaKm: 10, altitudCim: 1500, tecnicitat: 'cap' })!;
		expect(d.factors.esforc).toBeUndefined();
		expect(d.kmEsforc).toBeUndefined();
		expect(d.baseEsforc).toBeUndefined();
		expect(d.dadesQueFalten).toEqual(['desnivell', 'temps']);
	});

	it('desnivell 0 amb distància és vàlid (ruta planera)', () => {
		const d = dificultatOrientativa({ desnivellPositiuM: 0, distanciaKm: 3, altitudCim: 800 })!;
		expect(d.kmEsforc).toBe(3);
		expect(d.nivell).toBe(1);
	});

	it('valors no vàlids (negatius, NaN, ∞, 0 en distància o temps) es tracten com a absents', () => {
		for (const dolent of [-1, Number.NaN, Number.POSITIVE_INFINITY]) {
			expect(
				dificultatOrientativa({
					desnivellPositiuM: dolent,
					distanciaKm: dolent,
					tempsMinuts: dolent,
					altitudCim: 2000
				})
			).toBeNull();
		}
		expect(dificultatOrientativa({ distanciaKm: 0, tempsMinuts: 0, altitudCim: 2000 })).toBeNull();
		// Desnivell 0 sense distància ni temps: no hi ha esforç
		expect(dificultatOrientativa({ desnivellPositiuM: 0, altitudCim: 2000 })).toBeNull();
	});
});

describe('dificultatOrientativa: tècnica, altitud i combinació', () => {
	it.each<[Tecnicitat, number]>([
		['cap', 1],
		['terreny-irregular', 2],
		['grimpada-facil', 2],
		['grimpada', 3],
		['via-equipada', 4]
	])('només tecnicitat %s → nivell %s (aproximada)', (tecnicitat, nivell) => {
		const d = dificultatOrientativa({ altitudCim: 1200, tecnicitat })!;
		expect(d.nivell).toBe(nivell);
		expect(d.factors).toEqual({ tecnica: nivell, altitud: 1 });
		expect(d.aproximada).toBe(true);
		expect(d.dadesQueFalten).toEqual(['desnivell', 'distancia', 'temps']);
	});

	it('tecnicitat desconeguda (dada corrupta) s’ignora', () => {
		expect(
			dificultatOrientativa({ altitudCim: 1200, tecnicitat: 'escalada' as Tecnicitat })
		).toBeNull();
	});

	it('sense esforç ni tècnica → null, encara que el cim sigui alt', () => {
		expect(dificultatOrientativa({ altitudCim: 3143 })).toBeNull();
	});

	it('el nivell és el factor més alt: la tècnica no es compensa amb poc esforç', () => {
		const d = dificultatOrientativa({
			desnivellPositiuM: 200,
			distanciaKm: 1,
			altitudCim: 900,
			tecnicitat: 'via-equipada'
		})!;
		expect(d.factors).toEqual({ esforc: 1, tecnica: 4, altitud: 1 });
		expect(d.clau).toBe('molt-exigent');
	});

	it('l’altitud fa de mínim (≥ 2.500 m → moderada; ≥ 3.000 m → exigent)', () => {
		const curta = { desnivellPositiuM: 300, distanciaKm: 2, tecnicitat: 'cap' as const };
		expect(dificultatOrientativa({ ...curta, altitudCim: 2499 })!.nivell).toBe(1);
		expect(dificultatOrientativa({ ...curta, altitudCim: 2500 })!.nivell).toBe(2);
		expect(dificultatOrientativa({ ...curta, altitudCim: 3000 })!.nivell).toBe(3);
	});

	it('altitud no vàlida: sense factor d’altitud però amb resultat', () => {
		const d = dificultatOrientativa({
			tempsMinuts: 60,
			altitudCim: Number.NaN,
			tecnicitat: 'cap'
		})!;
		expect(d.factors).toEqual({ esforc: 1, tecnica: 1 });
		expect(d.nivell).toBe(1);
	});

	it('esforç molt llarg → molt exigent', () => {
		const d = dificultatOrientativa({
			desnivellPositiuM: 1600,
			distanciaKm: 12,
			altitudCim: 2900,
			tecnicitat: 'terreny-irregular'
		})!;
		expect(d.kmEsforc).toBe(28);
		expect(d.clau).toBe('molt-exigent');
	});

	it('no modifica l’entrada', () => {
		const e = Object.freeze({ desnivellPositiuM: 500, distanciaKm: 4, altitudCim: 1500 });
		expect(() => dificultatOrientativa(e)).not.toThrow();
	});
});

/**
 * Calibratge amb la ruta normal de les 10 fitxes pilot (dades de `src/lib/content/fitxes/*.ts`
 * a la fase 6a-bis, altitud del catàleg). Si les dades de les fitxes canvien, aquesta taula no
 * canvia: valida la fórmula, no el contingut (el test d'integració és a `content/fitxes`).
 */
describe('calibratge: 10 fitxes pilot (ruta normal)', () => {
	const PILOTS: [string, EntradaDificultat, string, number | undefined][] = [
		// cim, entrada, clau esperada, km-esforç
		['Montcau', { altitudCim: 1056, tecnicitat: 'terreny-irregular' }, 'moderada', undefined],
		['La Mola', { desnivellPositiuM: 481, altitudCim: 1102, tecnicitat: 'cap' }, 'facil', 6.7],
		[
			'Matagalls',
			{
				desnivellPositiuM: 555,
				distanciaKm: 3.6,
				tempsMinuts: 75,
				altitudCim: 1697,
				tecnicitat: 'terreny-irregular'
			},
			'moderada',
			9.2
		],
		['Sant Jeroni', { tempsMinuts: 155, altitudCim: 1236, tecnicitat: 'cap' }, 'moderada', 10.3],
		['Taga', { desnivellPositiuM: 893, altitudCim: 2040, tecnicitat: 'cap' }, 'moderada', 12.5],
		[
			'Puigmal',
			{ desnivellPositiuM: 928, distanciaKm: 4.7, altitudCim: 2910, tecnicitat: 'cap' },
			'moderada',
			14
		],
		[
			'Canigó',
			{ desnivellPositiuM: 1096, tempsMinuts: 240, altitudCim: 2784, tecnicitat: 'grimpada' },
			'exigent',
			16
		],
		[
			'Pedraforca (Gósol)',
			{
				desnivellPositiuM: 1100,
				distanciaKm: 4.2,
				tempsMinuts: 210,
				altitudCim: 2506,
				tecnicitat: 'grimpada-facil'
			},
			'exigent',
			15.2
		],
		[
			'Comapedrosa',
			{
				desnivellPositiuM: 1327,
				distanciaKm: 6,
				tempsMinuts: 240,
				altitudCim: 2942,
				tecnicitat: 'grimpada-facil'
			},
			'exigent',
			19.3
		],
		[
			'Pica d’Estats',
			{
				desnivellPositiuM: 1338,
				distanciaKm: 10.2,
				tempsMinuts: 315,
				altitudCim: 3143,
				tecnicitat: 'grimpada-facil'
			},
			'molt-exigent',
			23.6
		]
	];

	it.each(PILOTS)('%s', (_nom, entrada, clau, kmEsforc) => {
		const d = dificultatOrientativa(entrada)!;
		expect(d.clau).toBe(clau);
		expect(d.kmEsforc).toBe(kmEsforc);
	});

	it('Pedraforca pel Verdet (grimpada, sense dades d’esforç) és exigent', () => {
		expect(dificultatOrientativa({ altitudCim: 2506, tecnicitat: 'grimpada' })!.clau).toBe(
			'exigent'
		);
	});

	it('la Pica d’Estats només amb el temps (5 h 15) seria exigent i aproximada', () => {
		const d = dificultatOrientativa({
			tempsMinuts: 315,
			altitudCim: 3143,
			tecnicitat: 'grimpada-facil'
		})!;
		expect(d).toMatchObject({ clau: 'exigent', kmEsforc: 21, aproximada: true });
	});
});

describe('criteris dels llistats de dificultat', () => {
	const facil: EntradaDificultat = {
		desnivellPositiuM: 400,
		distanciaKm: 2.5,
		tempsMinuts: 70,
		altitudCim: 1100,
		tecnicitat: 'cap'
	};

	it('constants documentades', () => {
		expect(CRITERIS_LLISTATS_DIFICULTAT['cims-facils'].nivellMax).toBe(1);
		expect(CRITERIS_LLISTATS_DIFICULTAT['cims-amb-nens']).toEqual({
			nivellMax: 2,
			tecnicitats: ['cap', 'terreny-irregular'],
			desnivellMaxM: 600,
			tempsMaxMinuts: 150,
			dadesObligatories: ['desnivell', 'temps', 'tecnicitat'],
			qualsevolRuta: true
		});
		expect(Object.isFrozen(CRITERIS_LLISTATS_DIFICULTAT['cims-amb-nens'])).toBe(true);
	});

	it('cal esforç i tecnicitat (sense una de les dues, cap llistat)', () => {
		expect(esRutaFacil(undefined)).toBe(false);
		expect(esRutaAmbNens(undefined)).toBe(false);
		const senseTecnica = ambDificultat({ ...facil, tecnicitat: undefined });
		expect(senseTecnica.dificultat!.nivell).toBe(1);
		expect(esRutaFacil(senseTecnica)).toBe(false);
		expect(esRutaAmbNens(senseTecnica)).toBe(false);
		const senseEsforc = ambDificultat({ altitudCim: 900, tecnicitat: 'cap' });
		expect(senseEsforc.dificultat!.nivell).toBe(1);
		expect(esRutaFacil(senseEsforc)).toBe(false);
		expect(esRutaAmbNens(senseEsforc)).toBe(false);
		expect(esRutaFacil({ ruta: facil, dificultat: null })).toBe(false);
		expect(esRutaAmbNens({ ruta: facil, dificultat: null })).toBe(false);
	});

	it('cims-facils: només nivell 1 (sense exigir temps ni desnivell)', () => {
		expect(esRutaFacil(ambDificultat(facil))).toBe(true);
		expect(esRutaFacil(ambDificultat({ ...facil, tempsMinuts: undefined }))).toBe(true);
		expect(
			esRutaFacil(ambDificultat({ desnivellPositiuM: 481, altitudCim: 1103, tecnicitat: 'cap' }))
		).toBe(true);
		expect(esRutaFacil(ambDificultat({ ...facil, tecnicitat: 'terreny-irregular' }))).toBe(false);
		expect(esRutaFacil(ambDificultat({ ...facil, altitudCim: 2600 }))).toBe(false);
	});

	it('cims-amb-nens: nivell ≤ 2 i sense grimpades', () => {
		expect(esRutaAmbNens(ambDificultat(facil))).toBe(true);
		expect(esRutaAmbNens(ambDificultat({ ...facil, tecnicitat: 'terreny-irregular' }))).toBe(true);
		for (const t of ['grimpada-facil', 'grimpada', 'via-equipada'] as const)
			expect(esRutaAmbNens(ambDificultat({ ...facil, tecnicitat: t }))).toBe(false);
		// ≥ 3.000 m → exigent per altitud
		expect(esRutaAmbNens(ambDificultat({ ...facil, altitudCim: 3000 }))).toBe(false);
	});

	it('cims-amb-nens: desnivell ≤ 600 m i temps ≤ 2 h 30 (límits inclosos)', () => {
		expect(esRutaAmbNens(ambDificultat({ ...facil, desnivellPositiuM: 600 }))).toBe(true);
		expect(esRutaAmbNens(ambDificultat({ ...facil, desnivellPositiuM: 601 }))).toBe(false);
		expect(esRutaAmbNens(ambDificultat({ ...facil, tempsMinuts: 150 }))).toBe(true);
		expect(esRutaAmbNens(ambDificultat({ ...facil, tempsMinuts: 151 }))).toBe(false);
		// Ruta planera: desnivell 0 amb font és vàlid
		expect(esRutaAmbNens(ambDificultat({ ...facil, desnivellPositiuM: 0 }))).toBe(true);
	});

	it('cims-amb-nens: sense desnivell, temps o tecnicitat amb font → fora (encara que sigui fàcil)', () => {
		// Cas Casamanya: tècnica i temps dins dels límits, però sense desnivell amb font
		const senseDesnivell = ambDificultat({ ...facil, desnivellPositiuM: undefined });
		expect(senseDesnivell.dificultat!.nivell).toBe(1);
		expect(esRutaAmbNens(senseDesnivell)).toBe(false);
		const senseTemps = ambDificultat({ ...facil, tempsMinuts: undefined });
		expect(esRutaFacil(senseTemps)).toBe(true);
		expect(esRutaAmbNens(senseTemps)).toBe(false);
		expect(esRutaAmbNens(ambDificultat({ ...facil, tecnicitat: undefined }))).toBe(false);
		// Valors no vàlids compten com a absents
		for (const dolent of [-1, Number.NaN])
			expect(esRutaAmbNens(ambDificultat({ ...facil, desnivellPositiuM: dolent }))).toBe(false);
		expect(esRutaAmbNens(ambDificultat({ ...facil, tempsMinuts: 0 }))).toBe(false);
	});

	it('rutaAmbNens: la més fàcil de les rutes que compleixen (no cal que sigui la normal)', () => {
		const normal = ambDificultat(
			{ ...facil, desnivellPositiuM: 760, tempsMinuts: 140, tecnicitat: 'cap' },
			'normal'
		);
		const familiar = ambDificultat({ ...facil, tecnicitat: 'terreny-irregular' }, 'familiar');
		const mesCurta = ambDificultat(
			{ ...facil, desnivellPositiuM: 200, distanciaKm: 1.5, tempsMinuts: 45 },
			'curta'
		);
		expect(rutaAmbNens([])).toBeUndefined();
		expect(rutaAmbNens([normal, undefined])).toBeUndefined();
		expect(rutaAmbNens([normal, familiar])?.id).toBe('familiar');
		// Nivell 1 guanya a nivell 2; a igual nivell, menys km-esforç
		const nivell1 = ambDificultat({ ...facil }, 'n1');
		expect(rutaAmbNens([familiar, nivell1])?.id).toBe('n1');
		expect(rutaAmbNens([nivell1, mesCurta])?.id).toBe('curta');
		// Empat total: la que surt abans (la normal)
		const a = ambDificultat({ ...facil }, 'a');
		const b = ambDificultat({ ...facil }, 'b');
		expect(rutaAmbNens([a, b])?.id).toBe('a');
		expect(rutaAmbNens([b, a])?.id).toBe('b');
	});

	it('a igual nivell i km-esforç, desempata el temps', () => {
		const lenta = ambDificultat({ ...facil, tempsMinuts: 100 }, 'lenta');
		const rapida = ambDificultat({ ...facil, tempsMinuts: 60 }, 'rapida');
		expect(rutaAmbNens([lenta, rapida])?.id).toBe('rapida');
	});

	it('FILTRES_LLISTATS_DIFICULTAT: fàcils mira la normal; amb nens, qualsevol ruta', () => {
		const exigent = ambDificultat({ ...facil, tecnicitat: 'grimpada' });
		const bona = ambDificultat(facil);
		expect(FILTRES_LLISTATS_DIFICULTAT['cims-facils']([bona, exigent])).toBe(true);
		expect(FILTRES_LLISTATS_DIFICULTAT['cims-facils']([exigent, bona])).toBe(false);
		expect(FILTRES_LLISTATS_DIFICULTAT['cims-amb-nens']([exigent, bona])).toBe(true);
		expect(FILTRES_LLISTATS_DIFICULTAT['cims-amb-nens']([exigent])).toBe(false);
		expect(FILTRES_LLISTATS_DIFICULTAT['cims-facils']([])).toBe(false);
		expect(FILTRES_LLISTATS_DIFICULTAT['cims-amb-nens']([])).toBe(false);
	});
});
