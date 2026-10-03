import { describe, expect, it } from 'vitest';
import { CIMS, SLUGS_CIMS } from '$lib/data/catalog';
import { fitxaIndexable } from '$lib/seo/indexabilitat';
import {
	comptarParaules,
	contingutFitxa,
	fitxersContingutFitxa,
	paraulesFitxa,
	totsElsContingutsFitxa,
	validarContingutFitxa,
	type ContingutFitxa
} from './index';
import { MIN_PARAULES_FITXA } from './validacio';

/** Paràgraf de `n` paraules. */
const paraules = (n: number, p = 'mot') => Array.from({ length: n }, () => p).join(' ');

/** Fitxa mínima vàlida (Pedraforca), sobre la qual cada test trenca una cosa. */
function fitxaBase(): ContingutFitxa {
	return {
		slug: 'pedraforca-pollego-superior',
		descripcio: {
			ca: [
				paraules(200),
				`Vegeu el [mapa](/mapa) i la [comarca](/comarques/bergueda). ${paraules(150)}`
			],
			es: [paraules(200), `Ved el [mapa](/mapa). ${paraules(150)}`]
		},
		rutes: [
			{
				id: 'gosol',
				nom: { ca: 'Des de Gósol', es: 'Desde Gósol' },
				sortida: { nom: 'Gósol', lat: 42.236, lon: 1.66 },
				desnivellPositiuM: 1080,
				distanciaKm: 5.5,
				tempsMinuts: 180,
				mide: { medi: 2, itinerari: 2, desplacament: 3, esforc: 3 },
				descripcio: { ca: paraules(40), es: paraules(40) },
				fonts: [{ nom: 'Font', url: 'https://example.org/ruta', consultat: '2026-10-03' }]
			}
		],
		consells: { ca: [paraules(10)], es: [paraules(10)] },
		faq: {
			ca: [{ pregunta: 'Quant es triga?', resposta: paraules(5) }],
			es: [{ pregunta: '¿Cuánto se tarda?', resposta: paraules(5) }]
		},
		wikiloc: [
			{
				id: 1234567,
				titol: 'Pedraforca des de Gósol',
				url: 'https://ca.wikiloc.com/rutes-senderisme/pedraforca-des-de-gosol-1234567'
			}
		],
		fonts: [{ nom: 'ICGC', url: 'https://www.icgc.cat/' }],
		estat: 'esborrany',
		actualitzat: '2026-10-03'
	};
}

const valida = (f: ContingutFitxa) => validarContingutFitxa(f, CIMS);

describe('totes les fitxes de contingut', () => {
	it('cada fitxer {slug}.ts exporta un contingut amb el mateix slug', () => {
		const fitxers = fitxersContingutFitxa();
		expect(fitxers.length).toBe(totsElsContingutsFitxa().length);
		for (const { fitxer, slug } of fitxers) expect(slug, fitxer).toBe(fitxer);
	});

	it.each(totsElsContingutsFitxa().map((c) => [c.slug, c] as const))(
		'%s és vàlida (validarContingutFitxa)',
		(_slug, c) => {
			expect(validarContingutFitxa(c, CIMS)).toEqual([]);
		}
	);

	it('contingutFitxa: per slug; undefined si el cim no en té', () => {
		for (const c of totsElsContingutsFitxa()) expect(contingutFitxa(c.slug)).toBe(c);
		expect(contingutFitxa('no-existeix')).toBeUndefined();
		expect(SLUGS_CIMS.length).toBeGreaterThan(0);
	});

	it('cap fitxa és indexable mentre el catàleg no la marqui revisada', () => {
		expect(CIMS.length).toBeGreaterThan(0);
		for (const c of totsElsContingutsFitxa()) {
			const cim = CIMS.find((x) => x.slug === c.slug)!;
			expect(fitxaIndexable(cim.estat_revisio, c.estat)).toBe(
				cim.estat_revisio === 'revisat' && c.estat === 'revisat'
			);
		}
	});
});

describe('paraulesFitxa', () => {
	it('compta descripció, rutes, consells i FAQ sense marques ni destins', () => {
		expect(comptarParaules('Puja per la [canal del Verdet](/cims/x) i **compte**!')).toBe(8);
		expect(comptarParaules('  — 2.506 m  ')).toBe(2);
		const f = fitxaBase();
		// ca: 200 + (6 + 150) del text amb enllaços + ruta (3 + 40) + consells 10 + FAQ (3 + 5)
		expect(paraulesFitxa(f, 'ca')).toBe(200 + 6 + 150 + 3 + 40 + 10 + 3 + 5);
		expect(paraulesFitxa(f, 'es')).toBeGreaterThanOrEqual(MIN_PARAULES_FITXA);
	});
});

