import { describe, expect, it } from 'vitest';
import {
	MAX_RESULTATS_MUNICIPIS,
	cercarMunicipis,
	desempaquetarMunicipis,
	esCodiMunicipi,
	municipiPerCodi,
	senseArticleInicial,
	type DadesMunicipis,
	type Municipi
} from './index';

const DADES: DadesMunicipis = {
	font: 'prova',
	comarques: [
		['baix-llobregat', 'Baix Llobregat', 'catalunya'],
		['alta-ribagorca', 'Alta Ribagorça', 'catalunya'],
		['osona', 'Osona', 'catalunya'],
		['andorra', 'Andorra', 'andorra'],
		['catalunya-nord', 'Catalunya Nord', 'catalunya-nord']
	],
	municipis: [
		['081017', "l'Hospitalet de Llobregat", 0, 41.3597, 2.0997],
		['250432', 'la Vall de Boí', 1, 42.5054, 0.8011, 'Barruera'],
		['082981', 'Vic', 2, 41.9305, 2.2543],
		['082837', 'Vilanova de Sau', 2, 41.9473, 2.3842],
		['083036', 'Viladrau', 2, 41.8479, 2.39],
		['082787', 'Tavèrnoles', 2, 41.9529, 2.3261],
		['081712', 'Prats de Lluçanès', 2, 42.009, 2.0296],
		['080789', "l'Esquirol", 2, 42.0346, 2.3696, 'Santa Maria de Corcó'],
		['ad:la-massana', 'la Massana', 3, 42.5451, 1.4949],
		['ad:escaldes-engordany', 'Escaldes-Engordany', 3, 42.5061, 1.5452, 'les Escaldes'],
		['cn:prats-de-mollo', 'Prats de Molló', 4, 42.4036, 2.4823]
	]
};
const MUNICIPIS = desempaquetarMunicipis(DADES);
const noms = (r: Municipi[]) => r.map((m) => m.nom);

describe('desempaquetarMunicipis', () => {
	it('converteix les tuples en municipis amb comarca, zona i cap', () => {
		expect(MUNICIPIS).toHaveLength(11);
		expect(MUNICIPIS[1]).toEqual({
			codi: '250432',
			nom: 'la Vall de Boí',
			comarca: 'Alta Ribagorça',
			comarcaSlug: 'alta-ribagorca',
			zona: 'catalunya',
			lat: 42.5054,
			lon: 0.8011,
			cap: 'Barruera'
		});
		expect(MUNICIPIS[0].cap).toBeNull();
		expect(MUNICIPIS[8]).toMatchObject({ comarca: 'Andorra', zona: 'andorra' });
		expect(MUNICIPIS[10]).toMatchObject({ comarca: 'Catalunya Nord', zona: 'catalunya-nord' });
	});

	it('rebutja una comarca inexistent o una zona desconeguda', () => {
		expect(() =>
			desempaquetarMunicipis({ ...DADES, municipis: [['000000', 'X', 99, 41, 2]] })
		).toThrow(RangeError);
		expect(() =>
			desempaquetarMunicipis({
				...DADES,
				comarques: [['x', 'X', 'mart']],
				municipis: [['000000', 'X', 0, 41, 2]]
			})
		).toThrow(RangeError);
	});
});

describe('esCodiMunicipi', () => {
	it('accepta codis ICGC de 6 xifres i els prefixos ad: i cn:', () => {
		for (const codi of ['080193', '250432', 'ad:ordino', 'cn:la-guingueta-d-ix', 'cn:tuir']) {
			expect(esCodiMunicipi(codi)).toBe(true);
		}
	});

	it('rebutja la resta', () => {
		for (const codi of [
			'',
			'8019',
			'0801930',
			'08019a',
			'Barcelona',
			'ad:',
			'ad:Ordino',
			'cn:-prada',
			'cn:prada-',
			'fr:perpinya',
			'cn:' + 'a'.repeat(40),
			' 080193',
			80193,
			null,
			undefined
		]) {
			expect(esCodiMunicipi(codi)).toBe(false);
		}
	});
});

describe('municipiPerCodi', () => {
	it('troba el municipi o retorna null', () => {
		expect(municipiPerCodi(MUNICIPIS, '082981')?.nom).toBe('Vic');
		expect(municipiPerCodi(MUNICIPIS, '999999')).toBeNull();
		expect(municipiPerCodi(MUNICIPIS, null)).toBeNull();
		expect(municipiPerCodi(MUNICIPIS, '')).toBeNull();
	});
});

describe('senseArticleInicial', () => {
	it('treu l’article del principi i res més', () => {
		expect(senseArticleInicial("l'Hospitalet de Llobregat")).toBe('Hospitalet de Llobregat');
		expect(senseArticleInicial('l’Esquirol')).toBe('Esquirol');
		expect(senseArticleInicial('la Vall de Boí')).toBe('Vall de Boí');
		expect(senseArticleInicial('els Angles')).toBe('Angles');
		expect(senseArticleInicial('Es Bòrdes')).toBe('Bòrdes');
		expect(senseArticleInicial('Lladó')).toBe('Lladó');
		expect(senseArticleInicial('Espot')).toBe('Espot');
		expect(senseArticleInicial('Elna')).toBe('Elna');
	});
});

describe('cercarMunicipis', () => {
	it('sense accents, majúscules ni apòstrofs; l’article no cal', () => {
		expect(noms(cercarMunicipis('hospitalet', MUNICIPIS))).toEqual(["l'Hospitalet de Llobregat"]);
		expect(noms(cercarMunicipis("L'HOSPITALET", MUNICIPIS))).toEqual(["l'Hospitalet de Llobregat"]);
		expect(noms(cercarMunicipis('lhospitalet', MUNICIPIS))).toEqual(["l'Hospitalet de Llobregat"]);
		expect(noms(cercarMunicipis('vall de boi', MUNICIPIS))).toEqual(['la Vall de Boí']);
		expect(noms(cercarMunicipis('tavernoles', MUNICIPIS))).toEqual(['Tavèrnoles']);
		expect(noms(cercarMunicipis('llucanes', MUNICIPIS))).toEqual(['Prats de Lluçanès']);
		expect(noms(cercarMunicipis('escaldes engordany', MUNICIPIS))).toEqual(['Escaldes-Engordany']);
	});

	it('ordre: exacte, comença per, començament de paraula, a dins, només pel cap', () => {
		expect(noms(cercarMunicipis('vi', MUNICIPIS))).toEqual(['Vic', 'Viladrau', 'Vilanova de Sau']);
		expect(noms(cercarMunicipis('vic', MUNICIPIS))).toEqual(['Vic']);
		// "prats": dos que comencen igual, alfabètic.
		expect(noms(cercarMunicipis('prats', MUNICIPIS))).toEqual([
			'Prats de Lluçanès',
			'Prats de Molló'
		]);
		// "sa": comença de paraula (Sau) abans que a dins (Massana) i que el cap (Santa Maria…).
		expect(noms(cercarMunicipis('sa', MUNICIPIS))).toEqual([
			'Vilanova de Sau',
			'la Massana',
			"l'Esquirol"
		]);
	});

	it('també troba pel nom del cap de municipi', () => {
		expect(noms(cercarMunicipis('barruera', MUNICIPIS))).toEqual(['la Vall de Boí']);
		expect(noms(cercarMunicipis('santa maria de corco', MUNICIPIS))).toEqual(["l'Esquirol"]);
		expect(noms(cercarMunicipis('escaldes', MUNICIPIS))).toEqual(['Escaldes-Engordany']);
	});

	it('totes les paraules hi han de ser (en qualsevol ordre)', () => {
		expect(noms(cercarMunicipis('sau vilanova', MUNICIPIS))).toEqual(['Vilanova de Sau']);
		expect(cercarMunicipis('vilanova de mar', MUNICIPIS)).toEqual([]);
	});

	it('consulta buida o sense lletres → []; `limit` retalla', () => {
		expect(cercarMunicipis('', MUNICIPIS)).toEqual([]);
		expect(cercarMunicipis('  -- ', MUNICIPIS)).toEqual([]);
		expect(cercarMunicipis('a', MUNICIPIS, { limit: 2 })).toHaveLength(2);
		expect(cercarMunicipis('a', MUNICIPIS, { limit: 0 })).toEqual([]);
		expect(MAX_RESULTATS_MUNICIPIS).toBe(20);
	});

	it('no modifica la llista rebuda i és determinista', () => {
		const copia = [...MUNICIPIS];
		const a = cercarMunicipis('a', MUNICIPIS);
		const b = cercarMunicipis('a', [...MUNICIPIS].reverse());
		expect(MUNICIPIS).toEqual(copia);
		expect(noms(b)).toEqual(noms(a));
	});
});