describe('validarContingutFitxa', () => {
	it('la fitxa base és vàlida', () => {
		expect(valida(fitxaBase())).toEqual([]);
	});

	const casos: [string, (f: ContingutFitxa) => void, RegExp][] = [
		['slug inexistent', (f) => (f.slug = 'cim-inventat'), /slug inexistent/],
		['estat no vàlid', (f) => (f.estat = 'publicat' as never), /estat no vàlid/],
		['actualitzat mal format', (f) => (f.actualitzat = '2026-13-01'), /actualitzat/],
		['menys de 400 paraules', (f) => (f.descripcio.es = [paraules(50)]), /es: \d+ paraules/],
		[
			'ca/es no simètrics (descripció)',
			(f) => f.descripcio.es.push(paraules(10)),
			/descripcio: ca té 2 elements i es 3/
		],
		['nom de ruta sense es', (f) => (f.rutes[0].nom.es = ''), /rutes\[0\]\.nom\.es buit/],
		['consells asimètrics', (f) => (f.consells!.es = []), /consells: ca té 1/],
		['ruta amb dades sense fonts', (f) => (f.rutes[0].fonts = []), /fonts: obligatòries/],
		[
			'MIDE fora de 1..5',
			(f) => (f.rutes[0].mide = { medi: 6, itinerari: 2, desplacament: 0, esforc: 3 } as never),
			/mide\.medi.*\n?|mide\.desplacament/
		],
		[
			'coordenades fora del territori',
			(f) => (f.rutes[0].sortida = { nom: 'X', lat: 1.66, lon: 42.236 }),
			/fora del territori/
		],
		[
			'sortida massa lluny del cim',
			(f) => (f.rutes[0].sortida = { nom: 'Barcelona', lat: 41.39, lon: 2.17 }),
			/km del cim/
		],
		['només lat', (f) => (f.rutes[0].sortida = { nom: 'X', lat: 42.2 }), /lat i lon alhora/],
		[
			'enllaç intern inexistent',
			(f) => (f.descripcio.ca[1] += ' [x](/cims/no-existeix)'),
			/enllaç intern inexistent \/cims\/no-existeix/
		],
		[
			'enllaç http',
			(f) => (f.faq!.ca[0].resposta += ' [x](http://example.org)'),
			/enllaç no vàlid/
		],
		['ids de ruta repetits', (f) => f.rutes.push({ ...f.rutes[0] }), /id repetit: gosol/],
		['id de ruta no vàlid', (f) => (f.rutes[0].id = 'Gósol 1'), /id no vàlid/],
		['wikiloc id no numèric', (f) => (f.wikiloc![0].id = 12.5), /id no numèric/],
		[
			'wikiloc URL d’un altre domini',
			(f) => (f.wikiloc![0].url = 'https://wikiloc.example.com/x-1234567'),
			/no és de https:\/\/…wikiloc\.com/
		],
		[
			'wikiloc URL que no acaba amb l’id',
			(f) => (f.wikiloc![0].url = 'https://www.wikiloc.com/hiking-trails/pedraforca-7654321'),
			/no acaba amb l'id/
		],
		[
			'massa rutes de Wikiloc',
			(f) =>
				(f.wikiloc = [1, 2, 3, 4].map((id) => ({
					id,
					titol: 't',
					url: `https://www.wikiloc.com/hiking-trails/x-${id}`
				}))),
			/màxim 3 rutes/
		],
		['font sense https', (f) => (f.fonts = [{ nom: 'X', url: 'http://x.org' }]), /no és https/],
		['sense fonts generals', (f) => (f.fonts = []), /fonts generals buides/],
		['sense rutes', (f) => (f.rutes = []), /cal almenys una ruta/],
		['temps no enter', (f) => (f.rutes[0].tempsMinuts = 90.5), /tempsMinuts/],
		['desnivell absurd', (f) => (f.rutes[0].desnivellPositiuM = 12000), /desnivellPositiuM/]
	];

	it.each(casos)('%s → error', (_nom, trenca, patro) => {
		const f = fitxaBase();
		trenca(f);
		const errors = valida(f);
		expect(errors.join('\n')).toMatch(patro);
	});

	it('una ruta sense cap dada numèrica pot no tenir fonts', () => {
		const f = fitxaBase();
		f.rutes[0] = {
			...f.rutes[0],
			sortida: { nom: 'Gósol' },
			desnivellPositiuM: undefined,
			distanciaKm: undefined,
			tempsMinuts: undefined,
			mide: undefined,
			fonts: []
		};
		expect(valida(f)).toEqual([]);
	});
});

describe('fitxaIndexable (catàleg i contingut revisats)', () => {
	it('només amb tots dos estats a revisat', () => {
		expect(fitxaIndexable('revisat', 'revisat')).toBe(true);
		expect(fitxaIndexable('revisat', 'verificat')).toBe(false);
		expect(fitxaIndexable('revisat', undefined)).toBe(false);
		expect(fitxaIndexable('esborrany', 'revisat')).toBe(false);
	});
});
